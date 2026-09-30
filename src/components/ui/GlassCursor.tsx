import React, { useEffect, useRef } from 'react';

export interface GlassCursorProps {
  color?: string;
  className?: string;
}

export const GlassCursor: React.FC<GlassCursorProps> = ({
  className = '',
}) => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);

  // Position tracking (target from pointermove, cur for smooth lerp follow)
  const pos = useRef({
    targetX: -200,
    targetY: -200,
    curX: -200,
    curY: -200,
    scale: 1,
    targetScale: 1,
    isHovering: false,
    isClicking: false,
    isVisible: false,
  });

  useEffect(() => {
    // 1. Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const lens = lensRef.current;
    if (!dot || !lens) return;

    let animId: number;

    const onPointerMove = (e: PointerEvent) => {
      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;

      if (!pos.current.isVisible) {
        pos.current.curX = e.clientX;
        pos.current.curY = e.clientY;
        pos.current.isVisible = true;
        dot.style.opacity = '1';
        lens.style.opacity = '1';
      }

      // Check if hovering clickable/interactive target with a single combined query
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          Boolean(target.closest('button, a, [role="button"], .cursor-pointer, .haven-btn-beam, .haven-card-interactive'));

        pos.current.isHovering = Boolean(isClickable);
      }
    };

    const onPointerDown = () => {
      pos.current.isClicking = true;
    };

    const onPointerUp = () => {
      pos.current.isClicking = false;
    };

    const onMouseLeave = () => {
      pos.current.isVisible = false;
      if (dot && lens) {
        dot.style.opacity = '0';
        lens.style.opacity = '0';
      }
    };

    const onMouseEnter = () => {
      pos.current.isVisible = true;
      if (dot && lens) {
        dot.style.opacity = '1';
        lens.style.opacity = '1';
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // 2. High-performance 60-120 FPS hardware-accelerated Lerp loop
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      const p = pos.current;

      // Smooth liquid glass easing
      p.curX = lerp(p.curX, p.targetX, 0.22);
      p.curY = lerp(p.curY, p.targetY, 0.22);

      // Target scale computation (Click squash & subtle hover micro-expand)
      let targetScale = 1;
      if (p.isHovering) targetScale = 1.10; // Gentle 10% micro-pulse, no abnormal ballooning
      if (p.isClicking) targetScale *= 0.88;

      p.scale = lerp(p.scale, targetScale, 0.22);

      // Instant center photon dot
      dot.style.transform = `translate3d(${p.targetX}px, ${p.targetY}px, 0) translate(-50%, -50%) scale(${p.isClicking ? 0.75 : 1})`;

      // Smooth floating liquid luminous lens (Zero composite lag)
      lens.style.transform = `translate3d(${p.curX}px, ${p.curY}px, 0) translate(-50%, -50%) scale(${p.scale})`;

      if (p.isHovering) {
        lens.style.borderColor = 'rgba(52, 211, 153, 0.75)';
        lens.style.boxShadow = '0 0 16px rgba(52, 211, 153, 0.4), inset 0 0 6px rgba(52, 211, 153, 0.25)';
      } else {
        lens.style.borderColor = 'rgba(52, 211, 153, 0.45)';
        lens.style.boxShadow = '0 0 12px rgba(52, 211, 153, 0.2), inset 0 0 4px rgba(255, 255, 255, 0.15)';
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Fluid Liquid Luminous Lens (Refined 44px, Hardware accelerated) */}
      <div
        ref={lensRef}
        className="fixed top-0 left-0 w-11 h-11 rounded-full pointer-events-none opacity-0 transition-opacity duration-200 bg-emerald-500/10 border border-emerald-400/45 shadow-[0_0_16px_rgba(52,211,153,0.35)] will-change-transform backdrop-blur-[0.5px]"
        style={{
          transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
        }}
      >
        {/* Optical Specular Glint Crescent */}
        <div className="absolute top-1.5 left-2 w-3.5 h-1.5 rounded-full bg-white/55 -rotate-12 pointer-events-none blur-[0.3px]" />
        <div className="absolute inset-0 rounded-full border border-white/15 pointer-events-none" />
      </div>

      {/* 2. Pinpoint Center Photon Dot (Zero Lag, Instant Tracking) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none opacity-0 transition-opacity duration-200 bg-emerald-400 shadow-[0_0_8px_#34d399] will-change-transform"
        style={{
          transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
        }}
      />
    </div>
  );
};
