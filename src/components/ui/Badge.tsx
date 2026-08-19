import React from 'react';

type BadgeVariant = 'emerald' | 'amber' | 'rose' | 'sky' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  dot = false,
  icon,
  className = '',
  children,
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {dot && <span className={`status-dot status-dot-${variant === 'emerald' ? 'active' : variant === 'amber' ? 'warning' : variant === 'rose' ? 'danger' : 'neutral'}`} />}
      {icon && <span className="shrink-0 [&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
      {children}
    </span>
  );
};
