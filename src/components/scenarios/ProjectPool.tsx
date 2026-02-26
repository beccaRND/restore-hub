import { useState, useMemo } from 'react';
import { Search, Sprout, MapPin, Plus } from 'lucide-react';
import type { FarmProject } from '../../types/project';
import type { FundingPot } from '../../data/funding-sources';
import { PRACTICE_LABELS } from '../../types/project';
import { formatCurrencyFull } from '../../lib/formatters';

interface ProjectPoolProps {
  projects: FarmProject[];
  assignedProjectIds: Set<string>;
  fundingPots: FundingPot[];
  onAssign: (projectId: string, potId: string) => void;
  /** Optional review scores from the review page mock data */
  reviewScores?: Record<string, number>;
}

export default function ProjectPool({
  projects,
  assignedProjectIds,
  fundingPots,
  onAssign,
  reviewScores = {},
}: ProjectPoolProps) {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const states = useMemo(() => {
    const s = new Set(projects.map((p) => p.location.state));
    return ['all', ...Array.from(s).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (assignedProjectIds.has(p.id)) return false;
      if (stateFilter !== 'all' && p.location.state !== stateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.farmName.toLowerCase().includes(q) ||
          p.location.county.toLowerCase().includes(q) ||
          p.location.state.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, assignedProjectIds, stateFilter, search]);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}>
          Project Pool
        </h3>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          {filtered.length} eligible projects available
        </p>
      </div>

      {/* Search & filter */}
      <div className="px-4 py-3 border-b space-y-2" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="relative">
          <Search
            size={14}
            strokeWidth={1.75}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--zfp-text-muted)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-8 pr-3 py-2 rounded-lg border text-xs outline-none transition-colors focus:border-[var(--zfp-green)]"
            style={{
              borderColor: 'var(--zfp-border)',
              backgroundColor: 'var(--zfp-cream)',
              color: 'var(--zfp-text)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setStateFilter(st)}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: stateFilter === st ? 'var(--zfp-green)' : 'var(--zfp-cream)',
                color: stateFilter === st ? '#FFFFFF' : 'var(--zfp-text)',
                border: stateFilter === st ? 'none' : '1px solid var(--zfp-border)',
              }}
            >
              {st === 'all' ? 'All States' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Project list */}
      <div className="flex-1 overflow-y-auto max-h-[500px] divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        {filtered.map((project) => {
          const score = reviewScores[project.id];
          const isAssigning = assigningId === project.id;

          return (
            <div
              key={project.id}
              className="px-4 py-3 hover:bg-[var(--zfp-cream)] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--zfp-text)' }}>
                    {project.farmName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--zfp-text-muted)' }}>
                      <MapPin size={9} strokeWidth={2} />
                      {project.location.county}, {project.location.state}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>·</span>
                    <span className="text-[10px]" style={{ color: 'var(--zfp-text-muted)' }}>
                      {project.acreage.toLocaleString()} ac
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {project.practices.slice(0, 2).map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium"
                        style={{ backgroundColor: 'var(--zfp-green-pale)', color: 'var(--zfp-green-deep)' }}
                      >
                        <Sprout size={8} strokeWidth={2} />
                        {PRACTICE_LABELS[p]}
                      </span>
                    ))}
                    {project.practices.length > 2 && (
                      <span className="text-[9px] px-1" style={{ color: 'var(--zfp-text-light)' }}>
                        +{project.practices.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
                    {formatCurrencyFull(project.grantAmount)}
                  </p>
                  {score !== undefined && (
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: score >= 80 ? 'var(--zfp-green)' : score >= 50 ? 'var(--zfp-soil)' : '#DC2626' }}
                    >
                      {score}% score
                    </span>
                  )}
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
                    {project.cometEstimate.low}–{project.cometEstimate.high} tCO2e
                  </p>
                </div>
              </div>

              {/* Assign button / pot selector */}
              {isAssigning ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {fundingPots.map((pot) => (
                    <button
                      key={pot.id}
                      onClick={() => { onAssign(project.id, pot.id); setAssigningId(null); }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors hover:opacity-80"
                      style={{ backgroundColor: pot.color, color: '#FFFFFF' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      {pot.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setAssigningId(null)}
                    className="px-2 py-1 rounded-full text-[10px] font-medium border"
                    style={{ borderColor: 'var(--zfp-border)', color: 'var(--zfp-text-muted)' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAssigningId(project.id)}
                  className="mt-2 flex items-center gap-1 text-[11px] font-semibold transition-colors hover:underline"
                  style={{ color: 'var(--zfp-green)' }}
                >
                  <Plus size={12} strokeWidth={2} />
                  Add to Scenario
                </button>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>
              No matching projects found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
