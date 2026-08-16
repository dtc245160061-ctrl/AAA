import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CloudRain, 
  Car, 
  Zap, 
  CheckCircle2, 
  Bookmark, 
  Sliders, 
  VolumeX, 
  Wind, 
  PawPrint, 
  Compass,
  Train,
  Maximize2,
  Waves,
  Building2
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { calculateMatchScore } from '../services/aiAdvisorService';

interface UserHomeViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onNavigateSearch: (initialQuery?: string) => void;
}

export const UserHomeView: React.FC<UserHomeViewProps> = ({
  units,
  savedUnitIds,
  onToggleSaveUnit,
  onSelectUnit,
  onNavigateSearch
}) => {
  const [aiPromptInput, setAiPromptInput] = useState('');
  
  // Sanctuary Tuning Dial States (10 Sensory & Lifestyle Criteria)
  const [tuningQuiet, setTuningQuiet] = useState(false);
  const [tuningFloodSafe, setTuningFloodSafe] = useState(false);
  const [tuningCarParking, setTuningCarParking] = useState(false);
  const [tuningHighFloor, setTuningHighFloor] = useState(false);
  const [tuningPetFriendly, setTuningPetFriendly] = useState(false);
  const [tuningMetroNearby, setTuningMetroNearby] = useState(false);
  const [tuningBalcony, setTuningBalcony] = useState(false);
  const [tuningPoolGym, setTuningPoolGym] = useState(false);
  const [tuningSecurity, setTuningSecurity] = useState(false);
  const [tuningSchoolHospital, setTuningSchoolHospital] = useState(false);

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPromptInput.trim()) {
      onNavigateSearch(aiPromptInput.trim());
    } else {
      onNavigateSearch();
    }
  };

  const handleApplyTuning = () => {
    const parts: string[] = [];
    if (tuningQuiet) parts.push('yên tĩnh');
    if (tuningFloodSafe) parts.push('không ngập lụt');
    if (tuningCarParking) parts.push('chỗ đỗ ô tô');
    if (tuningHighFloor) parts.push('tầng cao đón gió');
    if (tuningPetFriendly) parts.push('nuôi thú cưng');
    if (tuningMetroNearby) parts.push('gần metro');
    if (tuningBalcony) parts.push('ban công rộng');
    if (tuningPoolGym) parts.push('hồ bơi gym');
    if (tuningSecurity) parts.push('an ninh thẻ từ');
    if (tuningSchoolHospital) parts.push('gần trường học');

    if (parts.length > 0) {
      onNavigateSearch(`căn hộ ${parts.join(', ')}`);
    } else {
      onNavigateSearch();
    }
  };

  const featuredUnits = units.slice(0, 6);

  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-500">
      {/* Editorial Botanical Hero Section */}
      <section className="relative rounded-3xl overflow-hidden min-h-[580px] flex flex-col justify-between p-8 md:p-14 border border-emerald-500/30 shadow-2xl">
        {/* Background Image with Deep Gradient Scrim Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600"
            alt="HAVEN Luxury Residence"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        {/* Top Tagline Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/70 border border-emerald-400/40 text-emerald-300 text-xs font-mono tracking-wider uppercase backdrop-blur-md shadow-lg always-white">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-300">HAVEN — Không Gian Sống An Yên</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-200">
            <span className="scrim-subtle always-white">Hà Nội • TP.HCM • Đà Nẵng</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="scrim-subtle always-white">Trợ Lý AI Phân Tích Môi Trường</span>
          </div>
        </div>

        {/* Center Editorial Title & AI Search Prompt Bar */}
        <div className="relative z-10 max-w-3xl my-6 space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.08] scrim-deep always-white">
            Tìm nơi ở <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-200">
              thực sự thuộc về bạn.
            </span>
          </h1>

          <p className="text-slate-100 text-base md:text-lg font-sans max-w-2xl leading-relaxed font-light scrim-subtle always-white">
            Không chỉ là 4 bức tường. HAVEN thấu hiểu phong cách sống và đánh giá toàn diện nguy cơ ngập úng, độ ồn, chỗ đỗ xe ô tô và nguồn điện dự phòng để bạn tìm được căn nhà ưng ý nhất.
          </p>

          {/* AI Search Prompt Form */}
          <form onSubmit={handleAiSearchSubmit} className="relative mt-6 max-w-2xl">
            <div className="relative flex items-center rounded-2xl bg-slate-950/80 border border-emerald-500/40 p-2 shadow-2xl backdrop-blur-xl group focus-within:border-emerald-400 transition-all duration-300">
              <div className="pl-4 pr-2 text-emerald-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <input
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder='Nhập nhu cầu của bạn e.g. "căn 2 phòng ở HN tầm 18 củ có ô tô, tầng cao"'
                className="w-full bg-transparent border-none text-white placeholder:text-slate-400 text-sm md:text-base focus:outline-none focus:ring-0 pr-4 py-3"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm transition-all duration-200 shadow-lg shadow-emerald-500/30 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Hỏi AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pl-2 text-xs font-mono text-slate-200">
              <span className="text-slate-300 font-semibold always-white">Gợi ý tìm kiếm AI:</span>
              <button
                type="button"
                onClick={() => onNavigateSearch("căn 2 phòng ở HN tầm 18 củ có ô tô")}
                className="px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-emerald-950/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 always-white transition-colors"
              >
                "căn 2 phòng HN tầm 18 củ có ô tô"
              </button>
              <button
                type="button"
                onClick={() => onNavigateSearch("2pn tây hồ dưới 20 củ, tầng cao")}
                className="px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-emerald-950/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 always-white transition-colors"
              >
                "2pn tây hồ dưới 20 củ, tầng cao"
              </button>
              <button
                type="button"
                onClick={() => onNavigateSearch("vợ chồng 1 con, cầu giấy, yên tĩnh")}
                className="px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-emerald-950/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 always-white transition-colors"
              >
                "vợ chồng 1 con, cầu giấy, yên tĩnh"
              </button>
              <button
                type="button"
                onClick={() => onNavigateSearch("sky villa ngắm biển mỹ khê")}
                className="px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-emerald-950/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 always-white transition-colors"
              >
                "sky villa ngắm biển mỹ khê"
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs font-mono text-slate-200">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="scrim-subtle always-white">Kiểm Định Pháp Lý Rõ Ràng</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Car className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="scrim-subtle always-white">Chỗ Đỗ Ô Tô Hầm Thông Minh</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="scrim-subtle always-white">Đánh Giá Ngập Úng & Mưa Bão</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="scrim-subtle always-white">Điện Dự Phòng 100% Tự Động</span>
          </div>
        </div>
      </section>

      {/* Sanctuary Tuning Dial (Origin Aesthetic Interactive Experience - 10 Criteria) */}
      <section className="relative rounded-3xl atmospheric-panel border border-emerald-500/30 p-8 md:p-10 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Bộ Tinh Chỉnh Không Gian Sống (Sanctuary Tuning Dial)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-slate-100">
              Chọn các yếu tố ưu tiên cho tổ ấm của bạn
            </h2>
            <p className="text-slate-400 text-sm">
              Kích hoạt nhanh các tiêu chuẩn môi trường & tiện ích để hệ thống AI tự động tìm những căn hộ tương thích nhất.
            </p>
          </div>

          <button
            onClick={handleApplyTuning}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25 shrink-0 self-start md:self-auto hover:scale-105 active:scale-95"
          >
            <span>Áp Dụng Tinh Chỉnh</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sensory Dials Row (10 Criteria) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {/* Dial 1: Yên tĩnh */}
          <button
            type="button"
            onClick={() => setTuningQuiet(!tuningQuiet)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningQuiet
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <VolumeX className={`w-5 h-5 ${tuningQuiet ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningQuiet ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Yên Tĩnh Tuyệt Đối</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Cách âm, không ồn xe</div>
            </div>
          </button>

          {/* Dial 2: Không ngập lụt */}
          <button
            type="button"
            onClick={() => setTuningFloodSafe(!tuningFloodSafe)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningFloodSafe
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 ring-2 ring-sky-500/40 shadow-lg shadow-sky-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <CloudRain className={`w-5 h-5 ${tuningFloodSafe ? 'text-sky-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningFloodSafe ? 'bg-sky-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Không Lo Ngập Lụt</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Cốt nền cao, thoát nước</div>
            </div>
          </button>

          {/* Dial 3: Chỗ đỗ ô tô */}
          <button
            type="button"
            onClick={() => setTuningCarParking(!tuningCarParking)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningCarParking
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Car className={`w-5 h-5 ${tuningCarParking ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningCarParking ? 'bg-amber-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Chỗ Đỗ Ô Tô Hầm</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Xe SUV & sạc EV</div>
            </div>
          </button>

          {/* Dial 4: Tầng cao đón gió (Wind Icon) */}
          <button
            type="button"
            onClick={() => setTuningHighFloor(!tuningHighFloor)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningHighFloor
                ? 'bg-teal-500/20 border-teal-400 text-teal-300 ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Wind className={`w-5 h-5 ${tuningHighFloor ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningHighFloor ? 'bg-teal-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Tầng Cao Đón Gió</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Tầng 8+, view thoáng mát</div>
            </div>
          </button>

          {/* Dial 5: Nuôi thú cưng (PawPrint Icon) */}
          <button
            type="button"
            onClick={() => setTuningPetFriendly(!tuningPetFriendly)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningPetFriendly
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <PawPrint className={`w-5 h-5 ${tuningPetFriendly ? 'text-rose-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningPetFriendly ? 'bg-rose-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Cho Phép Thú Cưng</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Có công viên dạo bộ</div>
            </div>
          </button>

          {/* Dial 6: Gần Metro */}
          <button
            type="button"
            onClick={() => setTuningMetroNearby(!tuningMetroNearby)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningMetroNearby
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Train className={`w-5 h-5 ${tuningMetroNearby ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningMetroNearby ? 'bg-indigo-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Gần Trạm Metro</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Đi bộ dưới 5 phút</div>
            </div>
          </button>

          {/* Dial 7: Ban công thoáng mát */}
          <button
            type="button"
            onClick={() => setTuningBalcony(!tuningBalcony)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningBalcony
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Maximize2 className={`w-5 h-5 ${tuningBalcony ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningBalcony ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Ban Công Rộng Rãi</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Đón nắng sớm, trồng cây</div>
            </div>
          </button>

          {/* Dial 8: Hồ bơi & Gym */}
          <button
            type="button"
            onClick={() => setTuningPoolGym(!tuningPoolGym)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningPoolGym
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Waves className={`w-5 h-5 ${tuningPoolGym ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningPoolGym ? 'bg-cyan-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Hồ Bơi & Phòng Gym</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Tiện ích resort cao cấp</div>
            </div>
          </button>

          {/* Dial 9: An ninh 24/7 */}
          <button
            type="button"
            onClick={() => setTuningSecurity(!tuningSecurity)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningSecurity
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className={`w-5 h-5 ${tuningSecurity ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningSecurity ? 'bg-purple-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">An Ninh Đa Lớp 24/7</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Camera AI & thẻ từ</div>
            </div>
          </button>

          {/* Dial 10: Gần trường học & bệnh viện */}
          <button
            type="button"
            onClick={() => setTuningSchoolHospital(!tuningSchoolHospital)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
              tuningSchoolHospital
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Building2 className={`w-5 h-5 ${tuningSchoolHospital ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningSchoolHospital ? 'bg-amber-400' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Gần Trường & BV</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Bán kính dưới 1km</div>
            </div>
          </button>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-serif text-slate-100 tracking-tight">Khám Phá Các Thành Phố Trọng Điểm</h2>
            <p className="text-slate-400 text-sm mt-1">Các khu dân cư tuyển chọn cao cấp tại các đô thị lớn tại Việt Nam.</p>
          </div>
          <button
            onClick={() => onNavigateSearch()}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
          >
            <span>Xem Tất Cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hanoi Card */}
          <div
            onClick={() => onNavigateSearch("Hà Nội")}
            className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
              alt="Hà Nội"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-widest always-white">Thủ Đô Ngàn Năm</span>
              <h3 className="text-2xl font-serif text-white font-bold always-white">Hà Nội</h3>
              <p className="text-xs text-slate-200 always-white">Penthouse Hồ Tây, Hoàn Kiếm Heritage & Cầu Giấy</p>
            </div>
          </div>

          {/* Ho Chi Minh City Card */}
          <div
            onClick={() => onNavigateSearch("TP. Hồ Chí Minh")}
            className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"
              alt="TP. Hồ Chí Minh"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-widest always-white">Đô Thị Sầm Uất</span>
              <h3 className="text-2xl font-serif text-white font-bold always-white">TP. Hồ Chí Minh</h3>
              <p className="text-xs text-slate-200 always-white">View Sông Sài Gòn Quận 1, Thảo Điền & Phú Mỹ Hưng</p>
            </div>
          </div>

          {/* Da Nang Card */}
          <div
            onClick={() => onNavigateSearch("Đà Nẵng")}
            className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
              alt="Đà Nẵng"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-widest always-white">Thành Phố Đáng Sống</span>
              <h3 className="text-2xl font-serif text-white font-bold always-white">Đà Nẵng</h3>
              <p className="text-xs text-slate-200 always-white">Sky Villa Biển Mỹ Khê & Bán Đảo Sơn Trà</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Residences Showcase */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-serif text-slate-100 tracking-tight">Căn Hộ Nổi Bật Được Đánh Giá Cao</h2>
            <p className="text-slate-400 text-sm mt-1">Danh sách căn hộ có chỉ số tương thích cao và xác thực dữ liệu môi trường.</p>
          </div>
          <button
            onClick={() => onNavigateSearch()}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
          >
            <span>Xem Tất Cả ({units.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredUnits.map((unit) => {
            const isSaved = savedUnitIds.includes(unit.id);
            const matchInfo = calculateMatchScore(unit, {});
            return (
              <div
                key={unit.id}
                className="group product-ui-card rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg hover:-translate-y-1"
              >
                {/* Photo & Badges */}
                <div className="relative h-56 overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                  <img
                    src={unit.images[0]}
                    alt={unit.name || unit.id}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Bar inside Card */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium always-white">
                      {matchInfo.score}% Tương thích AI
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

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-200 always-white">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{unit.district}, {unit.city === 'Hanoi' ? 'Hà Nội' : unit.city === 'Ho Chi Minh City' ? 'TP.HCM' : 'Đà Nẵng'}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 border border-slate-700 always-white">
                      Tầng {unit.floor}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                    <h3 className="font-serif text-lg text-slate-100 group-hover:text-emerald-500 transition-colors line-clamp-1 font-semibold">
                      {unit.name || unit.id}
                    </h3>

                    {/* Specs Row */}
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span>{unit.bedrooms} Phòng ngủ</span>
                      <span>•</span>
                      <span>{unit.bathrooms} WC</span>
                      <span>•</span>
                      <span>{unit.sqm} m²</span>
                    </div>
                  </div>

                  {/* AI Quick Insight */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-500 font-mono font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Điểm Nổi Bật Cốt Lõi</span>
                    </div>
                    <p className="text-slate-300 line-clamp-2 font-sans leading-relaxed">
                      {unit.aiInsights.whyFit[0]}
                    </p>
                  </div>

                  {/* Pricing & CTA Row */}
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
                      Chi Tiết Căn Hộ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Environmental Intelligence Spotlight Banner */}
      <section className="rounded-3xl atmospheric-panel border border-emerald-500/25 p-8 md:p-10 space-y-6 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Hệ Thống Phân Tích Môi Trường Sống Độc Bản</span>
          </div>
          <h2 className="text-3xl font-serif text-slate-100">Dữ Liệu Khí Hậu & Môi Trường Xác Thực</h2>
          <p className="text-slate-300 text-sm leading-relaxed font-light">
            Chúng tôi khảo sát trực tiếp các rủi ro ngập úng mùa mưa bão, khả năng cách âm từ mặt đường, hệ thống máy phát điện dự phòng và chỗ đỗ ô tô thực tế để bạn đưa ra quyết định chính xác nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <CloudRain className="w-5 h-5 text-sky-400" />
            <h4 className="text-sm font-medium text-slate-200">Nguy Cơ Ngập Mùa Mưa</h4>
            <p className="text-xs text-slate-400">Kiểm tra cốt nền đường xá, hệ thống thoát nước trục chính và lịch sử triều cường.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-medium text-slate-200">Máy Phát Điện Dự Phòng</h4>
            <p className="text-xs text-slate-400">Xác thực nguồn phát điện 100% công suất đảm bảo thang máy và điều hòa luôn vận hành.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <Car className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-medium text-slate-200">Chỗ Đỗ Xe Ô Tô SUV</h4>
            <p className="text-xs text-slate-400">Đo lường chính xác kích thước hầm xe và lối vào thay vì phụ thuộc ngõ nhỏ hẹp.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-medium text-slate-200">Mức Độ Yên Tĩnh & Cách Âm</h4>
            <p className="text-xs text-slate-400">Đo lường chỉ số tiếng ồn giao thông dựa trên độ cao tầng và chất lượng kính hộp Low-E.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
