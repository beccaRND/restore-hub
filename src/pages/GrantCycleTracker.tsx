import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Sprout,
  MapPin,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useProjects } from '../hooks/useProjects';
import LoadingState from '../components/shared/LoadingState';
import {
  formatCurrency,
  formatNumber,
  formatShortDate,
} from '../lib/formatters';
import type { FarmProject, ProjectStage, FundSource } from '../types/project';
import { STAGE_LABELS, FUND_SOURCE_LABELS } from '../types/project';

const STAGE_ORDER: ProjectStage[] = [
  'granted',
  'implementing',
  'implemented',
  'listed',
  'interest_received',
  'credit_issued',
  'credit_sold',
  'recouped',
];

const STAGE_COLORS: Record<ProjectStage, string> = {
  granted: '#52B788',
  implementing: '#40916C',
  implemented: '#2D6A4F',
  listed: '#C9A227',
  interest_received: '#8B6914',
  credit_issued: '#527984',
  credit_sold: '#4FB573',
  recouped: '#1B4332',
};

const FUND_COLORS: Record<FundSource, string> = {
  restore_ca: '#2D6A4F',
  restore_co: '#52B788',
  restore_nw: '#40916C',
  restore_or: '#95D5B2',
  cdfa_hsp: '#8B6914',
  compost_connector: '#C9A227',
  campaign: '#527984',
};

function computeStats(projects: FarmProject[]) {
  const totalDeployed = projects.reduce((s, p) => s + p.grantAmount, 0);
  const totalAcres = projects.reduce((s, p) => s + p.acreage, 0);
  const avgGrant = projects.length > 0 ? totalDeployed / projects.length : 0;
  const states = new Set(projects.map((p) => p.location.state));

  // Pipeline by stage
  const pipeline = STAGE_ORDER.map((stage) => {
    const inStage = projects.filter((p) => p.status === stage);
    return {
      stage,
      label: STAGE_LABELS[stage],
      count: inStage.length,
      amount: inStage.reduce((s, p) => s + p.grantAmount, 0),
      color: STAGE_COLORS[stage],
    };
  }).filter((s) => s.count > 0);

  // Fund source breakdown
  const fundMap = new Map<FundSource, { count: number; amount: number }>();
  for (const p of projects) {
    const existing = fundMap.get(p.fundSource) || { count: 0, amount: 0 };
    fundMap.set(p.fundSource, {
      count: existing.count + 1,
      amount: existing.amount + p.grantAmount,
    });
  }
  const fundBreakdown = Array.from(fundMap.entries())
    .map(([source, data]) => ({
      source,
      label: FUND_SOURCE_LABELS[source],
      ...data,
      color: FUND_COLORS[source],
    }))
    .sort((a, b) => b.amount - a.amount);

  // Monthly deployment (last 12 months)
  const monthlyMap = new Map<string, number>();
  for (const p of projects) {
    const key = p.grantDate.slice(0, 7); // YYYY-MM
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + p.grantAmount);
  }
  const monthlyDeployment = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, amount]) => ({
      month: formatShortDate(month + '-01'),
      amount,
    }));

  return {
    totalDeployed,
    totalAcres,
    avgGrant,
    projectCount: projects.length,
    stateCount: states.size,
    pipeline,
    fundBreakdown,
    monthlyDeployment,
  };
}

export default function GrantCycleTracker() {
  const { data: projects = [], isLoading } = useProjects();

  const stats = useMemo(() => computeStats(projects), [projects]);

  if (isLoading) {
    return <LoadingState message="Loading grant data..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div
        className="rounded-xl px-6 py-5"
        style={{ background: 'var(--gradient-earth)', color: '#FFFFFF' }}
      >
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList size={20} strokeWidth={1.75} />
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255, 255, 255, 0.85)' }}
          >
            Grant Cycle Tracker
          </h2>
        </div>
        <p className="text-sm opacity-80">
          Track grant rounds, pipeline status, and fund deployment across all
          ZFP programs. An outward-facing view of operational progress.
        </p>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          icon={<DollarSign size={18} strokeWidth={1.75} />}
          label="Total Deployed"
          value={formatCurrency(stats.totalDeployed)}
          color="var(--zfp-green)"
        />
        <MetricCard
          icon={<Sprout size={18} strokeWidth={1.75} />}
          label="Farm Projects"
          value={formatNumber(stats.projectCount)}
          color="var(--zfp-green-mid)"
        />
        <MetricCard
          icon={<MapPin size={18} strokeWidth={1.75} />}
          label="States Active"
          value={String(stats.stateCount)}
          color="var(--zfp-soil)"
        />
        <MetricCard
          icon={<TrendingUp size={18} strokeWidth={1.75} />}
          label="Avg Grant Size"
          value={formatCurrency(stats.avgGrant)}
          color="var(--regen-teal)"
        />
        <MetricCard
          icon={<CheckCircle2 size={18} strokeWidth={1.75} />}
          label="Total Acres"
          value={formatNumber(stats.totalAcres)}
          color="var(--zfp-green-deep)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline — left 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pipeline stages */}
          <Section title="Grant Pipeline" subtitle="Projects by lifecycle stage">
            <div className="space-y-2">
              {stats.pipeline.map((stage) => {
                const pct =
                  stats.projectCount > 0
                    ? (stage.count / stats.projectCount) * 100
                    : 0;
                return (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <span
                      className="text-xs font-medium w-28 text-right truncate"
                      style={{ color: 'var(--zfp-text-muted)' }}
                    >
                      {stage.label}
                    </span>
                    <div
                      className="flex-1 h-7 rounded-md overflow-hidden relative"
                      style={{ backgroundColor: 'var(--zfp-cream)' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(pct, 2)}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-md flex items-center px-2"
                        style={{ backgroundColor: stage.color }}
                      >
                        <span
                          className="text-[11px] font-semibold text-white whitespace-nowrap"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {stage.count}
                        </span>
                      </motion.div>
                    </div>
                    <span
                      className="text-xs w-16 text-right"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--zfp-text-muted)',
                      }}
                    >
                      {formatCurrency(stage.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Monthly deployment chart */}
          <Section
            title="Monthly Deployment"
            subtitle="Grant funds deployed over time"
          >
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyDeployment}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--zfp-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: 'var(--zfp-text-light)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--zfp-text-light)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => formatCurrency(v)}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      'Deployed',
                    ]}
                    contentStyle={{
                      backgroundColor: 'var(--zfp-white)',
                      border: '1px solid var(--zfp-border)',
                      borderRadius: '8px',
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="var(--zfp-green)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* Sidebar — right col */}
        <div className="space-y-8">
          {/* Fund source breakdown */}
          <Section title="By Fund Source" subtitle="Grant distribution by program">
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.fundBreakdown}
                    dataKey="amount"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {stats.fundBreakdown.map((entry) => (
                      <Cell key={entry.source} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'var(--zfp-white)',
                      border: '1px solid var(--zfp-border)',
                      borderRadius: '8px',
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {stats.fundBreakdown.map((fund) => (
                <div
                  key={fund.source}
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: fund.color }}
                  />
                  <span
                    className="flex-1 truncate"
                    style={{ color: 'var(--zfp-text)' }}
                  >
                    {fund.label}
                  </span>
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--zfp-text-muted)',
                    }}
                  >
                    {fund.count}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Demand signal callout */}
          <div
            className="rounded-xl border p-5"
            style={{
              backgroundColor: 'var(--zfp-soil-pale)',
              borderColor: 'var(--zfp-soil-light)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock
                size={16}
                strokeWidth={1.75}
                style={{ color: 'var(--zfp-soil)' }}
              />
              <h4
                className="text-sm font-bold"
                style={{ color: 'var(--zfp-soil)' }}
              >
                Demand Signal
              </h4>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--zfp-text)' }}>
              Last round: 362 applications requesting $7M against $400K
              available. 20x oversubscribed.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--zfp-cream)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '5.7%',
                      backgroundColor: 'var(--zfp-soil)',
                    }}
                  />
                </div>
              </div>
              <span
                className="text-[11px] font-semibold"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--zfp-soil)',
                }}
              >
                5.7% funded
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div
            className="rounded-xl border p-5 space-y-2"
            style={{
              backgroundColor: 'var(--zfp-cream-dark)',
              borderColor: 'var(--zfp-border)',
            }}
          >
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--zfp-text-muted)' }}
            >
              Quick Links
            </h4>
            <QuickLink label="View all projects" href="/projects" />
            <QuickLink label="Funder impact stories" href="/stories" />
            <QuickLink label="Revolving fund status" href="/fund" />
            <QuickLink label="Compost protocol" href="/compost" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
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
      <div className="mb-2" style={{ color }}>
        {icon}
      </div>
      <p
        className="text-lg font-bold"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
      >
        {value}
      </p>
      <p className="text-[11px]" style={{ color: 'var(--zfp-text-muted)' }}>
        {label}
      </p>
    </motion.div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--zfp-white)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        className="px-5 py-4 border-b"
        style={{ borderColor: 'var(--zfp-border)' }}
      >
        <h3
          className="text-base font-bold"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--zfp-text)',
          }}
        >
          {title}
        </h3>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          {subtitle}
        </p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </motion.div>
  );
}

function QuickLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--zfp-green-pale)]"
      style={{ color: 'var(--zfp-green)' }}
    >
      <ArrowRight size={13} strokeWidth={1.75} />
      {label}
    </a>
  );
}
