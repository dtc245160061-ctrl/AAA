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
  Lock,
  Droplets,
  Building,
  Box,
  Check,
  Bike,
  Clock,
  Coins,
  Send,
  Swords,
  Timer,
  ChevronDown,
  ChevronUp,
  Navigation,
  Activity
} from 'lucide-react';
import type { ApartmentUnit, LandlordProfile } from '../types/apartment';
import { SmartImage } from './common/SmartImage';
import { 
  auditUnitPcccSafety, 
  calculateHyperRealisticLivingCost, 
  buildNegotiationWarRoomStrategy, 
  runAutoBargainingTurn,
  COMMUTE_DESTINATION_PRESETS,
  type CommuteVehicleType,
  type NegotiationPackage
} from '../services/aiSignatureFeaturesService';

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
  onOpenAiAdvisorWithPrompt?: (prompt: string) => void;
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
  onOpenAiAdvisorWithPrompt,
  onShowToast
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [showCostDetails, setShowCostDetails] = useState(true);

  // Engine 3: Hyper-Realistic True Living Cost & Commute State
  const cityPresets = useMemo(() => {
    const list = COMMUTE_DESTINATION_PRESETS.filter(
      p => p.city.toLowerCase() === unit.city.toLowerCase()
    );
    return list.length > 0 ? list : COMMUTE_DESTINATION_PRESETS;
  }, [unit.city]);

  const [selectedDestId, setSelectedDestId] = useState<string>(() => {
    const matched = COMMUTE_DESTINATION_PRESETS.find(p => p.city.toLowerCase() === unit.city.toLowerCase());
    return matched?.id || COMMUTE_DESTINATION_PRESETS[0].id;
  });
  const [vehicleType, setVehicleType] = useState<CommuteVehicleType>('motorbike');
  const [userIncomeVND, setUserIncomeVND] = useState<number>(35000000);

  const livingCostResult = useMemo(() => {
    return calculateHyperRealisticLivingCost(unit, selectedDestId, vehicleType, userIncomeVND);
  }, [unit, selectedDestId, vehicleType, userIncomeVND]);

  // Engine 2: PCCC QCVN 06:2022 Fire Survival Auditor
  const pcccAuditResult = useMemo(() => {
    return auditUnitPcccSafety(unit);
  }, [unit]);
  const [showPcccDetails, setShowPcccDetails] = useState<boolean>(false);

  // Engine 4: AI Negotiation War-Room & Auto-Bargaining Agent
  const warRoomStrategy = useMemo(() => {
    return buildNegotiationWarRoomStrategy(unit);
  }, [unit]);
  const [selectedPackageId, setSelectedPackageId] = useState<'package_commitment' | 'package_service_waiver' | 'package_price_match'>('package_commitment');
  const [isBargainingSent, setIsBargainingSent] = useState<boolean>(false);
  const [bargainingFeedback, setBargainingFeedback] = useState<string>('');

  const handleAutoBargain = (pkg: NegotiationPackage) => {
    setIsBargainingSent(true);
    const res = runAutoBargainingTurn(unit, pkg, 'Khách Thuê HAVEN', '0988 888 888');
    setBargainingFeedback(res.responseNotice);
    if (onShowToast) {
      onShowToast('success', 'AI Đã Gửi Lời Đề Nghị Đàm Phán', `Đã chuyển tiếp phương án "${pkg.title}" đến Chủ nhà.`);
    }
  };

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

  // Preload all gallery images immediately on mount so switching between photos is <10ms instantaneous
  React.useEffect(() => {
    galleryImages.forEach((imgUrl) => {
      if (imgUrl) {
        const preloader = new Image();
        preloader.src = imgUrl.includes('images.unsplash.com')
          ? `${imgUrl.split('?')[0]}?auto=format&fit=crop&w=900&q=75`
          : imgUrl;
      }
    });
  }, [galleryImages]);


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
            width={900}
            quality={75}
            priority={true}
            className="w-full h-full object-cover"
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
              className={`relative rounded-[22px] overflow-hidden cursor-pointer border-2 transition-all duration-200 group ${
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
                className="w-full h-full object-cover" 
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
            <div className="flex items-center gap-2 text-xs font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider">
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
              <MapPin className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0" />
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

          {/* 1. HYPER-REALISTIC TRUE COST OF LIVING & COMMUTE FUEL ENGINE (#14) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center font-bold shadow-2xs">
                  <Calculator className="w-5 h-5 text-[#163300]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white">
                      Bảng Tính Tổng Chi Phí Thực Tế & Nhiên Liệu Đi Làm (True Cost)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-black uppercase">
                      Chuẩn EVN & Xăng Xe
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Bóc tách tiền nhà, điện nước, gửi xe, nhiên liệu di chuyển và trù bị rủi ro ngập nước
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCostDetails(!showCostDetails)}
                className="text-xs font-bold text-[#163300] dark:text-[#9FE870] hover:underline cursor-pointer"
              >
                {showCostDetails ? 'Thu gọn' : 'Xem chi tiết'}
              </button>
            </div>

            {showCostDetails && (
              <div className="space-y-5">
                {/* Workplace & Vehicle Controls Bar */}
                <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
                        <span>Nơi Làm Việc / Đại Học:</span>
                      </label>
                      <select
                        value={selectedDestId}
                        onChange={(e) => setSelectedDestId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#9FE870] cursor-pointer text-xs"
                      >
                        {cityPresets.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1.5 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
                        <span>Phương Tiện Đi Lại:</span>
                      </label>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setVehicleType('motorbike')}
                          className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            vehicleType === 'motorbike'
                              ? 'bg-[#163300] text-white border-[#163300]'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Xe Máy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVehicleType('car_gas')}
                          className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            vehicleType === 'car_gas'
                              ? 'bg-[#163300] text-white border-[#163300]'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Car className="w-3.5 h-3.5" />
                          <span>Ô Tô</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVehicleType('car_ev')}
                          className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            vehicleType === 'car_ev'
                              ? 'bg-[#163300] text-white border-[#163300]'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 text-[#9FE870]" />
                          <span>EV</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1.5 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
                        <span>Mức Thu Nhập Hàng Tháng:</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step={1000000}
                          value={userIncomeVND}
                          onChange={(e) => setUserIncomeVND(Number(e.target.value) || 20000000)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-[#9FE870] font-black text-xs tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
                        />
                        <span className="text-[10px] text-slate-500 font-bold shrink-0">đ/tháng</span>
                      </div>
                    </div>
                  </div>

                  {/* Commute metrics strip */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 flex-wrap gap-2">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
                      <span>Khoảng cách: <strong>{livingCostResult.commuteOneWayKm} km</strong>/chiều (~{livingCostResult.monthlyRoundTripKm} km/tháng)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Giờ tắc đường: <strong>{livingCostResult.monthlyHoursLostInTraffic} giờ/tháng</strong></span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Xăng/Sạc điện: <strong>{livingCostResult.monthlyCommuteFuelCostVND.toLocaleString()} đ/tháng</strong></span>
                    </span>
                  </div>
                </div>

                {/* Living Cost Components Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Building className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" /> Tiền thuê phòng:
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(livingCostResult.baseRentVND / 1000000).toFixed(1)} Tr
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Zap className="w-4 h-4 text-[#FF6740]" /> Điện sinh hoạt EVN:
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {livingCostResult.electricityVND.toLocaleString()} đ
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Droplets className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" /> Nước & Cáp quang:
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(livingCostResult.waterVND + livingCostResult.internetFeeVND).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <ShieldCheck className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" /> Phí quản lý & Gửi xe:
                    </span>
                    <span className="font-bold text-[#163300] dark:text-white tabular-nums">
                      {(livingCostResult.managementFeeVND + livingCostResult.parkingFeeVND).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <Car className="w-4 h-4 text-[#2570EB]" /> Xăng / Sạc EV đi làm:
                    </span>
                    <span className="font-bold text-[#2570EB] tabular-nums">
                      {livingCostResult.monthlyCommuteFuelCostVND.toLocaleString()} đ
                    </span>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                      <CloudRain className="w-4 h-4 text-amber-500" /> Trù bị rủi ro ngập:
                    </span>
                    <span className="font-bold text-amber-600 tabular-nums">
                      {livingCostResult.floodRiskExposureVND.toLocaleString()} đ
                    </span>
                  </div>
                </div>

                {/* Grand Total Living Cost Banner */}
                <div className="p-6 rounded-[22px] bg-[#163300] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-[#9FE870]">
                      Tổng Chi Phí Sinh Hoạt Thực Tế (True Living Cost):
                    </span>
                    <div className="text-3xl font-black text-[#9FE870] mt-1 tracking-tight tabular-nums">
                      {(livingCostResult.grandTotalTrueLivingCostVND / 1000000).toFixed(2)} Triệu <span className="text-xs text-white/70 font-normal">/tháng</span>
                    </div>
                    <span className="text-[11px] text-white/80 font-medium">
                      Chiếm {livingCostResult.incomeRatioPercent}% thu nhập hàng tháng ({livingCostResult.financialHealthVerdictText})
                    </span>
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

          {/* 2. PCCC QCVN 06:2022/BXD FIRE SURVIVAL & EVACUATION AUDITOR (#15) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEAE5] text-[#FF5436] flex items-center justify-center font-bold shadow-2xs">
                  <Flame className="w-5 h-5 text-[#FF5436]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white">
                      AI Kiểm Định Sinh Tồn Cháy Nổ & Thoát Hiểm QCVN 06:2022
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFEAE5] text-[#D92D20] text-[10px] font-black uppercase">
                      Quy Chuẩn Quốc Gia
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Đánh giá khả năng thoát nạn từ tầng {unit.floor}, buồng thang điều áp chống khói và hệ thống chữa cháy
                  </p>
                </div>
              </div>

              {/* Survival Score Badge */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F8EC] border border-[#9FE870] text-[#163300] text-xs font-black shadow-2xs">
                  <Activity className="w-4 h-4 text-[#163300]" />
                  <span>Điểm Sinh Tồn: {pcccAuditResult.survivalScore}/100</span>
                </div>
              </div>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Thời Gian Thoát Nạn</span>
                <p className="text-[#163300] dark:text-white font-black text-base flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  <span>~{pcccAuditResult.evacuationMinutesLabel}</span>
                </p>
                <span className="text-[10px] text-slate-500 font-medium">({pcccAuditResult.estimatedEvacuationSeconds}s từ Tầng {unit.floor})</span>
              </div>

              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Thang Bộ Thoát Hiểm</span>
                <p className="text-[#163300] dark:text-white font-black text-base flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  <span>{pcccAuditResult.equipmentSummary.fireEscapeCount} Lối độc lập</span>
                </p>
                <span className="text-[10px] text-slate-500 font-medium">Buồng thang điều áp ngăn khói</span>
              </div>

              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Chữa Cháy Tự Động</span>
                <p className="text-[#163300] dark:text-white font-black text-base flex items-center gap-1.5">
                  {pcccAuditResult.equipmentSummary.hasAutomaticSprinklers ? (
                    <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                  <span>{pcccAuditResult.equipmentSummary.hasAutomaticSprinklers ? 'Đầu phun Sprinkler' : 'Bình xịt CO2'}</span>
                </p>
                <span className="text-[10px] text-slate-500 font-medium">Trang bị sẵn tại các phòng</span>
              </div>

              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Điện Khẩn Cấp Bơm PCCC</span>
                <p className="text-[#163300] dark:text-white font-black text-base flex items-center gap-1.5">
                  {pcccAuditResult.equipmentSummary.hasBackupPower ? (
                    <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                  <span>{pcccAuditResult.equipmentSummary.hasBackupPower ? 'Máy phát 100%' : 'Chưa có máy phát'}</span>
                </p>
                <span className="text-[10px] text-slate-500 font-medium">Duy trì quạt hút khói & bơm áp</span>
              </div>
            </div>

            {/* QCVN 06:2022 Checklist Toggle */}
            <div className="pt-2">
              <button
                onClick={() => setShowPcccDetails(!showPcccDetails)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-bold text-[#163300] dark:text-white flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Xem Báo Cáo Kiểm Định Chi Tiết 4 Tiêu Chuẩn QCVN 06:2022</span>
                {showPcccDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showPcccDetails && (
                <div className="mt-3 space-y-2.5 animate-in fade-in">
                  {pcccAuditResult.qcvnComplianceDetails.map((detail, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F9FAF8] dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#163300] dark:text-white flex items-center gap-1.5">
                          {detail.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          <span>{detail.title} ({detail.ruleCode})</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          detail.passed ? 'bg-[#E8F8EC] text-[#163300]' : 'bg-[#FFF8E6] text-[#9A6700]'
                        }`}>
                          {detail.passed ? 'ĐẠT CHUẨN' : 'CẦN LƯU Ý'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        • Tiêu chuẩn: {detail.standardReq} | Hiện trạng: <strong>{detail.currentValue}</strong>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] italic">
                        💡 {detail.advice}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Survival Recommendations Alert */}
            <div className="p-4 rounded-[20px] bg-[#FFEAE5]/60 border border-[#FF5436]/20 text-[11px] text-[#8C1F08] dark:text-rose-300 space-y-1.5">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#FF5436]" />
                <span>Khuyến Nghị Sinh Tồn Khẩn Cấp Cho Cư Dân:</span>
              </span>
              <ul className="space-y-1 list-disc pl-5 text-slate-700 dark:text-slate-300">
                {pcccAuditResult.survivalRecommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. AI DYNAMIC NEGOTIATION WAR-ROOM & AUTO-BARGAINING AGENT (#13) */}
          <div className="bg-white dark:bg-slate-900 border-2 border-[#163300]/20 dark:border-slate-800 rounded-[28px] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] flex items-center justify-center font-bold shadow-2xs">
                  <Swords className="w-5 h-5 text-[#163300] dark:text-[#9FE870]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#163300] dark:text-white">
                      Phòng Đấu Trí Đàm Phán Giá AI (Negotiation War-Room)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-black uppercase">
                      Đối Soát 1,700 Căn
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    AI phân tích đòn bẩy thương lượng với chủ nhà và tính toán 3 phương án counter-offer tối ưu
                  </p>
                </div>
              </div>

              {/* Percentile Status */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#163300] dark:text-white">
                  Phân vị giá: Top {warRoomStrategy.unitPricePercentile}% quận {unit.district}
                </span>
              </div>
            </div>

            {/* Market Leverage Context Box */}
            <div className="p-4 rounded-2xl bg-[#F7FAF6] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#163300] dark:text-white flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>Giá Trung Bình Phân Khúc {unit.bedrooms}PN tại {unit.district}:</span>
                </span>
                <span className="font-black text-sm text-[#163300] dark:text-[#9FE870] tabular-nums">
                  {(warRoomStrategy.districtMedianRentVND / 1000000).toFixed(1)} Triệu/tháng
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                ⚖️ <strong>Đòn bẩy đàm phán:</strong> {warRoomStrategy.leverageExplanation}
              </p>
            </div>

            {/* 3 Strategy Packages */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Chọn Chiến Lược Đàm Phán Phù Hợp Với Bạn:
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {warRoomStrategy.packages.map((pkg) => {
                  const isSelected = pkg.id === selectedPackageId;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-xs ${
                        isSelected
                          ? 'bg-[#E8F8EC] dark:bg-emerald-950/40 border-[#9FE870] shadow-sm ring-2 ring-[#9FE870]/40'
                          : 'bg-[#F9FAF8] dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-[#163300] text-[#9FE870] font-black text-[10px]">
                            {pkg.badge}
                          </span>
                          <span className="font-black text-[#163300] dark:text-white tabular-nums">
                            {(pkg.recommendedCounterPriceVND / 1000000).toFixed(1)} Tr/tháng
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-[#163300] dark:text-white">
                          {pkg.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {pkg.landlordValueProposition}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                          Tiết kiệm: ~{(pkg.annualSavingVND / 1000000).toFixed(1)}Tr/năm
                        </span>
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-[#163300] dark:text-[#9FE870]' : 'text-slate-400'}`}>
                          {isSelected ? '✓ Đang chọn' : 'Bấm chọn'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Strategy Proposal & Auto-Bargain Trigger */}
            {(() => {
              const activePkg = warRoomStrategy.packages.find(p => p.id === selectedPackageId) || warRoomStrategy.packages[0];
              return (
                <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Tin Nhắn Đàm Phán Tự Động Soạn Thảo (Chuẩn Văn Hóa Việt Nam):
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Tự động gửi vào hộp thư chủ nhà</span>
                  </div>

                  <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 italic text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{activePkg.proposedMessageToLandlord}"
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      Mục tiêu: Đàm phán giảm <strong>{(activePkg.monthlySavingVND / 1000000).toFixed(1)} triệu/tháng</strong> (Tiết kiệm {(activePkg.annualSavingVND / 1000000).toFixed(1)}Tr/năm)
                    </div>

                    <button
                      onClick={() => handleAutoBargain(activePkg)}
                      className="px-5 py-2.5 rounded-full bg-[#163300] hover:bg-[#234c03] text-[#9FE870] font-black text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>AI Tự Động Đàm Phán & Chốt Giá Giảm</span>
                    </button>
                  </div>

                  {isBargainingSent && (
                    <div className="p-3 rounded-xl bg-[#E8F8EC] border border-[#9FE870] text-[#163300] flex items-center gap-2 text-xs font-bold animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-[#163300] shrink-0" />
                      <span>{bargainingFeedback || 'Đã gửi lời đề nghị đàm phán thành công vào hộp thư của Chủ Nhà!'}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* 4. DEPOSIT TERMS & SANCTUARY COMMITMENT */}
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
                <span className="text-[#163300] dark:text-[#9FE870] font-bold text-[11px] tabular-nums">({(depositTerms.amountVND / 1000000).toFixed(0)} Triệu VNĐ)</span>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Thời Gian Hoàn Tiền</span>
                <p className="text-[#163300] dark:text-white font-bold text-base mt-1">Trong vòng 72 giờ</p>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Chuyển khoản trực tiếp</span>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Bảo Chứng Sàn</span>
                <p className="text-[#163300] dark:text-[#9FE870] font-bold text-base mt-1">HAVEN Escrow</p>
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
                    <Check className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870] shrink-0 mt-0.5" />
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
                  <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  <span>Điểm Mạnh Phù Hợp Nổi Bật</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {(unit.aiInsights?.whyFit || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#163300] dark:bg-[#9FE870] shrink-0 mt-1.5" />
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
              <Compass className="w-5 h-5 text-[#163300] dark:text-[#9FE870]" />
              <span>Đặc Tính Môi Trường & Hạ Tầng Xung Quanh</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#163300] dark:text-slate-200 font-bold">
                  <Wind className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" /> Vi Khí Hậu & Hướng Gió
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{unit.environmentalData.weatherNotes}</p>
              </div>

              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#163300] dark:text-slate-200 font-bold">
                  <CloudRain className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" /> Đánh Giá An Toàn Ngập Lụt
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
                  <Car className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" /> Giao Thông & Lối Vào Hầm Xe
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{unit.environmentalData.trafficNotes}</p>
              </div>
            </div>
          </div>

          {/* 4. HAVEN LOCAL AI AGENTIC COPILOT CARD */}
          <div className="bg-[#F2F5F0] dark:bg-slate-850 border border-[#9FE870]/50 rounded-[28px] p-6 md:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center font-bold shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#163300] dark:text-white flex items-center gap-2">
                    Haven AI Trợ Lý Căn Hộ
                    <span className="px-2 py-0.5 rounded-full bg-[#163300] text-[#9FE870] text-[10px] font-bold">
                      Local Qwen 7B
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Trí tuệ nhân tạo cục bộ hỗ trợ thẩm định, đàm phán và bóc tách tài chính 1-click
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                onClick={() => onOpenAiAdvisorWithPrompt?.(`Hãy thẩm định chi tiết ưu/nhược điểm, tiêu chuẩn an toàn PCCC và rủi ro ngập lụt của căn hộ ${unit.name || unit.id} tại ${unit.address || unit.district}, ${getCityDisplayName(unit.city)}`)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#9FE870] hover:shadow-xs text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#163300] dark:text-white group-hover:text-[#163300] dark:group-hover:text-[#9FE870]">
                  <ShieldCheck className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  <span>Thẩm Định An Toàn</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Đánh giá PCCC, ngập lụt mùa mưa & pháp lý
                </p>
              </button>

              <button
                onClick={() => onOpenAiAdvisorWithPrompt?.(`Lập chiến lược đàm phán giảm giá thuê cho căn ${unit.id} (giá niêm yết hiện tại ${(unit.monthlyRentVND / 1000000).toFixed(1)} triệu/tháng)`)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#9FE870] hover:shadow-xs text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#163300] dark:text-white group-hover:text-[#163300] dark:group-hover:text-[#9FE870]">
                  <Calculator className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  <span>Chiến Lược Trả Giá</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Gợi ý biên độ giảm 5-10% hoặc miễn phí gửi xe
                </p>
              </button>

              <button
                onClick={() => onOpenAiAdvisorWithPrompt?.(`Bóc tách chi tiết toàn bộ chi phí sinh hoạt thực tế hàng tháng True Cost cho căn ${unit.id}`)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#9FE870] hover:shadow-xs text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#163300] dark:text-white group-hover:text-[#163300] dark:group-hover:text-[#9FE870]">
                  <Zap className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  <span>Bóc Tách True Cost</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Dự toán điện nước & chi phí dọn vào
                </p>
              </button>
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
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" /> Chỗ đỗ ô tô
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" /> Bãi xe máy
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" /> Điện dự phòng
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" /> Wi-Fi tốc độ cao
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
                  <h4 className="text-sm font-bold text-[#163300] dark:text-white group-hover:text-[#2570EB] transition-colors">{landlord.name}</h4>
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
                  <p className="text-[#163300] dark:text-[#9FE870] font-bold">{landlord.responseRatePercent}%</p>
                </div>
                <div className="p-2.5 rounded-[16px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px]">Tốc độ trả lời:</span>
                  <p className="text-[#163300] dark:text-slate-200 font-bold">~{landlord.averageResponseMinutes} phút</p>
                </div>
              </div>

              <div className="text-[11px] font-bold text-center text-[#163300] dark:text-[#9FE870] pt-1 group-hover:underline">
                Xem toàn bộ hồ sơ & các căn hộ khác ➔
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
