import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeatureBenefitKey } from './FeaturedProperties';
import { Sparkles, ArrowDown } from 'lucide-react';

interface GuidedPathProps {
  activeUnitId: string;
  activeFeatureKey: FeatureBenefitKey;
  activeUnitIndex?: number;
}

// Coordinate anchoring across 3-column top units (0..1200 viewBox)
// Derived from 3-card grid: Col 0 ~ 200, Col 1 ~ 600, Col 2 ~ 1000
const UNIT_X_POSITIONS: Record<number, number> = {
  0: 200,
  1: 600,
  2: 1000,
};

// Coordinate anchoring across 4-column environmental pillars (0..1200 viewBox)
// Derived from 4-card grid: Col 0 ~ 150, Col 1 ~ 450, Col 2 ~ 750, Col 3 ~ 1050
const FEATURE_X_POSITIONS: Record<FeatureBenefitKey, number> = {
  'flood': 150,   // Column 1: Chống ngập
  'power': 450,   // Column 2: Máy phát điện
  'parking': 750, // Column 3: Chỗ đỗ xe
  'quiet': 1050,  // Column 4: Cách âm
};

const FEATURE_NAMES: Record<FeatureBenefitKey, string> = {
  'flood': 'Chống Ngập Mùa Mưa',
  'power': 'Điện Dự Phòng 100%',
  'parking': 'Chỗ Đỗ Xe SUV / EV',
  'quiet': 'Yên Tĩnh & Cách Âm',
};

interface ActivePathItem {
  id: string;
  unitId: string;
  featureKey: FeatureBenefitKey;
  startX: number;
  endX: number;
  d: string;
}

export const GuidedPath: React.FC<GuidedPathProps> = ({
  activeUnitId,
  activeFeatureKey,
  activeUnitIndex = 0,
}) => {
  const startX = UNIT_X_POSITIONS[activeUnitIndex] ?? 600;
  const endX = FEATURE_X_POSITIONS[activeFeatureKey] ?? 450;
  // Natural cubic Bezier S-curve with smooth vertical descent
  const pathD = `M ${startX} 0 C ${startX} 60, ${endX} 60, ${endX} 120`;
  const pathKey = `${activeUnitIndex}-${activeUnitId}->${activeFeatureKey}`;

  const [currentPath, setCurrentPath] = useState<ActivePathItem>({
    id: pathKey,
    unitId: activeUnitId,
    featureKey: activeFeatureKey,
    startX,
    endX,
    d: pathD,
  });
  const [retiringPath, setRetiringPath] = useState<ActivePathItem | null>(null);
  const prevKeyRef = useRef(pathKey);

  useEffect(() => {
    if (prevKeyRef.current !== pathKey) {
      setRetiringPath(currentPath);

      const nextItem: ActivePathItem = {
        id: pathKey,
        unitId: activeUnitId,
        featureKey: activeFeatureKey,
        startX,
        endX,
        d: pathD,
      };
      setCurrentPath(nextItem);
      prevKeyRef.current = pathKey;

      const timer = setTimeout(() => {
        setRetiringPath(null);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathKey, activeUnitId, activeFeatureKey, activeUnitIndex, startX, endX, pathD, currentPath]);

  return (
    <div className="relative select-none -my-2 pointer-events-none" aria-hidden="true">
      {/* Desktop Dynamic Luminous Data Conduit (Hidden on mobile) */}
      <div className="hidden md:block w-full max-w-6xl mx-auto px-4 overflow-visible">
        <svg
          viewBox="0 0 1200 120"
          fill="none"
          className="w-full h-28 overflow-visible pointer-events-none"
        >
          <defs>
            {/* Luminous High-Tech Cyan/Emerald Data Conduit Gradient */}
            <linearGradient id="guidedRibbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="80%" stopColor="#10b981" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
            </linearGradient>

            {/* Glowing Laser Filter */}
            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="14" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ═══ Retiring Path (Soft Fade-out) ═══ */}
          <AnimatePresence>
            {retiringPath && (
              <motion.g
                key={`retiring-${retiringPath.id}`}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <path
                  d={retiringPath.d}
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeOpacity="0.15"
                  fill="none"
                  strokeLinecap="round"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* ═══ Incoming Active Luminous Energy Ribbon ═══ */}
          <g key={`active-${currentPath.id}`}>
            {/* Layer 1: Wide Atmospheric Diffuse Aura (32px width) */}
            <motion.path
              d={currentPath.d}
              stroke="#22d3ee"
              strokeWidth="32"
              strokeOpacity="0.18"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Layer 2: Radiant Emerald Energy Sheath (16px width with Laser Glow) */}
            <motion.path
              d={currentPath.d}
              stroke="#10b981"
              strokeWidth="16"
              strokeOpacity="0.4"
              strokeLinecap="round"
              fill="none"
              filter="url(#laserGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Layer 3: Solid Liquid Cyan-Emerald Core Ribbon (8px width) */}
            <motion.path
              d={currentPath.d}
              stroke="url(#guidedRibbonGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Layer 4: High-Luminance White Hot Laser Core (2.5px width) */}
            <motion.path
              d={currentPath.d}
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.9"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Top Anchor Port (Where Ribbon Connects to the Active Unit) */}
            <g transform={`translate(${currentPath.startX}, 0)`}>
              <circle r="12" fill="rgba(34, 211, 238, 0.25)" className="animate-ping" />
              <circle r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle r="2.5" fill="#ffffff" />
            </g>

            {/* Bottom Termination Port (Where Ribbon Delivers Data to Environmental Pillar) */}
            <g transform={`translate(${currentPath.endX}, 120)`}>
              <circle r="14" fill="rgba(16, 185, 129, 0.3)" className="animate-ping" />
              <circle r="8" fill="#22d3ee" stroke="#ffffff" strokeWidth="2" />
              <circle r="3" fill="#ffffff" />
            </g>
          </g>
        </svg>

        {/* Transmission Status Badge Centered Floating Over Path */}
        <div className="flex items-center justify-center -mt-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/90 [data-theme='light']_:bg-white/95 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 text-xs font-mono text-slate-200 [data-theme='light']_:text-slate-800 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Đang dẫn truyền minh chứng:</span>
            <span className="font-bold text-emerald-400 [data-theme='light']_:text-emerald-700">
              {FEATURE_NAMES[activeFeatureKey]}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Inline Bridge */}
      <div className="flex md:hidden items-center justify-center my-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-[11px] font-mono text-slate-200 shadow-sm">
          <span>Minh chứng:</span>
          <span className="font-semibold text-emerald-400">{FEATURE_NAMES[activeFeatureKey]}</span>
          <ArrowDown className="w-3 h-3 text-emerald-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default GuidedPath;
