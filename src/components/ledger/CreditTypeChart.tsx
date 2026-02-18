import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import type { LedgerCreditClass, LedgerCreditType } from '../../types/ledger';

interface CreditTypeChartProps {
  classes: LedgerCreditClass[];
  creditTypes: LedgerCreditType[];
}

const TYPE_COLORS: Record<string, string> = {
  C: '#2D6A4F',
  BT: '#8B6914',
  KSH: '#52B788',
  MBS: '#2563eb',
  USS: '#9333ea',
};

export default function CreditTypeChart({ classes, creditTypes }: CreditTypeChartProps) {
  const byType = creditTypes.map((ct) => {
    const typeClasses = classes.filter((c) => c.creditType === ct.abbreviation);
    return {
      name: ct.abbreviation,
      fullName: ct.name,
      classes: typeClasses.length,
      projects: typeClasses.reduce((s, c) => s + c.projectCount, 0),
      batches: typeClasses.reduce((s, c) => s + c.batchCount, 0),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      className="rounded-xl p-5"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Activity size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
        <h3
          className="text-base font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
        >
          Credit Types Distribution
        </h3>
      </div>
      <p className="text-xs mb-4" style={{ color: 'var(--zfp-text-light)' }}>
        Breakdown by credit type across the Regen ecosystem
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byType}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="projects"
                strokeWidth={0}
              >
                {byType.map((d) => (
                  <Cell key={d.name} fill={TYPE_COLORS[d.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip
                formatter={((value: number, _: string, entry: { payload: { fullName: string } }) => [
                  `${value} projects`,
                  entry.payload.fullName,
                ]) as never}
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

        <div className="flex-1 space-y-2 w-full">
          {byType.map((d) => (
            <div key={d.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: TYPE_COLORS[d.name] || '#94a3b8' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>
                  {d.name}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'var(--zfp-text-light)' }}>
                  {d.fullName}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs flex-shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--zfp-text)' }}>{d.classes} classes</span>
                <span style={{ color: 'var(--zfp-text-muted)' }}>{d.projects} proj</span>
                <span style={{ color: 'var(--zfp-text-light)' }}>{d.batches} bat</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
