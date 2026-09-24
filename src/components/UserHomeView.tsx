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
  Building2
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { HeroSection } from './home/HeroSection';
import { FeaturedProperties, type FeatureBenefitKey } from './home/FeaturedProperties';
import { GuidedPath } from './home/GuidedPath';
import { FeatureStrip } from './home/FeatureStrip';

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
    <div className="space-y-12 md:space-y-16 pb-16">
      {/* ═══ NEW: Product-Native Hero with Entrance Choreography ═══ */}
      <HeroSection onSearch={onNavigateSearch} />

      {/* ═══ Sanctuary Tuning Dials with Luxury Ambient Border ═══ */}
      <section className="relative rounded-3xl p-[1.5px] overflow-hidden shadow-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent group transition-all">
        <div className="relative z-10 w-full h-full rounded-[22px] atmospheric-panel haven-sheen-sweep p-6 sm:p-8 md:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Bộ Tinh Chỉnh Không Gian Sống</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-100 group-hover:text-emerald-300 [data-theme='light']_:group-hover:text-emerald-700 transition-colors">
                Chọn các yếu tố ưu tiên cho tổ ấm của bạn
              </h2>
              <p className="text-slate-400 text-sm">
                Kích hoạt nhanh các tiêu chuẩn môi trường & tiện ích để hệ thống AI tự động tìm những căn hộ tương thích nhất.
              </p>
            </div>

            <button
              onClick={handleApplyTuning}
              className="haven-btn-beam inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25 shrink-0 self-start md:self-auto hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Áp Dụng Tinh Chỉnh</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        {/* Sensory Dials Row (10 Criteria - 10 Unique Color Palettes on Hover & Active) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {/* Dial 1: Yên tĩnh (Indigo) */}
          <button
            type="button"
            onClick={() => setTuningQuiet(!tuningQuiet)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningQuiet
                ? 'bg-indigo-500/20 [data-theme=\'light\']_:bg-indigo-100 border-indigo-400 [data-theme=\'light\']_:border-indigo-500 text-indigo-300 [data-theme=\'light\']_:text-indigo-950 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <VolumeX className={`w-5 h-5 transition-all duration-300 ${tuningQuiet ? 'text-indigo-400 [data-theme=\'light\']_:text-indigo-700' : 'text-indigo-400/80 group-hover/dial:text-indigo-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningQuiet ? 'bg-indigo-400 [data-theme=\'light\']_:bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-indigo-400 group-hover/dial:shadow-[0_0_8px_rgba(99,102,241,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-indigo-300 transition-colors">Yên Tĩnh Tuyệt Đối</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Cách âm, không ồn xe</div>
            </div>
          </button>

          {/* Dial 2: Không ngập lụt (Sky Blue) */}
          <button
            type="button"
            onClick={() => setTuningFloodSafe(!tuningFloodSafe)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningFloodSafe
                ? 'bg-sky-500/20 [data-theme=\'light\']_:bg-sky-100 border-sky-400 [data-theme=\'light\']_:border-sky-500 text-sky-300 [data-theme=\'light\']_:text-sky-950 ring-2 ring-sky-500/50 shadow-lg shadow-sky-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-sky-400 hover:ring-2 hover:ring-sky-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <CloudRain className={`w-5 h-5 transition-all duration-300 ${tuningFloodSafe ? 'text-sky-400 [data-theme=\'light\']_:text-sky-700' : 'text-sky-400/80 group-hover/dial:text-sky-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningFloodSafe ? 'bg-sky-400 [data-theme=\'light\']_:bg-sky-600 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-sky-400 group-hover/dial:shadow-[0_0_8px_rgba(56,189,248,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-sky-300 transition-colors">Không Lo Ngập Lụt</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Cốt nền cao, thoát nước</div>
            </div>
          </button>

          {/* Dial 3: Chỗ đỗ ô tô (Emerald) */}
          <button
            type="button"
            onClick={() => setTuningCarParking(!tuningCarParking)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningCarParking
                ? 'bg-emerald-500/20 [data-theme=\'light\']_:bg-emerald-100 border-emerald-400 [data-theme=\'light\']_:border-emerald-500 text-emerald-300 [data-theme=\'light\']_:text-emerald-950 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-emerald-400 hover:ring-2 hover:ring-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Car className={`w-5 h-5 transition-all duration-300 ${tuningCarParking ? 'text-emerald-400 [data-theme=\'light\']_:text-emerald-700' : 'text-emerald-400/80 group-hover/dial:text-emerald-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningCarParking ? 'bg-emerald-400 [data-theme=\'light\']_:bg-emerald-600 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-emerald-400 group-hover/dial:shadow-[0_0_8px_rgba(52,211,153,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-emerald-300 transition-colors">Chỗ Đỗ Ô Tô Hầm</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Xe SUV & sạc EV</div>
            </div>
          </button>

          {/* Dial 4: Tầng cao đón gió (Teal) */}
          <button
            type="button"
            onClick={() => setTuningHighFloor(!tuningHighFloor)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningHighFloor
                ? 'bg-teal-500/20 [data-theme=\'light\']_:bg-teal-100 border-teal-400 [data-theme=\'light\']_:border-teal-500 text-teal-300 [data-theme=\'light\']_:text-teal-950 ring-2 ring-teal-500/50 shadow-lg shadow-teal-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-teal-400 hover:ring-2 hover:ring-teal-400/50 hover:shadow-[0_0_20px_rgba(45,212,191,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Wind className={`w-5 h-5 transition-all duration-300 ${tuningHighFloor ? 'text-teal-400 [data-theme=\'light\']_:text-teal-700' : 'text-teal-400/80 group-hover/dial:text-teal-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningHighFloor ? 'bg-teal-400 [data-theme=\'light\']_:bg-teal-600 shadow-[0_0_8px_rgba(45,212,191,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-teal-400 group-hover/dial:shadow-[0_0_8px_rgba(45,212,191,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-teal-300 transition-colors">Tầng Cao Đón Gió</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Tầng 8+, view thoáng mát</div>
            </div>
          </button>

          {/* Dial 5: Nuôi thú cưng (Rose Red) */}
          <button
            type="button"
            onClick={() => setTuningPetFriendly(!tuningPetFriendly)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningPetFriendly
                ? 'bg-rose-500/20 [data-theme=\'light\']_:bg-rose-100 border-rose-400 [data-theme=\'light\']_:border-rose-500 text-rose-300 [data-theme=\'light\']_:text-rose-950 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-rose-400 hover:ring-2 hover:ring-rose-400/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <PawPrint className={`w-5 h-5 transition-all duration-300 ${tuningPetFriendly ? 'text-rose-400 [data-theme=\'light\']_:text-rose-700' : 'text-rose-400/80 group-hover/dial:text-rose-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningPetFriendly ? 'bg-rose-400 [data-theme=\'light\']_:bg-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-rose-400 group-hover/dial:shadow-[0_0_8px_rgba(244,63,94,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-rose-300 transition-colors">Cho Phép Thú Cưng</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Có công viên dạo bộ</div>
            </div>
          </button>

          {/* Dial 6: Gần Metro (Amber Gold) */}
          <button
            type="button"
            onClick={() => setTuningMetroNearby(!tuningMetroNearby)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningMetroNearby
                ? 'bg-amber-500/20 [data-theme=\'light\']_:bg-amber-100 border-amber-400 [data-theme=\'light\']_:border-amber-500 text-amber-300 [data-theme=\'light\']_:text-amber-950 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-amber-400 hover:ring-2 hover:ring-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Train className={`w-5 h-5 transition-all duration-300 ${tuningMetroNearby ? 'text-amber-400 [data-theme=\'light\']_:text-amber-700' : 'text-amber-400/80 group-hover/dial:text-amber-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningMetroNearby ? 'bg-amber-400 [data-theme=\'light\']_:bg-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-amber-400 group-hover/dial:shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-amber-300 transition-colors">Gần Trạm Metro</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Đi bộ dưới 5 phút</div>
            </div>
          </button>

          {/* Dial 7: Ban công (Lime Citrus Green) */}
          <button
            type="button"
            onClick={() => setTuningBalcony(!tuningBalcony)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningBalcony
                ? 'bg-lime-500/20 [data-theme=\'light\']_:bg-lime-100 border-lime-400 [data-theme=\'light\']_:border-lime-500 text-lime-300 [data-theme=\'light\']_:text-lime-950 ring-2 ring-lime-500/50 shadow-lg shadow-lime-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-lime-400 hover:ring-2 hover:ring-lime-400/50 hover:shadow-[0_0_20px_rgba(163,230,53,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Maximize2 className={`w-5 h-5 transition-all duration-300 ${tuningBalcony ? 'text-lime-400 [data-theme=\'light\']_:text-lime-700' : 'text-lime-400/80 group-hover/dial:text-lime-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningBalcony ? 'bg-lime-400 [data-theme=\'light\']_:bg-lime-600 shadow-[0_0_8px_rgba(163,230,53,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-lime-400 group-hover/dial:shadow-[0_0_8px_rgba(163,230,53,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-lime-300 transition-colors">Ban Công Rộng Rãi</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Đón nắng sớm, trồng cây</div>
            </div>
          </button>

          {/* Dial 8: Hồ bơi & Gym (Cobalt Ocean Blue) */}
          <button
            type="button"
            onClick={() => setTuningPoolGym(!tuningPoolGym)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningPoolGym
                ? 'bg-blue-500/20 [data-theme=\'light\']_:bg-blue-100 border-blue-400 [data-theme=\'light\']_:border-blue-500 text-blue-300 [data-theme=\'light\']_:text-blue-950 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-blue-400 hover:ring-2 hover:ring-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Waves className={`w-5 h-5 transition-all duration-300 ${tuningPoolGym ? 'text-blue-400 [data-theme=\'light\']_:text-blue-700' : 'text-blue-400/80 group-hover/dial:text-blue-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningPoolGym ? 'bg-blue-400 [data-theme=\'light\']_:bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-blue-400 group-hover/dial:shadow-[0_0_8px_rgba(59,130,246,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-blue-300 transition-colors">Hồ Bơi & Phòng Gym</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Tiện ích resort cao cấp</div>
            </div>
          </button>

          {/* Dial 9: An ninh 24/7 (Fuchsia Purple) */}
          <button
            type="button"
            onClick={() => setTuningSecurity(!tuningSecurity)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningSecurity
                ? 'bg-purple-500/20 [data-theme=\'light\']_:bg-purple-100 border-purple-400 [data-theme=\'light\']_:border-purple-500 text-purple-300 [data-theme=\'light\']_:text-purple-950 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-purple-400 hover:ring-2 hover:ring-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className={`w-5 h-5 transition-all duration-300 ${tuningSecurity ? 'text-purple-400 [data-theme=\'light\']_:text-purple-700' : 'text-purple-400/80 group-hover/dial:text-purple-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningSecurity ? 'bg-purple-400 [data-theme=\'light\']_:bg-purple-600 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-purple-400 group-hover/dial:shadow-[0_0_8px_rgba(168,85,247,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-purple-300 transition-colors">An Ninh Đa Lớp 24/7</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Camera AI & thẻ từ</div>
            </div>
          </button>

          {/* Dial 10: Gần trường & BV (Sunset Orange) */}
          <button
            type="button"
            onClick={() => setTuningSchoolHospital(!tuningSchoolHospital)}
            className={`group/dial p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer ${
              tuningSchoolHospital
                ? 'bg-orange-500/20 [data-theme=\'light\']_:bg-orange-100 border-orange-400 [data-theme=\'light\']_:border-orange-500 text-orange-300 [data-theme=\'light\']_:text-orange-950 ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/25'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-orange-400 hover:ring-2 hover:ring-orange-400/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.35)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Building2 className={`w-5 h-5 transition-all duration-300 ${tuningSchoolHospital ? 'text-orange-400 [data-theme=\'light\']_:text-orange-700' : 'text-orange-400/80 group-hover/dial:text-orange-300 group-hover/dial:scale-110'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tuningSchoolHospital ? 'bg-orange-400 [data-theme=\'light\']_:bg-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300 group-hover/dial:bg-orange-400 group-hover/dial:shadow-[0_0_8px_rgba(249,115,22,0.6)]'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900 group-hover/dial:text-orange-300 transition-colors">Gần Trường & BV</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Bán kính dưới 1km</div>
            </div>
          </button>
        </div>
      </div>
    </section>

      {/* ═══ Featured Cities (No zoom on hover, full card elevation + bold text) ═══ */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-slate-100 [data-theme='light']_:text-slate-900 font-bold tracking-tight">Khám Phá Các Thành Phố Trọng Điểm</h2>
            <p className="text-slate-400 [data-theme='light']_:text-slate-600 text-sm mt-1 font-medium">Các khu dân cư tuyển chọn cao cấp tại các đô thị lớn tại Việt Nam.</p>
          </div>
          <button
            onClick={() => onNavigateSearch()}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 [data-theme='light']_:text-emerald-700 hover:text-emerald-300 transition-colors font-bold"
          >
            <span>Xem Tất Cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hanoi */}
          <div
            onClick={() => onNavigateSearch("Hà Nội")}
            className="group relative rounded-3xl p-[2.5px] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-1.5 transition-all duration-300 h-64 sm:h-72"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="animate-spin-beam pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative z-10 w-full h-full rounded-[21px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"
                alt="Hà Nội"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest drop-shadow always-white">Thủ Đô Ngàn Năm</span>
                <h3 className="text-2xl font-serif text-white font-bold drop-shadow-md always-white">Hà Nội</h3>
                <p className="text-xs text-slate-200 font-medium drop-shadow always-white">Penthouse Hồ Tây, Hoàn Kiếm Heritage & Cầu Giấy</p>
              </div>
            </div>
          </div>

          {/* Ho Chi Minh City */}
          <div
            onClick={() => onNavigateSearch("TP. Hồ Chí Minh")}
            className="group relative rounded-3xl p-[2.5px] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-1.5 transition-all duration-300 h-64 sm:h-72"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="animate-spin-beam pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative z-10 w-full h-full rounded-[21px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800"
                alt="TP. Hồ Chí Minh"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest drop-shadow always-white">Đô Thị Sầm Uất</span>
                <h3 className="text-2xl font-serif text-white font-bold drop-shadow-md always-white">TP. Hồ Chí Minh</h3>
                <p className="text-xs text-slate-200 font-medium drop-shadow always-white">View Sông Sài Gòn Quận 1, Thảo Điền & Phú Mỹ Hưng</p>
              </div>
            </div>
          </div>

          {/* Da Nang */}
          <div
            onClick={() => onNavigateSearch("Đà Nẵng")}
            className="group relative rounded-3xl p-[2.5px] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-1.5 transition-all duration-300 h-64 sm:h-72"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="animate-spin-beam pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative z-10 w-full h-full rounded-[21px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800"
                alt="Đà Nẵng"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest drop-shadow always-white">Thành Phố Đáng Sống</span>
                <h3 className="text-2xl font-serif text-white font-bold drop-shadow-md always-white">Đà Nẵng</h3>
                <p className="text-xs text-slate-200 font-medium drop-shadow always-white">Sky Villa Biển Mỹ Khê & Bán Đảo Sơn Trà</p>
              </div>
            </div>
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

      {/* ═══ Guided Dynamic Visual Conductor ═══ */}
      <GuidedPath
        activeUnitId={activeFocalUnitId}
        activeUnitIndex={activeFocalUnitIndex}
        activeFeatureKey={activeFeatureKey}
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
    </div>
  );
};
