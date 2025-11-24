// src/pages/CaseOverview.tsx
import React, { useEffect, useState, useMemo, useTransition } from 'react';
import { Loader2, AlertCircle, Book, Briefcase, Globe, Stethoscope } from 'lucide-react';
import {
  ContentCard,
  ContentSearch,
  ContentSort,
  ActiveFilterBadges,
  LoadMoreButton,
  EmptyState,
  useProgressiveLoad,
  type ActiveFilter,
} from '@krisarmstrong/web-foundation';
import { getAllCases } from '../api';
import { transformApiData } from '../utils/caseUtils';
import { TransformedCase } from '../types';

export default function CaseOverview(): React.ReactElement {
  const [allCases, setAllCases] = useState<TransformedCase[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<TransformedCase[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'severity' | 'duration' | 'alphabetical'>(
    'newest'
  );

  // React 19: Show pending state during tag filtering
  const [isPending, startTransition] = useTransition();

  // Fetch cases on mount
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        const casesData = await getAllCases();
        if (!Array.isArray(casesData)) throw new Error('Cases data is not an array.');
        const transformed = casesData.map(transformApiData).filter(Boolean) as TransformedCase[];
        setAllCases(transformed);
        setError(null);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('Failed to load cases. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, []);

  // Sort cases
  const sortedCases = useMemo(() => {
    const cases = [...allCases];
    return cases.sort((a, b) => {
      switch (sortBy) {
        case 'severity': {
          const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          const severityA = severityOrder[a.severity as keyof typeof severityOrder] ?? 99;
          const severityB = severityOrder[b.severity as keyof typeof severityOrder] ?? 99;
          return severityA - severityB;
        }
        case 'duration': {
          return (b.durationMinutes || 0) - (a.durationMinutes || 0);
        }
        case 'alphabetical': {
          return a.title.localeCompare(b.title);
        }
        case 'newest':
        default: {
          const dateA = a.incidentDate ? new Date(a.incidentDate).getTime() : 0;
          const dateB = b.incidentDate ? new Date(b.incidentDate).getTime() : 0;
          return dateB - dateA;
        }
      }
    });
  }, [allCases, sortBy]);

  // Use search results if searching, otherwise use sorted cases
  const isSearching = searchQuery.trim().length > 0;
  const casesToFilter = isSearching ? searchResults : sortedCases;

  const hasFilters = isSearching || selectedTags.length > 0;
  const totalCount = sortedCases.length;

  // Filter by selected tag
  const filteredCases = useMemo(() => {
    if (selectedTags.length === 0) return casesToFilter;
    return casesToFilter.filter(
      (c) => Array.isArray(c.tags) && selectedTags.every((t) => c.tags.includes(t))
    );
  }, [casesToFilter, selectedTags]);

  // Progressive loading
  const {
    visibleItems: visibleCases,
    remainingCount,
    loadMore,
    hasMore,
  } = useProgressiveLoad(filteredCases, { itemsPerLoad: 12, initialCount: 12 });

  // Active filters for badge display
  const activeFilters: ActiveFilter[] = selectedTags.map((tag) => ({
    id: `tag-${tag}`,
    value: tag,
    onRemove: () =>
      startTransition(() =>
        setSelectedTags((prev) => prev.filter((t) => t.toLowerCase() !== tag.toLowerCase()))
      ),
  }));

  const getIndustryIcon = (sectorName: string | undefined): React.ReactNode => {
    const lowerSector = sectorName?.toLowerCase() || '';
    if (lowerSector.includes('healthcare')) return <Stethoscope className="inline mr-1 h-4 w-4" />;
    if (lowerSector.includes('education')) return <Book className="inline mr-1 h-4 w-4" />;
    if (lowerSector.includes('retail') || lowerSector.includes('commercial'))
      return <Briefcase className="inline mr-1 h-4 w-4" />;
    return <Globe className="inline mr-1 h-4 w-4" />;
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center p-10 min-h-[300px]">
          <Loader2 size={48} className="animate-spin text-brand-primary mb-4" />
          <p className="text-lg">Loading cases...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center p-10 min-h-[300px] bg-error/20 border border-error/50 rounded-lg">
          <AlertCircle size={48} className="text-error mb-4" />
          <p className="text-lg text-error">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Case Files</h1>
        <p className="text-text-muted mb-8">
          Real-world network investigations, security incidents, and troubleshooting case studies
          from enterprise Wi-Fi deployments.
        </p>
      </header>

      {/* Search */}
      <ContentSearch
        items={sortedCases}
        onSearch={(results, meta) => {
          setSearchResults(results);
          setSearchQuery(meta?.query ?? '');
        }}
        onQueryChange={setSearchQuery}
        searchFields={[
          'title',
          'summary',
          'incidentOverview',
          'investigationBreakdown',
          'rootCause',
          'resolution',
          'verdict',
          'tags',
          'sector',
          'subsector',
          'tool',
          'location',
          'category',
          'detectedBy',
          'impactScope',
          'validatedBy',
        ]}
        placeholder="Search all case content..."
        accentColor="emerald"
        showResultCount
        className="mb-6"
      />

      {/* Filters and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
        {/* Active Filter Display */}
        <div className="flex-1">
          <ActiveFilterBadges
            filters={activeFilters}
            resultCount={filteredCases.length}
            resultLabel="cases"
            accentColor="emerald"
            emptyMessage={
              hasFilters
                ? `Showing ${filteredCases.length} of ${totalCount} cases`
                : `Click tags on cases to filter • Showing all ${totalCount} cases`
            }
          />
        </div>

        {/* Sort */}
        <ContentSort
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'newest', label: 'Newest First' },
            { value: 'severity', label: 'By Severity' },
            { value: 'duration', label: 'By Duration' },
            { value: 'alphabetical', label: 'A-Z' },
          ]}
          accentColor="emerald"
        />
      </div>

      {/* Cases Grid */}
      {visibleCases.length > 0 ? (
        <>
          <div
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}
          >
            {visibleCases.map((c: TransformedCase, idx: number) => (
              <ContentCard
                key={c.id}
                href={`/cases/${c.publicId}`}
                title={c.title}
                excerpt={c.summary || c.incidentOverview}
                date={c.incidentDate}
                durationMinutes={c.durationMinutes}
                tags={c.tags}
                onTagClick={(tag) =>
                  startTransition(() => {
                    setSelectedTags((prev) => {
                      const exists = prev.some((t) => t.toLowerCase() === tag.toLowerCase());
                      return exists
                        ? prev.filter((t) => t.toLowerCase() !== tag.toLowerCase())
                        : [...prev, tag];
                    });
                  })
                }
                severity={c.severity}
                status={c.status}
                metadata={`${c.sector?.replace(/_/g, ' ') || 'N/A'}${c.subsector ? ` • ${c.subsector.replace(/_/g, ' ')}` : ''}${c.tool ? ` • ${c.tool}` : ''}`}
                metadataIcon={getIndustryIcon(c.sector)}
                accentColor="blue"
                animationDelay={idx * 50}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <LoadMoreButton
              remainingCount={remainingCount}
              itemsPerLoad={12}
              onLoadMore={loadMore}
              itemLabel="cases"
              accentColor="emerald"
              variant="secondary"
              className="mt-8"
            />
          )}

          {/* All Loaded Message */}
          {!hasMore && filteredCases.length > 12 && (
            <div className="text-center py-8 text-text-muted">
              <p className="text-sm">✓ All cases loaded ({filteredCases.length} total)</p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No matching cases found"
          description="Try adjusting your search or filters"
          action={
            selectedTags.length > 0
              ? {
                  label: 'Clear Filters',
                  onClick: () => startTransition(() => setSelectedTags([])),
                }
              : undefined
          }
          accentColor="gray"
          minHeight="300px"
        />
      )}
    </section>
  );
}
