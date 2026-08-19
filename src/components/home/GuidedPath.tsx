import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeatureBenefitKey } from './FeaturedProperties';
import { ArrowDown, Sparkles } from 'lucide-react';

interface GuidedPathProps {
  activeUnitId: string;
  activeFeatureKey: FeatureBenefitKey;
}

// Unit positions across 3-column desktop layout (0..1200 viewBox)
const UNIT_X_POSITIONS: Record<string, number> = {
  'HN-TÂ-1001': 200,   // Column 1 (Left)
  'HN-HO-0303': 600,   // Column 2 (Center)
  'HN-BA-1502': 1000,  // Column 3 (Right)
};

// Feature positions across 4-column desktop layout (0..1200 viewBox)
const FEATURE_X_POSITIONS: Record<FeatureBenefitKey, number> = {
  'flood': 150,   // Column 1: Nguy cơ ngập
  'power': 450,   // Column 2: Máy phát điện
  'parking': 750, // Column 3: Chỗ đỗ xe
  'quiet': 1050,  // Column 4: Yên tĩnh cách âm
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
}) => {
  // Current active path data
  const startX = UNIT_X_POSITIONS[activeUnitId] || 200;
  const endX = FEATURE_X_POSITIONS[activeFeatureKey] || 450;
  const pathD = `M ${startX} 0 C ${startX} 45, ${endX} 45, ${endX} 90`;
  const pathKey = `${activeUnitId}->${activeFeatureKey}`;

  // Keep track of retiring/outgoing path and incoming path for brush-stroke choreography
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
      // Set previous as retiring path (which will retract toward destination)
      setRetiringPath(currentPath);

      // Set new active as incoming path (which will draw from top anchor down)
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

      // Clear retiring path after transition completes (320ms)
      const timer = setTimeout(() => {
        setRetiringPath(null);
      }, 320);

      return () => clearTimeout(timer);
    }
  }, [pathKey, activeUnitId, activeFeatureKey, startX, endX, pathD, currentPath]);

  return (
    <div className="relative py-3 -my-2 select-none" aria-hidden="true">
      {/* Desktop Dynamic SVG Visual Conductor (Hidden on mobile) */}
      <div className="hidden md:block w-full max-w-6xl mx-auto px-4">
        {/* Story Status Bar with Active Feature Badge */}
        <div className="flex items-center justify-center mb-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--haven-surface-raised)] border border-[var(--haven-border-accent)] shadow-sm text-xs font-mono text-[var(--haven-text-secondary)] transition-all">
            <Sparkles className="w-3.5 h-3.5 text-[var(--haven-emerald-400)] animate-pulse" />
            <span>Đang minh chứng:</span>
            <span className="font-bold text-[var(--haven-emerald-400)]">
              {FEATURE_NAMES[activeFeatureKey]}
            </span>
          </div>
        </div>

        <svg
          viewBox="0 0 1200 90"
          fill="none"
          className="w-full h-16 lg:h-20 overflow-visible"
        >
          <defs>
            {/* Emerald linear gradient for brush stroke */}
            <linearGradient id="brushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="brushGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background subtle guide lines */}
          <line x1="200" y1="0" x2="200" y2="20" stroke="var(--haven-border)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="600" y1="0" x2="600" y2="20" stroke="var(--haven-border)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="1000" y1="0" x2="1000" y2="20" stroke="var(--haven-border)" strokeWidth="1" strokeDasharray="3 3" />

          <line x1="150" y1="70" x2="150" y2="90" stroke="var(--haven-border)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="450" y1="70" x2="450" y2="90" stroke="var(--haven-border)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="750" y1="70" x2="750" y2="90" stroke="var(--haven-border)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="1050" y1="70" x2="1050" y2="90" stroke="var(--haven-border)" strokeWidth="1" strokeDasharray="3 3" />

          {/* ═══ 1. RETIRING PATH: Retracts from property anchor down toward environmental endpoint ═══ */}
          <AnimatePresence>
            {retiringPath && (
              <g key={`retiring-${retiringPath.id}`}>
                {/* Glow layer */}
                <motion.path
                  d={retiringPath.d}
                  stroke="#10B981"
                  strokeWidth="7"
                  strokeOpacity="0.15"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#brushGlow)"
                  initial={{ pathLength: 1, pathOffset: 0, opacity: 0.8 }}
                  animate={{ pathOffset: 1, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
                />
                {/* Main base stroke */}
                <motion.path
                  d={retiringPath.d}
                  stroke="url(#brushGrad)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 1, pathOffset: 0, opacity: 0.9 }}
                  animate={{ pathOffset: 1, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
                />
              </g>
            )}
          </AnimatePresence>

          {/* ═══ 2. INCOMING ACTIVE PATH: Draws from property anchor down toward environmental endpoint ═══ */}
          <g key={`incoming-${currentPath.id}`}>
            {/* Ambient Glow Layer */}
            <motion.path
              d={currentPath.d}
              stroke="#10B981"
              strokeWidth="7"
              strokeOpacity="0.22"
              strokeLinecap="round"
              fill="none"
              filter="url(#brushGlow)"
              initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
              animate={{ pathLength: 1, pathOffset: 0, opacity: 1 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
            />

            {/* Base Emerald Brush Stroke */}
            <motion.path
              d={currentPath.d}
              stroke="url(#brushGrad)"
              strokeWidth="2.75"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
              animate={{ pathLength: 1, pathOffset: 0, opacity: 1 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
            />

            {/* Subtle Highlight Spine */}
            <motion.path
              d={currentPath.d}
              stroke="#D1FAE5"
              strokeWidth="1"
              strokeOpacity="0.8"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
              animate={{ pathLength: 1, pathOffset: 0, opacity: 0.8 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
            />

            {/* Visible Floating Particles / Bubbles along the active stroke */}
            <motion.circle
              r="2.5"
              fill="#FFFFFF"
              filter="url(#brushGlow)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                cx: [currentPath.startX, currentPath.startX * 0.7 + currentPath.endX * 0.3, currentPath.startX * 0.3 + currentPath.endX * 0.7, currentPath.endX],
                cy: [0, 25, 65, 90],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.1,
              }}
            />
            <motion.circle
              r="2"
              fill="#A7F3D0"
              filter="url(#brushGlow)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                cx: [currentPath.startX, currentPath.startX * 0.8 + currentPath.endX * 0.2, currentPath.startX * 0.2 + currentPath.endX * 0.8, currentPath.endX],
                cy: [0, 20, 68, 90],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.8,
              }}
            />
            <motion.circle
              r="1.75"
              fill="#34D399"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                cx: [currentPath.startX, currentPath.startX * 0.5 + currentPath.endX * 0.5, currentPath.endX],
                cy: [0, 45, 90],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.4,
              }}
            />
          </g>

          {/* Top Anchor Node */}
          <circle
            cx={currentPath.startX}
            cy="0"
            r="4.5"
            fill="var(--haven-emerald-400)"
            className="transition-all duration-300"
          />
          <circle
            cx={currentPath.startX}
            cy="0"
            r="8"
            stroke="var(--haven-emerald-400)"
            strokeWidth="1.5"
            fill="none"
            strokeOpacity="0.4"
            className="animate-ping"
          />

          {/* Bottom Destination Node */}
          <circle
            cx={currentPath.endX}
            cy="90"
            r="4.5"
            fill="var(--haven-emerald-500)"
            className="transition-all duration-300"
          />
          <circle
            cx={currentPath.endX}
            cy="90"
            r="8"
            stroke="var(--haven-emerald-500)"
            strokeWidth="1.5"
            fill="none"
            strokeOpacity="0.4"
            className="animate-ping"
          />
        </svg>
      </div>

      {/* Mobile Inline Bridge */}
      <div className="flex md:hidden items-center justify-center my-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--haven-surface-raised)] border border-[var(--haven-border-accent)] text-[11px] font-mono text-[var(--haven-text-secondary)] shadow-sm">
          <span>Minh chứng:</span>
          <span className="font-semibold text-[var(--haven-emerald-400)]">{FEATURE_NAMES[activeFeatureKey]}</span>
          <ArrowDown className="w-3 h-3 text-[var(--haven-emerald-400)] animate-bounce" />
        </div>
      </div>
    </div>
  );
};
