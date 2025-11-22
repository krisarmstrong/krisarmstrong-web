# Supabase Restoration Guide

## Step-by-Step Instructions

### Step 1: Create New Supabase Project (5 minutes)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `wifi-vigilante` (or `wifi-vigilante-prod`)
   - **Database Password:** Use a strong password (save in password manager)
   - **Region:** Choose closest to your users (US East recommended)
   - **Pricing Plan:** Free
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to provision

### Step 2: Get Your Credentials (2 minutes)

1. In your new project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://[PROJECT-REF].supabase.co`
   - **anon public key:** Long JWT token starting with `eyJ...`
3. Keep this tab open - you'll need these soon

### Step 3: Restore Database Backup (10 minutes)

**Option A: Using Supabase Dashboard (Easier)**

1. Go to **Database** → **Backups**
2. Click **"Restore from file"** or **"Upload backup"**
3. Select your backup file: `db_cluster-24-06-2025@11-27-59.backup.gz`
4. Wait for restoration to complete

**Option B: Using psql CLI (Advanced)**

```bash
# Decompress backup
gunzip db_cluster-24-06-2025@11-27-59.backup.gz

# Get connection string from Supabase:
# Settings → Database → Connection String → URI
# Should look like: postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# Restore using pg_restore
pg_restore --verbose --clean --no-acl --no-owner \
  -h [PROJECT-REF].supabase.co \
  -U postgres \
  -d postgres \
  db_cluster-24-06-2025@11-27-59.backup

# Enter your database password when prompted
```

### Step 4: Verify Tables Created

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - ✅ `case_files`
   - ✅ `sectors`
   - ✅ `subsectors`
3. Click each table to verify data is there

### Step 5: Set Up Row Level Security (5 minutes)

Run these SQL commands in **SQL Editor**:

```sql
-- Enable RLS
ALTER TABLE case_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsectors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to case_files"
ON case_files FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to sectors"
ON sectors FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to subsectors"
ON subsectors FOR SELECT TO public USING (true);

-- Allow authenticated users to write
CREATE POLICY "Allow authenticated insert on case_files"
ON case_files FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on case_files"
ON case_files FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on case_files"
ON case_files FOR DELETE TO authenticated USING (true);
```

### Step 6: Update Environment Variables

Back in your local project, update `.env`:

```bash
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ[YOUR-ANON-KEY]
```

Replace with the values you copied in Step 2.

### Step 7: Test Locally

```bash
# Start dev server
npm run dev

# Visit http://localhost:3001
# Check if cases load on homepage
# Try navigating to /cases page
# Try search functionality
```

### Step 8: Set Up GitHub Secrets for Keep-Alive

1. Go to your GitHub repo: **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add these secrets:
   - Name: `SUPABASE_URL`
     Value: `https://[YOUR-PROJECT-REF].supabase.co`
   - Name: `SUPABASE_ANON_KEY`
     Value: `eyJ[YOUR-ANON-KEY]`
4. The keep-alive workflow will now run twice monthly automatically

### Step 9: Test Keep-Alive Workflow (Optional)

1. Go to **Actions** tab in GitHub
2. Click **"Keep Supabase Active"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait ~30 seconds, verify it succeeds ✅

---

## Troubleshooting

### "Error: relation 'case_files' does not exist"
- Backup didn't restore properly
- Try Option B (psql restore) instead
- Or manually create tables using SQL from `docs/SUPABASE_RLS_SETUP.md`

### "Error: Missing Supabase environment variables"
- Check `.env` file exists in project root
- Verify variable names start with `VITE_`
- Restart dev server after updating `.env`

### "403 Forbidden" or "Row Level Security" errors
- RLS policies not set up
- Re-run SQL commands from Step 5

### Keep-alive workflow fails
- Check GitHub Secrets are set correctly
- Verify Supabase URL and anon key are valid
- Check workflow logs for specific error

---

## Next Steps After Restoration

1. ✅ Verify all pages load correctly
2. ✅ Test search functionality
3. ✅ Test admin login (if applicable)
4. ✅ Deploy to production (Cloudflare Pages, Vercel, etc.)
5. ✅ Monitor GitHub Actions to ensure keep-alive runs

---

## Need Help?

If you encounter issues, check:
- Supabase logs: **Logs** → **Postgres Logs**
- Browser console for errors
- Network tab to see failed requests
