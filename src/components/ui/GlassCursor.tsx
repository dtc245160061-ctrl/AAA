import React, { useEffect, useRef, useState } from 'react';

interface GlassCursorProps {
  dampening?: number;
  trailLength?: number;
  color?: string;
  showBrushTrail?: boolean;
}

interface CursorPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

type CursorMode = 'default' | 'pointer' | 'text';

export const GlassCursor: React.FC<GlassCursorProps> = ({
  dampening = 0.75,
  trailLength = 13,
  color = '#2dd4bf',
  showBrushTrail = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -200, y: -200 });
  const isHovered = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Array of trailing glass points with physics (spring/damping)
  const points = useRef<CursorPoint[]>([]);
  // History for lush digital brush stroke trail
  const brushHistory = useRef<{ x: number; y: number; time: number }[]>([]);

  useEffect(() => {
    // Touch detection
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    // Initialize trail points
    points.current = Array.from({ length: trailLength }, () => ({
      x: -200,
      y: -200,
      vx: 0,
      vy: 0,
    }));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isHovered.current) {
        isHovered.current = true;
        setIsVisible(true);
      }

      // Record brush history point
      brushHistory.current.push({
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      });

      // Interactive element detection
      const target = e.target as HTMLElement | null;
      if (target) {
        const isTextInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') !== null ||
          target.closest('textarea') !== null;

        if (isTextInput) {
          setCursorMode('text');
          return;
        }

        const isInteractive =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'SELECT' ||
          target.getAttribute('role') === 'button' ||
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          target.closest('[role="button"]') !== null ||
          target.classList.contains('cursor-pointer') ||
          target.closest('.cursor-pointer') !== null ||
          target.closest('.haven-card-interactive') !== null ||
          target.closest('.haven-btn-beam') !== null;

        if (isInteractive) {
          setCursorMode('pointer');
          return;
        }

        setCursorMode('default');
      }
    };

    const handlePointerDown = () => setIsClicking(true);
    const handlePointerUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      isHovered.current = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      isHovered.current = true;
      setIsVisible(true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation Render Loop
    const render = () => {
      const now = performance.now();

      // Physics update: lead point follows mouse with dampening
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      const p0 = points.current[0];
      if (p0) {
        const ax = (targetX - p0.x) * (1 - dampening);
        const ay = (targetY - p0.y) * (1 - dampening);
        p0.vx = (p0.vx + ax) * dampening;
        p0.vy = (p0.vy + ay) * dampening;
        p0.x += p0.vx;
        p0.y += p0.vy;
      }

      // Successive points follow predecessor with smooth cascading dampening
      for (let i = 1; i < points.current.length; i++) {
        const prev = points.current[i - 1];
        const curr = points.current[i];
        const ax = (prev.x - curr.x) * (1 - dampening * 0.92);
        const ay = (prev.y - curr.y) * (1 - dampening * 0.92);
        curr.vx = (curr.vx + ax) * (dampening * 0.88);
        curr.vy = (curr.vy + ay) * (dampening * 0.88);
        curr.x += curr.vx;
        curr.y += curr.vy;
      }

      // Filter brush history older than 360ms
      brushHistory.current = brushHistory.current.filter((p) => now - p.time < 360);

      // Draw Brush Stroke on Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (showBrushTrail && brushHistory.current.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw lush, thick digital brush stroke (cyan/emerald blend)
        for (let i = 1; i < brushHistory.current.length; i++) {
          const pt1 = brushHistory.current[i - 1];
          const pt2 = brushHistory.current[i];
          const age = (now - pt2.time) / 360; // 0 = newest, 1 = oldest
          const opacity = Math.max(0, (1 - age) * 0.7);
          // Lush thick stroke (width 16px down to 3px)
          const strokeWidth = Math.max(2, (1 - age) * 16);

          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.strokeStyle = color.startsWith('#') ? `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : color;
          ctx.lineWidth = strokeWidth;
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [dampening, trailLength, color, showBrushTrail]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Canvas for Digital Brush Stroke Trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[999990] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      />

      {/* Glass Cursor Trail Nodes (13 Refraction & Blur Lenses) */}
      <div
        className="fixed inset-0 pointer-events-none z-[999995] overflow-hidden"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {points.current.map((pt, idx) => {
          // Decreasing size along the 13 nodes (36px down to 8px)
          const progress = idx / (trailLength - 1);
          const size = Math.max(8, 36 * (1 - progress * 0.75));
          const opacity = Math.max(0.08, (1 - progress) * 0.7);

          return (
            <div
              key={idx}
              className="absolute rounded-full pointer-events-none transition-transform duration-75"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                transform: `translate3d(${pt.x - size / 2}px, ${pt.y - size / 2}px, 0)`,
                backdropFilter: 'blur(8px) saturate(140%)',
                WebkitBackdropFilter: 'blur(8px) saturate(140%)',
                background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, ${opacity * 0.6}), rgba(45, 212, 191, ${opacity * 0.25}))`,
                border: `1px solid rgba(255, 255, 255, ${opacity * 0.4})`,
                boxShadow: `inset 0 0 ${6 * (1 - progress)}px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(45, 212, 191, ${opacity * 0.3})`,
                willChange: 'transform',
              }}
            />
          );
        })}
      </div>

      {/* Custom Biophilic Sanctuary Lead Cursor Head */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[999999] transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`,
          willChange: 'transform',
        }}
      >
        {cursorMode === 'text' && (
          <div className="relative -top-3 -left-1.5 flex flex-col items-center">
            <div className="w-3 h-[1.5px] bg-cyan-300 shadow-[0_0_8px_#2dd4bf]" />
            <div className="w-[1.5px] h-5 bg-cyan-400 shadow-[0_0_8px_#10b981]" />
            <div className="w-3 h-[1.5px] bg-cyan-300 shadow-[0_0_8px_#2dd4bf]" />
          </div>
        )}

        {cursorMode === 'pointer' && (
          <div
            className={`relative -top-3 -left-3 transition-transform duration-150 ${
              isClicking ? 'scale-75' : 'scale-100'
            }`}
          >
            <div className="absolute -inset-2 rounded-full bg-cyan-400/20 blur-[8px] animate-ping" />
            <div className="relative w-7 h-7 rounded-full border border-cyan-300/80 bg-cyan-500/20 backdrop-blur-[4px] flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.6)]">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
            </div>
          </div>
        )}

        {cursorMode === 'default' && (
          <div
            className={`relative -top-1.5 -left-1.5 transition-transform duration-150 ${
              isClicking ? 'scale-75' : 'scale-100'
            }`}
          >
            <div className="absolute -inset-1.5 rounded-full bg-emerald-400/25 blur-[6px]" />
            {/* Stylized Leaf SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative drop-shadow-[0_0_8px_rgba(45,212,191,0.9)]"
            >
              <path
                d="M3 21C3 21 4 12 12 6C17 2 21 3 21 3C21 3 22 7 18 12C12 20 3 21 3 21Z"
                fill="url(#glassLeafGradient)"
                stroke="#2dd4bf"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 21C8 16 14 11 21 3"
                stroke="#a7f3d0"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle cx="21" cy="3" r="1.5" fill="#ffffff" />
              <defs>
                <linearGradient id="glassLeafGradient" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#10B981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>
    </>
  );
};
export default GlassCursor;
