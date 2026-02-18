import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MobileNav from './components/layout/MobileNav';
import CommandBar from './components/layout/CommandBar';
import { useProjects } from './hooks/useProjects';
import { useFunders } from './hooks/useFunders';

import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetailPage from './pages/ProjectDetailPage';
import FunderStories from './pages/FunderStories';
import FunderStoryPage from './pages/FunderStoryPage';
import RevolvingFund from './pages/RevolvingFund';
import CompostProtocol from './pages/CompostProtocol';
import RegenLedgerPage from './pages/RegenLedgerPage';
import MapPage from './pages/MapPage';
import SettingsPage from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview of ZFP programs and demand signals' },
  '/projects': { title: 'Projects', subtitle: '425+ farm projects across 4 states' },
  '/stories': { title: 'Funder Stories', subtitle: 'Corporate engagement and impact narratives' },
  '/fund': { title: 'Revolving Fund', subtitle: 'Grant-to-credit lifecycle tracking' },
  '/compost': { title: 'Compost Protocol', subtitle: 'Compost credit modeling and scenarios' },
  '/ledger': { title: 'Regen Ledger', subtitle: 'On-chain ecological data and credit classes' },
  '/map': { title: 'Project Map', subtitle: 'Geographic view of all farm projects' },
  '/settings': { title: 'Settings', subtitle: 'Configuration and integrations' },
};

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const location = useLocation();
  const { data: projects = [] } = useProjects();
  const { data: funders = [] } = useFunders();

  const openCommandBar = useCallback(() => setCommandBarOpen(true), []);
  const closeCommandBar = useCallback(() => setCommandBarOpen(false), []);

  // Global Cmd+K to open command bar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandBarOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const basePath = '/' + (location.pathname.split('/')[1] || '');
  const pageInfo = PAGE_TITLES[basePath] || { title: 'Restore Hub' };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--zfp-cream)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onCommandBarOpen={openCommandBar}
        />
      </div>

      {/* Main content area — offset by sidebar width on desktop */}
      <div
        className="transition-all duration-300 lg:pb-0 pb-20"
        style={{
          paddingLeft: 'var(--main-offset, 0px)',
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            :root {
              --main-offset: ${sidebarCollapsed ? '64px' : '260px'};
            }
          }
          @media (max-width: 1023px) {
            :root {
              --main-offset: 0px;
            }
          }
        `}</style>

        <TopBar
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onCommandBarOpen={openCommandBar}
        />

        <div className="px-4 sm:px-6 py-6 max-w-[1200px] mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/stories" element={<FunderStories />} />
            <Route path="/stories/:slug" element={<FunderStoryPage />} />
            <Route path="/fund" element={<RevolvingFund />} />
            <Route path="/compost" element={<CompostProtocol />} />
            <Route path="/ledger" element={<RegenLedgerPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Command bar overlay */}
      <CommandBar isOpen={commandBarOpen} onClose={closeCommandBar} projects={projects} funders={funders} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
