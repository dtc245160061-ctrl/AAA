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

        <h1 className="text-3xl md:text-5xl font-serif text-slate-100 font-bold leading-tight">
          Giải Pháp Vận Hành & Phong Cách Sống Đẳng Cấp
        </h1>
        
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Tự động hóa công việc quản lý bất động sản cho chủ nhà và mở khóa các đặc quyền tài chính 0đ tiền cọc cho cư dân hiện đại.
        </p>

        {/* Tab switcher: Landlord vs Tenant */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveTab('landlord')}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'landlord'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Dành Cho Chủ Nhà / Quản Lý</span>
            </button>
            <button
              onClick={() => setActiveTab('tenant')}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tenant'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Hội Viên Cư Dân (Prime Club)</span>
            </button>
          </div>

          {/* Monthly / Yearly cycle */}
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800">
            <span className={billingCycle === 'monthly' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>Hàng Tháng</span>
            <button
              onClick={() => setBillingCycle(b => b === 'monthly' ? 'yearly' : 'monthly')}
              className="w-10 h-5 rounded-full bg-slate-800 border border-slate-700 p-0.5 relative transition-colors"
            >
              <div className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
            <span className={billingCycle === 'yearly' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              Theo Năm <span className="text-[10px] text-amber-400 font-bold">(-20%)</span>
            </span>
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
              className={`p-6 md:p-8 rounded-3xl atmospheric-panel border flex flex-col justify-between transition-all relative overflow-hidden backdrop-blur-2xl shadow-xl ${
                plan.isPopular
                  ? 'border-emerald-500/60 shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.badge && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  plan.isPopular
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-100">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="py-2 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold font-mono text-slate-100">
                      {discountedPrice === 0 ? '0 đ' : `${(discountedPrice).toLocaleString('vi-VN')} đ`}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/ tháng</span>
                  </div>
                  {billingCycle === 'yearly' && plan.priceVND > 0 && (
                    <p className="text-[11px] font-mono text-emerald-400 mt-0.5">Tiết kiệm {(plan.priceVND * 0.2 * 12).toLocaleString('vi-VN')} đ / năm</p>
                  )}
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">Tính năng bao gồm:</span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
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
                  className={`w-full py-3 px-4 rounded-2xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                      : plan.isPopular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 hover:scale-[1.02]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600'
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
      <div className="p-8 rounded-3xl atmospheric-panel border border-slate-800 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-100">
              Cơ Cấu Tạo Doanh Thu Thực Tế Của Sàn HAVEN (Business Economics)
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Bóc tách các dòng tiền thương mại theo chuẩn các kỳ lân Airbnb, Zillow & Guesty
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>1. Phí Môi Giới Chốt Thuê</span>
              <Percent className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100">50% - 100%</div>
            <p className="text-[11px] text-slate-400">
              Thu từ chủ nhà khi khách ký hợp đồng thuê thành công (Tương đương 0.5 - 1 tháng tiền nhà).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-sky-400">
              <span>2. Thuê Bao SaaS (MRR)</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100">499.000 đ</div>
            <p className="text-[11px] text-slate-400">
              Phí phần mềm thu hàng tháng từ các chủ chuỗi căn hộ & nhà trọ cao cấp sử dụng tool tự động.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
              <span>3. Phí Vận Hành (Take Rate)</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100">5.0%</div>
            <p className="text-[11px] text-slate-400">
              Trích trên mỗi hóa đơn tiền thuê thu hộ qua cổng thanh toán bảo chứng của sàn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-purple-400">
              <span>4. Hoa Hồng Dịch Vụ (VAS)</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100">15% - 20%</div>
            <p className="text-[11px] text-slate-400">
              Chia sẻ lợi nhuận từ đối tác dọn buồng phòng theo giờ, chuyển nhà trọn gói và lắp khóa IoT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
