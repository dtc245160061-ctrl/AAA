import React from 'react';
import { ShieldCheck, CloudRain, Car, Zap, Compass, CheckCircle2 } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { FeatureBenefitKey } from './FeaturedProperties';

interface FeatureStripProps {
  activeFeatureKey: FeatureBenefitKey;
  onSelectFeature: (key: FeatureBenefitKey) => void;
  activeUnitName?: string;
}

interface EnvironmentalFeatureItem {
  key: FeatureBenefitKey;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  proofMetric: string;
  iconColor: string;
  bgAccent: string;
}

const features: EnvironmentalFeatureItem[] = [
  {
    key: 'flood',
    icon: CloudRain,
    title: 'Nguy Cơ Ngập Mùa Mưa',
    description: 'Kiểm tra cốt nền thực địa, hệ thống thoát nước hạ tầng và lịch sử ngập úng.',
    proofMetric: 'Cốt nền cao +0.8m so với vỉa hè',
    iconColor: 'text-emerald-400',
    bgAccent: 'rgba(16, 185, 129, 0.1)',
  },
  {
    key: 'power',
    icon: Zap,
    title: 'Máy Phát Điện Dự Phòng',
    description: 'Xác thực nguồn phát điện 100% công suất đảm bảo thang máy, ánh sáng và điều hòa.',
    proofMetric: 'Tự động kích hoạt sau 15 giây',
    iconColor: 'text-emerald-400',
    bgAccent: 'rgba(16, 185, 129, 0.1)',
  },
  {
    key: 'parking',
    icon: Car,
    title: 'Chỗ Đỗ Xe Ô Tô SUV',
    description: 'Đo lường kích thước hầm xe thực tế, lối ram dốc xe gầm thấp và trạm sạc EV.',
    proofMetric: 'Hầm cao 2.2m • Sạc EV tiêu chuẩn',
    iconColor: 'text-emerald-400',
    bgAccent: 'rgba(16, 185, 129, 0.1)',
  },
  {
    key: 'quiet',
    icon: ShieldCheck,
    title: 'Yên Tĩnh & Cách Âm',
    description: 'Đo lường chỉ số tiếng ồn theo độ cao tầng và khả năng triệt tiêu âm thanh kính Low-E.',
    proofMetric: 'Dưới 42dB ban đêm (Tiêu chuẩn resort)',
    iconColor: 'text-emerald-400',
    bgAccent: 'rgba(16, 185, 129, 0.1)',
  },
];

export const FeatureStrip: React.FC<FeatureStripProps> = ({
  activeFeatureKey,
  onSelectFeature,
  activeUnitName = 'Căn hộ đang chọn',
}) => {
  const containerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={containerRef} className="space-y-6" id="environmental-proof-strip">
      {/* Section Header */}
      <div className="reveal-on-scroll space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--haven-emerald-400)] uppercase tracking-wider font-semibold">
          <Compass className="w-4 h-4" />
          <span>Hệ Thống Phân Tích Môi Trường Sống • 4 Trụ Cột Độc Quyền</span>
        </div>
        <h2
          className="text-2xl md:text-3xl font-serif font-bold text-[var(--haven-text-primary)]"
        >
          Dữ Liệu Khí Hậu & Môi Trường Xác Thực
        </h2>
        <p
          className="text-sm max-w-2xl leading-relaxed text-[var(--haven-text-secondary)] font-sans"
        >
          Chúng tôi khảo sát trực tiếp từng rủi ro và cam kết tiện ích hạ tầng trước khi đăng ký xem nhà.
        </p>
      </div>

      {/* Feature Cards Grid with Interactive Resonance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => {
          const FeatIcon = feature.icon;
          const isActive = activeFeatureKey === feature.key;

          return (
            <div
              key={feature.key}
              onClick={() => onSelectFeature(feature.key)}
              onMouseEnter={() => onSelectFeature(feature.key)}
              onFocus={() => onSelectFeature(feature.key)}
              tabIndex={0}
              role="button"
              aria-label={`Chi tiết minh chứng ${feature.title}`}
              className={`group p-5 rounded-2xl transition-all duration-300 cursor-pointer outline-none relative flex flex-col justify-between overflow-hidden border border-[var(--haven-border)] ${
                isActive
                  ? 'bg-[var(--haven-surface-elevated)] shadow-xl shadow-emerald-500/20 -translate-y-1.5 border-emerald-500/50'
                  : 'bg-[var(--haven-surface-raised)] hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-500/40'
              }`}
            >
              {/* Soft outer glow bloom */}
              <div
                className={`absolute -inset-2 rounded-2xl overflow-hidden pointer-events-none filter blur-xl transition-opacity duration-300 ${
                  isActive ? 'opacity-65' : 'opacity-25 group-hover:opacity-50'
                }`}
                aria-hidden="true"
              >
                <div className="animate-spin-beam pointer-events-none" />
              </div>

              {/* Dynamic Orbiting Ambient Laser Beam */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div
                  className={`animate-spin-beam pointer-events-none transition-opacity duration-300 ${
                    isActive ? 'opacity-85' : 'opacity-40 group-hover:opacity-80'
                  }`}
                />
              </div>

              {/* Opaque Backdrop Mask */}
              <div className="absolute inset-[1.5px] rounded-[14.5px] bg-[var(--haven-surface-raised)] group-hover:bg-[var(--haven-surface-elevated)] pointer-events-none z-0 transition-colors" />

              <div className="relative z-10">
                {/* Header Icon + Active Status */}
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 ${
                      isActive ? 'scale-110 shadow-sm' : ''
                    }`}
                    style={{ background: feature.bgAccent }}
                  >
                    <FeatIcon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--haven-emerald-muted)] border border-[var(--haven-border-accent)] text-[var(--haven-emerald-400)] text-[10px] font-mono font-bold animate-pulse">
                      Đang liên kết
                    </span>
                  )}
                </div>

                <h3
                  className="text-base font-serif font-bold mb-1.5 text-[var(--haven-text-primary)]"
                >
                  {feature.title}
                </h3>
                <p
                  className="text-xs leading-relaxed text-[var(--haven-text-secondary)] mb-3 font-sans"
                >
                  {feature.description}
                </p>
              </div>

              {/* Verified Proof Metric */}
              <div className="relative z-10 pt-3 border-t border-[var(--haven-border)]">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--haven-emerald-400)] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{feature.proofMetric}</span>
                </div>
                {isActive && (
                  <div className="text-[10px] font-mono text-[var(--haven-text-tertiary)] mt-1 truncate">
                    Áp dụng cho: <span className="font-semibold text-[var(--haven-text-secondary)]">{activeUnitName}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
