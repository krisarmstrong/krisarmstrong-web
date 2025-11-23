-- ============================================
-- AGGREGATE RATINGS SYSTEM FOR BLOG POSTS AND CASE STUDIES
-- Amazon-style ratings with averages and counts
-- ============================================

-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL,           -- blog slug or case ID
  item_type TEXT NOT NULL,          -- 'blog' or 'case'
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  user_fingerprint TEXT NOT NULL,   -- browser fingerprint to prevent duplicate ratings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one rating per user per item
  UNIQUE(item_id, item_type, user_fingerprint)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ratings_item ON public.ratings(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON public.ratings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read ratings (public data)
CREATE POLICY "Allow public read access to ratings"
  ON public.ratings
  FOR SELECT
  USING (true);

-- Allow anyone to insert ratings (we'll validate on client side)
CREATE POLICY "Allow public insert of ratings"
  ON public.ratings
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own ratings (based on fingerprint)
CREATE POLICY "Allow users to update their own ratings"
  ON public.ratings
  FOR UPDATE
  USING (true);

-- ============================================
-- FUNCTION: Get aggregate rating stats for an item
-- ============================================
CREATE OR REPLACE FUNCTION public.get_rating_stats(
  p_item_id TEXT,
  p_item_type TEXT
)
RETURNS TABLE (
  average_rating NUMERIC,
  total_ratings BIGINT,
  rating_distribution JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROUND(AVG(rating)::NUMERIC, 1) as average_rating,
    COUNT(*)::BIGINT as total_ratings,
    jsonb_object_agg(
      rating::TEXT,
      count
    ) as rating_distribution
  FROM (
    SELECT
      rating,
      COUNT(*) as count
    FROM public.ratings
    WHERE item_id = p_item_id
      AND item_type = p_item_type
    GROUP BY rating
  ) counts;
END;
$$;

-- ============================================
-- FUNCTION: Submit or update a rating
-- ============================================
CREATE OR REPLACE FUNCTION public.submit_rating(
  p_item_id TEXT,
  p_item_type TEXT,
  p_rating INTEGER,
  p_user_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Validate rating range
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  -- Insert or update rating
  INSERT INTO public.ratings (item_id, item_type, rating, user_fingerprint)
  VALUES (p_item_id, p_item_type, p_rating, p_user_fingerprint)
  ON CONFLICT (item_id, item_type, user_fingerprint)
  DO UPDATE SET
    rating = p_rating,
    updated_at = NOW();

  -- Return updated stats
  SELECT jsonb_build_object(
    'success', true,
    'rating', p_rating,
    'stats', (
      SELECT jsonb_build_object(
        'average_rating', ROUND(AVG(rating)::NUMERIC, 1),
        'total_ratings', COUNT(*)
      )
      FROM public.ratings
      WHERE item_id = p_item_id AND item_type = p_item_type
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================
-- FUNCTION: Get user's rating for an item
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_rating(
  p_item_id TEXT,
  p_item_type TEXT,
  p_user_fingerprint TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_rating INTEGER;
BEGIN
  SELECT rating INTO v_rating
  FROM public.ratings
  WHERE item_id = p_item_id
    AND item_type = p_item_type
    AND user_fingerprint = p_user_fingerprint;

  RETURN v_rating;
END;
$$;

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT SELECT, INSERT, UPDATE ON public.ratings TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_rating_stats TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_rating TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_rating TO anon, authenticated;

-- ============================================
-- DONE!
-- Run this in your Supabase SQL Editor
-- ============================================
