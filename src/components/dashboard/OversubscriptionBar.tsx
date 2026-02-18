import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Pie } from 'recharts';
import type { FarmProject } from '../../types/project';
import { PRACTICE_LABELS } from '../../types/project';
import type { PracticeType } from '../../types/project';
import { CHART_COLORS } from '../../lib/constants';
import { formatNumber } from '../../lib/formatters';

interface OversubscriptionBarProps {
  projects: FarmProject[];
}

export default function OversubscriptionBar({ projects }: OversubscriptionBarProps) {
  // Projects by state
  const stateData = Object.entries(
    projects.reduce<Record<string, { total: number; available: number; acres: number }>>((acc, p) => {
      const state = p.location.state;
      if (!acc[state]) acc[state] = { total: 0, available: 0, acres: 0 };
      acc[state].total++;
      if (p.availability === 'available') acc[state].available++;
      acc[state].acres += p.acreage;
      return acc;
    }, {})
  )
    .map(([state, data]) => ({ state, ...data }))
    .sort((a, b) => b.total - a.total);

  // Practice breakdown
  const practiceCount: Partial<Record<PracticeType, number>> = {};
  projects.forEach((p) =>
    p.practices.forEach((practice) => {
      practiceCount[practice] = (practiceCount[practice] || 0) + 1;
    })
  );
  const practiceData = Object.entries(practiceCount)
    .map(([practice, count]) => ({
      name: PRACTICE_LABELS[practice as PracticeType],
      value: count as number,
    }))
    .sort((a, b) => b.value - a.value);

  // Status distribution
  const statusGroups = {
    'Early Stage': projects.filter((p) => ['granted', 'implementing'].includes(p.status)).length,
    'Implemented': projects.filter((p) => p.status === 'implemented').length,
    'Listed': projects.filter((p) => p.status === 'listed').length,
    'Interest+': projects.filter((p) =>
      ['interest_received', 'credit_issued', 'credit_sold', 'recouped'].includes(p.status)
    ).length,
  };
  const statusData = Object.entries(statusGroups).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Projects by state - bar chart */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--zfp-text-muted)' }}
        >
          Projects by State
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stateData} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="state"
              width={32}
              tick={{ fontSize: 12, fill: 'var(--zfp-text-muted)', fontFamily: 'var(--font-mono)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--zfp-charcoal)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
              }}
              formatter={((value: number | undefined, name: string | undefined) => {
                const label = name === 'available' ? 'Available' : 'Other';
                return [value ?? 0, label];
              }) as never}
            />
            <Bar dataKey="available" stackId="a" radius={[0, 0, 0, 0]} barSize={18}>
              {stateData.map((_, index) => (
                <Cell key={index} fill="var(--zfp-green)" />
              ))}
            </Bar>
            <Bar
              dataKey={(d: typeof stateData[0]) => d.total - d.available}
              stackId="a"
              radius={[0, 4, 4, 0]}
              barSize={18}
            >
              {stateData.map((_, index) => (
                <Cell key={index} fill="var(--zfp-green-pale)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3">
          <LegendDot color="var(--zfp-green)" label="Available" />
          <LegendDot color="var(--zfp-green-pale)" label="Other status" />
        </div>
      </div>

      {/* Practice breakdown - pie chart */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--zfp-text-muted)' }}
        >
          Practice Breakdown
        </h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={practiceData.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {practiceData.slice(0, 6).map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1.5">
            {practiceData.slice(0, 5).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-xs truncate max-w-[120px]" style={{ color: 'var(--zfp-text)' }}>
                    {item.name}
                  </span>
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-muted)' }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline status */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--zfp-text-muted)' }}
        >
          Project Pipeline
        </h3>
        <div className="space-y-3">
          {statusData.map((item) => {
            const total = projects.length;
            const pct = (item.value / total) * 100;
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--zfp-text)' }}>
                    {item.name}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-muted)' }}
                  >
                    {formatNumber(item.value)}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--zfp-border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: 'var(--gradient-cta)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--zfp-text-light)' }}>
          {formatNumber(projects.length)} total projects in the catalog
        </p>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>{label}</span>
    </div>
  );
}
