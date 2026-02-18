import { motion } from 'framer-motion';
import { Activity, Database, Layers, ShoppingCart, Boxes } from 'lucide-react';
import type { LedgerNetworkStats } from '../../types/ledger';
import { formatNumber } from '../../lib/formatters';

interface NetworkStatusProps {
  stats: LedgerNetworkStats;
  status: 'online' | 'connecting' | 'offline';
}

const STAT_ITEMS = [
  { key: 'totalProjects' as const, label: 'Projects', icon: Database },
  { key: 'totalCreditClasses' as const, label: 'Credit Classes', icon: Layers },
  { key: 'totalBatches' as const, label: 'Credit Batches', icon: Boxes },
  { key: 'activeSellOrders' as const, label: 'Sell Orders', icon: ShoppingCart },
  { key: 'creditTypes' as const, label: 'Credit Types', icon: Activity },
];

export default function NetworkStatus({ stats, status }: NetworkStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl p-5"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
          >
            Regen Network
          </h3>
          <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
            Live on-chain ecosystem data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                status === 'online' ? '#22c55e' : status === 'connecting' ? '#f59e0b' : '#ef4444',
            }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--zfp-text-muted)' }}>
            {status === 'online' ? 'Connected' : status === 'connecting' ? 'Connecting...' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STAT_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.25 }}
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: 'var(--zfp-cream)' }}
            >
              <Icon
                size={16}
                strokeWidth={1.75}
                className="mx-auto mb-1.5"
                style={{ color: 'var(--zfp-green)' }}
              />
              <p
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
              >
                {formatNumber(stats[item.key])}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
