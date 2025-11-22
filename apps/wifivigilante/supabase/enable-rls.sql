-- Wi-Fi Vigilante - Row Level Security Setup
-- Execute this in Supabase SQL Editor
-- Version: 1.0.0
-- Date: 2025-01-08

-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE case_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsectors ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PUBLIC READ POLICIES
-- Allow anyone to read data (case database is public)
-- =============================================================================

-- Case Files: Public read access
CREATE POLICY "public_read_cases"
ON case_files
FOR SELECT
TO public
USING (true);

-- Sectors: Public read access
CREATE POLICY "public_read_sectors"
ON sectors
FOR SELECT
TO public
USING (true);

-- Subsectors: Public read access
CREATE POLICY "public_read_subsectors"
ON subsectors
FOR SELECT
TO public
USING (true);

-- =============================================================================
-- ADMIN WRITE POLICIES
-- Only authenticated admins can modify data
-- =============================================================================

-- Case Files: Admin can insert
CREATE POLICY "admin_insert_cases"
ON case_files
FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
);

-- Case Files: Admin can update
CREATE POLICY "admin_update_cases"
ON case_files
FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
);

-- Case Files: Admin can delete
CREATE POLICY "admin_delete_cases"
ON case_files
FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
);

-- Sectors: Admin can modify (rarely needed)
CREATE POLICY "admin_modify_sectors"
ON sectors
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
);

-- Subsectors: Admin can modify (rarely needed)
CREATE POLICY "admin_modify_subsectors"
ON subsectors
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  OR
  auth.jwt() ->> 'app_metadata' ->> 'role' = 'admin'
);

-- =============================================================================
-- VERIFY POLICIES
-- =============================================================================

-- Check that policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test that RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('case_files', 'sectors', 'subsectors');

-- =============================================================================
-- INSTRUCTIONS
-- =============================================================================

-- After running this script:
-- 1. Verify all policies show in the query results above
-- 2. Test public read access (should work without authentication)
-- 3. Test admin write access (should work only with admin role)
-- 4. Close Issue #10 on GitHub
