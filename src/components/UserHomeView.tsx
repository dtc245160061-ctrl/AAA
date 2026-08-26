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
  const [activeFocalUnitId, setActiveFocalUnitId] = useState<string>('HN-TÂ-1001');
  const [activeFeatureKey, setActiveFeatureKey] = useState<FeatureBenefitKey>('power');

  const activeUnit = units.find(u => u.id === activeFocalUnitId) || units[0];

  const handleSelectUnitFocal = (unitId: string, primaryFeature: FeatureBenefitKey) => {
    setActiveFocalUnitId(unitId);
    setActiveFeatureKey(primaryFeature);
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

      {/* ═══ Sanctuary Tuning Dials (kept as-is, will redesign in Slice 2) ═══ */}
      <section className="relative rounded-3xl atmospheric-panel atmospheric-panel-hover border border-emerald-500/30 p-6 sm:p-8 md:p-10 space-y-6 shadow-2xl backdrop-blur-2xl group">
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
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25 shrink-0 self-start md:self-auto hover:scale-105 active:scale-95"
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
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningQuiet
                ? 'bg-emerald-500/20 [data-theme=\'light\']_:bg-emerald-100 border-emerald-400 [data-theme=\'light\']_:border-emerald-500 text-emerald-300 [data-theme=\'light\']_:text-emerald-950 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-emerald-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-emerald-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <VolumeX className={`w-5 h-5 ${tuningQuiet ? 'text-emerald-400 [data-theme=\'light\']_:text-emerald-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningQuiet ? 'bg-emerald-400 [data-theme=\'light\']_:bg-emerald-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Yên Tĩnh Tuyệt Đối</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Cách âm, không ồn xe</div>
            </div>
          </button>

          {/* Dial 2: Không ngập lụt */}
          <button
            type="button"
            onClick={() => setTuningFloodSafe(!tuningFloodSafe)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningFloodSafe
                ? 'bg-sky-500/20 [data-theme=\'light\']_:bg-sky-100 border-sky-400 [data-theme=\'light\']_:border-sky-500 text-sky-300 [data-theme=\'light\']_:text-sky-950 ring-2 ring-sky-500/40 shadow-lg shadow-sky-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-sky-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-sky-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <CloudRain className={`w-5 h-5 ${tuningFloodSafe ? 'text-sky-400 [data-theme=\'light\']_:text-sky-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningFloodSafe ? 'bg-sky-400 [data-theme=\'light\']_:bg-sky-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Không Lo Ngập Lụt</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Cốt nền cao, thoát nước</div>
            </div>
          </button>

          {/* Dial 3: Chỗ đỗ ô tô */}
          <button
            type="button"
            onClick={() => setTuningCarParking(!tuningCarParking)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningCarParking
                ? 'bg-amber-500/20 [data-theme=\'light\']_:bg-amber-100 border-amber-400 [data-theme=\'light\']_:border-amber-500 text-amber-300 [data-theme=\'light\']_:text-amber-950 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-amber-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-amber-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Car className={`w-5 h-5 ${tuningCarParking ? 'text-amber-400 [data-theme=\'light\']_:text-amber-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningCarParking ? 'bg-amber-400 [data-theme=\'light\']_:bg-amber-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Chỗ Đỗ Ô Tô Hầm</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Xe SUV & sạc EV</div>
            </div>
          </button>

          {/* Dial 4: Tầng cao đón gió */}
          <button
            type="button"
            onClick={() => setTuningHighFloor(!tuningHighFloor)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningHighFloor
                ? 'bg-teal-500/20 [data-theme=\'light\']_:bg-teal-100 border-teal-400 [data-theme=\'light\']_:border-teal-500 text-teal-300 [data-theme=\'light\']_:text-teal-950 ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-teal-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-teal-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Wind className={`w-5 h-5 ${tuningHighFloor ? 'text-teal-400 [data-theme=\'light\']_:text-teal-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningHighFloor ? 'bg-teal-400 [data-theme=\'light\']_:bg-teal-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Tầng Cao Đón Gió</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Tầng 8+, view thoáng mát</div>
            </div>
          </button>

          {/* Dial 5: Nuôi thú cưng */}
          <button
            type="button"
            onClick={() => setTuningPetFriendly(!tuningPetFriendly)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningPetFriendly
                ? 'bg-rose-500/20 [data-theme=\'light\']_:bg-rose-100 border-rose-400 [data-theme=\'light\']_:border-rose-500 text-rose-300 [data-theme=\'light\']_:text-rose-950 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-rose-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-rose-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <PawPrint className={`w-5 h-5 ${tuningPetFriendly ? 'text-rose-400 [data-theme=\'light\']_:text-rose-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningPetFriendly ? 'bg-rose-400 [data-theme=\'light\']_:bg-rose-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Cho Phép Thú Cưng</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Có công viên dạo bộ</div>
            </div>
          </button>

          {/* Dial 6: Gần Metro */}
          <button
            type="button"
            onClick={() => setTuningMetroNearby(!tuningMetroNearby)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningMetroNearby
                ? 'bg-indigo-500/20 [data-theme=\'light\']_:bg-indigo-100 border-indigo-400 [data-theme=\'light\']_:border-indigo-500 text-indigo-300 [data-theme=\'light\']_:text-indigo-950 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-indigo-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-indigo-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Train className={`w-5 h-5 ${tuningMetroNearby ? 'text-indigo-400 [data-theme=\'light\']_:text-indigo-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningMetroNearby ? 'bg-indigo-400 [data-theme=\'light\']_:bg-indigo-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Gần Trạm Metro</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Đi bộ dưới 5 phút</div>
            </div>
          </button>

          {/* Dial 7: Ban công */}
          <button
            type="button"
            onClick={() => setTuningBalcony(!tuningBalcony)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningBalcony
                ? 'bg-emerald-500/20 [data-theme=\'light\']_:bg-emerald-100 border-emerald-400 [data-theme=\'light\']_:border-emerald-500 text-emerald-300 [data-theme=\'light\']_:text-emerald-950 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-emerald-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-emerald-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Maximize2 className={`w-5 h-5 ${tuningBalcony ? 'text-emerald-400 [data-theme=\'light\']_:text-emerald-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningBalcony ? 'bg-emerald-400 [data-theme=\'light\']_:bg-emerald-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Ban Công Rộng Rãi</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Đón nắng sớm, trồng cây</div>
            </div>
          </button>

          {/* Dial 8: Hồ bơi & Gym */}
          <button
            type="button"
            onClick={() => setTuningPoolGym(!tuningPoolGym)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningPoolGym
                ? 'bg-cyan-500/20 [data-theme=\'light\']_:bg-cyan-100 border-cyan-400 [data-theme=\'light\']_:border-cyan-500 text-cyan-300 [data-theme=\'light\']_:text-cyan-950 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-cyan-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-cyan-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Waves className={`w-5 h-5 ${tuningPoolGym ? 'text-cyan-400 [data-theme=\'light\']_:text-cyan-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningPoolGym ? 'bg-cyan-400 [data-theme=\'light\']_:bg-cyan-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Hồ Bơi & Phòng Gym</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Tiện ích resort cao cấp</div>
            </div>
          </button>

          {/* Dial 9: An ninh 24/7 */}
          <button
            type="button"
            onClick={() => setTuningSecurity(!tuningSecurity)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningSecurity
                ? 'bg-purple-500/20 [data-theme=\'light\']_:bg-purple-100 border-purple-400 [data-theme=\'light\']_:border-purple-500 text-purple-300 [data-theme=\'light\']_:text-purple-950 ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-purple-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-purple-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className={`w-5 h-5 ${tuningSecurity ? 'text-purple-400 [data-theme=\'light\']_:text-purple-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningSecurity ? 'bg-purple-400 [data-theme=\'light\']_:bg-purple-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">An Ninh Đa Lớp 24/7</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Camera AI & thẻ từ</div>
            </div>
          </button>

          {/* Dial 10: Gần trường & BV */}
          <button
            type="button"
            onClick={() => setTuningSchoolHospital(!tuningSchoolHospital)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 sm:h-32 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl ${
              tuningSchoolHospital
                ? 'bg-amber-500/20 [data-theme=\'light\']_:bg-amber-100 border-amber-400 [data-theme=\'light\']_:border-amber-500 text-amber-300 [data-theme=\'light\']_:text-amber-950 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/60 [data-theme=\'light\']_:bg-white border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-400 [data-theme=\'light\']_:text-slate-600 hover:border-amber-500/50 hover:bg-slate-900/80 [data-theme=\'light\']_:hover:bg-amber-50/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <Building2 className={`w-5 h-5 ${tuningSchoolHospital ? 'text-amber-400 [data-theme=\'light\']_:text-amber-700' : 'text-slate-400'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${tuningSchoolHospital ? 'bg-amber-400 [data-theme=\'light\']_:bg-amber-600' : 'bg-slate-600 [data-theme=\'light\']_:bg-slate-300'}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 [data-theme='light']_:text-slate-900">Gần Trường & BV</div>
              <div className="text-[11px] text-slate-400 [data-theme='light']_:text-slate-600 mt-0.5 font-mono">Bán kính dưới 1km</div>
            </div>
          </button>
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
            className="group relative rounded-3xl overflow-hidden h-60 sm:h-68 cursor-pointer border border-[var(--haven-border)] hover:border-emerald-400/80 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/15 hover:-translate-y-2"
          >
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"
              alt="Hà Nội"
              className="w-full h-full object-cover transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent [data-theme='light']_:from-white/95 [data-theme='light']_:via-white/60" />
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-widest">Thủ Đô Ngàn Năm</span>
              <h3 className="text-2xl font-serif text-white [data-theme='light']_:text-slate-900 font-bold">Hà Nội</h3>
              <p className="text-xs text-slate-200 [data-theme='light']_:text-slate-700 font-medium">Penthouse Hồ Tây, Hoàn Kiếm Heritage & Cầu Giấy</p>
            </div>
          </div>

          {/* Ho Chi Minh City */}
          <div
            onClick={() => onNavigateSearch("TP. Hồ Chí Minh")}
            className="group relative rounded-3xl overflow-hidden h-60 sm:h-68 cursor-pointer border border-[var(--haven-border)] hover:border-emerald-400/80 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/15 hover:-translate-y-2"
          >
            <img
              src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800"
              alt="TP. Hồ Chí Minh"
              className="w-full h-full object-cover transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent [data-theme='light']_:from-white/95 [data-theme='light']_:via-white/60" />
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-widest">Đô Thị Sầm Uất</span>
              <h3 className="text-2xl font-serif text-white [data-theme='light']_:text-slate-900 font-bold">TP. Hồ Chí Minh</h3>
              <p className="text-xs text-slate-200 [data-theme='light']_:text-slate-700 font-medium">View Sông Sài Gòn Quận 1, Thảo Điền & Phú Mỹ Hưng</p>
            </div>
          </div>

          {/* Da Nang */}
          <div
            onClick={() => onNavigateSearch("Đà Nẵng")}
            className="group relative rounded-3xl overflow-hidden h-60 sm:h-68 cursor-pointer border border-[var(--haven-border)] hover:border-emerald-400/80 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/15 hover:-translate-y-2"
          >
            <img
              src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800"
              alt="Đà Nẵng"
              className="w-full h-full object-cover transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent [data-theme='light']_:from-white/95 [data-theme='light']_:via-white/60" />
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-widest">Thành Phố Đáng Sống</span>
              <h3 className="text-2xl font-serif text-white [data-theme='light']_:text-slate-900 font-bold">Đà Nẵng</h3>
              <p className="text-xs text-slate-200 [data-theme='light']_:text-slate-700 font-medium">Sky Villa Biển Mỹ Khê & Bán Đảo Sơn Trà</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SIGNATURE EXPERIENCE: PROPERTY → VERIFIED FEATURE → USER BENEFIT ═══ */}
      <FeaturedProperties
        units={units}
        savedUnitIds={savedUnitIds}
        activeUnitId={activeFocalUnitId}
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
        activeFeatureKey={activeFeatureKey}
      />

      {/* ═══ Environmental Proof Feature Strip (Resonates with Active Unit) ═══ */}
      <FeatureStrip
        activeFeatureKey={activeFeatureKey}
        onSelectFeature={(featKey) => {
          setActiveFeatureKey(featKey);
          // Maintain bidirectional causality
          if (featKey === 'flood') {
            setActiveFocalUnitId('HN-HO-0303');
          } else if (featKey === 'parking') {
            setActiveFocalUnitId('HN-BA-1502');
          } else {
            setActiveFocalUnitId('HN-TÂ-1001');
          }
        }}
        activeUnitName={activeUnit?.name || activeUnit?.id}
      />
    </div>
  );
};
