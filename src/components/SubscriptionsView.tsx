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
      <div className="p-6 md:p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#9FE870]/20 text-[#163300] dark:text-[#9FE870] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mô Hình Kinh Doanh & Gói Dịch Vụ Định Kỳ (Wise PropTech Monetization)</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-[#163300] dark:text-slate-100 tracking-tight">
          Giải Pháp Vận Hành & Phong Cách Sống Đẳng Cấp
        </h1>
        
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Tự động hóa công việc quản lý bất động sản cho chủ nhà và mở khóa các đặc quyền tài chính 0đ tiền cọc cho cư dân hiện đại.
        </p>

        {/* Mode Switcher & Billing Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* Target Audience Switcher */}
          <div className="wise-pill-tabs">
            <button
              onClick={() => setActiveTab('landlord')}
              className={`wise-pill-tab ${activeTab === 'landlord' ? 'wise-pill-tab-active' : ''}`}
            >
              <Building2 className="w-4 h-4 inline-block mr-1.5" />
              <span>Dành Cho Chủ Nhà / Quản Lý</span>
            </button>
            <button
              onClick={() => setActiveTab('tenant')}
              className={`wise-pill-tab ${activeTab === 'tenant' ? 'wise-pill-tab-active' : ''}`}
            >
              <Crown className="w-4 h-4 inline-block mr-1.5" />
              <span>Hội Viên Cư Dân (Prime Club)</span>
            </button>
          </div>

          {/* Monthly / Yearly cycle Switcher */}
          <div className="wise-pill-tabs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`wise-pill-tab ${billingCycle === 'monthly' ? 'wise-pill-tab-active' : ''}`}
            >
              Hàng Tháng
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`wise-pill-tab ${billingCycle === 'yearly' ? 'wise-pill-tab-active' : ''}`}
            >
              <span>Theo Năm</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#FFC83B] text-[#7A5200] font-bold text-[10px]">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid with Wise Card Hierarchy (All Clean White Surfaces) */}
      <div className={`grid grid-cols-1 ${filteredPlans.length === 1 ? 'max-w-md mx-auto' : 'lg:grid-cols-3 max-w-7xl mx-auto'} gap-6 items-stretch`}>
        {filteredPlans.map((plan) => {
          const isCurrent = currentTier === plan.id;
          const discountedPrice = billingCycle === 'yearly' ? plan.priceVND * 0.8 : plan.priceVND;
          const isHighlight = plan.isPopular || plan.id === 'pro' || plan.id === 'resident_prime';

          return (
            <div
              key={plan.id}
              className={`rounded-[28px] p-6 md:p-8 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md bg-white dark:bg-slate-900 ${
                isHighlight
                  ? 'border-2 border-[#163300] dark:border-[#9FE870] ring-4 ring-[#9FE870]/20'
                  : 'border border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Title & Badge */}
                <div className="flex items-start justify-between gap-2 min-h-[58px]">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#163300] dark:text-slate-100">
                      {plan.name}
                    </h3>
                    <p className="text-xs mt-1 leading-relaxed text-slate-500 dark:text-slate-400">
                      {plan.tagline}
                    </p>
                  </div>
                  {plan.badge && (
                    <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isHighlight
                        ? 'bg-[#E8F8EC] text-[#163300] border border-[#9FE870]'
                        : 'bg-[#EBF2FF] text-[#2570EB] border border-[#2570EB]/20'
                    }`}>
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="py-4 border-y border-slate-100 dark:border-slate-800 min-h-[76px] flex flex-col justify-center">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight text-[#163300] dark:text-[#9FE870]">
                      {discountedPrice === 0 ? '0 đ' : `${(discountedPrice).toLocaleString('vi-VN')} đ`}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ tháng</span>
                  </div>
                  {billingCycle === 'yearly' && plan.priceVND > 0 ? (
                    <p className="text-[11px] mt-1 font-bold text-[#20A05A]">
                      Tiết kiệm {(plan.priceVND * 0.2 * 12).toLocaleString('vi-VN')} đ / năm
                    </p>
                  ) : null}
                </div>

                {/* Features Checklist */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold block text-slate-400">
                    Tính năng bao gồm:
                  </span>
                  <ul className="space-y-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs font-sans">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#E8F8EC] text-[#20A05A]">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-snug text-slate-700 dark:text-slate-300">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <button
                  onClick={() => handleSelectTier(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-3.5 px-4 rounded-full font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-500 cursor-default'
                      : isHighlight
                      ? 'bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] hover:scale-105 active:scale-95'
                      : 'bg-[#163300] hover:bg-[#204500] text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  <span>{isCurrent ? 'Gói Bạn Đang Dùng' : 'Nâng Cấp Gói Này'}</span>
                  {!isCurrent && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PropTech Monetization Breakdown - Wise Multi-Accent Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 space-y-6 max-w-7xl mx-auto shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#9FE870]/20 text-[#163300] dark:text-[#9FE870] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#163300] dark:text-slate-100">
              Cơ Cấu Tạo Doanh Thu Thực Tế Của Sàn HAVEN (Business Economics)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bóc tách các dòng tiền thương mại theo chuẩn các kỳ lân PropTech toàn cầu
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#20A05A] font-bold">
              <span>1. Phí Môi Giới Chốt Thuê</span>
              <Percent className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#163300] dark:text-slate-100">50% - 100%</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Thu từ chủ nhà khi khách ký hợp đồng thuê thành công (Tương đương 0.5 - 1 tháng tiền nhà).
            </p>
          </div>

          <div className="p-5 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#2570EB] font-bold">
              <span>2. Thuê Bao SaaS (MRR)</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#163300] dark:text-slate-100">499.000 đ</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Gói Pro/Enterprise trả phí định kỳ hàng tháng để quản lý tài chính, hóa đơn và khách thuê tự động.
            </p>
          </div>

          <div className="p-5 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A5200] dark:text-[#FFC83B] font-bold">
              <span>3. Hoa Hồng Dịch Vụ (VAS)</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#163300] dark:text-slate-100">15% - 25%</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Trích xuất chiết khấu từ các đối tác dọn dẹp, chuyển nhà, khóa cửa thông minh và bảo hiểm căn hộ.
            </p>
          </div>

          <div className="p-5 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8B5CF6] font-bold">
              <span>4. Phí Ký Quỹ & Bảo Lãnh</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#163300] dark:text-slate-100">1.5% - 2%</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Phí dịch vụ trung gian tài chính giữ cọc an toàn (Escrow) và bảo lãnh rủi ro bùng cọc cho chủ nhà.
            </p>
          </div>
        </div>
      </div>
      </div>
  );
};
