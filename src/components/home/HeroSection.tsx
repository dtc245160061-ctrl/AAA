import React, { useState, useId } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Mic, 
  MicOff, 
  Compass, 
  Camera, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { VoiceRecognitionService } from '../../services/voiceRecognitionService';

interface HeroSectionProps {
  onSearch: (query?: string) => void;
  onOpenLifestyleMatchmaker?: () => void;
  onOpenVisualVibeModal?: () => void;
}

const PROVINCES = [
  'Toàn quốc (11 tỉnh)',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Thái Nguyên',
  'Hải Phòng',
  'Cần Thơ',
  'Nha Trang',
  'Bình Dương',
  'Vũng Tàu',
  'Huế',
  'Quảng Ninh'
];

const ROOM_TYPES = [
  'Tất cả loại phòng',
  'Studio / 1 Phòng Ngủ',
  '2 Phòng Ngủ',
  '3+ Phòng Ngủ',
  'Duplex / Penthouse'
];

const quickSuggestions = [
  { label: 'Căn 2 phòng Thái Nguyên 8 củ có ô tô', query: 'căn 2 phòng ở Thái Nguyên tầm 8 củ có ô tô' },
  { label: '2PN Tây Hồ dưới 20 củ, tầng cao', query: '2pn tây hồ dưới 20 củ, tầng cao' },
  { label: 'Vợ chồng 1 con, Cầu Giấy, yên tĩnh', query: 'vợ chồng 1 con, cầu giấy, yên tĩnh' },
  { label: 'Sky villa ngắm biển Mỹ Khê', query: 'sky villa ngắm biển mỹ khê' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onSearch, 
  onOpenLifestyleMatchmaker,
  onOpenVisualVibeModal
}) => {
  const [budgetVND, setBudgetVND] = useState<number>(15000000);
  const [selectedProvince, setSelectedProvince] = useState<string>('Hà Nội');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('2 Phòng Ngủ');
  const [isListening, setIsListening] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const budgetInputId = useId();

  // Dynamic calculation for matching units based on budget
  const estimatedMatches = Math.max(12, Math.min(86, Math.round(budgetVND / 420000)));

  const handleCalculatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const provQuery = selectedProvince.includes('Toàn quốc') ? '' : selectedProvince;
    const roomQuery = selectedRoomType.includes('Tất cả') ? '' : selectedRoomType;
    const budgetQuery = `tầm ${(budgetVND / 1000000).toFixed(0)} triệu`;
    const fullQuery = [roomQuery, provQuery, budgetQuery].filter(Boolean).join(' ');
    onSearch(fullQuery);
  };

  const toggleVoice = () => {
    if (isListening) {
      VoiceRecognitionService.stop();
      setIsListening(false);
      return;
    }

    const started = VoiceRecognitionService.start({
      lang: 'vi-VN',
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: (transcript, isFinal) => {
        setAiPromptInput(transcript);
        if (isFinal) {
          onSearch(transcript);
        }
      },
      onError: (err) => {
        console.warn('Voice error:', err);
        setIsListening(false);
      }
    });

    if (!started) {
      alert('Trình duyệt chưa hỗ trợ Web Speech API hoặc bạn chưa cấp quyền micro.');
    }
  };

  return (
    <section className="relative w-full bg-[#F2F5F0] dark:bg-[#0E1E09] rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#163300]/10 dark:border-[#9FE870]/20 shadow-sm transition-colors duration-300">
      {/* 2-Column Wise Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* ─── LEFT COLUMN: Wise Confident Typography & Narrative ─── */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2F7D4] dark:bg-[#163300] border border-[#163300]/15 dark:border-[#9FE870]/30 text-xs font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#163300] dark:bg-[#9FE870] animate-pulse" />
            <span>HAVEN PROPTECH PLATFORM · KHMT K23A</span>
          </div>

          {/* Wise Signature Heavy Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#163300] dark:text-white tracking-tight leading-[1.05] uppercase">
              THUÊ CĂN HỘ <br />
              <span className="text-[#163300] dark:text-[#9FE870]">TIẾT KIỆM HƠN,</span> <br />
              MINH BẠCH HƠN.
            </h1>
            <p className="text-base sm:text-lg text-[#495E35] dark:text-emerald-100/80 max-w-xl font-medium leading-relaxed">
              Phương thức chuẩn xác để tìm và thuê 1,260 căn hộ độc bản tại 11 tỉnh thành. 100% kiểm định an toàn PCCC QCVN 06:2022, minh bạch chi phí thật và tư vấn bằng AI Local 80ms.
            </p>
          </div>

          {/* Quick Voice / Prompt Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(aiPromptInput.trim() || undefined);
            }} 
            className="flex items-center gap-2 w-full max-w-2xl lg:max-w-3xl bg-white dark:bg-[#163300] p-1.5 rounded-full border border-[#163300]/15 dark:border-[#9FE870]/30 shadow-md focus-within:border-[#163300] dark:focus-within:border-[#9FE870] focus-within:ring-4 focus-within:ring-[#9FE870]/25 transition-all duration-200"
          >
            <div className="pl-4 pr-1 text-[#163300] dark:text-[#9FE870]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <input
              type="text"
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              placeholder='Nhập hoặc nói: "2 phòng ngủ Thái Nguyên 8 củ có ô tô"'
              className="w-full bg-transparent border-none text-[#163300] dark:text-white placeholder:text-[#738565] dark:placeholder:text-emerald-200/50 text-sm sm:text-base font-semibold focus:outline-none focus:ring-0 py-2.5 px-3"
            />
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleVoice}
              title={isListening ? "Đang lắng nghe... Bấm để dừng" : "Tìm kiếm bằng giọng nói tiếng Việt"}
              className={`p-3 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-[#FF5436] text-white animate-pulse shadow-md ring-2 ring-[#FF5436]/40'
                  : 'bg-[#F2F5F0] dark:bg-[#0E1E09] text-[#163300] dark:text-[#9FE870] hover:bg-[#9FE870] hover:text-[#163300]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#9FE870] hover:bg-[#8CD85E] text-[#163300] font-black text-sm transition-all duration-200 shadow-sm shrink-0 cursor-pointer active:scale-95"
            >
              <span>Tìm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Suggestions Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
            <span className="text-[#495E35] dark:text-emerald-200/60 uppercase tracking-wider font-bold">Gợi ý:</span>
            {quickSuggestions.map((s) => (
              <button
                key={s.query}
                type="button"
                onClick={() => onSearch(s.query)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-[#163300] text-[#163300] dark:text-emerald-200 border border-[#163300]/10 dark:border-[#9FE870]/20 hover:bg-[#9FE870] dark:hover:bg-[#9FE870] hover:text-[#163300] transition-colors shadow-xs cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Feature Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onOpenLifestyleMatchmaker && (
              <button
                type="button"
                onClick={onOpenLifestyleMatchmaker}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#163300] text-[#163300] dark:text-[#9FE870] border border-[#163300]/15 dark:border-[#9FE870]/30 font-bold text-xs sm:text-sm hover:bg-[#E2F7D4] dark:hover:bg-[#223D0D] transition-all shadow-xs cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                <span>Khảo sát nhu cầu sống 6 bước</span>
              </button>
            )}

            {onOpenVisualVibeModal && (
              <button
                type="button"
                onClick={onOpenVisualVibeModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#163300] text-[#163300] dark:text-[#9FE870] border border-[#163300]/15 dark:border-[#9FE870]/30 font-bold text-xs sm:text-sm hover:bg-[#E2F7D4] dark:hover:bg-[#223D0D] transition-all shadow-xs cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                <span>Tìm kiếm bằng thị giác AI</span>
              </button>
            )}
          </div>

          {/* 3-Column Trust Strip (Wise bullet link style) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#163300]/10 dark:border-[#9FE870]/20">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#163300] dark:text-[#9FE870] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-[#163300] dark:text-white uppercase tracking-wider">Đạt Chuẩn PCCC</div>
                <div className="text-[11px] text-[#495E35] dark:text-emerald-200/70 mt-0.5">Nghiệm thu QCVN 06:2022</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Zap className="w-5 h-5 text-[#163300] dark:text-[#9FE870] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-[#163300] dark:text-white uppercase tracking-wider">AI Local 80ms</div>
                <div className="text-[11px] text-[#495E35] dark:text-emerald-200/70 mt-0.5">Phản hồi tức thì, không lộ data</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#163300] dark:text-[#9FE870] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-[#163300] dark:text-white uppercase tracking-wider">True Cost Index</div>
                <div className="text-[11px] text-[#495E35] dark:text-emerald-200/70 mt-0.5">0 phụ phí, rõ ràng chi phí thật</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Iconic Wise Calculator Widget ─── */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#163300] rounded-[28px] p-6 sm:p-8 border border-[#163300]/10 dark:border-[#9FE870]/20 shadow-[0_20px_48px_-12px_rgba(22,51,0,0.12)] space-y-5">
            
            {/* Calculator Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#738565] dark:text-emerald-200/60 uppercase tracking-wider">
                  Dự Toán Ngân Sách
                </div>
                <h3 className="text-lg font-black text-[#163300] dark:text-white tracking-tight">
                  Bộ Tính Chi Phí Thuê Chuẩn Xác
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#E2F7D4] dark:bg-[#223D0D] text-[#163300] dark:text-[#9FE870] text-xs font-bold">
                100% Free
              </span>
            </div>

            <form onSubmit={handleCalculatorSubmit} className="space-y-4">
              
              {/* Row 1: You Send (Your Budget) - Wise Currency Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={budgetInputId} className="block text-xs font-bold text-[#495E35] dark:text-emerald-200/80">
                    Ngân sách thuê hàng tháng
                  </label>
                  <span className="text-[11px] font-bold text-[#163300] dark:text-[#9FE870]">
                    ≈ {(budgetVND / 1000000).toFixed(1)} Triệu / tháng
                  </span>
                </div>

                <div className="flex items-center justify-between bg-[#F7FAF6] dark:bg-[#0E1E09] border-2 border-slate-200/80 dark:border-[#9FE870]/30 rounded-[20px] p-3.5 focus-within:border-[#163300] dark:focus-within:border-[#9FE870] focus-within:ring-4 focus-within:ring-[#9FE870]/25 transition-all shadow-xs">
                  <div className="flex-1 pr-2 min-w-0">
                    <input
                      id={budgetInputId}
                      type="number"
                      step={500000}
                      min={3000000}
                      max={100000000}
                      value={budgetVND}
                      onChange={(e) => setBudgetVND(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-transparent border-none text-2xl sm:text-3xl font-black text-[#163300] dark:text-white focus:outline-none focus:ring-0 py-0 pl-3 pr-1 m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  {/* Currency / Unit Pill */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#163300] border border-[#163300]/15 dark:border-[#9FE870]/30 text-xs font-bold text-[#163300] dark:text-[#9FE870] shrink-0 shadow-2xs">
                    <span>🇻🇳 VNĐ / tháng</span>
                  </div>
                </div>

                {/* Quick Budget Preset Buttons */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-0.5">Mốc nhanh:</span>
                  {[8000000, 15000000, 25000000, 45000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBudgetVND(preset)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        budgetVND === preset
                          ? 'bg-[#163300] text-[#9FE870] shadow-xs scale-105'
                          : 'bg-[#F2F5F0] dark:bg-[#163300] text-[#495E35] dark:text-slate-300 hover:bg-[#E8F8EC] hover:text-[#163300]'
                      }`}
                    >
                      {preset / 1000000} Tr
                    </button>
                  ))}
                </div>
              </div>

              {/* Wise Vertical Route Line with Breakdown Dots */}
              <div className="space-y-2.5 pl-3 py-1 border-l-2 border-[#163300]/15 dark:border-[#9FE870]/30 ml-4">
                {/* Dot 1: Service Fee */}
                <div className="relative pl-4 flex items-center justify-between text-xs">
                  <span className="absolute -left-[1.3125rem] w-3 h-3 rounded-full bg-white dark:bg-[#163300] border-2 border-[#163300] dark:border-[#9FE870]" />
                  <span className="text-[#495E35] dark:text-emerald-200/80 font-medium">Phí dịch vụ & tư vấn AI</span>
                  <span className="font-bold text-[#163300] dark:text-[#9FE870]">0 VND (Miễn phí)</span>
                </div>

                {/* Dot 2: PCCC & Safety */}
                <div className="relative pl-4 flex items-center justify-between text-xs">
                  <span className="absolute -left-[1.3125rem] w-3 h-3 rounded-full bg-white dark:bg-[#163300] border-2 border-[#163300] dark:border-[#9FE870]" />
                  <span className="text-[#495E35] dark:text-emerald-200/80 font-medium">Tiêu chuẩn an toàn PCCC</span>
                  <span className="font-bold text-[#163300] dark:text-[#9FE870]">Đạt chuẩn QCVN</span>
                </div>

                {/* Dot 3: Province Selector */}
                <div className="relative pl-4 flex items-center justify-between text-xs">
                  <span className="absolute -left-[1.3125rem] w-3 h-3 rounded-full bg-white dark:bg-[#163300] border-2 border-[#163300] dark:border-[#9FE870]" />
                  <span className="text-[#495E35] dark:text-emerald-200/80 font-medium">Khu vực tìm kiếm</span>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="bg-transparent font-bold text-[#163300] dark:text-[#9FE870] text-xs focus:outline-none cursor-pointer pr-1"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p} className="bg-white dark:bg-[#163300] text-[#163300] dark:text-white">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Recipient Gets (Apartments Matched) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#495E35] dark:text-emerald-200/80">
                  Số căn hộ AI gợi ý khớp chuẩn 100%
                </label>
                <div className="flex items-center justify-between bg-[#F7FAF6] dark:bg-[#0E1E09] border-2 border-slate-200/80 dark:border-[#9FE870]/30 rounded-[20px] p-3.5 focus-within:border-[#163300] transition-all shadow-xs">
                  <div className="flex-1 pr-2">
                    <div className="text-xl sm:text-2xl font-black text-[#163300] dark:text-[#9FE870]">
                      {estimatedMatches} Căn Hộ
                    </div>
                    <div className="text-[11px] text-[#738565] dark:text-emerald-200/60 font-semibold">
                      Trong kho 1,260 căn hộ đã kiểm định
                    </div>
                  </div>
                  {/* Room Type Selector Pill */}
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-[#163300] border border-[#163300]/10 dark:border-[#9FE870]/30 text-xs font-bold text-[#163300] dark:text-[#9FE870] focus:outline-none cursor-pointer shrink-0"
                  >
                    {ROOM_TYPES.map((r) => (
                      <option key={r} value={r} className="bg-white dark:bg-[#163300] text-[#163300] dark:text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Wise Primary Big Action Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#9FE870] hover:bg-[#8CD85E] text-[#163300] font-black text-base shadow-sm transition-all duration-200 active:scale-98 cursor-pointer mt-2"
              >
                <span>Xem {estimatedMatches} căn hộ phù hợp ngay</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-[11px] text-[#738565] dark:text-emerald-200/60 font-medium">
                Xác thực bởi True Cost Engine & Local SLM AI. Không phí môi giới ẩn.
              </p>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};
