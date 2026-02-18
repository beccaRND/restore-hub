import { motion } from 'framer-motion';
import type { FarmProject } from '../../types/project';
import { formatNumber, formatCurrency } from '../../lib/formatters';

interface MapStatsProps {
  projects: FarmProject[];
}

export default function MapStats({ projects }: MapStatsProps) {
  // Group by state
  const byState: Record<string, FarmProject[]> = {};
  projects.forEach((p) => {
    if (!byState[p.location.state]) byState[p.location.state] = [];
    byState[p.location.state].push(p);
  });

  const stateEntries = Object.entries(byState).sort((a, b) => b[1].length - a[1].length);

  const totalAcres = projects.reduce((s, p) => s + p.acreage, 0);
  const totalGrants = projects.reduce((s, p) => s + p.grantAmount, 0);
  const availableCount = projects.filter((p) => p.availability === 'available').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <p
          className="text-sm font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
        >
          Geographic Summary
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="px-4 py-3 text-center">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-green)' }}
          >
            {formatNumber(totalAcres)}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>Total Acres</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-soil)' }}
          >
            {formatCurrency(totalGrants)}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>Grants Deployed</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-green)' }}
          >
            {availableCount}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>Available</p>
        </div>
      </div>

      {/* Per-state breakdown */}
      <div className="divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        {stateEntries.map(([state, stateProjects]) => {
          const acres = stateProjects.reduce((s, p) => s + p.acreage, 0);
          const pctOfTotal = projects.length > 0 ? (stateProjects.length / projects.length) * 100 : 0;

          return (
            <div key={state} className="px-4 py-2.5 flex items-center gap-3">
              <span
                className="text-sm font-bold w-7"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
              >
                {state}
              </span>
              <div className="flex-1">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--zfp-cream-dark)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pctOfTotal}%`,
                      backgroundColor: 'var(--zfp-green)',
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
                  {stateProjects.length}
                </span>
                <span className="w-16 text-right" style={{ color: 'var(--zfp-text-light)' }}>
                  {formatNumber(acres)} ac
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
