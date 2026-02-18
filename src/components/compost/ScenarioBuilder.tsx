import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/formatters';
import { CHART_COLORS } from '../../lib/constants';

interface Scenario {
  id: string;
  name: string;
  acres: number;
  tonsPerAcre: number;
  carbonPercent: number;
  residualPercent: number;
  marketRate: number;
}

const DEFAULT_SCENARIOS: Scenario[] = [
  { id: '1', name: 'Small Farm', acres: 50, tonsPerAcre: 6, carbonPercent: 20, residualPercent: 35, marketRate: 30 },
  { id: '2', name: 'Mid-Size Ranch', acres: 250, tonsPerAcre: 5, carbonPercent: 18, residualPercent: 30, marketRate: 30 },
  { id: '3', name: 'Large Operation', acres: 800, tonsPerAcre: 8, carbonPercent: 22, residualPercent: 40, marketRate: 30 },
];

function calculateScenario(s: Scenario) {
  const tonsApplied = s.acres * s.tonsPerAcre;
  const carbonApplied = tonsApplied * (s.carbonPercent / 100);
  const co2e = carbonApplied * (s.residualPercent / 100) * 3.67;
  const value = co2e * s.marketRate;
  return { tonsApplied, co2e, value, valuePerAcre: s.acres > 0 ? value / s.acres : 0 };
}

let nextId = 4;

export default function ScenarioBuilder() {
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS);

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
    const calc = calculateScenario(s);
    return {
      name: s.name,
      credits: Math.round(calc.co2e),
      value: Math.round(calc.value),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
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
                    name === 'credits' ? 'Credits' : 'Value',
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
        </div>
      )}

      {/* Scenario table */}
      <div className="px-5 py-4 overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 600 }}>
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--zfp-border)' }}>
              <th className="text-left py-2 pr-3 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Name</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Acres</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Tons/Ac</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>C%</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Residual%</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>$/tCO2e</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-green)' }}>Credits</th>
              <th className="text-right py-2 px-2 text-xs font-semibold" style={{ color: 'var(--zfp-soil)' }}>Value</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => {
              const calc = calculateScenario(s);
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
                    {formatNumber(Math.round(calc.co2e))}
                  </td>
                  <td
                    className="py-2 px-2 text-right text-sm font-medium"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-soil)' }}
                  >
                    {formatCurrency(calc.value)}
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
