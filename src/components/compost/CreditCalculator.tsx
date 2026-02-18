import { motion } from 'framer-motion';
import { Calculator, Leaf, DollarSign, TrendingUp } from 'lucide-react';
import { useCompostCalculator } from '../../hooks/useCompostCalculator';
import { formatNumber, formatCurrency } from '../../lib/formatters';

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  description?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>
          {label}
        </label>
        <span
          className="text-sm font-medium px-2 py-0.5 rounded"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--zfp-green)',
            backgroundColor: 'var(--zfp-green-pale)',
          }}
        >
          {formatNumber(value)}{unit}
        </span>
      </div>
      {description && (
        <p className="text-[11px] mb-2" style={{ color: 'var(--zfp-text-light)' }}>{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider w-full"
      />
      <div className="flex justify-between text-[10px] mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
        <span>{formatNumber(min)}{unit}</span>
        <span>{formatNumber(max)}{unit}</span>
      </div>
    </div>
  );
}

export default function CreditCalculator() {
  const calc = useCompostCalculator();
  const { scenario } = calc;

  const avgCredits = (scenario.residualCarbonLow + scenario.residualCarbonHigh) / 2;
  const avgValue = (scenario.estimatedCreditValueLow + scenario.estimatedCreditValueHigh) / 2;
  const costPerAcre = scenario.acres > 0 ? avgValue / scenario.acres : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Calculator size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            Compost Credit Calculator
          </h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          Model the carbon credit potential of compost application projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
        {/* Inputs */}
        <div className="px-5 py-4 space-y-5 border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--zfp-border)' }}>
          <SliderInput
            label="Acres"
            value={calc.acres}
            onChange={calc.setAcres}
            min={10}
            max={1000}
            step={10}
            unit=" ac"
            description="Total field area receiving compost"
          />
          <SliderInput
            label="Application Rate"
            value={calc.tonsPerAcre}
            onChange={calc.setTonsPerAcre}
            min={2}
            max={12}
            step={1}
            unit=" tons/ac"
            description="Typical range: 4–8 tons per acre per year"
          />
          <SliderInput
            label="Carbon Content"
            value={calc.carbonContentPercent}
            onChange={calc.setCarbonContentPercent}
            min={10}
            max={35}
            step={1}
            unit="%"
            description="Percent carbon by dry weight of compost"
          />
          <div className="grid grid-cols-2 gap-4">
            <SliderInput
              label="Residual Low"
              value={calc.residualLow}
              onChange={calc.setResidualLow}
              min={10}
              max={50}
              step={1}
              unit="%"
            />
            <SliderInput
              label="Residual High"
              value={calc.residualHigh}
              onChange={calc.setResidualHigh}
              min={20}
              max={60}
              step={1}
              unit="%"
            />
          </div>
          <SliderInput
            label="Market Rate"
            value={calc.marketRate}
            onChange={calc.setMarketRate}
            min={10}
            max={75}
            step={1}
            unit="/tCO2e"
            description="Current soil carbon credit market rate"
          />
        </div>

        {/* Results */}
        <div className="px-5 py-4 space-y-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--zfp-text-light)' }}
          >
            Estimated Outcomes
          </p>

          <ResultCard
            icon={<Leaf size={16} strokeWidth={1.75} />}
            label="Compost Applied"
            value={`${formatNumber(scenario.tonsApplied)} tons`}
            subtitle={`${formatNumber(calc.acres)} acres × ${calc.tonsPerAcre} tons/ac`}
            color="var(--zfp-green)"
          />

          <ResultCard
            icon={<TrendingUp size={16} strokeWidth={1.75} />}
            label="Estimated Carbon Credits"
            value={`${formatNumber(Math.round(scenario.residualCarbonLow))}–${formatNumber(Math.round(scenario.residualCarbonHigh))} tCO2e`}
            subtitle={`Avg: ${formatNumber(Math.round(avgCredits))} tCO2e`}
            color="#52B788"
          />

          <ResultCard
            icon={<DollarSign size={16} strokeWidth={1.75} />}
            label="Estimated Credit Value"
            value={`${formatCurrency(scenario.estimatedCreditValueLow)}–${formatCurrency(scenario.estimatedCreditValueHigh)}`}
            subtitle={`Avg: ${formatCurrency(avgValue)} (${formatCurrency(costPerAcre)}/acre)`}
            color="var(--zfp-soil)"
          />

          {/* Breakdown */}
          <div
            className="rounded-lg p-3 mt-2 text-xs space-y-1.5"
            style={{ backgroundColor: 'var(--zfp-cream)', color: 'var(--zfp-text-muted)' }}
          >
            <p className="font-semibold" style={{ color: 'var(--zfp-text)' }}>Calculation Breakdown</p>
            <p>{formatNumber(scenario.tonsApplied)} tons × {calc.carbonContentPercent}% carbon = {formatNumber(Math.round(scenario.tonsApplied * calc.carbonContentPercent / 100))} tons C</p>
            <p>Residual fraction: {calc.residualLow}–{calc.residualHigh}% remains sequestered</p>
            <p>CO2e conversion factor: 3.67 (molecular weight ratio)</p>
            <p>Market rate: ${calc.marketRate}/tCO2e</p>
          </div>

          <p className="text-[11px] italic" style={{ color: 'var(--zfp-text-light)' }}>
            Estimates use simplified assumptions. Actual credits require third-party verification and are subject to buffer pool deductions.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg p-3"
      style={{
        backgroundColor: `${color}08`,
        border: `1px solid ${color}20`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div style={{ color }}>{icon}</div>
        <p className="text-xs font-medium" style={{ color: 'var(--zfp-text-muted)' }}>{label}</p>
      </div>
      <p
        className="text-lg font-bold"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
      >
        {value}
      </p>
      <p className="text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>{subtitle}</p>
    </div>
  );
}
