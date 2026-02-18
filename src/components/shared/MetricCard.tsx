interface MetricCardProps {
  label: string;
  value: string;
  accentColor?: string;
  subtitle?: string;
}

export default function MetricCard({
  label,
  value,
  accentColor = 'var(--zfp-green)',
  subtitle,
}: MetricCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl px-5 py-4"
      style={{
        backgroundColor: 'var(--zfp-cream-dark)',
        borderLeft: `4px solid ${accentColor}`,
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <p
        className="text-3xl font-medium"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--zfp-text)' }}
      >
        {value}
      </p>
      <p
        className="text-sm font-medium mt-1"
        style={{ color: 'var(--zfp-text-muted)' }}
      >
        {label}
      </p>
      {subtitle && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--zfp-text-light)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
