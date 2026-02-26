import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  BookOpen,
  RefreshCcw,
  FlaskConical,
  ClipboardList,
  ClipboardCheck,
  GitBranch,
  MapPin,
  Settings,
  Search,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { NAV_ITEMS } from '../../lib/constants';
import { useDemoMode } from '../../context/DemoModeContext';

const ICON_MAP = {
  LayoutDashboard,
  Sprout,
  BookOpen,
  RefreshCcw,
  FlaskConical,
  ClipboardList,
  ClipboardCheck,
  GitBranch,
  MapPin,
  Settings,
} as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onCommandBarOpen: () => void;
}

export default function Sidebar({ collapsed, onToggle, onCommandBarOpen }: SidebarProps) {
  const { demoOrgName } = useDemoMode();
  const brandName = demoOrgName('RESTORE HUB');

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col border-r transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-[260px]'
      }`}
      style={{
        backgroundColor: 'var(--zfp-cream)',
        borderColor: 'var(--zfp-border)',
      }}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        {!collapsed && (
          <div>
            <h1
              className="text-lg tracking-wide font-bold leading-tight"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-green-deep)' }}
            >
              {brandName}
            </h1>
            <span
              className="text-[10px] tracking-wide"
              style={{ color: 'var(--zfp-text-muted)' }}
            >
              powered by Regen
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-[var(--zfp-cream-dark)] transition-colors"
          style={{ color: 'var(--zfp-text-muted)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={20} strokeWidth={1.75} /> : <PanelLeftClose size={20} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'border-l-[3px] font-semibold'
                    : 'border-l-[3px] border-transparent hover:bg-[var(--zfp-cream-dark)]'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      borderLeftColor: 'var(--zfp-green)',
                      backgroundColor: 'var(--zfp-green-pale)',
                      color: 'var(--zfp-green-deep)',
                    }
                  : { color: 'var(--zfp-text)' }
              }
            >
              <Icon size={20} strokeWidth={1.75} />
              {!collapsed && (
                <span className="text-[15px]" style={{ fontFamily: 'var(--font-body)' }}>
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Command bar trigger */}
      <div className="px-3 pb-4">
        <button
          onClick={onCommandBarOpen}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--zfp-cream-dark)] ${
            collapsed ? 'justify-center' : ''
          }`}
          style={{
            borderColor: 'var(--zfp-border)',
            color: 'var(--zfp-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
          }}
        >
          <Search size={16} strokeWidth={1.75} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Search...</span>
              <kbd
                className="text-[11px] px-1.5 py-0.5 rounded border"
                style={{
                  borderColor: 'var(--zfp-border-strong)',
                  backgroundColor: 'var(--zfp-cream)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {'\u2318'}K
              </kbd>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
