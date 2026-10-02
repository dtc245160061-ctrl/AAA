import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  MapPin, 
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
  Filter,
  Box,
  ArrowRight,
  Search,
  Camera,
  Upload
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { type ConsumerFilters, parseNaturalLanguageQuery, calculateMatchScore } from '../services/aiAdvisorService';
import { normalizeCity } from '../data/apartmentStore';
import { SmartImage } from './common/SmartImage';

const getCityPriorityWeight = (cityName?: string): number => {
  if (!cityName) return 50;
  const norm = cityName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

  // Tier 1: Major metropolises (Hà Nội & TP.HCM top priority)
  if (norm.includes('ha noi') || norm.includes('hanoi')) return 100;
  if (norm.includes('ho chi minh') || norm.includes('sai gon') || norm.includes('tphcm')) return 100;

  // Tier 2: Key regional economic hubs
  if (norm.includes('da nang')) return 88;
  if (norm.includes('hai phong')) return 84;
  if (norm.includes('can tho')) return 80;

  // Tier 3: Emerging dynamic cities & educational/industrial hubs
  if (norm.includes('thai nguyen')) return 72;
  if (norm.includes('binh duong')) return 70;
  if (norm.includes('bac ninh')) return 68;
  if (norm.includes('quang ninh') || norm.includes('ha long')) return 66;
  if (norm.includes('nha trang') || norm.includes('khanh hoa')) return 65;
  if (norm.includes('vung tau')) return 62;

  return 50;
};

interface UserSearchViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onOpenVirtualTour?: (unit: ApartmentUnit) => void;
  onOpenVisualVibeModal?: () => void;
  initialAiQuery?: string;
}

export const UserSearchView: React.FC<UserSearchViewProps> = ({
  units,
  savedUnitIds,
  onToggleSaveUnit,
  onSelectUnit,
  onOpenVirtualTour,
  onOpenVisualVibeModal,
  initialAiQuery = ''
}) => {
  const [aiUnderstoodText, setAiUnderstoodText] = useState<string | null>(null);
  const [aiFollowUp, setAiFollowUp] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');

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
  const [displayLimit, setDisplayLimit] = useState<number>(36);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when search or filters change to keep rendering buttery smooth
  useEffect(() => {
    setDisplayLimit(36);
  }, [
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
    verifiedLandlordOnly,
    searchInput
  ]);



  // Process initial AI query on mount if passed
  useEffect(() => {
    if (initialAiQuery) {
      setSearchInput(initialAiQuery);
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

  // Distinct sorted cities from all available units (covering all 63 provinces)
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    units.forEach(u => {
      if (u.city) citySet.add(normalizeCity(u.city));
    });
    return Array.from(citySet).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [units]);

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
  // Filtered and Scored units (Optimized: Filter first, score only candidates for instantaneous 60fps tab switching)
  const filteredUnits = useMemo(() => {
    return units
      .filter(unit => {
        if (cityFilter !== 'All') {
          const normUnitCity = normalizeCity(unit.city);
          const normFilterCity = normalizeCity(cityFilter);
          if (normUnitCity !== normFilterCity && unit.city !== cityFilter) return false;
        }
        if (districtFilter && !unit.district.toLowerCase().includes(districtFilter.toLowerCase())) return false;
        if (bedroomsFilter > 0 && unit.bedrooms < bedroomsFilter) return false;
        
        // Filter by True Cost or Base Rent
        if (filterMode === 'trueCost') {
          const totalCost = unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND;
          if (totalCost > maxTrueCostVND) return false;
        } else {
          if (unit.monthlyRentVND > maxRentVND) return false;
        }

        if (carParkingOnly && !unit.hasCarParking) return false;
        if (lowFloodOnly && unit.floodingRisk !== 'Low') return false;
        if (backupPowerOnly && !unit.hasBackupPower) return false;
        if (petFriendlyOnly && !unit.petFriendly) return false;
        if (pcccCertifiedOnly && unit.pcccReport?.inspectionCertificateStatus !== 'certified') return false;
        if (verifiedLandlordOnly && unit.verificationLevel === 'unverified') return false;

        // Keyword Search Filter (name, district, city, address, unit id)
        if (searchInput.trim()) {
          const q = searchInput.trim().toLowerCase();
          const isNaturalSentence = q.includes(' ') && (
            q.includes('tìm') || q.includes('căn') || q.includes('phòng') ||
            q.includes('giá') || q.includes('triệu') || q.includes('củ') ||
            q.includes('dưới') || q.includes('tại') || q.includes('ở') ||
            q.includes('cho') || q.includes('muốn') || q.length > 25
          );

          // Only perform rigid substring search if it's a specific short keyword/name, not a natural query
          if (!isNaturalSentence) {
            const unaccentQ = q.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
            const target = `${unit.name || ''} ${unit.district} ${unit.city} ${unit.address} ${unit.id}`.toLowerCase();
            const unaccentTarget = target.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
            if (!target.includes(q) && !unaccentTarget.includes(unaccentQ)) {
              return false;
            }
          }
        }

        return true;
      })
      .map((unit, index) => {
        const { score, matchReasons } = calculateMatchScore(unit, activeFiltersObj);
        return { unit, score, matchReasons, originalIndex: index };
      })
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // Metropolis Priority (Hanoi & TP.HCM first, then Da Nang, Hai Phong, Thai Nguyen...)
        const weightA = getCityPriorityWeight(a.unit.city);
        const weightB = getCityPriorityWeight(b.unit.city);
        if (weightB !== weightA) {
          return weightB - weightA;
        }
        return a.originalIndex - b.originalIndex;
      });
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
    verifiedLandlordOnly,
    searchInput
  ]);

  // Automated Infinite Scroll: Pre-fetches next 12 units 600px before reaching the bottom
  useEffect(() => {
    if (!observerRef.current || displayLimit >= filteredUnits.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayLimit(prev => Math.min(prev + 36, filteredUnits.length));
        }
      },
      { rootMargin: '1200px 0px' }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [displayLimit, filteredUnits.length]);

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
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2570EB] text-white text-[10px] font-bold shadow-md">
            <ShieldCheck className="w-3 h-3 text-white shrink-0" />
            <span>✓✓ Sổ Đỏ & Ảnh Thật</span>
          </span>
        );
      case 'id_verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-black shadow-md">
            <CheckCircle2 className="w-3 h-3 text-[#163300] shrink-0" />
            <span>✓ Xác Minh CCCD</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 text-[#495E35] border border-[#163300]/15 text-[10px] font-semibold">
            <span>Chờ Xác Minh</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300 relative">
      {/* Section Header: Wise Clean Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] text-xs uppercase tracking-wider font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#20A05A]" />
              <span>Kho Căn Hộ Tuyển Chọn HAVEN</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-white">
              {filteredUnits.length} Không Gian Sống Đã Kiểm Định Pháp Lý & Môi Trường
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {/* Collapsible Filter Phễu Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                isFilterOpen || activeFiltersCount > 0
                  ? 'bg-[#163300] text-white border-[#163300]'
                  : 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#163300] dark:text-slate-200 hover:border-[#163300]'
              }`}
              title="Mở hoặc thu gọn bộ lọc chi tiết"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isFilterOpen ? 'Thu gọn bộ lọc' : 'Bộ lọc chi tiết'}</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              className="px-3.5 py-2 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đặt lại</span>
            </button>
          </div>
        </div>

        {/* Active AI Query Status Pill (Seamlessly Driven by Topbar Global Search) */}
        {searchInput && (
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-[#E8F8EC] border border-[#9FE870] text-xs shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-[#20A05A] shrink-0" />
              <span className="text-[#163300] truncate font-medium">
                Đang tìm kiếm: <strong className="font-bold text-[#163300]">"{searchInput}"</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                handleResetFilters();
              }}
              className="text-[#163300] hover:text-rose-600 text-xs font-bold shrink-0 ml-2 cursor-pointer transition-colors"
              title="Xóa bộ lọc tìm kiếm"
            >
              ✕ Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Real-time In-Page Search Bar & Visual Vibe Button */}
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#20A05A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tên căn hộ, quận huyện, dự án hoặc từ khóa..."
              className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-full text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] transition-all font-sans"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="px-2 py-0.5 text-[11px] rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors cursor-pointer font-bold"
                >
                  ✕
                </button>
              )}
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-[#9FE870]">
                {filteredUnits.length} căn
              </span>
            </div>
          </div>

          {onOpenVisualVibeModal && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onOpenVisualVibeModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#E8F8EC] hover:bg-[#D4F4DA] text-[#163300] border border-[#9FE870] text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Tìm kiếm bằng ảnh hoặc camera"
              >
                <Camera className="w-4 h-4 text-[#20A05A]" />
                <span className="hidden sm:inline">Visual Vibe</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick City Filter Pills - Fast 1-click filtering without opening sidebar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs font-mono">
          <span className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-500 font-semibold mr-1 shrink-0">Khu vực:</span>
          {['All', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Thái Nguyên', 'Bắc Ninh', 'Bình Dương', 'Quảng Ninh'].map((c) => {
            const isSelected = cityFilter === c;
            const label = c === 'All' ? 'Tất Cả' : c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCityFilter(c)}
                className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 font-bold text-xs border cursor-pointer ${
                  isSelected
                    ? 'bg-[#9FE870] text-[#163300] border-[#9FE870] shadow-xs'
                    : 'bg-white dark:bg-[#163300] border-[#163300]/15 dark:border-[#9FE870]/30 text-[#495E35] dark:text-emerald-200 hover:text-[#163300] hover:border-[#163300]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

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
            <div className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-5 shadow-sm sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <h3 className="text-base text-[#163300] dark:text-white flex items-center gap-2 font-bold">
                  <SlidersHorizontal className="w-4 h-4 text-[#20A05A]" />
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
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Tỉnh / Thành Phố</label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  aria-label="Chọn tỉnh thành phố"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="All">Tất cả ({units.length} căn hộ)</option>
                  {availableCities.map(c => {
                    const count = units.filter(u => u.city === c).length;
                    return (
                      <option key={c} value={c}>
                        {getCityDisplayName(c)} ({count} căn)
                      </option>
                    );
                  })}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnits.slice(0, displayLimit).map(({ unit, score, matchReasons }) => {
                const isSaved = savedUnitIds.includes(unit.id);
                const trueCostTotal = unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND;
                const extraFees = trueCostTotal - unit.monthlyRentVND;
                // Grid View Card (Tall, Architectural Proportions)
                return (
                  <div
                    key={unit.id}
                    className="group relative rounded-[28px] overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  >
                    {/* Image Area - TALL & MAJESTIC (h-64 sm:h-72) */}
                    <div
                      className="relative h-64 sm:h-72 bg-[#F2F5F0] dark:bg-slate-800 cursor-pointer overflow-hidden rounded-t-[27px]"
                      onClick={() => onSelectUnit(unit.id)}
                    >
                      <SmartImage
                        src={unit.images[0]}
                        alt={unit.name || unit.id}
                        width={600}
                        quality={75}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                      {/* Top Badges Overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                        <div className="flex flex-col gap-1.5 items-start pointer-events-auto">
                          {renderVerificationBadge(unit.verificationLevel)}
                          {score > 70 && (
                            <span className="px-3 py-1 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-black shadow-md">
                              {score}% Khớp AI
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 pointer-events-auto">
                          <span className="px-2.5 py-1 rounded-full bg-[#FFF6DB] border border-[#FFC83B]/40 text-[#7A5200] text-[11px] font-bold flex items-center gap-0.5 shadow-md">
                            <Star className="w-3 h-3 fill-[#FFC83B] text-[#FFC83B]" />
                            <span>{unit.landlord?.trustScore || 4.8}★</span>
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSaveUnit(unit.id);
                            }}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all shadow-md cursor-pointer ${
                              isSaved
                                ? 'bg-[#FF5436] border-[#FF5436] text-white scale-105'
                                : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
                            }`}
                            title={isSaved ? 'Đã lưu' : 'Lưu để so sánh'}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Info Bar Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium always-white">
                        <span className="flex items-center gap-1.5 text-[11px] truncate max-w-[65%]">
                          <MapPin className="w-3.5 h-3.5 text-[#9FE870] shrink-0" />
                          <span className="truncate drop-shadow-sm">{unit.district}, {getCityDisplayName(unit.city)}</span>
                        </span>
                        
                        <div className="flex items-center gap-1.5 text-[10px] shrink-0">
                          {unit.pcccReport?.inspectionCertificateStatus === 'certified' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FFEAE5] border border-[#FF5436]/30 text-[#8C1F08] flex items-center gap-0.5 font-bold shadow-xs">
                              <Flame className="w-2.5 h-2.5 text-[#FF5436]" /> PCCC ✓
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md font-bold">
                            Tầng {unit.floor}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                        <h3 className="text-lg font-extrabold text-[#163300] dark:text-white hover:text-[#2570EB] transition-colors line-clamp-1">
                          {unit.name || unit.id}
                        </h3>

                        <div className="flex items-center gap-2 text-xs font-semibold text-[#495E35] dark:text-emerald-200/80">
                          <span>{unit.bedrooms} PN</span>
                          <span>•</span>
                          <span>{unit.bathrooms} WC</span>
                          <span>•</span>
                          <span>{unit.sqm} m²</span>
                        </div>
                      </div>

                      {/* AI Match Reasons */}
                      <div className="p-3 rounded-2xl bg-[#E2F7D4]/50 dark:bg-[#163300]/40 border border-[#9FE870]/40 text-xs space-y-1.5">
                        <span className="text-[10px] text-[#163300] dark:text-[#9FE870] uppercase tracking-wider font-extrabold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#20A05A] shrink-0" />
                          <span>Điểm Khớp Nhu Cầu:</span>
                        </span>
                        <ul className="space-y-1 text-[#495E35] dark:text-slate-200 text-xs">
                          {(matchReasons.length > 0 ? matchReasons.slice(0, 2) : [
                            'Đã kiểm định an toàn PCCC & Pháp lý',
                            unit.hasCarParking ? 'Có chỗ đỗ ô tô hầm thông minh' : 'Tòa nhà văn minh, an ninh 24/7'
                          ]).map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 leading-snug">
                              <Check className="w-3 h-3 text-[#20A05A] shrink-0" />
                              <span className="truncate font-medium">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* True Cost Breakdown vs Rent Pricing */}
                      <div className="pt-3.5 border-t border-[#163300]/10 dark:border-[#9FE870]/20 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-2xl font-black text-[#163300] dark:text-[#9FE870] tracking-tight">
                              {(trueCostTotal / 1000000).toFixed(1)} Tr
                            </span>
                            <span className="text-xs text-[#738565] dark:text-emerald-200/60 font-medium">/tháng</span>
                          </div>
                          
                          <div className="text-[11px] font-semibold text-[#738565] truncate mt-0.5">
                            Gốc: {(unit.monthlyRentVND / 1000000).toFixed(0)}Tr (+{(extraFees / 1000000).toFixed(1)}Tr phí)
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {onOpenVirtualTour && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenVirtualTour(unit);
                              }}
                              className="px-3 py-2 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#8B5CF6]/30 text-[#431A7A] text-xs font-bold transition-all flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                              title="Xem 3D & Tour ảo 360°"
                            >
                              <Box className="w-3.5 h-3.5 text-[#8B5CF6]" />
                              <span className="hidden sm:inline text-[11px]">3D</span>
                            </button>
                          )}
                          <button
                            onClick={() => onSelectUnit(unit.id)}
                            className="px-5 py-2.5 rounded-full bg-[#163300] hover:bg-[#223D0D] text-white font-extrabold text-xs transition-all shadow-xs hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
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

              {/* Continuous Infinite Scroll Sentinel */}
              {displayLimit < filteredUnits.length && (
                <div ref={observerRef} className="col-span-full py-8 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 text-emerald-400 text-xs font-mono shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Tự động tải thêm không gian sống tiếp theo...</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 [data-theme='light']_:text-slate-500">
                    Đã hiển thị {displayLimit} / {filteredUnits.length} căn hộ
                  </span>
                </div>
              )}

              {displayLimit >= filteredUnits.length && filteredUnits.length > 0 && (
                <div className="col-span-full py-6 text-center text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-500 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Đã tải toàn bộ {filteredUnits.length} căn hộ tuyển chọn</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
