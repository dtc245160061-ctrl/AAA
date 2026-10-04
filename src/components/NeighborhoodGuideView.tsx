import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  ShieldCheck, 
  CloudRain, 
  GraduationCap, 
  Building2, 
  TrendingUp, 
  Train, 
  ArrowRight,
  Sparkles,
  Search,
  Star,
  Flame,
  CheckCircle2
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { ApartmentStore, normalizeCity } from '../data/apartmentStore';
import { SmartImage } from './common/SmartImage';

interface NeighborhoodGuideViewProps {
  units: ApartmentUnit[];
  onSelectUnit: (unitId: string) => void;
  onNavigateSearchDistrict: (district: string) => void;
}

export const NeighborhoodGuideView: React.FC<NeighborhoodGuideViewProps> = ({
  units,
  onSelectUnit,
  onNavigateSearchDistrict
}) => {
  const neighborhoods = ApartmentStore.getNeighborhoods();
  const [selectedCity, setSelectedCity] = useState<string>('Hanoi');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>('');

  const cityOptions = [
    { id: 'Hanoi', label: 'Hà Nội' },
    { id: 'Ho Chi Minh City', label: 'TP. Hồ Chí Minh' },
    { id: 'Da Nang', label: 'Đà Nẵng' },
    { id: 'Thái Nguyên', label: 'Thái Nguyên' },
    { id: 'Hải Phòng', label: 'Hải Phòng' },
    { id: 'Bình Dương', label: 'Bình Dương' },
  ];

  const filteredNeighborhoods = neighborhoods.filter(n => {
    return n.city === selectedCity || normalizeCity(n.city) === normalizeCity(selectedCity);
  });
  
  // Ensure active neighborhood always belongs to the currently filtered city!
  const activeNeighborhood = 
    filteredNeighborhoods.find(n => n.id === selectedNeighborhoodId) || 
    filteredNeighborhoods[0] || 
    neighborhoods[0];

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const firstInCity = neighborhoods.find(n => n.city === city || normalizeCity(n.city) === normalizeCity(city));
    if (firstInCity) {
      setSelectedNeighborhoodId(firstInCity.id);
    }
  };

  const neighborhoodUnits = units.filter(u => {
    const uDist = u.district.toLowerCase();
    const nDist = activeNeighborhood.district.toLowerCase();
    return uDist.includes(nDist) || nDist.includes(uDist);
  });

  const renderVerificationBadge = (level?: string) => {
    switch (level) {
      case 'full_ownership_verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E8F8EC] border border-[#9FE870] text-[#163300] text-[11px] font-bold backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870] shrink-0" />
            <span>✓✓ Sổ Đỏ & Ảnh Thật</span>
          </span>
        );
      case 'id_verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBF2FF] border border-[#2570EB] text-[#2570EB] text-[11px] font-bold backdrop-blur-md shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2570EB] shrink-0" />
            <span>✓ Xác Minh CCCD</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F2F5F0] border border-slate-200 text-slate-500 text-[11px] font-medium">
            <span>Chờ Xác Minh</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pt-2 pb-16 animate-in fade-in duration-300 text-left">
      {/* Header Banner - Wise Signature Style */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] font-bold text-xs uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
            <span>Cẩm Nang Khu Vực & Điểm Đến Đô Thị</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-white mt-1">
            Khám Phá Phong Cách Sống, Tiện Ích & Giá Thuê Từng Quận
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Tổng hợp dữ liệu giá thị trường, chỉ số an ninh, nguy cơ ngập lụt và khoảng cách trường học/bệnh viện trước khi chọn nơi an cư hoàn hảo.
          </p>
        </div>

        {/* City Filter Pills - Wise Pill Tabs */}
        <div className="wise-pill-tabs flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cityOptions.map(c => (
            <button
              key={c.id}
              onClick={() => handleCityChange(c.id)}
              className={`wise-pill-tab ${selectedCity === c.id ? 'wise-pill-tab-active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* District Selector Cards Carousel - Wise Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredNeighborhoods.map((nh) => {
          const isSelected = nh.id === activeNeighborhood.id;
          return (
            <button
              key={nh.id}
              onClick={() => setSelectedNeighborhoodId(nh.id)}
              className={`text-left transition-all duration-200 cursor-pointer rounded-[20px] p-4 border shadow-sm ${
                isSelected 
                  ? 'bg-[#E8F8EC] dark:bg-emerald-950/40 border-2 border-[#163300] dark:border-[#9FE870] dark:border-[#9FE870] text-[#163300] dark:text-[#9FE870] -translate-y-1 shadow-sm' 
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#163300] dark:border-[#9FE870] hover:-translate-y-0.5'
              }`}
            >
              <div className="flex flex-col justify-between h-full gap-2">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isSelected ? 'text-[#163300] dark:text-[#9FE870]' : 'text-slate-400'
                  }`}>
                    {normalizeCity(nh.city)}
                  </span>
                  <h4 className={`font-bold text-sm line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-[#163300] dark:text-white' : 'text-[#163300] dark:text-white'
                  }`}>
                    {nh.district}
                  </h4>
                </div>
                <div className={`text-xs pt-2 border-t flex items-center justify-between ${
                  isSelected ? 'border-[#163300] dark:border-[#9FE870]/20 dark:border-[#9FE870]/20' : 'border-slate-100 dark:border-slate-800'
                }`}>
                  <span className={isSelected ? 'text-[#163300]/70 dark:text-slate-400' : 'text-slate-400'}>TB:</span>
                  <span className={`font-bold ${isSelected ? 'text-[#163300] dark:text-[#9FE870]' : 'text-[#163300] dark:text-[#9FE870]'}`}>
                    {(nh.averageRentVND / 1000000).toFixed(0)} Triệu
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Neighborhood Deep-Dive Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Image & Story Highlights */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-[380px] rounded-[28px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900">
            <img
              src={activeNeighborhood.coverImage}
              alt={activeNeighborhood.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                {activeNeighborhood.lifestyleTags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/90 text-[#163300] text-xs font-bold backdrop-blur-md shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                {activeNeighborhood.name}
              </h2>
              <p className="text-sm text-white/90 font-medium leading-relaxed line-clamp-2 drop-shadow-sm">
                {activeNeighborhood.description}
              </p>
            </div>
          </div>

          {/* Highlights Checklist */}
          <div className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#163300] dark:text-[#9FE870] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Điểm Nổi Bật Của Khu Vực Này</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {activeNeighborhood.highlights.map((hl, idx) => (
                <div key={idx} className="p-3.5 rounded-[18px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs text-[#163300] dark:text-slate-200 font-semibold leading-relaxed">
                  ✓ {hl}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Data Metrics & Search Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#163300] dark:text-white">
              Chỉ Số Đời Sống {activeNeighborhood.district}
            </h3>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              {/* Metric Card 1: Rent Price */}
              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 space-y-1 border-l-4 border-l-[#9FE870]">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Giá Thuê Trung Bình</span>
                <p className="text-[#163300] dark:text-[#9FE870] text-xl font-bold">
                  {(activeNeighborhood.averageRentVND / 1000000).toFixed(0)} Triệu <span className="text-xs text-slate-500 font-normal">/th</span>
                </p>
                <span className="text-[11px] text-[#163300] dark:text-[#9FE870] flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3 h-3" /> +{activeNeighborhood.priceTrendPercent}% theo năm
                </span>
              </div>

              {/* Metric Card 2: Security */}
              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 space-y-1 border-l-4 border-l-[#2570EB]">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Điểm An Ninh Trật Tự</span>
                <p className="text-[#2570EB] dark:text-blue-400 text-xl font-bold">
                  {activeNeighborhood.securityScore} / 10
                </p>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3 text-[#2570EB]" /> Camera AI đô thị
                </span>
              </div>

              {/* Metric Card 3: Flood Risk */}
              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 space-y-1 border-l-4 border-l-[#FFC83B]">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Rủi Ro Ngập Mùa Mưa</span>
                <p className={`text-sm font-bold ${
                  activeNeighborhood.floodRiskLevel === 'Low' ? 'text-[#163300] dark:text-[#9FE870]' : 'text-[#9A6700]'
                }`}>
                  {activeNeighborhood.floodRiskLevel === 'Low' ? 'Thấp (Cao ráo)' : 'Trung bình (Đọng nước)'}
                </p>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <CloudRain className="w-3 h-3 text-[#FFC83B]" /> Dữ liệu UDI Maps
                </span>
              </div>

              {/* Metric Card 4: Schools & Hospitals */}
              <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 space-y-1 border-l-4 border-l-[#FF5436]">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Trường Học & Bệnh Viện</span>
                <p className="text-[#D92D20] dark:text-[#FF5436] text-sm font-bold">
                  {activeNeighborhood.schoolsCount} Trường • {activeNeighborhood.hospitalsCount} BV
                </p>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <GraduationCap className="w-3 h-3 text-[#FF5436]" /> Bán kính 1.5km
                </span>
              </div>
            </div>

            {activeNeighborhood.metroDistanceKm && (
              <div className="p-4 rounded-[20px] bg-[#EBF2FF] dark:bg-slate-800 border border-[#2570EB]/30 text-xs text-[#2570EB] dark:text-blue-300 flex items-center gap-2 font-bold shadow-sm">
                <Train className="w-4 h-4 text-[#2570EB] shrink-0" />
                <span>Cách ga Metro tuyến số 1 khoảng {activeNeighborhood.metroDistanceKm} km.</span>
              </div>
            )}

            <button
              onClick={() => onNavigateSearchDistrict(activeNeighborhood.district)}
              className="w-full py-3.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Xem Toàn Bộ Căn Hộ Tại {activeNeighborhood.district}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Units in this Neighborhood - Wise Clean Cards */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
          <span>Căn Hộ Đang Cho Thuê Tại {activeNeighborhood.district} ({neighborhoodUnits.length})</span>
        </div>

        {neighborhoodUnits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoodUnits.map(unit => {
              const trueCostTotal = unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND;
              const extraFees = trueCostTotal - unit.monthlyRentVND;

              return (
                <div
                  key={unit.id}
                  onClick={() => onSelectUnit(unit.id)}
                  className="group rounded-[24px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#163300]/40 dark:hover:border-[#9FE870]/40 transition-all duration-300 ease-out shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <SmartImage
                      src={unit.images[0]}
                      alt={unit.name || unit.id}
                      width={600}
                      quality={80}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        {renderVerificationBadge(unit.verificationLevel)}
                        {unit.pcccReport?.inspectionCertificateStatus === 'certified' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FEECEB] border border-[#FF5436] text-[#D92D20] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                            <Flame className="w-3 h-3 text-[#FF5436]" /> PCCC ✓
                          </span>
                        )}
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[#163300] text-xs font-bold flex items-center gap-0.5 shadow-sm">
                        <Star className="w-3 h-3 fill-[#FFC83B] text-[#FFC83B]" />
                        <span>{unit.landlord?.trustScore || 4.9}★</span>
                      </span>
                    </div>

                    {/* Location Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white pointer-events-none">
                      <span className="flex items-center gap-1 text-[11px] truncate max-w-[70%] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#9FE870] shrink-0" />
                        <span className="truncate">{unit.district}, {normalizeCity(unit.city)}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white">
                        Tầng {unit.floor}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-base text-[#163300] dark:text-white group-hover:text-[#163300] dark:text-[#9FE870] transition-colors line-clamp-1">
                        {unit.name || unit.id}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{unit.bedrooms} PN</span>
                        <span>•</span>
                        <span>{unit.bathrooms} WC</span>
                        <span>•</span>
                        <span>{unit.sqm} m²</span>
                      </div>
                    </div>

                    {/* True Cost Breakdown */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-[#163300] dark:text-[#9FE870]">
                            {(trueCostTotal / 1000000).toFixed(1)} Tr
                          </span>
                          <span className="text-xs text-slate-500">/tháng</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Gốc: {(unit.monthlyRentVND / 1000000).toFixed(0)}Tr (+{(extraFees / 1000000).toFixed(1)}Tr phí)
                        </div>
                      </div>

                      <div className="px-3.5 py-1.5 rounded-full bg-[#F2F5F0] group-hover:bg-[#9FE870] text-[#163300] text-xs font-bold transition-all flex items-center gap-1">
                        <span>Xem</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Chưa có căn hộ nào mở thuê tại quận này.</p>
          </div>
        )}
      </div>
    </div>
  );
};
