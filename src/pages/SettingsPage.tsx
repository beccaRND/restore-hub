import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Database,
  Cloud,
  Key,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import { useRegenKOI } from '../hooks/useRegenKOI';
import { useProjects } from '../hooks/useProjects';
import { useFunders } from '../hooks/useFunders';
import { isDemoMode, API_CONFIG } from '../lib/api';
import { formatNumber } from '../lib/formatters';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
          color: '#FFFFFF',
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Settings size={20} strokeWidth={1.75} />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Settings
          </h2>
        </div>
        <p className="text-sm opacity-80">
          Configure data sources, manage integrations, and control farmer privacy settings.
        </p>
      </div>

      <DataSourceSection />
      <IntegrationStatusSection />
      <FarmerPrivacySection />
      <ApiKeysSection />
      <AppInfoSection />
    </div>
  );
}

/* ========================================
   Data Source Configuration
   ======================================== */
function DataSourceSection() {
  const demoMode = isDemoMode();

  return (
    <SettingsCard
      icon={<Database size={16} strokeWidth={1.75} />}
      title="Data Source"
      description="Configure where Restore Hub loads project and funder data"
    >
      <div className="space-y-4">
        {/* Current mode */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: demoMode ? '#fef3c7' : 'var(--zfp-green-pale)',
            border: `1px solid ${demoMode ? '#fbbf24' : 'var(--zfp-green-light)'}`,
          }}
        >
          {demoMode ? (
            <AlertTriangle size={16} strokeWidth={1.75} style={{ color: '#d97706' }} />
          ) : (
            <CheckCircle2 size={16} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--zfp-text)' }}>
              {demoMode ? 'Demo Mode' : 'Live Mode'}
            </p>
            <p className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>
              {demoMode
                ? 'Using local demo data (50 projects, 5 funders). Set VITE_USE_DEMO_DATA=false to connect live sources.'
                : 'Connected to live data sources.'}
            </p>
          </div>
        </div>

        {/* Config values */}
        <div className="space-y-2">
          <ConfigRow
            label="VITE_USE_DEMO_DATA"
            value={demoMode ? 'true (default)' : 'false'}
            status={demoMode ? 'warn' : 'ok'}
          />
          <ConfigRow
            label="VITE_AIRTABLE_API_KEY"
            value={API_CONFIG.airtable.apiKey ? '••••••' + API_CONFIG.airtable.apiKey.slice(-4) : 'Not set'}
            status={API_CONFIG.airtable.apiKey ? 'ok' : 'off'}
          />
          <ConfigRow
            label="VITE_AIRTABLE_BASE_ID"
            value={API_CONFIG.airtable.baseId || 'Not set'}
            status={API_CONFIG.airtable.baseId ? 'ok' : 'off'}
          />
        </div>

        <p className="text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>
          Environment variables are set in <code className="px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'var(--zfp-cream-dark)', fontFamily: 'var(--font-mono)' }}>.env</code> and require a server restart to take effect.
        </p>
      </div>
    </SettingsCard>
  );
}

/* ========================================
   Integration Status
   ======================================== */
function IntegrationStatusSection() {
  const { status: koiStatus } = useRegenKOI();
  const { data: projects } = useProjects();
  const { data: funders } = useFunders();

  const integrations = [
    {
      name: 'Regen KOI',
      description: 'AI-powered semantic search and narrative generation',
      status: koiStatus,
      url: API_CONFIG.regenKOI.url,
      envVar: 'VITE_REGEN_KOI_MCP_URL',
    },
    {
      name: 'Project Data',
      description: `${formatNumber(projects?.length || 0)} projects loaded`,
      status: projects && projects.length > 0 ? 'online' as const : 'offline' as const,
      url: '',
      envVar: '',
    },
    {
      name: 'Funder Data',
      description: `${formatNumber(funders?.length || 0)} funders loaded`,
      status: funders && funders.length > 0 ? 'online' as const : 'offline' as const,
      url: '',
      envVar: '',
    },
  ];

  return (
    <SettingsCard
      icon={<Cloud size={16} strokeWidth={1.75} />}
      title="Integration Status"
      description="Connection status for external services and data sources"
    >
      <div className="space-y-2">
        {integrations.map((int) => (
          <div
            key={int.name}
            className="flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{ backgroundColor: 'var(--zfp-cream)' }}
          >
            <StatusDot status={int.status} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>
                {int.name}
              </p>
              <p className="text-[11px] truncate" style={{ color: 'var(--zfp-text-light)' }}>
                {int.description}
              </p>
            </div>
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: int.status === 'online' ? 'var(--zfp-green-pale)' : 'var(--zfp-cream-dark)',
                color: int.status === 'online' ? 'var(--zfp-green)' : 'var(--zfp-text-light)',
              }}
            >
              {int.status}
            </span>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}

/* ========================================
   Farmer Privacy / Opt-Out Management
   ======================================== */
function FarmerPrivacySection() {
  const { data: projects = [] } = useProjects();
  const privateProjects = projects.filter((p) => p.availability === 'private');
  const publicProjects = projects.filter((p) => p.availability !== 'private');

  return (
    <SettingsCard
      icon={<Shield size={16} strokeWidth={1.75} />}
      title="Farmer Privacy & Opt-Out"
      description="Manage project visibility. ZFP uses a permissionless listing model — projects are listed by default and farmers can opt out."
    >
      <div className="space-y-4">
        {/* Privacy stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Total Projects" value={formatNumber(projects.length)} color="var(--zfp-text)" />
          <StatBox label="Public / Listed" value={formatNumber(publicProjects.length)} color="var(--zfp-green)" />
          <StatBox label="Private / Opted Out" value={formatNumber(privateProjects.length)} color="var(--zfp-text-light)" />
        </div>

        {/* Opt-out explanation */}
        <div
          className="flex gap-3 px-4 py-3 rounded-lg"
          style={{ backgroundColor: 'var(--zfp-cream)', border: '1px solid var(--zfp-border)' }}
        >
          <Info size={16} strokeWidth={1.75} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--zfp-text-light)' }} />
          <div className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--zfp-text)' }}>Permissionless Listing Model</p>
            <p>
              Projects are listed by default when grant data is imported from Airtable.
              Farmers can request to be removed at any time by contacting ZFP.
              Private projects are hidden from the public catalog, map, and search results,
              but are still included in aggregate statistics (project counts, total acres, etc.)
              without identifying information.
            </p>
          </div>
        </div>

        {/* Private projects list */}
        {privateProjects.length > 0 && (
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'var(--zfp-text-light)' }}
            >
              Opted-Out Projects
            </p>
            <div className="space-y-1">
              {privateProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs"
                  style={{ backgroundColor: 'var(--zfp-cream)' }}
                >
                  <EyeOff size={12} strokeWidth={1.75} style={{ color: 'var(--zfp-text-light)' }} />
                  <span className="flex-1" style={{ color: 'var(--zfp-text)' }}>{p.farmName}</span>
                  <span style={{ color: 'var(--zfp-text-light)' }}>{p.location.state}</span>
                  <button
                    className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors hover:bg-[var(--zfp-green-pale)]"
                    style={{ color: 'var(--zfp-green)' }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {privateProjects.length === 0 && (
          <p className="text-xs text-center py-3" style={{ color: 'var(--zfp-text-light)' }}>
            No farmers have opted out. All projects are publicly listed.
          </p>
        )}
      </div>
    </SettingsCard>
  );
}

/* ========================================
   API Keys
   ======================================== */
function ApiKeysSection() {
  const [showKeys, setShowKeys] = useState(false);

  const keys = [
    { label: 'Airtable API Key', envVar: 'VITE_AIRTABLE_API_KEY', value: API_CONFIG.airtable.apiKey },
    { label: 'Airtable Base ID', envVar: 'VITE_AIRTABLE_BASE_ID', value: API_CONFIG.airtable.baseId },
    { label: 'Regen KOI MCP URL', envVar: 'VITE_REGEN_KOI_MCP_URL', value: API_CONFIG.regenKOI.url },
    { label: 'Mapbox Token', envVar: 'VITE_MAPBOX_TOKEN', value: API_CONFIG.mapbox.token },
  ];

  return (
    <SettingsCard
      icon={<Key size={16} strokeWidth={1.75} />}
      title="API Keys & URLs"
      description="Environment variables for external service connections"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: 'var(--zfp-green)' }}
          >
            {showKeys ? <EyeOff size={13} strokeWidth={1.75} /> : <Eye size={13} strokeWidth={1.75} />}
            {showKeys ? 'Hide values' : 'Show values'}
          </button>
        </div>

        <div className="space-y-1.5">
          {keys.map((key) => (
            <div
              key={key.envVar}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ backgroundColor: 'var(--zfp-cream)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: 'var(--zfp-text)' }}>{key.label}</p>
                <p
                  className="text-[10px] truncate"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text-light)' }}
                >
                  {key.envVar}
                </p>
              </div>
              <span
                className="text-[11px] font-medium truncate max-w-[200px]"
                style={{ fontFamily: 'var(--font-mono)', color: key.value ? 'var(--zfp-text)' : 'var(--zfp-text-light)' }}
              >
                {key.value
                  ? (showKeys ? key.value : '••••••' + (key.value.length > 4 ? key.value.slice(-4) : ''))
                  : 'Not configured'}
              </span>
              <StatusDot status={key.value ? 'online' : 'offline'} />
            </div>
          ))}
        </div>

        <p className="text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>
          Add these to your <code className="px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'var(--zfp-cream-dark)', fontFamily: 'var(--font-mono)' }}>.env</code> file.
          API keys are only used client-side in this demo. In production, sensitive keys should be routed through a backend proxy.
        </p>
      </div>
    </SettingsCard>
  );
}

/* ========================================
   App Info
   ======================================== */
function AppInfoSection() {
  return (
    <SettingsCard
      icon={<Info size={16} strokeWidth={1.75} />}
      title="About Restore Hub"
      description="Application information and version"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <InfoRow label="Version" value="1.0.0-demo" />
          <InfoRow label="Framework" value="React 19 + TypeScript" />
          <InfoRow label="Build Tool" value="Vite 7" />
          <InfoRow label="Styling" value="Tailwind CSS v4" />
          <InfoRow label="Charts" value="Recharts" />
          <InfoRow label="Maps" value="Leaflet + React-Leaflet" />
          <InfoRow label="State" value="TanStack Query" />
          <InfoRow label="Animation" value="Framer Motion" />
        </div>

        <div className="h-px" style={{ backgroundColor: 'var(--zfp-border)' }} />

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold" style={{ color: 'var(--zfp-text)' }}>
              Regen "Intel Inside" Integration
            </p>
            <p className="text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>
              Powered by Regen Network — on-chain ecological data via Regen Ledger,
              AI-powered search via Regen KOI MCP
            </p>
          </div>
          <span
            className="text-[10px] px-2 py-1 rounded-lg"
            style={{ backgroundColor: 'var(--zfp-green-pale)', color: 'var(--zfp-green)' }}
          >
            powered by Regen
          </span>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ========================================
   Shared Sub-Components
   ======================================== */

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: 'var(--zfp-green)' }}>{icon}</span>
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            {title}
          </h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          {description}
        </p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </motion.div>
  );
}

function ConfigRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: 'ok' | 'warn' | 'off';
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg"
      style={{ backgroundColor: 'var(--zfp-cream)' }}
    >
      <StatusDot
        status={status === 'ok' ? 'online' : status === 'warn' ? 'connecting' : 'offline'}
      />
      <span
        className="text-xs font-medium flex-1"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
      >
        {label}
      </span>
      <span className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
        {value}
      </span>
    </div>
  );
}

function StatusDot({ status }: { status: 'online' | 'connecting' | 'offline' }) {
  const color =
    status === 'online' ? '#22c55e' : status === 'connecting' ? '#f59e0b' : '#d1d5db';
  return (
    <span
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--zfp-cream)' }}>
      <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-mono)', color }}>
        {value}
      </p>
      <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--zfp-cream)' }}>
      <span className="text-xs" style={{ color: 'var(--zfp-text-muted)' }}>{label}</span>
      <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}>{value}</span>
    </div>
  );
}
