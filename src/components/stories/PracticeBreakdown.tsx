import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { PracticeType } from '../../types/project';
import { PRACTICE_LABELS } from '../../types/project';
import { CHART_COLORS } from '../../lib/constants';

interface PracticeBreakdownProps {
  breakdown: Partial<Record<PracticeType, number>>;
}

export default function PracticeBreakdown({ breakdown }: PracticeBreakdownProps) {
  const data = Object.entries(breakdown)
    .map(([practice, count]) => ({
      name: PRACTICE_LABELS[practice as PracticeType],
      value: count as number,
      practice,
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--zfp-charcoal)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
            }}
            formatter={((value: number | undefined) => [
              `${value} projects`,
              '',
            ]) as never}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex-1 space-y-2.5 w-full">
        {data.map((item, i) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div key={item.practice} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-sm flex-1 truncate" style={{ color: 'var(--zfp-text)' }}>
                {item.name}
              </span>
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-muted)' }}
              >
                {item.value}
              </span>
              <div
                className="w-16 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--zfp-border)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
