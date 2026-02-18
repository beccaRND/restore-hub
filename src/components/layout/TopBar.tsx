import { Search } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onCommandBarOpen: () => void;
}

export default function TopBar({ title, subtitle, onCommandBarOpen }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm"
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
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--zfp-text-muted)' }}>
            {subtitle}
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
