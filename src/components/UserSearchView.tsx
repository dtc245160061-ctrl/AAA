import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, MapPin, Grid, List, Check, Bookmark, AlertTriangle, ShieldCheck, Car, CloudRain, Zap, RefreshCw } from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { type ConsumerFilters, parseNaturalLanguageQuery, calculateMatchScore } from '../services/aiAdvisorService';

interface UserSearchViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
  initialAiQuery?: string;
}

export const UserSearchView: React.FC<UserSearchViewProps> = ({
  units,
  savedUnitIds,
  onToggleSaveUnit,
  onSelectUnit,
  initialAiQuery = ''
}) => {
  const [aiPromptInput, setAiPromptInput] = useState(initialAiQuery);
  const [aiUnderstoodText, setAiUnderstoodText] = useState<string | null>(null);
  const [aiFollowUp, setAiFollowUp] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter States
  const [cityFilter, setCityFilter] = useState<'All' | 'Hanoi' | 'Ho Chi Minh City' | 'Da Nang'>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [bedroomsFilter, setBedroomsFilter] = useState<number>(0);
  const [maxRentVND, setMaxRentVND] = useState<number>(450000000); // 450M max default
  const [carParkingOnly, setCarParkingOnly] = useState<boolean>(false);
  const [lowFloodOnly, setLowFloodOnly] = useState<boolean>(false);
  const [backupPowerOnly, setBackupPowerOnly] = useState<boolean>(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState<boolean>(false);

  // Process initial AI query on mount if passed
  useEffect(() => {
    if (initialAiQuery) {
      handleApplyAiPrompt(initialAiQuery);
    }
  }, [initialAiQuery]);

  const handleApplyAiPrompt = (promptText: string) => {
    if (!promptText.trim()) return;
    const parsed = parseNaturalLanguageQuery(promptText);
    setAiUnderstoodText(parsed.understoodText);
    setAiFollowUp(parsed.followUpQuestion || null);

    if (parsed.extractedFilters.city) {
      setCityFilter(parsed.extractedFilters.city);
    }
    if (parsed.extractedFilters.district) {
      setDistrictFilter(parsed.extractedFilters.district);
    }
    if (parsed.extractedFilters.minBedrooms) {
      setBedroomsFilter(parsed.extractedFilters.minBedrooms);
    }
    if (parsed.extractedFilters.maxRentVND) {
      setMaxRentVND(parsed.extractedFilters.maxRentVND);
    }
    if (parsed.extractedFilters.hasCarParking) {
      setCarParkingOnly(true);
    }
    if (parsed.extractedFilters.floodingRisk === 'Low') {
      setLowFloodOnly(true);
    }
    if (parsed.extractedFilters.hasBackupPower) {
      setBackupPowerOnly(true);
    }
    if (parsed.extractedFilters.petFriendly) {
      setPetFriendlyOnly(true);
    }
  };

  const handleAiFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyAiPrompt(aiPromptInput);
  };

  const activeFiltersObj: ConsumerFilters = useMemo(() => ({
    city: cityFilter,
    district: districtFilter || undefined,
    minBedrooms: bedroomsFilter || undefined,
    maxRentVND: maxRentVND < 450000000 ? maxRentVND : undefined,
    hasCarParking: carParkingOnly || undefined,
    floodingRisk: lowFloodOnly ? 'Low' : undefined,
    hasBackupPower: backupPowerOnly || undefined,
    petFriendly: petFriendlyOnly || undefined
  }), [cityFilter, districtFilter, bedroomsFilter, maxRentVND, carParkingOnly, lowFloodOnly, backupPowerOnly, petFriendlyOnly]);

  // Filtered and Scored units
  const filteredUnits = useMemo(() => {
    return units
      .map(unit => {
        const { score, matchReasons } = calculateMatchScore(unit, activeFiltersObj);
        return { unit, score, matchReasons };
      })
      .filter(item => {
        if (cityFilter !== 'All' && item.unit.city !== cityFilter) return false;
        if (districtFilter && !item.unit.district.toLowerCase().includes(districtFilter.toLowerCase())) return false;
        if (bedroomsFilter > 0 && item.unit.bedrooms < bedroomsFilter) return false;
        if (item.unit.monthlyRentVND > maxRentVND) return false;
        if (carParkingOnly && !item.unit.hasCarParking) return false;
        if (lowFloodOnly && item.unit.floodingRisk !== 'Low') return false;
        if (backupPowerOnly && !item.unit.hasBackupPower) return false;
        if (petFriendlyOnly && !item.unit.petFriendly) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score);
  }, [units, activeFiltersObj, cityFilter, districtFilter, bedroomsFilter, maxRentVND, carParkingOnly, lowFloodOnly, backupPowerOnly, petFriendlyOnly]);

  const handleResetFilters = () => {
    setCityFilter('All');
    setDistrictFilter('');
    setBedroomsFilter(0);
    setMaxRentVND(450000000);
    setCarParkingOnly(false);
    setLowFloodOnly(false);
    setBackupPowerOnly(false);
    setPetFriendlyOnly(false);
    setAiUnderstoodText(null);
    setAiFollowUp(null);
    setAiPromptInput('');
  };

  const getCityDisplayName = (city: string) => {
    switch (city) {
      case 'Hanoi': return 'Hà Nội';
      case 'Ho Chi Minh City': return 'TP. Hồ Chí Minh';
      case 'Da Nang': return 'Đà Nẵng';
      default: return city;
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Section: AI Natural Search Header */}
      <div className="p-6 md:p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-5 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Tìm Kiếm Bằng Ngôn Ngữ Tự Nhiên & Dữ Liệu Sống</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold">
              Khám Phá Kho Căn Hộ Tuyển Chọn ({units.length} Căn)
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl border transition-all ${
                viewMode === 'grid'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl border transition-all ${
                viewMode === 'list'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-rose-400 transition-all flex items-center gap-1 text-xs font-mono"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Đặt lại</span>
            </button>
          </div>
        </div>

        {/* AI Prompt Input Form */}
        <form onSubmit={handleAiFormSubmit} className="relative">
          <div className="relative flex items-center rounded-2xl bg-slate-950/80 border border-emerald-500/40 p-2 shadow-xl backdrop-blur-xl group focus-within:border-emerald-400 transition-all">
            <div className="pl-3 pr-2 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              placeholder='Ví dụ: "căn 2 phòng ngủ ở Tây Hồ tầm 20 củ, có chỗ đỗ ô tô, tầng cao yên tĩnh"'
              className="w-full bg-transparent border-none text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-0 pr-4 py-2 font-sans"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs font-mono transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              Phân Tích AI
            </button>
          </div>
        </form>

        {/* AI Parsed Understanding Alert Box */}
        {aiUnderstoodText && (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HAVEN AI đã phân tích nhu cầu:</span>
            </div>
            <p className="text-slate-200 font-sans leading-relaxed">
              {aiUnderstoodText}
            </p>
            {aiFollowUp && (
              <p className="text-emerald-300/90 font-mono text-[11px] pt-1">
                💡 Gợi ý thêm: {aiFollowUp}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Filter & Results Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-2xl atmospheric-panel border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="font-serif text-lg text-slate-100 flex items-center gap-2 font-bold">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>Bộ Lọc Tìm Kiếm</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-semibold">{filteredUnits.length} căn hộ</span>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Thành Phố</label>
              <div className="grid grid-cols-2 gap-2">
                {(['All', 'Hanoi', 'Ho Chi Minh City', 'Da Nang'] as const).map(c => {
                  const label = c === 'All' ? 'Tất cả' : c === 'Hanoi' ? 'Hà Nội' : c === 'Ho Chi Minh City' ? 'TP.HCM' : 'Đà Nẵng';
                  return (
                    <button
                      key={c}
                      onClick={() => setCityFilter(c)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border text-left truncate ${
                        cityFilter === c
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Số Phòng Ngủ</label>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map(b => (
                  <button
                    key={b}
                    onClick={() => setBedroomsFilter(b)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all border ${
                      bedroomsFilter === b
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {b === 0 ? 'Tất cả' : `${b}+ PN`}
                  </button>
                ))}
              </div>
            </div>

            {/* Maximum Rent VND Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Ngân Sách Tối Đa</span>
                <span className="text-emerald-500 font-bold">
                  {maxRentVND >= 450000000 ? 'Không giới hạn' : `${(maxRentVND / 1000000).toFixed(0)} Triệu/tháng`}
                </span>
              </div>
              <input
                type="range"
                min={8000000}
                max={450000000}
                step={2000000}
                value={maxRentVND}
                onChange={(e) => setMaxRentVND(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>8 Tr</span>
                <span>100 Tr</span>
                <span>450 Tr+</span>
              </div>
            </div>

            {/* Residential Features Toggles */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Tiêu Chuẩn Môi Trường</label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900/60 transition-colors">
                <span className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-sky-400" />
                  <span>Chỗ đỗ xe ô tô trong hầm</span>
                </span>
                <input
                  type="checkbox"
                  checked={carParkingOnly}
                  onChange={(e) => setCarParkingOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900/60 transition-colors">
                <span className="flex items-center gap-2">
                  <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Không lo ngập lụt mùa mưa</span>
                </span>
                <input
                  type="checkbox"
                  checked={lowFloodOnly}
                  onChange={(e) => setLowFloodOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900/60 transition-colors">
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Máy phát điện dự phòng 100%</span>
                </span>
                <input
                  type="checkbox"
                  checked={backupPowerOnly}
                  onChange={(e) => setBackupPowerOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900/60 transition-colors">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cho phép nuôi thú cưng</span>
                </span>
                <input
                  type="checkbox"
                  checked={petFriendlyOnly}
                  onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Property Results Listing */}
        <div className="lg:col-span-3 space-y-6">
          {filteredUnits.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-800 atmospheric-panel space-y-4">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-xl font-serif text-slate-100 font-bold">Không Tìm Thấy Căn Hộ Khớp Chính Xác</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Hãy thử mở rộng khoảng ngân sách, chọn thêm thành phố hoặc dùng trợ lý AI để đề xuất lựa chọn thay thế phù hợp.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-medium hover:bg-emerald-400 transition-colors"
              >
                Đặt Lại Toàn Bộ Bộ Lọc
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredUnits.map(({ unit, score, matchReasons }) => {
                const isSaved = savedUnitIds.includes(unit.id);
                return (
                  <div
                    key={unit.id}
                    className={`group product-ui-card rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col justify-between'
                    }`}
                  >
                    {/* Image Area */}
                    <div
                      className={`relative bg-slate-900 cursor-pointer overflow-hidden ${
                        viewMode === 'list' ? 'sm:w-64 h-56 shrink-0' : 'h-56'
                      }`}
                      onClick={() => onSelectUnit(unit.id)}
                    >
                      <img
                        src={unit.images[0]}
                        alt={unit.name || unit.id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium always-white">
                          {score}% Tương thích
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveUnit(unit.id);
                          }}
                          className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                            isSaved
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'bg-slate-950/60 border-slate-700 text-slate-200 hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-200 always-white">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {unit.district}, {getCityDisplayName(unit.city)}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700">
                          Tầng {unit.floor}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                        <h3 className="font-serif text-lg text-slate-100 group-hover:text-emerald-500 transition-colors line-clamp-1 font-semibold">
                          {unit.name || unit.id}
                        </h3>

                        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                          <span>{unit.bedrooms} Phòng ngủ</span>
                          <span>•</span>
                          <span>{unit.bathrooms} WC</span>
                          <span>•</span>
                          <span>{unit.sqm} m²</span>
                        </div>
                      </div>

                      {/* AI Match Reasons */}
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                        <span className="text-[11px] font-mono text-emerald-500 uppercase tracking-wider font-semibold">
                          Điểm Khớp Với Tiêu Chí:
                        </span>
                        <ul className="space-y-1 text-slate-300 font-sans">
                          {matchReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <div className="text-lg font-serif font-bold text-emerald-500">
                            {(unit.monthlyRentVND / 1000000).toFixed(0)} Triệu
                            <span className="text-xs text-slate-400 font-sans font-normal"> /tháng</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            Giá thuê niêm yết
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectUnit(unit.id)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-mono transition-all duration-200 font-medium"
                        >
                          Xem Chi Tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
