import React from 'react';
import { ShieldCheck, CloudRain, Car, Zap, Compass, CheckCircle2 } from 'lucide-react';
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
  badgeBg: string;
  badgeText: string;
}

const features: EnvironmentalFeatureItem[] = [
  {
    key: 'flood',
    icon: CloudRain,
    title: 'Nguy Cơ Ngập Mùa Mưa',
    description: 'Kiểm tra cốt nền thực địa, hệ thống thoát nước hạ tầng và lịch sử ngập úng.',
    proofMetric: 'Cốt nền cao +0.8m so với vỉa hè',
    badgeBg: 'bg-[#EBF2FF]',
    badgeText: 'text-[#2570EB]',
  },
  {
    key: 'power',
    icon: Zap,
    title: 'Máy Phát Điện Dự Phòng',
    description: 'Xác thực nguồn phát điện 100% công suất đảm bảo thang máy, ánh sáng và điều hòa.',
    proofMetric: 'Tự động kích hoạt sau 15 giây',
    badgeBg: 'bg-[#FFF8E6]',
    badgeText: 'text-[#E5A000]',
  },
  {
    key: 'parking',
    icon: Car,
    title: 'Chỗ Đỗ Xe Ô Tô SUV',
    description: 'Đo lường kích thước hầm xe thực tế, lối ram dốc xe gầm thấp và trạm sạc EV.',
    proofMetric: 'Hầm cao 2.2m • Sạc EV tiêu chuẩn',
    badgeBg: 'bg-[#E8F8EC]',
    badgeText: 'text-[#20A05A]',
  },
  {
    key: 'quiet',
    icon: ShieldCheck,
    title: 'Yên Tĩnh & Cách Âm',
    description: 'Đo lường chỉ số tiếng ồn theo độ cao tầng và khả năng triệt tiêu âm thanh kính Low-E.',
    proofMetric: 'Dưới 42dB ban đêm (Tiêu chuẩn resort)',
    badgeBg: 'bg-[#E8F8EC]',
    badgeText: 'text-[#163300]',
  },
];

export const FeatureStrip: React.FC<FeatureStripProps> = ({
  activeFeatureKey,
  onSelectFeature,
  activeUnitName = 'Căn hộ tiêu biểu'
}) => {
  return (
    <section className="space-y-6 pt-4 text-left">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-[#20A05A]" />
          <span>Hệ Thống Phân Tích Môi Trường Sống • 4 Trụ Cột Độc Quyền</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-white">
          Dữ Liệu Khí Hậu & Môi Trường Xác Thực
        </h2>
        <p className="text-sm max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400">
          Chúng tôi khảo sát trực tiếp từng rủi ro và cam kết tiện ích hạ tầng trước khi bạn ký hợp đồng.
        </p>
      </div>

      {/* Feature Cards Grid with Wise Card Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature) => {
          const FeatIcon = feature.icon;
          const isActive = activeFeatureKey === feature.key;

          return (
            <div
              key={feature.key}
              onClick={() => onSelectFeature(feature.key)}
              onMouseEnter={() => onSelectFeature(feature.key)}
              tabIndex={0}
              role="button"
              aria-label={`Chi tiết minh chứng ${feature.title}`}
              className={`p-6 rounded-[24px] transition-all duration-200 cursor-pointer outline-none flex flex-col justify-between bg-white dark:bg-slate-900 shadow-sm ${
                isActive
                  ? 'border-2 border-[#163300] dark:border-[#9FE870] ring-4 ring-[#9FE870]/20 -translate-y-1'
                  : 'border border-slate-200/90 dark:border-slate-800 hover:border-[#9FE870] hover:-translate-y-0.5'
              }`}
            >
              <div>
                {/* Header Icon + Active Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${feature.badgeBg} ${feature.badgeText}`}>
                    <FeatIcon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="px-2.5 py-1 rounded-full bg-[#E8F8EC] border border-[#9FE870] text-[#163300] text-[11px] font-bold">
                      Đang liên kết
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold mb-2 text-[#163300] dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                  {feature.description}
                </p>
              </div>

              {/* Verified Proof Metric */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-[#20A05A] font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feature.proofMetric}</span>
                </div>
                {isActive && (
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    Áp dụng cho: <span className="font-bold text-slate-700 dark:text-slate-300">{activeUnitName}</span>
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
