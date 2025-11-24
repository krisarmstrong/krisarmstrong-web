/* eslint react-hooks/set-state-in-effect: "off" */
// src/pages/CaseDetail.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { getCase } from '../api';
import CaseDisplay from '../components/CaseDisplay';
import { TransformedCase } from '../types';
import { transformApiData } from '../utils/caseUtils';

export default function CaseDetail(): React.ReactElement {
  const { id: caseIdFromParams } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<TransformedCase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<Error | { message: string } | null>(null);

  // Derive error state for missing case ID
  const missingIdError = useMemo(() => {
    if (!caseIdFromParams) {
      return { message: 'Case ID is missing from URL.' };
    }
    return null;
  }, [caseIdFromParams]);

  // Derive final error and loading states
  const error = useMemo(() => missingIdError || fetchError, [missingIdError, fetchError]);
  const loading = useMemo(() => !missingIdError && isLoading, [missingIdError, isLoading]);

  useEffect(() => {
    if (missingIdError) {
      return;
    }
    setIsLoading(true);
    setFetchError(null);

    getCase(caseIdFromParams!)
      .then((rawData) => {
        if (!rawData) {
          throw new Error('Case not found or data is null from API.');
        }
        const processedData = transformApiData(rawData);
        if (!processedData) {
          throw new Error('Failed to transform case data.');
        }
        setCaseData(processedData);
      })
      .catch((err: Error) => {
        console.error('Error in CaseDetail useEffect:', err);
        setFetchError({
          message: `Could not load case details for ID ${caseIdFromParams}. (${err.message})`,
        });
      })
      .finally(() => setIsLoading(false));
  }, [caseIdFromParams, missingIdError]);

  return (
    <CaseDisplay
      pageTitle="Case Details"
      pageIcon={<ShieldCheck size={32} className="text-brand-primary" />}
      caseData={caseData}
      isLoading={loading}
      error={error}
    />
  );
}
