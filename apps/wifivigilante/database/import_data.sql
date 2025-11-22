-- Wi-Fi Vigilante Data Import
-- Run this AFTER running restore_database.sql

-- Insert Sectors (with OVERRIDING SYSTEM VALUE to set specific IDs)
INSERT INTO public.sectors (id, name, description) OVERRIDING SYSTEM VALUE VALUES
(1, 'Healthcare', 'Medical facilities providing patient care and diagnostic services with critical network dependencies.'),
(2, 'Manufacturing', 'Industrial operations relying on IoT and automation for production and logistics.'),
(3, 'Government', 'Public sector entities requiring secure networks for administration and services.'),
(4, 'Education', 'Academic institutions using Wi-Fi for learning, research, and campus operations.'),
(5, 'Retail', 'Commercial businesses needing reliable networks for sales, inventory, and customer services.')
ON CONFLICT (name) DO NOTHING;

-- Reset sectors sequence
SELECT setval(pg_get_serial_sequence('public.sectors', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.sectors));

-- Insert Subsectors (with OVERRIDING SYSTEM VALUE to set specific IDs)
INSERT INTO public.subsectors (id, sector_id, name, description) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'Hospitals', 'Acute care facilities with real-time patient monitoring and EHR systems.'),
(2, 1, 'Clinics', 'Outpatient facilities for specialized and primary care.'),
(3, 1, 'Laboratories', 'Diagnostic and research labs processing critical medical data.'),
(4, 1, 'Pharmacies', 'Retail and hospital-adjacent pharmacies managing prescription systems.');

-- Reset subsectors sequence
SELECT setval(pg_get_serial_sequence('public.subsectors', 'id'), (SELECT COALESCE(MAX(id), 1) FROM public.subsectors));

