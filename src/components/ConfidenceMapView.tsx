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
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Bản Đồ PCCC & Ngập Lụt Đa Lớp (Environmental & Fire Safety Map)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-100 font-bold mt-1">
            Khảo Sát Rủi Ro Môi Trường & PCCC Trước Khi Cọc
          </h1>
          <p className="text-sm font-sans text-slate-400 mt-1 max-w-2xl">
            Tích hợp lớp dữ liệu thoát nước ngập lụt đô thị, hồ sơ thẩm duyệt PCCC và bán kính tiện ích trường học/bệnh viện.
          </p>
        </div>

        {onBackToDirectory && (
          <button
            onClick={onBackToDirectory}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-colors self-start md:self-auto"
          >
            Quay lại tìm kiếm
          </button>
        )}
      </div>

      {/* Layer Controls & City Selector Toolbar */}
      <div className="p-5 rounded-2xl atmospheric-panel border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* City Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-700 font-bold mr-1">Thành Phố:</span>
          {cities.slice(0, 8).map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedCity === c
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 [data-theme=\'light\']_:bg-white border border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-700 hover:text-emerald-400'
              }`}
            >
              {c === 'All' ? 'Tất cả' : getCityName(c)}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-700 font-bold mr-1">Lớp Bản Đồ:</span>

          <button
            onClick={() => toggleLayer('floodRisk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
              activeLayers.floodRisk
                ? 'bg-sky-950/80 [data-theme=\'light\']_:bg-sky-100 border-sky-400 [data-theme=\'light\']_:border-sky-500 text-sky-300 [data-theme=\'light\']_:text-sky-900 font-bold shadow-md'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-500 [data-theme=\'light\']_:text-slate-600'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rủi Ro Ngập Lụt</span>
            {activeLayers.floodRisk && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 ml-0.5" />}
          </button>

          <button
            onClick={() => toggleLayer('pcccSafety')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
              activeLayers.pcccSafety
                ? 'bg-rose-950/80 [data-theme=\'light\']_:bg-rose-100 border-rose-400 [data-theme=\'light\']_:border-rose-500 text-rose-300 [data-theme=\'light\']_:text-rose-900 font-bold shadow-md'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-500 [data-theme=\'light\']_:text-slate-600'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Kiểm Định PCCC</span>
            {activeLayers.pcccSafety && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 ml-0.5" />}
          </button>

          <button
            onClick={() => toggleLayer('amenities')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
              activeLayers.amenities
                ? 'bg-purple-950/80 [data-theme=\'light\']_:bg-purple-100 border-purple-400 [data-theme=\'light\']_:border-purple-500 text-purple-300 [data-theme=\'light\']_:text-purple-900 font-bold shadow-md'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-500 [data-theme=\'light\']_:text-slate-600'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Trường Học & Bệnh Viện</span>
            {activeLayers.amenities && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 ml-0.5" />}
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
                    <span className="text-[10px] font-mono text-sky-300 bg-slate-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                      Khu Vực Ngập Triều Cường (0.3m)
                    </span>
                  </div>
                  <div className="absolute bottom-[20%] left-[20%] w-44 h-32 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-sky-300 bg-slate-950/80 px-2 py-0.5 rounded border border-sky-500/30">
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
                    className={`w-full max-w-[220px] p-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2.5 text-left shadow-2xl backdrop-blur-xl group hover:scale-105 active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-950/95 border-2 border-emerald-500 dark:border-emerald-400 ring-4 ring-emerald-500/30 z-20 shadow-emerald-500/20'
                        : 'bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 z-10'
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      unit.pcccReport?.inspectionCertificateStatus === 'certified'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400'
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-serif text-xs font-bold text-slate-950 dark:text-slate-100 truncate">
                          {unit.name || unit.id}
                        </span>
                        {unit.floodingRisk === 'Low' && activeLayers.floodRisk && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Không ngập" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {trueCostM.toFixed(1)}Tr/tháng
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend Overlay (Bottom Left) */}
            <div className="absolute bottom-4 left-4 p-3.5 rounded-2xl bg-white dark:bg-slate-950/90 border border-slate-300 dark:border-slate-800 text-[11px] font-mono space-y-1.5 backdrop-blur-md shadow-xl">
              <span className="text-slate-900 dark:text-slate-400 font-bold uppercase text-[10px] block">Chú Giải Lớp An Tâm:</span>
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Địa hình cao ráo, PCCC nghiệm thu ✓</span>
              </div>
              <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Vùng thoát nước kênh rạch</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Khu vực mật độ giao thông cao</span>
              </div>
            </div>

            {/* Official Source Badge (Bottom Right) */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-800 dark:text-emerald-400 backdrop-blur-md font-semibold">
              Tham chiếu dữ liệu: UDI Maps & Cục PCCC
            </div>
          </div>
        </div>

        {/* Right Selected Unit Deep-Dive Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {activeUnit ? (
            <div className="p-6 md:p-8 rounded-3xl liquid-glass-origin border border-emerald-500/40 space-y-6 shadow-2xl backdrop-blur-2xl">
              {/* Unit Title & District */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 [data-theme='light']_:bg-emerald-100 border border-emerald-400 [data-theme='light']_:border-emerald-500 text-emerald-300 [data-theme='light']_:text-emerald-900 text-[10px] font-mono font-bold">
                    ✓ Verified Sanctuary Căn Hộ
                  </span>
                  <span className="text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-600 font-bold">
                    {getCityName(activeUnit.city)}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-100 [data-theme='light']_:text-slate-900">
                  {activeUnit.name || activeUnit.id}
                </h3>
                <p className="text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{activeUnit.address || `${activeUnit.district}, ${getCityName(activeUnit.city)}`}</span>
                </p>
              </div>

              {/* True Cost vs Rent Bar - Clear & Uncrowded */}
              <div className="p-4 rounded-2xl bg-slate-900/80 [data-theme='light']_:bg-white border border-emerald-500/30 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-600">Tổng Chi Phí Hàng Tháng:</span>
                  <span className="text-xl font-serif font-bold text-emerald-400 [data-theme='light']_:text-emerald-700">
                    {((activeUnit.trueCost?.totalMonthlyEstimatedVND || activeUnit.monthlyRentVND) / 1000000).toFixed(1)} Triệu/tháng
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 [data-theme='light']_:text-slate-600 leading-normal pt-1.5 border-t border-slate-800/60 [data-theme='light']_:border-slate-100">
                  Giá gốc: {(activeUnit.monthlyRentVND / 1000000).toFixed(0)} Tr · Phí DV & điện nước: ~{(((activeUnit.trueCost?.totalMonthlyEstimatedVND || activeUnit.monthlyRentVND) - activeUnit.monthlyRentVND) / 1000000).toFixed(1)} Tr
                </div>
              </div>

              {/* Confidence Environmental Specs */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 [data-theme='light']_:text-slate-700 font-bold">
                  Chỉ Số An Toàn Môi Trường:
                </h4>

                {/* Flood Risk */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 flex items-start gap-3 text-xs">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    activeUnit.floodingRisk === 'Low' ? 'bg-emerald-500/20 text-emerald-400 [data-theme="light"]_:text-emerald-700' : 'bg-amber-500/20 text-amber-400 [data-theme="light"]_:text-amber-700'
                  }`}>
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-200 [data-theme='light']_:text-slate-900">
                      Rủi ro ngập: {activeUnit.floodingRisk === 'Low' ? 'Thấp (Cao ráo)' : 'Trung bình (Đọng nước tạm thời)'}
                    </span>
                    <p className="text-slate-400 [data-theme='light']_:text-slate-600 font-sans text-[11px] mt-0.5 leading-relaxed font-medium">
                      {activeUnit.environmentalData.floodNotes}
                    </p>
                  </div>
                </div>

                {/* PCCC Inspection */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 flex items-start gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 [data-theme='light']_:text-rose-700 shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-200 [data-theme='light']_:text-slate-900">
                      PCCC: {activeUnit.pcccReport?.fireEscapeCount || 2} Thang thoát hiểm điều áp
                    </span>
                    <p className="text-slate-400 [data-theme='light']_:text-slate-600 font-sans text-[11px] mt-0.5 leading-relaxed font-medium">
                      Đầu phun Sprinkler tự động & cảm biến khói đã nghiệm thu đạt chuẩn QCVN 06:2022.
                    </p>
                  </div>
                </div>

                {/* Backup Power */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 flex items-start gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 [data-theme='light']_:text-amber-700 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-200 [data-theme='light']_:text-slate-900">
                      Điện dự phòng: {activeUnit.hasBackupPower ? 'Máy phát 100% công suất' : 'Chiếu sáng khẩn cấp'}
                    </span>
                    <p className="text-slate-400 [data-theme='light']_:text-slate-600 font-sans text-[11px] mt-0.5 leading-relaxed font-medium">
                      {activeUnit.environmentalData.powerNotes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectUnit(activeUnit.id)}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Xem Hồ Sơ Kiểm Định Chi Tiết Căn Hộ Này</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-3xl atmospheric-panel border border-slate-800 text-center">
              <p className="text-xs font-mono text-slate-400">Chọn một căn hộ trên bản đồ để xem báo cáo an tâm.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
