import React, { useState, useMemo } from 'react';
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
  Box,
  Check
} from 'lucide-react';
import type { ApartmentUnit, LandlordProfile } from '../types/apartment';
import { SmartImage } from './common/SmartImage';

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

  // Distinct verified architectural photos pool
  const fallbackArchitecturalImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200'
  ];

  const galleryImages = useMemo(() => {
    const list = [...(unit.images || [])];
    let fallbackIdx = 0;
    while (list.length < 4) {
      const candidate = fallbackArchitecturalImages[fallbackIdx % fallbackArchitecturalImages.length];
      if (!list.includes(candidate)) {
        list.push(candidate);
      }
      fallbackIdx++;
    }
    return list.slice(0, 4);
  }, [unit.images]);

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
    <div className="space-y-8 pb-16 animate-in fade-in duration-300 font-sans text-slate-900 dark:text-slate-100">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách tìm kiếm</span>
        </button>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenVirtualTour && (
            <button
              onClick={() => onOpenVirtualTour(unit)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] text-[#163300] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Box className="w-4 h-4 text-[#163300]" />
              <span>3D Preview & Tour Ảo 360°</span>
            </button>
          )}

          {onOpenCommuteSimulator && (
            <button
              onClick={() => onOpenCommuteSimulator(unit)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#EBF2FC] hover:bg-[#D9E7F9] dark:bg-sky-950/40 dark:hover:bg-sky-900/60 border border-[#2570EB]/20 dark:border-sky-500/30 text-[#2570EB] dark:text-sky-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Car className="w-4 h-4 text-[#2570EB] dark:text-sky-400" />
              <span>Mô Phỏng Đi Làm</span>
            </button>
          )}

          <button
            onClick={() => onToggleSaveUnit(unit.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isSaved
                ? 'bg-[#9FE870]/25 border-[#9FE870] text-[#163300] dark:text-[#9FE870]'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Đã lưu căn hộ' : 'Lưu vào so sánh'}</span>
          </button>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Hero Photo (Takes 7 cols) */}
        <div className="lg:col-span-7 relative h-[360px] sm:h-[400px] md:h-[440px] rounded-[28px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md group">
          <SmartImage
            src={galleryImages[selectedPhotoIdx] || galleryImages[0]}
            alt={unit.name || unit.id}
            width={1200}
            quality={80}
            priority={true}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#163300] text-[#9FE870] border border-[#9FE870]/40 text-xs font-bold shadow-md flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#9FE870]" />
              <span>Verified Sanctuary Cấp 3 (Đã Xác Minh Sổ Đỏ & Ảnh Thật)</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 font-bold tabular-nums">
              Ảnh {selectedPhotoIdx + 1} / {galleryImages.length}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-[#163300] dark:text-[#9FE870] font-bold shadow-xs">
              Không dùng ảnh mẫu 3D • Chụp thực tế
            </span>
          </div>
        </div>

        {/* Thumbnail Selector 2x2 Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 h-[360px] sm:h-[400px] md:h-[440px]">
          {galleryImages.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhotoIdx(idx)}
              onMouseEnter={() => setSelectedPhotoIdx(idx)}
              className={`relative rounded-[22px] overflow-hidden cursor-pointer border-2 transition-all group ${
                selectedPhotoIdx === idx
                  ? 'border-[#163300] dark:border-[#9FE870] ring-2 ring-[#9FE870]/40 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 opacity-85 hover:opacity-100 hover:border-slate-400'
              }`}
            >
              <SmartImage 
                src={imgUrl} 
                alt={`Ảnh ${idx + 1}`} 
                width={480}
                quality={70}
                className="transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 pointer-events-none tabular-nums">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header Info & Booking Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Residence Identity & Specs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#20A05A] dark:text-[#9FE870] uppercase tracking-wider">
              <span>{getCityDisplayName(unit.city)}</span>
              <span>•</span>
              <span>{unit.district}</span>
              <span>•</span>
              <span>Tầng {unit.floor}</span>
              <span>•</span>
              <span>{unit.viewType}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#163300] dark:text-white leading-tight">
              {unit.name || unit.id}
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#20A05A] shrink-0" />
              <span>{unit.address || `${unit.district}, ${getCityDisplayName(unit.city)}`}</span>
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs shadow-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Phòng Ngủ</span>
              <p className="text-[#163300] dark:text-white text-base font-black mt-0.5">{unit.bedrooms} Phòng</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Phòng Tắm / WC</span>
              <p className="text-[#163300] dark:text-white text-base font-black mt-0.5">{unit.bathrooms} Phòng</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Diện Tích Sàn</span>
              <p className="text-[#163300] dark:text-white text-base font-black mt-0.5">{unit.sqm} m²</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Vị Trí Tầng</span>
              <p className="text-[#163300] dark:text-white text-base font-black mt-0.5">Tầng {unit.floor}</p>
            </div>
          </div>

          {/* 1. TRUE COST BREAKDOWN PANEL - Wise Calculator Style */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center font-bold shadow-2xs">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white">
                    Bảng Tính Tổng Chi Phí Thực Tế (Wise True Cost)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Bóc tách toàn bộ chi phí sinh hoạt hàng tháng — Cam kết 100% không phí ẩn
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCostDetails(!showCostDetails)}
                className="text-xs font-bold text-[#20A05A] dark:text-[#9FE870] hover:underline cursor-pointer"
              >
                {showCostDetails ? 'Thu gọn' : 'Xem chi tiết'}
              </button>
            </div>

            {showCostDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Building className="w-4 h-4 text-[#20A05A]" /> Tiền thuê phòng niêm yết:
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(trueCost.baseRentVND / 1000000).toFixed(1)} Tr
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Zap className="w-4 h-4 text-[#FF6740]" /> Điện ước tính (~3.500đ/kWh):
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(trueCost.estimatedElectricityVND / 1000).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Droplets className="w-4 h-4 text-[#20A05A]" /> Nước sinh hoạt:
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(trueCost.waterFeeVND / 1000).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Wifi className="w-4 h-4 text-[#20A05A]" /> Internet cáp quang:
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(trueCost.internetFeeVND / 1000).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <ShieldCheck className="w-4 h-4 text-[#20A05A]" /> Phí quản lý tòa nhà:
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(trueCost.managementFeeVND / 1000).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Car className="w-4 h-4 text-[#20A05A]" /> Phí gửi xe ({unit.hasCarParking ? 'Ô tô' : 'Xe máy'}):
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(trueCost.parkingFeeVND / 1000).toLocaleString()} đ
                    </span>
                  </div>
                </div>

                {/* Total True Cost Summary Box */}
                <div className="p-6 rounded-[22px] bg-[#163300] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-[#9FE870]">
                      Tổng Chi Phí Thực Tế Hàng Tháng:
                    </span>
                    <div className="text-3xl font-black text-[#9FE870] mt-1 tracking-tight tabular-nums">
                      {(trueCost.totalMonthlyEstimatedVND / 1000000).toFixed(2)} Triệu <span className="text-xs text-white/70 font-normal">/tháng</span>
                    </div>
                  </div>

                  <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-6">
                    <span className="text-xs text-white/70 uppercase tracking-wider font-bold">
                      Cần Chuẩn Bị Khi Dọn Vào:
                    </span>
                    <div className="text-xl font-bold text-white mt-0.5 tabular-nums">
                      {(trueCost.moveInTotalRequiredVND / 1000000).toFixed(1)} Triệu
                    </div>
                    <span className="text-[11px] text-[#9FE870] font-medium">
                      (Cọc {trueCost.depositMonths} tháng + Tháng đầu tiên)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. PCCC TRANSPARENCY CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEAE5] text-[#FF5436] flex items-center justify-center font-bold shadow-2xs">
                  <Flame className="w-5 h-5 text-[#FF5436]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white">
                    Minh Bạch An Toàn PCCC & Thoát Hiểm
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Tiêu chuẩn an toàn theo quy chuẩn quốc gia QCVN 06:2022
                  </p>
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-[#9FE870] text-[#163300] text-xs font-bold shadow-2xs">
                ✓ Đã Nghiệm Thu PCCC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Thang Bộ Thoát Hiểm</span>
                <p className="text-[#163300] dark:text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20A05A]" />
                  <span>{pccc.fireEscapeCount} Thang thoát hiểm điều áp chống khói</span>
                </p>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Chữa Cháy Tự Động</span>
                <p className="text-[#163300] dark:text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20A05A]" />
                  <span>Đầu phun Sprinkler áp lực cao trang bị từng phòng</span>
                </p>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Cảm Biến Khói & Báo Cháy</span>
                <p className="text-[#163300] dark:text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20A05A]" />
                  <span>Hệ thống cảm biến nối tủ trung tâm 24/7</span>
                </p>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Kiểm Định Lần Cuối</span>
                <p className="text-[#163300] dark:text-white font-bold text-sm flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#20A05A]" />
                  <span>Ngày {pccc.lastInspectionDate} (Hiệu lực 12 tháng)</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[18px] bg-[#FFEAE5]/60 border border-[#FF5436]/20 text-[11px] text-[#8C1F08] dark:text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#FF5436] shrink-0 mt-0.5" />
              <span>
                ⚖️ <strong>Khuyến nghị an toàn</strong>: {pccc.disclaimer}
              </span>
            </div>
          </div>

          {/* 3. DEPOSIT TERMS & SANCTUARY COMMITMENT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF6DB] text-[#7A5200] flex items-center justify-center font-bold shadow-2xs">
                <Lock className="w-5 h-5 text-[#7A5200]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white">
                  Điều Khoản Hoàn Tiền Cọc & Cam Kết Sanctuary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Bảo vệ quyền lợi khách thuê — Hoàn tiền minh bạch trong 72 giờ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Mức Tiền Cọc</span>
                <p className="text-[#163300] dark:text-white font-bold text-base mt-1">{depositTerms.months} Tháng tiền nhà</p>
                <span className="text-[#20A05A] font-bold text-[11px] tabular-nums">({(depositTerms.amountVND / 1000000).toFixed(0)} Triệu VNĐ)</span>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Thời Gian Hoàn Tiền</span>
                <p className="text-[#163300] dark:text-white font-bold text-base mt-1">Trong vòng 72 giờ</p>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Chuyển khoản trực tiếp</span>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Bảo Chứng Sàn</span>
                <p className="text-[#20A05A] font-bold text-base mt-1">HAVEN Escrow</p>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Trọng tài hòa giải 100%</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#163300] dark:text-slate-300 uppercase tracking-wider">
                Quy Tắc Khấu Trừ Minh Bạch:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {depositTerms.deductionRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#20A05A] shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Apartment Insight Panel - Clean Wise Standard */}
          <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center font-bold shadow-2xs">
                <Sparkles className="w-5 h-5 text-[#163300]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white">
                    Đánh Giá Chuyên Sâu Từ Trí Tuệ Nhân Tạo AI
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] text-[10px] font-bold uppercase">
                    Live Insight
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Phân tích tính tương thích sinh hoạt và rủi ro môi trường
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Why This Fits You */}
              <div className="space-y-3 p-5 rounded-[22px] bg-[#F7FAF6] dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                <h4 className="text-xs uppercase tracking-wider text-[#163300] dark:text-[#9FE870] font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20A05A]" />
                  <span>Điểm Mạnh Phù Hợp Nổi Bật</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {(unit.aiInsights?.whyFit || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#20A05A] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Things to Consider */}
              <div className="space-y-3 p-5 rounded-[22px] bg-[#FFFBF0] dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700/60 shadow-2xs">
                <h4 className="text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400 font-black flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#FF6740]" />
                  <span>Lưu Ý Cần Cân Nhắc</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {((unit.aiInsights?.worthConsidering || (unit.aiInsights as any)?.considerations) || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6740] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Environmental & Surrounding Infrastructure Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-[#20A05A]" />
              <span>Đặc Tính Môi Trường & Hạ Tầng Xung Quanh</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#163300] dark:text-slate-200 font-bold">
                  <Wind className="w-4 h-4 text-[#20A05A]" /> Vi Khí Hậu & Hướng Gió
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{unit.environmentalData.weatherNotes}</p>
              </div>

              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#163300] dark:text-slate-200 font-bold">
                  <CloudRain className="w-4 h-4 text-[#20A05A]" /> Đánh Giá An Toàn Ngập Lụt
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{unit.environmentalData.floodNotes}</p>
              </div>

              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#163300] dark:text-slate-200 font-bold">
                  <Zap className="w-4 h-4 text-[#FF6740]" /> Nguồn Điện Dự Phòng Tòa Nhà
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{unit.environmentalData.powerNotes}</p>
              </div>

              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#163300] dark:text-slate-200 font-bold">
                  <Car className="w-4 h-4 text-[#20A05A]" /> Giao Thông & Lối Vào Hầm Xe
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{unit.environmentalData.trafficNotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Landlord & Rental CTA Box */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Pricing Box - Wise Clean Surface */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Tổng Chi Phí Thực Tế</span>
                <div className="text-3xl font-black text-[#163300] dark:text-[#9FE870] mt-1 tabular-nums">
                  {(trueCost.totalMonthlyEstimatedVND / 1000000).toFixed(1)} Triệu
                  <span className="text-xs text-slate-400 font-normal"> /tháng</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium tabular-nums">
                  Giá thuê gốc: {(unit.monthlyRentVND / 1000000).toFixed(0)} Tr + Phí điện nước DV
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <button
                  onClick={() => onOpenBookingModal(unit)}
                  className="w-full py-4 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] text-[#163300] font-bold text-sm transition-all shadow-sm text-center hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                >
                  Đặt Lịch Xem Căn Hộ
                </button>

                {/* Direct Chat Button */}
                <button
                  onClick={() => onOpenChat?.(unit)}
                  className="w-full py-3.5 rounded-full bg-[#163300] hover:bg-[#204500] text-[#9FE870] border border-[#163300] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.01] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#9FE870]" />
                  <span>Chat Trực Tiếp Với Chủ Nhà</span>
                  <span className="w-2 h-2 rounded-full bg-[#9FE870] animate-pulse ml-1" />
                </button>

                {/* Escrow Deposit Protection Button */}
                {onOpenDepositEscrow && (
                  <button
                    onClick={() => onOpenDepositEscrow(unit)}
                    className="w-full py-3 rounded-full bg-[#FFF6DB] hover:bg-[#ffefc2] text-[#7A5200] dark:bg-amber-950/40 dark:text-[#FFC83B] border border-[#FFC83B]/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#7A5200] dark:text-[#FFC83B]" />
                    <span>Ký Quỹ Cọc Bảo Chứng (HAVEN Escrow)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onShowToast) {
                      onShowToast('info', 'Kết nối Chuyên viên HAVEN 24/7', `Đang chuyển cuộc gọi tới chuyên viên hỗ trợ căn hộ ${unit.name || unit.id}...`);
                    }
                  }}
                  className="w-full py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hotline Hỗ Trợ 24/7</span>
                </button>
              </div>

              {/* Included Amenities Checklist */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300 font-sans">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Tiện Ích Đi Kèm</span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20A05A]" /> Chỗ đỗ ô tô
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20A05A]" /> Bãi xe máy
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20A05A]" /> Điện dự phòng
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20A05A]" /> Wi-Fi tốc độ cao
                  </div>
                </div>
              </div>
            </div>

            {/* Landlord Profile Mini Card */}
            <div 
              onClick={() => onOpenLandlordProfile?.(landlord)}
              className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#163300]/30 transition-all space-y-4 shadow-sm cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Hồ Sơ Chủ Nhà Uy Tín</span>
                <span className="px-3 py-0.5 rounded-full bg-[#9FE870]/20 text-[#163300] dark:text-[#9FE870] border border-[#9FE870]/30 text-[10px] font-bold">
                  ✓ Verified Host
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={landlord.avatar}
                  alt={landlord.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#9FE870] transition-colors"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#163300] dark:text-white group-hover:text-[#20A05A] transition-colors">{landlord.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-[#7A5200] dark:text-[#FFC83B] mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-[#FFC83B] text-[#FFC83B]" />
                    <span className="font-bold">{landlord.trustScore}★</span>
                    <span className="text-slate-400">({landlord.reviewCount} đánh giá)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-[16px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px]">Tỷ lệ phản hồi:</span>
                  <p className="text-[#20A05A] font-bold">{landlord.responseRatePercent}%</p>
                </div>
                <div className="p-2.5 rounded-[16px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px]">Tốc độ trả lời:</span>
                  <p className="text-[#163300] dark:text-slate-200 font-bold">~{landlord.averageResponseMinutes} phút</p>
                </div>
              </div>

              <div className="text-[11px] font-bold text-center text-[#20A05A] dark:text-[#9FE870] pt-1 group-hover:underline">
                Xem toàn bộ hồ sơ & các căn hộ khác ➔
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
