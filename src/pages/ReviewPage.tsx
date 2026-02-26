import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, ArrowLeft } from 'lucide-react';
import { MOCK_APPLICATIONS } from '../data/mock-applications';
import { DEFAULT_REQUIREMENTS } from '../data/review-requirements';
import type { ReviewRequirement } from '../data/review-requirements';
import ReviewQueue from '../components/review/ReviewQueue';
import UploadZone from '../components/review/UploadZone';
import RequirementsChecklist from '../components/review/RequirementsChecklist';
import ReviewOutput from '../components/review/ReviewOutput';
import ApplicantSummary from '../components/review/ApplicantSummary';

export default function ReviewPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<ReviewRequirement[]>(DEFAULT_REQUIREMENTS);
  const [showReview, setShowReview] = useState(false);

  const selectedApp = selectedId ? MOCK_APPLICATIONS.find((a) => a.id === selectedId) : null;
  const activeRequirements = requirements.filter((r) => r.active);

  const handleToggleRequirement = useCallback((id: string) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setShowReview(false);
  }, []);

  const handleReview = useCallback(() => {
    // In production, this would call an AI API. For demo, we just show the mock data.
    setShowReview(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div
        className="rounded-xl px-6 py-5"
        style={{ background: 'var(--gradient-earth)', color: '#FFFFFF' }}
      >
        <div className="flex items-center gap-3 mb-1">
          <ClipboardCheck size={20} strokeWidth={1.75} />
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255, 255, 255, 0.85)' }}
          >
            Application Review
          </h2>
        </div>
        <p className="text-sm opacity-80">
          AI-assisted scoring and review of grant applications. Upload documents, configure requirements, and get
          automated coverage analysis with evidence citations.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Applications"
          value={String(MOCK_APPLICATIONS.length)}
          color="var(--zfp-green)"
        />
        <StatCard
          label="AI Reviewed"
          value={String(MOCK_APPLICATIONS.filter((a) => a.status !== 'pending').length)}
          color="#7C3AED"
        />
        <StatCard
          label="Avg Coverage"
          value={`${Math.round(MOCK_APPLICATIONS.reduce((s, a) => s + a.coverageScore, 0) / MOCK_APPLICATIONS.length)}%`}
          color="var(--zfp-soil)"
        />
        <StatCard
          label="Approved"
          value={String(MOCK_APPLICATIONS.filter((a) => a.status === 'approved').length)}
          color="var(--zfp-green-deep)"
        />
      </div>

      {/* Main content */}
      {!selectedApp ? (
        /* Queue view */
        <ReviewQueue
          applications={MOCK_APPLICATIONS}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      ) : (
        /* Detail view */
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => { setSelectedId(null); setShowReview(false); }}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
            style={{ color: 'var(--zfp-green)' }}
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
            Back to Queue
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Summary + Upload + Requirements */}
            <div className="space-y-6">
              <ApplicantSummary application={selectedApp} />
              <UploadZone
                documents={selectedApp.documents}
                onReview={handleReview}
                hasReview={showReview || selectedApp.status !== 'pending'}
              />
              <RequirementsChecklist
                requirements={requirements}
                onToggle={handleToggleRequirement}
              />
            </div>

            {/* Right column: Review output (2 cols wide) */}
            <div className="lg:col-span-2">
              {(showReview || selectedApp.status !== 'pending') ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewOutput
                    reviews={selectedApp.requirementReviews.filter((r) =>
                      activeRequirements.some((ar) => ar.id === r.requirementId)
                    )}
                    requirements={activeRequirements}
                    coverageScore={selectedApp.coverageScore}
                    satisfiedCount={selectedApp.satisfiedCount}
                    totalRequirements={selectedApp.totalRequirements}
                  />
                </motion.div>
              ) : (
                <div
                  className="rounded-xl border-2 border-dashed flex items-center justify-center h-64"
                  style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}
                >
                  <div className="text-center">
                    <ClipboardCheck size={32} strokeWidth={1.25} className="mx-auto mb-2" style={{ color: 'var(--zfp-text-light)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--zfp-text-muted)' }}>
                      Click "Review Application" to run AI analysis
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--zfp-text-light)' }}>
                      Upload documents and configure requirements first
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border p-4"
      style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)' }}
    >
      <p
        className="text-lg font-bold"
        style={{ fontFamily: 'var(--font-mono)', color }}
      >
        {value}
      </p>
      <p className="text-[11px]" style={{ color: 'var(--zfp-text-muted)' }}>
        {label}
      </p>
    </motion.div>
  );
}
