import { useState } from 'react';
import { DollarSign, Edit3, Check } from 'lucide-react';
import type { FundingPot } from '../../data/funding-sources';
import { formatCurrencyFull } from '../../lib/formatters';

interface FundingPotsProps {
  pots: FundingPot[];
  allocatedPerPot: Record<string, number>;
  onUpdatePot: (id: string, amount: number) => void;
}

export default function FundingPots({ pots, allocatedPerPot, onUpdatePot }: FundingPotsProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2">
          <DollarSign size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
          <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}>
            Funding Pots
          </h3>
        </div>
        <p className="text-xs mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
          Configure available funding sources
        </p>
      </div>

      <div className="p-4 space-y-3">
        {pots.map((pot) => {
          const allocated = allocatedPerPot[pot.id] || 0;
          const remaining = pot.totalAmount - allocated;
          const pct = pot.totalAmount > 0 ? (allocated / pot.totalAmount) * 100 : 0;
          const overdrawn = remaining < 0;

          return (
            <PotCard
              key={pot.id}
              pot={pot}
              allocated={allocated}
              remaining={remaining}
              pct={pct}
              overdrawn={overdrawn}
              onUpdateAmount={(amount) => onUpdatePot(pot.id, amount)}
            />
          );
        })}

        {/* Totals row */}
        <div
          className="rounded-lg px-4 py-3 border mt-2"
          style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--zfp-text-muted)' }}>
              Total Available
            </span>
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
              {formatCurrencyFull(pots.reduce((s, p) => s + p.totalAmount, 0))}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--zfp-text-muted)' }}>
              Total Remaining
            </span>
            <span
              className="text-sm font-bold"
              style={{
                fontFamily: 'var(--font-mono)',
                color: pots.reduce((s, p) => s + p.totalAmount, 0) - Object.values(allocatedPerPot).reduce((s, v) => s + v, 0) < 0
                  ? '#DC2626' : 'var(--zfp-green)',
              }}
            >
              {formatCurrencyFull(
                pots.reduce((s, p) => s + p.totalAmount, 0) -
                Object.values(allocatedPerPot).reduce((s, v) => s + v, 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PotCard({
  pot,
  allocated,
  remaining,
  pct,
  overdrawn,
  onUpdateAmount,
}: {
  pot: FundingPot;
  allocated: number;
  remaining: number;
  pct: number;
  overdrawn: boolean;
  onUpdateAmount: (amount: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(pot.totalAmount));

  function handleSave() {
    const parsed = parseInt(editValue.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateAmount(parsed);
    }
    setEditing(false);
  }

  return (
    <div
      className="rounded-lg border px-4 py-3"
      style={{
        borderColor: overdrawn ? '#FECACA' : 'var(--zfp-border)',
        backgroundColor: overdrawn ? '#FEF2F2' : 'var(--zfp-cream-dark)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: pot.color }} />
        <span className="text-sm font-semibold flex-1" style={{ color: 'var(--zfp-text)' }}>
          {pot.name}
        </span>

        {editing ? (
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>$</span>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-20 px-1.5 py-0.5 border rounded text-xs text-right"
              style={{
                borderColor: 'var(--zfp-border)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--zfp-text)',
                backgroundColor: 'var(--zfp-white)',
              }}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-0.5 rounded hover:bg-[var(--zfp-green-pale)] transition-colors"
              style={{ color: 'var(--zfp-green)' }}
            >
              <Check size={14} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setEditValue(String(pot.totalAmount)); setEditing(true); }}
            className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
            style={{ color: 'var(--zfp-text-muted)' }}
          >
            {formatCurrencyFull(pot.totalAmount)}
            <Edit3 size={11} strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--zfp-cream)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(pct, 100)}%`,
            backgroundColor: overdrawn ? '#DC2626' : pot.color,
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
          {formatCurrencyFull(allocated)} allocated ({Math.round(pct)}%)
        </span>
        <span
          className="text-[10px] font-semibold"
          style={{ fontFamily: 'var(--font-mono)', color: overdrawn ? '#DC2626' : 'var(--zfp-green)' }}
        >
          {formatCurrencyFull(remaining)} left
        </span>
      </div>

      {overdrawn && (
        <p className="text-[10px] font-semibold mt-1" style={{ color: '#DC2626' }}>
          ⚠ Pot overdrawn by {formatCurrencyFull(Math.abs(remaining))}
        </p>
      )}
    </div>
  );
}
