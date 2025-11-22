// src/utils/caseUtils.ts

import type { CaseFile, TransformedCase } from '@/types';

interface RawCase extends Partial<CaseFile> {
  id?: number;
  public_id: string;
  title: string;
  sector_id: number;
  subsector_id?: number | null;
  incident_date: string;
  incident_overview: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  sectors?: {
    name?: string;
  } | null;
  subsectors?: {
    name?: string;
  } | null;
}

export const transformApiData = (rawCase: RawCase | null): TransformedCase | null => {
  if (!rawCase) return null; // Handle null input if necessary

  return {
    // Base fields from rawCase
    id: rawCase.id || 0, // Numeric database ID
    publicId: rawCase.public_id,
    title: rawCase.title,
    sectorId: rawCase.sector_id,
    sector: rawCase.sectors?.name || "N/A", // From linked sectors table
    subsectorId: rawCase.subsector_id || undefined,
    subsector: rawCase.subsectors?.name || undefined,
    tool: rawCase.tool || undefined,
    location: rawCase.location || undefined,
    category: rawCase.category || undefined,
    incidentDate: rawCase.incident_date,
    displayDate: rawCase.incident_date, // Could be formatted differently in actual use
    // Ensure tags are an array of strings, with '#' removed for internal logic/storage
    // (display components can add '#' back if needed)
    tags: rawCase.tags
      ? String(rawCase.tags).split(',').map(tag => tag.trim().replace(/^#/, ''))
      : [],
    incidentOverview: rawCase.incident_overview,
    investigationBreakdown: rawCase.investigation_breakdown || undefined,
    rootCause: rawCase.root_cause || undefined,
    resolution: rawCase.resolution || undefined,
    verdict: rawCase.verdict || undefined,
    // Provide a consistent summary field
    summary: rawCase.summary || rawCase.incident_overview || "No summary available.",
    detectedBy: rawCase.detected_by || undefined,
    severity: rawCase.severity,
    status: rawCase.status,
    impactScope: rawCase.impact_scope || undefined,
    durationMinutes: rawCase.duration_minutes || undefined,
    validatedBy: rawCase.validated_by || undefined,
    createdAt: rawCase.created_at,
    updatedAt: rawCase.updated_at,
  };
};
