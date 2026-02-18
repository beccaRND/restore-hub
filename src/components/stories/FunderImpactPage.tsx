import { useState } from 'react';
import {
  Sprout,
  MapPin,
  CloudOff,
  DollarSign,
  Calendar,
  Download,
  Share2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import type { Funder } from '../../types/funder';
import ImpactMetric from './ImpactMetric';
import PracticeBreakdown from './PracticeBreakdown';
import GradientButton from '../shared/GradientButton';
import {
  formatCurrencyFull,
  formatNumber,
  formatCarbonRange,
  formatShortDate,
  carbonToCars,
  carbonToTrees,
} from '../../lib/formatters';

// Hero images per funder
const FUNDER_HEROES: Record<string, string> = {
  'bobs-red-mill': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=500&fit=crop&q=80',
  'new-seasons-market': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=500&fit=crop&q=80',
  'kind-bar': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=500&fit=crop&q=80',
  'whole-foods': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=500&fit=crop&q=80',
  'tillamook': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=500&fit=crop&q=80',
};

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=500&fit=crop&q=80';

// Farm gallery images
const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop&q=80',
];

// Sample farmer quotes
const FARMER_QUOTES = [
  {
    quote: "The compost program transformed our soil. We're seeing earthworms again for the first time in decades.",
    farmer: "Maria G., Monterey County, CA",
  },
  {
    quote: "Cover cropping used to feel like a risk we couldn't afford. This grant changed that calculus entirely.",
    farmer: "Mike P., Boulder County, CO",
  },
  {
    quote: "My grandfather would recognize this soil now. It's dark, it holds water, it smells alive.",
    farmer: "Joan D., Linn County, OR",
  },
];

interface FunderImpactPageProps {
  funder: Funder;
}

export default function FunderImpactPage({ funder }: FunderImpactPageProps) {
  const [generatingStory, setGeneratingStory] = useState(false);
  const [generatedNarrative, setGeneratedNarrative] = useState<string | null>(null);
  const heroImage = FUNDER_HEROES[funder.slug] || DEFAULT_HERO;
  const avgCarbon = (funder.collectiveImpact.estimatedCarbonLow + funder.collectiveImpact.estimatedCarbonHigh) / 2;

  const handleGenerateStory = () => {
    setGeneratingStory(true);
    // Simulate AI generation (would connect to KOI MCP in production)
    setTimeout(() => {
      setGeneratedNarrative(
        `${funder.name}'s partnership with Zero Foodprint has been a catalyst for regenerative change across ${funder.regions.join(', ')}. ` +
        `Since ${formatShortDate(funder.partnerSince)}, their ${formatCurrencyFull(funder.contributionTotal)} commitment has directly funded ${funder.projectsSupported} farm projects, ` +
        `transforming ${formatNumber(funder.acresImpacted)} acres of agricultural land through practices like compost application, cover cropping, and managed grazing. ` +
        `The estimated carbon impact of these projects ranges from ${formatCarbonRange(funder.collectiveImpact.estimatedCarbonLow, funder.collectiveImpact.estimatedCarbonHigh)} — ` +
        `equivalent to taking ${formatNumber(carbonToCars(avgCarbon))} cars off the road for a year. ` +
        `But the numbers only tell part of the story. On the ground, farmers report darker soil, better water retention, ` +
        `and thriving ecosystems returning to land that had been depleted by decades of conventional agriculture. ` +
        `${funder.name}'s contribution isn't buying carbon credits — it's investing in the health of the land that feeds us all.`
      );
      setGeneratingStory(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: '300px' }}>
        <img
          src={heroImage}
          alt={`${funder.name} impact`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero-overlay)' }} />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--zfp-green-light)' }}>
            Impact Story
          </p>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {funder.name}
          </h1>
          <p className="text-base text-white/70 max-w-2xl">
            {funder.description}
          </p>
        </div>
      </div>

      {/* Headline metric banner */}
      <div
        className="rounded-xl p-6 text-center"
        style={{
          background: 'var(--gradient-earth)',
          color: '#FFFFFF',
        }}
      >
        <p className="text-lg sm:text-xl font-medium leading-relaxed" style={{ fontFamily: 'var(--font-heading)' }}>
          Your contribution helped fund{' '}
          <span className="font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-mono)' }}>
            {funder.projectsSupported}
          </span>{' '}
          farm projects across{' '}
          <span className="font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-mono)' }}>
            {formatNumber(funder.acresImpacted)}
          </span>{' '}
          acres in{' '}
          <span className="font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-mono)' }}>
            {funder.regions.length}
          </span>{' '}
          {funder.regions.length === 1 ? 'state' : 'states'}
        </p>
        <p className="text-sm mt-3 opacity-60">
          Partner since {formatShortDate(funder.partnerSince)}
        </p>
      </div>

      {/* Impact metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ImpactMetric
          icon={<Sprout size={24} strokeWidth={1.75} />}
          value={formatNumber(funder.projectsSupported)}
          label="Farm projects supported"
          delay={0}
        />
        <ImpactMetric
          icon={<MapPin size={24} strokeWidth={1.75} />}
          value={formatNumber(funder.acresImpacted)}
          label="Acres impacted"
          color="var(--zfp-green-mid)"
          delay={0.1}
        />
        <ImpactMetric
          icon={<DollarSign size={24} strokeWidth={1.75} />}
          value={formatCurrencyFull(funder.contributionTotal)}
          label="Total contribution"
          color="var(--zfp-soil)"
          delay={0.2}
        />
        <ImpactMetric
          icon={<CloudOff size={24} strokeWidth={1.75} />}
          value={formatCarbonRange(funder.collectiveImpact.estimatedCarbonLow, funder.collectiveImpact.estimatedCarbonHigh)}
          label="Est. carbon impact"
          color="var(--zfp-green-light)"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Narrative / Story */}
          <section
            className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                Impact Narrative
              </h2>
              {!generatedNarrative && !funder.storyNarrative && (
                <GradientButton
                  onClick={handleGenerateStory}
                  disabled={generatingStory}
                  variant="secondary"
                >
                  {generatingStory ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} strokeWidth={1.75} />
                      Generate Story
                    </>
                  )}
                </GradientButton>
              )}
            </div>

            {(funder.storyNarrative || generatedNarrative) ? (
              <p className="text-base leading-relaxed" style={{ color: 'var(--zfp-text)' }}>
                {funder.storyNarrative || generatedNarrative}
              </p>
            ) : (
              <p className="text-sm italic" style={{ color: 'var(--zfp-text-light)' }}>
                Click "Generate Story" to create an AI-powered impact narrative from this funder's project data.
                Powered by Regen KOI.
              </p>
            )}

            {(funder.storyNarrative || generatedNarrative) && (
              <p className="text-[11px] italic mt-4" style={{ color: 'var(--zfp-text-light)' }}>
                {generatedNarrative ? 'Generated by Regen KOI' : ''}
              </p>
            )}
          </section>

          {/* Practice breakdown */}
          <section
            className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)' }}
          >
            <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
              Practice Breakdown
            </h2>
            <PracticeBreakdown breakdown={funder.practiceBreakdown} />
          </section>

          {/* Carbon equivalents */}
          <section
            className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)' }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              What This Means
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--zfp-text-muted)' }}>
              Based on COMET Planner estimates, {funder.name}'s collective impact is equivalent to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <EquivalentBox
                value={formatNumber(carbonToCars(avgCarbon))}
                label="cars taken off the road for a year"
                color="var(--zfp-green)"
              />
              <EquivalentBox
                value={formatNumber(carbonToTrees(avgCarbon))}
                label="trees planted and grown for 10 years"
                color="var(--zfp-green-mid)"
              />
            </div>
            <p className="text-xs mt-4 italic" style={{ color: 'var(--zfp-text-light)' }}>
              These are approximate equivalents. Carbon estimates are shown as ranges to reflect inherent uncertainty in soil carbon modeling.
            </p>
          </section>

          {/* Farmer quotes */}
          <section
            className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)' }}
          >
            <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
              From the Farmers
            </h2>
            <div className="space-y-5">
              {FARMER_QUOTES.map((q, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-1 rounded-full"
                    style={{ backgroundColor: 'var(--zfp-green-light)' }}
                  />
                  <div>
                    <p className="text-base italic leading-relaxed" style={{ color: 'var(--zfp-text)' }}>
                      "{q.quote}"
                    </p>
                    <p className="text-sm mt-1.5 font-medium" style={{ color: 'var(--zfp-text-muted)' }}>
                      — {q.farmer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Photo gallery */}
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              From the Field
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GALLERY_IMAGES.map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-[4/3]">
                  <img
                    src={src}
                    alt={`Farm project ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Partner info */}
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)' }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--zfp-text-muted)' }}>
              Partnership Details
            </h3>
            <DetailRow
              icon={<Calendar size={14} strokeWidth={1.75} />}
              label="Partner since"
              value={formatShortDate(funder.partnerSince)}
            />
            <DetailRow
              icon={<MapPin size={14} strokeWidth={1.75} />}
              label="Regions"
              value={funder.regions.join(', ')}
            />
            <DetailRow
              icon={<DollarSign size={14} strokeWidth={1.75} />}
              label="Total contributed"
              value={formatCurrencyFull(funder.contributionTotal)}
            />
          </div>

          {/* Share / Export actions */}
          <div
            className="rounded-xl border p-5 space-y-3"
            style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)' }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--zfp-text-muted)' }}>
              Share This Story
            </h3>
            <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
              Share this impact page on your sustainability page or export as a branded PDF report.
            </p>
            <GradientButton className="w-full">
              <Share2 size={14} strokeWidth={1.75} />
              Copy Shareable Link
            </GradientButton>
            <GradientButton variant="secondary" className="w-full">
              <Download size={14} strokeWidth={1.75} />
              Export PDF Report
            </GradientButton>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--zfp-soil-pale)', borderLeft: '3px solid var(--zfp-soil)' }}
          >
            <p className="text-xs leading-relaxed" style={{ color: 'var(--zfp-soil)' }}>
              This page reflects intervention-based collective contributions, not proportional ownership of outcomes. Carbon estimates are based on COMET Planner models and represent potential sequestration ranges, not verified offset quantities.
            </p>
          </div>

          {/* Regen branding */}
          <div className="text-center pt-2">
            <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
              Methodology research via Regen KOI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EquivalentBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div
      className="rounded-xl border p-5 text-center"
      style={{ backgroundColor: 'var(--zfp-cream-dark)', borderColor: 'var(--zfp-border)' }}
    >
      <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)', color }}>
        {value}
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--zfp-text-muted)' }}>
        {label}
      </p>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2" style={{ color: 'var(--zfp-text-muted)' }}>
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>
        {value}
      </span>
    </div>
  );
}
