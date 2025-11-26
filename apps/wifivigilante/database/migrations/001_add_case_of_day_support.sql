-- Migration: Add Case of the Day Support
-- This adds infrastructure for deterministic daily case selection and LinkedIn integration

-- 1. Add featured_date column to track when a case was featured
ALTER TABLE public.case_files
ADD COLUMN IF NOT EXISTS featured_date date;

-- 2. Create index for faster featured_date lookups
CREATE INDEX IF NOT EXISTS idx_case_files_featured_date ON public.case_files(featured_date);

-- 3. Create awareness_calendar table for sector prioritization
CREATE TABLE IF NOT EXISTS public.awareness_calendar (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    month integer NOT NULL CHECK (month >= 1 AND month <= 12),
    name character varying(100) NOT NULL,
    description text,
    priority_sector_ids integer[] NOT NULL DEFAULT '{}',
    created_at timestamp without time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.awareness_calendar ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read access to awareness_calendar"
ON public.awareness_calendar FOR SELECT TO public USING (true);

-- 4. Insert awareness month data
INSERT INTO public.awareness_calendar (month, name, description, priority_sector_ids) VALUES
(2, 'Healthcare Awareness Month', 'Focus on healthcare sector cybersecurity', ARRAY[1]),
(3, 'Fraud Prevention Month', 'Focus on retail and financial security', ARRAY[5]),
(5, 'Infrastructure Security Month', 'Focus on critical infrastructure', ARRAY[2, 3]),
(9, 'National Preparedness Month', 'Focus on government and emergency readiness', ARRAY[3]),
(10, 'Cybersecurity Awareness Month', 'All sectors - general cybersecurity focus', ARRAY[1, 2, 3, 4, 5]),
(11, 'Critical Infrastructure Month', 'Focus on manufacturing and government', ARRAY[2, 3])
ON CONFLICT DO NOTHING;

-- 5. Create daily_case_selection table to track featured cases
CREATE TABLE IF NOT EXISTS public.daily_case_selections (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    selection_date date NOT NULL UNIQUE,
    case_id integer NOT NULL REFERENCES public.case_files(id),
    sector_id integer NOT NULL REFERENCES public.sectors(id),
    awareness_month_id integer REFERENCES public.awareness_calendar(id),
    created_at timestamp without time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_case_selections ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read access to daily_case_selections"
ON public.daily_case_selections FOR SELECT TO public USING (true);

-- Allow authenticated write
CREATE POLICY "Allow authenticated insert on daily_case_selections"
ON public.daily_case_selections FOR INSERT TO authenticated WITH CHECK (true);

-- Index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_daily_case_selections_date ON public.daily_case_selections(selection_date);

-- 6. Create function to get today's case deterministically
CREATE OR REPLACE FUNCTION get_case_of_the_day(target_date date DEFAULT CURRENT_DATE)
RETURNS TABLE (
    case_id integer,
    public_id uuid,
    title character varying,
    sector_id integer,
    sector_name character varying,
    tool character varying,
    summary text,
    tags character varying,
    awareness_month character varying
) AS $$
DECLARE
    v_month integer := EXTRACT(MONTH FROM target_date);
    v_priority_sectors integer[];
    v_total_cases integer;
    v_day_of_year integer := EXTRACT(DOY FROM target_date);
    v_year integer := EXTRACT(YEAR FROM target_date);
    v_seed integer;
    v_selected_case_id integer;
    v_awareness_name varchar;
BEGIN
    -- Check if we already have a selection for this date
    SELECT dcs.case_id INTO v_selected_case_id
    FROM daily_case_selections dcs
    WHERE dcs.selection_date = target_date;

    IF v_selected_case_id IS NOT NULL THEN
        -- Return the pre-selected case
        RETURN QUERY
        SELECT
            cf.id,
            cf.public_id,
            cf.title,
            cf.sector_id,
            s.name,
            cf.tool,
            cf.summary,
            cf.tags,
            ac.name
        FROM case_files cf
        JOIN sectors s ON cf.sector_id = s.id
        LEFT JOIN daily_case_selections dcs ON dcs.case_id = cf.id AND dcs.selection_date = target_date
        LEFT JOIN awareness_calendar ac ON ac.id = dcs.awareness_month_id
        WHERE cf.id = v_selected_case_id;
        RETURN;
    END IF;

    -- Get priority sectors for this month
    SELECT ac.priority_sector_ids, ac.name INTO v_priority_sectors, v_awareness_name
    FROM awareness_calendar ac
    WHERE ac.month = v_month;

    -- Generate deterministic seed from date
    v_seed := v_year * 1000 + v_day_of_year;

    -- Select case based on seed
    IF v_priority_sectors IS NOT NULL AND array_length(v_priority_sectors, 1) > 0 THEN
        -- During awareness month, prioritize relevant sectors (70% chance)
        IF (v_seed % 10) < 7 THEN
            SELECT cf.id INTO v_selected_case_id
            FROM case_files cf
            WHERE cf.sector_id = ANY(v_priority_sectors)
            AND (cf.featured_date IS NULL OR cf.featured_date < target_date - INTERVAL '30 days')
            ORDER BY (cf.id * v_seed) % 10000
            LIMIT 1;
        END IF;
    END IF;

    -- Fallback: select from all cases
    IF v_selected_case_id IS NULL THEN
        SELECT cf.id INTO v_selected_case_id
        FROM case_files cf
        WHERE cf.featured_date IS NULL OR cf.featured_date < target_date - INTERVAL '30 days'
        ORDER BY (cf.id * v_seed) % 10000
        LIMIT 1;
    END IF;

    -- Final fallback: any case if all have been featured recently
    IF v_selected_case_id IS NULL THEN
        SELECT cf.id INTO v_selected_case_id
        FROM case_files cf
        ORDER BY cf.featured_date NULLS FIRST, (cf.id * v_seed) % 10000
        LIMIT 1;
    END IF;

    -- Return the selected case
    RETURN QUERY
    SELECT
        cf.id,
        cf.public_id,
        cf.title,
        cf.sector_id,
        s.name,
        cf.tool,
        cf.summary,
        cf.tags,
        v_awareness_name
    FROM case_files cf
    JOIN sectors s ON cf.sector_id = s.id
    WHERE cf.id = v_selected_case_id;
END;
$$ LANGUAGE plpgsql;
