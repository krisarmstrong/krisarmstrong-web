# Database Import Instructions

Follow these steps in order to restore your Wi-Fi Vigilante database.

## 📋 Files You Need

1. ✅ `restore_database.sql` - Creates tables and security policies
2. ✅ `import_data.sql` - Imports sectors and subsectors
3. ✅ `import_cases.sql` - Imports all 15 case studies

## 🚀 Step-by-Step Import Process

### Step 1: Create Tables (5 minutes)

1. Open Supabase SQL Editor:
   - https://supabase.com/dashboard/project/eumqnuyqxcbcnsohpjyh/sql

2. Open `restore_database.sql` in your code editor

3. Copy the ENTIRE file contents

4. Paste into Supabase SQL Editor

5. Click **"Run"** button

6. You should see success messages for:
   - Created `sectors` table
   - Created `subsectors` table
   - Created `case_files` table
   - Enabled Row Level Security
   - Created RLS policies

### Step 2: Import Sectors & Subsectors (2 minutes)

1. In the same SQL Editor, click **"New query"**

2. Open `import_data.sql`

3. Copy and paste the entire contents

4. Click **"Run"**

5. You should see:
   - 5 sectors inserted
   - 4 subsectors inserted (Healthcare sector)

### Step 3: Import Case Studies (5 minutes)

1. Click **"New query"** again

2. Open `import_cases.sql`

3. Copy and paste the entire contents (453 lines)

4. Click **"Run"**

5. This will import all 15 case studies:
   - Shadows Over Serenity Wing
   - The IP Thief of Horizon Admin
   - The Wired Wraith of Eclipse ICU
   - ... and 12 more

### Step 4: Verify Import (2 minutes)

1. Go to **Table Editor**:
   - https://supabase.com/dashboard/project/eumqnuyqxcbcnsohpjyh/editor

2. Click on `case_files` table

3. You should see 15 rows of case data

4. Click on any row to see the full case details

## ✅ Verification Checklist

After import, verify:

- [ ] `sectors` table has 5 rows
- [ ] `subsectors` table has at least 4 rows
- [ ] `case_files` table has 15 rows
- [ ] You can view case details in Table Editor
- [ ] All cases have proper titles, descriptions, tools

## 🧪 Test Local Connection

Once import is complete, test your local app:

```bash
# Make sure dev server is running
npm run dev

# Open browser to http://localhost:3001

# Check:
# - Homepage loads ✅
# - Navigate to /cases ✅
# - Cases display correctly ✅
# - Search works ✅
```

## 🐛 Troubleshooting

### "Column does not exist" error
- Make sure you ran `restore_database.sql` first
- Check that all tables were created in Table Editor

### "Foreign key constraint" error
- Make sure you ran `import_data.sql` before `import_cases.sql`
- Sectors must exist before inserting cases

### "Duplicate key" error
- Tables already have data
- You can either:
  - Delete existing data first: `DELETE FROM case_files; DELETE FROM subsectors; DELETE FROM sectors;`
  - Or skip this import

### Cases don't show in app
- Check browser console for errors
- Verify `.env` has correct credentials
- Restart dev server: `npm run dev`
- Check RLS policies are enabled

## 📞 Need Help?

If you encounter issues:
1. Check Supabase logs: **Logs** → **Postgres Logs**
2. Check browser console for API errors
3. Verify `.env` credentials match Supabase dashboard

---

**After successful import, you're ready to launch!** 🎉
