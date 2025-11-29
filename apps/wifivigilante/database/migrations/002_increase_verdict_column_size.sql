-- Migration: Increase verdict column size to TEXT for longer case verdicts
-- This allows for more detailed and meaningful verdict content

ALTER TABLE case_files ALTER COLUMN verdict TYPE TEXT;

-- Also increase summary column to TEXT if it has constraints
ALTER TABLE case_files ALTER COLUMN summary TYPE TEXT;

-- Verify changes
-- SELECT column_name, data_type, character_maximum_length
-- FROM information_schema.columns
-- WHERE table_name = 'case_files' AND column_name IN ('verdict', 'summary');
