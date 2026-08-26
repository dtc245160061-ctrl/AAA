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
  Search
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { ApartmentStore } from '../data/apartmentStore';

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
  const [selectedCity, setSelectedCity] = useState<'All' | 'Hanoi' | 'Ho Chi Minh City' | 'Da Nang'>('All');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>(neighborhoods[0].id);

  const filteredNeighborhoods = neighborhoods.filter(n => selectedCity === 'All' || n.city === selectedCity);
  const activeNeighborhood = neighborhoods.find(n => n.id === selectedNeighborhoodId) || filteredNeighborhoods[0] || neighborhoods[0];

  const neighborhoodUnits = units.filter(u => 
    u.district.toLowerCase().includes(activeNeighborhood.district.toLowerCase()) ||
    activeNeighborhood.district.toLowerCase().includes(u.district.toLowerCase())
  );

  return (
    <div className="space-y-8 pt-2 pb-16 animate-in fade-in duration-300">
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
        <div className="flex items-center gap-2">
          {(['All', 'Ho Chi Minh City', 'Hanoi', 'Da Nang'] as const).map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                selectedCity === city
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 [data-theme="light"]_:bg-white border border-slate-800 [data-theme="light"]_:border-slate-200 text-slate-400 [data-theme="light"]_:text-slate-700 hover:text-emerald-400'
              }`}
            >
              {city === 'All' ? 'Tất cả' : city === 'Ho Chi Minh City' ? 'TP.HCM' : city === 'Hanoi' ? 'Hà Nội' : 'Đà Nẵng'}
            </button>
          ))}
        </div>
      </div>

      {/* District Selector Cards Carousel (Generous Padding & Ocean Blue Focus) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {filteredNeighborhoods.map((nh) => {
          const isSelected = nh.id === activeNeighborhood.id;
          return (
            <button
              key={nh.id}
              onClick={() => setSelectedNeighborhoodId(nh.id)}
              className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between gap-3 shadow-md hover:-translate-y-1 ${
                isSelected
                  ? 'bg-sky-950/80 [data-theme=\'light\']_:bg-sky-100 border-sky-400 [data-theme=\'light\']_:border-sky-500 ring-2 ring-sky-500/30 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/80 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 hover:border-sky-500/40'
              }`}
            >
              <div>
                <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                  isSelected 
                    ? 'text-sky-300 [data-theme=\'light\']_:text-sky-800' 
                    : 'text-slate-400 [data-theme=\'light\']_:text-slate-500'
                }`}>
                  {nh.city === 'Hanoi' ? 'Hà Nội' : nh.city === 'Ho Chi Minh City' ? 'TP.HCM' : 'Đà Nẵng'}
                </span>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-100 [data-theme='light']_:text-slate-900 line-clamp-1 mt-1">
                  {nh.district}
                </h4>
              </div>
              <div className="text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-600 pt-1 border-t border-slate-800/60 [data-theme='light']_:border-slate-100">
                TB: <span className={`font-bold ${isSelected ? 'text-sky-400 [data-theme=\'light\']_:text-sky-700' : 'text-emerald-400 [data-theme=\'light\']_:text-emerald-700'}`}>{(nh.averageRentVND / 1000000).toFixed(0)} Tr</span>
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

        {/* Right 5 Cols: Data Metrics & Search Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl liquid-glass-origin border border-emerald-500/30 space-y-5 shadow-2xl backdrop-blur-2xl">
            <h3 className="font-serif text-xl font-bold text-slate-100 [data-theme='light']_:text-slate-900">
              Chỉ Số Đời Sống {activeNeighborhood.district}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900/80 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Giá Thuê Trung Bình</span>
                <p className="text-emerald-400 [data-theme='light']_:text-emerald-700 font-serif text-lg font-bold">
                  {(activeNeighborhood.averageRentVND / 1000000).toFixed(0)} Triệu <span className="text-[10px] text-slate-400 font-sans">/th</span>
                </p>
                <span className="text-[10px] text-emerald-400 [data-theme='light']_:text-emerald-700 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> +{activeNeighborhood.priceTrendPercent}% theo năm
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Điểm An Ninh Trật Tự</span>
                <p className="text-emerald-300 [data-theme='light']_:text-emerald-700 font-serif text-lg font-bold">
                  {activeNeighborhood.securityScore} / 10
                </p>
                <span className="text-[10px] text-slate-400 [data-theme='light']_:text-slate-600 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Camera AI đô thị
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 space-y-1">
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

              <div className="p-3.5 rounded-xl bg-slate-900/80 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Trường Học & Bệnh Viện</span>
                <p className="text-slate-100 [data-theme='light']_:text-slate-900 font-serif text-sm font-bold">
                  {activeNeighborhood.schoolsCount} Trường • {activeNeighborhood.hospitalsCount} BV
                </p>
                <span className="text-[10px] text-slate-400 [data-theme='light']_:text-slate-600 flex items-center gap-1 font-medium">
                  <GraduationCap className="w-3 h-3 text-purple-400" /> Bán kính 1.5km
                </span>
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
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              <span>Xem Toàn Bộ Căn Hộ Tại {activeNeighborhood.district}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Units in this Neighborhood */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-slate-100 [data-theme='light']_:text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Căn Hộ Đang Cho Thuê Tại {activeNeighborhood.district} ({neighborhoodUnits.length})</span>
          </h3>
        </div>

        {neighborhoodUnits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoodUnits.map(unit => (
              <div
                key={unit.id}
                onClick={() => onSelectUnit(unit.id)}
                className="group rounded-3xl overflow-hidden border border-slate-800 [data-theme='light']_:border-slate-200 bg-slate-900/80 [data-theme='light']_:bg-white hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-xl hover:-translate-y-1"
              >
                {/* TALL IMAGE h-60 sm:h-64 */}
                <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-950">
                  <img
                    src={unit.images[0]}
                    alt={unit.name || unit.id}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold always-white always-dark">
                      ✓ Verified Cấp 3
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700 text-emerald-400 text-xs font-mono font-bold always-white always-dark">
                    {((unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND) / 1000000).toFixed(1)}Tr/tháng
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h4 className="font-serif font-bold text-slate-100 [data-theme='light']_:text-slate-900 line-clamp-1 group-hover:text-emerald-500 transition-colors text-base">
                    {unit.name || unit.id}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{unit.district}, {unit.city === 'Hanoi' ? 'Hà Nội' : unit.city === 'Ho Chi Minh City' ? 'TP.HCM' : 'Đà Nẵng'}</span>
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 [data-theme='light']_:text-slate-600 pt-2.5 border-t border-slate-800 [data-theme='light']_:border-slate-100">
                    <span>{unit.bedrooms} PN • {unit.sqm} m²</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      Chi tiết <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
