import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Bell, 
  Award,
  MapPin,
  ArrowRight
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
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8EC] border border-[#9FE870]/30 text-[#163300] dark:text-[#9FE870] text-[10px] font-bold">
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
                <p className="text-2xl font-black text-[#163300] dark:text-[#9FE870] tabular-nums">
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
                <p className="text-2xl font-black text-[#163300] dark:text-[#9FE870] tabular-nums">
                  0%
                </p>
                <span className="text-[10px] text-[#738565] dark:text-slate-400 font-medium">Chưa từng hủy khách</span>
              </div>
            </div>

            {/* Trust Score Algorithm Weighted Factor Bar */}
            <div className="p-5 rounded-2xl bg-[#F9FAF8] dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-700 space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-[#495E35] dark:text-slate-400 font-bold flex items-center justify-between">
                <span>Thuật Toán Xếp Hạng Uy Tín HAVEN (Trust Score):</span>
                <span className="text-[#163300] dark:text-[#9FE870] font-black">{landlord.trustScore} / 5.0 (Xuất Sắc)</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>1. Xác minh CCCD & Sổ đỏ chính chủ (25%)</span>
                  <span className="text-[#163300] dark:text-[#9FE870] font-bold">100% ✓ Đã Thẩm Định</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>2. Đánh giá hài lòng cư dân thực tế (25%)</span>
                  <span className="text-[#7A5200] dark:text-amber-300 font-bold">4.8 / 5.0 (96%)</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>3. Tốc độ & tỷ lệ phản hồi tin nhắn (20%)</span>
                  <span className="text-[#163300] dark:text-[#9FE870] font-bold">98% (Phản hồi trong 15p)</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>4. Thâm niên hoạt động & Lịch sử giữ cọc (15%)</span>
                  <span className="text-[#163300] dark:text-[#9FE870] font-bold">14 Tháng • 100% hoàn cọc 72h</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>5. Tỷ lệ hủy lịch xem nhà (10%)</span>
                  <span className="text-[#163300] dark:text-[#9FE870] font-bold">0%</span>
                </div>
                <div className="flex items-center justify-between text-[#163300] dark:text-slate-300 font-medium">
                  <span>6. Báo cáo tranh chấp từ khách thuê (5%)</span>
                  <span className="text-[#163300] dark:text-[#9FE870] font-bold">0 Báo cáo vi phạm</span>
                </div>
              </div>
            </div>

            {/* Badges List */}
            <div className="flex items-center gap-2 flex-wrap">
              {landlord.badges.map((b, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded-full bg-[#E8F8EC] border border-[#9FE870]/30 text-[#163300] dark:text-[#9FE870] text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE LISTINGS - MINI SEARCH CATALOG WITH SCROLLBAR */}
        {activeTab === 'units' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider">
                Danh Sách Căn Hộ Đang Cho Thuê Của {landlord.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8EC] text-[#163300] dark:bg-[#163300] dark:text-[#9FE870] font-bold text-[11px] border border-[#9FE870]/30">
                {landlordUnits.length} căn hộ khả dụng
              </span>
            </div>

            <div className="max-h-[460px] overflow-y-auto pr-2 space-y-3.5">
              {landlordUnits.map(unit => (
                <div
                  key={unit.id}
                  onClick={() => {
                    onSelectUnit?.(unit.id);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-[#FBFDF9] dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/80 hover:border-[#163300] dark:hover:border-[#9FE870] transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-4 group shadow-xs hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 dark:bg-slate-800">
                    <SmartImage
                      src={unit.images[0]}
                      alt={unit.name || unit.id}
                      width={320}
                      quality={75}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
                      {unit.sqm} m²
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#2570EB] shrink-0" />
                        <span>{unit.district}, {unit.city === 'Hanoi' ? 'Hà Nội' : unit.city === 'Ho Chi Minh City' ? 'TP.HCM' : unit.city}</span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#163300] dark:text-white line-clamp-1 group-hover:text-[#2570EB] transition-colors mt-0.5">
                        {unit.name || unit.id}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-600 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                          {unit.bedrooms} Phòng ngủ
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                          {unit.bathrooms} WC
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                          Tầng {unit.floor}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-base sm:text-lg font-black text-[#163300] dark:text-[#9FE870] tabular-nums">
                        {((unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND) / 1000000).toFixed(1)} Tr<span className="text-xs font-normal text-slate-400">/tháng</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#163300] dark:text-[#9FE870] group-hover:translate-x-1 transition-transform">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
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
                  <span className="text-[10px] font-bold text-[#163300] dark:text-[#9FE870] bg-[#E8F8EC] px-2.5 py-0.5 rounded-full border border-[#9FE870]/30">
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
                  <span className="text-[10px] font-bold text-[#163300] dark:text-[#9FE870] bg-[#E8F8EC] px-2.5 py-0.5 rounded-full border border-[#9FE870]/30">
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
