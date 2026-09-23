import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Crown, 
  Building2, 
  DollarSign, 
  TrendingUp,
  Percent,
  ArrowRight,
  Layers
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, ApartmentStore } from '../data/apartmentStore';
import type { SubscriptionTier } from '../types/apartment';
import { ShaderCard } from './ui/ShaderCard';

interface SubscriptionsViewProps {
  onShowToast: (type: 'success' | 'info', title: string, desc?: string) => void;
  isConsumerView?: boolean;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  onShowToast,
  isConsumerView = false
}) => {
  const [activeTab, setActiveTab] = useState<'landlord' | 'tenant'>(isConsumerView ? 'tenant' : 'landlord');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(ApartmentStore.getActiveSubscription());

  const handleSelectTier = (tier: SubscriptionTier) => {
    ApartmentStore.setSubscription(tier);
    setCurrentTier(tier);
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === tier);
    onShowToast(
      'success',
      `Kích hoạt thành công gói ${plan?.name}!`,
      'Hệ thống đã nâng cấp toàn bộ tính năng và quyền lợi vào tài khoản của bạn.'
    );
  };

  const filteredPlans = SUBSCRIPTION_PLANS.filter(p => p.targetAudience === activeTab);

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-3 shadow-2xl backdrop-blur-2xl text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mô Hình Kinh Doanh & Gói Dịch Vụ SaaS Định Kỳ (PropTech Monetization)</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-serif text-slate-900 dark:text-slate-100 font-bold leading-tight">
          Giải Pháp Vận Hành & Phong Cách Sống Đẳng Cấp
        </h1>
        
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Tự động hóa công việc quản lý bất động sản cho chủ nhà và mở khóa các đặc quyền tài chính 0đ tiền cọc cho cư dân hiện đại.
        </p>

        {/* Mode Switcher & Billing Toggle (iOS Style Physics Sliding Segments) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* Target Audience Switcher */}
          <div className="relative bg-slate-900/90 [data-theme='light']_:bg-slate-100 p-1.5 rounded-2xl border border-slate-800 [data-theme='light']_:border-slate-300 shadow-xl inline-flex items-center">
            <button
              onClick={() => setActiveTab('landlord')}
              className={`relative z-10 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'landlord'
                  ? 'text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-white [data-theme=\'light\']_:text-slate-600 [data-theme=\'light\']_:hover:text-slate-900'
              }`}
            >
              {activeTab === 'landlord' && (
                <motion.div
                  layoutId="activeAudienceTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-xl bg-emerald-500 shadow-md shadow-emerald-500/25 -z-10"
                />
              )}
              <Building2 className={`w-4 h-4 ${activeTab === 'landlord' ? 'text-slate-950' : 'text-slate-400 [data-theme=\'light\']_:text-slate-600'}`} />
              <span>Dành Cho Chủ Nhà / Quản Lý</span>
            </button>
            <button
              onClick={() => setActiveTab('tenant')}
              className={`relative z-10 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'tenant'
                  ? 'text-white font-extrabold'
                  : 'text-slate-400 hover:text-white [data-theme=\'light\']_:text-slate-600 [data-theme=\'light\']_:hover:text-slate-900'
              }`}
            >
              {activeTab === 'tenant' && (
                <motion.div
                  layoutId="activeAudienceTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 shadow-lg shadow-cyan-500/30 border border-cyan-300/40 -z-10"
                />
              )}
              <Crown className={`w-4 h-4 ${activeTab === 'tenant' ? 'text-white' : 'text-slate-400 [data-theme=\'light\']_:text-slate-600'}`} />
              <span>Hội Viên Cư Dân (Prime Club)</span>
            </button>
          </div>

          {/* Monthly / Yearly cycle Switcher */}
          <div className="relative bg-slate-900/90 [data-theme='light']_:bg-slate-100 p-1.5 rounded-2xl border border-slate-800 [data-theme='light']_:border-slate-300 shadow-xl inline-flex items-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative z-10 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-white [data-theme=\'light\']_:text-slate-600 [data-theme=\'light\']_:hover:text-slate-900'
              }`}
            >
              {billingCycle === 'monthly' && (
                <motion.div
                  layoutId="activeBillingCycleTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-xl bg-emerald-500 shadow-md shadow-emerald-500/25 -z-10"
                />
              )}
              Hàng Tháng
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative z-10 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-white [data-theme=\'light\']_:text-slate-600 [data-theme=\'light\']_:hover:text-slate-900'
              }`}
            >
              {billingCycle === 'yearly' && (
                <motion.div
                  layoutId="activeBillingCycleTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-xl bg-emerald-500 shadow-md shadow-emerald-500/25 -z-10"
                />
              )}
              <span>Theo Năm</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                billingCycle === 'yearly' ? 'bg-slate-950 text-amber-300 font-bold' : 'text-amber-500 [data-theme=\'light\']_:text-amber-600 font-bold'
              }`}>-20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid with ShaderCard & Dynamic Tier Beams (Widened & Proportional) */}
      <div className={`grid grid-cols-1 ${filteredPlans.length === 1 ? 'max-w-md mx-auto' : 'lg:grid-cols-3 max-w-7xl mx-auto'} gap-6 items-stretch`}>
        {filteredPlans.map((plan) => {
          const isCurrent = currentTier === plan.id;
          const discountedPrice = billingCycle === 'yearly' ? plan.priceVND * 0.8 : plan.priceVND;

          // Tier color palette customization
          let themeColor: 'slate' | 'purple' | 'gold' | 'cyan' = 'slate';
          let beamThemeClass = 'haven-beam-slate';
          let badgeGradient = 'bg-slate-200 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600';
          let btnClass = 'bg-slate-700 hover:bg-slate-600 text-white font-bold shadow-slate-700/30 hover:scale-[1.02] border border-slate-500/50';

          if (plan.id === 'enterprise' || plan.badge === 'Doanh Nghiệp') {
            themeColor = 'gold';
            beamThemeClass = 'haven-beam-gold';
            badgeGradient = 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/30 border border-yellow-200/90';
            btnClass = 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:brightness-110 text-slate-950 font-bold shadow-amber-500/30 hover:scale-[1.02] border border-amber-300/50';
          } else if (plan.id === 'resident_prime' || plan.badge === 'Dành Cho Cư Dân') {
            themeColor = 'cyan';
            beamThemeClass = 'haven-beam-cyan';
            badgeGradient = 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/30 border border-cyan-200/90';
            btnClass = 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:opacity-95 text-white font-bold shadow-cyan-500/30 hover:scale-[1.02] border border-cyan-300/40';
          } else if (plan.isPopular || plan.badge === 'Khuyên Dùng' || plan.id === 'pro') {
            themeColor = 'purple';
            beamThemeClass = 'haven-beam-purple';
            badgeGradient = 'bg-gradient-to-r from-purple-500 via-violet-400 to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/30 border border-purple-300/80';
            btnClass = 'bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 hover:brightness-110 text-white font-bold shadow-purple-500/35 hover:scale-[1.02] border border-purple-400/50';
          }

          return (
            <div
              key={plan.id}
              className={`group relative rounded-3xl p-[2.5px] shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 h-full ${beamThemeClass}`}
            >
              {/* Dynamic Orbiting Laser Beam strictly contained in border shell */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div
                  className={`animate-spin-beam pointer-events-none transition-opacity duration-300 ${
                    isCurrent ? 'opacity-95' : 'opacity-70 group-hover:opacity-100'
                  }`}
                />
              </div>

              {/* Inner card with React Bits Pro ShaderCard background effect */}
              <div className="relative z-10 w-full h-full rounded-[22px] overflow-hidden atmospheric-panel border border-slate-800 flex flex-col justify-between">
                <ShaderCard
                  speed={0.1}
                  positionY={0.15}
                  scale={3}
                  edgeMax={0.7}
                  falloffPower={3.5}
                  waveAmount={0.1}
                  branchIntensity={1.9}
                  verticalExtent={2}
                  blur={4.5}
                  colorTheme={themeColor}
                  className="w-full h-full flex flex-col justify-between p-4 sm:p-5"
                >
                  <div className="space-y-3">
                    {/* Header: Title & Tagline with Strict Equalized Height (Aligned on same X-axis) */}
                    <div className="flex items-start justify-between gap-2 h-[58px]">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100 truncate">{plan.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 h-[32px] line-clamp-2 leading-relaxed font-medium">{plan.tagline}</p>
                      </div>
                      {plan.badge && (
                        <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${badgeGradient}`}>
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    {/* Price with Single-Line Guarantee & Fully Unclipped Height */}
                    <div className="py-2.5 border-y border-slate-200 dark:border-slate-800/80 min-h-[66px] flex flex-col justify-center">
                      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                        <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight leading-normal">
                          {discountedPrice === 0 ? '0 đ' : `${(discountedPrice).toLocaleString('vi-VN')} đ`}
                        </span>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">/ tháng</span>
                      </div>
                      {billingCycle === 'yearly' && plan.priceVND > 0 ? (
                        <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold truncate">
                          Tiết kiệm {(plan.priceVND * 0.2 * 12).toLocaleString('vi-VN')} đ / năm
                        </p>
                      ) : (
                        <p className="text-[11px] font-mono text-transparent mt-0.5 font-bold select-none truncate">
                          &nbsp;
                        </p>
                      )}
                    </div>

                    {/* Feature Checklist - Always starts at the exact same vertical position across all cards */}
                    <div className="space-y-2 pt-1 min-h-[160px]">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block">Tính năng bao gồm:</span>
                      <ul className="space-y-1.5">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => handleSelectTier(plan.id)}
                      disabled={isCurrent}
                      className={`w-full py-3.5 px-4 rounded-2xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-800/90 text-emerald-400 border border-emerald-500/50 cursor-default shadow-md shadow-emerald-500/10'
                          : btnClass
                      }`}
                    >
                      <span>{isCurrent ? 'Gói Bạn Đang Dùng' : 'Nâng Cấp Gói Này'}</span>
                      {!isCurrent && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </ShaderCard>
              </div>
            </div>
          );
        })}
      </div>

      {/* PropTech Monetization Breakdown with Radiating Central Halo & Sheen Flare */}
      <div className="relative rounded-3xl p-[2.5px] overflow-hidden shadow-2xl group transition-all max-w-7xl mx-auto">
        <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 w-full h-full rounded-[22px] atmospheric-panel haven-sheen-sweep p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Cơ Cấu Tạo Doanh Thu Thực Tế Của Sàn HAVEN (Business Economics)
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Bóc tách các dòng tiền thương mại theo chuẩn các kỳ lân Airbnb, Zillow & Guesty
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="group relative rounded-2xl p-[1.5px] cursor-pointer hover:-translate-y-1 transition-all duration-200">
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="relative z-10 w-full h-full p-4 rounded-[14.5px] bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>1. Phí Môi Giới Chốt Thuê</span>
                  <Percent className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">50% - 100%</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Thu từ chủ nhà khi khách ký hợp đồng thuê thành công (Tương đương 0.5 - 1 tháng tiền nhà).
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl p-[1.5px] cursor-pointer hover:-translate-y-1 transition-all duration-200 haven-beam-cyan">
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="relative z-10 w-full h-full p-4 rounded-[14.5px] bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-sky-600 dark:text-sky-400 font-bold">
                  <span>2. Thuê Bao SaaS (MRR)</span>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">499.000 đ</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Gói Pro/Enterprise trả phí định kỳ hàng tháng để quản lý tài chính, hóa đơn và khách thuê tự động.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl p-[1.5px] cursor-pointer hover:-translate-y-1 transition-all duration-200 haven-beam-gold">
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="relative z-10 w-full h-full p-4 rounded-[14.5px] bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                  <span>3. Hoa Hồng Dịch Vụ (VAS)</span>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">15% - 25%</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Trích xuất chiết khấu từ các đối tác dọn dẹp, chuyển nhà, khóa cửa thông minh và bảo hiểm căn hộ.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl p-[1.5px] cursor-pointer hover:-translate-y-1 transition-all duration-200 haven-beam-purple">
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="relative z-10 w-full h-full p-4 rounded-[14.5px] bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                  <span>4. Phí Ký Quỹ & Bảo Lãnh</span>
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">1.5% - 2%</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Phí dịch vụ trung gian tài chính giữ cọc an toàn (Escrow) và bảo lãnh rủi ro bùng cọc cho chủ nhà.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
