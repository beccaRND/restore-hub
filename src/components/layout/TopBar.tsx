import { Search } from 'lucide-react';
import { useDemoMode } from '../../context/DemoModeContext';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onCommandBarOpen: () => void;
}

export default function TopBar({ title, subtitle, onCommandBarOpen }: TopBarProps) {
  const { enabled, overrides } = useDemoMode();

  // Add demo mode top offset when banner is showing
  const topOffset = enabled ? 'top-[28px]' : 'top-0';

  // If on Dashboard and demo has custom org name, show it in subtitle
  const displaySubtitle =
    enabled && overrides.organizationName && title === 'Dashboard'
      ? `Overview of ${overrides.organizationName} programs`
      : subtitle;
  return (
    <header
      className={`sticky ${topOffset} z-30 flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm`}
      style={{
        backgroundColor: 'rgba(250, 246, 241, 0.9)',
        borderColor: 'var(--zfp-border)',
      }}
    >
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
        >
          {title}
        </h1>
        {displaySubtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--zfp-text-muted)' }}>
            {displaySubtitle}
          </p>
        )}
      </div>

      <button
        onClick={onCommandBarOpen}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--zfp-cream-dark)] lg:hidden"
        style={{
          borderColor: 'var(--zfp-border)',
          color: 'var(--zfp-text-muted)',
          fontSize: '14px',
        }}
      >
        <Search size={16} strokeWidth={1.75} />
      </button>
    </header>
  );
}
