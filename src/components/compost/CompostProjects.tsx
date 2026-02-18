import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight } from 'lucide-react';
import type { FarmProject } from '../../types/project';
import { formatNumber, formatCurrency, formatCarbonRange } from '../../lib/formatters';
import { STAGE_LABELS } from '../../types/project';

interface CompostProjectsProps {
  projects: FarmProject[];
}

export default function CompostProjects({ projects }: CompostProjectsProps) {
  const compostProjects = projects
    .filter((p) => p.practices.includes('compost_application'))
    .sort((a, b) => b.acreage - a.acreage);

  const totalAcres = compostProjects.reduce((s, p) => s + p.acreage, 0);
  const totalGrants = compostProjects.reduce((s, p) => s + p.grantAmount, 0);
  const avgCarbonLow = compostProjects.reduce((s, p) => s + p.cometEstimate.low, 0);
  const avgCarbonHigh = compostProjects.reduce((s, p) => s + p.cometEstimate.high, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sprout size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
            <h3
              className="text-base font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
            >
              Compost Application Projects
            </h3>
          </div>
          <span
            className="text-sm font-medium"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-muted)' }}
          >
            {compostProjects.length} projects
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          <span>{formatNumber(totalAcres)} total acres</span>
          <span>{formatCurrency(totalGrants)} in grants</span>
          <span>{formatCarbonRange(avgCarbonLow, avgCarbonHigh)} est. sequestration</span>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        {compostProjects.slice(0, 8).map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[var(--zfp-cream)]"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--zfp-text)' }}>
                {p.farmName}
              </p>
              <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
                {p.location.county}, {p.location.state}
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--zfp-green-pale)',
                color: 'var(--zfp-green)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {formatNumber(p.acreage)} ac
            </span>
            <span
              className="text-xs flex-shrink-0"
              style={{ color: 'var(--zfp-text-light)' }}
            >
              {STAGE_LABELS[p.status]}
            </span>
            <ArrowRight size={13} strokeWidth={1.75} style={{ color: 'var(--zfp-text-light)' }} />
          </Link>
        ))}
      </div>

      {compostProjects.length > 8 && (
        <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--zfp-border)' }}>
          <Link
            to="/projects"
            className="text-xs font-medium transition-colors hover:underline"
            style={{ color: 'var(--zfp-green)' }}
          >
            View all {compostProjects.length} compost projects →
          </Link>
        </div>
      )}
    </motion.div>
  );
}
