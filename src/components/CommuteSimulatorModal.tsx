import React, { useState, useMemo } from 'react';
import { 
  X, 
  Navigation, 
  Car, 
  Bike, 
  Bus, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { ApartmentStore } from '../data/apartmentStore';

interface CommuteSimulatorModalProps {
  unit: ApartmentUnit;
  isOpen: boolean;
  onClose: () => void;
}

export const CommuteSimulatorModal: React.FC<CommuteSimulatorModalProps> = ({
  unit,
  isOpen,
  onClose
}) => {
  const destinations = useMemo(() => {
    return ApartmentStore.getCommuteDestinations(unit.city);
  }, [unit.city]);

  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || 'hcm-bitexco');
  const [transportMode, setTransportMode] = useState<'motorbike' | 'car' | 'bus'>('motorbike');

  if (!isOpen) return null;

  const currentDest = destinations.find(d => d.id === selectedDestId) || destinations[0];
  const commute = ApartmentStore.calculateCommute(unit, selectedDestId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl atmospheric-panel border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Navigation className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-slate-100 font-bold">Mô Phỏng Thời Gian Di Chuyển Đi Làm (Commute Simulator)</h3>
              <p className="text-xs text-slate-400 font-mono">Từ căn hộ {unit.name || unit.id} đến các trung tâm việc làm / học tập</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Chọn Địa Điểm Công Ty / Trường Học Đích:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {destinations.map((dest) => {
              const isSelected = dest.id === selectedDestId;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestId(dest.id)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs font-mono flex items-start gap-2 ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="block truncate">{dest.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{dest.address}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transport Mode Switcher */}
        <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setTransportMode('motorbike')}
            className={`flex-1 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all ${
              transportMode === 'motorbike'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Xe Máy</span>
          </button>
          <button
            onClick={() => setTransportMode('car')}
            className={`flex-1 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all ${
              transportMode === 'car'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Ô Tô / Taxi</span>
          </button>
          <button
            onClick={() => setTransportMode('bus')}
            className={`flex-1 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all ${
              transportMode === 'bus'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Xe Buýt / Metro</span>
          </button>
        </div>

        {/* Real-time Comparison: Normal vs Peak Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Normal Hours */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Giờ Thường (Thông Thoáng)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                09:30 - 16:30
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-slate-100">
              {transportMode === 'motorbike'
                ? commute.motorbikeNormalMins
                : transportMode === 'car'
                ? commute.carNormalMins
                : Math.round(commute.carNormalMins * 1.5)}{' '}
              <span className="text-sm font-sans font-normal text-slate-400">Phút</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Khoảng cách: ~{commute.distanceKm} km • Tốc độ TB ~30km/h
            </p>
          </div>

          {/* Peak Hours (Rush Hour Traffic) */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Giờ Cao Điểm (Kẹt Xe)
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                07:30 - 08:45 | 17:30 - 19:00
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-amber-300">
              {transportMode === 'motorbike'
                ? commute.motorbikePeakMins
                : transportMode === 'car'
                ? commute.carPeakMins
                : Math.round(commute.carPeakMins * 1.4)}{' '}
              <span className="text-sm font-sans font-normal text-slate-400">Phút</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Độ trễ tăng +{Math.round(((commute.motorbikePeakMins - commute.motorbikeNormalMins) / commute.motorbikeNormalMins) * 100)}% do nút giao đèn đỏ
            </p>
          </div>
        </div>

        {/* Transit Advice Tip */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            💡 <strong>Mẹo di chuyển</strong>: Tuyến đường từ {unit.district} đến {currentDest.name} có làn đường xe máy ưu tiên và có thể đi qua tuyến {commute.busLine || 'Metro'} để tránh hoàn toàn kẹt xe vào sáng thứ Hai.
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            Đóng Mô Phỏng
          </button>
        </div>
      </div>
    </div>
  );
};
