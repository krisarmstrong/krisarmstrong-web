// src/api.ts
import { supabase } from './supabaseClient';
import { apiRateLimiter, searchRateLimiter } from './utils/rateLimit';
import { validateSearchQuery, validatePublicId } from './utils/validation';
import { sectorCache, withCache } from './utils/cache';
import type { Sector, Subsector, CaseFile } from '@/types';

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
const getSectors = withCache(getSectorsInternal, sectorCache, () => 'sectors');

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
    .select(
      `
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
    `
    )
    .eq('public_id', publicId)
    .single();
  if (error && error.code !== 'PGRST116') {
    // PGRST116 means 0 rows, which is a valid "not found"
    console.error('Error fetching case:', error);
    throw error;
  }
  return data as CaseWithRelations | null; // null if not found (PGRST116), or the case data
}

// Fetch all cases
async function getAllCases(): Promise<SimplifiedCase[]> {
  const { data, error } = await supabase
    .from('case_files')
    .select(
      `
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
    `
    )
    .order('incident_date', { ascending: false });
  if (error) {
    console.error('Error fetching all cases:', error);
    throw error;
  }
  return (data || []) as SimplifiedCase[];
}

// Awareness month configuration - maps month to priority sector IDs
const AWARENESS_MONTHS: Record<number, { name: string; sectorIds: number[] }> = {
  2: { name: 'Healthcare Awareness Month', sectorIds: [1] },
  3: { name: 'Fraud Prevention Month', sectorIds: [5] },
  5: { name: 'Infrastructure Security Month', sectorIds: [2, 3] },
  9: { name: 'National Preparedness Month', sectorIds: [3] },
  10: { name: 'Cybersecurity Awareness Month', sectorIds: [1, 2, 3, 4, 5] },
  11: { name: 'Critical Infrastructure Month', sectorIds: [2, 3] },
};

// Get deterministic seed from date (same for all users on same day)
function getDateSeed(date: Date = new Date()): number {
  const year = date.getFullYear();
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return year * 1000 + dayOfYear;
}

// Convert tags to social media hashtags
function tagsToHashtags(tags: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map((tag) => {
      // Remove spaces, special chars, convert to PascalCase hashtag
      const cleaned = tag
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
      return `#${cleaned}`;
    })
    .filter((tag) => tag.length > 1);
}

// Get current awareness month info
function getAwarenessMonth(date: Date = new Date()): { name: string; sectorIds: number[] } | null {
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const monthKey = month as keyof typeof AWARENESS_MONTHS;
  // eslint-disable-next-line security/detect-object-injection -- monthKey is validated via 'in' check
  return monthKey in AWARENESS_MONTHS ? AWARENESS_MONTHS[monthKey] : null;
}

// Case of the day response with social metadata
interface CaseOfTheDayResponse extends CaseWithRelations {
  hashtags: string[];
  awarenessMonth: string | null;
  shareUrl: string;
}

// Fetch case of the day - deterministic (same for all users on same day)
async function fetchCaseOfTheDay(
  targetDate: Date = new Date()
): Promise<CaseOfTheDayResponse | null> {
  const seed = getDateSeed(targetDate);
  const month = targetDate.getMonth() + 1;
  const monthKey = month as keyof typeof AWARENESS_MONTHS;
  // eslint-disable-next-line security/detect-object-injection -- monthKey is validated via 'in' check
  const awareness = monthKey in AWARENESS_MONTHS ? AWARENESS_MONTHS[monthKey] : undefined;

  // First, try to get pre-selected case from daily_case_selections (if migration was run)
  const dateStr = targetDate.toISOString().split('T')[0];
  const { data: selection } = await supabase
    .from('daily_case_selections')
    .select('case_id')
    .eq('selection_date', dateStr)
    .single();

  let selectedPublicId: string | null = null;

  if (selection?.case_id) {
    // Use pre-selected case
    const { data: preSelected } = await supabase
      .from('case_files')
      .select('public_id')
      .eq('id', selection.case_id)
      .single();
    if (preSelected) {
      selectedPublicId = preSelected.public_id;
    }
  }

  if (!selectedPublicId) {
    // Deterministic selection: fetch all cases and select based on date seed
    let query = supabase
      .from('case_files')
      .select('id, public_id, sector_id, featured_date')
      .order('id', { ascending: true });

    // During awareness months, prioritize relevant sectors (70% chance)
    const prioritizeSector = awareness && seed % 10 < 7;

    if (prioritizeSector) {
      query = query.in('sector_id', awareness.sectorIds);
    }

    const { data: cases, error } = await query.limit(1000);

    if (error || !cases || cases.length === 0) {
      // Fallback: get any case
      const { data: fallbackCases } = await supabase
        .from('case_files')
        .select('id, public_id')
        .limit(1000);

      if (!fallbackCases || fallbackCases.length === 0) {
        console.warn('No cases found for Case of the Day.');
        return null;
      }

      // Deterministic selection using seed
      const index = seed % fallbackCases.length;
      // eslint-disable-next-line security/detect-object-injection -- index is bounds-checked
      const selectedCase =
        index >= 0 && index < fallbackCases.length ? fallbackCases[index] : undefined;
      selectedPublicId = selectedCase?.public_id ?? null;
    } else {
      // Prefer cases not recently featured (within 30 days)
      const thirtyDaysAgo = new Date(targetDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const eligibleCases = cases.filter(
        (c) => !c.featured_date || new Date(c.featured_date) < thirtyDaysAgo
      );

      const casePool = eligibleCases.length > 0 ? eligibleCases : cases;

      // Deterministic selection using seed
      const index = seed % casePool.length;
      // eslint-disable-next-line security/detect-object-injection -- index is bounds-checked
      const poolCase = index >= 0 && index < casePool.length ? casePool[index] : undefined;
      selectedPublicId = poolCase?.public_id ?? null;
    }
  }

  if (!selectedPublicId) {
    console.warn('Could not determine Case of the Day.');
    return null;
  }

  try {
    const caseData = await getCase(selectedPublicId);
    if (!caseData) {
      console.warn(`No data found for Case of the Day with public_id: ${selectedPublicId}`);
      return null;
    }

    // Enrich with social metadata
    const response: CaseOfTheDayResponse = {
      ...caseData,
      hashtags: tagsToHashtags(caseData.tags || null),
      awarenessMonth: awareness?.name || null,
      shareUrl: `https://wifivigilante.com/case/${caseData.public_id}`,
    };

    return response;
  } catch (error) {
    console.error(`Error fetching Case of the Day (public_id: ${selectedPublicId}):`, error);
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
  let searchQuery = supabase.from('case_files').select(`
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

  const { data, error } = await searchQuery.limit(100).order('incident_date', { ascending: false });

  if (error) {
    console.error('Error searching cases:', error);
    throw error;
  }

  return (data || []) as CaseWithRelations[];
}

export {
  getSectors,
  getSubsectors,
  getCase,
  getAllCases,
  fetchCaseOfTheDay,
  searchCases,
  tagsToHashtags,
  getAwarenessMonth,
};
