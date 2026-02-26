import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, X, RotateCcw, ChevronRight } from 'lucide-react';
import { useDemoMode } from '../context/DemoModeContext';

const SCALE_OPTIONS = [1, 2, 5, 10];

export default function DemoModeToggle() {
  const {
    enabled,
    overrides,
    toggleDemo,
    updateOverrides,
    resetOverrides,
  } = useDemoMode();
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      {/* Floating toggle button — fixed bottom-right */}
      <button
        onClick={() => setPanelOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-colors text-sm font-semibold"
        style={{
          backgroundColor: enabled ? 'var(--zfp-green)' : 'var(--zfp-cream-dark)',
          color: enabled ? '#FFFFFF' : 'var(--zfp-text)',
          border: enabled ? 'none' : '1px solid var(--zfp-border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}
        title="Demo Mode"
      >
        <Presentation size={16} strokeWidth={2} />
        {enabled ? 'Demo On' : 'Demo'}
        <ChevronRight
          size={14}
          strokeWidth={2}
          className="transition-transform"
          style={{ transform: panelOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Demo banner when active */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-3 py-1.5 text-xs font-semibold"
            style={{
              background: 'linear-gradient(90deg, #2D6A4F 0%, #52B788 50%, #8B6914 100%)',
              color: '#FFFFFF',
            }}
          >
            <Presentation size={14} strokeWidth={2} />
            Demo Mode — Customize for your audience
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out config panel */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55]"
              style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
              onClick={() => setPanelOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 z-[56] overflow-y-auto border-l"
              style={{
                backgroundColor: 'var(--zfp-white)',
                borderColor: 'var(--zfp-border)',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
              }}
            >
              {/* Panel Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: 'var(--zfp-border)' }}
              >
                <div className="flex items-center gap-2">
                  <Presentation size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
                  <h3
                    className="text-sm font-bold"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
                  >
                    Demo Mode
                  </h3>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-1 rounded hover:bg-[var(--zfp-cream)] transition-colors"
                  style={{ color: 'var(--zfp-text-muted)' }}
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              <div className="px-5 py-4 space-y-5">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold" style={{ color: 'var(--zfp-text)' }}>
                    Enable Demo Mode
                  </label>
                  <button
                    onClick={toggleDemo}
                    className="relative w-10 h-5 rounded-full transition-colors"
                    style={{
                      backgroundColor: enabled ? 'var(--zfp-green)' : 'var(--zfp-border)',
                    }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                      animate={{ left: enabled ? 22 : 2 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    />
                  </button>
                </div>

                {enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Organization Name */}
                    <DemoField
                      label="Organization Name"
                      placeholder="e.g., Green Valley Initiative"
                      value={overrides.organizationName}
                      onChange={(v) => updateOverrides({ organizationName: v })}
                      hint="Replaces 'Restore Hub' throughout"
                    />

                    {/* Region / Jurisdiction */}
                    <DemoField
                      label="Region / Jurisdiction"
                      placeholder="e.g., Sonoma County, CA"
                      value={overrides.region}
                      onChange={(v) => updateOverrides({ region: v })}
                      hint="Replaces state references"
                    />

                    {/* Sample Farm Names */}
                    <div>
                      <label
                        className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
                        style={{ color: 'var(--zfp-text-muted)' }}
                      >
                        Sample Farm Names
                      </label>
                      <textarea
                        value={overrides.sampleFarmNames}
                        onChange={(e) => updateOverrides({ sampleFarmNames: e.target.value })}
                        placeholder="Oak Creek Ranch, Valley View Farm, Hillside Organics"
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border text-xs outline-none resize-none"
                        style={{
                          borderColor: 'var(--zfp-border)',
                          backgroundColor: 'var(--zfp-cream)',
                          color: 'var(--zfp-text)',
                          fontFamily: 'var(--font-body)',
                        }}
                      />
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
                        Comma-separated. Replaces project farm names.
                      </p>
                    </div>

                    {/* Scale Factor */}
                    <div>
                      <label
                        className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5"
                        style={{ color: 'var(--zfp-text-muted)' }}
                      >
                        Funding Scale
                      </label>
                      <div className="flex gap-2">
                        {SCALE_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateOverrides({ scaleFactor: s })}
                            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            style={{
                              backgroundColor:
                                overrides.scaleFactor === s ? 'var(--zfp-green)' : 'var(--zfp-cream)',
                              color: overrides.scaleFactor === s ? '#FFFFFF' : 'var(--zfp-text)',
                              border:
                                overrides.scaleFactor === s
                                  ? 'none'
                                  : '1px solid var(--zfp-border)',
                            }}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] mt-1" style={{ color: 'var(--zfp-text-light)' }}>
                        Scales currency amounts across dashboard
                      </p>
                    </div>

                    {/* Reset */}
                    <button
                      onClick={resetOverrides}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium w-full justify-center transition-colors hover:bg-[var(--zfp-cream)]"
                      style={{
                        borderColor: 'var(--zfp-border)',
                        color: 'var(--zfp-text-muted)',
                      }}
                    >
                      <RotateCcw size={12} strokeWidth={2} />
                      Reset to Defaults
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function DemoField({
  label,
  placeholder,
  value,
  onChange,
  hint,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label
        className="block text-[10px] uppercase tracking-wider font-semibold mb-1"
        style={{ color: 'var(--zfp-text-muted)' }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
        style={{
          borderColor: 'var(--zfp-border)',
          backgroundColor: 'var(--zfp-cream)',
          color: 'var(--zfp-text)',
          fontFamily: 'var(--font-body)',
        }}
      />
      {hint && (
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
