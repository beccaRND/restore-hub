import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Shield,
} from 'lucide-react';
import type { RequirementReview, Confidence } from '../../data/mock-applications';
import type { ReviewRequirement } from '../../data/review-requirements';

const STATUS_CONFIG = {
  satisfied: {
    icon: CheckCircle2,
    label: 'Satisfied',
    color: 'var(--status-available)',
    bg: 'var(--zfp-green-pale)',
  },
  partial: {
    icon: AlertTriangle,
    label: 'Partial',
    color: 'var(--status-conversation)',
    bg: 'var(--zfp-soil-pale)',
  },
  missing: {
    icon: XCircle,
    label: 'Missing',
    color: '#DC2626',
    bg: '#FEE2E2',
  },
  needs_review: {
    icon: Search,
    label: 'Needs Human Review',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
} as const;

const CONFIDENCE_CONFIG: Record<Confidence, { icon: typeof ShieldCheck; label: string; color: string }> = {
  high: { icon: ShieldCheck, label: 'High', color: 'var(--status-available)' },
  medium: { icon: ShieldAlert, label: 'Medium', color: 'var(--status-conversation)' },
  low: { icon: Shield, label: 'Low', color: '#DC2626' },
};

interface ReviewOutputProps {
  reviews: RequirementReview[];
  requirements: ReviewRequirement[];
  coverageScore: number;
  satisfiedCount: number;
  totalRequirements: number;
}

export default function ReviewOutput({
  reviews,
  requirements,
  coverageScore,
  satisfiedCount,
  totalRequirements,
}: ReviewOutputProps) {
  // Sort: needs_review first, then missing, partial, satisfied
  const sortOrder = { needs_review: 0, missing: 1, partial: 2, satisfied: 3 };
  const sortedReviews = [...reviews].sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);

  const needsReviewItems = reviews.filter((r) => r.status === 'needs_review');
  const missingItems = reviews.filter((r) => r.status === 'missing');
  const partialItems = reviews.filter((r) => r.status === 'partial');

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}>
          AI Review Results
        </h3>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          Automated analysis of application documents
        </p>
      </div>

      {/* Coverage score bar */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>
            Coverage Score
          </span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-mono)', color: coverageScore >= 80 ? 'var(--zfp-green)' : coverageScore >= 50 ? 'var(--zfp-soil)' : '#DC2626' }}
          >
            {satisfiedCount} of {totalRequirements} — {coverageScore}%
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--zfp-cream-dark)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${coverageScore}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              backgroundColor: coverageScore >= 80 ? 'var(--zfp-green)' : coverageScore >= 50 ? 'var(--zfp-soil)' : '#DC2626',
            }}
          />
        </div>

        {/* Quick status summary */}
        <div className="flex gap-4 mt-3">
          {needsReviewItems.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#7C3AED' }}>
              <Search size={12} strokeWidth={2} /> {needsReviewItems.length} needs review
            </span>
          )}
          {missingItems.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#DC2626' }}>
              <XCircle size={12} strokeWidth={2} /> {missingItems.length} missing
            </span>
          )}
          {partialItems.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--status-conversation)' }}>
              <AlertTriangle size={12} strokeWidth={2} /> {partialItems.length} partial
            </span>
          )}
        </div>
      </div>

      {/* Requirement reviews */}
      <div className="divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        {sortedReviews.map((review) => {
          const req = requirements.find((r) => r.id === review.requirementId);
          if (!req) return null;
          return (
            <ReviewItem key={review.requirementId} review={review} requirement={req} />
          );
        })}
      </div>
    </div>
  );
}

function ReviewItem({ review, requirement }: { review: RequirementReview; requirement: ReviewRequirement }) {
  const [expanded, setExpanded] = useState(review.status !== 'satisfied');
  const config = STATUS_CONFIG[review.status];
  const Icon = config.icon;
  const confidenceConfig = CONFIDENCE_CONFIG[review.confidence];
  const ConfidenceIcon = confidenceConfig.icon;

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-[var(--zfp-cream)]"
      >
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
          style={{ backgroundColor: config.bg }}
        >
          <Icon size={14} strokeWidth={2} style={{ color: config.color }} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>
            {requirement.name}
          </p>
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold mt-0.5"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: confidenceConfig.color }}>
          <ConfidenceIcon size={12} strokeWidth={2} />
          {confidenceConfig.label}
        </span>
        {expanded ? (
          <ChevronDown size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-text-muted)' }} />
        ) : (
          <ChevronRight size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-text-muted)' }} />
        )}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-5 pb-4"
        >
          <div className="ml-10 space-y-3">
            {/* Evidence */}
            <div
              className="rounded-lg p-3 border"
              style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--zfp-text-muted)' }}>
                Evidence Found
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--zfp-text)' }}>
                {review.evidence}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <FileText size={11} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
                <span className="text-[10px] font-medium" style={{ color: 'var(--zfp-green)' }}>
                  {review.sourceDocument}
                </span>
              </div>
            </div>

            {/* Issues */}
            {review.issues.length > 0 && (
              <div
                className="rounded-lg p-3 border"
                style={{
                  borderColor: review.status === 'missing' ? '#FECACA' : '#FDE68A',
                  backgroundColor: review.status === 'missing' ? '#FEF2F2' : '#FFFBEB',
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: review.status === 'missing' ? '#DC2626' : '#92400E' }}>
                  Issues Flagged
                </p>
                <ul className="space-y-1">
                  {review.issues.map((issue, i) => (
                    <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--zfp-text)' }}>
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: review.status === 'missing' ? '#DC2626' : '#D97706' }} />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
