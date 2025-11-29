// src/pages/CaseDetail.tsx
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCase, getAllCases } from '../api';
import CaseDisplay from '../components/CaseDisplay';
import { TransformedCase } from '../types';
import { transformApiData } from '../utils/caseUtils';

export default function CaseDetail(): React.ReactElement {
  const { id: caseIdFromParams } = useParams<{ id: string }>();

  // Fetch specific case - uses separate cache key for individual cases
  const {
    data: rawCaseData,
    isLoading: caseLoading,
    error: caseError,
  } = useQuery({
    queryKey: ['case', caseIdFromParams],
    queryFn: () => getCase(caseIdFromParams!),
    enabled: !!caseIdFromParams,
  });

  // Fetch all cases for related cases - shares cache with CaseOverview.tsx listing page
  const { data: allCases = [] } = useQuery({
    queryKey: ['cases'],
    queryFn: getAllCases,
    enabled: !!caseIdFromParams,
  });

  // Transform the fetched case data
  const caseData = useMemo(() => {
    if (!rawCaseData) return null;
    return transformApiData(rawCaseData);
  }, [rawCaseData]);

  // Derive related cases from cached data
  const relatedCases = useMemo(() => {
    if (!caseData?.tags?.length || !allCases.length) return [];
    const transformed = allCases.map(transformApiData).filter(Boolean) as TransformedCase[];
    return transformed
      .filter(
        (c) =>
          c.publicId !== caseData.publicId &&
          c.tags &&
          c.tags.some((t) => caseData.tags?.includes(t))
      )
      .slice(0, 3);
  }, [caseData, allCases]);

  // Derive error state
  const error = useMemo(() => {
    if (!caseIdFromParams) {
      return { message: 'Case ID is missing from URL.' };
    }
    if (caseError) {
      return { message: `Could not load case details for ID ${caseIdFromParams}.` };
    }
    return null;
  }, [caseIdFromParams, caseError]);

  const loading = caseLoading;

  return (
    <CaseDisplay
      pageTitle="Case Details"
      pageIcon={<ShieldCheck size={32} className="text-brand-primary" />}
      caseData={caseData}
      isLoading={loading}
      error={error}
      relatedCases={relatedCases}
    />
  );
}
