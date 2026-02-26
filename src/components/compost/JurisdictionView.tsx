import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin, Building2, ChevronDown } from 'lucide-react';
import { JURISDICTIONS } from '../../data/jurisdiction-data';
// JurisdictionData type used implicitly via JURISDICTIONS

import { formatNumber, formatCurrencyFull } from '../../lib/formatters';
import { CHART_COLORS } from '../../lib/constants';

export default function JurisdictionView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>(['san-diego', 'san-benito', 'monterey']);

  const selected = JURISDICTIONS.find((j) => j.id === selectedId);
  const compareData = useMemo(
    () => JURISDICTIONS.filter((j) => compareIds.includes(j.id)),
    [compareIds]
  );

  // Chart data for comparison
  const chartData = compareData.map((j) => ({
    name: j.name.replace(' County', ''),
    farms: j.farmCount,
    acres: j.totalAcres,
    tons: j.estimatedTons,
  }));

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-soil)' }} />
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            Jurisdiction View
          </h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          Compare compost metrics across counties and jurisdictions
        </p>
      </div>

      {/* Jurisdiction selector */}
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={selectedId || ''}
              onChange={(e) => setSelectedId(e.target.value || null)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border text-xs font-medium outline-none"
              style={{
                borderColor: 'var(--zfp-border)',
                backgroundColor: 'var(--zfp-white)',
                color: 'var(--zfp-text)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <option value="">Select a jurisdiction...</option>
              {JURISDICTIONS.map((j) => (
                <option key={j.id} value={j.id}>{j.name}, {j.state}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              strokeWidth={2}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--zfp-text-muted)' }}
            />
          </div>
          <span className="text-[10px]" style={{ color: 'var(--zfp-text-muted)' }}>
            Compare:
          </span>
          {JURISDICTIONS.map((j) => (
            <button
              key={j.id}
              onClick={() => toggleCompare(j.id)}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: compareIds.includes(j.id) ? 'var(--zfp-green)' : 'var(--zfp-white)',
                color: compareIds.includes(j.id) ? '#FFFFFF' : 'var(--zfp-text)',
                border: compareIds.includes(j.id) ? 'none' : '1px solid var(--zfp-border)',
              }}
            >
              {j.name.replace(' County', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Selected jurisdiction detail */}
      {selected && (
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
            <h4 className="text-sm font-bold" style={{ color: 'var(--zfp-text)' }}>
              {selected.name}, {selected.state}
            </h4>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <JurisdictionStat label="Farms / Projects" value={String(selected.farmCount)} />
            <JurisdictionStat label="Total Acres" value={formatNumber(selected.totalAcres)} />
            <JurisdictionStat label="Est. Tons (current)" value={formatNumber(selected.estimatedTons)} />
            <JurisdictionStat label="Market Rate" value={`$${selected.marketRate}/tCO2e`} color="var(--zfp-soil)" />
            <JurisdictionStat label="Demo Projects" value={String(selected.demonstrationProjects)} />
            <JurisdictionStat
              label="Food Insecurity"
              value={`${selected.foodInsecurityScore}/100`}
              color={selected.foodInsecurityScore > 30 ? '#DC2626' : 'var(--zfp-green)'}
            />
          </div>
        </div>
      )}

      {/* Comparison table */}
      {compareData.length > 0 && (
        <div className="px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--zfp-text-muted)' }}>
            Jurisdiction Comparison ({compareData.length})
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--zfp-border)' }}>
                  <th className="text-left py-2 pr-3 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Jurisdiction</th>
                  <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Farms</th>
                  <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Acres</th>
                  <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Est. Tons</th>
                  <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Rate</th>
                  <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Est. Value</th>
                  <th className="text-right py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Demos</th>
                  <th className="text-right py-2 pl-2 text-[10px] font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>Food Insecurity</th>
                </tr>
              </thead>
              <tbody>
                {compareData.map((j) => {
                  // Rough estimated value: tons × carbon% × residual% × CO2e factor × market rate
                  // Simplified: estimatedTons × 0.20 × 0.35 × 3.67 × marketRate
                  const estCredits = Math.round(j.estimatedTons * 0.20 * 0.35 * 3.67);
                  const estValue = estCredits * j.marketRate;
                  return (
                    <tr key={j.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--zfp-border)' }}>
                      <td className="py-2 pr-3 font-medium" style={{ color: 'var(--zfp-text)' }}>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={10} strokeWidth={2} style={{ color: 'var(--zfp-green)' }} />
                          {j.name.replace(' County', '')}, {j.state}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>{j.farmCount}</td>
                      <td className="py-2 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>{formatNumber(j.totalAcres)}</td>
                      <td className="py-2 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>{formatNumber(j.estimatedTons)}</td>
                      <td className="py-2 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-soil)' }}>${j.marketRate}</td>
                      <td className="py-2 px-2 text-right font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-green)' }}>{formatCurrencyFull(estValue)}</td>
                      <td className="py-2 px-2 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>{j.demonstrationProjects}</td>
                      <td className="py-2 pl-2 text-right">
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor: j.foodInsecurityScore > 30 ? '#FEE2E2' : 'var(--zfp-green-pale)',
                            color: j.foodInsecurityScore > 30 ? '#DC2626' : 'var(--zfp-green)',
                          }}
                        >
                          {j.foodInsecurityScore}/100
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bar chart comparison */}
          {compareData.length > 1 && (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--zfp-text-muted)' }}>
                Estimated Tons by Jurisdiction
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--zfp-border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: 'var(--zfp-text-muted)' }}
                    axisLine={{ stroke: 'var(--zfp-border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'var(--zfp-text-muted)' }}
                    axisLine={{ stroke: 'var(--zfp-border)' }}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--zfp-white)',
                      borderColor: 'var(--zfp-border)',
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                    formatter={(value: unknown) => [`${formatNumber(value as number)} tons`, 'Est. Tons']}
                  />
                  <Bar dataKey="tons" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function JurisdictionStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      className="rounded-lg px-3 py-2"
      style={{ backgroundColor: 'var(--zfp-cream-dark)', border: '1px solid var(--zfp-border)' }}
    >
      <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>{label}</p>
      <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: color || 'var(--zfp-text)' }}>{value}</p>
    </div>
  );
}
