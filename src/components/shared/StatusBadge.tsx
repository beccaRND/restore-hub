import type { AvailabilityStatus } from '../../types/project';
import { AVAILABILITY_LABELS } from '../../types/project';

const STATUS_STYLES: Record<AvailabilityStatus, { bg: string; text: string; dot: string }> = {
  available: {
    bg: 'var(--zfp-green-pale)',
    text: 'var(--zfp-green)',
    dot: 'var(--status-available)',
  },
  in_conversation: {
    bg: 'var(--zfp-soil-pale)',
    text: 'var(--status-conversation)',
    dot: 'var(--status-conversation)',
  },
  committed: {
    bg: 'var(--zfp-green-pale)',
    text: 'var(--status-committed)',
    dot: 'var(--status-committed)',
  },
  private: {
    bg: '#F3F4F6',
    text: 'var(--status-private)',
    dot: 'var(--status-private)',
  },
};

interface StatusBadgeProps {
  status: AvailabilityStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        fontFamily: 'var(--font-body)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: style.dot }}
      />
      {AVAILABILITY_LABELS[status]}
    </span>
  );
}
