// src/api.ts

import type { CaseFile, Sector, Subsector } from '@/types';
import localData from './data/wifiVigilanteData.json';
import { sectorCache, withCache } from './utils/cache';
import { apiRateLimiter, searchRateLimiter } from './utils/rateLimit';
import { validatePublicId, validateSearchQuery } from './utils/validation';

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

type LocalCase = CaseFile & {
  id: number;
  featured_date?: string | null;
};

const sectors = localData.sectors as Sector[];
const subsectors = localData.subsectors as Subsector[];
const cases = localData.cases as LocalCase[];

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function withRelations<T extends CaseFile>(caseFile: T): T & CaseWithRelations {
  const existing = caseFile as T & CaseWithRelations;
  return {
    ...caseFile,
    sectors: existing.sectors ?? sectors.find((sector) => sector.id === caseFile.sector_id) ?? null,
    subsectors:
      existing.subsectors ??
      subsectors.find((subsector) => subsector.id === caseFile.subsector_id) ??
      null,
  };
}

// Fetch all sectors (internal, uncached)
async function getSectorsInternal(): Promise<Sector[]> {
  const apiSectors = await fetchJson<Sector[]>('/api/sectors');
  return (apiSectors?.length ? apiSectors : sectors).sort((a, b) => a.name.localeCompare(b.name));
}

// Fetch all sectors (cached)
const getSectors = withCache(getSectorsInternal, sectorCache, () => 'sectors');

// Fetch subsectors for a sector (internal, uncached)
async function getSubsectorsInternal(sectorId: string): Promise<Subsector[]> {
  const apiSubsectors = await fetchJson<Subsector[]>(
    `/api/subsectors?sectorId=${encodeURIComponent(sectorId)}`
  );
  return (apiSubsectors?.length ? apiSubsectors : subsectors)
    .filter((subsector) => String(subsector.sector_id) === sectorId)
    .sort((a, b) => a.name.localeCompare(b.name));
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
  const apiCase = await fetchJson<CaseWithRelations>(`/api/cases/${encodeURIComponent(publicId)}`);
  if (apiCase) return apiCase;

  const caseFile = cases.find((item) => item.public_id === publicId);
  return caseFile ? withRelations(caseFile) : null;
}

// Fetch all cases
async function getAllCases(): Promise<SimplifiedCase[]> {
  const apiCases = await fetchJson<SimplifiedCase[]>('/api/cases');
  return (apiCases?.length ? apiCases : cases.map((caseFile) => withRelations(caseFile)))
    .map((caseFile) => withRelations(caseFile))
    .sort((a, b) => b.incident_date.localeCompare(a.incident_date));
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
  const awareness = monthKey in AWARENESS_MONTHS ? AWARENESS_MONTHS[monthKey] : undefined;

  let selectedPublicId: string | null = null;

  if (!selectedPublicId) {
    let candidateCases = [...cases].sort((a, b) => a.id - b.id);

    // During awareness months, prioritize relevant sectors (70% chance)
    const prioritizeSector = awareness && seed % 10 < 7;

    if (prioritizeSector) {
      candidateCases = candidateCases.filter((caseFile) =>
        awareness.sectorIds.includes(caseFile.sector_id)
      );
    }

    if (candidateCases.length === 0) {
      candidateCases = [...cases].sort((a, b) => a.id - b.id);
      if (candidateCases.length === 0) {
        console.warn('No cases found for Case of the Day.');
        return null;
      }

      // Deterministic selection using seed
      const index = seed % candidateCases.length;
      const selectedCase = candidateCases[index];
      selectedPublicId = selectedCase?.public_id ?? null;
    } else {
      // Prefer cases not recently featured (within 30 days)
      const thirtyDaysAgo = new Date(targetDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const eligibleCases = candidateCases.filter(
        (c) => !c.featured_date || new Date(c.featured_date) < thirtyDaysAgo
      );

      const casePool = eligibleCases.length > 0 ? eligibleCases : candidateCases;

      // Deterministic selection using seed
      const index = seed % casePool.length;
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

  const normalizedQuery = query.trim().toLowerCase();
  const searchableFields: Array<keyof CaseFile> = [
    'title',
    'tags',
    'category',
    'incident_overview',
    'tool',
  ];

  return cases
    .filter((caseFile) =>
      searchableFields.some((field) =>
        String(caseFile[field] ?? '')
          .toLowerCase()
          .includes(normalizedQuery)
      )
    )
    .map((caseFile) => withRelations(caseFile))
    .sort((a, b) => b.incident_date.localeCompare(a.incident_date))
    .slice(0, 100);
}

export {
  fetchCaseOfTheDay,
  getAllCases,
  getAwarenessMonth,
  getCase,
  getSectors,
  getSubsectors,
  searchCases,
  tagsToHashtags,
};
