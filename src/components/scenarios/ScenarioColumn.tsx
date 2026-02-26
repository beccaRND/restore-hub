import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical, Edit3, Check, Layers, Sprout, MapPin } from 'lucide-react';
import type { FarmProject } from '../../types/project';
import type { FundingPot, ScenarioProject } from '../../data/funding-sources';
import { formatCurrencyFull } from '../../lib/formatters';

interface ScenarioColumnProps {
  scenarioId: string;
  name: string;
  projects: ScenarioProject[];
  allProjects: FarmProject[];
  fundingPots: FundingPot[];
  onRemoveProject: (projectId: string) => void;
  onSwapPot: (projectId: string, newPotId: string) => void;
  onRename: (newName: string) => void;
}

export default function ScenarioColumn({
  scenarioId: _scenarioId,
  name,
  projects,
  allProjects,
  fundingPots,
  onRemoveProject,
  onSwapPot,
  onRename,
}: ScenarioColumnProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [swappingId, setSwappingId] = useState<string | null>(null);

  function handleSaveName() {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setEditing(false);
  }

  // Compute totals
  const totalGrantAmount = projects.reduce((sum, sp) => sum + sp.amount, 0);
  const totalAcres = projects.reduce((sum, sp) => {
    const proj = allProjects.find((p) => p.id === sp.projectId);
    return sum + (proj?.acreage || 0);
  }, 0);
  const totalCarbonLow = projects.reduce((sum, sp) => {
    const proj = allProjects.find((p) => p.id === sp.projectId);
    return sum + (proj?.cometEstimate.low || 0);
  }, 0);
  const totalCarbonHigh = projects.reduce((sum, sp) => {
    const proj = allProjects.find((p) => p.id === sp.projectId);
    return sum + (proj?.cometEstimate.high || 0);
  }, 0);

  // Group by pot for summary
  const potTotals = fundingPots.map((pot) => {
    const potProjects = projects.filter((sp) => sp.fundingPotId === pot.id);
    const amount = potProjects.reduce((s, sp) => s + sp.amount, 0);
    return { pot, count: potProjects.length, amount };
  }).filter((pt) => pt.count > 0);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center gap-2"
        style={{ borderColor: 'var(--zfp-border)' }}
      >
        <Layers size={15} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
        {editing ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="flex-1 px-2 py-0.5 border rounded text-sm font-semibold"
              style={{
                borderColor: 'var(--zfp-border)',
                fontFamily: 'var(--font-heading)',
                color: 'var(--zfp-text)',
                backgroundColor: 'var(--zfp-white)',
              }}
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="p-0.5 rounded hover:bg-[var(--zfp-green-pale)] transition-colors"
              style={{ color: 'var(--zfp-green)' }}
            >
              <Check size={14} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <>
            <h4
              className="text-sm font-bold flex-1"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
            >
              {name}
            </h4>
            <button
              onClick={() => { setEditName(name); setEditing(true); }}
              className="p-1 rounded hover:bg-[var(--zfp-cream)] transition-colors"
              style={{ color: 'var(--zfp-text-muted)' }}
            >
              <Edit3 size={12} strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>

      {/* Totals row */}
      <div
        className="px-4 py-2.5 border-b grid grid-cols-3 gap-2"
        style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}
      >
        <div>
          <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>
            Total Grant
          </p>
          <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
            {formatCurrencyFull(totalGrantAmount)}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>
            Acres
          </p>
          <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
            {totalAcres.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--zfp-text-muted)' }}>
            tCO2e
          </p>
          <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
            {totalCarbonLow}–{totalCarbonHigh}
          </p>
        </div>
      </div>

      {/* Pot breakdown */}
      {potTotals.length > 0 && (
        <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
          <div className="flex flex-wrap gap-1.5">
            {potTotals.map(({ pot, count, amount }) => (
              <span
                key={pot.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold"
                style={{ backgroundColor: `${pot.color}20`, color: pot.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pot.color }} />
                {pot.name}: {formatCurrencyFull(amount)} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project list */}
      <div className="flex-1 overflow-y-auto max-h-[400px] divide-y" style={{ borderColor: 'var(--zfp-border)' }}>
        <AnimatePresence>
          {projects.map((sp) => {
            const project = allProjects.find((p) => p.id === sp.projectId);
            if (!project) return null;
            const pot = fundingPots.find((p) => p.id === sp.fundingPotId);
            const isSwapping = swappingId === sp.projectId;

            return (
              <motion.div
                key={sp.projectId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 py-2.5"
              >
                <div className="flex items-start gap-2">
                  <GripVertical
                    size={12}
                    strokeWidth={1.75}
                    className="mt-1 flex-shrink-0 cursor-grab"
                    style={{ color: 'var(--zfp-text-light)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--zfp-text)' }}>
                      {project.farmName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] flex items-center gap-0.5" style={{ color: 'var(--zfp-text-muted)' }}>
                        <MapPin size={8} strokeWidth={2} />
                        {project.location.county}, {project.location.state}
                      </span>
                      <span className="text-[9px]" style={{ color: 'var(--zfp-text-light)' }}>·</span>
                      <span className="text-[9px]" style={{ color: 'var(--zfp-text-muted)' }}>
                        {project.acreage.toLocaleString()} ac
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {pot && (
                        <button
                          onClick={() => setSwappingId(isSwapping ? null : sp.projectId)}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold transition-colors hover:opacity-80"
                          style={{ backgroundColor: `${pot.color}20`, color: pot.color }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pot.color }} />
                          {pot.name}
                        </button>
                      )}
                      <span className="text-[10px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>
                        {formatCurrencyFull(sp.amount)}
                      </span>
                    </div>

                    {/* Swap pot selector */}
                    {isSwapping && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {fundingPots
                          .filter((fp) => fp.id !== sp.fundingPotId)
                          .map((fp) => (
                            <button
                              key={fp.id}
                              onClick={() => { onSwapPot(sp.projectId, fp.id); setSwappingId(null); }}
                              className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold transition-colors hover:opacity-80"
                              style={{ backgroundColor: fp.color, color: '#FFFFFF' }}
                            >
                              {fp.name}
                            </button>
                          ))}
                        <button
                          onClick={() => setSwappingId(null)}
                          className="px-1.5 py-0.5 rounded-full text-[9px] font-medium border"
                          style={{ borderColor: 'var(--zfp-border)', color: 'var(--zfp-text-muted)' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onRemoveProject(sp.projectId)}
                    className="p-0.5 rounded hover:bg-red-50 transition-colors flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--zfp-text-light)' }}
                    title="Remove from scenario"
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {projects.length === 0 && (
          <div className="px-4 py-8 text-center">
            <Sprout size={24} strokeWidth={1.5} className="mx-auto mb-2" style={{ color: 'var(--zfp-text-light)' }} />
            <p className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>
              No projects assigned yet
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
              Use the Project Pool to add projects
            </p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      {projects.length > 0 && (
        <div
          className="px-4 py-2.5 border-t"
          style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium" style={{ color: 'var(--zfp-text-muted)' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[10px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-green)' }}>
              ~${(totalGrantAmount / totalAcres).toFixed(0)}/acre
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
