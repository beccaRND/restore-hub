import { motion } from 'framer-motion';
import { Shield, ExternalLink, Link2 } from 'lucide-react';

interface ProvenanceCardProps {
  iri: string;
  projectId?: string;
  compact?: boolean;
}

export default function ProvenanceCard({ iri, projectId, compact }: ProvenanceCardProps) {
  const regenAppUrl = projectId
    ? `https://app.regen.network/project/${projectId}`
    : undefined;

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{
          backgroundColor: 'var(--zfp-cream)',
          border: '1px solid var(--zfp-border)',
        }}
      >
        <Shield size={12} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
        <span style={{ color: 'var(--zfp-text-muted)' }}>On-chain:</span>
        <span
          className="truncate"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-light)', maxWidth: 200 }}
        >
          {iri}
        </span>
        {regenAppUrl && (
          <a
            href={regenAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex-shrink-0"
            style={{ color: 'var(--zfp-green)' }}
          >
            <ExternalLink size={12} strokeWidth={1.75} />
          </a>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="rounded-xl border p-4"
      style={{
        backgroundColor: 'var(--zfp-cream)',
        borderColor: 'var(--zfp-green-light)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--zfp-green-pale)' }}
        >
          <Shield size={14} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
        </div>
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--zfp-green)' }}
          >
            Data Anchored on Regen Ledger
          </p>
          <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
            Verified and immutable on-chain provenance
          </p>
        </div>
      </div>

      {/* IRI */}
      <div
        className="rounded-lg px-3 py-2 mb-3"
        style={{ backgroundColor: 'var(--zfp-cream-dark)' }}
      >
        <p className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--zfp-text-muted)' }}>
          Content IRI
        </p>
        <p
          className="text-[11px] break-all"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-light)' }}
        >
          {iri}
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-2">
        {regenAppUrl && (
          <a
            href={regenAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--zfp-green-pale)]"
            style={{
              backgroundColor: 'var(--zfp-cream-dark)',
              color: 'var(--zfp-green)',
              border: '1px solid var(--zfp-green-light)',
            }}
          >
            <ExternalLink size={12} strokeWidth={1.75} />
            View on Regen
          </a>
        )}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px]"
          style={{ color: 'var(--zfp-text-light)' }}
        >
          <Link2 size={11} strokeWidth={1.75} />
          powered by Regen
        </span>
      </div>
    </motion.div>
  );
}
