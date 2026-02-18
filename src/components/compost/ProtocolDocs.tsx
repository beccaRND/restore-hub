import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, CheckCircle2 } from 'lucide-react';
import { COMPOST_PROTOCOL_STEPS } from '../../types/compost';

export default function ProtocolDocs() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} strokeWidth={1.75} style={{ color: '#52B788' }} />
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            Compost Credit Protocol
          </h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          Step-by-step guide from compost sourcing to credit issuance and fund recovery
        </p>
      </div>

      {/* Progress indicator */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-1">
          {COMPOST_PROTOCOL_STEPS.map((s, i) => (
            <div key={s.step} className="flex items-center flex-1">
              <button
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0"
                style={{
                  backgroundColor: expandedStep === i ? 'var(--zfp-green)' : 'var(--zfp-cream-dark)',
                  color: expandedStep === i ? '#FFFFFF' : 'var(--zfp-text-muted)',
                }}
              >
                {s.step}
              </button>
              {i < COMPOST_PROTOCOL_STEPS.length - 1 && (
                <div
                  className="flex-1 h-px mx-1"
                  style={{ backgroundColor: 'var(--zfp-border)' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Accordion steps */}
      <div className="px-5 py-3 space-y-1">
        {COMPOST_PROTOCOL_STEPS.map((step, i) => (
          <div
            key={step.step}
            className="rounded-lg overflow-hidden"
            style={{
              border: expandedStep === i ? '1px solid var(--zfp-green-light)' : '1px solid var(--zfp-border)',
              backgroundColor: expandedStep === i ? 'var(--zfp-green-pale)' : 'transparent',
            }}
          >
            <button
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
            >
              <span
                className="text-xs font-bold w-5 flex-shrink-0"
                style={{ color: expandedStep === i ? 'var(--zfp-green)' : 'var(--zfp-text-light)' }}
              >
                {step.step}.
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: expandedStep === i ? 'var(--zfp-green)' : 'var(--zfp-text)' }}
                >
                  {step.title}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--zfp-text-light)' }}>
                  {step.description}
                </p>
              </div>
              <ChevronDown
                size={16}
                strokeWidth={1.75}
                className="flex-shrink-0 transition-transform"
                style={{
                  color: 'var(--zfp-text-light)',
                  transform: expandedStep === i ? 'rotate(180deg)' : 'rotate(0)',
                }}
              />
            </button>

            <AnimatePresence>
              {expandedStep === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 pl-12">
                    <ul className="space-y-2">
                      {step.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs" style={{ color: 'var(--zfp-text)' }}>
                          <CheckCircle2
                            size={13}
                            strokeWidth={1.75}
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: 'var(--zfp-green)' }}
                          />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div
        className="px-5 py-3 text-[11px] border-t"
        style={{ borderColor: 'var(--zfp-border)', color: 'var(--zfp-text-light)' }}
      >
        Protocol based on Regen Network's methodology framework. Actual verification requirements may vary by credit class.
      </div>
    </motion.div>
  );
}
