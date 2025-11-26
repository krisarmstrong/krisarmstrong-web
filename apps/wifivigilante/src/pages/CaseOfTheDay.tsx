/* eslint react-hooks/set-state-in-effect: "off" */
// src/pages/CaseOfTheDay.tsx
import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { fetchCaseOfTheDay, getAwarenessMonth } from '../api';
import CaseDisplay from '../components/CaseDisplay';
import { TransformedCase } from '../types';
import { transformApiData } from '../utils/caseUtils';
import { SIZE } from '../constants';

interface CachedCase {
  case: TransformedCase;
  date: string; // YYYY-MM-DD format for date-based caching
  awarenessMonth: string | null;
  hashtags: string[];
}

function isCachedCase(obj: unknown): obj is CachedCase {
  return !!(obj && typeof obj === 'object' && 'case' in obj && 'date' in obj);
}

// Get today's date string in YYYY-MM-DD format
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper function to get cached case from localStorage (date-based for consistency)
function getCachedCase(): CachedCase | null {
  const cachedDataString = localStorage.getItem('caseOfTheDay');
  if (!cachedDataString) return null;

  try {
    const parsed = JSON.parse(cachedDataString);
    if (isCachedCase(parsed)) {
      // Check if cache is from today (ensures same case for all users on same day)
      if (parsed.date === getTodayString()) {
        return parsed;
      }
      // Cache is from a different day, remove it
      localStorage.removeItem('caseOfTheDay');
    }
  } catch (e) {
    console.error('Error parsing cached Case of the Day:', e);
    localStorage.removeItem('caseOfTheDay');
  }
  return null;
}

export default function CaseOfTheDay(): React.ReactElement {
  // Check cache validity once during initialization
  const [initialCacheCheck] = useState(() => {
    const cached = getCachedCase();
    const isValid = !!cached; // Valid if it exists and is from today (checked in getCachedCase)
    return { cached, isValid };
  });

  // Initialize state based on cache validity
  const [caseData, setCaseData] = useState<TransformedCase | null>(() =>
    initialCacheCheck.isValid && initialCacheCheck.cached ? initialCacheCheck.cached.case : null
  );
  const [_awarenessMonth, setAwarenessMonth] = useState<string | null>(() =>
    initialCacheCheck.isValid && initialCacheCheck.cached
      ? initialCacheCheck.cached.awarenessMonth
      : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialCacheCheck.isValid);
  const [error, setError] = useState<Error | { message: string } | null>(null);

  // Get current awareness month for banner
  const currentAwareness = getAwarenessMonth();

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
          throw new Error('No case data returned for Case of the Day by API.');
        }
        const transformedCase = transformApiData(rawData);
        if (!transformedCase) {
          throw new Error('Failed to transform case data.');
        }
        setCaseData(transformedCase);
        setAwarenessMonth(rawData.awarenessMonth || null);
        try {
          localStorage.setItem(
            'caseOfTheDay',
            JSON.stringify({
              case: transformedCase,
              date: getTodayString(),
              awarenessMonth: rawData.awarenessMonth || null,
              hashtags: rawData.hashtags || [],
            })
          );
        } catch (storageError) {
          console.warn('Failed to cache case of the day:', storageError);
          // Continue without caching - not critical
        }
      })
      .catch((err: Error) => {
        console.error('Error fetching Case of the Day:', err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [initialCacheCheck.isValid]);

  // Build page title - append awareness month if applicable
  const pageTitle = currentAwareness
    ? `Case of the Day - ${currentAwareness.name}`
    : 'Case of the Day';

  return (
    <CaseDisplay
      pageTitle={pageTitle}
      pageIcon={<CalendarDays size={SIZE.ICON.LG} className="text-brand-primary" />}
      caseData={caseData}
      isLoading={isLoading}
      error={error}
    />
  );
}
