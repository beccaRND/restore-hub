import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { AvailabilityStatus, FundSource, PracticeType } from '../../types/project';
import { PRACTICE_LABELS, FUND_SOURCE_LABELS, AVAILABILITY_LABELS } from '../../types/project';
import { STATES } from '../../lib/constants';

export interface ProjectFilterState {
  search: string;
  states: string[];
  practices: PracticeType[];
  availability: AvailabilityStatus[];
  fundSources: FundSource[];
  acreageMin: number;
  acreageMax: number;
  carbonMin: number;
  carbonMax: number;
}

export const DEFAULT_FILTERS: ProjectFilterState = {
  search: '',
  states: [],
  practices: [],
  availability: [],
  fundSources: [],
  acreageMin: 0,
  acreageMax: 1000,
  carbonMin: 0,
  carbonMax: 5000,
};

interface ProjectFiltersProps {
  filters: ProjectFilterState;
  onChange: (filters: ProjectFilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export default function ProjectFilters({ filters, onChange, totalCount, filteredCount }: ProjectFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters =
    filters.states.length > 0 ||
    filters.practices.length > 0 ||
    filters.availability.length > 0 ||
    filters.fundSources.length > 0;

  const activeCount = filters.states.length + filters.practices.length + filters.availability.length + filters.fundSources.length;

  function toggleArrayItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  return (
    <div className="space-y-3">
      {/* Search + filter toggle row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search farms by name, county, or state..."
            className="w-full pl-4 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[var(--zfp-green)]"
            style={{
              backgroundColor: 'var(--zfp-cream-dark)',
              borderColor: 'var(--zfp-border)',
              color: 'var(--zfp-text)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors"
          style={{
            backgroundColor: hasActiveFilters ? 'var(--zfp-green-pale)' : 'var(--zfp-cream-dark)',
            borderColor: hasActiveFilters ? 'var(--zfp-green-light)' : 'var(--zfp-border)',
            color: hasActiveFilters ? 'var(--zfp-green)' : 'var(--zfp-text)',
          }}
        >
          <Filter size={16} strokeWidth={1.75} />
          Filters
          {activeCount > 0 && (
            <span
              className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--zfp-green)', color: '#fff' }}
            >
              {activeCount}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-sm transition-colors hover:text-[var(--zfp-green)]"
            style={{ color: 'var(--zfp-text-muted)' }}
          >
            <X size={14} strokeWidth={1.75} />
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-sm" style={{ color: 'var(--zfp-text-muted)' }}>
        Showing <span className="font-semibold" style={{ color: 'var(--zfp-text)' }}>{filteredCount}</span> of {totalCount} projects
      </p>

      {/* Expanded filter panel */}
      {expanded && (
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--zfp-cream-dark)',
            borderColor: 'var(--zfp-border)',
          }}
        >
          {/* State filter */}
          <FilterGroup label="State / Region">
            {STATES.map((state) => (
              <FilterChip
                key={state}
                label={state}
                active={filters.states.includes(state)}
                onClick={() => onChange({ ...filters, states: toggleArrayItem(filters.states, state) })}
              />
            ))}
          </FilterGroup>

          {/* Practice filter */}
          <FilterGroup label="Practice Type">
            {(Object.keys(PRACTICE_LABELS) as PracticeType[]).map((practice) => (
              <FilterChip
                key={practice}
                label={PRACTICE_LABELS[practice]}
                active={filters.practices.includes(practice)}
                onClick={() => onChange({ ...filters, practices: toggleArrayItem(filters.practices, practice) })}
              />
            ))}
          </FilterGroup>

          {/* Availability filter */}
          <FilterGroup label="Availability">
            {(Object.keys(AVAILABILITY_LABELS) as AvailabilityStatus[]).map((status) => (
              <FilterChip
                key={status}
                label={AVAILABILITY_LABELS[status]}
                active={filters.availability.includes(status)}
                onClick={() => onChange({ ...filters, availability: toggleArrayItem(filters.availability, status) })}
              />
            ))}
          </FilterGroup>

          {/* Fund source filter */}
          <FilterGroup label="Fund Source">
            {(Object.keys(FUND_SOURCE_LABELS) as FundSource[]).map((source) => (
              <FilterChip
                key={source}
                label={FUND_SOURCE_LABELS[source]}
                active={filters.fundSources.includes(source)}
                onClick={() => onChange({ ...filters, fundSources: toggleArrayItem(filters.fundSources, source) })}
              />
            ))}
          </FilterGroup>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--zfp-text-muted)' }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
      style={{
        backgroundColor: active ? 'var(--zfp-green)' : 'transparent',
        borderColor: active ? 'var(--zfp-green)' : 'var(--zfp-border-strong)',
        color: active ? '#fff' : 'var(--zfp-text)',
      }}
    >
      {label}
    </button>
  );
}
