import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { FarmProject } from '../../types/project';
import { FUND_SOURCE_LABELS } from '../../types/project';
import type { FundSource } from '../../types/project';
import { formatCurrency } from '../../lib/formatters';
import { CHART_COLORS } from '../../lib/constants';

interface FundSourceBreakdownProps {
  projects: FarmProject[];
}

export default function FundSourceBreakdown({ projects }: FundSourceBreakdownProps) {
  const bySource: Record<string, { count: number; total: number; acres: number }> = {};
  projects.forEach((p) => {
    if (!bySource[p.fundSource]) bySource[p.fundSource] = { count: 0, total: 0, acres: 0 };
    bySource[p.fundSource].count++;
    bySource[p.fundSource].total += p.grantAmount;
    bySource[p.fundSource].acres += p.acreage;
  });

  const data = Object.entries(bySource)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([source, d]) => ({
      name: FUND_SOURCE_LABELS[source as FundSource] || source,
      value: d.total,
      count: d.count,
      acres: d.acres,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.35 }}
      className="rounded-xl p-5"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <h3
        className="text-base font-bold mb-1"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
      >
        Grants by Fund Source
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--zfp-text-light)' }}>
        Distribution of grant capital across fund programs
      </p>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Donut chart */}
        <div className="w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={((value: number) => formatCurrency(value)) as never}
                contentStyle={{
                  backgroundColor: 'var(--zfp-white)',
                  border: '1px solid var(--zfp-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend + details */}
        <div className="flex-1 space-y-2 w-full">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--zfp-text)' }}>
                  {d.name}
                </p>
              </div>
              <span
                className="text-sm font-medium flex-shrink-0"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
              >
                {formatCurrency(d.value)}
              </span>
              <span
                className="text-xs flex-shrink-0 w-16 text-right"
                style={{ color: 'var(--zfp-text-light)' }}
              >
                {d.count} projects
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
