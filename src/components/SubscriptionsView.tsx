import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Building2, 
  DollarSign, 
  TrendingUp,
  Percent
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, ApartmentStore } from '../data/apartmentStore';
import type { SubscriptionTier } from '../types/apartment';

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
    <div className="space-y-10 text-left pb-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="p-8 md:p-10 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-4 shadow-2xl backdrop-blur-2xl text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mô Hình Kinh Doanh & Gói Dịch Vụ SaaS Định Kỳ (PropTech Monetization)</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-slate-100 font-bold leading-tight">
          Giải Pháp Vận Hành & Phong Cách Sống Đẳng Cấp
        </h1>
        
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Tự động hóa công việc quản lý bất động sản cho chủ nhà và mở khóa các đặc quyền tài chính 0đ tiền cọc cho cư dân hiện đại.
        </p>

        {/* Mode Switcher & Billing Toggle (Sleek Harmonized Midnight Navy Containers) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* Target Audience Switcher */}
          <div className="bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl inline-flex items-center gap-1.5 always-dark">
            <button
              onClick={() => setActiveTab('landlord')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'landlord'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Dành Cho Chủ Nhà / Quản Lý</span>
            </button>
            <button
              onClick={() => setActiveTab('tenant')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tenant'
                  ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-300/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4 text-cyan-300" />
              <span>Hội Viên Cư Dân (Prime Club)</span>
            </button>
          </div>

          {/* Monthly / Yearly cycle (Matching Identical Pill Design) */}
          <div className="bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl inline-flex items-center gap-1.5 always-dark">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hàng Tháng
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Theo Năm</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                billingCycle === 'yearly' ? 'bg-slate-950 text-amber-300 font-bold' : 'text-amber-400 font-bold'
              }`}>-20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className={`grid grid-cols-1 ${filteredPlans.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-3'} gap-6`}>
        {filteredPlans.map((plan) => {
          const isCurrent = currentTier === plan.id;
          const discountedPrice = billingCycle === 'yearly' ? plan.priceVND * 0.8 : plan.priceVND;

          return (
            <div
              key={plan.id}
              className={`p-6 md:p-8 rounded-3xl atmospheric-panel border flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-2xl shadow-xl hover:-translate-y-2 hover:shadow-2xl ${
                plan.id === 'enterprise'
                  ? 'border-amber-500/50 hover:border-amber-400 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]'
                  : plan.targetAudience === 'tenant'
                  ? 'border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]'
                  : plan.isPopular
                  ? 'border-emerald-500/60 shadow-emerald-500/10 ring-2 ring-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]'
                  : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-[0_0_25px_rgba(0,0,0,0.05)]'
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3 min-h-[52px]">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px] font-medium">{plan.tagline}</p>
                  </div>
                  {plan.badge && (
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      plan.id === 'enterprise' || plan.badge === 'Doanh Nghiệp'
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/30 border border-yellow-200/90'
                        : plan.id === 'resident_prime' || plan.badge === 'Dành Cho Cư Dân'
                        ? 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/30 border border-cyan-200/90'
                        : plan.isPopular || plan.badge === 'Khuyên Dùng'
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/30 border border-emerald-300/80'
                        : 'bg-slate-200 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-600 shadow-sm'
                    }`}>
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="py-2 border-y border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold font-mono text-slate-900 dark:text-slate-100">
                      {discountedPrice === 0 ? '0 đ' : `${(discountedPrice).toLocaleString('vi-VN')} đ`}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">/ tháng</span>
                  </div>
                  {billingCycle === 'yearly' && plan.priceVND > 0 && (
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold">Tiết kiệm {(plan.priceVND * 0.2 * 12).toLocaleString('vi-VN')} đ / năm</p>
                  )}
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">Tính năng bao gồm:</span>
                  <ul className="space-y-2.5">
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
              <div className="pt-8">
                <button
                  onClick={() => handleSelectTier(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-3.5 px-4 rounded-2xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-slate-200 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 border border-emerald-500/40 cursor-default'
                      : plan.id === 'resident_prime'
                      ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:opacity-95 text-white shadow-cyan-500/30 hover:scale-[1.02] border border-cyan-300/40'
                      : plan.isPopular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 hover:scale-[1.02]'
                      : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700 hover:scale-[1.02]'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Đang Sử Dụng Gói Này</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Nâng Cấp Gói Này</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PropTech Monetization Breakdown & Reality Matrix */}
      <div className="p-8 rounded-3xl atmospheric-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
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
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <span>1. Phí Môi Giới Chốt Thuê</span>
              <Percent className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">50% - 100%</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Thu từ chủ nhà khi khách ký hợp đồng thuê thành công (Tương đương 0.5 - 1 tháng tiền nhà).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-sky-600 dark:text-sky-400 font-bold">
              <span>2. Thuê Bao SaaS (MRR)</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">499.000 đ</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Gói Pro/Enterprise trả phí định kỳ hàng tháng để quản lý tài chính, hóa đơn và khách thuê tự động.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
              <span>3. Phí Kiểm Định Cấp Tốc</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">250.000 đ</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Phí dịch vụ cử kỹ thuật viên đến tận nơi đo đạc ồn, kiểm tra PCCC và cấp huy hiệu Verified.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
              <span>4. Hoa Hồng Dịch Vụ Sống</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">10% - 15%</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Chiết khấu từ đối tác dọn dẹp, vận chuyển nhà và sửa chữa khi cư dân đặt qua ứng dụng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
