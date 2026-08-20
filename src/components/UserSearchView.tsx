import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  MapPin, 
  Grid, 
  List, 
  Check, 
  Bookmark, 
  AlertTriangle, 
  ShieldCheck, 
  Car, 
  CloudRain, 
  Zap, 
  RefreshCw, 
  Calculator, 
  Flame, 
  Star, 
  CheckCircle2,
  X,
  Filter
} from 'lucide-react';
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
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Filter States
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [bedroomsFilter, setBedroomsFilter] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<'baseRent' | 'trueCost'>('trueCost');
  const [maxRentVND, setMaxRentVND] = useState<number>(450000000);
  const [maxTrueCostVND, setMaxTrueCostVND] = useState<number>(480000000);
  const [carParkingOnly, setCarParkingOnly] = useState<boolean>(false);
  const [lowFloodOnly, setLowFloodOnly] = useState<boolean>(false);
  const [backupPowerOnly, setBackupPowerOnly] = useState<boolean>(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState<boolean>(false);
  const [pcccCertifiedOnly, setPcccCertifiedOnly] = useState<boolean>(false);
  const [verifiedLandlordOnly, setVerifiedLandlordOnly] = useState<boolean>(false);

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
      setMaxTrueCostVND(Math.round(parsed.extractedFilters.maxRentVND * 1.15));
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

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (cityFilter !== 'All') count++;
    if (districtFilter) count++;
    if (bedroomsFilter > 0) count++;
    if (carParkingOnly) count++;
    if (lowFloodOnly) count++;
    if (backupPowerOnly) count++;
    if (petFriendlyOnly) count++;
    if (pcccCertifiedOnly) count++;
    if (verifiedLandlordOnly) count++;
    if (filterMode === 'trueCost' && maxTrueCostVND < 480000000) count++;
    if (filterMode === 'baseRent' && maxRentVND < 450000000) count++;
    return count;
  }, [cityFilter, districtFilter, bedroomsFilter, carParkingOnly, lowFloodOnly, backupPowerOnly, petFriendlyOnly, pcccCertifiedOnly, verifiedLandlordOnly, filterMode, maxTrueCostVND, maxRentVND]);

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
        
        // Filter by True Cost or Base Rent
        if (filterMode === 'trueCost') {
          const totalCost = item.unit.trueCost?.totalMonthlyEstimatedVND || item.unit.monthlyRentVND;
          if (totalCost > maxTrueCostVND) return false;
        } else {
          if (item.unit.monthlyRentVND > maxRentVND) return false;
        }

        if (carParkingOnly && !item.unit.hasCarParking) return false;
        if (lowFloodOnly && item.unit.floodingRisk !== 'Low') return false;
        if (backupPowerOnly && !item.unit.hasBackupPower) return false;
        if (petFriendlyOnly && !item.unit.petFriendly) return false;
        if (pcccCertifiedOnly && item.unit.pcccReport?.inspectionCertificateStatus !== 'certified') return false;
        if (verifiedLandlordOnly && item.unit.verificationLevel === 'unverified') return false;

        return true;
      })
      .sort((a, b) => b.score - a.score);
  }, [
    units, 
    activeFiltersObj, 
    cityFilter, 
    districtFilter, 
    bedroomsFilter, 
    filterMode, 
    maxRentVND, 
    maxTrueCostVND, 
    carParkingOnly, 
    lowFloodOnly, 
    backupPowerOnly, 
    petFriendlyOnly,
    pcccCertifiedOnly,
    verifiedLandlordOnly
  ]);

  const handleResetFilters = () => {
    setCityFilter('All');
    setDistrictFilter('');
    setBedroomsFilter(0);
    setFilterMode('trueCost');
    setMaxRentVND(450000000);
    setMaxTrueCostVND(480000000);
    setCarParkingOnly(false);
    setLowFloodOnly(false);
    setBackupPowerOnly(false);
    setPetFriendlyOnly(false);
    setPcccCertifiedOnly(false);
    setVerifiedLandlordOnly(false);
    setAiUnderstoodText(null);
    setAiFollowUp(null);
    setAiPromptInput('');
  };

  const getCityDisplayName = (city: string) => {
    switch (city) {
      case 'Hanoi': return 'Hà Nội';
      case 'Ho Chi Minh City': return 'TP. Hồ Chí Minh';
      case 'Da Nang': return 'Đà Nẵng';
      case 'Hai Phong': return 'Hải Phòng';
      case 'Binh Duong': return 'Bình Dương';
      case 'Nha Trang': return 'Nha Trang';
      case 'Can Tho': return 'Cần Thơ';
      case 'Vung Tau': return 'Vũng Tàu';
      case 'Ha Long': return 'Hạ Long';
      case 'Da Lat': return 'Đà Lạt';
      case 'Hue': return 'Huế';
      case 'Quy Nhon': return 'Quy Nhơn';
      case 'Bien Hoa': return 'Biên Hòa';
      case 'Vinh': return 'Vinh';
      case 'Thanh Hoa': return 'Thanh Hóa';
      case 'Buon Ma Thuot': return 'Buôn Ma Thuột';
      default: return city;
    }
  };

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
    <div className="space-y-6 pb-16 animate-in fade-in duration-300 relative">
      {/* Top Section: AI Natural Search Header */}
      <div className="p-6 md:p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-5 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Tìm Kiếm Thông Minh & Bóc Tách Chi Phí Thật</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold">
              Khám Phá Kho Căn Hộ Tuyển Chọn ({filteredUnits.length}/{units.length} Căn)
            </h2>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            {/* Collapsible Filter Phễu Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-sm ${
                isFilterOpen || activeFiltersCount > 0
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-slate-700'
              }`}
              title="Mở hoặc thu gọn bộ lọc chi tiết"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isFilterOpen ? 'Đóng Bộ Lọc' : 'Bộ Lọc'}</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-400 text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('grid')}
              aria-label="Chế độ lưới"
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
              aria-label="Chế độ danh sách"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Filter Sidebar (Collapsible) */}
        {isFilterOpen && (
          <div className="lg:col-span-4 xl:col-span-3 space-y-6 animate-in slide-in-from-left-4 duration-200">
            <div className="p-5 rounded-2xl atmospheric-panel border border-slate-800 space-y-5 shadow-xl sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
                <h3 className="font-serif text-base text-slate-100 flex items-center gap-2 font-bold">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  <span>Bộ Lọc Tìm Kiếm</span>
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Thu gọn bộ lọc"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* City Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Thành Phố</label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  aria-label="Chọn thành phố"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="All">Tất cả thành phố ({units.length} căn)</option>
                  <option value="Hanoi">Hà Nội</option>
                  <option value="Ho Chi Minh City">TP. Hồ Chí Minh</option>
                  <option value="Da Nang">Đà Nẵng</option>
                  <option value="Hai Phong">Hải Phòng</option>
                  <option value="Binh Duong">Bình Dương</option>
                  <option value="Nha Trang">Nha Trang</option>
                  <option value="Can Tho">Cần Thơ</option>
                  <option value="Vung Tau">Vũng Tàu</option>
                  <option value="Ha Long">Hạ Long</option>
                  <option value="Da Lat">Đà Lạt</option>
                  <option value="Hue">Huế</option>
                  <option value="Quy Nhon">Quy Nhơn</option>
                  <option value="Bien Hoa">Biên Hòa</option>
                  <option value="Vinh">Vinh</option>
                  <option value="Thanh Hoa">Thanh Hóa</option>
                  <option value="Buon Ma Thuot">Buôn Ma Thuột</option>
                </select>
              </div>

              {/* Bedrooms Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Số Phòng Ngủ</label>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map(b => (
                    <button
                      key={b}
                      onClick={() => setBedroomsFilter(b)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all border ${
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

              {/* Budget & True Cost Filter Toggle */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Chế Độ Ngân Sách</label>
                  <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono">
                    <button
                      onClick={() => setFilterMode('trueCost')}
                      className={`px-2 py-1 rounded-md transition-all ${
                        filterMode === 'trueCost'
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Tổng CP Thật
                    </button>
                    <button
                      onClick={() => setFilterMode('baseRent')}
                      className={`px-2 py-1 rounded-md transition-all ${
                        filterMode === 'baseRent'
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Giá Gốc
                    </button>
                  </div>
                </div>

                {filterMode === 'trueCost' ? (
                  <div className="space-y-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tổng CP Tối Đa:</span>
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {maxTrueCostVND >= 480000000 ? 'Không giới hạn' : `${(maxTrueCostVND / 1000000).toFixed(0)}Tr/tháng`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10000000}
                      max={480000000}
                      step={2000000}
                      value={maxTrueCostVND}
                      onChange={(e) => setMaxTrueCostVND(Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>10Tr</span>
                      <span>120Tr</span>
                      <span>480Tr+</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 uppercase tracking-wider font-semibold">Giá Thuê Tối Đa</span>
                      <span className="text-emerald-400 font-bold">
                        {maxRentVND >= 450000000 ? 'Không giới hạn' : `${(maxRentVND / 1000000).toFixed(0)}Tr/tháng`}
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
                )}
              </div>

              {/* Environmental & Verification Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block">Tiêu Chuẩn Sống</label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors">
                  <span className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>Chứng nhận PCCC chuẩn</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={pcccCertifiedOnly}
                    onChange={(e) => setPcccCertifiedOnly(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chủ nhà đã xác minh uy tín</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={verifiedLandlordOnly}
                    onChange={(e) => setVerifiedLandlordOnly(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors">
                  <span className="flex items-center gap-2">
                    <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                    <span>Không lo ngập lụt</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={lowFloodOnly}
                    onChange={(e) => setLowFloodOnly(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors">
                  <span className="flex items-center gap-2">
                    <Car className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Chỗ đỗ ô tô trong hầm</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={carParkingOnly}
                    onChange={(e) => setCarParkingOnly(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors">
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Máy phát điện 100%</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={backupPowerOnly}
                    onChange={(e) => setBackupPowerOnly(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Cho phép thú cưng</span>
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
        )}

        {/* Right Property Results Listing */}
        <div className={isFilterOpen ? 'lg:col-span-8 xl:col-span-9 space-y-6' : 'lg:col-span-12 space-y-6'}>
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
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredUnits.map(({ unit, score, matchReasons }) => {
                const isSaved = savedUnitIds.includes(unit.id);
                const trueCostTotal = unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND;
                const extraFees = trueCostTotal - unit.monthlyRentVND;

                return (
                  <div
                    key={unit.id}
                    className={`group product-ui-card rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-200 ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col justify-between'
                    }`}
                  >
                    {/* Image Area */}
                    <div
                      className={`relative bg-slate-900 cursor-pointer overflow-hidden ${
                        viewMode === 'list' ? 'sm:w-64 h-56 shrink-0' : 'h-52'
                      }`}
                      onClick={() => onSelectUnit(unit.id)}
                    >
                      <img
                        src={unit.images[0]}
                        alt={unit.name || unit.id}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                      {/* Top Badges Overlay */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2 pointer-events-none">
                        <div className="flex flex-col gap-1.5 items-start pointer-events-auto">
                          {renderVerificationBadge(unit.verificationLevel)}
                          {score > 70 && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold shadow-md">
                              {score}% Khớp
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 pointer-events-auto">
                          <span className="px-2 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-0.5 shadow-md">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{unit.landlord?.trustScore || 4.8}★</span>
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSaveUnit(unit.id);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur-md border transition-all shadow-md ${
                              isSaved
                                ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105'
                                : 'bg-slate-950/80 border-slate-700 text-slate-200 hover:text-white hover:border-slate-500'
                            }`}
                            title={isSaved ? 'Đã lưu' : 'Lưu để so sánh'}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Info Bar Overlay */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-mono text-slate-200 always-white">
                        <span className="flex items-center gap-1 text-[11px] truncate max-w-[65%]">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{unit.district}, {getCityDisplayName(unit.city)}</span>
                        </span>
                        
                        <div className="flex items-center gap-1 text-[10px] shrink-0">
                          {unit.pcccReport?.inspectionCertificateStatus === 'certified' && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 text-rose-400" /> PCCC ✓
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700">
                            Tầng {unit.floor}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                        <h3 className="font-serif text-base text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1 font-semibold">
                          {unit.name || unit.id}
                        </h3>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <span>{unit.bedrooms} PN</span>
                          <span>•</span>
                          <span>{unit.bathrooms} WC</span>
                          <span>•</span>
                          <span>{unit.sqm} m²</span>
                        </div>
                      </div>

                      {/* AI Match Reasons */}
                      <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Điểm Khớp Nhu Cầu:</span>
                        </span>
                        <ul className="space-y-0.5 text-slate-300 font-sans text-[11px]">
                          {(matchReasons.length > 0 ? matchReasons.slice(0, 2) : [
                            'Đã kiểm định an toàn PCCC & Pháp lý',
                            unit.hasCarParking ? 'Có chỗ đỗ ô tô hầm thông minh' : 'Tòa nhà văn minh, an ninh 24/7'
                          ]).map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* True Cost Breakdown vs Rent Pricing */}
                      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-lg font-serif font-bold text-emerald-400">
                              {(trueCostTotal / 1000000).toFixed(1)}Tr
                            </span>
                            <span className="text-xs text-slate-400 font-mono">/tháng</span>
                          </div>
                          
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            Gốc: {(unit.monthlyRentVND / 1000000).toFixed(0)}Tr (+{(extraFees / 1000000).toFixed(1)}Tr phí)
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectUnit(unit.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-mono transition-all duration-200 font-bold hover:shadow-lg shadow-emerald-500/10 shrink-0 whitespace-nowrap"
                        >
                          Chi Tiết
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
