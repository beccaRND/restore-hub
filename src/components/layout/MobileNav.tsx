import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  BookOpen,
  RefreshCcw,
  FlaskConical,
  ClipboardList,
} from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: Sprout },
  { path: '/stories', label: 'Impact', icon: BookOpen },
  { path: '/fund', label: 'Fund', icon: RefreshCcw },
  { path: '/compost', label: 'Compost', icon: FlaskConical },
  { path: '/grants', label: 'Grants', icon: ClipboardList },
];

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t py-2 px-1 lg:hidden"
      style={{
        backgroundColor: 'var(--zfp-cream)',
        borderColor: 'var(--zfp-border)',
      }}
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors"
            style={({ isActive }) => ({
              color: isActive ? 'var(--zfp-green)' : 'var(--zfp-text-muted)',
            })}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
