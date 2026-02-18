import { motion } from 'framer-motion';

interface DemandGaugeProps {
  totalRequests: number;
  totalRequested: number;
  totalFunded: number;
}

export default function DemandGauge({ totalRequests, totalRequested, totalFunded }: DemandGaugeProps) {
  const ratio = Math.round(totalRequested / totalFunded);
  const fundedPercent = (totalFunded / totalRequested) * 100;
  const gap = totalRequested - totalFunded;

  return (
    <section
      className="relative rounded-2xl overflow-hidden px-8 py-10"
      style={{
        background: 'var(--gradient-hero-overlay)',
        color: '#FFFFFF',
      }}
    >
      {/* Subtle topo pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm0 5C16.193 5 5 16.193 5 30s11.193 25 25 25 25-11.193 25-25S43.807 5 30 5zm0 10c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: 'var(--zfp-green-light)' }}
        >
          Demand Signal
        </p>

        {/* Big numbers */}
        <div className="flex flex-wrap gap-x-16 gap-y-6 mb-10">
          <div>
            <motion.p
              className="text-7xl font-extrabold leading-none"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {totalRequests.toLocaleString()}
            </motion.p>
            <p className="text-base mt-2 opacity-70">grant requests</p>
          </div>
          <div>
            <motion.p
              className="text-7xl font-extrabold leading-none"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              ${(totalRequested / 1_000_000).toFixed(0)}M
            </motion.p>
            <p className="text-base mt-2 opacity-70">total funding requested</p>
          </div>
        </div>

        {/* Demand bar */}
        <div className="max-w-3xl">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="opacity-70">
              Funded: <span className="font-semibold text-white">${(totalFunded / 1_000).toFixed(0)}K</span>
            </span>
            <span className="opacity-70">
              Unfunded gap: <span className="font-semibold" style={{ color: '#FCA5A5' }}>${(gap / 1_000_000).toFixed(1)}M</span>
            </span>
          </div>

          {/* Bar */}
          <div className="relative h-8 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            {/* Unfunded portion - subtle hatching */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(220,38,38,0.15) 4px, rgba(220,38,38,0.15) 8px)',
              }}
            />
            {/* Funded portion */}
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                background: 'var(--gradient-cta)',
                boxShadow: '0 0 20px rgba(82, 183, 136, 0.4)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${fundedPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            />
            {/* Funded label inside bar */}
            <motion.div
              className="absolute left-0 top-0 h-full flex items-center justify-end pr-3"
              style={{ width: `${Math.max(fundedPercent, 8)}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-xs font-bold text-white/90 whitespace-nowrap">
                {fundedPercent.toFixed(1)}%
              </span>
            </motion.div>
          </div>

          {/* Ratio callout */}
          <motion.p
            className="text-3xl font-bold mt-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-green-light)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {ratio}x oversubscribed
          </motion.p>
          <p className="text-sm opacity-60 mt-1">
            For every dollar available, ${ratio} in requests are waiting
          </p>
        </div>
      </div>
    </section>
  );
}
