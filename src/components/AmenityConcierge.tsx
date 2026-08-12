import React, { useState } from 'react';
import type { Amenity } from '../types/apartment';
import { Sparkles, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface AmenityConciergeProps {
  amenities: Amenity[];
}

export const AmenityConcierge: React.FC<AmenityConciergeProps> = ({ amenities }) => {
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedStatus, setBookedStatus] = useState<string | null>(null);

  const handleConfirmBooking = () => {
    if (!selectedAmenity || !selectedSlot) return;
    setBookedStatus(`Đã đặt chỗ thành công "${selectedAmenity.name}" khung giờ ${selectedSlot}!`);
    setTimeout(() => {
      setBookedStatus(null);
      setSelectedAmenity(null);
      setSelectedSlot(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {bookedStatus && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black px-5 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-black" />
          <span>{bookedStatus}</span>
        </div>
      )}

      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-['Cinzel']">
              Đặt Chỗ Tiện Ích Độc Quyền (Sky Amenities)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Đặt khung giờ sử dụng bể bơi vô cực, hầm rượu vang Sommelier & rạp chiếu phim Dolby Atmos.
          </p>
        </div>
      </div>

      {/* Grid of Luxury Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {amenities.map((item) => (
          <div
            key={item.id}
            className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden group">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-white/10 rounded-full">
                {item.location}
              </span>
            </div>

            <div className="p-6 text-left space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {item.openingHours}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    Tối đa {item.capacity} người
                  </span>
                </p>
              </div>

              {/* Slot Tags */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Khung Giờ Còn Trống Hôm Nay:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.availableSlotsToday.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedAmenity(item);
                        setSelectedSlot(slot);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                        selectedAmenity?.id === item.id && selectedSlot === slot
                          ? 'bg-amber-500 text-black font-bold border-amber-400'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAmenity(item);
                  setSelectedSlot(item.availableSlotsToday[0]);
                }}
                className="w-full py-2.5 text-xs font-bold bg-white/10 hover:bg-amber-500 hover:text-black text-white rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Đặt Giờ Ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Confirmation Dialog */}
      {selectedAmenity && selectedSlot && (
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 text-left flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in bg-amber-500/5">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Xác Nhận Đặt Chỗ</span>
            <h4 className="text-base font-bold text-white mt-0.5">
              {selectedAmenity.name} — Khung Giờ: <span className="text-amber-400">{selectedSlot}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Giá dịch vụ: {selectedAmenity.pricePerHourUSD === 0 ? 'Miễn phí cho cư dân AETHER' : `$${selectedAmenity.pricePerHourUSD}/giờ`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedAmenity(null);
                setSelectedSlot(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmBooking}
              className="px-6 py-2.5 text-xs font-bold bg-amber-500 text-black rounded-xl hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
            >
              Xác Nhận Đặt Lịch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
