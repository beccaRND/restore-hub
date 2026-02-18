import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Utensils, ShoppingCart, Trash2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/formatters';

interface Scenario {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  defaultInput: number;
  inputLabel: string;
  inputUnit: string;
  inputMin: number;
  inputMax: number;
  inputStep: number;
  calculate: (input: number) => { funding: number; farms: number; acres: number; detail: string };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'restaurants',
    icon: <Utensils size={20} strokeWidth={1.75} />,
    title: 'More restaurants join at 1%',
    description: 'If additional restaurants committed 1% of revenue',
    defaultInput: 100,
    inputLabel: 'Restaurants',
    inputUnit: 'restaurants',
    inputMin: 10,
    inputMax: 500,
    inputStep: 10,
    calculate: (count) => {
      const avgRevenue = 850_000;
      const contribution = avgRevenue * 0.01;
      const totalFunding = count * contribution;
      const farms = Math.round(totalFunding / 15_000);
      const acres = farms * 120;
      return {
        funding: totalFunding,
        farms,
        acres,
        detail: `At avg. $${(avgRevenue / 1000).toFixed(0)}K revenue, 1% = $${(contribution / 1000).toFixed(1)}K each`,
      };
    },
  },
  {
    id: 'grocery',
    icon: <ShoppingCart size={20} strokeWidth={1.75} />,
    title: 'Grocery chain at $1/transaction',
    description: 'If one grocery chain contributed $1 per transaction',
    defaultInput: 1,
    inputLabel: 'Per transaction',
    inputUnit: '$/transaction',
    inputMin: 0.25,
    inputMax: 5,
    inputStep: 0.25,
    calculate: (perTx) => {
      const txPerYear = 2_400_000;
      const totalFunding = perTx * txPerYear;
      const farms = Math.round(totalFunding / 15_000);
      const acres = farms * 120;
      return {
        funding: totalFunding,
        farms,
        acres,
        detail: `Based on ~${(txPerYear / 1_000_000).toFixed(1)}M transactions/year at a mid-size chain`,
      };
    },
  },
  {
    id: 'trash',
    icon: <Trash2 size={20} strokeWidth={1.75} />,
    title: 'Per trash bill for compost',
    description: 'If a city added a surcharge per monthly trash bill',
    defaultInput: 1,
    inputLabel: 'Per bill/month',
    inputUnit: '$/month',
    inputMin: 0.5,
    inputMax: 5,
    inputStep: 0.5,
    calculate: (perBill) => {
      const households = 1_500_000; // LA-scale city
      const annual = perBill * households * 12;
      const tons = Math.round(annual / 25); // ~$25/ton application cost
      const acres = Math.round(tons * 4); // ~4 acres per ton of compost
      return {
        funding: annual,
        farms: Math.round(annual / 15_000),
        acres,
        detail: `Modeled on a city of ${(households / 1_000_000).toFixed(1)}M households (LA-scale)`,
      };
    },
  },
];

export default function WhatIfCalculator() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, number>>(
    Object.fromEntries(SCENARIOS.map((s) => [s.id, s.defaultInput]))
  );

  return (
    <section>
      <h2
        className="text-xl font-bold mb-1"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
      >
        What if?
      </h2>
      <p className="text-sm mb-5" style={{ color: 'var(--zfp-text-muted)' }}>
        Explore how small contributions scale into massive impact
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SCENARIOS.map((scenario) => {
          const isExpanded = expandedId === scenario.id;
          const inputValue = inputs[scenario.id];
          const result = scenario.calculate(inputValue);

          return (
            <motion.div
              key={scenario.id}
              layout
              className="rounded-xl border overflow-hidden cursor-pointer transition-shadow"
              style={{
                backgroundColor: 'var(--zfp-cream-dark)',
                borderColor: isExpanded ? 'var(--zfp-green-light)' : 'var(--zfp-border)',
                boxShadow: isExpanded ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
              }}
              onClick={() => setExpandedId(isExpanded ? null : scenario.id)}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--zfp-green-pale)', color: 'var(--zfp-green)' }}
                  >
                    {scenario.icon}
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} style={{ color: 'var(--zfp-text-muted)' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'var(--zfp-text-muted)' }} />
                  )}
                </div>

                <p className="text-sm font-medium" style={{ color: 'var(--zfp-text-muted)' }}>
                  {scenario.title}
                </p>

                {/* Result */}
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-green)' }}
                >
                  {formatCurrency(result.funding)}<span className="text-sm font-normal opacity-60">/year</span>
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--zfp-text-muted)' }}>
                  {formatNumber(result.farms)} farms across {formatNumber(result.acres)} acres
                </p>
              </div>

              {/* Expanded controls */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t"
                    style={{ borderColor: 'var(--zfp-border)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-5 space-y-4">
                      {/* Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--zfp-text-muted)' }}>
                            {scenario.inputLabel}
                          </label>
                          <span
                            className="text-sm font-medium px-2 py-0.5 rounded"
                            style={{
                              fontFamily: 'var(--font-mono)',
                              backgroundColor: 'var(--zfp-green-pale)',
                              color: 'var(--zfp-green)',
                            }}
                          >
                            {inputValue} {scenario.inputUnit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={scenario.inputMin}
                          max={scenario.inputMax}
                          step={scenario.inputStep}
                          value={inputValue}
                          onChange={(e) =>
                            setInputs({ ...inputs, [scenario.id]: parseFloat(e.target.value) })
                          }
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, var(--zfp-green) 0%, var(--zfp-green) ${
                              ((inputValue - scenario.inputMin) / (scenario.inputMax - scenario.inputMin)) * 100
                            }%, var(--zfp-border) ${
                              ((inputValue - scenario.inputMin) / (scenario.inputMax - scenario.inputMin)) * 100
                            }%, var(--zfp-border) 100%)`,
                          }}
                        />
                      </div>

                      <p className="text-xs italic" style={{ color: 'var(--zfp-text-light)' }}>
                        {result.detail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
