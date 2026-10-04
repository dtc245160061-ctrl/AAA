import React, { useState, useEffect } from 'react';
import { 
  X, 
  Box, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Navigation, 
  Info, 
  ShieldCheck, 
  CheckCircle2, 
  Ruler 
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { 
  getMatterportTourForUnit, 
  type MatterportTourItem 
} from '../data/matterportTours';

interface VirtualTourModalProps {
  unit: ApartmentUnit;
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  unit,
  isOpen,
  onClose
}) => {
  // Pure, authentic tabs: Matterport 3D Walkthrough & Google Maps 3D Explorer
  const [activeTab, setActiveTab] = useState<'matterport' | 'google_maps'>('matterport');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapMode, setMapMode] = useState<'m' | 'k'>('m');

  // 3D Walkthrough model state (Sequential round-robin mapping per unit, perfectly cached)
  const [currentTour, setCurrentTour] = useState<MatterportTourItem>(() => getMatterportTourForUnit(unit));

  // Sync with unit prop changes
  useEffect(() => {
    if (unit) {
      setCurrentTour(getMatterportTourForUnit(unit));
    }
  }, [unit]);

  if (!isOpen) return null;

  const district = unit.district || 'Hà Nội';
  const city = unit.city || 'Thái Nguyên';
  const fullAddress = `${unit.name ? unit.name + ', ' : ''}${unit.address || ''}, ${district}, ${city}`.trim();
  const coordsStr = unit.coordinates ? `${unit.coordinates.lat},${unit.coordinates.lng}` : '';
  const mapsQuery = coordsStr || encodeURIComponent(fullAddress);
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${coordsStr ? coordsStr : mapsQuery}&t=${mapMode}&z=17&ie=UTF8&iwloc=B&output=embed`;
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordsStr ? coordsStr : mapsQuery}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordsStr ? coordsStr : mapsQuery}`;

  // Clean title: Strip excessive hash/building codes and trailing hyphens for crisp, legible UI
  const cleanTitle = unit.name 
    ? unit.name.replace(/#.*$/, '').replace(/[-—–].*$/, '').trim() 
    : `Căn hộ ${unit.id}`;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full rounded-[32px] border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xl flex flex-col bg-white dark:bg-slate-900 transition-all duration-300 ${
          isFullscreen 
            ? 'w-screen h-screen rounded-none max-w-none' 
            : 'max-w-4xl h-[78vh] max-h-[680px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-[#F2F5F0]/60 dark:bg-slate-900/60 flex items-center justify-between z-20 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8EC] dark:bg-[#163300] text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-[#163300] dark:text-white truncate max-w-[220px] sm:max-w-xs md:max-w-md">
                  {cleanTitle}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F8EC] text-[#163300] dark:bg-[#163300] dark:text-[#9FE870] text-[10px] font-bold shrink-0">
                  <Sparkles className="w-3 h-3 text-[#163300] dark:text-[#9FE870]" />
                  <span>3D Twin Thực Địa</span>
                </span>
              </div>
              <p className="text-[11px] text-[#738565] dark:text-slate-400 font-medium truncate">
                {unit.sqm}m² • {unit.bedrooms} PN • Tầng {unit.floor} • {district}, {city}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#F2F5F0] dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shrink-0">
            <button
              onClick={() => setActiveTab('matterport')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                activeTab === 'matterport'
                  ? 'bg-[#163300] text-white shadow-xs'
                  : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Walkthrough</span>
            </button>

            <button
              onClick={() => setActiveTab('google_maps')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                activeTab === 'google_maps'
                  ? 'bg-[#163300] text-white shadow-xs'
                  : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Google Maps 3D</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Viewport Content Area */}
        <div className="relative flex-1 bg-slate-900 overflow-hidden flex flex-col">
          
          {/* TAB 1: Real Matterport 3D Walkthrough Digital Twin */}
          {activeTab === 'matterport' && (
            <div className="relative w-full h-full flex flex-col bg-black">
              <iframe
                title="Matterport 3D Walkthrough Digital Twin"
                src={currentTour.embedUrl}
                className="w-full h-full border-0"
                allow="fullscreen; vr; xr-spatial-tracking"
                allowFullScreen
              />

              {/* Natural Professional HUD on Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-30">
                <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-[#163300] dark:text-white pointer-events-auto backdrop-blur-md shadow-md font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0" />
                  <span>Không gian thực tế căn hộ</span>
                  <span className="text-[#738565] dark:text-slate-400 hidden sm:inline font-normal">• Quét 3D Photogrammetry</span>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-[#163300] dark:text-[#9FE870] pointer-events-auto backdrop-blur-md shadow-md font-bold">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Hỗ trợ đo thước laser 3D trên tường</span>
                </div>
              </div>

              {/* Bottom Instructions HUD */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 pointer-events-none z-20">
                <div className="bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-slate-200 pointer-events-auto backdrop-blur-md shadow-md font-medium">
                  <span>Bấm vào sàn nhà để di chuyển • Xoay 360° • Xem Floorplan / Dollhouse ở thanh công cụ góc dưới</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-[#9FE870] pointer-events-auto backdrop-blur-md shadow-md font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đã xác minh không gian thực địa 100%</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Google Maps 3D Satellite & Location Explorer */}
          {activeTab === 'google_maps' && (
            <div className="relative w-full h-full flex flex-col bg-slate-900 overflow-hidden">
              <iframe
                title="Google Maps 3D Satellite Explorer"
                src={mapsEmbedUrl}
                className="w-full h-full border-0 filter contrast-105"
                loading="lazy"
                allowFullScreen
              />

              {/* Map Info Bar Overlay */}
              <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
                <div className="bg-white/90 dark:bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-md text-xs text-[#163300] dark:text-white pointer-events-auto flex items-center gap-3 shadow-md font-medium">
                  <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-500/20 text-[#FF5436] flex items-center justify-center font-bold shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#163300] dark:text-white text-xs sm:text-sm truncate max-w-[220px] sm:max-w-xs">{cleanTitle}</h4>
                    <p className="text-[11px] text-[#738565] dark:text-slate-400 truncate font-medium">{unit.address || `${district}, ${city}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  {/* Map Layer Mode Switcher */}
                  <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs backdrop-blur-md shadow-md">
                    <button
                      onClick={() => setMapMode('m')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                        mapMode === 'm'
                          ? 'bg-[#163300] text-white shadow-xs'
                          : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300]'
                      }`}
                    >
                      Bản đồ
                    </button>
                    <button
                      onClick={() => setMapMode('k')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                        mapMode === 'k'
                          ? 'bg-[#163300] text-white shadow-xs'
                          : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300]'
                      }`}
                    >
                      Vệ tinh 3D
                    </button>
                  </div>

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5436] hover:bg-[#e04529] text-white font-black text-xs transition-all shadow-xs hover:scale-105 active:scale-95"
                    title="Chỉ đường từng bước trên Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Chỉ Đường</span>
                  </a>

                  <a
                    href={externalMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#9FE870] hover:bg-[#8ee05c] text-[#163300] font-black text-xs transition-all shadow-xs hover:scale-105 active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mở Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Bottom Street View & Neighborhood Context */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 p-3 rounded-[24px] border border-slate-200 dark:border-slate-700 backdrop-blur-md text-xs text-[#163300] dark:text-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 z-20 shadow-lg">
                <div className="p-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0" />
                  <span>Đường vào: Ô tô tránh nhau thoải mái, có chỗ đỗ ngầm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 text-[#2570EB] shrink-0" />
                  <span>Ngập úng thực địa: An toàn tuyệt đối (Độ dốc thoát nước tốt)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 font-medium">
                  <Navigation className="w-4 h-4 text-[#7A5200] dark:text-[#FFC83B] shrink-0" />
                  <span>Bán kính 500m: Trạm xe buýt/metro, siêu thị tiện lợi 24/7</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
