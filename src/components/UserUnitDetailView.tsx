import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  CloudRain, 
  Zap, 
  Car, 
  ArrowLeft, 
  Bookmark, 
  Phone, 
  Wind, 
  Compass,
  MessageSquare
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';

interface UserUnitDetailViewProps {
  unit: ApartmentUnit;
  isSaved: boolean;
  onToggleSaveUnit: (id: string) => void;
  onBackToDirectory: () => void;
  onOpenBookingModal: (unit: ApartmentUnit) => void;
  onOpenChat?: (unit: ApartmentUnit) => void;
}

export const UserUnitDetailView: React.FC<UserUnitDetailViewProps> = ({
  unit,
  isSaved,
  onToggleSaveUnit,
  onBackToDirectory,
  onOpenBookingModal,
  onOpenChat
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  const getCityDisplayName = (city: string) => {
    switch (city) {
      case 'Hanoi': return 'Hà Nội';
      case 'Ho Chi Minh City': return 'TP. Hồ Chí Minh';
      case 'Da Nang': return 'Đà Nẵng';
      default: return city;
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách tìm kiếm</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleSaveUnit(unit.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all ${
              isSaved
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{isSaved ? 'Đã lưu vào danh sách' : 'Lưu vào mục so sánh'}</span>
          </button>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Large Photo */}
        <div className="lg:col-span-2 relative h-[440px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <img
            src={unit.images[selectedPhotoIdx] || unit.images[0]}
            alt={unit.name || unit.id}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-200">
            <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800">
              Ảnh {selectedPhotoIdx + 1} / {unit.images.length}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              Hình ảnh thực tế đã xác thực
            </span>
          </div>
        </div>

        {/* Thumbnail Selector List */}
        <div className="flex flex-col gap-3">
          {unit.images.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhotoIdx(idx)}
              className={`relative h-[138px] rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                selectedPhotoIdx === idx
                  ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                  : 'border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Header Info & Booking Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Residence Identity & Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
              <span>{getCityDisplayName(unit.city)}</span>
              <span>•</span>
              <span>{unit.district}</span>
              <span>•</span>
              <span>Tầng {unit.floor}</span>
              <span>•</span>
              <span>{unit.viewType}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-100">{unit.name || unit.id}</h1>
            <p className="text-sm font-sans text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{unit.address || `${unit.district}, ${getCityDisplayName(unit.city)}`}</span>
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono shadow-xl">
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Phòng Ngủ</span>
              <p className="text-slate-100 text-base font-serif font-semibold mt-0.5">{unit.bedrooms} Phòng</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Phòng Tắm / WC</span>
              <p className="text-slate-100 text-base font-serif font-semibold mt-0.5">{unit.bathrooms} Phòng</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Diện Tích Sàn</span>
              <p className="text-slate-100 text-base font-serif font-semibold mt-0.5">{unit.sqm} m²</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Vị Trí Tầng</span>
              <p className="text-slate-100 text-base font-serif font-semibold mt-0.5">Tầng {unit.floor}</p>
            </div>
          </div>

          {/* AI Apartment Insight Panel (Key Feature) */}
          <div className="rounded-3xl liquid-glass-origin border border-emerald-500/30 p-6 md:p-8 space-y-6 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-slate-100">Đánh Giá Chuyên Sâu Từ Trí Tuệ Nhân Tạo AI</h3>
                <p className="text-xs text-slate-400 font-mono">Phân tích tính tương thích sinh hoạt và rủi ro môi trường</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Why This Fits You */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 shadow-lg">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Điểm Mạnh Phù Hợp Nổi Bật</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                  {unit.aiInsights.whyFit.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Worth Considering / Drawbacks */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-900/70 border border-amber-500/30 shadow-lg">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Lưu Ý Cần Cân Nhắc</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                  {unit.aiInsights.worthConsidering.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Environmental Intelligence Section */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6 shadow-2xl">
            <h3 className="font-serif text-xl text-slate-100 flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-sky-400" />
              <span>Đặc Tính Môi Trường & Hạ Tầng Xung Quanh</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-300 font-semibold">
                  <Wind className="w-4 h-4" /> Vi Khí Hậu & Hướng Gió
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{unit.environmentalData.weatherNotes}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-semibold">
                  <CloudRain className="w-4 h-4" /> Đánh Giá An Toàn Ngập Lụt
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{unit.environmentalData.floodNotes}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-semibold">
                  <Zap className="w-4 h-4" /> Nguồn Điện Dự Phòng Tòa Nhà
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{unit.environmentalData.powerNotes}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-semibold">
                  <Car className="w-4 h-4" /> Giao Thông & Lối Vào Hầm Xe
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{unit.environmentalData.trafficNotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Rental CTA Box */}
        <div className="space-y-6">
          <div className="sticky top-24 p-6 md:p-8 rounded-3xl liquid-glass-origin border border-emerald-500/30 space-y-6 shadow-2xl backdrop-blur-2xl">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Giá Thuê Niêm Yết</span>
              <div className="text-3xl font-serif font-bold text-emerald-400 mt-1">
                {(unit.monthlyRentVND / 1000000).toFixed(0)} Triệu
                <span className="text-xs text-slate-400 font-sans font-normal"> /tháng</span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Đã bao gồm phí quản lý cơ bản
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => onOpenBookingModal(unit)}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm font-mono transition-all shadow-lg shadow-emerald-500/30 text-center hover:scale-[1.02] active:scale-[0.98]"
              >
                Đặt Lịch Xem Căn Hộ
              </button>

              {/* Shopee-style Direct Chat Button */}
              <button
                onClick={() => onOpenChat?.(unit)}
                className="w-full py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat Trực Tiếp Với Ban Quản Trị</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              </button>

              <button
                onClick={() => alert(`Đang kết nối với Chuyên viên tư vấn HAVEN cho căn hộ ${unit.name || unit.id}...`)}
                className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Hotline Hỗ Trợ 24/7</span>
              </button>
            </div>

            {/* Included Amenities Checklist */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <span className="text-slate-500 uppercase text-[10px]">Tiện Ích Đi Kèm</span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Chỗ đỗ ô tô
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bãi xe máy
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Điện dự phòng
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Wi-Fi tốc độ cao
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
