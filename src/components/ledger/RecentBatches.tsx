import { motion } from 'framer-motion';
import { Boxes, ExternalLink, Clock } from 'lucide-react';
import type { LedgerCreditBatch } from '../../types/ledger';
import { formatShortDate } from '../../lib/formatters';

interface RecentBatchesProps {
  batches: LedgerCreditBatch[];
}

export default function RecentBatches({ batches }: RecentBatchesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Boxes size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-soil)' }} />
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            Recent Credit Batches
          </h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          Latest credit batch issuances on the Regen Ledger
        </p>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        {batches.map((batch) => (
          <div
            key={batch.denom}
            className="px-5 py-3 transition-colors hover:bg-[var(--zfp-cream)]"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--zfp-cream-dark)' }}
              >
                <Clock size={14} strokeWidth={1.75} style={{ color: 'var(--zfp-text-light)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium break-all"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                >
                  {batch.denom}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>
                  <span>Project: <strong style={{ color: 'var(--zfp-text-muted)' }}>{batch.projectId}</strong></span>
                  <span>Class: <strong style={{ color: 'var(--zfp-text-muted)' }}>{batch.classId}</strong></span>
                  <span>Jurisdiction: <strong style={{ color: 'var(--zfp-text-muted)' }}>{batch.jurisdiction}</strong></span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
                  <span>Crediting: {formatShortDate(batch.startDate)} — {formatShortDate(batch.endDate)}</span>
                  <span>Issued: {formatShortDate(batch.issuanceDate)}</span>
                </div>
              </div>

              <a
                href={`https://app.regen.network/credit-batches/${batch.denom}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md transition-colors hover:bg-[var(--zfp-cream-dark)] flex-shrink-0"
                style={{ color: 'var(--zfp-text-light)' }}
              >
                <ExternalLink size={13} strokeWidth={1.75} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
