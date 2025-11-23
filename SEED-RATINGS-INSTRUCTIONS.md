# Seed Ratings Instructions

## Prerequisites

1. ✅ Run SQL migration in both Supabase projects
2. ✅ Have tsx installed (or install it: `npm install -D tsx`)

## How to Seed Ratings

### For krisarmstrong (Blog Posts)

1. **Get your Supabase credentials:**
   - Go to krisarmstrong Supabase project
   - Settings → API → Copy URL and anon key

2. **Set environment variables:**
   ```bash
   export VITE_SUPABASE_URL="https://your-krisarmstrong-project.supabase.co"
   export VITE_SUPABASE_ANON_KEY="your-krisarmstrong-anon-key"
   ```

3. **Run the seed script:**
   ```bash
   npx tsx seed-ratings.ts krisarmstrong
   ```

### For wifivigilante (Case Studies)

1. **Get your Supabase credentials:**
   - Go to wifivigilante Supabase project
   - Settings → API → Copy URL and anon key

2. **Set environment variables:**
   ```bash
   export VITE_SUPABASE_URL="https://your-wifivigilante-project.supabase.co"
   export VITE_SUPABASE_ANON_KEY="your-wifivigilante-anon-key"
   ```

3. **Run the seed script:**
   ```bash
   npx tsx seed-ratings.ts wifivigilante
   ```

## What It Does

- Fetches all published blog posts or case studies
- Creates **15 random ratings** per item (3-5 stars)
- Each rating has a unique test fingerprint
- Displays the aggregate stats for each item as it seeds

## Expected Output

```
🚀 Ratings Seed Script

📍 Site: krisarmstrong
📊 Ratings per item: 15
⭐ Rating range: 3-5 stars

🌱 Seeding ratings for krisarmstrong blog posts...

📝 Found 8 blog posts

📊 Seeding ratings for: "Wi-Fi 6E: The Future of Wireless"
   ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐
   ✅ Average: 4.3 stars from 15 ratings

📊 Seeding ratings for: "Network Security Best Practices"
   ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐
   ✅ Average: 4.5 stars from 15 ratings

...

✅ Successfully seeded 120 ratings for 8 blog posts!
```

## Customize

Edit `seed-ratings.ts` to change:
- `RATINGS_PER_ITEM` - Number of ratings per item (default: 15)
- `MIN_RATING` - Minimum rating value (default: 3)
- `MAX_RATING` - Maximum rating value (default: 5)

## Troubleshooting

### Error: "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set"
- Make sure you exported the environment variables in your current shell
- Check that the values are correct (no extra quotes or spaces)

### Error fetching blog posts/case studies
- Verify the SQL migration ran successfully
- Check that your Supabase credentials are correct
- Make sure you have published content in your database

### Error submitting rating
- Verify the `submit_rating` function exists in Supabase
- Check RLS policies allow inserts
- Look at Supabase logs for more details

## Clean Up

To remove all test ratings:

```sql
-- In Supabase SQL Editor
DELETE FROM ratings WHERE user_fingerprint LIKE 'test-user-%';
```

## Next Steps

After seeding:
1. Visit your blog posts at http://localhost:3002/blog
2. Visit case studies at http://localhost:3000/cases
3. See the aggregate ratings display! ★★★★☆ 4.3 (15 ratings)
