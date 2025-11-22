// src/pages/CaseOfTheDay.tsx
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { fetchCaseOfTheDay } from "../api";
import CaseDisplay from '../components/CaseDisplay';
import { TransformedCase } from '../types';
import { transformApiData } from '../utils/caseUtils';
import { DURATION, SIZE } from '../constants';

interface CachedCase {
  case: TransformedCase;
  timestamp: number;
}

function isCachedCase(obj: unknown): obj is CachedCase {
  return obj && typeof obj === 'object' && 'case' in obj && 'timestamp' in obj;
}

// Helper function to get cached case from localStorage
function getCachedCase(): CachedCase | null {
  const cachedDataString = localStorage.getItem("caseOfTheDay");
  if (!cachedDataString) return null;

  try {
    const parsed = JSON.parse(cachedDataString);
    if (isCachedCase(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error("Error parsing cached Case of the Day:", e);
    localStorage.removeItem("caseOfTheDay");
  }
  return null;
}

export default function CaseOfTheDay(): React.ReactElement {
  // Check cache validity once during initialization
  const [initialCacheCheck] = useState(() => {
    const cached = getCachedCase();
    const isValid = cached && (Date.now() - cached.timestamp < DURATION.CACHE_24H);
    return { cached, isValid };
  });

  // Initialize state based on cache validity
  const [caseData, setCaseData] = useState<TransformedCase | null>(
    () => initialCacheCheck.isValid && initialCacheCheck.cached ? initialCacheCheck.cached.case : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialCacheCheck.isValid);
  const [error, setError] = useState<Error | { message: string } | null>(null);

  useEffect(() => {
    // Only fetch if cache is not valid
    if (initialCacheCheck.isValid) {
      return;
    }

    setIsLoading(true);
    setError(null);
    fetchCaseOfTheDay()
      .then((rawData) => {
        if (!rawData) {
          throw new Error("No case data returned for Case of the Day by API.");
        }
        const transformedCase = transformApiData(rawData);
        if (!transformedCase) {
          throw new Error("Failed to transform case data.");
        }
        setCaseData(transformedCase);
        try {
          localStorage.setItem("caseOfTheDay", JSON.stringify({ case: transformedCase, timestamp: Date.now() }));
        } catch (storageError) {
          console.warn('Failed to cache case of the day:', storageError);
          // Continue without caching - not critical
        }
      })
      .catch((err: Error) => {
        console.error("Error fetching Case of the Day:", err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [initialCacheCheck.isValid]);

  return (
    <CaseDisplay
      pageTitle="Case of the Day"
      pageIcon={<CalendarDays size={SIZE.ICON.LG} className="text-brand-primary" />}
      caseData={caseData}
      isLoading={isLoading}
      error={error}
    />
  );
}
