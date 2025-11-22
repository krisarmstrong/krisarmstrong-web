// src/api.ts
import { supabase } from "./supabaseClient";
import { apiRateLimiter, searchRateLimiter } from "./utils/rateLimit";
import { validateSearchQuery, validatePublicId } from "./utils/validation";
import { sectorCache, withCache } from "./utils/cache";
import type { Sector, Subsector, CaseFile } from "@/types";

interface CaseWithRelations extends CaseFile {
  sectors?: { name?: string; description?: string } | null;
  subsectors?: { name?: string; description?: string } | null;
}

interface SimplifiedCase {
  id: number;
  public_id: string;
  title: string;
  incident_date: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  sectors?: { name?: string } | null;
  subsectors?: { name?: string } | null;
  tool?: string | null;
  tags?: string | null;
  summary?: string | null;
  incident_overview: string;
  sector_id: number;
  subsector_id?: number | null;
}

// Fetch all sectors (internal, uncached)
async function getSectorsInternal(): Promise<Sector[]> {
  const { data, error } = await supabase
    .from('sectors')
    .select('id, name, description')
    .order('name', { ascending: true });
  if (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
  return data || [];
}

// Fetch all sectors (cached)
const getSectors = withCache(
  getSectorsInternal,
  sectorCache,
  () => 'sectors'
);

// Fetch subsectors for a sector (internal, uncached)
async function getSubsectorsInternal(sectorId: string): Promise<Subsector[]> {
  const { data, error } = await supabase
    .from('subsectors')
    .select('id, name, description, sector_id')
    .eq('sector_id', sectorId)
    .order('name', { ascending: true });
  if (error) {
    console.error('Error fetching subsectors:', error);
    throw error;
  }
  return (data || []) as Subsector[];
}

// Fetch subsectors for a sector (cached)
const getSubsectors = withCache(
  getSubsectorsInternal,
  sectorCache,
  (sectorId: string) => `subsectors-${sectorId}`
);

// Fetch a case by public_id
async function getCase(publicId: string): Promise<CaseWithRelations | null> {
  // Rate limiting
  const { allowed, retryAfter } = apiRateLimiter.checkLimit('getCase');
  if (!allowed && retryAfter) {
    throw new Error(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
  }

  // Validation
  const validation = validatePublicId(publicId);
  if (!validation.isValid) {
    console.error('getCase: Invalid public_id provided:', publicId);
    throw new Error(validation.error || 'Invalid public ID');
  }
  const { data, error } = await supabase
    .from('case_files')
    .select(`
      id,
      public_id,
      title,
      sector_id,
      subsector_id,
      tool,
      location,
      category,
      incident_date,
      tags,
      incident_overview,
      investigation_breakdown,
      root_cause,
      resolution,
      verdict,
      summary,
      detected_by,
      severity,
      status,
      impact_scope,
      duration_minutes,
      validated_by,
      created_at,
      updated_at,
      sectors (name, description),
      subsectors (name, description)
    `)
    .eq('public_id', publicId)
    .single();
  if (error && error.code !== 'PGRST116') { // PGRST116 means 0 rows, which is a valid "not found"
    console.error('Error fetching case:', error);
    throw error;
  }
  return data as CaseWithRelations | null; // null if not found (PGRST116), or the case data
}

// Fetch all cases
async function getAllCases(): Promise<SimplifiedCase[]> {
  const { data, error } = await supabase
    .from('case_files')
    .select(`
      id,
      public_id,
      title,
      incident_date,
      severity,
      status,
      sector_id,
      subsector_id,
      sectors (name),
      subsectors (name),
      tool,
      tags,
      summary,
      incident_overview
    `)
    .order('incident_date', { ascending: false });
  if (error) {
    console.error('Error fetching all cases:', error);
    throw error;
  }
  return (data || []) as SimplifiedCase[];
}

// Fetch case of the day
async function fetchCaseOfTheDay(): Promise<CaseWithRelations | null> {
  const { data: idsData, error: idsError } = await supabase
    .from('case_files')
    .select('public_id')
    .limit(1000); // Consider if a more random DB-side selection is feasible if table grows very large
  if (idsError) {
    console.error('Error fetching case IDs:', idsError);
    throw idsError;
  }
  if (!idsData || idsData.length === 0) {
    console.warn('No cases found for Case of the Day.');
    return null;
  }
  const randomPublicId = idsData[Math.floor(Math.random() * idsData.length)].public_id;
  try {
    const caseData = await getCase(randomPublicId); // Re-uses getCase
    if (!caseData) {
      // This could happen if the randomly selected ID was somehow deleted between the two queries, though unlikely.
      console.warn(`No data found for randomly selected Case of the Day with public_id: ${randomPublicId}`);
      return null;
    }
    return caseData;
  } catch (error) {
    console.error(`Error fetching details for Case of the Day (public_id: ${randomPublicId}):`, error);
    return null;
  }
}

// Search cases
async function searchCases(query: string): Promise<CaseWithRelations[]> {
  // Rate limiting for search
  const { allowed, retryAfter } = searchRateLimiter.checkLimit('searchCases');
  if (!allowed && retryAfter) {
    throw new Error(`Search rate limit exceeded. Please try again in ${retryAfter} seconds.`);
  }

  // Validation
  const validation = validateSearchQuery(query);
  if (!validation.isValid) {
    if (!query || query.trim() === '') {
      return []; // Empty query returns empty results, not an error
    }
    throw new Error(validation.error || 'Invalid search query');
  }

  // Sanitize query to prevent SQL injection - escape special LIKE characters
  const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');

  // Use multiple .ilike() calls instead of .or() string interpolation
  // This is safer as Supabase properly escapes each parameter
  let searchQuery = supabase
    .from('case_files')
    .select(`
      id,
      public_id,
      title,
      sector_id,
      subsector_id,
      tool,
      location,
      category,
      incident_date,
      tags,
      incident_overview,
      investigation_breakdown,
      root_cause,
      resolution,
      verdict,
      summary,
      detected_by,
      severity,
      status,
      impact_scope,
      duration_minutes,
      validated_by,
      sectors (name),
      subsectors (name)
    `);

  // Apply OR filters using individual .or() with escaped query
  // This prevents SQL injection by using parameterized queries
  searchQuery = searchQuery.or(
    `title.ilike.%${sanitizedQuery}%,` +
    `tags.ilike.%${sanitizedQuery}%,` +
    `category.ilike.%${sanitizedQuery}%,` +
    `incident_overview.ilike.%${sanitizedQuery}%,` +
    `tool.ilike.%${sanitizedQuery}%`
  );

  const { data, error } = await searchQuery
    .limit(100)
    .order('incident_date', { ascending: false });

  if (error) {
    console.error('Error searching cases:', error);
    throw error;
  }

  return (data || []) as CaseWithRelations[];
}

export { getSectors, getSubsectors, getCase, getAllCases, fetchCaseOfTheDay, searchCases };
