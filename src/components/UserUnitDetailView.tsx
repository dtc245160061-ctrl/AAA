import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  CloudRain, 
  Zap, 
  Car, 
  ArrowLeft, 
  Bookmark, 
  Phone, 
  Wind, 
  Compass,
  MessageSquare,
  Calculator,
  ShieldCheck,
  Flame,
  Star,
  FileCheck2,
  Lock,
  Wifi,
  Droplets,
  Building,
  Check
} from 'lucide-react';
import type { ApartmentUnit, LandlordProfile } from '../types/apartment';

interface UserUnitDetailViewProps {
  unit: ApartmentUnit;
  isSaved: boolean;
  onToggleSaveUnit: (id: string) => void;
  onBackToDirectory: () => void;
  onOpenBookingModal: (unit: ApartmentUnit) => void;
  onOpenChat?: (unit: ApartmentUnit) => void;
  onOpenCommuteSimulator?: (unit: ApartmentUnit) => void;
  onOpenDepositEscrow?: (unit: ApartmentUnit) => void;
  onOpenVirtualTour?: (unit: ApartmentUnit) => void;
  onOpenLandlordProfile?: (landlord: LandlordProfile) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const UserUnitDetailView: React.FC<UserUnitDetailViewProps> = ({
  unit,
  isSaved,
  onToggleSaveUnit,
  onBackToDirectory,
  onOpenBookingModal,
  onOpenChat,
  onOpenCommuteSimulator,
  onOpenDepositEscrow,
  onOpenVirtualTour,
  onOpenLandlordProfile,
  onShowToast
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [showCostDetails, setShowCostDetails] = useState(true);

  const getCityDisplayName = (city: string) => {
    switch (city) {
      case 'Hanoi': return 'Hà Nội';
      case 'Ho Chi Minh City': return 'TP. Hồ Chí Minh';
      case 'Da Nang': return 'Đà Nẵng';
      default: return city;
    }
  };

  const trueCost = unit.trueCost || {
    baseRentVND: unit.monthlyRentVND,
    estimatedElectricityVND: 850000,
    waterFeeVND: 140000,
    internetFeeVND: 250000,
    managementFeeVND: Math.round(unit.sqm * 18000),
    parkingFeeVND: unit.hasCarParking ? 1200000 : 120000,
    totalMonthlyEstimatedVND: unit.monthlyRentVND + 850000 + 140000 + 250000 + Math.round(unit.sqm * 18000) + (unit.hasCarParking ? 1200000 : 120000),
    depositMonths: unit.monthlyRentVND > 30000000 ? 2 : 1,
    depositVND: unit.monthlyRentVND * (unit.monthlyRentVND > 30000000 ? 2 : 1),
    moveInTotalRequiredVND: unit.monthlyRentVND * 2 + 2500000,
    electricityRatePerKwh: 3500
  };

  const pccc = unit.pcccReport || {
    hasFireEscapes: true,
    fireEscapeCount: unit.floor > 15 ? 3 : 2,
    hasAutomaticSprinklers: true,
    hasSmokeDetectors: true,
    hasFireExtinguishers: true,
    inspectionCertificateStatus: 'certified' as const,
    lastInspectionDate: '2025-11-15',
    emergencyExitWidthMeters: 1.4,
    disclaimer: 'Dữ liệu tham chiếu hồ sơ nghiệm thu PCCC tòa nhà. Khuyến nghị kiểm tra thực tế khi xem phòng.'
  };

  const landlord = unit.landlord || {
    id: 'host-main',
    name: unit.city === 'Hanoi' ? 'Nguyễn Văn Minh' : 'Lê Hoàng Sơn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    phone: '0909 888 777',
    verificationLevel: 'full_ownership_verified' as const,
    trustScore: 4.8,
    reviewCount: 18,
    responseRatePercent: 98,
    averageResponseMinutes: 15,
    activeListingsCount: 4,
    joinedDate: 'Tháng 03/2024',
    isSuperHost: true,
    badges: ['Chủ nhà uy tín', 'Phản hồi trong 15p', 'Xác minh Sổ đỏ']
  };

  const depositTerms = unit.depositTerms || {
    months: trueCost.depositMonths,
    amountVND: trueCost.depositVND,
    refundTimelineDays: 3,
    deductionRules: [
      'Hoàn 100% nếu thông báo trước 30 ngày kết thúc hợp đồng',
      'Trừ chi phí sửa chữa hỏng hóc nếu có theo biên bản bàn giao ban đầu',
      'Hoàn tiền qua chuyển khoản trong vòng 72 giờ sau khi trả phòng'
    ],
    depositProtectionActive: true
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách tìm kiếm</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          {onOpenVirtualTour && (
            <button
              onClick={() => onOpenVirtualTour(unit)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-400/50 text-purple-300 text-xs font-mono font-bold hover:bg-purple-900/80 transition-all shadow-md"
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Tour Ảo 360°</span>
            </button>
          )}

          {onOpenCommuteSimulator && (
            <button
              onClick={() => onOpenCommuteSimulator(unit)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-950/80 border border-sky-400/50 text-sky-300 text-xs font-mono font-bold hover:bg-sky-900/80 transition-all shadow-md"
            >
              <Car className="w-3.5 h-3.5 text-sky-400" />
              <span>Mô Phỏng Đi Làm</span>
            </button>
          )}

          <button
            onClick={() => onToggleSaveUnit(unit.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all ${
              isSaved
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{isSaved ? 'Đã lưu vào danh sách' : 'Lưu vào mục so sánh'}</span>
          </button>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Large Photo */}
        <div className="lg:col-span-2 relative h-[440px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <img
            src={unit.images[selectedPhotoIdx] || unit.images[0]}
            alt={unit.name || unit.id}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold backdrop-blur-md shadow-lg shadow-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Sanctuary Cấp 3 (Đã Xác Minh Sổ Đỏ & Ảnh Thật)</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-200">
            <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800">
              Ảnh {selectedPhotoIdx + 1} / {unit.images.length}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              Không dùng ảnh mẫu 3D • Chụp thực tế
            </span>
          </div>
        </div>

        {/* Thumbnail Selector List */}
        <div className="flex flex-col gap-3">
          {unit.images.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhotoIdx(idx)}
              className={`relative h-[138px] rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                selectedPhotoIdx === idx
                  ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                  : 'border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Header Info & Booking Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Residence Identity & Specs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
              <span>{getCityDisplayName(unit.city)}</span>
              <span>•</span>
              <span>{unit.district}</span>
              <span>•</span>
              <span>Tầng {unit.floor}</span>
              <span>•</span>
              <span>{unit.viewType}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-100 font-bold">{unit.name || unit.id}</h1>
            <p className="text-sm font-sans text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{unit.address || `${unit.district}, ${getCityDisplayName(unit.city)}`}</span>
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono shadow-xl">
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Phòng Ngủ</span>
              <p className="text-slate-100 text-base font-serif font-semibold mt-0.5">{unit.bedrooms} Phòng</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Phòng Tắm / WC</span>
              <p className="text-slate-100 text-base font-serif font-semibold mt-0.5">{unit.bathrooms} Phòng</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Diện Tích Sàn</span>
              <p className="text-slate-100 text-base font-serif font-semibold mt-0.5">{unit.sqm} m²</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Vị Trí Tầng</span>
              <p className="text-slate-100 text-base font-serif font-semibold mt-0.5">Tầng {unit.floor}</p>
            </div>
          </div>

          {/* 1. SIGNATURE P0: TRUE COST BREAKDOWN PANEL */}
          <div className="rounded-3xl liquid-glass-origin border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-slate-100 font-bold">Bảng Tính Tổng Chi Phí Thực Tế (True Cost)</h3>
                  <p className="text-xs text-slate-400 font-mono">Bóc tách toàn bộ chi phí sinh hoạt hàng tháng — Không phí ẩn</p>
                </div>
              </div>

              <button
                onClick={() => setShowCostDetails(!showCostDetails)}
                className="text-xs font-mono text-emerald-400 hover:underline"
              >
                {showCostDetails ? 'Thu gọn' : 'Xem chi tiết'}
              </button>
            </div>

            {showCostDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-400" /> Tiền thuê phòng niêm yết:
                    </span>
                    <span className="font-bold text-slate-100">{(trueCost.baseRentVND / 1000000).toFixed(1)} Tr</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> Điện ước tính (~3.500đ/kWh):
                    </span>
                    <span className="font-bold text-slate-100">{(trueCost.estimatedElectricityVND / 1000).toLocaleString()} đ</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-sky-400" /> Nước sinh hoạt:
                    </span>
                    <span className="font-bold text-slate-100">{(trueCost.waterFeeVND / 1000).toLocaleString()} đ</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-purple-400" /> Internet cáp quang tốc độ cao:
                    </span>
                    <span className="font-bold text-slate-100">{(trueCost.internetFeeVND / 1000).toLocaleString()} đ</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Phí quản lý tòa nhà & an ninh:
                    </span>
                    <span className="font-bold text-slate-100">{(trueCost.managementFeeVND / 1000).toLocaleString()} đ</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Car className="w-4 h-4 text-indigo-400" /> Phí gửi xe ({unit.hasCarParking ? 'Ô tô' : 'Xe máy'}):
                    </span>
                    <span className="font-bold text-slate-100">{(trueCost.parkingFeeVND / 1000).toLocaleString()} đ</span>
                  </div>
                </div>

                {/* Total True Cost Summary Box */}
                <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                      Tổng Chi Phí Thực Tế Hàng Tháng:
                    </span>
                    <div className="text-3xl font-serif font-bold text-emerald-300 mt-1">
                      {(trueCost.totalMonthlyEstimatedVND / 1000000).toFixed(2)} Triệu <span className="text-xs text-slate-400 font-sans font-normal">/tháng</span>
                    </div>
                  </div>

                  <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-emerald-500/30 pt-3 sm:pt-0 sm:pl-6">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Cần Chuẩn Bị Khi Dọn Vào:
                    </span>
                    <div className="text-xl font-serif font-bold text-slate-100 mt-0.5">
                      {(trueCost.moveInTotalRequiredVND / 1000000).toFixed(1)} Triệu
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400/90">
                      (Cọc {trueCost.depositMonths} tháng + Tháng đầu tiên)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. SIGNATURE P0: PCCC TRANSPARENCY CARD */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-rose-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Flame className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-slate-100 font-bold">Minh Bạch An Toàn PCCC & Thoát Hiểm</h3>
                  <p className="text-xs text-slate-400 font-mono">Tiêu chuẩn an toàn theo quy chuẩn QCVN 06:2022</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                ✓ Đã Nghiệm Thu PCCC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px]">Thang Bộ Thoát Hiểm</span>
                <p className="text-slate-100 font-semibold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{pccc.fireEscapeCount} Thang thoát hiểm điều áp chống khói</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px]">Chữa Cháy Tự Động</span>
                <p className="text-slate-100 font-semibold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Đầu phun Sprinkler áp lực cao trang bị từng phòng</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px]">Cảm Biến Khói & Báo Cháy</span>
                <p className="text-slate-100 font-semibold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hệ thống cảm biến nối tủ trung tâm 24/7</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px]">Kiểm Định Lần Cuối</span>
                <p className="text-slate-100 font-semibold text-sm flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Ngày {pccc.lastInspectionDate} (Hiệu lực 12 tháng)</span>
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-[11px] font-mono text-rose-300/90 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                ⚖️ <strong>Khuyến nghị an toàn</strong>: {pccc.disclaimer}
              </span>
            </div>
          </div>

          {/* 3. SIGNATURE P0: DEPOSIT TERMS PANEL */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-slate-100 font-bold">Điều Khoản Hoàn Tiền Cọc & Cam Kết Sanctuary</h3>
                <p className="text-xs text-slate-400 font-mono">Bảo vệ quyền lợi khách thuê — Hoàn tiền minh bạch trong 72 giờ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px]">Mức Tiền Cọc</span>
                <p className="text-slate-100 font-semibold text-base mt-1">{depositTerms.months} Tháng tiền nhà</p>
                <span className="text-emerald-400 text-[11px]">({(depositTerms.amountVND / 1000000).toFixed(0)} Triệu VNĐ)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px]">Thời Gian Hoàn Tiền</span>
                <p className="text-slate-100 font-semibold text-base mt-1">Trong vòng 72 giờ</p>
                <span className="text-slate-400 text-[11px]">Chuyển khoản trực tiếp</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px]">Bảo Chứng Sàn</span>
                <p className="text-emerald-400 font-semibold text-base mt-1">HAVEN Escrow</p>
                <span className="text-slate-400 text-[11px]">Trọng tài hòa giải 100%</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Quy Tắc Khấu Trừ Minh Bạch:</span>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {depositTerms.deductionRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Apartment Insight Panel */}
          <div className="rounded-3xl liquid-glass-origin border border-emerald-500/30 p-6 md:p-8 space-y-6 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-slate-100 font-bold">Đánh Giá Chuyên Sâu Từ Trí Tuệ Nhân Tạo AI</h3>
                <p className="text-xs text-slate-400 font-mono">Phân tích tính tương thích sinh hoạt và rủi ro môi trường</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Why This Fits You */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 shadow-lg">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Điểm Mạnh Phù Hợp Nổi Bật</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                  {unit.aiInsights.whyFit.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Worth Considering / Drawbacks */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-900/70 border border-amber-500/30 shadow-lg">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Lưu Ý Cần Cân Nhắc</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                  {unit.aiInsights.worthConsidering.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Environmental Intelligence Section */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6 shadow-2xl">
            <h3 className="font-serif text-xl text-slate-100 flex items-center gap-2.5 font-bold">
              <Compass className="w-5 h-5 text-sky-400" />
              <span>Đặc Tính Môi Trường & Hạ Tầng Xung Quanh</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-300 font-semibold">
                  <Wind className="w-4 h-4" /> Vi Khí Hậu & Hướng Gió
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{unit.environmentalData.weatherNotes}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-semibold">
                  <CloudRain className="w-4 h-4" /> Đánh Giá An Toàn Ngập Lụt
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{unit.environmentalData.floodNotes}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-semibold">
                  <Zap className="w-4 h-4" /> Nguồn Điện Dự Phòng Tòa Nhà
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{unit.environmentalData.powerNotes}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-semibold">
                  <Car className="w-4 h-4" /> Giao Thông & Lối Vào Hầm Xe
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{unit.environmentalData.trafficNotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Landlord & Rental CTA Box */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Pricing Box */}
            <div className="p-6 md:p-8 rounded-3xl liquid-glass-origin border border-emerald-500/30 space-y-6 shadow-2xl backdrop-blur-2xl">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tổng Chi Phí Thực Tế</span>
                <div className="text-3xl font-serif font-bold text-emerald-400 mt-1">
                  {(trueCost.totalMonthlyEstimatedVND / 1000000).toFixed(1)} Triệu
                  <span className="text-xs text-slate-400 font-sans font-normal"> /tháng</span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Giá thuê gốc: {(unit.monthlyRentVND / 1000000).toFixed(0)} Tr + Phí điện nước DV
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <button
                  onClick={() => onOpenBookingModal(unit)}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm font-mono transition-all shadow-lg shadow-emerald-500/30 text-center hover:scale-[1.02] active:scale-[0.98]"
                >
                  Đặt Lịch Xem Căn Hộ
                </button>

                {/* Shopee-style Direct Chat Button */}
                <button
                  onClick={() => onOpenChat?.(unit)}
                  className="w-full py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Chat Trực Tiếp Với Chủ Nhà</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
                </button>

                {/* Escrow Deposit Protection Button */}
                {onOpenDepositEscrow && (
                  <button
                    onClick={() => onOpenDepositEscrow(unit)}
                    className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Ký Quỹ Cọc Bảo Chứng (HAVEN Escrow)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onShowToast) {
                      onShowToast('info', 'Kết nối Chuyên viên HAVEN 24/7', `Đang chuyển cuộc gọi tới chuyên viên hỗ trợ căn hộ ${unit.name || unit.id}...`);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hotline Hỗ Trợ 24/7</span>
                </button>
              </div>

              {/* Included Amenities Checklist */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-mono text-slate-300">
                <span className="text-slate-500 uppercase text-[10px]">Tiện Ích Đi Kèm</span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Chỗ đỗ ô tô
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bãi xe máy
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Điện dự phòng
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Wi-Fi tốc độ cao
                  </div>
                </div>
              </div>
            </div>

            {/* Landlord Profile Mini Card (D10 / C5) */}
            <div 
              onClick={() => onOpenLandlordProfile?.(landlord)}
              className="p-5 rounded-2xl atmospheric-panel border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 shadow-xl cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Hồ Sơ Chủ Nhà Uy Tín</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                  ✓ Verified Host
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={landlord.avatar}
                  alt={landlord.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50 group-hover:border-emerald-400 transition-colors"
                />
                <div>
                  <h4 className="text-sm font-serif font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">{landlord.name}</h4>
                  <div className="flex items-center gap-1 text-xs font-mono text-amber-400 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{landlord.trustScore}★</span>
                    <span className="text-slate-400">({landlord.reviewCount} đánh giá)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800/80">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500">Tỷ lệ phản hồi:</span>
                  <p className="text-emerald-400 font-bold">{landlord.responseRatePercent}%</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500">Tốc độ trả lời:</span>
                  <p className="text-slate-200 font-bold">~{landlord.averageResponseMinutes} phút</p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-center text-emerald-400/90 pt-1 group-hover:underline">
                Xem toàn bộ hồ sơ & các căn hộ khác ➔
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
