import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  Filter,
  Clock,
  Sparkles,
  UserCheck,
  ThumbsUp,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import type { ApplicationReview, ApplicationStatus } from '../../data/mock-applications';
import { formatCurrencyFull } from '../../lib/formatters';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: 'Pending Review', icon: Clock, color: 'var(--zfp-text-muted)', bg: '#F3F4F6' },
  ai_reviewed: { label: 'AI Reviewed', icon: Sparkles, color: '#7C3AED', bg: '#EDE9FE' },
  human_verified: { label: 'Human Verified', icon: UserCheck, color: 'var(--zfp-green)', bg: 'var(--zfp-green-pale)' },
  approved: { label: 'Approved', icon: ThumbsUp, color: 'var(--zfp-green-deep)', bg: 'var(--zfp-green-pale)' },
  rejected: { label: 'Rejected', icon: XCircle, color: '#DC2626', bg: '#FEE2E2' },
};

type SortField = 'coverageScore' | 'grantAmountRequested' | 'acreage' | 'submittedDate';

interface ReviewQueueProps {
  applications: ApplicationReview[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ReviewQueue({ applications, selectedId, onSelect }: ReviewQueueProps) {
  const [sortField, setSortField] = useState<SortField>('submittedDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let list = [...applications];

    if (statusFilter !== 'all') {
      list = list.filter((a) => a.status === statusFilter);
    }

    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return list;
  }, [applications, sortField, sortAsc, statusFilter]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--zfp-border)' }}>
        <div>
          <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}>
            Review Queue
          </h3>
          <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
            {filteredAndSorted.length} applications in this round
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-[var(--zfp-cream)]"
          style={{ borderColor: 'var(--zfp-border)', color: 'var(--zfp-text)' }}
        >
          <Filter size={13} strokeWidth={1.75} />
          Filters
        </button>
      </div>

      {/* Filters bar */}
      {showFilters && (
        <div className="px-5 py-3 border-b flex flex-wrap gap-2" style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}>
          <FilterChip label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
          <FilterChip label="Pending" active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} />
          <FilterChip label="AI Reviewed" active={statusFilter === 'ai_reviewed'} onClick={() => setStatusFilter('ai_reviewed')} />
          <FilterChip label="Human Verified" active={statusFilter === 'human_verified'} onClick={() => setStatusFilter('human_verified')} />
          <FilterChip label="Approved" active={statusFilter === 'approved'} onClick={() => setStatusFilter('approved')} />
          <FilterChip label="Rejected" active={statusFilter === 'rejected'} onClick={() => setStatusFilter('rejected')} />

          <div className="flex-1" />

          <SortButton label="Score" field="coverageScore" current={sortField} asc={sortAsc} onSort={handleSort} />
          <SortButton label="Amount" field="grantAmountRequested" current={sortField} asc={sortAsc} onSort={handleSort} />
          <SortButton label="Acres" field="acreage" current={sortField} asc={sortAsc} onSort={handleSort} />
          <SortButton label="Date" field="submittedDate" current={sortField} asc={sortAsc} onSort={handleSort} />
        </div>
      )}

      {/* Application list */}
      <div className="divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        {filteredAndSorted.map((app, i) => {
          const statusConf = STATUS_CONFIG[app.status];
          const StatusIcon = statusConf.icon;
          const isSelected = app.id === selectedId;

          return (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              onClick={() => onSelect(app.id)}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--zfp-green-pale)' : 'transparent',
                borderLeft: isSelected ? '3px solid var(--zfp-green)' : '3px solid transparent',
              }}
            >
              {/* Score circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: app.coverageScore >= 80 ? 'var(--zfp-green-pale)' : app.coverageScore >= 50 ? 'var(--zfp-soil-pale)' : '#FEE2E2',
                  color: app.coverageScore >= 80 ? 'var(--zfp-green)' : app.coverageScore >= 50 ? 'var(--zfp-soil)' : '#DC2626',
                }}
              >
                <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                  {app.coverageScore}%
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--zfp-text)' }}>
                  {app.farmName}
                </p>
                <p className="text-[11px] truncate" style={{ color: 'var(--zfp-text-muted)' }}>
                  {app.applicantName} · {app.location.county}, {app.location.state} · {app.acreage.toLocaleString()} acres
                </p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
                  {formatCurrencyFull(app.grantAmountRequested)}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
                  {app.program}
                </p>
              </div>

              {/* Status badge */}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 uppercase tracking-wider"
                style={{ backgroundColor: statusConf.bg, color: statusConf.color }}
              >
                <StatusIcon size={10} strokeWidth={2} />
                <span className="hidden md:inline">{statusConf.label}</span>
              </span>

              <ChevronRight size={14} strokeWidth={1.75} style={{ color: 'var(--zfp-text-light)' }} className="flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
      style={{
        backgroundColor: active ? 'var(--zfp-green)' : 'var(--zfp-white)',
        color: active ? '#FFFFFF' : 'var(--zfp-text)',
        border: active ? 'none' : '1px solid var(--zfp-border)',
      }}
    >
      {label}
    </button>
  );
}

function SortButton({
  label,
  field,
  current,
  asc,
  onSort,
}: {
  label: string;
  field: SortField;
  current: SortField;
  asc: boolean;
  onSort: (field: SortField) => void;
}) {
  const isActive = current === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors"
      style={{
        color: isActive ? 'var(--zfp-green)' : 'var(--zfp-text-muted)',
      }}
    >
      <ArrowUpDown size={10} strokeWidth={2} />
      {label}
      {isActive && <span className="text-[9px]">{asc ? '↑' : '↓'}</span>}
    </button>
  );
}
