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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl atmospheric-panel border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header with Close */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={landlord.avatar}
                alt={landlord.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl text-slate-100 font-bold">{landlord.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold">
                  ✓ Verified SuperHost
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>Tham gia: {landlord.joinedDate}</span>
                <span>•</span>
                <span>{landlord.activeListingsCount} Căn hộ đang quản lý</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                isFollowed
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-emerald-500/40'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isFollowed ? 'Đang Theo Dõi' : 'Theo Dõi Căn Mới'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Chỉ Số Uy Tín & Hồ Sơ
          </button>
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-colors ${
              activeTab === 'units'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Căn Hộ Cho Thuê ({landlordUnits.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Đánh Giá Cư Dân ({landlord.reviewCount})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TRUST SCORE BREAKDOWN */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 4 Pillar Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">Điểm Uy Tín</span>
                <p className="text-2xl font-serif font-bold text-amber-300 flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{landlord.trustScore}★</span>
                </p>
                <span className="text-[10px] text-slate-400">Dựa trên 6 yếu tố</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">Tỷ Lệ Phản Hồi</span>
                <p className="text-2xl font-serif font-bold text-emerald-400">
                  {landlord.responseRatePercent}%
                </p>
                <span className="text-[10px] text-slate-400">Rất tích cực</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">Tốc Độ Trả Lời</span>
                <p className="text-2xl font-serif font-bold text-slate-100">
                  ~{landlord.averageResponseMinutes}p
                </p>
                <span className="text-[10px] text-slate-400">Shopee SLA &lt;2h</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">Tỷ Lệ Hủy Lịch</span>
                <p className="text-2xl font-serif font-bold text-emerald-400">
                  0%
                </p>
                <span className="text-[10px] text-slate-400">Chưa từng hủy khách</span>
              </div>
            </div>

            {/* Trust Score Algorithm Weighted Factor Bar */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
                <span>Thuật Toán Xếp Hạng Uy Tín HAVEN (Trust Score):</span>
                <span className="text-emerald-400 font-bold">{landlord.trustScore} / 5.0 (Xuất Sắc)</span>
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>1. Xác minh CCCD & Sổ đỏ chính chủ (25%)</span>
                  <span className="text-emerald-400 font-bold">100% ✓ Đã Thẩm Định</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>2. Đánh giá hài lòng cư dân thực tế (25%)</span>
                  <span className="text-amber-300 font-bold">4.8 / 5.0 (96%)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>3. Tốc độ & tỷ lệ phản hồi tin nhắn (20%)</span>
                  <span className="text-emerald-400 font-bold">98% (Phản hồi trong 15p)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>4. Thâm niên hoạt động & Lịch sử giữ cọc (15%)</span>
                  <span className="text-emerald-400 font-bold">14 Tháng • 100% hoàn cọc 72h</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>5. Tỷ lệ hủy lịch xem nhà (10%)</span>
                  <span className="text-emerald-400 font-bold">0%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>6. Báo cáo tranh chấp từ khách thuê (5%)</span>
                  <span className="text-emerald-400 font-bold">0 Báo cáo vi phạm</span>
                </div>
              </div>
            </div>

            {/* Badges List */}
            <div className="flex items-center gap-2 flex-wrap">
              {landlord.badges.map((b, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
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
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer flex gap-3 group"
                >
                  <img
                    src={unit.images[0]}
                    alt={unit.name || unit.id}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <h5 className="font-serif font-bold text-sm text-slate-100 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {unit.name || unit.id}
                    </h5>
                    <p className="text-[11px] font-mono text-slate-400">{unit.district}</p>
                    <p className="text-xs font-mono text-emerald-400 font-bold">
                      {((unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND) / 1000000).toFixed(1)} Tr/tháng
                    </p>
                    <span className="text-[10px] font-mono text-slate-500">
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
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">Nguyễn Phương Thảo</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Đã ở 12 tháng (Hồ Tây)
                  </span>
                </div>
                <div className="flex text-amber-400">★★★★★</div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                "Chủ nhà rất lịch sự và nhiệt tình. Khi điều hòa bị rò rỉ nước, mình báo lúc 8h sáng thì đến 10h đã có thợ qua xử lý dứt điểm. Tiền cọc được hoàn lại đúng 72 giờ qua tài khoản khi mình chuyển công tác vào Sài Gòn."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">David Miller</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Đã ở 8 tháng (Expat)
                  </span>
                </div>
                <div className="flex text-amber-400">★★★★★</div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                "Great English communication and 100% transparent on monthly electric bills. Highly recommended host on HAVEN."
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-400">
            Mã định danh chủ nhà: {landlord.id}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenChat?.();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
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
