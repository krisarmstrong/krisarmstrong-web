-- Wi-Fi Vigilante - CLEAN START
-- This will completely wipe and rebuild your database from scratch

-- Step 1: Drop all existing tables (if they exist)
DROP TABLE IF EXISTS public.case_files CASCADE;
DROP TABLE IF EXISTS public.subsectors CASCADE;
DROP TABLE IF EXISTS public.sectors CASCADE;

-- Step 2: Create sectors table
CREATE TABLE public.sectors (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name character varying(100) NOT NULL UNIQUE,
    description text
);

-- Step 3: Create subsectors table
CREATE TABLE public.subsectors (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name character varying(100) NOT NULL,
    sector_id integer REFERENCES public.sectors(id),
    description text
);

-- Step 4: Create case_files table
CREATE TABLE public.case_files (
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

-- Step 5: Enable Row Level Security
ALTER TABLE public.case_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subsectors ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS Policies for public read access
CREATE POLICY "Allow public read access to case_files"
ON public.case_files FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to sectors"
ON public.sectors FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to subsectors"
ON public.subsectors FOR SELECT TO public USING (true);

-- Step 7: Create RLS Policies for authenticated write access
CREATE POLICY "Allow authenticated insert on case_files"
ON public.case_files FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on case_files"
ON public.case_files FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on case_files"
ON public.case_files FOR DELETE TO authenticated USING (true);

-- Step 8: Insert Sectors (with OVERRIDING SYSTEM VALUE)
INSERT INTO public.sectors (id, name, description) OVERRIDING SYSTEM VALUE VALUES
(1, 'Healthcare', 'Medical facilities providing patient care and diagnostic services with critical network dependencies.'),
(2, 'Manufacturing', 'Industrial operations relying on IoT and automation for production and logistics.'),
(3, 'Government', 'Public sector entities requiring secure networks for administration and services.'),
(4, 'Education', 'Academic institutions using Wi-Fi for learning, research, and campus operations.'),
(5, 'Retail', 'Commercial businesses needing reliable networks for sales, inventory, and customer services.');

-- Reset sectors sequence
SELECT setval(pg_get_serial_sequence('public.sectors', 'id'), (SELECT MAX(id) FROM public.sectors));

-- Step 9: Insert Subsectors (with OVERRIDING SYSTEM VALUE) - ALL 20
INSERT INTO public.subsectors (id, sector_id, name, description) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'Hospitals', 'Acute care facilities with real-time patient monitoring and EHR systems.'),
(2, 1, 'Clinics', 'Outpatient facilities for specialized and primary care.'),
(3, 1, 'Laboratories', 'Diagnostic and research labs processing critical medical data.'),
(4, 1, 'Pharmacies', 'Retail and hospital-adjacent pharmacies managing prescription systems.'),
(5, 2, 'Automotive', 'Assembly lines for vehicle production with IoT-driven automation.'),
(6, 2, 'Electronics', 'Facilities producing semiconductors and tech components.'),
(7, 2, 'Food & Beverage', 'Processing plants with networked quality control systems.'),
(8, 2, 'Warehousing', 'Logistics hubs for inventory and supply chain management.'),
(9, 3, 'Municipal Services', 'City halls and public works with administrative networks.'),
(10, 3, 'Defense', 'Military bases requiring secure, high-uptime networks.'),
(11, 3, 'Emergency Services', 'Fire and police stations with critical communication systems.'),
(12, 3, 'Public Administration', 'Agencies like DMVs and courthouses with public-facing systems.'),
(13, 4, 'Universities', 'Higher education campuses with extensive Wi-Fi for students and research.'),
(14, 4, 'K-12 Schools', 'Primary and secondary schools with e-learning platforms.'),
(15, 4, 'Libraries', 'Public and academic libraries with Wi-Fi for research and access.'),
(16, 4, 'Training Centers', 'Vocational and professional training facilities.'),
(17, 5, 'Retail Stores', 'Department stores and boutiques with POS and customer Wi-Fi.'),
(18, 5, 'Warehouses', 'Distribution centers for retail logistics.'),
(19, 5, 'Supermarkets', 'Grocery chains with networked inventory and checkout systems.'),
(20, 5, 'Restaurants', 'Dining establishments with Wi-Fi for orders and guest services.');

-- Reset subsectors sequence
SELECT setval(pg_get_serial_sequence('public.subsectors', 'id'), (SELECT MAX(id) FROM public.subsectors));

-- SUCCESS! Now run import_cases.sql to add your 15 case studies
