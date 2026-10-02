import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Bookmark, CheckCircle2, Zap, CloudRain, Car, VolumeX, Sparkles, ArrowDown } from 'lucide-react';
import type { ApartmentUnit } from '../../types/apartment';
import { calculateMatchScore } from '../../services/aiAdvisorService';
import { SmartImage } from '../common/SmartImage';

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
  activeUnitIndex?: number;
  activeFeatureKey: FeatureBenefitKey;
  onSelectUnitFocal: (unitId: string, primaryFeature: FeatureBenefitKey, index?: number) => void;
  onSelectFeatureKey: (featureKey: FeatureBenefitKey) => void;
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onNavigateSearch: () => void;
  totalCount: number;
}

export const CARD_FEATURES: { primary: FeatureBenefitKey; tags: { key: FeatureBenefitKey; label: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    primary: 'power',
    tags: [
      { key: 'power', label: 'Máy phát 100%', icon: Zap },
      { key: 'quiet', label: 'View hồ cách âm', icon: VolumeX },
      { key: 'parking', label: 'Chỗ đỗ ô tô', icon: Car },
    ],
  },
  {
    primary: 'flood',
    tags: [
      { key: 'flood', label: 'Cốt nền chống ngập', icon: CloudRain },
      { key: 'power', label: 'Máy phát 100%', icon: Zap },
      { key: 'quiet', label: 'Yên tĩnh sinh thái', icon: VolumeX },
    ],
  },
  {
    primary: 'parking',
    tags: [
      { key: 'parking', label: 'Hầm SUV / Sạc EV', icon: Car },
      { key: 'quiet', label: 'Kính Low-E cách âm', icon: VolumeX },
      { key: 'flood', label: 'Thoát nước chuẩn', icon: CloudRain },
    ],
  },
];

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
  activeUnitIndex,
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
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--haven-text-primary)]">
            Căn Hộ Tuyển Chọn & Minh Chứng Môi Trường
          </h2>
          <p className="text-sm text-[var(--haven-text-secondary)] max-w-2xl font-sans">
            Chọn hoặc di chuột qua từng căn hộ để theo dõi đường dẫn dữ liệu xác thực khí hậu, độ ồn và nguồn điện dự phòng.
          </p>
        </div>
        <button
          onClick={onNavigateSearch}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--haven-emerald-400)] hover:underline font-semibold shrink-0 self-start sm:self-auto cursor-pointer"
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
          const isFocal = activeUnitId === unit.id || (activeUnitIndex === index);
          const cardConfig = CARD_FEATURES[index] || CARD_FEATURES[0];

          return (
            <motion.div
              key={unit.id}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
              onClick={() => onSelectUnitFocal(unit.id, cardConfig.primary, index)}
              onMouseEnter={() => onSelectUnitFocal(unit.id, cardConfig.primary, index)}
              onFocus={() => onSelectUnitFocal(unit.id, cardConfig.primary, index)}
              tabIndex={0}
              role="button"
              aria-label={`Xem dữ liệu xác thực của căn hộ ${unit.name || unit.id}`}
              className="group relative rounded-2xl p-[2px] cursor-pointer shadow-xl transition-all duration-300 overflow-visible"
            >
              {/* Soft outer glow bloom (CodePen / LIYRO style) */}
              <div
                className={`absolute -inset-2 rounded-2xl overflow-hidden pointer-events-none filter blur-xl transition-opacity duration-300 ${
                  isFocal ? 'opacity-75' : 'opacity-35 group-hover:opacity-65'
                }`}
                aria-hidden="true"
              >
                <div className="animate-spin-beam pointer-events-none" />
              </div>

              {/* Dynamic Orbiting Dual Laser Beam strictly contained in 2px border shell */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div
                  className={`animate-spin-beam pointer-events-none transition-opacity duration-300 ${
                    isFocal ? 'opacity-100' : 'opacity-65 group-hover:opacity-95'
                  }`}
                />
              </div>

              {/* Card Inner Container - Pure Wise Card Design */}
              <div
                className={`wise-card relative z-10 w-full h-full rounded-[24px] flex flex-col justify-between transition-all duration-300 bg-white dark:bg-[#142605] border border-[#163300]/10 dark:border-[#9FE870]/25 overflow-visible ${
                  isFocal ? 'ring-2 ring-[#9FE870] shadow-xl' : 'hover:shadow-lg'
                }`}
              >
                {/* Photo & Overlays */}
                <div
                  className="relative h-52 lg:h-56 overflow-hidden rounded-t-[23px] cursor-pointer bg-[#F2F5F0] dark:bg-[#0E1B00]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectUnit(unit.id);
                  }}
                >
                  <SmartImage
                    src={unit.images[0]}
                    alt={unit.name || unit.id}
                    width={600}
                    quality={75}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                  {/* Top: AI Score + Focal Badge + Bookmark */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-3 py-1 rounded-full bg-[#9FE870] text-[#163300] text-[11px] font-black shadow-md">
                        {matchInfo.score}% Tương thích AI
                      </span>
                      {isFocal && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#163300] text-[#9FE870] border border-[#9FE870]/50 text-[10px] font-extrabold tracking-wide shadow-md">
                          Đang chọn
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveUnit(unit.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-[#FF5436] border-[#FF5436] text-white shadow-md'
                          : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
                      }`}
                      title={isSaved ? 'Bỏ lưu căn hộ' : 'Lưu căn hộ'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom: Location + Floor */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-white font-medium always-white">
                      <MapPin className="w-3.5 h-3.5 text-[#9FE870]" />
                      <span className="always-white drop-shadow-sm">{unit.district}, {formatCity(unit.city)}</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md font-bold always-white">
                      Tầng {unit.floor}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUnit(unit.id);
                      }}
                    >
                      <h3 className="text-lg font-extrabold text-[#163300] dark:text-white group-hover:text-[#2570EB] transition-colors line-clamp-1">
                        {unit.name || unit.id}
                      </h3>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#495E35] dark:text-emerald-200/80">
                      <span>{unit.bedrooms} Phòng ngủ</span>
                      <span>•</span>
                      <span>{unit.bathrooms} WC</span>
                      <span>•</span>
                      <span>{unit.sqm} m²</span>
                    </div>
                  </div>

                  {/* Wise Environmental Proof Multi-Accent Flag Pills */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-[#738565] uppercase tracking-wider">
                      Minh Chứng Môi Trường Đã Xác Thực:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cardConfig.tags.map((feat) => {
                        const FeatIcon = feat.icon;
                        const isFeatureActive = activeFeatureKey === feat.key && isFocal;
                        
                        // Wise Multi-accent flag color logic per feature
                        let pillClass = "bg-[#F2F5F0] text-[#163300] border-[#163300]/15";
                        if (feat.key === 'power') {
                          pillClass = "bg-[#FFF6DB] text-[#7A5200] border-[#FFC83B]/30 hover:border-[#FFC83B]";
                        } else if (feat.key === 'flood') {
                          pillClass = "bg-[#EBF2FF] text-[#0F2E6B] border-[#2570EB]/30 hover:border-[#2570EB]";
                        } else if (feat.key === 'parking') {
                          pillClass = "bg-[#FFEAE5] text-[#8C1F08] border-[#FF5436]/30 hover:border-[#FF5436]";
                        } else if (feat.key === 'quiet') {
                          pillClass = "bg-[#F3E8FF] text-[#431A7A] border-[#8B5CF6]/30 hover:border-[#8B5CF6]";
                        }

                        if (isFeatureActive) {
                          pillClass = "bg-[#163300] text-[#9FE870] border-[#163300] font-black shadow-xs";
                        }

                        return (
                          <button
                            key={feat.key}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectUnitFocal(unit.id, feat.key, index);
                              onSelectFeatureKey(feat.key);
                            }}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              onSelectUnitFocal(unit.id, feat.key, index);
                              onSelectFeatureKey(feat.key);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${pillClass}`}
                          >
                            <FeatIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{feat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI Insight Snippet in Wise Soft Tint Card */}
                  <div className="p-3 rounded-2xl text-xs space-y-1 bg-[#E2F7D4]/60 dark:bg-[#163300]/50 border border-[#9FE870]/40">
                    <div className="flex items-center gap-1.5 text-[#163300] dark:text-[#9FE870] font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#20A05A]" />
                      <span>Lợi Ích Sống Nổi Bật</span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed text-[#495E35] dark:text-emerald-200/90 text-xs font-medium">
                      {unit.aiInsights.whyFit[0]}
                    </p>
                  </div>

                  {/* Price + Wise Pill CTA Button */}
                  <div className="pt-3.5 flex items-center justify-between border-t border-[#163300]/10 dark:border-[#9FE870]/20">
                    <div className="min-w-0">
                      <div className="text-2xl font-black text-[#163300] dark:text-[#9FE870] tracking-tight">
                        {(unit.monthlyRentVND / 1000000).toFixed(0)} Triệu
                        <span className="text-xs font-normal ml-0.5 text-[#738565] dark:text-emerald-200/60">/tháng</span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#738565] truncate">
                        Giá thuê niêm yết
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUnit(unit.id);
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#163300] hover:bg-[#223D0D] text-white font-extrabold text-xs transition-all shadow-xs hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Xem Chi Tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Anchor Node for Active Focal State */}
                {isFocal && (
                  <div className="hidden md:flex absolute -bottom-3 left-1/2 -translate-x-1/2 items-center gap-1.5 px-4 py-1 rounded-full bg-[#163300] text-[#9FE870] text-xs font-bold shadow-xl z-40 pointer-events-none border border-[#9FE870]/60 animate-in fade-in">
                    <span>Dẫn truyền dữ liệu</span>
                    <ArrowDown className="w-3 h-3 animate-bounce" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
