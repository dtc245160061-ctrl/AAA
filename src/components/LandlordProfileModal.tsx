import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Bell, 
  Award
} from 'lucide-react';
import type { LandlordProfile, ApartmentUnit } from '../types/apartment';
import { SmartImage } from './common/SmartImage';

interface LandlordProfileModalProps {
  landlord: LandlordProfile;
  units: ApartmentUnit[];
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit?: (unitId: string) => void;
  onOpenChat?: () => void;
}

export const LandlordProfileModal: React.FC<LandlordProfileModalProps> = ({
  landlord,
  units,
  isOpen,
  onClose,
  onSelectUnit,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'reviews'>('overview');
  const [isFollowed, setIsFollowed] = useState(false);

  if (!isOpen) return null;

  const landlordUnits = units.filter(u => u.landlord?.name === landlord.name || u.city === (landlord.name.includes('Minh') ? 'Hanoi' : 'Ho Chi Minh City'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header with Close */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={landlord.avatar}
                alt={landlord.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#9FE870] shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#9FE870] text-[#163300]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl text-[#163300] dark:text-white font-black">{landlord.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8EC] border border-[#20A05A]/30 text-[#163300] dark:text-[#9FE870] text-[10px] font-bold">
                  ✓ Verified SuperHost
                </span>
              </div>
              <p className="text-xs text-[#738565] dark:text-slate-400 font-medium flex items-center gap-2">
                <span>Tham gia: {landlord.joinedDate}</span>
                <span>•</span>
                <span>{landlord.activeListingsCount} Căn hộ đang quản lý</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isFollowed
                  ? 'bg-[#9FE870] text-[#163300] shadow-xs'
                  : 'bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-slate-300 hover:border-[#163300]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isFollowed ? 'Đang Theo Dõi' : 'Theo Dõi Căn Mới'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#163300] dark:border-[#9FE870] text-[#163300] dark:text-[#9FE870]'
                : 'border-transparent text-[#738565] dark:text-slate-400 hover:text-[#163300]'
            }`}
          >
            Chỉ Số Uy Tín & Hồ Sơ
          </button>
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'units'
                ? 'border-[#163300] dark:border-[#9FE870] text-[#163300] dark:text-[#9FE870]'
                : 'border-transparent text-[#738565] dark:text-slate-400 hover:text-[#163300]'
            }`}
          >
            Căn Hộ Cho Thuê ({landlordUnits.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#163300] dark:border-[#9FE870] text-[#163300] dark:text-[#9FE870]'
                : 'border-transparent text-[#738565] dark:text-slate-400 hover:text-[#163300]'
            }`}
          >
            Đánh Giá Cư Dân ({landlord.reviewCount})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TRUST SCORE BREAKDOWN */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 4 Pillar Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-1">
                <span className="text-[#738565] dark:text-slate-400 uppercase text-[10px] font-bold">Điểm Uy Tín</span>
                <p className="text-2xl font-black text-[#7A5200] dark:text-amber-300 flex items-center gap-1 tabular-nums">
                  <Star className="w-5 h-5 fill-[#FFC83B] text-[#FFC83B]" />
                  <span>{landlord.trustScore}★</span>
                </p>
                <span className="text-[10px] text-[#738565] dark:text-slate-400 font-medium">Dựa trên 6 yếu tố</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-1">
                <span className="text-[#738565] dark:text-slate-400 uppercase text-[10px] font-bold">Tỷ Lệ Phản Hồi</span>
                <p className="text-2xl font-black text-[#20A05A] dark:text-[#9FE870] tabular-nums">
                  {landlord.responseRatePercent}%
                </p>
                <span className="text-[10px] text-[#738565] dark:text-slate-400 font-medium">Rất tích cực</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-1">
                <span className="text-[#738565] dark:text-slate-400 uppercase text-[10px] font-bold">Tốc Độ Trả Lời</span>
                <p className="text-2xl font-black text-[#163300] dark:text-white tabular-nums">
                  ~{landlord.averageResponseMinutes}p
                </p>
                <span className="text-[10px] text-[#738565] dark:text-slate-400 font-medium">SLA nhanh &lt;2h</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-1">
                <span className="text-[#738565] dark:text-slate-400 uppercase text-[10px] font-bold">Tỷ Lệ Hủy Lịch</span>
                <p className="text-2xl font-black text-[#20A05A] dark:text-[#9FE870] tabular-nums">
                  0%
                </p>
                <span className="text-[10px] text-[#738565] dark:text-slate-400 font-medium">Chưa từng hủy khách</span>
              </div>
            </div>

            {/* Trust Score Algorithm Weighted Factor Bar */}
            <div className="p-5 rounded-2xl bg-[#F9FAF8] dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-700 space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-[#495E35] dark:text-slate-400 font-bold flex items-center justify-between">
                <span>Thuật Toán Xếp Hạng Uy Tín HAVEN (Trust Score):</span>
                <span className="text-[#20A05A] dark:text-[#9FE870] font-black">{landlord.trustScore} / 5.0 (Xuất Sắc)</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>1. Xác minh CCCD & Sổ đỏ chính chủ (25%)</span>
                  <span className="text-[#20A05A] font-bold">100% ✓ Đã Thẩm Định</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>2. Đánh giá hài lòng cư dân thực tế (25%)</span>
                  <span className="text-[#7A5200] dark:text-amber-300 font-bold">4.8 / 5.0 (96%)</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>3. Tốc độ & tỷ lệ phản hồi tin nhắn (20%)</span>
                  <span className="text-[#20A05A] font-bold">98% (Phản hồi trong 15p)</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>4. Thâm niên hoạt động & Lịch sử giữ cọc (15%)</span>
                  <span className="text-[#20A05A] font-bold">14 Tháng • 100% hoàn cọc 72h</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>5. Tỷ lệ hủy lịch xem nhà (10%)</span>
                  <span className="text-[#20A05A] font-bold">0%</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>6. Báo cáo tranh chấp từ khách thuê (5%)</span>
                  <span className="text-[#20A05A] font-bold">0 Báo cáo vi phạm</span>
                </div>
              </div>
            </div>

            {/* Badges List */}
            <div className="flex items-center gap-2 flex-wrap">
              {landlord.badges.map((b, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded-full bg-[#E8F8EC] border border-[#20A05A]/30 text-[#163300] dark:text-[#9FE870] text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-[#20A05A]" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE LISTINGS */}
        {activeTab === 'units' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {landlordUnits.map(unit => (
                <div
                  key={unit.id}
                  onClick={() => {
                    onSelectUnit?.(unit.id);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 hover:border-[#163300] dark:hover:border-[#9FE870] transition-all cursor-pointer flex gap-3 group shadow-xs"
                >
                  <SmartImage
                    src={unit.images[0]}
                    alt={unit.name || unit.id}
                    width={200}
                    quality={70}
                    containerClassName="w-24 h-24 rounded-xl shrink-0"
                    className="w-full h-full object-cover"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <h5 className="font-bold text-sm text-[#163300] dark:text-white line-clamp-1 group-hover:text-[#20A05A] transition-colors">
                      {unit.name || unit.id}
                    </h5>
                    <p className="text-[11px] text-[#738565] dark:text-slate-400 font-medium">{unit.district}</p>
                    <p className="text-xs text-[#163300] dark:text-[#9FE870] font-black tabular-nums">
                      {((unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND) / 1000000).toFixed(1)} Tr/tháng
                    </p>
                    <span className="text-[10px] text-[#738565] dark:text-slate-500 font-medium">
                      {unit.bedrooms} PN • {unit.sqm} m²
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESIDENT REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-3 animate-in fade-in duration-200 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#163300] dark:text-white">Nguyễn Phương Thảo</span>
                  <span className="text-[10px] font-bold text-[#163300] dark:text-[#9FE870] bg-[#E8F8EC] px-2.5 py-0.5 rounded-full border border-[#20A05A]/30">
                    Đã ở 12 tháng (Hồ Tây)
                  </span>
                </div>
                <div className="flex text-amber-500">★★★★★</div>
              </div>
              <p className="text-[#495E35] dark:text-slate-300 leading-relaxed font-medium">
                "Chủ nhà rất lịch sự và nhiệt tình. Khi điều hòa bị rò rỉ nước, mình báo lúc 8h sáng thì đến 10h đã có thợ qua xử lý dứt điểm. Tiền cọc được hoàn lại đúng 72 giờ qua tài khoản khi mình chuyển công tác vào Sài Gòn."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#163300] dark:text-white">David Miller</span>
                  <span className="text-[10px] font-bold text-[#163300] dark:text-[#9FE870] bg-[#E8F8EC] px-2.5 py-0.5 rounded-full border border-[#20A05A]/30">
                    Đã ở 8 tháng (Expat)
                  </span>
                </div>
                <div className="flex text-amber-500">★★★★★</div>
              </div>
              <p className="text-[#495E35] dark:text-slate-300 leading-relaxed font-medium">
                "Great English communication and 100% transparent on monthly electric bills. Highly recommended host on HAVEN."
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-[#738565] dark:text-slate-400 font-medium">
            Mã định danh chủ nhà: {landlord.id}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenChat?.();
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-[#163300] hover:bg-[#223D0D] text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Nhắn Tin Trực Tiếp Với {landlord.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
