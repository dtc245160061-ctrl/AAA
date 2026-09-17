import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  time: number;
}

type CursorMode = 'default' | 'pointer' | 'text';

export const HavenCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  // Raw mouse coordinates (instant)
  const mousePos = useRef({ x: -100, y: -100 });
  // Lerped smooth coordinates (with keyframe lag / fluid trailing)
  const smoothPos = useRef({ x: -100, y: -100 });
  // Trailing points history for ribbon line
  const points = useRef<Point[]>([]);

  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

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
      if (!isVisible) setIsVisible(true);

      // Add to trailing history
      points.current.push({
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      });

      // Detect hover target type
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
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Render loop: Lerp coordinates + Draw Trailing Line
    const render = () => {
      const now = performance.now();

      // Smooth Lerp (0.22 damping for silky organic delay)
      smoothPos.current.x += (mousePos.current.x - smoothPos.current.x) * 0.22;
      smoothPos.current.y += (mousePos.current.y - smoothPos.current.y) * 0.22;

      // Update Cursor Element directly via transform for 60fps GPU performance
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${smoothPos.current.x}px, ${smoothPos.current.y}px, 0)`;
      }

      // Filter out points older than 260ms
      points.current = points.current.filter((p) => now - p.time < 260);

      // Draw Trailing Line
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.current.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw flowing glowing trailing stream
        for (let i = 1; i < points.current.length; i++) {
          const p1 = points.current[i - 1];
          const p2 = points.current[i];
          const age = (now - p2.time) / 260; // 0 (newest) to 1 (oldest)
          const opacity = Math.max(0, (1 - age) * 0.65);
          const strokeWidth = Math.max(0.5, (1 - age) * 3.5);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(52, 211, 153, ${opacity})`;
          ctx.lineWidth = strokeWidth;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
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
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* 1. Canvas for Smooth Trailing Line */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[999998] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      />

      {/* 2. Custom Morphing Cursor Head */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[999999] transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          willChange: 'transform',
        }}
      >
        {/* State: Text I-Beam */}
        {cursorMode === 'text' && (
          <div className="relative -top-3 -left-1.5 flex flex-col items-center">
            {/* Top crossbar */}
            <div className="w-2.5 h-[1.5px] bg-emerald-300 shadow-[0_0_8px_#34d399]" />
            {/* Vertical stem */}
            <div className="w-[1.5px] h-5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            {/* Bottom crossbar */}
            <div className="w-2.5 h-[1.5px] bg-emerald-300 shadow-[0_0_8px_#34d399]" />
          </div>
        )}

        {/* State: Pointer (Interactive Hand / Beacon) */}
        {cursorMode === 'pointer' && (
          <div
            className={`relative -top-2 -left-2 transition-transform duration-150 ${
              isClicking ? 'scale-75' : 'scale-100'
            }`}
          >
            {/* Glowing Aura Ring */}
            <div className="absolute -inset-2 rounded-full bg-emerald-400/20 blur-[6px] animate-ping" />
            <div className="relative w-8 h-8 rounded-full border border-emerald-400/80 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
              {/* Center pointer dot */}
              <div className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_6px_#fff]" />
            </div>
          </div>
        )}

        {/* State: Default (Sanctuary Leaf / Biophilic Sprout) */}
        {cursorMode === 'default' && (
          <div
            className={`relative -top-1 -left-1 transition-transform duration-150 ${
              isClicking ? 'scale-75' : 'scale-100'
            }`}
          >
            {/* Ambient Aura */}
            <div className="absolute -inset-1.5 rounded-full bg-emerald-400/25 blur-[5px]" />
            
            {/* Stylized Leaf SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]"
            >
              {/* Outer Leaf Body */}
              <path
                d="M3 21C3 21 4 12 12 6C17 2 21 3 21 3C21 3 22 7 18 12C12 20 3 21 3 21Z"
                fill="url(#leafGradient)"
                stroke="#34d399"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Leaf Center Vein */}
              <path
                d="M3 21C8 16 14 11 21 3"
                stroke="#a7f3d0"
                strokeWidth="1"
                strokeLinecap="round"
              />
              {/* Glowing Seed / Node at tip */}
              <circle cx="21" cy="3" r="1.5" fill="#ffffff" />

              <defs>
                <linearGradient id="leafGradient" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#10B981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>
    </>
  );
};
