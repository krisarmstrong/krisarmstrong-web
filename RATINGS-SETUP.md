# Aggregate Ratings System Setup

## Overview

This project now includes an Amazon-style aggregate rating system for blog posts and case studies. Users can rate content, and ratings are displayed with averages and total counts.

**Features:**

- ★★★★☆ 4.3 from 127 ratings (like Amazon/Best Buy)
- Aggregate ratings stored in Supabase
- Browser fingerprinting prevents duplicate ratings from same user
- Real-time updates when users submit ratings
- Separate ratings for blog posts and case studies

## Database Setup

### 1. Run the SQL Migration

Open your Supabase project's SQL Editor and run the migration file:

```bash
# Location
./supabase-ratings-migration.sql
```

This migration creates:

- `ratings` table with proper indexes
- Row Level Security (RLS) policies
- Database functions for ratings operations
- Triggers for timestamp management

### 2. Verify Table Creation

After running the migration, verify the following were created:

**Table:**

- `public.ratings`

**Functions:**

- `get_rating_stats(p_item_id, p_item_type)`
- `submit_rating(p_item_id, p_item_type, p_rating, p_user_fingerprint)`
- `get_user_rating(p_item_id, p_item_type, p_user_fingerprint)`

**RLS Policies:**

- Allow public read access to ratings
- Allow public insert of ratings
- Allow users to update their own ratings

### 3. Test the Setup

You can test the database functions in Supabase SQL Editor:

```sql
-- Test submitting a rating
SELECT submit_rating(
  'test-blog-post',
  'blog',
  5,
  'test-fingerprint-123'
);

-- Test getting rating stats
SELECT * FROM get_rating_stats('test-blog-post', 'blog');

-- Test getting user rating
SELECT get_user_rating(
  'test-blog-post',
  'blog',
  'test-fingerprint-123'
);
```

## Application Setup

### Environment Variables

Both sites already have Supabase configured. Verify these environment variables exist:

**krisarmstrong (.env):**

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**wifivigilante (.env):**

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Code Changes Summary

#### New Files Created:

1. **`supabase-ratings-migration.sql`** - Database schema and functions
2. **`packages/web-foundation/src/components/AggregateRating.tsx`** - Reusable rating component
3. **`apps/wifivigilante/src/utils/ratings.ts`** - WiFi Vigilante rating API functions

#### Updated Files:

1. **`apps/krisarmstrong/src/lib/supabase.ts`** - Added rating functions
2. **`apps/krisarmstrong/src/pages/BlogPost.tsx`** - Replaced StarRating with AggregateRating
3. **`apps/wifivigilante/src/components/CaseDisplay.tsx`** - Replaced StarRating with AggregateRating
4. **`packages/web-foundation/src/index.ts`** - Exported AggregateRating component

### Build and Run

```bash
# 1. Rebuild web-foundation package
cd packages/web-foundation
npm run build

# 2. Clear Vite caches
cd ../../
rm -rf apps/krisarmstrong/node_modules/.vite
rm -rf apps/wifivigilante/node_modules/.vite

# 3. Start all sites
npm run dev --workspace=krisarmstrong-org
npm run dev --workspace=wifivigilante-com
```

## How It Works

### User Identification

The system uses browser fingerprinting to identify users without requiring authentication:

- Canvas fingerprinting
- User agent
- Screen resolution
- Language
- Timezone offset

This creates a unique ID stored in localStorage to prevent duplicate ratings.

### Rating Flow

1. **User visits blog post or case study**
   - Component fetches aggregate stats from Supabase
   - Component fetches user's previous rating (if any)

2. **User clicks stars to rate**
   - Rating submitted to Supabase via `submit_rating()` function
   - Database updates or inserts rating with user fingerprint
   - New aggregate stats calculated and returned
   - UI updates immediately with new average and count

3. **Display**
   - Shows aggregate: ★★★★☆ 4.3 (127 ratings)
   - Shows user's rating: "You rated this 5 stars"
   - Allows user to update rating by clicking different star

### Data Model

```typescript
interface RatingStats {
  average_rating: number; // e.g., 4.3
  total_ratings: number; // e.g., 127
}
```

## Usage Examples

### In Blog Posts (krisarmstrong)

```tsx
import { AggregateRating, type RatingAPI } from '@krisarmstrong/web-foundation';
import { getRatingStats, submitRating, getUserRating } from '../lib/supabase';

<AggregateRating
  itemId={post.slug}
  itemType="blog"
  ratingAPI={{
    getRatingStats,
    submitRating,
    getUserRating,
  }}
  starColor="violet-400"
  size="md"
  onRate={(rating, stats) => {
    console.log(`New average: ${stats.average_rating} from ${stats.total_ratings} ratings`);
  }}
/>;
```

### In Case Studies (wifivigilante)

```tsx
import { AggregateRating, type RatingAPI } from '@krisarmstrong/web-foundation';
import { getRatingStats, submitRating, getUserRating } from '../utils/ratings';

<AggregateRating
  itemId={caseData.publicId}
  itemType="case"
  ratingAPI={{
    getRatingStats,
    submitRating,
    getUserRating,
  }}
  size="md"
  onRate={(rating, stats) => {
    console.log(`Rated: ${rating} stars. New average: ${stats.average_rating}`);
  }}
/>;
```

## Component Props

### AggregateRating

| Prop        | Type                 | Description                               |
| ----------- | -------------------- | ----------------------------------------- |
| `itemId`    | string               | Unique identifier (blog slug or case ID)  |
| `itemType`  | 'blog' \| 'case'     | Type of content being rated               |
| `ratingAPI` | RatingAPI            | Object containing rating functions        |
| `starColor` | string               | Tailwind color class (e.g., "violet-400") |
| `size`      | 'sm' \| 'md' \| 'lg' | Size of stars and text                    |
| `onRate`    | function             | Callback when user rates (optional)       |

## Troubleshooting

### Ratings not appearing?

1. **Check database migration:**

   ```sql
   SELECT * FROM pg_tables WHERE tablename = 'ratings';
   ```

2. **Check RLS policies:**

   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'ratings';
   ```

3. **Check browser console** for errors

4. **Verify Supabase credentials** in .env files

### Can't submit ratings?

1. Check browser console for errors
2. Verify RLS policies allow inserts
3. Test database functions in SQL Editor
4. Check network tab for Supabase API calls

### Ratings not updating?

1. Clear browser localStorage
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Check if fingerprint is being generated correctly

## Security Notes

- RLS policies ensure data integrity
- Rating values constrained to 1-5
- User fingerprints prevent spam
- No authentication required (anonymous ratings)
- All functions use prepared statements (SQL injection safe)

## Future Enhancements

Possible improvements:

- Add rating distribution chart (5★: 67%, 4★: 20%, etc.)
- Add temporal decay for older ratings
- Add moderation for spam ratings
- Add report/flag functionality
- Export ratings data for analysis

---

**Questions?** Check Supabase logs or contact the development team.

### Verification Script

We also include a small helper script that exercises the rating RPCs so you can confirm the Supabase functions are wired correctly before you touch the UI.

```
node scripts/check-rating-api.js
```

It loads `apps/wifivigilante/.env`, so make sure the Supabase URL/anon key are present there (the same project powers all the apps). The script submits a rating, fetches stats, and reads the `ratings` rows for a known fingerprint.
