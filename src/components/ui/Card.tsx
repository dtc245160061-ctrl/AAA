import React from 'react';

type CardVariant = 'raised' | 'elevated' | 'hero' | 'flat';

interface CardProps {
  variant?: CardVariant;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  raised: 'surface-raised',
  elevated: 'surface-elevated',
  hero: 'surface-hero',
  flat: '',
};

export const Card: React.FC<CardProps> = ({
  variant = 'raised',
  interactive = false,
  className = '',
  onClick,
  children,
}) => {
  const baseClass = interactive ? 'surface-raised-interactive' : variantStyles[variant];

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`${baseClass} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};
