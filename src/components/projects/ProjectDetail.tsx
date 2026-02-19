import {
  MapPin,
  Calendar,
  Leaf,
  CloudOff,
  DollarSign,
  TreePine,
  Car,
  Send,
  Shield,
} from 'lucide-react';
import type { FarmProject } from '../../types/project';
import { PRACTICE_LABELS, FUND_SOURCE_LABELS, STAGE_LABELS } from '../../types/project';
import StatusBadge from '../shared/StatusBadge';
import GradientButton from '../shared/GradientButton';
import {
  formatCurrencyFull,
  formatNumber,
  formatCarbonRange,
  formatDate,
  carbonToCars,
  carbonToTrees,
} from '../../lib/formatters';

const REGION_IMAGES: Record<string, string> = {
  CA: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=500&fit=crop&q=80',
  CO: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=500&fit=crop&q=80',
  OR: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=500&fit=crop&q=80',
  WA: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=500&fit=crop&q=80',
  NY: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&h=500&fit=crop&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=500&fit=crop&q=80';

const PRACTICE_DESCRIPTIONS: Record<string, string> = {
  compost_application: 'Applying compost to agricultural land to increase soil organic matter, improve water retention, and sequester carbon.',
  cover_cropping: 'Planting cover crops between cash crop seasons to protect soil, fix nitrogen, and build organic matter.',
  managed_grazing: 'Rotating livestock across pastures to promote grass recovery, reduce overgrazing, and enhance soil carbon.',
  hedgerow_planting: 'Establishing native hedgerows along field borders for biodiversity, wind protection, and carbon storage.',
  windbreaks: 'Planting rows of trees or shrubs to reduce wind erosion and create microclimates for crop protection.',
  silvopasture: 'Integrating trees with livestock grazing to provide shade, sequester carbon, and diversify farm income.',
  reduced_tillage: 'Minimizing soil disturbance to preserve soil structure, reduce erosion, and maintain carbon stocks.',
  nutrient_management: 'Optimizing fertilizer application to reduce emissions while maintaining crop productivity.',
  riparian_buffer: 'Planting vegetation along waterways to filter runoff, stabilize banks, and create wildlife corridors.',
};

interface ProjectDetailProps {
  project: FarmProject;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const image = project.heroImage || REGION_IMAGES[project.location.state] || DEFAULT_IMAGE;
  const avgCarbon = (project.cometEstimate.low + project.cometEstimate.high) / 2;

  return (
    <div className="space-y-8">
      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: '320px' }}>
        <img
          src={image}
          alt={`${project.farmName}`}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'var(--gradient-hero-overlay)' }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="flex items-start justify-between">
            <div>
              <StatusBadge status={project.availability} className="mb-3" />
              <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255, 255, 255, 0.75)' }}>
                {project.farmName}
              </h1>
              <div className="flex items-center gap-1.5 mt-2 text-white/80">
                <MapPin size={16} strokeWidth={1.75} />
                <span className="text-base">
                  {project.location.county}, {project.location.state}
                </span>
              </div>
            </div>
            {project.availability !== 'private' && project.availability !== 'committed' && (
              <GradientButton variant="warm">
                <Send size={16} strokeWidth={1.75} />
                Express Interest
              </GradientButton>
            )}
          </div>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox
          icon={<Leaf size={20} strokeWidth={1.75} />}
          label="Acreage"
          value={`${formatNumber(project.acreage)} acres`}
          color="var(--zfp-green)"
        />
        <MetricBox
          icon={<CloudOff size={20} strokeWidth={1.75} />}
          label="Est. Carbon Impact"
          value={formatCarbonRange(project.cometEstimate.low, project.cometEstimate.high)}
          color="var(--zfp-green-mid)"
        />
        <MetricBox
          icon={<DollarSign size={20} strokeWidth={1.75} />}
          label="Grant Received"
          value={formatCurrencyFull(project.grantAmount)}
          color="var(--zfp-soil)"
        />
        <MetricBox
          icon={<Calendar size={20} strokeWidth={1.75} />}
          label="Grant Date"
          value={formatDate(project.grantDate)}
          color="var(--zfp-text-muted)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Farm story */}
          {project.story && (
            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                About This Farm
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--zfp-text)' }}>
                {project.story}
              </p>
            </section>
          )}

          {/* Practices */}
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Regenerative Practices
            </h2>
            <div className="space-y-3">
              {project.practices.map((practice) => (
                <div
                  key={practice}
                  className="flex gap-4 p-4 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--zfp-cream-dark)',
                    borderColor: 'var(--zfp-border)',
                  }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--zfp-green-pale)', color: 'var(--zfp-green)' }}
                  >
                    <Leaf size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--zfp-text)' }}>
                      {PRACTICE_LABELS[practice]}
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--zfp-text-muted)' }}>
                      {PRACTICE_DESCRIPTIONS[practice]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Carbon equivalents */}
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              What This Means
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--zfp-text-muted)' }}>
              Based on COMET Planner estimates ({formatCarbonRange(project.cometEstimate.low, project.cometEstimate.high)}), this project's impact is equivalent to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <EquivalentCard
                icon={<Car size={24} strokeWidth={1.75} />}
                value={formatNumber(carbonToCars(avgCarbon))}
                label="cars taken off the road for a year"
              />
              <EquivalentCard
                icon={<TreePine size={24} strokeWidth={1.75} />}
                value={formatNumber(carbonToTrees(avgCarbon))}
                label="trees planted and grown for 10 years"
              />
            </div>
            <p className="text-xs mt-3 italic" style={{ color: 'var(--zfp-text-light)' }}>
              These are approximate equivalents based on EPA conversion factors. Carbon estimates from COMET Planner are shown as ranges to reflect inherent uncertainty in soil carbon modeling.
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Project info card */}
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{
              backgroundColor: 'var(--zfp-cream-dark)',
              borderColor: 'var(--zfp-border)',
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--zfp-text-muted)' }}>
              Project Details
            </h3>

            <DetailRow label="Fund Source" value={FUND_SOURCE_LABELS[project.fundSource]} />
            <DetailRow label="Project Stage" value={STAGE_LABELS[project.status]} />
            <DetailRow label="Availability" value={project.availability.replace('_', ' ')} />
            {project.farmerName && <DetailRow label="Farmer" value={project.farmerName} />}
            {project.soilSamples && <DetailRow label="Soil Samples" value="Collected" />}
          </div>

          {/* Express interest CTA */}
          {project.availability === 'available' && (
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--zfp-green-pale)',
                borderColor: 'var(--zfp-green-light)',
              }}
            >
              <h3
                className="font-bold mb-2"
                style={{ color: 'var(--zfp-green-deep)' }}
              >
                Interested in this project?
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--zfp-green)' }}>
                Express your interest and the ZFP team will connect you with next steps for supporting this farm.
              </p>
              <GradientButton className="w-full">
                <Send size={16} strokeWidth={1.75} />
                Express Interest
              </GradientButton>
            </div>
          )}

          {/* Regen Ledger provenance */}
          {project.regenLedgerIRI && (
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--zfp-cream-dark)',
                borderColor: 'var(--zfp-border)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} strokeWidth={1.75} style={{ color: 'var(--regen-accent)' }} />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--zfp-text-muted)' }}
                >
                  Data Anchored on Regen Ledger
                </span>
              </div>
              <p
                className="text-[11px] break-all"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-light)' }}
              >
                {project.regenLedgerIRI}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
                  powered by Regen
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        backgroundColor: 'var(--zfp-cream-dark)',
        borderColor: 'var(--zfp-border)',
      }}
    >
      <div className="mb-2" style={{ color }}>
        {icon}
      </div>
      <p
        className="text-lg font-medium"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
      >
        {value}
      </p>
      <p className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>
        {label}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: 'var(--zfp-text-muted)' }}>
        {label}
      </span>
      <span className="text-sm font-medium capitalize" style={{ color: 'var(--zfp-text)' }}>
        {value}
      </span>
    </div>
  );
}

function EquivalentCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border p-4"
      style={{
        backgroundColor: 'var(--zfp-cream-dark)',
        borderColor: 'var(--zfp-border)',
      }}
    >
      <div style={{ color: 'var(--zfp-green)' }}>{icon}</div>
      <div>
        <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-green)' }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>
          {label}
        </p>
      </div>
    </div>
  );
}
