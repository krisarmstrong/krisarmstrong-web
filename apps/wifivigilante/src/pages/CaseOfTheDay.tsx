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

export default function CaseOfTheDay(): React.ReactElement {
  const [caseData, setCaseData] = useState<TransformedCase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | { message: string } | null>(null);

  useEffect(() => {
    const cachedDataString = localStorage.getItem("caseOfTheDay");
    let cachedCaseObject: CachedCase | null = null;

    if (cachedDataString) {
      try {
        const parsed = JSON.parse(cachedDataString);
        if (isCachedCase(parsed)) {
          cachedCaseObject = parsed;
        }
      } catch (e) {
        console.error("Error parsing cached Case of the Day:", e);
        localStorage.removeItem("caseOfTheDay");
      }
    }

    if (isCachedCase(cachedCaseObject) && (Date.now() - cachedCaseObject.timestamp < DURATION.CACHE_24H)) {
      setCaseData(cachedCaseObject.case);
      setIsLoading(false);
    } else {
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
    }
  }, []);

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
