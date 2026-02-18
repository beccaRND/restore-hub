import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, RefreshCcw, Landmark } from 'lucide-react';
import type { RevolvingFundState } from '../../types/fund';
import { formatCurrency, formatCurrencyFull } from '../../lib/formatters';

interface FundMetricsProps {
  fund: RevolvingFundState;
}

const METRICS = [
  {
    key: 'totalGrantsDeployed' as const,
    label: 'Total Grants Deployed',
    icon: DollarSign,
    color: 'var(--zfp-green)',
    subtitle: 'Across all fund sources',
  },
  {
    key: 'totalPotentiallyRecoverable' as const,
    label: 'Potentially Recoverable',
    icon: TrendingUp,
    color: 'var(--zfp-soil)',
    subtitle: 'If all credits are sold',
  },
  {
    key: 'creditsIssuedValue' as const,
    label: 'Credits Issued Value',
    icon: Landmark,
    color: '#52B788',
    subtitle: 'Credits on Regen Ledger',
  },
  {
    key: 'redeploymentPool' as const,
    label: 'Redeployment Pool',
    icon: RefreshCcw,
    color: '#C9A227',
    subtitle: 'Available for new grants',
  },
];

export default function FundMetrics({ fund }: FundMetricsProps) {
  const recoveryRate = fund.totalGrantsDeployed > 0
    ? ((fund.creditsIssuedValue + fund.redeploymentPool) / fund.totalGrantsDeployed) * 100
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric, i) => {
          const Icon = metric.icon;
          const value = fund[metric.key];
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="relative overflow-hidden rounded-xl px-5 py-4"
              style={{
                backgroundColor: 'var(--zfp-white)',
                boxShadow: 'var(--shadow-card)',
                borderLeft: `4px solid ${metric.color}`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}14` }}
                >
                  <Icon size={16} strokeWidth={1.75} style={{ color: metric.color }} />
                </div>
              </div>
              <p
                className="text-2xl font-medium"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
              >
                {formatCurrency(value)}
              </p>
              <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--zfp-text-muted)' }}>
                {metric.label}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
                {metric.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Recovery progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.35 }}
        className="rounded-xl px-5 py-4"
        style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--zfp-text)' }}>
              Grant Recovery Progress
            </p>
            <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
              {formatCurrencyFull(fund.creditsIssuedValue + fund.redeploymentPool)} recovered of {formatCurrencyFull(fund.totalGrantsDeployed)} deployed
            </p>
          </div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-green)' }}
          >
            {recoveryRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--zfp-cream-dark)' }}>
          {/* Recovered portion */}
          <div className="h-full rounded-full relative overflow-hidden" style={{ width: `${Math.min(recoveryRate, 100)}%` }}>
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, var(--zfp-green), #52B788)',
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--zfp-green)' }} />
            Recovered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--zfp-cream-dark)' }} />
            Outstanding
          </span>
          <span className="ml-auto">
            Pipeline: {formatCurrency(fund.pipeline.estimatedValue)} est. from {fund.pipeline.projectsWithInterest} projects
          </span>
        </div>
      </motion.div>
    </div>
  );
}
