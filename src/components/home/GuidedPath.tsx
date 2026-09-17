import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeatureBenefitKey } from './FeaturedProperties';
import { ArrowDown, Sparkles } from 'lucide-react';

interface GuidedPathProps {
  activeUnitId: string;
  activeFeatureKey: FeatureBenefitKey;
  activeUnitIndex?: number;
}

// Fallback unit positions if activeUnitIndex is undefined (0..1200 viewBox)
const UNIT_X_POSITIONS: Record<string, number> = {
  'HN-HM-0101': 200,   // Column 1 (Left)
  'HN-HM-0102': 600,   // Column 2 (Center)
  'HN-TH-2401': 1000,  // Column 3 (Right)
  'HN-TÂ-1001': 200,
  'HN-HO-0303': 600,
  'HN-BA-1502': 1000,
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
  activeUnitIndex = 0,
}) => {
  // Current active path data: dynamically derive startX from activeUnitIndex (0, 1, or 2)
  const startX =
    activeUnitIndex === 0
      ? 200
      : activeUnitIndex === 1
      ? 600
      : activeUnitIndex === 2
      ? 1000
      : (UNIT_X_POSITIONS[activeUnitId] || 200);

  const endX = FEATURE_X_POSITIONS[activeFeatureKey] || 450;
  const pathD = `M ${startX} 0 C ${startX} 45, ${endX} 45, ${endX} 90`;
  const pathKey = `${activeUnitIndex}-${activeUnitId}->${activeFeatureKey}`;

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
      }, 280);

      return () => clearTimeout(timer);
    }
  }, [pathKey, activeUnitId, activeFeatureKey, activeUnitIndex, startX, endX, pathD, currentPath]);

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
          className="w-full h-16 lg:h-20 overflow-visible pointer-events-none"
        >
          <defs>
            {/* Luminous Brush Stroke Gradient */}
            <linearGradient id="emeraldBrushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* ═══ 1. RETIRING PATH (smooth GPU fade-out) ═══ */}
          <AnimatePresence>
            {retiringPath && (
              <g key={`retiring-${retiringPath.id}`}>
                <motion.path
                  d={retiringPath.d}
                  stroke="rgba(45, 212, 191, 0.2)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </g>
            )}
          </AnimatePresence>

          {/* ═══ 2. INCOMING ACTIVE DIGITAL BRUSH RIBBON (Rich, Soft & Lush like Illustration) ═══ */}
          <g key={`incoming-${currentPath.id}`}>
            {/* Outer Feathered Ambient Cyan/Emerald Glow (24px width) */}
            <motion.path
              d={currentPath.d}
              stroke="#10b981"
              strokeWidth="24"
              strokeOpacity="0.22"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: 'drop-shadow(0 0 10px rgba(45, 212, 191, 0.5))' }}
            />

            {/* Lush Soft Digital Brush Body (14px width) */}
            <motion.path
              d={currentPath.d}
              stroke="url(#emeraldBrushGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.85"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Inner High-Luminance Core Highlight (5px width) */}
            <motion.path
              d={currentPath.d}
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </g>
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
