import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import {
  FORECAST_DATA,
  filterByHorizon,
  getForecastSummary,
} from '../../data/forecast-data';
import type { TimeHorizon } from '../../data/forecast-data';
import { formatCurrencyFull, formatNumber } from '../../lib/formatters';

const HORIZON_OPTIONS: { value: TimeHorizon; label: string }[] = [
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: '3y', label: '3 Years' },
];

export default function Forecasting() {
  const [horizon, setHorizon] = useState<TimeHorizon>('2y');

  const data = useMemo(() => filterByHorizon(FORECAST_DATA, horizon), [horizon]);
  const summary = useMemo(() => getForecastSummary(data), [data]);

  // Find the last completed quarter for variance tracking
  const completedData = data.filter((d) => d.actualCredits !== null);
  const lastCompleted = completedData[completedData.length - 1];
  const prevCompleted = completedData.length > 1 ? completedData[completedData.length - 2] : null;

  const variance = lastCompleted && prevCompleted
    ? {
        creditsDelta: (lastCompleted.actualCredits || 0) - (prevCompleted.actualCredits || 0),
        creditsPctChange: prevCompleted.actualCredits
          ? (((lastCompleted.actualCredits || 0) - prevCompleted.actualCredits) / prevCompleted.actualCredits) * 100
          : 0,
      }
    : null;

  // Chart data
  const chartData = data.map((d) => ({
    quarter: d.quarter,
    projected: d.projectedCredits,
    actual: d.actualCredits,
  }));

  // Progress percentage
  const progressPct = summary.totalQuarters > 0
    ? Math.round((summary.completedQuarters / summary.totalQuarters) * 100)
    : 0;

  const statusColor = summary.status === 'ahead' ? 'var(--zfp-green)' : summary.status === 'behind' ? '#DC2626' : 'var(--zfp-soil)';
  const statusLabel = summary.status === 'ahead' ? 'Ahead of schedule' : summary.status === 'behind' ? 'Behind schedule' : 'On track';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--zfp-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
            <h3
              className="text-base font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
            >
              Forecasting
            </h3>
          </div>
          <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
            Quarterly projections vs actuals for compost credit generation
          </p>
        </div>

        {/* Time horizon selector */}
        <div
          className="flex rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--zfp-border)' }}
        >
          {HORIZON_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setHorizon(opt.value)}
              className="px-3 py-1.5 text-[11px] font-medium transition-colors"
              style={{
                backgroundColor: horizon === opt.value ? 'var(--zfp-green)' : 'var(--zfp-white)',
                color: horizon === opt.value ? '#FFFFFF' : 'var(--zfp-text)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div
        className="px-5 py-3 border-b grid grid-cols-2 lg:grid-cols-4 gap-4"
        style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}
      >
        <MiniStat
          label="Progress"
          value={`${progressPct}%`}
          sub={`${summary.completedQuarters} of ${summary.totalQuarters} quarters`}
        />
        <MiniStat
          label="Status"
          value={statusLabel}
          valueColor={statusColor}
        />
        <MiniStat
          label="Projected Credits"
          value={`${formatNumber(summary.totalProjectedCredits)} tCO2e`}
        />
        <MiniStat
          label="Actual Credits"
          value={summary.totalActualCredits > 0 ? `${formatNumber(summary.totalActualCredits)} tCO2e` : '—'}
          valueColor="var(--zfp-green)"
        />
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--zfp-text-muted)' }}>
            Project Progress
          </span>
          <span
            className="text-[10px] font-semibold"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--zfp-cream)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: statusColor }}
          />
        </div>
      </div>

      {/* Variance tracking */}
      {variance && lastCompleted && (
        <div className="px-5 pt-3">
          <div
            className="rounded-lg px-4 py-2.5 flex items-center justify-between"
            style={{ backgroundColor: 'var(--zfp-cream-dark)', border: '1px solid var(--zfp-border)' }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>
                Last Period: {lastCompleted.quarter}
              </p>
              <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
                {lastCompleted.actualCredits} tCO2e actual vs {lastCompleted.projectedCredits} projected
              </p>
            </div>
            <div className="flex items-center gap-1">
              {variance.creditsDelta > 0 ? (
                <ArrowUpRight size={14} strokeWidth={2} style={{ color: 'var(--zfp-green)' }} />
              ) : variance.creditsDelta < 0 ? (
                <ArrowDownRight size={14} strokeWidth={2} style={{ color: '#DC2626' }} />
              ) : (
                <Minus size={14} strokeWidth={2} style={{ color: 'var(--zfp-text-muted)' }} />
              )}
              <span
                className="text-sm font-bold"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: variance.creditsDelta > 0 ? 'var(--zfp-green)' : variance.creditsDelta < 0 ? '#DC2626' : 'var(--zfp-text-muted)',
                }}
              >
                {variance.creditsDelta > 0 ? '+' : ''}{variance.creditsDelta} tCO2e
                ({variance.creditsPctChange > 0 ? '+' : ''}{Math.round(variance.creditsPctChange)}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Line chart: projected vs actual */}
      <div className="px-5 pt-4 pb-2">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--zfp-border)" />
            <XAxis
              dataKey="quarter"
              tick={{ fontSize: 10, fill: 'var(--zfp-text-muted)' }}
              axisLine={{ stroke: 'var(--zfp-border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--zfp-text-muted)' }}
              axisLine={{ stroke: 'var(--zfp-border)' }}
              tickLine={false}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--zfp-white)',
                borderColor: 'var(--zfp-border)',
                borderRadius: 8,
                fontSize: 11,
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: any, name: any) => [
                value != null ? `${value} tCO2e` : '—',
                name === 'projected' ? 'Projected' : 'Actual',
              ]) as any}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-body)' }}
              formatter={(value: string) => (value === 'projected' ? 'Projected' : 'Actual')}
            />
            <ReferenceLine
              x={lastCompleted?.quarter}
              stroke="var(--zfp-text-light)"
              strokeDasharray="5 5"
              label={{ value: 'Now', position: 'top', fontSize: 9, fill: 'var(--zfp-text-light)' }}
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="var(--zfp-text-muted)"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ fill: 'var(--zfp-text-muted)', r: 3 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--zfp-green)"
              strokeWidth={2.5}
              dot={{ fill: 'var(--zfp-green)', r: 4 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quarterly table */}
      <div className="px-5 pb-4 overflow-x-auto">
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--zfp-text-muted)' }}
        >
          Quarterly Milestones
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--zfp-border)' }}>
              <th className="text-left py-2 pr-3 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Quarter</th>
              <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Proj. Tons</th>
              <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Act. Tons</th>
              <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Proj. Credits</th>
              <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Act. Credits</th>
              <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Proj. Value</th>
              <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Act. Value</th>
              <th className="text-right py-2 pl-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Delta</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => {
              const hasActual = d.actualCredits !== null;
              const delta = hasActual ? (d.actualCredits || 0) - d.projectedCredits : null;
              return (
                <tr
                  key={d.quarter}
                  className="border-b last:border-b-0"
                  style={{
                    borderColor: 'var(--zfp-border)',
                    backgroundColor: hasActual ? 'transparent' : 'var(--zfp-cream)',
                  }}
                >
                  <td className="py-1.5 pr-3 font-medium flex items-center gap-1.5" style={{ color: 'var(--zfp-text)' }}>
                    <Calendar size={10} strokeWidth={2} style={{ color: hasActual ? 'var(--zfp-green)' : 'var(--zfp-text-light)' }} />
                    {d.quarter}
                  </td>
                  <td className="py-1.5 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
                    {formatNumber(d.projectedTons)}
                  </td>
                  <td className="py-1.5 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: hasActual ? 'var(--zfp-green)' : 'var(--zfp-text-light)' }}>
                    {hasActual ? formatNumber(d.actualTons || 0) : '—'}
                  </td>
                  <td className="py-1.5 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
                    {d.projectedCredits}
                  </td>
                  <td className="py-1.5 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: hasActual ? 'var(--zfp-green)' : 'var(--zfp-text-light)' }}>
                    {hasActual ? d.actualCredits : '—'}
                  </td>
                  <td className="py-1.5 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
                    {formatCurrencyFull(d.projectedValue)}
                  </td>
                  <td className="py-1.5 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: hasActual ? 'var(--zfp-green)' : 'var(--zfp-text-light)' }}>
                    {hasActual ? formatCurrencyFull(d.actualValue || 0) : '—'}
                  </td>
                  <td className="py-1.5 pl-2 text-right font-semibold" style={{
                    fontFamily: 'var(--font-mono)',
                    color: delta === null ? 'var(--zfp-text-light)' : delta > 0 ? 'var(--zfp-green)' : delta < 0 ? '#DC2626' : 'var(--zfp-text-muted)',
                  }}>
                    {delta === null ? '—' : `${delta > 0 ? '↑' : delta < 0 ? '↓' : '—'}${Math.abs(delta)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value, sub, valueColor }: { label: string; value: string; sub?: string; valueColor?: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>{label}</p>
      <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: valueColor || 'var(--zfp-text)' }}>{value}</p>
      {sub && <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>{sub}</p>}
    </div>
  );
}
