import { motion } from 'framer-motion';
import { Sprout, DollarSign, MapPin, Users } from 'lucide-react';
import type { FarmProject } from '../../types/project';
import { formatCurrency, formatNumber } from '../../lib/formatters';

interface KeyMetricsProps {
  projects: FarmProject[];
}

export default function KeyMetrics({ projects }: KeyMetricsProps) {
  const totalProjects = projects.length;
  const totalAcres = projects.reduce((sum, p) => sum + p.acreage, 0);
  const totalGrants = projects.reduce((sum, p) => sum + p.grantAmount, 0);
  const states = new Set(projects.map((p) => p.location.state)).size;
  const availableProjects = projects.filter((p) => p.availability === 'available').length;

  const metrics = [
    {
      icon: <Sprout size={22} strokeWidth={1.75} />,
      label: 'Farm Projects',
      value: formatNumber(totalProjects),
      subtitle: `${availableProjects} available for engagement`,
      color: 'var(--zfp-green)',
    },
    {
      icon: <DollarSign size={22} strokeWidth={1.75} />,
      label: 'Total Grants Deployed',
      value: formatCurrency(totalGrants),
      subtitle: 'across all programs',
      color: 'var(--zfp-soil)',
    },
    {
      icon: <MapPin size={22} strokeWidth={1.75} />,
      label: 'Acres in Program',
      value: formatNumber(totalAcres),
      subtitle: `across ${states} states`,
      color: 'var(--zfp-green-light)',
    },
    {
      icon: <Users size={22} strokeWidth={1.75} />,
      label: 'Business Members',
      value: '80+',
      subtitle: 'restaurants & businesses',
      color: 'var(--zfp-green-mid)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="relative overflow-hidden rounded-xl px-5 py-4"
          style={{
            backgroundColor: 'var(--zfp-cream-dark)',
            borderLeft: `4px solid ${metric.color}`,
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="flex items-center gap-2 mb-2" style={{ color: metric.color }}>
            {metric.icon}
          </div>
          <p
            className="text-3xl font-medium"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
          >
            {metric.value}
          </p>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--zfp-text-muted)' }}>
            {metric.label}
          </p>
          {metric.subtitle && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
              {metric.subtitle}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
