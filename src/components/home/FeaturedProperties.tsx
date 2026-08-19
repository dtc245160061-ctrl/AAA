import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Bookmark, CheckCircle2, Zap, CloudRain, Car, VolumeX, Sparkles, ArrowDown } from 'lucide-react';
import type { ApartmentUnit } from '../../types/apartment';
import { calculateMatchScore } from '../../services/aiAdvisorService';

export type FeatureBenefitKey = 'power' | 'flood' | 'parking' | 'quiet';

export interface PropertyFeatureMapping {
  primaryFeature: FeatureBenefitKey;
  features: {
    key: FeatureBenefitKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export const PROPERTY_FEATURE_MAPPINGS: Record<string, PropertyFeatureMapping> = {
  'HN-TÂ-1001': {
    primaryFeature: 'power',
    features: [
      { key: 'power', label: 'Máy phát 100%', icon: Zap },
      { key: 'quiet', label: 'View hồ cách âm', icon: VolumeX },
      { key: 'parking', label: 'Chỗ đỗ ô tô', icon: Car },
    ],
  },
  'HN-HO-0303': {
    primaryFeature: 'flood',
    features: [
      { key: 'flood', label: 'Cốt nền chống ngập', icon: CloudRain },
      { key: 'power', label: 'Máy phát 100%', icon: Zap },
      { key: 'quiet', label: 'Yên tĩnh Phố Cổ', icon: VolumeX },
    ],
  },
  'HN-BA-1502': {
    primaryFeature: 'parking',
    features: [
      { key: 'parking', label: 'Hầm SUV / Sạc EV', icon: Car },
      { key: 'power', label: 'Máy phát 100%', icon: Zap },
      { key: 'flood', label: 'Thoát nước chuẩn', icon: CloudRain },
    ],
  },
};

interface FeaturedPropertiesProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  activeUnitId: string;
  activeFeatureKey: FeatureBenefitKey;
  onSelectUnitFocal: (unitId: string, primaryFeature: FeatureBenefitKey) => void;
  onSelectFeatureKey: (featureKey: FeatureBenefitKey) => void;
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onNavigateSearch: () => void;
  totalCount: number;
}

// Controlled vertical staggered entrance
const cardVariants = [
  {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0 } },
  },
  {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.12 } },
  },
  {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.24 } },
  },
];

function formatCity(city: string): string {
  if (city === 'Hanoi') return 'Hà Nội';
  if (city === 'Ho Chi Minh City') return 'TP.HCM';
  if (city === 'Da Nang') return 'Đà Nẵng';
  return city;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  units,
  savedUnitIds,
  activeUnitId,
  activeFeatureKey,
  onSelectUnitFocal,
  onSelectFeatureKey,
  onToggleSaveUnit,
  onSelectUnit,
  onNavigateSearch,
  totalCount,
}) => {
  const featuredUnits = units.slice(0, 3);

  return (
    <section className="space-y-6" id="featured-sanctuary-properties">
      {/* Section Header with Narrative Context */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--haven-emerald-400)] uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hành Trình Tổ Ấm Xác Thực • Căn Hộ → Dữ Liệu → Lợi Ích</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--haven-text-primary)]">
            Căn Hộ Tuyển Chọn & Minh Chứng Môi Trường
          </h2>
          <p className="text-sm text-[var(--haven-text-secondary)] max-w-2xl">
            Chọn hoặc di chuột qua từng căn hộ để theo dõi đường dẫn dữ liệu xác thực khí hậu, độ ồn và nguồn điện dự phòng.
          </p>
        </div>
        <button
          onClick={onNavigateSearch}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--haven-emerald-400)] hover:underline font-semibold shrink-0 self-start sm:self-auto"
        >
          <span>Xem Tất Cả ({totalCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards Grid with Interactive Focal States */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 relative">
        {featuredUnits.map((unit, index) => {
          const isSaved = savedUnitIds.includes(unit.id);
          const matchInfo = calculateMatchScore(unit, {});
          const variants = cardVariants[index] || cardVariants[0];
          const isFocal = activeUnitId === unit.id;
          const mapping = PROPERTY_FEATURE_MAPPINGS[unit.id] || {
            primaryFeature: 'power' as FeatureBenefitKey,
            features: [{ key: 'power' as FeatureBenefitKey, label: 'Máy phát 100%', icon: Zap }],
          };

          return (
            <motion.div
              key={unit.id}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
              onClick={() => onSelectUnitFocal(unit.id, mapping.primaryFeature)}
              onMouseEnter={() => onSelectUnitFocal(unit.id, mapping.primaryFeature)}
              onFocus={() => onSelectUnitFocal(unit.id, mapping.primaryFeature)}
              tabIndex={0}
              role="button"
              aria-label={`Xem dữ liệu xác thực của căn hộ ${unit.name || unit.id}`}
              className={`group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 relative outline-none focus-visible:ring-2 focus-visible:ring-[var(--haven-emerald-500)] ${
                isFocal
                  ? 'bg-[var(--haven-surface-elevated)] border-2 border-[var(--haven-emerald-500)] shadow-[var(--shadow-elevated)] ring-4 ring-[var(--haven-emerald-glow)]'
                  : 'bg-[var(--haven-surface-raised)] border border-[var(--haven-border)] shadow-[var(--shadow-card)] opacity-95 hover:opacity-100 hover:border-[var(--haven-border-strong)]'
              }`}
            >
              {/* Photo & Overlays */}
              <div
                className="relative h-52 lg:h-56 overflow-hidden cursor-pointer bg-[var(--haven-bg-subtle)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectUnit(unit.id);
                }}
              >
                <img
                  src={unit.images[0]}
                  alt={unit.name || unit.id}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                {/* Top: AI Score + Focal Badge + Bookmark */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-mono font-semibold shadow-lg always-white">
                      {matchInfo.score}% Tương thích AI
                    </span>
                    {isFocal && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono font-bold tracking-wide backdrop-blur-md always-white animate-pulse">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveUnit(unit.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-md border transition-all always-white ${
                      isSaved
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'bg-slate-950/50 border-white/20 text-white/90 hover:text-white hover:bg-slate-950/70'
                    }`}
                    title={isSaved ? 'Bỏ lưu căn hộ' : 'Lưu căn hộ'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Bottom: Location + Floor */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-white/90 always-white">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="always-white">{unit.district}, {formatCity(unit.city)}</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950/80 text-white/95 border border-white/20 backdrop-blur-md always-white always-dark shadow-sm">
                    Tầng {unit.floor}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectUnit(unit.id);
                    }}
                  >
                    <h3 className="font-display text-lg font-bold group-hover:text-[var(--haven-emerald-400)] transition-colors line-clamp-1 text-[var(--haven-text-primary)]">
                      {unit.name || unit.id}
                    </h3>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--haven-text-tertiary)]">
                    <span>{unit.bedrooms} Phòng ngủ</span>
                    <span>•</span>
                    <span>{unit.bathrooms} WC</span>
                    <span>•</span>
                    <span>{unit.sqm} m²</span>
                  </div>
                </div>

                {/* Interactive Environmental Proof Pills (Direct Causality to Feature Strip) */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono text-[var(--haven-text-tertiary)] uppercase tracking-wider font-semibold">
                    Minh Chứng Môi Trường Đã Xác Thực:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mapping.features.map((feat) => {
                      const FeatIcon = feat.icon;
                      const isFeatureActive = activeFeatureKey === feat.key;
                      return (
                        <button
                          key={feat.key}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectUnitFocal(unit.id, feat.key);
                            onSelectFeatureKey(feat.key);
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 border ${
                            isFeatureActive
                              ? 'bg-[var(--haven-emerald-500)] text-white border-[var(--haven-emerald-400)] shadow-sm font-semibold'
                              : 'bg-[var(--haven-surface-hover)] text-[var(--haven-text-secondary)] border-[var(--haven-border)] hover:border-[var(--haven-emerald-400)] hover:text-[var(--haven-text-primary)]'
                          }`}
                        >
                          <FeatIcon className={`w-3 h-3 ${isFeatureActive ? 'text-white' : 'text-[var(--haven-emerald-400)]'}`} />
                          <span>{feat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Insight Snippet */}
                <div className="p-2.5 rounded-xl text-xs space-y-1 bg-[var(--haven-emerald-muted)] border border-[var(--haven-border-accent)]">
                  <div className="flex items-center gap-1.5 text-[var(--haven-emerald-400)] font-mono font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Lợi Ích Sống Nổi Bật</span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed text-[var(--haven-text-secondary)] text-[11px]">
                    {unit.aiInsights.whyFit[0]}
                  </p>
                </div>

                {/* Price + CTA */}
                <div className="pt-3 flex items-center justify-between border-t border-[var(--haven-border)]">
                  <div className="min-w-0">
                    <div className="text-lg font-display font-bold text-[var(--haven-emerald-400)]">
                      {(unit.monthlyRentVND / 1000000).toFixed(0)} Triệu
                      <span className="text-xs font-sans font-normal ml-0.5 text-[var(--haven-text-tertiary)]">/tháng</span>
                    </div>
                    <div className="text-[11px] font-mono text-[var(--haven-text-muted)] truncate">
                      Giá thuê niêm yết
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectUnit(unit.id);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 border bg-[var(--haven-surface-hover)] border-[var(--haven-border)] text-[var(--haven-text-primary)] hover:bg-[var(--haven-emerald-500)] hover:text-white hover:border-[var(--haven-emerald-500)] shrink-0 whitespace-nowrap"
                  >
                    Chi Tiết
                  </button>
                </div>
              </div>

              {/* Bottom Anchor Node for Active Focal State */}
              {isFocal && (
                <div className="hidden md:flex absolute -bottom-3 left-1/2 -translate-x-1/2 items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--haven-emerald-500)] text-white text-[10px] font-mono font-bold shadow-md z-20 pointer-events-none">
                  <span>Dẫn truyền dữ liệu</span>
                  <ArrowDown className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
