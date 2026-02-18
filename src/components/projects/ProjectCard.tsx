import { Link } from 'react-router-dom';
import { MapPin, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FarmProject } from '../../types/project';
import { PRACTICE_LABELS, FUND_SOURCE_LABELS } from '../../types/project';
import StatusBadge from '../shared/StatusBadge';
import { formatCurrency, formatNumber, formatCarbonRange } from '../../lib/formatters';

// Regional placeholder images from Unsplash (public, free to use)
const REGION_IMAGES: Record<string, string> = {
  CA: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=340&fit=crop&q=80',
  CO: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=340&fit=crop&q=80',
  OR: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=340&fit=crop&q=80',
  WA: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=340&fit=crop&q=80',
  NY: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&h=340&fit=crop&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=340&fit=crop&q=80';

interface ProjectCardProps {
  project: FarmProject;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const image = project.heroImage || REGION_IMAGES[project.location.state] || DEFAULT_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/projects/${project.id}`}
        className="block rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 group"
        style={{
          backgroundColor: 'var(--zfp-cream-dark)',
          borderColor: 'var(--zfp-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Hero image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={`${project.farmName} farm`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay at bottom for readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-16"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.3))' }}
          />
          {/* Availability badge */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={project.availability} />
          </div>
          {/* Fund source tag */}
          <div className="absolute bottom-3 left-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: 'var(--zfp-green-deep)',
              }}
            >
              {FUND_SOURCE_LABELS[project.fundSource]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3.5">
          {/* Farm name & location */}
          <h3
            className="text-lg font-bold leading-tight truncate"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            {project.farmName}
          </h3>
          <div className="flex items-center gap-1 mt-1" style={{ color: 'var(--zfp-text-muted)' }}>
            <MapPin size={13} strokeWidth={1.75} />
            <span className="text-sm">
              {project.location.county}, {project.location.state}
            </span>
          </div>

          {/* Practice tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.practices.slice(0, 3).map((practice) => (
              <span
                key={practice}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--zfp-green-pale)',
                  color: 'var(--zfp-green)',
                }}
              >
                <Leaf size={10} strokeWidth={2} />
                {PRACTICE_LABELS[practice]}
              </span>
            ))}
          </div>

          {/* Bottom row: acreage, carbon, grant */}
          <div
            className="flex items-center justify-between mt-3 pt-3 border-t"
            style={{ borderColor: 'var(--zfp-border)' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
              >
                {formatNumber(project.acreage)} ac
              </span>
              <span
                className="text-xs"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-muted)' }}
              >
                {formatCarbonRange(project.cometEstimate.low, project.cometEstimate.high)}
              </span>
            </div>
            <span
              className="text-sm font-medium"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-soil)' }}
            >
              {formatCurrency(project.grantAmount)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
