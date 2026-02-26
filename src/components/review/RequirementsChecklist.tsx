import { useState } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronRight, ListChecks } from 'lucide-react';
import type { ReviewRequirement } from '../../data/review-requirements';

interface RequirementsChecklistProps {
  requirements: ReviewRequirement[];
  onToggle: (id: string) => void;
}

export default function RequirementsChecklist({ requirements, onToggle }: RequirementsChecklistProps) {
  const [expanded, setExpanded] = useState(true);
  const activeCount = requirements.filter((r) => r.active).length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 border-b text-left"
        style={{ borderColor: 'var(--zfp-border)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <ListChecks size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
            <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}>
              Requirements Checklist
            </h3>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
            {activeCount} of {requirements.length} requirements active
          </p>
        </div>
        {expanded ? (
          <ChevronDown size={18} strokeWidth={1.75} style={{ color: 'var(--zfp-text-muted)' }} />
        ) : (
          <ChevronRight size={18} strokeWidth={1.75} style={{ color: 'var(--zfp-text-muted)' }} />
        )}
      </button>

      {expanded && (
        <div className="px-5 py-3 space-y-1 max-h-[400px] overflow-y-auto">
          {requirements.map((req) => (
            <button
              key={req.id}
              onClick={() => onToggle(req.id)}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-[var(--zfp-cream)]"
            >
              {req.active ? (
                <CheckSquare
                  size={18}
                  strokeWidth={1.75}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: 'var(--zfp-green)' }}
                />
              ) : (
                <Square
                  size={18}
                  strokeWidth={1.75}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: 'var(--zfp-text-light)' }}
                />
              )}
              <div className="min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{ color: req.active ? 'var(--zfp-text)' : 'var(--zfp-text-light)' }}
                >
                  {req.name}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
                  {req.evidenceNeeded}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
