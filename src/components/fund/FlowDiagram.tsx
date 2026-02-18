import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { RevolvingFundState } from '../../types/fund';
import { formatCurrency } from '../../lib/formatters';

interface FlowDiagramProps {
  fund: RevolvingFundState;
}

// Visual Sankey-style flow: Grants → Projects → Credits → Recovery → Redeployment
const FLOW_STAGES = [
  {
    id: 'deployed',
    label: 'Grants Deployed',
    color: 'var(--zfp-green)',
    bgColor: '#2D6A4F14',
    getValue: (f: RevolvingFundState) => f.totalGrantsDeployed,
  },
  {
    id: 'recoverable',
    label: 'Potentially Recoverable',
    color: 'var(--zfp-soil)',
    bgColor: '#8B691414',
    getValue: (f: RevolvingFundState) => f.totalPotentiallyRecoverable,
  },
  {
    id: 'issued',
    label: 'Credits Issued',
    color: '#52B788',
    bgColor: '#52B78814',
    getValue: (f: RevolvingFundState) => f.creditsIssuedValue,
  },
  {
    id: 'redeployment',
    label: 'Redeployment Pool',
    color: '#C9A227',
    bgColor: '#C9A22714',
    getValue: (f: RevolvingFundState) => f.redeploymentPool,
  },
] as const;

export default function FlowDiagram({ fund }: FlowDiagramProps) {
  const maxValue = Math.max(...FLOW_STAGES.map((s) => s.getValue(fund)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="rounded-xl p-5"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <h3
        className="text-base font-bold mb-1"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
      >
        Revolving Fund Flow
      </h3>
      <p className="text-xs mb-5" style={{ color: 'var(--zfp-text-light)' }}>
        Grant capital flows from deployment through credit issuance and back into the redeployment pool
      </p>

      {/* Horizontal flow on desktop, vertical on mobile */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3">
        {FLOW_STAGES.map((stage, i) => {
          const value = stage.getValue(fund);
          const barHeight = maxValue > 0 ? Math.max((value / maxValue) * 100, 15) : 15;

          return (
            <div key={stage.id} className="flex items-center gap-3 flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.3 }}
                className="flex-1 rounded-xl p-4 relative overflow-hidden"
                style={{
                  backgroundColor: stage.bgColor,
                  border: `1px solid ${stage.color}30`,
                  minHeight: 120,
                }}
              >
                {/* Value bar indicator */}
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-700 rounded-b-xl"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: `${stage.color}18`,
                  }}
                />
                <div className="relative z-10">
                  <p
                    className="text-xl font-bold mb-1"
                    style={{ fontFamily: 'var(--font-mono)', color: stage.color }}
                  >
                    {formatCurrency(value)}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--zfp-text)' }}>
                    {stage.label}
                  </p>
                </div>
              </motion.div>

              {/* Arrow between stages */}
              {i < FLOW_STAGES.length - 1 && (
                <div className="hidden lg:flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={18} strokeWidth={1.75} style={{ color: 'var(--zfp-text-light)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Revolving loop indicator */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--zfp-text-muted)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          <span>
            Redeployment pool funds are recycled back into new grants — creating a self-sustaining revolving fund
          </span>
        </div>
      </div>
    </motion.div>
  );
}
