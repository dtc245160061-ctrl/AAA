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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] flex items-center justify-center">
              <Navigation className="w-5 h-5 text-[#163300] dark:text-[#9FE870]" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl text-[#163300] dark:text-white font-black">Mô Phỏng Thời Gian Di Chuyển Đi Làm (Commute Simulator)</h3>
              <p className="text-xs text-[#738565] dark:text-slate-400 font-medium">Từ căn hộ {unit.name || unit.id} đến các trung tâm việc làm / học tập</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination Selector */}
        <div className="space-y-2">
          <label className="text-xs text-[#495E35] dark:text-slate-400 uppercase tracking-wider font-bold">
            Chọn Địa Điểm Công Ty / Trường Học Đích:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {destinations.map((dest) => {
              const isSelected = dest.id === selectedDestId;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestId(dest.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F8EC] border-[#9FE870] text-[#163300] dark:text-[#9FE870] font-bold shadow-xs'
                      : 'bg-[#F9FAF8] dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-[#495E35] dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="block truncate font-bold">{dest.name}</span>
                    <span className="text-[10px] text-[#738565] dark:text-slate-400 font-medium">{dest.address}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transport Mode Switcher */}
        <div className="flex items-center justify-between p-1 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700">
          <button
            onClick={() => setTransportMode('motorbike')}
            className={`flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-bold ${
              transportMode === 'motorbike'
                ? 'bg-[#163300] text-white shadow-xs'
                : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300]'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Xe Máy</span>
          </button>
          <button
            onClick={() => setTransportMode('car')}
            className={`flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-bold ${
              transportMode === 'car'
                ? 'bg-[#163300] text-white shadow-xs'
                : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300]'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Ô Tô / Taxi</span>
          </button>
          <button
            onClick={() => setTransportMode('bus')}
            className={`flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-bold ${
              transportMode === 'bus'
                ? 'bg-[#163300] text-white shadow-xs'
                : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300]'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Xe Buýt / Metro</span>
          </button>
        </div>

        {/* Real-time Comparison: Normal vs Peak Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Normal Hours */}
          <div className="p-5 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#495E35] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" /> Giờ Thường (Thông Thoáng)
              </span>
              <span className="text-[10px] font-bold text-[#163300] dark:text-[#9FE870] bg-[#E8F8EC] px-2.5 py-0.5 rounded-full border border-[#9FE870]/30">
                09:30 - 16:30
              </span>
            </div>
            <div className="text-3xl font-black text-[#163300] dark:text-white tabular-nums">
              {transportMode === 'motorbike'
                ? commute.motorbikeNormalMins
                : transportMode === 'car'
                ? commute.carNormalMins
                : Math.round(commute.carNormalMins * 1.5)}{' '}
              <span className="text-sm font-semibold text-[#738565] dark:text-slate-400">Phút</span>
            </div>
            <p className="text-[11px] text-[#738565] dark:text-slate-400 font-medium">
              Khoảng cách: ~{commute.distanceKm} km • Tốc độ TB ~30km/h
            </p>
          </div>

          {/* Peak Hours (Rush Hour Traffic) */}
          <div className="p-5 rounded-2xl bg-[#FFF6DB] dark:bg-amber-950/20 border border-[#FFC83B]/40 dark:border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7A5200] dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Giờ Cao Điểm (Kẹt Xe)
              </span>
              <span className="text-[10px] font-bold text-[#7A5200] dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/30">
                07:30 - 08:45 | 17:30 - 19:00
              </span>
            </div>
            <div className="text-3xl font-black text-[#7A5200] dark:text-amber-300 tabular-nums">
              {transportMode === 'motorbike'
                ? commute.motorbikePeakMins
                : transportMode === 'car'
                ? commute.carPeakMins
                : Math.round(commute.carPeakMins * 1.4)}{' '}
              <span className="text-sm font-semibold text-[#7A5200]/80 dark:text-slate-400">Phút</span>
            </div>
            <p className="text-[11px] text-[#7A5200]/80 dark:text-slate-400 font-medium">
              Độ trễ tăng +{Math.round(((commute.motorbikePeakMins - commute.motorbikeNormalMins) / commute.motorbikeNormalMins) * 100)}% do nút giao đèn đỏ
            </p>
          </div>
        </div>

        {/* Transit Advice Tip */}
        <div className="p-4 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/30 border border-[#9FE870]/30 text-xs text-[#163300] dark:text-emerald-300 flex items-start gap-2.5 font-medium leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0 mt-0.5" />
          <span>
            💡 <strong>Mẹo di chuyển</strong>: Tuyến đường từ {unit.district} đến {currentDest.name} có làn đường xe máy ưu tiên và có thể đi qua tuyến {commute.busLine || 'Metro'} để tránh hoàn toàn kẹt xe vào sáng thứ Hai.
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#163300] hover:bg-[#223D0D] text-white text-xs font-black transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
          >
            Đóng Mô Phỏng
          </button>
        </div>
      </div>
    </div>
  );
};
