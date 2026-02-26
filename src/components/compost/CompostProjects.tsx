import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight } from 'lucide-react';
import type { FarmProject } from '../../types/project';
import { formatNumber, formatCurrency, formatCarbonRange } from '../../lib/formatters';
import { STAGE_LABELS } from '../../types/project';
import {
  getProjectType,
  PROJECT_TYPE_LABELS,
  PROJECT_TYPE_COLORS,
} from '../../data/jurisdiction-data';
import type { CompostProjectType } from '../../data/jurisdiction-data';

interface CompostProjectsProps {
  projects: FarmProject[];
}

export default function CompostProjects({ projects }: CompostProjectsProps) {
  const [typeFilter, setTypeFilter] = useState<CompostProjectType | 'all'>('all');

  const compostProjects = useMemo(() => {
    let list = projects
      .filter((p) => p.practices.includes('compost_application'))
      .sort((a, b) => b.acreage - a.acreage);

    if (typeFilter !== 'all') {
      list = list.filter((p) => getProjectType(p.id) === typeFilter);
    }

    return list;
  }, [projects, typeFilter]);

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

      {/* Project type filter chips */}
      <div className="px-5 py-2.5 border-b flex flex-wrap gap-1.5" style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}>
        <FilterChip
          label="All Types"
          active={typeFilter === 'all'}
          onClick={() => setTypeFilter('all')}
        />
        {(Object.keys(PROJECT_TYPE_LABELS) as CompostProjectType[]).map((type) => {
          const colors = PROJECT_TYPE_COLORS[type];
          return (
            <FilterChip
              key={type}
              label={PROJECT_TYPE_LABELS[type]}
              active={typeFilter === type}
              onClick={() => setTypeFilter(type)}
              activeColor={colors.text}
              activeBg={colors.bg}
            />
          );
        })}
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        {compostProjects.slice(0, 8).map((p) => {
          const projectType = getProjectType(p.id);
          const typeColors = PROJECT_TYPE_COLORS[projectType];

          return (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--zfp-cream)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--zfp-text)' }}>
                    {p.farmName}
                  </p>
                  <span
                    className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold"
                    style={{ backgroundColor: typeColors.bg, color: typeColors.text }}
                  >
                    {PROJECT_TYPE_LABELS[projectType]}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
                  {p.location.county}, {p.location.state}
                </p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: 'var(--zfp-green-pale)',
                  color: 'var(--zfp-green)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {formatNumber(p.acreage)} ac
              </span>
              <span
                className="text-xs flex-shrink-0 hidden sm:inline"
                style={{ color: 'var(--zfp-text-light)' }}
              >
                {STAGE_LABELS[p.status]}
              </span>
              <ArrowRight size={13} strokeWidth={1.75} style={{ color: 'var(--zfp-text-light)' }} className="flex-shrink-0" />
            </Link>
          );
        })}
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

function FilterChip({
  label,
  active,
  onClick,
  activeColor,
  activeBg,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeColor?: string;
  activeBg?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
      style={{
        backgroundColor: active ? (activeBg || 'var(--zfp-green)') : 'var(--zfp-white)',
        color: active ? (activeColor || '#FFFFFF') : 'var(--zfp-text)',
        border: active ? 'none' : '1px solid var(--zfp-border)',
        fontWeight: active ? 600 : 500,
      }}
    >
      {label}
    </button>
  );
}
