import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  CloudRain, 
  Car, 
  Sliders, 
  VolumeX, 
  Wind, 
  PawPrint, 
  Train,
  Maximize2,
  Waves,
  Building2,
  Compass
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { HeroSection } from './home/HeroSection';
import { FeaturedProperties, type FeatureBenefitKey } from './home/FeaturedProperties';
import { FeatureStrip } from './home/FeatureStrip';
import { SmartImage } from './common/SmartImage';
import { Footer } from './Footer';

interface UserHomeViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onNavigateSearch: (initialQuery?: string) => void;
  onOpenLifestyleMatchmaker?: () => void;
  onOpenVisualVibeModal?: () => void;
}

export const UserHomeView: React.FC<UserHomeViewProps> = ({
  units,
  savedUnitIds,
  onToggleSaveUnit,
  onSelectUnit,
  onNavigateSearch,
  onOpenLifestyleMatchmaker,
  onOpenVisualVibeModal,
}) => {
  // Signature Experience: Property-to-Benefit Sanctuary Journey State
  const [activeFocalUnitId, setActiveFocalUnitId] = useState<string>(units[0]?.id || 'HN-HM-0101');
  const [activeFocalUnitIndex, setActiveFocalUnitIndex] = useState<number>(0);
  const [activeFeatureKey, setActiveFeatureKey] = useState<FeatureBenefitKey>('power');

  const activeUnit = units.find(u => u.id === activeFocalUnitId) || units[0];

  const handleSelectUnitFocal = (unitId: string, primaryFeature: FeatureBenefitKey, index?: number) => {
    setActiveFocalUnitId(unitId);
    setActiveFeatureKey(primaryFeature);
    if (typeof index === 'number') {
      setActiveFocalUnitIndex(index);
    } else {
      const idx = units.slice(0, 3).findIndex(u => u.id === unitId);
      if (idx !== -1) setActiveFocalUnitIndex(idx);
    }
  };

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

  return (
    <div className="space-y-10 md:space-y-12 pb-0">
      {/* ═══ NEW: Product-Native Hero with Entrance Choreography ═══ */}
      <HeroSection 
        onSearch={onNavigateSearch} 
        onOpenLifestyleMatchmaker={onOpenLifestyleMatchmaker} 
        onOpenVisualVibeModal={onOpenVisualVibeModal}
      />

      {/* ═══ WISE SECTION: 11 Provinces / Cities Ticker (Wise Flags Marquee) ═══ */}
      <div className="w-full bg-white dark:bg-[#163300] rounded-2xl p-3 sm:p-4 border border-[#163300]/10 dark:border-[#9FE870]/20 shadow-xs flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full bg-[#9FE870] text-[#163300] font-bold text-xs sm:text-sm">
          <ArrowRight className="w-4 h-4" />
          <span>11 Tỉnh Thành</span>
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {[
            { name: 'Hà Nội', icon: '🏛️', count: '320+' },
            { name: 'TP. Hồ Chí Minh', icon: '🏙️', count: '410+' },
            { name: 'Đà Nẵng', icon: '🌉', count: '180+' },
            { name: 'Thái Nguyên', icon: '🌲', count: '95+' },
            { name: 'Hải Phòng', icon: '⚓', count: '75+' },
            { name: 'Cần Thơ', icon: '🛶', count: '50+' },
            { name: 'Nha Trang', icon: '🏖️', count: '65+' },
            { name: 'Bình Dương', icon: '🏭', count: '85+' },
            { name: 'Vũng Tàu', icon: '🌊', count: '45+' },
            { name: 'Huế', icon: '🏯', count: '35+' },
            { name: 'Quảng Ninh', icon: '⛵', count: '40+' },
          ].map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => onNavigateSearch(city.name)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2F5F0] dark:bg-[#0E1E09] hover:bg-[#9FE870] dark:hover:bg-[#9FE870] text-[#163300] dark:text-emerald-100 hover:text-[#163300] dark:hover:text-[#163300] border border-[#163300]/10 dark:border-[#9FE870]/20 font-bold text-xs transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              <span>{city.icon}</span>
              <span>{city.name}</span>
              <span className="text-[10px] font-semibold opacity-70">({city.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ WISE SECTION: For People Going Places (Wise 2-Feature Cards) ═══ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-[#163300] dark:text-white uppercase tracking-tight">
            DÀNH CHO NGƯỜI TÌM NHÀ THÔNG THÁI
          </h2>
          <span className="text-xs font-bold text-[#495E35] dark:text-emerald-200/70 uppercase tracking-wider hidden sm:inline">
            Công Nghệ Độc Bản HAVEN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Wise Lime Green Card */}
          <div className="bg-[#9FE870] rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[280px] shadow-sm transition-transform hover:-translate-y-1 duration-200">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163300]/10 text-xs font-bold text-[#163300] uppercase tracking-wider">
                <span>01 · Khảo Sát Giác Quan</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#163300] tracking-tight leading-tight">
                Khảo sát Lifestyle 6 bước.<br />
                Đo lường 10 tiêu chí giác quan.
              </h3>
              <p className="text-[#163300]/80 font-medium text-sm sm:text-base leading-relaxed">
                Đánh giá mức độ cách âm, ban công đón nắng gió, an toàn ngập lụt và chỗ đỗ ô tô trước khi quyết định ký hợp đồng.
              </p>
            </div>
            <div className="pt-6">
              {onOpenLifestyleMatchmaker ? (
                <button
                  type="button"
                  onClick={onOpenLifestyleMatchmaker}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#163300] hover:bg-[#223D0D] text-[#9FE870] font-bold text-sm transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span>Làm bài khảo sát 2 phút</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Card 2: Wise Dark Forest Green Card */}
          <div className="bg-[#163300] rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[280px] shadow-sm transition-transform hover:-translate-y-1 duration-200">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9FE870]/20 text-xs font-bold text-[#9FE870] uppercase tracking-wider">
                <span>02 · Thị Giác AI CLIP</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white always-white tracking-tight leading-tight">
                Tìm kiếm bằng thị giác AI.<br />
                Khớp 818 vector đặc trưng.
              </h3>
              <p className="text-emerald-100/80 always-white font-medium text-sm sm:text-base leading-relaxed">
                Chỉ cần tải lên 1 tấm ảnh không gian bạn mơ ước từ Pinterest hay Instagram. Mô hình AI CLIP sẽ tìm ngay căn hộ tương đồng nhất.
              </p>
            </div>
            <div className="pt-6">
              {onOpenVisualVibeModal ? (
                <button
                  type="button"
                  onClick={onOpenVisualVibeModal}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#9FE870] hover:bg-[#8CD85E] text-[#163300] font-bold text-sm transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span>Thử Visual Vibe ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Sanctuary Tuning Dials - Wise Signature Style ═══ */}
      <section className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 md:p-10 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8EC] dark:bg-[#163300] text-[#163300] dark:text-[#9FE870] font-bold text-xs uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
              <span>Bộ Tinh Chỉnh Không Gian Sống</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#163300] dark:text-white">
              Chọn các yếu tố ưu tiên cho tổ ấm của bạn
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Kích hoạt nhanh các tiêu chuẩn môi trường & tiện ích để hệ thống AI tự động tìm những căn hộ tương thích nhất.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
            {onOpenLifestyleMatchmaker && (
              <button
                type="button"
                onClick={onOpenLifestyleMatchmaker}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 hover:bg-[#E8F8EC] dark:hover:bg-[#163300] text-[#163300] dark:text-[#9FE870] font-bold text-xs transition-all cursor-pointer shadow-2xs"
              >
                <Compass className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                <span>Khảo Sát Nhu Cầu Sống</span>
              </button>
            )}
            <button
              onClick={handleApplyTuning}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Áp Dụng Tinh Chỉnh</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sensory Dials Row (10 Criteria - 10 100% Unique Harmonious Color Identities) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {/* Dial 1: Yên tĩnh (Forest Green #163300) */}
          <button
            type="button"
            onClick={() => setTuningQuiet(!tuningQuiet)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningQuiet
                ? 'bg-[#E8F8EC] dark:bg-[#163300]/40 border-2 border-[#163300] dark:border-[#9FE870] text-[#163300] dark:text-[#9FE870] -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#163300] dark:hover:border-[#9FE870] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <VolumeX className={`w-5 h-5 transition-colors ${tuningQuiet ? 'text-[#163300] dark:text-[#9FE870]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningQuiet ? 'bg-[#163300] dark:bg-[#9FE870]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Yên Tĩnh Tuyệt Đối</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Cách âm, không ồn xe</div>
            </div>
          </button>

          {/* Dial 2: Không ngập lụt (Ocean Cyan #0284C7) */}
          <button
            type="button"
            onClick={() => setTuningFloodSafe(!tuningFloodSafe)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningFloodSafe
                ? 'bg-[#E0F2FE] dark:bg-sky-950/40 border-2 border-[#0284C7] text-[#0369A1] dark:text-sky-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#0284C7] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <CloudRain className={`w-5 h-5 transition-colors ${tuningFloodSafe ? 'text-[#0284C7]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningFloodSafe ? 'bg-[#0284C7]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Không Lo Ngập Lụt</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Cốt nền cao, thoát nước</div>
            </div>
          </button>

          {/* Dial 3: Chỗ đỗ ô tô (Electric Cobalt #2570EB) */}
          <button
            type="button"
            onClick={() => setTuningCarParking(!tuningCarParking)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningCarParking
                ? 'bg-[#EBF2FF] dark:bg-blue-950/40 border-2 border-[#2570EB] text-[#1E40AF] dark:text-blue-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#2570EB] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Car className={`w-5 h-5 transition-colors ${tuningCarParking ? 'text-[#2570EB]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningCarParking ? 'bg-[#2570EB]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Chỗ Đỗ Ô Tô Hầm</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Xe SUV & sạc EV</div>
            </div>
          </button>

          {/* Dial 4: Tầng cao đón gió (Sky Azure #0EA5E9) */}
          <button
            type="button"
            onClick={() => setTuningHighFloor(!tuningHighFloor)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningHighFloor
                ? 'bg-[#F0F9FF] dark:bg-cyan-950/40 border-2 border-[#0EA5E9] text-[#0369A1] dark:text-cyan-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#0EA5E9] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Wind className={`w-5 h-5 transition-colors ${tuningHighFloor ? 'text-[#0EA5E9]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningHighFloor ? 'bg-[#0EA5E9]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Tầng Cao Đón Gió</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tầng 8+, view thoáng mát</div>
            </div>
          </button>

          {/* Dial 5: Nuôi thú cưng (Terracotta Coral #EA580C) */}
          <button
            type="button"
            onClick={() => setTuningPetFriendly(!tuningPetFriendly)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningPetFriendly
                ? 'bg-[#FFF7ED] dark:bg-orange-950/40 border-2 border-[#EA580C] text-[#C2410C] dark:text-orange-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#EA580C] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <PawPrint className={`w-5 h-5 transition-colors ${tuningPetFriendly ? 'text-[#EA580C]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningPetFriendly ? 'bg-[#EA580C]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Cho Phép Thú Cưng</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Có công viên dạo bộ</div>
            </div>
          </button>

          {/* Dial 6: Gần Metro (Royal Indigo #4F46E5) */}
          <button
            type="button"
            onClick={() => setTuningMetroNearby(!tuningMetroNearby)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningMetroNearby
                ? 'bg-[#EEF2FF] dark:bg-indigo-950/40 border-2 border-[#4F46E5] text-[#3730A3] dark:text-indigo-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#4F46E5] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Train className={`w-5 h-5 transition-colors ${tuningMetroNearby ? 'text-[#4F46E5]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningMetroNearby ? 'bg-[#4F46E5]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Gần Trạm Metro</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Đi bộ dưới 5 phút</div>
            </div>
          </button>

          {/* Dial 7: Ban công (Emerald Flora #059669) */}
          <button
            type="button"
            onClick={() => setTuningBalcony(!tuningBalcony)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningBalcony
                ? 'bg-[#ECFDF5] dark:bg-emerald-950/40 border-2 border-[#059669] text-[#065F46] dark:text-emerald-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#059669] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Maximize2 className={`w-5 h-5 transition-colors ${tuningBalcony ? 'text-[#059669]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningBalcony ? 'bg-[#059669]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Ban Công Rộng Rãi</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Đón nắng sớm, trồng cây</div>
            </div>
          </button>

          {/* Dial 8: Hồ bơi & Gym (Sunshine Gold #D97706) */}
          <button
            type="button"
            onClick={() => setTuningPoolGym(!tuningPoolGym)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningPoolGym
                ? 'bg-[#FEF3C7] dark:bg-amber-950/40 border-2 border-[#D97706] text-[#92400E] dark:text-amber-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#D97706] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Waves className={`w-5 h-5 transition-colors ${tuningPoolGym ? 'text-[#D97706]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningPoolGym ? 'bg-[#D97706]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Hồ Bơi & Phòng Gym</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tiện ích resort cao cấp</div>
            </div>
          </button>

          {/* Dial 9: An ninh 24/7 (Ruby Crimson #DC2626) */}
          <button
            type="button"
            onClick={() => setTuningSecurity(!tuningSecurity)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningSecurity
                ? 'bg-[#FEF2F2] dark:bg-red-950/40 border-2 border-[#DC2626] text-[#991B1B] dark:text-red-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#DC2626] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className={`w-5 h-5 transition-colors ${tuningSecurity ? 'text-[#DC2626]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningSecurity ? 'bg-[#DC2626]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">An Ninh Đa Lớp 24/7</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Camera AI & thẻ từ</div>
            </div>
          </button>

          {/* Dial 10: Gần trường & BV (Amethyst Purple #7C3AED) */}
          <button
            type="button"
            onClick={() => setTuningSchoolHospital(!tuningSchoolHospital)}
            className={`p-4 rounded-[22px] border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 cursor-pointer ${
              tuningSchoolHospital
                ? 'bg-[#F5F3FF] dark:bg-purple-950/40 border-2 border-[#7C3AED] text-[#5B21B6] dark:text-purple-300 -translate-y-1 shadow-sm'
                : 'bg-[#F2F5F0] dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#7C3AED] hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Building2 className={`w-5 h-5 transition-colors ${tuningSchoolHospital ? 'text-[#7C3AED]' : 'text-slate-500'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${tuningSchoolHospital ? 'bg-[#7C3AED]' : 'bg-slate-300 dark:bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white">Gần Trường & BV</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Bán kính dưới 1km</div>
            </div>
          </button>
        </div>
      </section>

      {/* ═══ Featured Cities - Wise Signature Cards ═══ */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-white tracking-tight">
              Khám Phá Các Thành Phố Trọng Điểm
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">
              Các khu dân cư tuyển chọn cao cấp tại các đô thị lớn tại Việt Nam.
            </p>
          </div>
          <button
            onClick={() => onNavigateSearch()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#163300] dark:text-[#9FE870] hover:text-[#163300] transition-colors cursor-pointer"
          >
            <span>Xem Tất Cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hanoi */}
          <div
            onClick={() => onNavigateSearch("Hà Nội")}
            className="group relative rounded-[28px] overflow-hidden cursor-pointer border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#163300]/40 dark:hover:border-[#9FE870]/40 transition-all duration-300 ease-out h-64 sm:h-72"
          >
            <SmartImage
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
              alt="Hà Nội"
              width={800}
              quality={75}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#163300] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-bold text-[#9FE870] uppercase tracking-wider drop-shadow-sm">Thủ Đô Ngàn Năm</span>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">Hà Nội</h3>
              <p className="text-xs text-white/90 font-medium drop-shadow-sm">Penthouse Hồ Tây, Hoàn Kiếm Heritage & Cầu Giấy</p>
            </div>
          </div>

          {/* Ho Chi Minh City */}
          <div
            onClick={() => onNavigateSearch("TP. Hồ Chí Minh")}
            className="group relative rounded-[28px] overflow-hidden cursor-pointer border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#163300]/40 dark:hover:border-[#9FE870]/40 transition-all duration-300 ease-out h-64 sm:h-72"
          >
            <SmartImage
              src="https://images.unsplash.com/photo-1583417319070-4a69db38a482"
              alt="TP. Hồ Chí Minh"
              width={800}
              quality={75}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#163300] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-bold text-[#9FE870] uppercase tracking-wider drop-shadow-sm">Đô Thị Sầm Uất</span>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">TP. Hồ Chí Minh</h3>
              <p className="text-xs text-white/90 font-medium drop-shadow-sm">View Sông Sài Gòn Quận 1, Thảo Điền & Phú Mỹ Hưng</p>
            </div>
          </div>

          {/* Da Nang */}
          <div
            onClick={() => onNavigateSearch("Đà Nẵng")}
            className="group relative rounded-[28px] overflow-hidden cursor-pointer border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#163300]/40 dark:hover:border-[#9FE870]/40 transition-all duration-300 ease-out h-64 sm:h-72"
          >
            <SmartImage
              src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b"
              alt="Đà Nẵng"
              width={800}
              quality={75}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#163300] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-bold text-[#9FE870] uppercase tracking-wider drop-shadow-sm">Thành Phố Đáng Sống</span>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">Đà Nẵng</h3>
              <p className="text-xs text-white/90 font-medium drop-shadow-sm">Sky Villa Biển Mỹ Khê & Bán Đảo Sơn Trà</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WISE SECTION: Meet Living Without Borders (Dark Forest Signature Section) ═══ */}
      <section className="relative w-full rounded-3xl bg-[#163300] p-8 sm:p-12 lg:p-16 text-center space-y-6 overflow-hidden border border-[#9FE870]/30 shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9FE870]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9FE870]/20 text-[#9FE870] font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#9FE870]" />
            <span>Minh Bạch 100% · Không Chi Phí Ẩn</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#9FE870] tracking-tight uppercase leading-tight">
            SỐNG AN TÂM, KHÔNG LO PHỤ PHÍ.
          </h2>

          <p className="text-emerald-100/90 always-white text-sm sm:text-base md:text-lg leading-relaxed font-medium">
            HAVEN xoá bỏ mọi rào cản thông tin giữa người thuê và chủ nhà. Mỗi căn hộ đều sở hữu hồ sơ nghiệm thu PCCC QCVN 06:2022, biểu đồ chi phí thực tế True Cost Index và cam kết không phát sinh bất kỳ khoản phí ngoài hợp đồng.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateSearch()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#9FE870] hover:bg-[#8CD85E] text-[#163300] font-black text-sm sm:text-base transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Khám phá 1,260 căn hộ ngay</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {onOpenLifestyleMatchmaker && (
              <button
                type="button"
                onClick={onOpenLifestyleMatchmaker}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-transparent hover:bg-white/10 text-white always-white border border-white/30 font-bold text-sm sm:text-base transition-all cursor-pointer"
              >
                <span>Đo lường nhu cầu sống</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ═══ SIGNATURE EXPERIENCE: PROPERTY → VERIFIED FEATURE → USER BENEFIT ═══ */}
      <FeaturedProperties
        units={units}
        savedUnitIds={savedUnitIds}
        activeUnitId={activeFocalUnitId}
        activeUnitIndex={activeFocalUnitIndex}
        activeFeatureKey={activeFeatureKey}
        onSelectUnitFocal={handleSelectUnitFocal}
        onSelectFeatureKey={setActiveFeatureKey}
        onToggleSaveUnit={onToggleSaveUnit}
        onSelectUnit={onSelectUnit}
        onNavigateSearch={() => onNavigateSearch()}
        totalCount={units.length}
      />

      {/* ═══ Environmental Proof Feature Strip (Resonates with Active Unit) ═══ */}
      <FeatureStrip
        activeFeatureKey={activeFeatureKey}
        onSelectFeature={(featKey) => {
          setActiveFeatureKey(featKey);
          // Maintain bidirectional causality with the top 3 featured units
          const top3 = units.slice(0, 3);
          if (featKey === 'flood') {
            if (top3[1]) {
              setActiveFocalUnitId(top3[1].id);
              setActiveFocalUnitIndex(1);
            }
          } else if (featKey === 'parking') {
            if (top3[2]) {
              setActiveFocalUnitId(top3[2].id);
              setActiveFocalUnitIndex(2);
            }
          } else {
            if (top3[0]) {
              setActiveFocalUnitId(top3[0].id);
              setActiveFocalUnitIndex(0);
            }
          }
        }}
        activeUnitName={activeUnit?.name || activeUnit?.id}
      />

      {/* ═══ Luxury PropTech Footer ═══ */}
      <Footer
        onNavigateToSearch={onNavigateSearch}
        onOpenLifestyleModal={onOpenLifestyleMatchmaker}
        onOpenVisualModal={onOpenVisualVibeModal}
      />
    </div>
  );
};
