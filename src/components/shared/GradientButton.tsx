import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'warm';
  size?: 'default' | 'large';
}

const VARIANT_STYLES = {
  primary: {
    background: 'var(--zfp-green)',
    color: '#FFFFFF',
    border: 'none',
    hoverBg: 'var(--zfp-green-deep)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--zfp-green)',
    border: '2px solid var(--zfp-green)',
    hoverBg: 'var(--zfp-green-pale)',
  },
  warm: {
    background: 'var(--zfp-soil)',
    color: '#FFFFFF',
    border: 'none',
    hoverBg: 'var(--zfp-soil-light)',
  },
};

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  ...props
}: GradientButtonProps) {
  const style = VARIANT_STYLES[variant];
  const padding = size === 'large' ? '16px 32px' : '12px 24px';

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider text-sm rounded-lg transition-all duration-150 hover:-translate-y-px ${className}`}
      style={{
        backgroundColor: style.background,
        color: style.color,
        border: style.border,
        padding,
        fontFamily: 'var(--font-body)',
        borderRadius: 'var(--radius-button)',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
