import { motion } from 'framer-motion';
import type { RevolvingFundState } from '../../types/fund';
import type { ProjectStage as ProjectStageType } from '../../types/project';
import { STAGE_LABELS } from '../../types/project';
import { formatNumber } from '../../lib/formatters';

interface ProjectStageProps {
  fund: RevolvingFundState;
}

const STAGE_ORDER: ProjectStageType[] = [
  'granted',
  'implementing',
  'implemented',
  'listed',
  'interest_received',
  'credit_issued',
  'credit_sold',
  'recouped',
];

const STAGE_COLORS: Record<ProjectStageType, string> = {
  granted: '#95D5B2',
  implementing: '#52B788',
  implemented: '#40916C',
  listed: '#2D6A4F',
  interest_received: '#C9A227',
  credit_issued: '#8B6914',
  credit_sold: '#6B4F10',
  recouped: '#2D6A4F',
};

const STAGE_DESCRIPTIONS: Record<ProjectStageType, string> = {
  granted: 'Grant disbursed to farmer',
  implementing: 'Practices being adopted on farm',
  implemented: 'Practices in place, monitoring',
  listed: 'Available in marketplace',
  interest_received: 'Buyer has expressed interest',
  credit_issued: 'Credits issued on Regen Ledger',
  credit_sold: 'Credits purchased by buyer',
  recouped: 'Funds returned to pool',
};

export default function ProjectStageTracker({ fund }: ProjectStageProps) {
  const totalProjects = Object.values(fund.projectStages).reduce((s, n) => s + n, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      className="rounded-xl p-5"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3
          className="text-base font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
        >
          Project Lifecycle Stages
        </h3>
        <span
          className="text-sm font-medium"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-muted)' }}
        >
          {formatNumber(totalProjects)} total
        </span>
      </div>
      <p className="text-xs mb-5" style={{ color: 'var(--zfp-text-light)' }}>
        Projects progress from grant to credit issuance and fund recovery
      </p>

      {/* Stacked progress bar */}
      <div className="w-full h-5 rounded-full overflow-hidden flex mb-4" style={{ backgroundColor: 'var(--zfp-cream-dark)' }}>
        {STAGE_ORDER.map((stage) => {
          const count = fund.projectStages[stage] || 0;
          const pct = totalProjects > 0 ? (count / totalProjects) * 100 : 0;
          if (pct === 0) return null;
          return (
            <motion.div
              key={stage}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-full"
              style={{ backgroundColor: STAGE_COLORS[stage] }}
              title={`${STAGE_LABELS[stage]}: ${count} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Stage rows */}
      <div className="space-y-2">
        {STAGE_ORDER.map((stage, i) => {
          const count = fund.projectStages[stage] || 0;
          const pct = totalProjects > 0 ? (count / totalProjects) * 100 : 0;

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.25 }}
              className="flex items-center gap-3 py-1.5"
            >
              {/* Color dot + step number */}
              <div className="flex items-center gap-2 w-6 flex-shrink-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STAGE_COLORS[stage] }}
                />
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>
                  {STAGE_LABELS[stage]}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>
                  {STAGE_DESCRIPTIONS[stage]}
                </p>
              </div>

              {/* Mini bar + count */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--zfp-cream-dark)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[stage] }}
                  />
                </div>
                <span
                  className="text-sm font-medium w-8 text-right"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                >
                  {count}
                </span>
                <span
                  className="text-[11px] w-10 text-right"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-light)' }}
                >
                  {pct.toFixed(0)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Funnel insight */}
      <div
        className="mt-4 pt-3 border-t text-xs"
        style={{ borderColor: 'var(--zfp-border)', color: 'var(--zfp-text-muted)' }}
      >
        <strong style={{ color: 'var(--zfp-text)' }}>
          {((fund.projectStages.credit_sold + fund.projectStages.recouped) / totalProjects * 100).toFixed(1)}%
        </strong>{' '}
        of projects have reached credit sale or fund recovery stage
      </div>
    </motion.div>
  );
}
