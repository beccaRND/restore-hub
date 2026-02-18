import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ExternalLink } from 'lucide-react';
import type { LedgerCreditClass, LedgerCreditType } from '../../types/ledger';

interface CreditClassExplorerProps {
  classes: LedgerCreditClass[];
  creditTypes: LedgerCreditType[];
}

const TYPE_COLORS: Record<string, string> = {
  C: 'var(--zfp-green)',
  BT: '#8B6914',
  KSH: '#52B788',
  MBS: '#2563eb',
  USS: '#9333ea',
};

export default function CreditClassExplorer({ classes, creditTypes }: CreditClassExplorerProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filtered = selectedType
    ? classes.filter((c) => c.creditType === selectedType)
    : classes;

  const typeMap = new Map(creditTypes.map((t) => [t.abbreviation, t]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Layers size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            Credit Classes
          </h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          Registered credit classes on the Regen Ledger
        </p>
      </div>

      {/* Type filter chips */}
      <div className="px-5 py-3 flex flex-wrap gap-2 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <button
          onClick={() => setSelectedType(null)}
          className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
          style={{
            backgroundColor: !selectedType ? 'var(--zfp-green)' : 'var(--zfp-cream)',
            color: !selectedType ? '#FFFFFF' : 'var(--zfp-text-muted)',
          }}
        >
          All ({classes.length})
        </button>
        {creditTypes.map((ct) => {
          const count = classes.filter((c) => c.creditType === ct.abbreviation).length;
          const isActive = selectedType === ct.abbreviation;
          return (
            <button
              key={ct.abbreviation}
              onClick={() => setSelectedType(isActive ? null : ct.abbreviation)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: isActive ? (TYPE_COLORS[ct.abbreviation] || 'var(--zfp-green)') : 'var(--zfp-cream)',
                color: isActive ? '#FFFFFF' : 'var(--zfp-text-muted)',
              }}
            >
              {ct.abbreviation} ({count})
            </button>
          );
        })}
      </div>

      {/* Class list */}
      <div className="divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        {filtered.map((cc) => {
          const ct = typeMap.get(cc.creditType);
          const color = TYPE_COLORS[cc.creditType] || 'var(--zfp-green)';
          return (
            <div
              key={cc.id}
              className="px-5 py-3 flex items-center gap-4 transition-colors hover:bg-[var(--zfp-cream)]"
            >
              {/* Class ID badge */}
              <div
                className="w-14 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${color}14`,
                  border: `1px solid ${color}30`,
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ fontFamily: 'var(--font-mono)', color }}
                >
                  {cc.id}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--zfp-text)' }}>
                  {cc.name}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>
                  {ct ? `${ct.name} — ${ct.unit}` : cc.creditType}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                  >
                    {cc.projectCount}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>projects</p>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                  >
                    {cc.batchCount}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>batches</p>
                </div>
                <a
                  href={`https://app.regen.network/credit-classes/${cc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md transition-colors hover:bg-[var(--zfp-cream-dark)]"
                  style={{ color: 'var(--zfp-text-light)' }}
                >
                  <ExternalLink size={13} strokeWidth={1.75} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-sm" style={{ color: 'var(--zfp-text-light)' }}>
            No credit classes found for this type.
          </p>
        </div>
      )}
    </motion.div>
  );
}
