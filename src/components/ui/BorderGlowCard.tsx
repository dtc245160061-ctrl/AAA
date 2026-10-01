import React, { useRef, useCallback } from 'react';
import '../../styles/borderGlow.css';

export interface BorderGlowCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  edgeSensitivity?: number;
  borderRadius?: number;
  glowRadius?: number;
  coneSpread?: number;
  colors?: string[];
  backgroundColor?: string;
  enableAmbientContinuous?: boolean;
  enableHoverTracking?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const BorderGlowCard: React.FC<BorderGlowCardProps> = ({
  children,
  className = '',
  style = {},
  edgeSensitivity = 25,
  borderRadius = 24,
  glowRadius = 32,
  coneSpread = 28,
  colors = ['#34d399', 'rgba(52, 211, 153, 0.5)', 'rgba(16, 185, 129, 0.25)'],
  backgroundColor = '#0B0F17',
  enableAmbientContinuous = true,
  enableHoverTracking = true,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableHoverTracking) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const dx = x - cx;
    const dy = y - cy;

    // Edge proximity computation (0 to 1)
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    // Cursor angle computation in degrees (0 to 360)
    let angle = 45;
    if (dx !== 0 || dy !== 0) {
      const radians = Math.atan2(dy, dx);
      angle = radians * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
    }

    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(2)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(2)}deg`);
  }, [enableHoverTracking]);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--edge-proximity', '0');
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`border-glow-card relative group ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--edge-sensitivity': edgeSensitivity,
        '--cone-spread': coneSpread,
        '--glow-color': colors[0] || '#34d399',
        '--glow-color-60': colors[1] || '#38bdf8',
        '--glow-color-30': colors[2] || '#c084fc',
        ...style
      } as React.CSSProperties}
    >
      {/* 1. Continuous Ambient Running Beam (Dynamic Breathing Easing Curve) */}
      {enableAmbientContinuous && (
        <>
          {/* Soft outer glow bloom */}
          <div className="haven-ambient-glow-box--blur" aria-hidden="true" />
          {/* Crisp refined border line */}
          <div className="haven-ambient-glow-box" aria-hidden="true" />
        </>
      )}

      {/* 2. Interactive Cursor Edge Light on Hover */}
      {enableHoverTracking && (
        <span className="edge-light" aria-hidden="true" />
      )}

      {/* Inner Content Slot */}
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  );
};
