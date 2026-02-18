import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ImpactMetricProps {
  icon: ReactNode;
  value: string;
  label: string;
  color?: string;
  delay?: number;
}

export default function ImpactMetric({
  icon,
  value,
  label,
  color = 'var(--zfp-green)',
  delay = 0,
}: ImpactMetricProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="text-center"
    >
      <div className="flex justify-center mb-2" style={{ color }}>
        {icon}
      </div>
      <p
        className="text-4xl font-bold"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
      >
        {value}
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--zfp-text-muted)' }}>
        {label}
      </p>
    </motion.div>
  );
}
