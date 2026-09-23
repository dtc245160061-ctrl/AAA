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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full rounded-3xl atmospheric-panel border border-emerald-500/40 overflow-hidden shadow-2xl flex flex-col bg-[#0B0F17] transition-all duration-300 ${
          isFullscreen 
            ? 'w-screen h-screen rounded-none max-w-none' 
            : 'max-w-4xl h-[78vh] max-h-[680px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between z-20 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/25 shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100 truncate max-w-[220px] sm:max-w-xs md:max-w-md">
                  {cleanTitle}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                  <Sparkles className="w-3 h-3" />
                  <span>3D Twin Thực Địa</span>
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                {unit.sqm}m² • {unit.bedrooms} PN • Tầng {unit.floor} • {district}, {city}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-mono shrink-0">
            <button
              onClick={() => setActiveTab('matterport')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'matterport'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Walkthrough</span>
            </button>

            <button
              onClick={() => setActiveTab('google_maps')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'google_maps'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
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
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Viewport Content Area */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden flex flex-col">
          
          {/* TAB 1: Real Matterport 3D Walkthrough Digital Twin */}
          {activeTab === 'matterport' && (
            <div className="relative w-full h-full flex flex-col bg-[#000]">
              <iframe
                title="Matterport 3D Walkthrough Digital Twin"
                src={currentTour.embedUrl}
                className="w-full h-full border-0"
                allow="fullscreen; vr; xr-spatial-tracking"
                allowFullScreen
              />

              {/* Natural Professional HUD on Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-30">
                <div className="flex items-center gap-2 bg-slate-950/90 px-3.5 py-2 rounded-xl border border-emerald-500/40 text-xs font-mono text-slate-200 pointer-events-auto backdrop-blur-md shadow-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white">Không gian thực tế căn hộ</span>
                  <span className="text-slate-400 hidden sm:inline">• Quét 3D Photogrammetry</span>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 pointer-events-auto backdrop-blur-md shadow-xl">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Hỗ trợ đo thước laser 3D trên tường</span>
                </div>
              </div>

              {/* Bottom Instructions HUD */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300 pointer-events-none z-20">
                <div className="bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-800 pointer-events-auto backdrop-blur-md">
                  <span>Bấm vào sàn nhà để di chuyển • Xoay 360° • Xem Floorplan / Dollhouse ở thanh công cụ góc dưới</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 pointer-events-auto backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đã xác minh không gian thực địa 100%</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Google Maps 3D Satellite & Location Explorer (Without drifting fake center pin) */}
          {activeTab === 'google_maps' && (
            <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
              <iframe
                title="Google Maps 3D Satellite Explorer"
                src={mapsEmbedUrl}
                className="w-full h-full border-0 filter contrast-105"
                loading="lazy"
                allowFullScreen
              />

              {/* Map Info Bar Overlay */}
              <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
                <div className="bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-200 pointer-events-auto flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-xs sm:text-sm truncate max-w-[220px] sm:max-w-xs">{cleanTitle}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{unit.address || `${district}, ${city}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  {/* Map Layer Mode Switcher */}
                  <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs font-mono backdrop-blur-md">
                    <button
                      onClick={() => setMapMode('m')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        mapMode === 'm'
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Bản đồ
                    </button>
                    <button
                      onClick={() => setMapMode('k')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        mapMode === 'k'
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Vệ tinh 3D
                    </button>
                  </div>

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-mono font-bold text-xs transition-all shadow-md shadow-red-500/20"
                    title="Chỉ đường từng bước trên Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Chỉ Đường</span>
                  </a>

                  <a
                    href={externalMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-mono font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mở Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Bottom Street View & Neighborhood Context */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-2 z-20">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Đường vào: Ô tô tránh nhau thoải mái, có chỗ đỗ ngầm</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Ngập úng thực địa: An toàn tuyệt đối (Độ dốc thoát nước tốt)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
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
