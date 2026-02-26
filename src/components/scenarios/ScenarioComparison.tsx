import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { FarmProject } from '../../types/project';
import type { FundingPot, Scenario } from '../../data/funding-sources';
import { formatCurrencyFull } from '../../lib/formatters';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  allProjects: FarmProject[];
  fundingPots: FundingPot[];
}

interface ScenarioMetrics {
  id: string;
  name: string;
  projectCount: number;
  totalGrant: number;
  totalAcres: number;
  carbonLow: number;
  carbonHigh: number;
  costPerAcre: number;
  costPerTon: number;
  statesCovered: number;
  practicesDiversity: number;
}

const SCENARIO_COLORS = ['#2D6A4F', '#52B788', '#8B6914'];

export default function ScenarioComparison({
  scenarios,
  allProjects,
}: ScenarioComparisonProps) {
  const metrics: ScenarioMetrics[] = useMemo(() => {
    return scenarios.map((scenario) => {
      const projects = scenario.projects.map((sp) => ({
        sp,
        project: allProjects.find((p) => p.id === sp.projectId),
      })).filter((x) => x.project != null);

      const totalGrant = scenario.projects.reduce((s, sp) => s + sp.amount, 0);
      const totalAcres = projects.reduce((s, { project }) => s + (project?.acreage || 0), 0);
      const carbonLow = projects.reduce((s, { project }) => s + (project?.cometEstimate.low || 0), 0);
      const carbonHigh = projects.reduce((s, { project }) => s + (project?.cometEstimate.high || 0), 0);
      const states = new Set(projects.map(({ project }) => project?.location.state).filter(Boolean));
      const practices = new Set(projects.flatMap(({ project }) => project?.practices || []));

      return {
        id: scenario.id,
        name: scenario.name,
        projectCount: scenario.projects.length,
        totalGrant,
        totalAcres,
        carbonLow,
        carbonHigh,
        costPerAcre: totalAcres > 0 ? totalGrant / totalAcres : 0,
        costPerTon: carbonHigh > 0 ? totalGrant / carbonHigh : 0,
        statesCovered: states.size,
        practicesDiversity: practices.size,
      };
    });
  }, [scenarios, allProjects]);

  // Only show comparison when we have scenarios with projects
  const activeMetrics = metrics.filter((m) => m.projectCount > 0);

  if (activeMetrics.length === 0) {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
            <h3
              className="text-base font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
            >
              Scenario Comparison
            </h3>
          </div>
        </div>
        <div className="px-5 py-8 text-center">
          <p className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>
            Add projects to at least one scenario to see comparison
          </p>
        </div>
      </div>
    );
  }

  // Chart data
  const chartData = [
    {
      metric: 'Grant ($K)',
      ...Object.fromEntries(activeMetrics.map((m) => [m.name, Math.round(m.totalGrant / 1000)])),
    },
    {
      metric: 'Acres',
      ...Object.fromEntries(activeMetrics.map((m) => [m.name, m.totalAcres])),
    },
    {
      metric: 'tCO2e (high)',
      ...Object.fromEntries(activeMetrics.map((m) => [m.name, m.carbonHigh])),
    },
    {
      metric: '$/acre',
      ...Object.fromEntries(activeMetrics.map((m) => [m.name, Math.round(m.costPerAcre)])),
    },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            Scenario Comparison
          </h3>
        </div>
        <p className="text-xs mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
          Side-by-side metrics across {activeMetrics.length} scenario{activeMetrics.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="px-5 py-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--zfp-border)' }}>
                <th
                  className="text-left py-2 pr-4 text-[10px] uppercase tracking-wider font-semibold"
                  style={{ color: 'var(--zfp-text-muted)' }}
                >
                  Metric
                </th>
                {activeMetrics.map((m, i) => (
                  <th
                    key={m.id}
                    className="text-right py-2 px-2 text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: SCENARIO_COLORS[i % SCENARIO_COLORS.length] }}
                  >
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow label="Projects" values={activeMetrics.map((m) => String(m.projectCount))} />
              <ComparisonRow label="Total Grant" values={activeMetrics.map((m) => formatCurrencyFull(m.totalGrant))} highlight />
              <ComparisonRow label="Total Acres" values={activeMetrics.map((m) => m.totalAcres.toLocaleString())} />
              <ComparisonRow label="Carbon (low)" values={activeMetrics.map((m) => `${m.carbonLow} tCO2e`)} />
              <ComparisonRow label="Carbon (high)" values={activeMetrics.map((m) => `${m.carbonHigh} tCO2e`)} highlight />
              <ComparisonRow label="Cost / Acre" values={activeMetrics.map((m) => `$${Math.round(m.costPerAcre)}`)} />
              <ComparisonRow label="Cost / tCO2e" values={activeMetrics.map((m) => `$${Math.round(m.costPerTon)}`)} />
              <ComparisonRow label="States" values={activeMetrics.map((m) => String(m.statesCovered))} />
              <ComparisonRow label="Practice Types" values={activeMetrics.map((m) => String(m.practicesDiversity))} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar Chart */}
      {activeMetrics.length > 1 && (
        <div className="px-5 pb-5">
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--zfp-text-muted)' }}
          >
            Visual Comparison
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--zfp-border)" />
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 10, fill: 'var(--zfp-text-muted)' }}
                axisLine={{ stroke: 'var(--zfp-border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--zfp-text-muted)' }}
                axisLine={{ stroke: 'var(--zfp-border)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--zfp-white)',
                  borderColor: 'var(--zfp-border)',
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-body)' }}
              />
              {activeMetrics.map((m, i) => (
                <Bar
                  key={m.id}
                  dataKey={m.name}
                  fill={SCENARIO_COLORS[i % SCENARIO_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  highlight = false,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <tr
      className="border-b last:border-b-0"
      style={{
        borderColor: 'var(--zfp-border)',
        backgroundColor: highlight ? 'var(--zfp-cream)' : 'transparent',
      }}
    >
      <td
        className="py-2 pr-4 text-xs font-medium"
        style={{ color: 'var(--zfp-text)' }}
      >
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className="py-2 px-2 text-right text-xs font-semibold"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
