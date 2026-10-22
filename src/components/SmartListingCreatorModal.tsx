import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Car,
  Dog,
  ShieldCheck,
  Check,
  TrendingUp,
  Zap,
  Award
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { 
  extractListingEntitiesFromText, 
  type ListingFormAutoFillPayload 
} from '../services/aiOcrAndFormService';
import { useAiCommand } from '../services/aiCommandBus';
import { optimizeUnitPricingAndYield } from '../services/aiSignatureFeaturesService';

interface SmartListingCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (unit: Partial<ApartmentUnit>) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const SmartListingCreatorModal: React.FC<SmartListingCreatorModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
  onShowToast
}) => {
  const [step, setStep] = useState<'upload' | 'generating' | 'review'>('upload');
  const [selectedCity, setSelectedCity] = useState<'Hanoi' | 'Ho Chi Minh City' | 'Da Nang'>('Ho Chi Minh City');
  const [district, setDistrict] = useState<string>('Quận 7');
  const [sqm, setSqm] = useState<number>(85);
  const [bedrooms, setBedrooms] = useState<number>(2);

  // Amenities Toggles
  const [hasCarParking, setHasCarParking] = useState<boolean>(true);
  const [petFriendly, setPetFriendly] = useState<boolean>(false);
  const [lowFlood, setLowFlood] = useState<boolean>(true);

  // AI Generated Results State
  const [generatedTitle, setGeneratedTitle] = useState<string>('Căn Hộ 2PN Phú Mỹ Hưng View Sông Thoáng Mát — Đã Nghiệm Thu PCCC');
  const [generatedDesc, setGeneratedDesc] = useState<string>('Căn hộ thiết kế hiện đại tràn ngập ánh sáng tự nhiên với ban công hướng Đông Nam đón gió mát. Trang bị đầy đủ nội thất cao cấp (điều hòa Daikin, bếp từ Bosch). Tòa nhà trang bị 2 thang thoát hiểm chống khói và đầu phun Sprinkler tự động.');
  const [suggestedRentVND, setSuggestedRentVND] = useState<number>(18500000);
  const [parkingFeeVND, setParkingFeeVND] = useState<number>(1200000);

  // Raw Description NER Auto-Fill State
  const [rawDescriptionInput, setRawDescriptionInput] = useState<string>('');
  const [isExtractingListing, setIsExtractingListing] = useState<boolean>(false);
  const [autoFilledKeys, setAutoFilledKeys] = useState<string[]>([]);

  // AI Dynamic Pricing & Yield Optimization calculation for Step 3
  const yieldOptimization = React.useMemo(() => {
    const mockUnit: Partial<ApartmentUnit> = {
      id: 'DRAFT',
      city: selectedCity,
      district,
      sqm,
      bedrooms,
      monthlyRentVND: suggestedRentVND,
      petFriendly,
      hasCarParking,
      floodingRisk: lowFlood ? 'Low' : 'High'
    };
    return optimizeUnitPricingAndYield(mockUnit as ApartmentUnit);
  }, [selectedCity, district, sqm, bedrooms, suggestedRentVND, petFriendly, hasCarParking, lowFlood]);

  // Listen to Global aiCommandBus for 'fill_listing'
  useAiCommand((cmd) => {
    if (cmd.type === 'fill_listing') {
      const p = cmd.payload;
      applyListingPayload(p);
    }
  });

  const applyListingPayload = (p: Partial<ListingFormAutoFillPayload>) => {
    const filled: string[] = [];

    if (p.city) {
      if (p.city.toLowerCase().includes('hà nội') || p.city.toLowerCase().includes('hanoi')) {
        setSelectedCity('Hanoi');
      } else if (p.city.toLowerCase().includes('đà nẵng') || p.city.toLowerCase().includes('da nang')) {
        setSelectedCity('Da Nang');
      } else {
        setSelectedCity('Ho Chi Minh City');
      }
      filled.push('city');
    }

    if (p.district) {
      setDistrict(p.district);
      filled.push('district');
    }
    if (p.bedrooms) {
      setBedrooms(p.bedrooms);
      filled.push('bedrooms');
    }
    if (p.sqm) {
      setSqm(p.sqm);
      filled.push('sqm');
    }
    if (p.monthlyRentVND) {
      setSuggestedRentVND(p.monthlyRentVND);
      filled.push('monthlyRentVND');
    }
    if (p.hasCarParking !== undefined) {
      setHasCarParking(p.hasCarParking);
      filled.push('hasCarParking');
    }
    if (p.petFriendly !== undefined) {
      setPetFriendly(p.petFriendly);
      filled.push('petFriendly');
    }
    if (p.lowFlood !== undefined) {
      setLowFlood(p.lowFlood);
      filled.push('lowFlood');
    }
    if (p.title) {
      setGeneratedTitle(p.title);
      filled.push('title');
    }
    if (p.description) {
      setGeneratedDesc(p.description);
      filled.push('description');
    }

    setAutoFilledKeys(filled);
    setTimeout(() => setAutoFilledKeys([]), 4500);

    if (onShowToast) {
      onShowToast(
        'success',
        'AI Tự Điền Tin Đăng',
        `Đã tự động trích xuất ${filled.length} thông số căn hộ từ mô tả!`
      );
    }
  };

  const handleAutoFillFromDescription = async (textToProcess?: string) => {
    const text = (textToProcess || rawDescriptionInput).trim();
    if (!text) {
      if (onShowToast) onShowToast('info', 'Chưa có mô tả', 'Vui lòng nhập mô tả hoặc chọn câu mẫu.');
      return;
    }

    setIsExtractingListing(true);
    try {
      const extracted = await extractListingEntitiesFromText(text);
      applyListingPayload(extracted);
    } catch {
      if (onShowToast) onShowToast('error', 'Lỗi phân tích', 'Không thể trích xuất thông số. Vui lòng thử lại.');
    } finally {
      setIsExtractingListing(false);
    }
  };

  if (!isOpen) return null;

  const handleStartAiAnalysis = () => {
    setStep('generating');
    setTimeout(() => {
      setGeneratedTitle(`Căn Hộ ${bedrooms}PN ${district} Hiện Đại — Chuẩn An Tâm PCCC`);
      setGeneratedDesc(`Căn hộ diện tích ${sqm}m² thiết kế thông minh, tối ưu diện tích sinh hoạt gia đình. Khu vực cao ráo không ngập mùa mưa, gần trường quốc tế và siêu thị lớn. Bàn giao đầy đủ nội thất chỉ việc xách vali vào ở.`);
      setSuggestedRentVND(district.includes('1') ? 28000000 : district.includes('7') ? 18500000 : 15000000);
      setStep('review');
    }, 1200);
  };

  const handleComplete = () => {
    onListingCreated?.({
      name: generatedTitle,
      city: selectedCity,
      district,
      sqm,
      bedrooms,
      monthlyRentVND: suggestedRentVND,
      status: 'vacant'
    });
    if (onShowToast) {
      onShowToast('success', 'Xuất bản tin đăng thành công', 'Tin đăng đã được AI tối ưu hóa và hiển thị trên sàn HAVEN.');
    }
    onClose();
  };

  const getFieldPulseStyle = (key: string) => {
    if (autoFilledKeys.includes(key)) {
      return 'ring-2 ring-[#9FE870] bg-[#E8F8EC] dark:bg-emerald-950/40 border-[#9FE870] transition-all duration-500';
    }
    return 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-3xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#163300] dark:text-white leading-tight">
                Đăng Tin Thông Minh AI (Smart Listing Creator)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Tự động nhận diện phòng, gợi ý giá thị trường và chuẩn hóa minh bạch PCCC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-[#163300] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Upload Photos & Basic Info */}
        {step === 'upload' && (
          <div className="space-y-5 animate-in fade-in duration-200 text-xs">
            {/* AI NATURAL LANGUAGE AUTO-FILLER BAR */}
            <div className="p-5 rounded-[24px] bg-gradient-to-r from-[#F7FAF6] via-white to-[#F2F5F0] dark:from-slate-900 dark:via-slate-800/60 dark:to-slate-900 border-2 border-[#9FE870]/70 dark:border-[#9FE870]/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#9FE870] text-[#163300] flex items-center justify-center font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[#163300] dark:text-white text-xs sm:text-sm">
                    AI Tự Điền Từ Mô Tả Thô (Quick NER Auto-Filler)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#163300] dark:text-[#9FE870] px-2.5 py-0.5 rounded-full bg-[#E8F8EC] dark:bg-emerald-950/40 border border-[#9FE870]/30">
                  1-Click Fill
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={rawDescriptionInput}
                  onChange={(e) => setRawDescriptionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAutoFillFromDescription();
                    }
                  }}
                  placeholder="Gõ mô tả ngắn (VD: Đăng căn hộ 2PN ở Cầu Giấy 75m2 giá 14 triệu có chỗ đỗ ô tô và nuôi thú cưng)..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] text-xs font-sans shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => handleAutoFillFromDescription()}
                  disabled={isExtractingListing}
                  className="px-5 py-2.5 rounded-full bg-[#163300] hover:bg-[#204900] text-[#9FE870] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isExtractingListing ? 'Đang trích xuất...' : 'AI Điền Thông Số'}</span>
                </button>
              </div>

              {/* Sample Chips for Live Classroom Presentation */}
              <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                <span className="text-slate-500 font-bold">Thử mô tả mẫu:</span>
                {[
                  {
                    label: '2PN Cầu Giấy 75m², 14tr, đỗ ô tô, pet',
                    text: 'Đăng căn hộ 2PN ở Cầu Giấy 75m2 giá 14 triệu có chỗ đỗ ô tô và nuôi thú cưng'
                  },
                  {
                    label: '3PN Tây Hồ 110m², 22tr, không ngập',
                    text: 'Căn hộ 3 phòng ngủ Tây Hồ 110m2 giá 22 triệu full nội thất có chỗ đỗ ô tô và không ngập'
                  },
                  {
                    label: 'Studio Quận 7 45m², 9.5tr, nuôi thú cưng',
                    text: 'Studio cao cấp Quận 7 45m2 giá 9.5 triệu cho nuôi mèo'
                  }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRawDescriptionInput(sample.text);
                      handleAutoFillFromDescription(sample.text);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#9FE870] text-[#163300] dark:text-slate-200 font-medium transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                  >
                    ⚡ {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Box */}
            <div className="p-8 rounded-[24px] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-[#F2F5F0] dark:bg-slate-800/60 text-center space-y-3 cursor-pointer hover:border-[#163300] dark:hover:border-[#9FE870] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[#163300] dark:text-white font-black text-sm">Tải lên 3-8 bức ảnh chụp thực tế căn hộ</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">AI sẽ tự động nhận diện phòng khách, bếp, ban công và góc chụp</p>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] text-[11px] font-bold border border-[#9FE870]/20">
                ✓ 5 ảnh mẫu đã sẵn sàng phân tích
              </span>
            </div>

            {/* Basic Spec Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Thành Phố *</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-[#163300] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 ${getFieldPulseStyle('city')}`}
                >
                  <option value="Ho Chi Minh City">TP. Hồ Chí Minh</option>
                  <option value="Hanoi">Hà Nội</option>
                  <option value="Da Nang">Đà Nẵng</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Quận / Huyện *</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Quận 7, Cầu Giấy..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-[#163300] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 ${getFieldPulseStyle('district')}`}
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Diện Tích (m²) & Số Phòng</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={sqm}
                    onChange={(e) => setSqm(Number(e.target.value))}
                    className={`w-1/2 px-3 py-2.5 rounded-xl border text-[#163300] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 ${getFieldPulseStyle('sqm')}`}
                  />
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    placeholder="PN"
                    className={`w-1/2 px-3 py-2.5 rounded-xl border text-[#163300] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 ${getFieldPulseStyle('bedrooms')}`}
                  />
                </div>
              </div>
            </div>

            {/* Amenities & Characteristics Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setHasCarParking(prev => !prev)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  hasCarParking 
                    ? 'bg-[#E8F8EC] dark:bg-emerald-950/40 border-[#9FE870] text-[#163300] dark:text-[#9FE870]' 
                    : 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Car className="w-4 h-4" />
                  <span>Có Chỗ Đỗ Ô Tô</span>
                </div>
                {hasCarParking ? <Check className="w-4 h-4" /> : <span className="text-[10px] font-mono">TẮT</span>}
              </button>

              <button
                type="button"
                onClick={() => setPetFriendly(prev => !prev)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  petFriendly 
                    ? 'bg-[#E8F8EC] dark:bg-emerald-950/40 border-[#9FE870] text-[#163300] dark:text-[#9FE870]' 
                    : 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Dog className="w-4 h-4" />
                  <span>Nuôi Thú Cưng</span>
                </div>
                {petFriendly ? <Check className="w-4 h-4" /> : <span className="text-[10px] font-mono">TẮT</span>}
              </button>

              <button
                type="button"
                onClick={() => setLowFlood(prev => !prev)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  lowFlood 
                    ? 'bg-[#E8F8EC] dark:bg-emerald-950/40 border-[#9FE870] text-[#163300] dark:text-[#9FE870]' 
                    : 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Không Ngập Nước</span>
                </div>
                {lowFlood ? <Check className="w-4 h-4" /> : <span className="text-[10px] font-mono">TẮT</span>}
              </button>
            </div>

            <button
              onClick={handleStartAiAnalysis}
              className="w-full py-3.5 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] text-[#163300] font-black text-xs shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#163300]" />
              <span>Bắt Đầu Phân Tích & Tự Động Soạn Tin Bằng AI</span>
            </button>
          </div>
        )}

        {/* STEP 2: AI Loading Simulation */}
        {step === 'generating' && (
          <div className="py-16 text-center space-y-4 animate-in fade-in">
            <RefreshCw className="w-12 h-12 text-[#163300] dark:text-[#9FE870] mx-auto animate-spin" />
            <h4 className="text-xl font-black text-[#163300] dark:text-white">AI Đang Phân Tích Hình Ảnh & Thị Trường...</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Đang đối chiếu mức giá cho thuê trung bình tại {district}, bóc tách chi phí điện nước và lập tiêu đề chuẩn SEO.
            </p>
          </div>
        )}

        {/* STEP 3: AI Review & Quality Inspector */}
        {step === 'review' && (
          <div className="space-y-5 animate-in fade-in duration-200 text-xs">
            {/* AI Optimization Banner */}
            <div className="p-4 rounded-2xl bg-[#E8F8EC] border border-[#9FE870]/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#163300] font-black">
                <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0" />
                <span>Điểm Chất Lượng Tin Đăng: 96/100 (Tối Ưu Xuất Sắc)</span>
              </div>
              <span className="text-[11px] text-[#163300] dark:text-[#9FE870] font-bold">Ước tính tăng +45% lượt liên hệ</span>
            </div>

            {/* Generated Title */}
            <div>
              <label className="text-slate-600 dark:text-slate-300 block mb-1 font-bold">Tiêu Đề Tin Đăng Tối Ưu:</label>
              <input
                type="text"
                value={generatedTitle}
                onChange={(e) => setGeneratedTitle(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-[#163300] dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 ${getFieldPulseStyle('title')}`}
              />
            </div>

            {/* Generated Description */}
            <div>
              <label className="text-slate-600 dark:text-slate-300 block mb-1 font-bold">Mô Tả Chi Tiết Do AI Soạn Thảo:</label>
              <textarea
                rows={3}
                value={generatedDesc}
                onChange={(e) => setGeneratedDesc(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 leading-relaxed ${getFieldPulseStyle('description')}`}
              />
            </div>

            {/* Price Recommendation & True Cost Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-600 dark:text-slate-300 font-bold">Gợi Ý Giá Thuê Thị Trường:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={suggestedRentVND}
                    onChange={(e) => setSuggestedRentVND(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[#163300] dark:text-[#9FE870] font-black text-base tabular-nums"
                  />
                  <span className="text-slate-500 font-bold shrink-0">đ/tháng</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-slate-600 dark:text-slate-300 font-bold">Phí Gửi Xe Bóc Tách:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={parkingFeeVND}
                    onChange={(e) => setParkingFeeVND(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[#163300] dark:text-white font-bold text-base tabular-nums"
                  />
                  <span className="text-slate-500 font-bold shrink-0">đ/tháng</span>
                </div>
              </div>
            </div>

            {/* AI Dynamic Pricing Tiers */}
            <div className="p-3.5 rounded-2xl bg-[#E8F8EC]/70 dark:bg-emerald-950/20 border border-[#9FE870]/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-[#163300] dark:text-[#9FE870]">
                  <TrendingUp className="w-4 h-4" />
                  <span>AI Dynamic Pricing — 3 Kịch Bản Lợi Nhuận:</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Bấm chọn để áp dụng</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSuggestedRentVND(yieldOptimization.fastOccupancyPriceVND)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    suggestedRentVND === yieldOptimization.fastOccupancyPriceVND
                      ? 'bg-[#163300] text-[#9FE870] border-[#163300]'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#9FE870]'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-[#9FE870]">
                    <Zap className="w-3 h-3" />
                    <span>Thuê Nhanh</span>
                  </div>
                  <div className="font-black text-xs sm:text-sm tabular-nums mt-0.5">
                    {(yieldOptimization.fastOccupancyPriceVND / 1000000).toFixed(1)} Tr
                  </div>
                  <div className="text-[9px] opacity-75">3-5 ngày</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSuggestedRentVND(yieldOptimization.optimalYieldPriceVND)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    suggestedRentVND === yieldOptimization.optimalYieldPriceVND
                      ? 'bg-[#163300] text-[#9FE870] border-[#163300]'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#9FE870]'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>Tối Ưu Yield</span>
                  </div>
                  <div className="font-black text-xs sm:text-sm tabular-nums mt-0.5">
                    {(yieldOptimization.optimalYieldPriceVND / 1000000).toFixed(1)} Tr
                  </div>
                  <div className="text-[9px] opacity-75">Điểm ngọt ROI</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSuggestedRentVND(yieldOptimization.premiumTargetPriceVND)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    suggestedRentVND === yieldOptimization.premiumTargetPriceVND
                      ? 'bg-[#163300] text-[#9FE870] border-[#163300]'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#9FE870]'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    <Award className="w-3 h-3" />
                    <span>Cao Cấp</span>
                  </div>
                  <div className="font-black text-xs sm:text-sm tabular-nums mt-0.5">
                    {(yieldOptimization.premiumTargetPriceVND / 1000000).toFixed(1)} Tr
                  </div>
                  <div className="text-[9px] opacity-75">Full tiện ích</div>
                </button>
              </div>
            </div>

            {/* AI Quality Inspector Suggestions */}
            <div className="p-4 rounded-2xl bg-[#FFFBF0] dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700/60 space-y-1.5 text-xs text-amber-900 dark:text-amber-300">
              <div className="flex items-center gap-1.5 font-black text-amber-800 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 text-[#FF6740]" />
                <span>Gợi ý cải thiện từ AI Listing Optimizer:</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-slate-700 dark:text-slate-300 text-xs">
                <li>Bổ sung ảnh giấy nghiệm thu PCCC để nhận huy hiệu <strong>Verified Cấp 3</strong>.</li>
                <li>{petFriendly ? '✓ Đã bật chế độ thân thiện thú cưng (Pet-Friendly).' : 'Thêm thông tin vật nuôi (Pet-Friendly) để tiếp cận thêm 35% khách thuê trẻ.'}</li>
                {yieldOptimization.capExUpgrades.slice(0, 1).map((upg, i) => (
                  <li key={i} className="text-[#163300] dark:text-[#9FE870] font-semibold">
                    💡 Gợi ý CapEx ROI: {upg.title} (Chi phí ~{(upg.estimatedCostVND / 1000000).toFixed(1)}Tr, tăng thu +{(upg.monthlyRentIncreaseVND / 1000000).toFixed(1)}Tr/tháng, hoàn vốn {upg.paybackPeriodMonths} tháng).
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep('upload')}
                className="px-5 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
              >
                Chỉnh sửa lại
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] text-[#163300] font-black shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận & Xuất Bản Tin Đăng Ngay</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
