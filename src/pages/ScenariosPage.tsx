import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Copy, DollarSign, Sprout, BarChart3, Layers } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { DEFAULT_FUNDING_POTS } from '../data/funding-sources';
import type { FundingPot, Scenario, ScenarioProject } from '../data/funding-sources';
import { formatCurrencyFull } from '../lib/formatters';

import FundingPots from '../components/scenarios/FundingPots';
import ProjectPool from '../components/scenarios/ProjectPool';
import ScenarioColumn from '../components/scenarios/ScenarioColumn';
import ScenarioComparison from '../components/scenarios/ScenarioComparison';

function createEmptyScenario(index: number): Scenario {
  return {
    id: `scenario-${Date.now()}-${index}`,
    name: `Scenario ${index}`,
    projects: [],
  };
}

export default function ScenariosPage() {
  const { data: allProjects = [] } = useProjects();

  // Funding pots with editable amounts
  const [fundingPots, setFundingPots] = useState<FundingPot[]>(DEFAULT_FUNDING_POTS);

  // Scenarios (start with one)
  const [scenarios, setScenarios] = useState<Scenario[]>([createEmptyScenario(1)]);

  // Active scenario tab
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);

  // View: 'builder' or 'compare'
  const [view, setView] = useState<'builder' | 'compare'>('builder');

  const activeScenario = scenarios[activeScenarioIdx] || scenarios[0];

  // All assigned project IDs across the active scenario
  const assignedProjectIds = useMemo(() => {
    return new Set(activeScenario?.projects.map((sp) => sp.projectId) || []);
  }, [activeScenario]);

  // Allocated per pot (for the active scenario)
  const allocatedPerPot = useMemo(() => {
    const map: Record<string, number> = {};
    if (activeScenario) {
      for (const sp of activeScenario.projects) {
        map[sp.fundingPotId] = (map[sp.fundingPotId] || 0) + sp.amount;
      }
    }
    return map;
  }, [activeScenario]);

  // Total metrics for stat cards
  const totalMetrics = useMemo(() => {
    const totalBudget = fundingPots.reduce((s, p) => s + p.totalAmount, 0);
    const totalAllocated = activeScenario?.projects.reduce((s, sp) => s + sp.amount, 0) || 0;
    const totalProjects = activeScenario?.projects.length || 0;
    const totalAcres = activeScenario?.projects.reduce((s, sp) => {
      const proj = allProjects.find((p) => p.id === sp.projectId);
      return s + (proj?.acreage || 0);
    }, 0) || 0;
    return { totalBudget, totalAllocated, totalProjects, totalAcres };
  }, [fundingPots, activeScenario, allProjects]);

  // Handlers
  const handleUpdatePot = useCallback((id: string, amount: number) => {
    setFundingPots((prev) => prev.map((p) => (p.id === id ? { ...p, totalAmount: amount } : p)));
  }, []);

  const handleAssignProject = useCallback((projectId: string, potId: string) => {
    const project = allProjects.find((p) => p.id === projectId);
    if (!project) return;

    const newSP: ScenarioProject = {
      projectId,
      fundingPotId: potId,
      amount: project.grantAmount,
    };

    setScenarios((prev) =>
      prev.map((s, i) =>
        i === activeScenarioIdx ? { ...s, projects: [...s.projects, newSP] } : s
      )
    );
  }, [allProjects, activeScenarioIdx]);

  const handleRemoveProject = useCallback((projectId: string) => {
    setScenarios((prev) =>
      prev.map((s, i) =>
        i === activeScenarioIdx
          ? { ...s, projects: s.projects.filter((sp) => sp.projectId !== projectId) }
          : s
      )
    );
  }, [activeScenarioIdx]);

  const handleSwapPot = useCallback((projectId: string, newPotId: string) => {
    setScenarios((prev) =>
      prev.map((s, i) =>
        i === activeScenarioIdx
          ? {
              ...s,
              projects: s.projects.map((sp) =>
                sp.projectId === projectId ? { ...sp, fundingPotId: newPotId } : sp
              ),
            }
          : s
      )
    );
  }, [activeScenarioIdx]);

  const handleRenameScenario = useCallback((newName: string) => {
    setScenarios((prev) =>
      prev.map((s, i) => (i === activeScenarioIdx ? { ...s, name: newName } : s))
    );
  }, [activeScenarioIdx]);

  const handleAddScenario = useCallback(() => {
    if (scenarios.length >= 3) return;
    const newScenario = createEmptyScenario(scenarios.length + 1);
    setScenarios((prev) => [...prev, newScenario]);
    setActiveScenarioIdx(scenarios.length);
  }, [scenarios.length]);

  const handleDuplicateScenario = useCallback(() => {
    if (scenarios.length >= 3) return;
    const dup: Scenario = {
      ...activeScenario,
      id: `scenario-${Date.now()}-dup`,
      name: `${activeScenario.name} (Copy)`,
      projects: [...activeScenario.projects],
    };
    setScenarios((prev) => [...prev, dup]);
    setActiveScenarioIdx(scenarios.length);
  }, [activeScenario, scenarios.length]);

  const handleDeleteScenario = useCallback(() => {
    if (scenarios.length <= 1) return;
    setScenarios((prev) => prev.filter((_, i) => i !== activeScenarioIdx));
    setActiveScenarioIdx((prev) => Math.max(0, prev - 1));
  }, [activeScenarioIdx, scenarios.length]);

  return (
    <div className="space-y-6">
      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign size={18} strokeWidth={1.75} />}
          label="Total Budget"
          value={formatCurrencyFull(totalMetrics.totalBudget)}
          color="var(--zfp-green)"
        />
        <StatCard
          icon={<DollarSign size={18} strokeWidth={1.75} />}
          label="Allocated"
          value={formatCurrencyFull(totalMetrics.totalAllocated)}
          color={totalMetrics.totalAllocated > totalMetrics.totalBudget ? '#DC2626' : 'var(--zfp-green)'}
          sub={`${Math.round((totalMetrics.totalAllocated / Math.max(totalMetrics.totalBudget, 1)) * 100)}% of budget`}
        />
        <StatCard
          icon={<Layers size={18} strokeWidth={1.75} />}
          label="Projects"
          value={String(totalMetrics.totalProjects)}
          color="var(--zfp-soil)"
        />
        <StatCard
          icon={<Sprout size={18} strokeWidth={1.75} />}
          label="Total Acres"
          value={totalMetrics.totalAcres.toLocaleString()}
          color="var(--zfp-green)"
        />
      </div>

      {/* View toggle + Scenario tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {/* Scenario tabs */}
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveScenarioIdx(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: i === activeScenarioIdx ? 'var(--zfp-green)' : 'var(--zfp-cream)',
                color: i === activeScenarioIdx ? '#FFFFFF' : 'var(--zfp-text)',
                border: i === activeScenarioIdx ? 'none' : '1px solid var(--zfp-border)',
              }}
            >
              {s.name}
            </button>
          ))}

          {scenarios.length < 3 && (
            <button
              onClick={handleAddScenario}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--zfp-cream)]"
              style={{ borderColor: 'var(--zfp-border)', color: 'var(--zfp-text-muted)' }}
            >
              <Plus size={12} strokeWidth={2} />
              Add
            </button>
          )}

          <button
            onClick={handleDuplicateScenario}
            className="p-1.5 rounded-lg border transition-colors hover:bg-[var(--zfp-cream)]"
            style={{ borderColor: 'var(--zfp-border)', color: 'var(--zfp-text-muted)' }}
            title="Duplicate scenario"
            disabled={scenarios.length >= 3}
          >
            <Copy size={13} strokeWidth={1.75} />
          </button>

          {scenarios.length > 1 && (
            <button
              onClick={handleDeleteScenario}
              className="p-1.5 rounded-lg border transition-colors hover:bg-red-50"
              style={{ borderColor: 'var(--zfp-border)', color: '#DC2626' }}
              title="Delete scenario"
            >
              <Trash2 size={13} strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div
          className="flex rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--zfp-border)' }}
        >
          <button
            onClick={() => setView('builder')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: view === 'builder' ? 'var(--zfp-green)' : 'var(--zfp-white)',
              color: view === 'builder' ? '#FFFFFF' : 'var(--zfp-text)',
            }}
          >
            <Layers size={12} strokeWidth={2} />
            Builder
          </button>
          <button
            onClick={() => setView('compare')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: view === 'compare' ? 'var(--zfp-green)' : 'var(--zfp-white)',
              color: view === 'compare' ? '#FFFFFF' : 'var(--zfp-text)',
            }}
          >
            <BarChart3 size={12} strokeWidth={2} />
            Compare
          </button>
        </div>
      </div>

      {/* Builder view */}
      {view === 'builder' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* Left: Funding Pots */}
          <div className="lg:col-span-3">
            <FundingPots
              pots={fundingPots}
              allocatedPerPot={allocatedPerPot}
              onUpdatePot={handleUpdatePot}
            />
          </div>

          {/* Center: Project Pool */}
          <div className="lg:col-span-4">
            <ProjectPool
              projects={allProjects}
              assignedProjectIds={assignedProjectIds}
              fundingPots={fundingPots}
              onAssign={handleAssignProject}
            />
          </div>

          {/* Right: Scenario Workspace */}
          <div className="lg:col-span-5">
            <ScenarioColumn
              scenarioId={activeScenario.id}
              name={activeScenario.name}
              projects={activeScenario.projects}
              allProjects={allProjects}
              fundingPots={fundingPots}
              onRemoveProject={handleRemoveProject}
              onSwapPot={handleSwapPot}
              onRename={handleRenameScenario}
            />
          </div>
        </motion.div>
      )}

      {/* Compare view */}
      {view === 'compare' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScenarioComparison
            scenarios={scenarios}
            allProjects={allProjects}
            fundingPots={fundingPots}
          />
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border p-4"
      style={{
        backgroundColor: 'var(--zfp-cream-dark)',
        borderColor: 'var(--zfp-border)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: 'var(--zfp-text-muted)' }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-lg font-bold"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}
