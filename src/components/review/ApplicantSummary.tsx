import {
  User,
  MapPin,
  Sprout,
  DollarSign,
  FileText,
  Calendar,
  Printer,
} from 'lucide-react';
import type { ApplicationReview } from '../../data/mock-applications';
import { formatCurrencyFull } from '../../lib/formatters';

interface ApplicantSummaryProps {
  application: ApplicationReview;
}

export default function ApplicantSummary({ application }: ApplicantSummaryProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header with score badge */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: 'var(--gradient-earth)', color: '#FFFFFF' }}
      >
        <div>
          <h3
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255,255,255,0.95)' }}
          >
            {application.farmName}
          </h3>
          <p className="text-xs opacity-80">{application.applicantName}</p>
        </div>
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center border-2"
            style={{
              borderColor: 'rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
              {application.coverageScore}%
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider opacity-70 mt-1 block">Score</span>
        </div>
      </div>

      {/* Details grid */}
      <div className="px-5 py-4 grid grid-cols-2 gap-4">
        <DetailRow
          icon={<MapPin size={14} strokeWidth={1.75} />}
          label="Location"
          value={`${application.location.county}, ${application.location.state}`}
        />
        <DetailRow
          icon={<Sprout size={14} strokeWidth={1.75} />}
          label="Acreage"
          value={`${application.acreage.toLocaleString()} acres`}
        />
        <DetailRow
          icon={<DollarSign size={14} strokeWidth={1.75} />}
          label="Grant Requested"
          value={formatCurrencyFull(application.grantAmountRequested)}
        />
        <DetailRow
          icon={<FileText size={14} strokeWidth={1.75} />}
          label="Program"
          value={application.program}
        />
        <DetailRow
          icon={<Calendar size={14} strokeWidth={1.75} />}
          label="Submitted"
          value={new Date(application.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        />
        <DetailRow
          icon={<User size={14} strokeWidth={1.75} />}
          label="Documents"
          value={`${application.documents.length} files`}
        />
      </div>

      {/* Practices */}
      <div className="px-5 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--zfp-text-muted)' }}>
          Proposed Practices
        </p>
        <div className="flex flex-wrap gap-1.5">
          {application.practices.map((practice) => (
            <span
              key={practice}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ backgroundColor: 'var(--zfp-green-pale)', color: 'var(--zfp-green-deep)' }}
            >
              <Sprout size={10} strokeWidth={2} />
              {practice}
            </span>
          ))}
        </div>
      </div>

      {/* Print button */}
      <div className="px-5 pb-4">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-xs font-medium transition-colors hover:underline"
          style={{ color: 'var(--zfp-green)' }}
        >
          <Printer size={13} strokeWidth={1.75} />
          Print Summary
        </button>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5" style={{ color: 'var(--zfp-green)' }}>{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--zfp-text-light)' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>{value}</p>
      </div>
    </div>
  );
}
