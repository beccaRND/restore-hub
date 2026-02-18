import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4" style={{ color: 'var(--zfp-text-light)' }}>
        {icon}
      </div>
      <h3
        className="text-lg font-bold mb-1"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-md"
        style={{ color: 'var(--zfp-text-muted)' }}
      >
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
