# Supabase Row Level Security (RLS) Setup

This document provides the SQL commands to set up Row Level Security policies for the Wi-Fi Vigilante database.

## Prerequisites

1. Access to your Supabase project dashboard
2. Navigate to: SQL Editor in your Supabase project

## Enable RLS on Tables

First, enable RLS on all tables:

```sql
-- Enable RLS on case_files table
ALTER TABLE case_files ENABLE ROW LEVEL SECURITY;

-- Enable RLS on sectors table
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;

-- Enable RLS on subsectors table
ALTER TABLE subsectors ENABLE ROW LEVEL SECURITY;
```

## Create Policies for Public Read Access

Since this is a public case database, we'll allow read access to all users but restrict write access:

```sql
-- Policy: Allow anyone to read case_files
CREATE POLICY "Allow public read access to case_files"
ON case_files
FOR SELECT
TO public
USING (true);

-- Policy: Allow anyone to read sectors
CREATE POLICY "Allow public read access to sectors"
ON sectors
FOR SELECT
TO public
USING (true);

-- Policy: Allow anyone to read subsectors
CREATE POLICY "Allow public read access to subsectors"
ON subsectors
FOR SELECT
TO public
USING (true);
```

## Create Policies for Write Access (Admin Only)

If you plan to add authentication later, these policies will restrict write access to authenticated admins:

```sql
-- Policy: Only authenticated users can insert cases
CREATE POLICY "Only authenticated users can insert case_files"
ON case_files
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can update cases
CREATE POLICY "Only authenticated users can update case_files"
ON case_files
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Only authenticated users can delete cases
CREATE POLICY "Only authenticated users can delete case_files"
ON case_files
FOR DELETE
TO authenticated
USING (true);
```

## Alternative: Service Role for Admin Operations

If you're managing content through a backend service, you can use the service role key which bypasses RLS:

```javascript
// In your admin backend (NEVER expose service role key in frontend!)
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role bypasses RLS
)
```

## Verify RLS Policies

After creating policies, verify them:

```sql
-- Check which policies exist
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public';
```

## Testing Policies

Test the policies from your application:

```javascript
// This should work (public read)
const { data, error } = await supabase
  .from('case_files')
  .select('*');

// This should fail unless authenticated (write protection)
const { data: insertData, error: insertError } = await supabase
  .from('case_files')
  .insert([{ title: 'Test Case' }]);
```

## Rate Limiting (Recommended)

Enable rate limiting in Supabase dashboard:

1. Go to Project Settings > API
2. Enable "Rate Limiting"
3. Set appropriate limits:
   - **Anonymous users**: 100 requests per hour
   - **Authenticated users**: 500 requests per hour

## Security Best Practices

1. **Never commit service role keys** - Only use in backend services
2. **Use anon key in frontend** - It's safe to expose (RLS protects data)
3. **Enable RLS on all tables** - Even if policies allow full access initially
4. **Monitor access logs** - Check Supabase logs for suspicious activity
5. **Implement rate limiting** - Prevent abuse and DoS attacks

## Future Enhancements

When adding authentication:

1. Create user roles table
2. Add admin role checks to write policies
3. Implement role-based access control (RBAC)
4. Add audit logging for all write operations

## Rollback (Disable RLS)

If you need to disable RLS (NOT RECOMMENDED for production):

```sql
-- Disable RLS on tables (use with caution!)
ALTER TABLE case_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE sectors DISABLE ROW LEVEL SECURITY;
ALTER TABLE subsectors DISABLE ROW LEVEL SECURITY;
```

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
