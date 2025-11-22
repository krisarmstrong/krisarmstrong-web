-- Wi-Fi Vigilante Database Restoration Script
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/eumqnuyqxcbcnsohpjyh/sql

-- Step 1: Create sectors table
CREATE TABLE IF NOT EXISTS public.sectors (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name character varying(100) NOT NULL UNIQUE,
    description text
);

-- Step 2: Create subsectors table
CREATE TABLE IF NOT EXISTS public.subsectors (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name character varying(100) NOT NULL,
    sector_id integer REFERENCES public.sectors(id),
    description text
);

-- Step 3: Create case_files table
CREATE TABLE IF NOT EXISTS public.case_files (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    title character varying(200) NOT NULL,
    sector_id integer NOT NULL REFERENCES public.sectors(id),
    subsector_id integer NOT NULL REFERENCES public.subsectors(id),
    tool character varying(100) NOT NULL,
    location character varying(200) NOT NULL,
    category character varying(100) NOT NULL,
    incident_date date NOT NULL,
    tags character varying(500),
    incident_overview text NOT NULL,
    investigation_breakdown text NOT NULL,
    root_cause text NOT NULL,
    resolution text NOT NULL,
    verdict character varying(200) NOT NULL,
    summary text NOT NULL,
    detected_by character varying(100) NOT NULL,
    severity character varying(50) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    status character varying(50) NOT NULL CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    impact_scope character varying(200) NOT NULL,
    duration_minutes integer NOT NULL CHECK (duration_minutes >= 0),
    validated_by character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

-- Step 4: Enable Row Level Security
ALTER TABLE public.case_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subsectors ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies for public read access
CREATE POLICY "Allow public read access to case_files"
ON public.case_files FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to sectors"
ON public.sectors FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to subsectors"
ON public.subsectors FOR SELECT TO public USING (true);

-- Step 6: Create RLS Policies for authenticated write access
CREATE POLICY "Allow authenticated insert on case_files"
ON public.case_files FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on case_files"
ON public.case_files FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on case_files"
ON public.case_files FOR DELETE TO authenticated USING (true);

-- Step 7: Insert sample data (Healthcare sector)
INSERT INTO public.sectors (name, description) VALUES
('Healthcare', 'Healthcare institutions including hospitals, clinics, and medical centers')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.subsectors (name, sector_id, description)
SELECT 'Hospital', id, 'General hospitals and medical centers'
FROM public.sectors WHERE name = 'Healthcare';

-- Instructions:
-- 1. Go to: https://supabase.com/dashboard/project/eumqnuyqxcbcnsohpjyh/sql
-- 2. Copy this entire file
-- 3. Paste into SQL Editor
-- 4. Click "Run" button
-- 5. After success, import your case data separately
