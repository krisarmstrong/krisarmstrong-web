// src/components/CaseFilters.tsx
import { useState, useEffect, useMemo, memo } from 'react';
import { getSubsectors } from '../api';
import { Button } from './ui/Button.jsx';
import { Sector, Subsector, TransformedCase } from '@/types';

interface FilterOption {
  id?: string | number;
  name: string;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  srOnlyLabel?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

// FilterSelect component - Memoized for performance
const FilterSelect = memo(function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
  srOnlyLabel = false,
  disabled = false,
  placeholder,
}: FilterSelectProps): React.ReactElement {
  return (
    <div className="flex-grow sm:flex-grow-0">
      <label
        htmlFor={id}
        className={`block text-xs font-medium text-text-muted mb-1 ${srOnlyLabel ? 'sr-only' : ''}`}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-surface-raised border border-surface-border text-text-primary px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">
          {placeholder || `All ${label.replace('Filter by ', '').replace('s', '')}`}
        </option>
        {Array.isArray(options) &&
          options.map((opt) => (
            <option key={opt.id || opt.name} value={opt.name}>
              {opt.name}
            </option>
          ))}
      </select>
    </div>
  );
});

interface CaseFiltersProps {
  sectors: Sector[];
  initialCasesForOptions: TransformedCase[];
  casesToFilter: TransformedCase[];
  onFiltersApplied: (filteredCases: TransformedCase[]) => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

// Main CaseFilters component - Memoized to prevent unnecessary re-renders
const CaseFilters = memo(
  function CaseFilters({
    sectors,
    initialCasesForOptions,
    casesToFilter,
    onFiltersApplied,
    onResetFilters,
    isLoading,
  }: CaseFiltersProps): React.ReactElement {
    const [selectedSectorName, setSelectedSectorName] = useState<string>('');
    const [subsectors, setSubsectors] = useState<Subsector[]>([]);
    const [isLoadingSubsectors, setIsLoadingSubsectors] = useState<boolean>(false);
    const [selectedSubsectorName, setSelectedSubsectorName] = useState<string>('');
    const [selectedTool, setSelectedTool] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState<string>('');

    // Derive tool and tag options from the initial full list of cases
    const toolOptions = useMemo((): FilterOption[] => {
      if (!initialCasesForOptions) return [];
      // Extract base tool names (remove app details in parentheses)
      const toolNames = initialCasesForOptions
        .map((c) => c.tool)
        .filter(Boolean)
        .map((tool) => {
          // Extract base tool name before parentheses (e.g., "EtherScope nXG (Apps...)" -> "EtherScope nXG")
          const match = tool?.match(/^([^(]+)/);
          return match ? match[1].trim() : tool;
        });

      const uniqueTools = [...new Set(toolNames)].sort();
      return uniqueTools.map((name) => ({ name: name as string }));
    }, [initialCasesForOptions]);

    const tagOptions = useMemo((): FilterOption[] => {
      if (!initialCasesForOptions) return [];
      const uniqueTags = [...new Set(initialCasesForOptions.flatMap((c) => c.tags || []))].sort();
      return uniqueTags.map((name) => ({ name }));
    }, [initialCasesForOptions]);

    // Fetch subsectors when selectedSectorName changes
    useEffect(() => {
      if (!selectedSectorName) {
        return;
      }
      const sector = sectors.find((s) => s.name === selectedSectorName);
      if (sector && sector.id) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoadingSubsectors(true);
        getSubsectors(String(sector.id))
          .then((subsectorsData) => {
            if (!Array.isArray(subsectorsData)) throw new Error('Subsectors data is not an array.');
            setSubsectors(
              subsectorsData.map((s) => ({ id: s.id, name: s.name, sector_id: s.sector_id }))
            );
          })
          .catch((err) => {
            console.error('Error fetching subsectors:', err);
            setSubsectors([]);
          })
          .finally(() => setIsLoadingSubsectors(false));
      }
    }, [selectedSectorName, sectors]);

    // Derive subsectors and reset subsector selection when sector changes
    const derivedSubsectors = useMemo(() => {
      if (!selectedSectorName) return [];
      return subsectors;
    }, [selectedSectorName, subsectors]);

    const derivedSelectedSubsector = useMemo(() => {
      if (!selectedSectorName) return '';
      return selectedSubsectorName;
    }, [selectedSectorName, selectedSubsectorName]);

    // Apply filters and call onFiltersApplied
    useEffect(() => {
      if (!casesToFilter) {
        onFiltersApplied([]);
        return;
      }
      const filtered = casesToFilter.filter((c) => {
        const sectorMatch = !selectedSectorName || c.sector === selectedSectorName;
        const subsectorMatch =
          !derivedSelectedSubsector || c.subsector === derivedSelectedSubsector;

        // Extract base tool name for comparison (remove app details)
        const baseTool = c.tool?.match(/^([^(]+)/)?.[1]?.trim() || c.tool;
        const toolMatch = !selectedTool || baseTool === selectedTool;

        const tagMatch = !selectedTag || (Array.isArray(c.tags) && c.tags.includes(selectedTag));
        return sectorMatch && subsectorMatch && toolMatch && tagMatch;
      });
      onFiltersApplied(filtered);
    }, [
      casesToFilter,
      selectedSectorName,
      derivedSelectedSubsector,
      selectedTool,
      selectedTag,
      onFiltersApplied,
    ]);

    const handleClearFilters = (): void => {
      setSelectedSectorName('');
      setSelectedSubsectorName('');
      setSelectedTool('');
      setSelectedTag('');
      if (onResetFilters) {
        onResetFilters();
      }
    };

    return (
      <div className="p-4 sm:p-6 bg-surface-raised border border-surface-border rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <FilterSelect
            id="sector-filter"
            label="Filter by Sector"
            value={selectedSectorName}
            options={sectors}
            onChange={(val) => {
              setSelectedSectorName(val);
              setSelectedSubsectorName('');
            }}
            disabled={isLoading}
            placeholder="All Sectors"
          />
          <FilterSelect
            id="subsector-filter"
            label="Filter by Subsector"
            value={derivedSelectedSubsector}
            options={derivedSubsectors}
            disabled={
              isLoading ||
              !selectedSectorName ||
              isLoadingSubsectors ||
              derivedSubsectors.length === 0
            }
            onChange={(val) => {
              setSelectedSubsectorName(val);
            }}
            placeholder="All Subsectors"
          />
          <FilterSelect
            id="tool-filter"
            label="Filter by Tool"
            value={selectedTool}
            options={toolOptions}
            onChange={(val) => {
              setSelectedTool(val);
            }}
            disabled={isLoading || toolOptions.length === 0}
            placeholder="All Tools"
          />
          <FilterSelect
            id="tag-filter"
            label="Filter by Tag"
            value={selectedTag}
            options={tagOptions}
            onChange={(val) => {
              setSelectedTag(val);
            }}
            disabled={isLoading || tagOptions.length === 0}
            placeholder="All Tags"
          />
          <Button
            onClick={handleClearFilters}
            variant="secondary"
            className="w-full sm:w-auto justify-center lg:col-start-4"
            disabled={isLoading}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  },
  (prevProps: CaseFiltersProps, nextProps: CaseFiltersProps): boolean => {
    return (
      prevProps.casesToFilter === nextProps.casesToFilter &&
      prevProps.sectors === nextProps.sectors &&
      prevProps.initialCasesForOptions === nextProps.initialCasesForOptions &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

export default CaseFilters;
