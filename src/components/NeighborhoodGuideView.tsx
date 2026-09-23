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
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>('');

  const cityOptions = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Hanoi', label: 'Hà Nội' },
    { id: 'Ho Chi Minh City', label: 'TP.HCM' },
    { id: 'Da Nang', label: 'Đà Nẵng' },
    { id: 'Thái Nguyên', label: 'Thái Nguyên' },
    { id: 'Hải Phòng', label: 'Hải Phòng' },
    { id: 'Bình Dương', label: 'Bình Dương' },
  ];

  const filteredNeighborhoods = neighborhoods.filter(n => {
    if (selectedCity === 'All') return true;
    return n.city === selectedCity || normalizeCity(n.city) === normalizeCity(selectedCity);
  });
  
  // Ensure active neighborhood always belongs to the currently filtered city!
  const activeNeighborhood = 
    filteredNeighborhoods.find(n => n.id === selectedNeighborhoodId) || 
    filteredNeighborhoods[0] || 
    neighborhoods[0];

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const firstInCity = neighborhoods.find(n => city === 'All' || n.city === city || normalizeCity(n.city) === normalizeCity(city));
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold backdrop-blur-md shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>✓✓ Sổ Đỏ & Ảnh Thật</span>
          </span>
        );
      case 'id_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950/90 border border-sky-400 text-sky-300 text-[10px] font-mono font-bold backdrop-blur-md shadow-lg">
            <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
            <span>✓ Xác Minh CCCD</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-400 text-[10px] font-mono">
            <span>Chờ Xác Minh</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pt-2 pb-16 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 [data-theme='light']_:text-emerald-700 uppercase tracking-widest font-bold">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Cẩm Nang Khu Vực Đô Thị (Neighborhood Guide)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-100 [data-theme='light']_:text-slate-900 font-bold mt-1.5">
            Khám Phá Phong Cách Sống, Tiện Ích & Giá Thuê Từng Quận
          </h1>
          <p className="text-sm text-slate-400 [data-theme='light']_:text-slate-600 mt-1 max-w-2xl font-medium">
            Tổng hợp dữ liệu giá thị trường, chỉ số an ninh, nguy cơ ngập lụt và khoảng cách trường học/bệnh viện trước khi chọn nơi an cư.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {cityOptions.map(c => (
            <button
              key={c.id}
              onClick={() => handleCityChange(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
                selectedCity === c.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-700 hover:text-emerald-400'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* District Selector Cards Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredNeighborhoods.map((nh) => {
          const isSelected = nh.id === activeNeighborhood.id;
          return (
            <button
              key={nh.id}
              onClick={() => setSelectedNeighborhoodId(nh.id)}
              className="group relative rounded-2xl p-[2.5px] text-left transition-all duration-300 shadow-md hover:-translate-y-1 cursor-pointer"
            >
              {/* Dual Orbiting Running Laser Beam strictly confined to 2.5px border */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div
                  className={`animate-spin-beam pointer-events-none transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />
              </div>

              {/* Inner card */}
              <div className={`relative z-10 w-full h-full p-4 rounded-[13.5px] flex flex-col justify-between gap-3 border transition-all duration-200 atmospheric-panel ${
                isSelected 
                  ? 'ring-1 ring-emerald-400/60 shadow-lg shadow-emerald-500/20 border-emerald-500/50' 
                  : 'border-slate-800/80 light:border-slate-200 group-hover:border-emerald-500/40'
              }`}>
                <div>
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                    isSelected 
                      ? 'text-emerald-400' 
                      : 'text-slate-400 light:text-slate-600'
                  }`}>
                    {normalizeCity(nh.city)}
                  </span>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-slate-100 light:text-slate-900 line-clamp-1 mt-1">
                    {nh.district}
                  </h4>
                </div>
                <div className="text-xs font-mono text-slate-400 light:text-slate-600 pt-1 border-t border-slate-800/60 light:border-slate-200">
                  TB: <span className="font-bold text-emerald-400 light:text-emerald-700">{(nh.averageRentVND / 1000000).toFixed(0)} Tr</span>
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
          <div className="relative h-[380px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl always-dark">
            <img
              src={activeNeighborhood.coverImage}
              alt={activeNeighborhood.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                {activeNeighborhood.lifestyleTags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-950/90 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono font-bold backdrop-blur-md always-white shadow-md">
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-white font-bold always-white drop-shadow-md">
                {activeNeighborhood.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed line-clamp-2 always-white font-medium drop-shadow">
                {activeNeighborhood.description}
              </p>
            </div>
          </div>

          {/* Highlights Checklist (Compact & Sleek) */}
          <div className="p-5 rounded-3xl atmospheric-panel border border-slate-800 space-y-2.5 shadow-xl">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 [data-theme='light']_:text-slate-700 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Điểm Nổi Bật Của Khu Vực Này</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {activeNeighborhood.highlights.map((hl, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 [data-theme='light']_:bg-slate-50 border border-slate-800 [data-theme='light']_:border-slate-200 text-xs text-slate-200 [data-theme='light']_:text-slate-800 font-sans font-medium leading-relaxed">
                  ✓ {hl}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Data Metrics & Search Trigger (WITH LUMINOUS OUTER AURA) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="group relative rounded-3xl p-[2.5px] overflow-hidden shadow-2xl transition-all">
            {/* Dual Orbiting Running Laser Beam for the whole outer card */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="relative z-10 w-full h-full p-6 md:p-8 rounded-[22px] atmospheric-panel border border-emerald-500/40 space-y-5 shadow-2xl backdrop-blur-2xl">
              <h3 className="font-serif text-xl font-bold text-slate-100 [data-theme='light']_:text-slate-900">
                Chỉ Số Đời Sống {activeNeighborhood.district}
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                {/* Metric Card 1: Rent Price */}
                <div className="group/metric relative p-[2px] rounded-xl overflow-hidden cursor-default transition-all duration-200 hover:-translate-y-0.5">
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-0 group-hover/metric:opacity-100" />
                  </div>
                  <div className="relative z-10 w-full h-full p-3.5 rounded-[10px] bg-slate-900 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 space-y-1">
                    <span className="text-slate-500 uppercase text-[10px] font-bold">Giá Thuê Trung Bình</span>
                    <p className="text-emerald-400 [data-theme='light']_:text-emerald-700 font-serif text-lg font-bold">
                      {(activeNeighborhood.averageRentVND / 1000000).toFixed(0)} Triệu <span className="text-[10px] text-slate-400 font-sans">/th</span>
                    </p>
                    <span className="text-[10px] text-emerald-400 [data-theme='light']_:text-emerald-700 flex items-center gap-1 font-semibold">
                      <TrendingUp className="w-3 h-3" /> +{activeNeighborhood.priceTrendPercent}% theo năm
                    </span>
                  </div>
                </div>

                {/* Metric Card 2: Security */}
                <div className="group/metric relative p-[2px] rounded-xl overflow-hidden cursor-default transition-all duration-200 hover:-translate-y-0.5">
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-0 group-hover/metric:opacity-100" />
                  </div>
                  <div className="relative z-10 w-full h-full p-3.5 rounded-[10px] bg-slate-900 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 space-y-1">
                    <span className="text-slate-500 uppercase text-[10px] font-bold">Điểm An Ninh Trật Tự</span>
                    <p className="text-emerald-300 [data-theme='light']_:text-emerald-700 font-serif text-lg font-bold">
                      {activeNeighborhood.securityScore} / 10
                    </p>
                    <span className="text-[10px] text-slate-400 [data-theme='light']_:text-slate-600 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Camera AI đô thị
                    </span>
                  </div>
                </div>

                {/* Metric Card 3: Flood Risk */}
                <div className="group/metric relative p-[2px] rounded-xl overflow-hidden cursor-default transition-all duration-200 hover:-translate-y-0.5">
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-0 group-hover/metric:opacity-100" />
                  </div>
                  <div className="relative z-10 w-full h-full p-3.5 rounded-[10px] bg-slate-900 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 space-y-1">
                    <span className="text-slate-500 uppercase text-[10px] font-bold">Rủi Ro Ngập Mùa Mưa</span>
                    <p className={`font-serif text-sm font-bold ${
                      activeNeighborhood.floodRiskLevel === 'Low' ? 'text-emerald-400 [data-theme=\'light\']_:text-emerald-700' : 'text-amber-400 [data-theme=\'light\']_:text-amber-700'
                    }`}>
                      {activeNeighborhood.floodRiskLevel === 'Low' ? 'Thấp (Cao ráo)' : 'Trung bình (Đọng nước)'}
                    </p>
                    <span className="text-[10px] text-slate-400 [data-theme='light']_:text-slate-600 flex items-center gap-1 font-medium">
                      <CloudRain className="w-3 h-3 text-sky-400" /> Dữ liệu UDI Maps
                    </span>
                  </div>
                </div>

                {/* Metric Card 4: Schools & Hospitals */}
                <div className="group/metric relative p-[2px] rounded-xl overflow-hidden cursor-default transition-all duration-200 hover:-translate-y-0.5">
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-0 group-hover/metric:opacity-100" />
                  </div>
                  <div className="relative z-10 w-full h-full p-3.5 rounded-[10px] bg-slate-900 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 space-y-1">
                    <span className="text-slate-500 uppercase text-[10px] font-bold">Trường Học & Bệnh Viện</span>
                    <p className="text-slate-100 [data-theme='light']_:text-slate-900 font-serif text-sm font-bold">
                      {activeNeighborhood.schoolsCount} Trường • {activeNeighborhood.hospitalsCount} BV
                    </p>
                    <span className="text-[10px] text-slate-400 [data-theme='light']_:text-slate-600 flex items-center gap-1 font-medium">
                      <GraduationCap className="w-3 h-3 text-purple-400" /> Bán kính 1.5km
                    </span>
                  </div>
                </div>
              </div>

              {activeNeighborhood.metroDistanceKm && (
                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-500/30 text-xs font-mono text-sky-950 dark:text-sky-200 flex items-center gap-2 font-bold shadow-sm">
                  <Train className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>Cách ga Metro tuyến số 1 khoảng {activeNeighborhood.metroDistanceKm} km.</span>
                </div>
              )}

              <button
                onClick={() => onNavigateSearchDistrict(activeNeighborhood.district)}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Xem Toàn Bộ Căn Hộ Tại {activeNeighborhood.district}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Units in this Neighborhood (STANDARDIZED ARCHITECTURAL 3:4 CARDS) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
          <Building2 className="w-4 h-4" />
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
                  className="group relative rounded-3xl p-[2.5px] shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
                >
                  {/* Dynamic Orbiting Dual Laser Beam */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                  </div>

                  {/* Inner Container */}
                  <div className="relative z-10 w-full h-full rounded-[22px] overflow-hidden flex flex-col justify-between atmospheric-panel border border-slate-800/80 light:border-slate-200">
                    {/* TALL IMAGE h-64 sm:h-72 */}
                    <div
                      className="relative h-64 sm:h-72 bg-slate-900 cursor-pointer overflow-hidden rounded-t-[22.5px]"
                      onClick={() => onSelectUnit(unit.id)}
                    >
                      <img
                        src={unit.images[0]}
                        alt={unit.name || unit.id}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                      {/* Top Badges Overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                        <div className="flex flex-col gap-1.5 items-start pointer-events-auto">
                          {renderVerificationBadge(unit.verificationLevel)}
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold shadow-md always-white always-dark">
                            98% Khớp AI
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 pointer-events-auto">
                          <span className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-0.5 shadow-md always-white always-dark">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{unit.landlord?.trustScore || 4.8}★</span>
                          </span>
                        </div>
                      </div>

                      {/* Bottom Info Bar Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white always-white">
                        <span className="flex items-center gap-1.5 text-[11px] truncate max-w-[65%] font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{unit.district}, {normalizeCity(unit.city)}</span>
                        </span>
                        
                        <div className="flex items-center gap-1.5 text-[10px] shrink-0">
                          {unit.pcccReport?.inspectionCertificateStatus === 'certified' && (
                            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-0.5 always-white always-dark font-semibold">
                              <Flame className="w-2.5 h-2.5 text-rose-400" /> PCCC ✓
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-white/20 always-white always-dark">
                            Tầng {unit.floor}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                        <h3 className="font-serif text-lg font-bold text-slate-100 light:text-slate-900 hover:text-emerald-500 transition-colors line-clamp-1">
                          {unit.name || unit.id}
                        </h3>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 light:text-slate-600">
                          <span>{unit.bedrooms} PN</span>
                          <span>•</span>
                          <span>{unit.bathrooms} WC</span>
                          <span>•</span>
                          <span>{unit.sqm} m²</span>
                        </div>
                      </div>

                      {/* True Cost Breakdown vs Rent Pricing */}
                      <div className="pt-3 border-t border-slate-800/80 light:border-slate-200 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-xl font-serif font-bold text-emerald-400 light:text-emerald-700">
                              {(trueCostTotal / 1000000).toFixed(1)} Tr
                            </span>
                            <span className="text-xs text-slate-400 light:text-slate-600 font-mono">/tháng</span>
                          </div>
                          
                          <div className="text-[10px] font-mono text-slate-500 light:text-slate-400 truncate mt-0.5">
                            Gốc: {(unit.monthlyRentVND / 1000000).toFixed(0)}Tr (+{(extraFees / 1000000).toFixed(1)}Tr phí)
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectUnit(unit.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20"
                        >
                          <span>Chi Tiết</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl atmospheric-panel border border-slate-800 text-center">
            <p className="text-xs font-mono text-slate-400">Chưa có căn hộ nào mở thuê tại quận này.</p>
          </div>
        )}
      </div>
    </div>
  );
};
