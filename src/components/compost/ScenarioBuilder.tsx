import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers, Plus, Trash2, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/formatters';
import { CHART_COLORS } from '../../lib/constants';
import { JURISDICTIONS } from '../../data/jurisdiction-data';
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_COLORS } from '../../data/jurisdiction-data';
import type { CompostProjectType } from '../../data/jurisdiction-data';

interface Scenario {
  id: string;
  name: string;
  acres: number;
  tonsPerAcre: number;
  carbonPercent: number;
  residualPercent: number;
  marketRate: number;
  jurisdiction: string;
  projectType: CompostProjectType;
}

const DEFAULT_SCENARIOS: Scenario[] = [
  { id: '1', name: 'Small Farm', acres: 50, tonsPerAcre: 6, carbonPercent: 20, residualPercent: 35, marketRate: 30, jurisdiction: 'san-diego', projectType: 'spreading_only' },
  { id: '2', name: 'Mid-Size Ranch', acres: 250, tonsPerAcre: 5, carbonPercent: 18, residualPercent: 30, marketRate: 30, jurisdiction: 'san-benito', projectType: 'compost_provided' },
  { id: '3', name: 'Large Operation', acres: 800, tonsPerAcre: 8, carbonPercent: 22, residualPercent: 40, marketRate: 30, jurisdiction: 'monterey', projectType: 'combined' },
];

function calculateScenario(s: Scenario, forecastYears: number = 0) {
  const tonsApplied = s.acres * s.tonsPerAcre;
  const carbonApplied = tonsApplied * (s.carbonPercent / 100);
  const co2e = carbonApplied * (s.residualPercent / 100) * 3.67;
  const value = co2e * s.marketRate;
  const yearMultiplier = forecastYears > 0 ? forecastYears : 1;
  return {
    tonsApplied,
    co2e,
    value,
    valuePerAcre: s.acres > 0 ? value / s.acres : 0,
    forecastCo2e: co2e * yearMultiplier,
    forecastValue: value * yearMultiplier,
  };
}

let nextId = 4;

export default function ScenarioBuilder() {
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS);
  const [showForecast, setShowForecast] = useState(false);
  const [forecastYears, setForecastYears] = useState(1);

  const addScenario = () => {
    setScenarios((prev) => [
      ...prev,
      {
        id: String(nextId++),
        name: `Scenario ${prev.length + 1}`,
        acres: 100,
        tonsPerAcre: 6,
        carbonPercent: 20,
        residualPercent: 35,
        marketRate: 30,
        jurisdiction: 'san-diego',
        projectType: 'spreading_only',
      },
    ]);
  };

  const removeScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const updateScenario = (id: string, field: keyof Scenario, value: string | number) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const chartData = scenarios.map((s) => {
    const calc = calculateScenario(s, showForecast ? forecastYears : 0);
    return {
      name: s.name,
      credits: Math.round(showForecast ? calc.forecastCo2e : calc.co2e),
      value: Math.round(showForecast ? calc.forecastValue : calc.value),
    };
  });

  // Compute baseline (first scenario) for variance column
  const baselineCalc = scenarios.length > 0 ? calculateScenario(scenarios[0], showForecast ? forecastYears : 0) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--zfp-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-soil)' }} />
            <h3
              className="text-base font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
            >
              Scenario Comparison
            </h3>
          </div>
          <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
            Compare multiple compost application scenarios side by side
          </p>
        </div>

        {/* Forecast toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForecast(!showForecast)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
            style={{
              backgroundColor: showForecast ? 'var(--zfp-green)' : 'var(--zfp-cream)',
              color: showForecast ? '#FFFFFF' : 'var(--zfp-text)',
              border: showForecast ? 'none' : '1px solid var(--zfp-border)',
            }}
          >
            <TrendingUp size={12} strokeWidth={2} />
            Forecast
          </button>
          {showForecast && (
            <select
              value={forecastYears}
              onChange={(e) => setForecastYears(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border text-[11px] font-medium outline-none"
              style={{
                borderColor: 'var(--zfp-border)',
                backgroundColor: 'var(--zfp-white)',
                color: 'var(--zfp-text)',
              }}
            >
              <option value={1}>1 year</option>
              <option value={2}>2 years</option>
              <option value={3}>3 years</option>
            </select>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="px-5 pt-4 pb-2">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--zfp-text-muted)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--zfp-text-light)' }}
                  tickFormatter={(v: number) => `${v} t`}
                />
                <Tooltip
                  formatter={((value: number, name: string) => [
                    name === 'credits' ? `${formatNumber(value)} tCO2e` : formatCurrency(value),
                    name === 'credits' ? (showForecast ? `Credits (${forecastYears}yr)` : 'Credits') : 'Value',
                  ]) as never}
                  contentStyle={{
                    backgroundColor: 'var(--zfp-white)',
                    border: '1px solid var(--zfp-border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="credits" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {showForecast && (
            <p className="text-[10px] text-center mt-1" style={{ color: 'var(--zfp-text-light)' }}>
              Projected over {forecastYears} year{forecastYears > 1 ? 's' : ''} at current application rates
            </p>
          )}
        </div>
      )}

      {/* Scenario table */}
      <div className="px-5 py-4 overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 850 }}>
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--zfp-border)' }}>
              <th className="text-left py-2 pr-3 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Name</th>
              <th className="text-left py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Jurisdiction</th>
              <th className="text-left py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Type</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Acres</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Tons/Ac</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>C%</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Res%</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>$/t</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-green)' }}>Credits</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-soil)' }}>Value</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: '#7C3AED' }}>vs Base</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s, idx) => {
              const calc = calculateScenario(s, showForecast ? forecastYears : 0);
              const credits = showForecast ? calc.forecastCo2e : calc.co2e;
              const value = showForecast ? calc.forecastValue : calc.value;
              const baseCredits = baselineCalc ? (showForecast ? baselineCalc.forecastCo2e : baselineCalc.co2e) : 0;
              const variancePct = idx > 0 && baseCredits > 0
                ? Math.round(((credits - baseCredits) / baseCredits) * 100)
                : null;
              const typeColors = PROJECT_TYPE_COLORS[s.projectType];

              return (
                <tr key={s.id} className="border-b" style={{ borderColor: 'var(--zfp-border)' }}>
                  <td className="py-2 pr-3">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => updateScenario(s.id, 'name', e.target.value)}
                      className="w-full bg-transparent text-sm font-medium outline-none"
                      style={{ color: 'var(--zfp-text)' }}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={s.jurisdiction}
                      onChange={(e) => updateScenario(s.id, 'jurisdiction', e.target.value)}
                      className="bg-transparent text-[11px] outline-none"
                      style={{ color: 'var(--zfp-text)' }}
                    >
                      {JURISDICTIONS.map((j) => (
                        <option key={j.id} value={j.id}>{j.name.replace(' County', '')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={s.projectType}
                      onChange={(e) => updateScenario(s.id, 'projectType', e.target.value)}
                      className="bg-transparent text-[11px] outline-none"
                      style={{ color: typeColors.text }}
                    >
                      {(Object.keys(PROJECT_TYPE_LABELS) as CompostProjectType[]).map((t) => (
                        <option key={t} value={t}>{PROJECT_TYPE_LABELS[t]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={s.acres}
                      onChange={(e) => updateScenario(s.id, 'acres', Number(e.target.value))}
                      className="w-16 text-right bg-transparent text-sm outline-none"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={s.tonsPerAcre}
                      onChange={(e) => updateScenario(s.id, 'tonsPerAcre', Number(e.target.value))}
                      className="w-12 text-right bg-transparent text-sm outline-none"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={s.carbonPercent}
                      onChange={(e) => updateScenario(s.id, 'carbonPercent', Number(e.target.value))}
                      className="w-12 text-right bg-transparent text-sm outline-none"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={s.residualPercent}
                      onChange={(e) => updateScenario(s.id, 'residualPercent', Number(e.target.value))}
                      className="w-12 text-right bg-transparent text-sm outline-none"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={s.marketRate}
                      onChange={(e) => updateScenario(s.id, 'marketRate', Number(e.target.value))}
                      className="w-12 text-right bg-transparent text-sm outline-none"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
                    />
                  </td>
                  <td
                    className="py-2 px-2 text-right text-sm font-medium"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-green)' }}
                  >
                    {formatNumber(Math.round(credits))}
                  </td>
                  <td
                    className="py-2 px-2 text-right text-sm font-medium"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-soil)' }}
                  >
                    {formatCurrency(value)}
                  </td>
                  <td
                    className="py-2 px-2 text-right text-[11px] font-semibold"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: variancePct === null ? 'var(--zfp-text-light)' : variancePct > 0 ? 'var(--zfp-green)' : variancePct < 0 ? '#DC2626' : 'var(--zfp-text-muted)',
                    }}
                  >
                    {variancePct === null ? 'Base' : `${variancePct > 0 ? '↑' : '↓'}${Math.abs(variancePct)}%`}
                  </td>
                  <td className="py-2 pl-2">
                    {scenarios.length > 1 && (
                      <button
                        onClick={() => removeScenario(s.id)}
                        className="p-1 rounded hover:bg-[var(--zfp-cream)] transition-colors"
                        style={{ color: 'var(--zfp-text-light)' }}
                      >
                        <Trash2 size={13} strokeWidth={1.75} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {scenarios.length < 6 && (
          <button
            onClick={addScenario}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--zfp-green-pale)]"
            style={{ color: 'var(--zfp-green)' }}
          >
            <Plus size={13} strokeWidth={1.75} />
            Add Scenario
          </button>
        )}
      </div>
    </motion.div>
  );
}
