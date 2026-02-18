import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2
        size={32}
        strokeWidth={1.75}
        className="animate-spin"
        style={{ color: 'var(--zfp-green)' }}
      />
      <p className="text-sm mt-3" style={{ color: 'var(--zfp-text-muted)' }}>
        {message}
      </p>
    </div>
  );
}
