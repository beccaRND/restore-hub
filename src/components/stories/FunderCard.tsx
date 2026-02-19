import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Sprout, CloudOff, ArrowRight } from 'lucide-react';
import type { Funder } from '../../types/funder';
import { formatCurrency, formatNumber, formatCarbonRange } from '../../lib/formatters';

// Regional hero images for funder cards
const FUNDER_IMAGES: Record<string, string> = {
  'bobs-red-mill': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=300&fit=crop&q=80',
  'new-seasons-market': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=300&fit=crop&q=80',
  'kind-bar': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=300&fit=crop&q=80',
  'whole-foods': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=300&fit=crop&q=80',
  'tillamook': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=300&fit=crop&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=300&fit=crop&q=80';

interface FunderCardProps {
  funder: Funder;
  index?: number;
}

export default function FunderCard({ funder, index = 0 }: FunderCardProps) {
  const image = FUNDER_IMAGES[funder.slug] || DEFAULT_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Link
        to={`/stories/${funder.slug}`}
        className="block rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 group"
        style={{
          backgroundColor: 'var(--zfp-cream-dark)',
          borderColor: 'var(--zfp-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Hero image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={`${funder.name} partnership`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(transparent 40%, rgba(26,26,26,0.7))' }}
          />
          <div className="absolute bottom-4 left-5 right-5">
            <h3
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-cream)' }}
            >
              {funder.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--zfp-text-muted)' }}>
            {funder.description}
          </p>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatItem
              icon={<Sprout size={14} strokeWidth={1.75} />}
              value={formatNumber(funder.projectsSupported)}
              label="projects"
            />
            <StatItem
              icon={<MapPin size={14} strokeWidth={1.75} />}
              value={formatNumber(funder.acresImpacted)}
              label="acres"
            />
            <StatItem
              icon={<CloudOff size={14} strokeWidth={1.75} />}
              value={formatCarbonRange(funder.collectiveImpact.estimatedCarbonLow, funder.collectiveImpact.estimatedCarbonHigh)}
              label="est. carbon"
            />
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--zfp-border)' }}>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-soil)' }}
              >
                {formatCurrency(funder.contributionTotal)}
              </span>
              <span className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
                contributed
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--zfp-green)' }}>
              View impact story
              <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-1" style={{ color: 'var(--zfp-green)' }}>{icon}</div>
      <p className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
        {value}
      </p>
      <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>{label}</p>
    </div>
  );
}
