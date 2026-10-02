import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  CloudRain, 
  MapPin, 
  GraduationCap, 
  Building2, 
  Layers, 
  ArrowRight,
  Zap
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';

interface ConfidenceMapViewProps {
  units: ApartmentUnit[];
  onSelectUnit: (unitId: string) => void;
  onBackToDirectory?: () => void;
}

interface MapLayerState {
  floodRisk: boolean;
  pcccSafety: boolean;
  amenities: boolean;
  transitEv: boolean;
}

export const ConfidenceMapView: React.FC<ConfidenceMapViewProps> = ({
  units,
  onSelectUnit,
  onBackToDirectory
}) => {
  const cities = useMemo(() => {
    const set = new Set<string>();
    units.forEach(u => { if (u.city) set.add(u.city); });
    return ['All', ...Array.from(set)];
  }, [units]);

  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [activeLayers, setActiveLayers] = useState<MapLayerState>({
    floodRisk: true,
    pcccSafety: true,
    amenities: true,
    transitEv: false
  });
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(units[0]?.id || null);

  const toggleLayer = (key: keyof MapLayerState) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredUnits = useMemo(() => {
    if (selectedCity === 'All') return units;
    return units.filter(u => u.city === selectedCity);
  }, [units, selectedCity]);

  const activeUnit = useMemo(() => {
    return units.find(u => u.id === selectedUnitId) || filteredUnits[0] || units[0];
  }, [units, selectedUnitId, filteredUnits]);

  const getCityName = (city: string) => {
    switch (city) {
      case 'Hanoi': return 'Hà Nội';
      case 'Ho Chi Minh City': return 'TP. Hồ Chí Minh';
      case 'Da Nang': return 'Đà Nẵng';
      case 'Hai Phong': return 'Hải Phòng';
      case 'Nha Trang': return 'Nha Trang';
      case 'Can Tho': return 'Cần Thơ';
      case 'Binh Duong': return 'Bình Dương';
      case 'Vung Tau': return 'Vũng Tàu';
      case 'Ha Long': return 'Hạ Long';
      case 'Da Lat': return 'Đà Lạt';
      case 'Hue': return 'Huế';
      case 'Quy Nhon': return 'Quy Nhơn';
      default: return city;
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#20A05A] uppercase tracking-wider font-extrabold">
            <Layers className="w-4 h-4 text-[#20A05A]" />
            <span>Bản Đồ PCCC & Ngập Lụt Đa Lớp (Environmental & Fire Safety Map)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#163300] dark:text-white mt-1">
            Khảo Sát Rủi Ro Môi Trường & PCCC Trước Khi Cọc
          </h1>
          <p className="text-sm text-[#495E35] dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Tích hợp lớp dữ liệu thoát nước ngập lụt đô thị, hồ sơ thẩm duyệt PCCC và bán kính tiện ích trường học/bệnh viện.
          </p>
        </div>

        {onBackToDirectory && (
          <button
            onClick={onBackToDirectory}
            className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#163300] dark:text-white transition-all shadow-xs hover:border-[#163300] self-start md:self-auto cursor-pointer"
          >
            Quay lại tìm kiếm
          </button>
        )}
      </div>

      {/* Layer Controls & City Selector Toolbar */}
      <div className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* City Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#495E35] dark:text-slate-400 font-bold mr-1">Thành Phố:</span>
          {cities.slice(0, 8).map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                selectedCity === c
                  ? 'bg-[#9FE870] text-[#163300] border-[#9FE870] shadow-xs'
                  : 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#495E35] dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {c === 'All' ? 'Tất cả' : getCityName(c)}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#495E35] dark:text-slate-400 font-bold mr-1">Lớp Bản Đồ:</span>

          <button
            onClick={() => toggleLayer('floodRisk')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeLayers.floodRisk
                ? 'bg-[#E8F8EC] border-[#20A05A]/40 text-[#163300] dark:text-[#9FE870] shadow-xs'
                : 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#495E35] dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-500" />
            <span>Rủi Ro Ngập Lụt</span>
            {activeLayers.floodRisk && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 ml-0.5" />}
          </button>

          <button
            onClick={() => toggleLayer('pcccSafety')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeLayers.pcccSafety
                ? 'bg-[#FFEAE5] border-[#FF5436]/40 text-[#8C1F08] dark:text-rose-300 shadow-xs'
                : 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#495E35] dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#FF5436]" />
            <span>Kiểm Định PCCC</span>
            {activeLayers.pcccSafety && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5436] ml-0.5" />}
          </button>

          <button
            onClick={() => toggleLayer('amenities')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeLayers.amenities
                ? 'bg-purple-100 border-purple-300 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 shadow-xs'
                : 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#495E35] dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
            <span>Trường Học & Bệnh Viện</span>
            {activeLayers.amenities && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Map View Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[560px] rounded-3xl overflow-hidden border border-emerald-500/30 bg-slate-950 shadow-2xl">
            {/* Background Styled Map Canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-[#0B0C0E]">
              {/* Decorative grid pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#6366f1 1px, transparent 1px)`,
                  backgroundSize: '32px 32px',
                  backgroundPosition: '0 0, 16px 16px'
                }}
              />
              
              {/* Simulated River / Geographical Elements */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path 
                  d="M0,280 Q200,320 400,240 T800,300" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="28" 
                  strokeLinecap="round" 
                />
                <text x="320" y="270" fill="#38bdf8" fontSize="11" fontFamily="monospace" opacity="0.8">
                  Dòng Sông / Kênh Thoát Nước Đô Thị
                </text>
              </svg>

              {/* Active Flood Zones Overlay */}
              {activeLayers.floodRisk && (
                <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-300">
                  <div className="absolute top-[40%] left-[60%] w-36 h-28 rounded-full bg-sky-500/15 border-2 border-dashed border-sky-400/40 blur-[1px] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 bg-white/90 dark:bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-sky-300 dark:border-sky-500/30 shadow-xs">
                      Khu Vực Ngập Triều Cường (0.3m)
                    </span>
                  </div>
                  <div className="absolute bottom-[20%] left-[20%] w-44 h-32 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 bg-white/90 dark:bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-sky-300 dark:border-sky-500/30 shadow-xs">
                      Điểm Trũng Cần Lưu Ý
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Pins for Units */}
            <div className="absolute inset-0 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center justify-items-center pointer-events-auto overflow-y-auto max-h-[460px]">
              {filteredUnits.slice(0, 6).map((unit) => {
                const isSelected = unit.id === selectedUnitId;
                const trueCostM = (unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND) / 1000000;
                
                return (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`w-full max-w-[220px] p-[2px] rounded-2xl transition-all duration-300 relative overflow-hidden group shadow-xl hover:scale-105 active:scale-95 text-left ${
                      isSelected ? 'z-20 scale-105 ring-1 ring-emerald-400/50' : 'z-10'
                    }`}
                  >
                    {/* Pure 2px running border beam - strictly on border, NO face light */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <div
                        className={`animate-spin-beam pointer-events-none transition-opacity duration-300 ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>

                    <div className={`relative z-10 w-full h-full p-2.5 rounded-[14px] flex items-center gap-2.5 bg-[#0B101B] [data-theme='light']_:bg-white border ${
                      isSelected
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'border-slate-800 [data-theme="light"]_:border-slate-300 group-hover:border-emerald-500/40'
                    }`}>
                      <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                        unit.pcccReport?.inspectionCertificateStatus === 'certified'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#163300] dark:text-white truncate">
                            {unit.name || unit.id}
                          </span>
                          {unit.floodingRisk === 'Low' && activeLayers.floodRisk && (
                            <span className="w-2 h-2 rounded-full bg-[#20A05A] shrink-0" title="Không ngập" />
                          )}
                        </div>
                        <div className="text-[11px] font-black text-[#163300] dark:text-[#9FE870] tabular-nums">
                          {trueCostM.toFixed(1)} Tr/tháng
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend Overlay (Bottom Left) */}
            <div className="absolute bottom-4 left-4 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-[11px] space-y-1.5 shadow-sm">
              <span className="text-[#163300] dark:text-white font-black uppercase text-[10px] block">Chú Giải Lớp An Tâm:</span>
              <div className="flex items-center gap-2 text-[#20A05A] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#20A05A]" />
                <span>Địa hình cao ráo, PCCC nghiệm thu ✓</span>
              </div>
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Vùng thoát nước kênh rạch</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Khu vực mật độ giao thông cao</span>
              </div>
            </div>

            {/* Official Source Badge (Bottom Right) */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-[#495E35] dark:text-emerald-300 font-bold shadow-xs">
              Tham chiếu dữ liệu: UDI Maps & Cục PCCC
            </div>
          </div>
        </div>

        {/* Right Selected Unit Deep-Dive Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {activeUnit ? (
            <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
              {/* Unit Title & District */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] text-[10px] font-bold">
                    ✓ Verified Sanctuary Căn Hộ
                  </span>
                  <span className="text-xs text-[#738565] dark:text-slate-400 font-bold">
                    {getCityName(activeUnit.city)}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#163300] dark:text-white">
                  {activeUnit.name || activeUnit.id}
                </h3>
                <p className="text-xs text-[#738565] dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#20A05A] shrink-0" />
                  <span>{activeUnit.address || `${activeUnit.district}, ${getCityName(activeUnit.city)}`}</span>
                </p>
              </div>

              {/* True Cost vs Rent Bar - Clear & Uncrowded */}
              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="text-xs text-[#738565] dark:text-slate-400 font-bold">Tổng Chi Phí Hàng Tháng:</span>
                  <span className="text-2xl font-black text-[#163300] dark:text-[#9FE870] tabular-nums">
                    {((activeUnit.trueCost?.totalMonthlyEstimatedVND || activeUnit.monthlyRentVND) / 1000000).toFixed(1)} Triệu/tháng
                  </span>
                </div>
                <div className="text-[11px] text-[#738565] dark:text-slate-400 leading-normal pt-1.5 border-t border-slate-200 dark:border-slate-700 font-medium">
                  Giá gốc: {(activeUnit.monthlyRentVND / 1000000).toFixed(0)} Tr · Phí DV & điện nước: ~{(((activeUnit.trueCost?.totalMonthlyEstimatedVND || activeUnit.monthlyRentVND) - activeUnit.monthlyRentVND) / 1000000).toFixed(1)} Tr
                </div>
              </div>

              {/* Confidence Environmental Specs */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-[#495E35] dark:text-slate-400 font-bold">
                  Chỉ Số An Toàn Môi Trường:
                </h4>

                {/* Flood Risk */}
                <div className="p-3.5 rounded-2xl bg-[#F9FAF8] dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3 text-xs">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    activeUnit.floodingRisk === 'Low' ? 'bg-[#E8F8EC] text-[#20A05A]' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#163300] dark:text-white">
                      Rủi ro ngập: {activeUnit.floodingRisk === 'Low' ? 'Thấp (Cao ráo)' : 'Trung bình (Đọng nước tạm thời)'}
                    </span>
                    <p className="text-[#738565] dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed font-medium">
                      {activeUnit.environmentalData.floodNotes}
                    </p>
                  </div>
                </div>

                {/* PCCC Inspection */}
                <div className="p-3.5 rounded-2xl bg-[#F9FAF8] dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3 text-xs">
                  <div className="p-2 rounded-xl bg-[#FFEAE5] text-[#FF5436] shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#163300] dark:text-white">
                      PCCC: {activeUnit.pcccReport?.fireEscapeCount || 2} Thang thoát hiểm điều áp
                    </span>
                    <p className="text-[#738565] dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed font-medium">
                      Đầu phun Sprinkler tự động & cảm biến khói đã nghiệm thu đạt chuẩn QCVN 06:2022.
                    </p>
                  </div>
                </div>

                {/* Backup Power */}
                <div className="p-3.5 rounded-2xl bg-[#F9FAF8] dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3 text-xs">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#163300] dark:text-white">
                      Điện dự phòng: {activeUnit.hasBackupPower ? 'Máy phát 100% công suất' : 'Chiếu sáng khẩn cấp'}
                    </span>
                    <p className="text-[#738565] dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed font-medium">
                      {activeUnit.environmentalData.powerNotes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectUnit(activeUnit.id)}
                className="w-full py-3.5 rounded-full bg-[#163300] hover:bg-[#223D0D] text-white font-black text-xs transition-all shadow-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Xem Hồ Sơ Kiểm Định Chi Tiết Căn Hộ Này</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-sm">
              <p className="text-xs text-[#738565] dark:text-slate-400 font-bold">Chọn một căn hộ trên bản đồ để xem báo cáo an tâm.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
