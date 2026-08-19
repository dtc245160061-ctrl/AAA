import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--haven-emerald-500)] hover:bg-[var(--haven-emerald-400)]',
    'text-[var(--haven-text-inverse)] font-semibold',
    'border border-transparent',
    'shadow-[0_0_16px_rgba(16,185,129,0.2)]',
    'hover:shadow-[0_0_24px_rgba(16,185,129,0.3)]',
    'active:scale-[0.97]',
  ].join(' '),
  secondary: [
    'bg-transparent hover:bg-[var(--haven-surface-hover)]',
    'text-[var(--haven-text-primary)] font-medium',
    'border border-[var(--haven-border-strong)]',
    'hover:border-[var(--haven-border-accent)]',
  ].join(' '),
  ghost: [
    'bg-transparent hover:bg-[var(--haven-surface-hover)]',
    'text-[var(--haven-text-secondary)] hover:text-[var(--haven-text-primary)]',
    'border border-transparent',
  ].join(' '),
  danger: [
    'bg-[var(--haven-rose-muted)] hover:bg-[rgba(244,63,94,0.18)]',
    'text-[var(--haven-rose-400)] font-medium',
    'border border-[rgba(244,63,94,0.25)]',
    'hover:border-[rgba(244,63,94,0.4)]',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[var(--text-xs)] gap-1.5 rounded-[var(--radius-md)]',
  md: 'px-4 py-2 text-[var(--text-sm)] gap-2 rounded-[var(--radius-lg)]',
  lg: 'px-6 py-3 text-[var(--text-base)] gap-2.5 rounded-[var(--radius-xl)]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={[
        'inline-flex items-center justify-center',
        'font-[var(--font-body)]',
        'transition-all duration-[var(--duration-standard)] ease-[var(--ease-micro)]',
        'focus-ring',
        'select-none whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {icon && <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{iconRight}</span>}
    </button>
  );
};
