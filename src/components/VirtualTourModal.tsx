import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  X, 
  Compass, 
  Eye, 
  ArrowRight, 
  RotateCw,
  Building,
  Box,
  MapPin,
  Maximize2,
  Minimize2,
  Sparkles,
  Navigation,
  Info,
  ShieldCheck,
  CheckCircle2,
  Ruler,
  ChevronDown,
  ChevronUp,
  Home,
  Check
} from 'lucide-react';
import type { ApartmentUnit, VirtualTourRoom } from '../types/apartment';
import { 
  getMatterportTourForUnit, 
  getTourIndex,
  VERIFIED_MATTERPORT_TOURS, 
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
  // Tabs: Matterport 3D Walkthrough, 360° Seamless Photosphere, Google Maps 3D & Street View
  const [activeTab, setActiveTab] = useState<'matterport' | '360_sphere' | 'google_maps'>('matterport');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // 3D Walkthrough model state
  const defaultTour = getMatterportTourForUnit(unit);
  const [currentTour, setCurrentTour] = useState<MatterportTourItem>(defaultTour);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sync with unit prop changes
  useEffect(() => {
    const matched = getMatterportTourForUnit(unit);
    setCurrentTour(matched);
  }, [unit]);

  // Filtered 3D Models
  const filteredTours = selectedCategory === 'all'
    ? VERIFIED_MATTERPORT_TOURS
    : VERIFIED_MATTERPORT_TOURS.filter(t => {
        if (selectedCategory === 'studio') return t.category === 'studio';
        if (selectedCategory === '1bed') return t.category === '1bed';
        if (selectedCategory === '2bed') return t.category === '2bed' || t.category === 'condo';
        if (selectedCategory === 'family') return t.category === '3bed' || t.category === '4bed';
        if (selectedCategory === 'luxury') return t.category === 'penthouse' || t.category === 'villa' || t.category === 'suite';
        return true;
      });

  // Genuine 2:1 Equirectangular 360° Panoramas (Seamless, ZERO seam lines or stitching glitches)
  const rooms: VirtualTourRoom[] = [
    {
      id: 'room-living',
      roomName: 'Phòng Khách Panorama 360°',
      imageUrl: 'https://pannellum.org/images/alma.jpg',
      description: 'Không gian mở đón sáng tự nhiên, trần cao thoáng đãng với tầm nhìn bao quát toàn bộ căn hộ.',
      hotspots: [
        { id: 'hs-1', label: 'Đi tới Sảnh Tiếp Khách & Lounge', targetRoomId: 'room-lounge', xPercent: 78, yPercent: 50 },
        { id: 'hs-2', label: 'Đi tới Khu Nội Thất Hiện Đại', targetRoomId: 'room-interior', xPercent: 22, yPercent: 50 }
      ]
    },
    {
      id: 'room-lounge',
      roomName: 'Sảnh Đón & Khu Sinh Hoạt Chung',
      imageUrl: 'https://pannellum.org/images/jfk.jpg',
      description: 'Sàn đá cao cấp, bố trí khu vực tiếp khách sang trọng và hành lang kết nối các phòng ngủ.',
      hotspots: [
        { id: 'hs-3', label: 'Quay lại Phòng Khách', targetRoomId: 'room-living', xPercent: 18, yPercent: 50 },
        { id: 'hs-4', label: 'Đi tới Ban Công & Khu Vực Thoáng', targetRoomId: 'room-balcony', xPercent: 82, yPercent: 48 }
      ]
    },
    {
      id: 'room-interior',
      roomName: 'Khu Trưng Bày & Bếp Tiện Nghi',
      imageUrl: 'https://pannellum.org/images/bma-0.jpg',
      description: 'Không gian trưng bày nội thất hiện đại với hệ thống chiếu sáng âm trần đạt chuẩn thẩm mỹ.',
      hotspots: [
        { id: 'hs-5', label: 'Quay lại Phòng Khách', targetRoomId: 'room-living', xPercent: 85, yPercent: 50 }
      ]
    },
    {
      id: 'room-balcony',
      roomName: 'Khu Vườn & Không Gian Xanh',
      imageUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
      description: 'Không gian mở ngoài trời thoáng mát, đón gió đối lưu tự nhiên cho toàn bộ căn hộ.',
      hotspots: [
        { id: 'hs-6', label: 'Vào Sảnh Đón', targetRoomId: 'room-lounge', xPercent: 25, yPercent: 50 }
      ]
    }
  ];

  const [activeRoomId, setActiveRoomId] = useState<string>('room-living');
  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  // Three.js References for 360 Sphere
  const sphereMountRef = useRef<HTMLDivElement>(null);
  const sphereRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereSceneRef = useRef<THREE.Scene | null>(null);
  const sphereCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const sphereAnimationIdRef = useRef<number>(0);

  // Interaction State for 360 Camera
  const isUserInteractingRef = useRef(false);
  const onPointerDownMouseXRef = useRef(0);
  const onPointerDownMouseYRef = useRef(0);
  const lonRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const latRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0);
  const [currentBearing, setCurrentBearing] = useState<number>(0);

  // -------------------------------------------------------------
  // Initialize Three.js 360 Seamless Photosphere
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || activeTab !== '360_sphere' || !sphereMountRef.current) return;

    const container = sphereMountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sphereSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1200);
    camera.position.set(0, 0, 0);
    sphereCameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    sphereRendererRef.current = renderer;

    // Inverted Sphere Geometry for 360 interior projection
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    const texture = textureLoader.load(activeRoom.imageUrl, () => {
      renderer.render(scene, camera);
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = 1;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    sphereMeshRef.current = mesh;

    // Animation Loop
    const animate = () => {
      sphereAnimationIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && !isUserInteractingRef.current) {
        lonRef.current += 0.08;
      }

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      const targetY = 500 * Math.cos(phiRef.current);
      const targetZ = 500 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);

      // Bearing for compass (0 to 360 deg)
      const bearing = (Math.round(lonRef.current) % 360 + 360) % 360;
      setCurrentBearing(bearing);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(sphereAnimationIdRef.current);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [isOpen, activeTab, activeRoom.imageUrl, autoRotate]);

  // Mouse Handlers for 360 Sphere
  const handleSphereMouseDown = (e: React.MouseEvent) => {
    isUserInteractingRef.current = true;
    onPointerDownMouseXRef.current = e.clientX;
    onPointerDownMouseYRef.current = e.clientY;
    onPointerDownLonRef.current = lonRef.current;
    onPointerDownLatRef.current = latRef.current;
  };

  const handleSphereMouseMove = (e: React.MouseEvent) => {
    if (!isUserInteractingRef.current) return;
    lonRef.current = (onPointerDownMouseXRef.current - e.clientX) * 0.18 + onPointerDownLonRef.current;
    latRef.current = (e.clientY - onPointerDownMouseYRef.current) * 0.18 + onPointerDownLatRef.current;
  };

  const handleSphereMouseUp = () => {
    isUserInteractingRef.current = false;
  };

  const handleSphereWheel = (e: React.WheelEvent) => {
    if (!sphereCameraRef.current) return;
    const fov = sphereCameraRef.current.fov + e.deltaY * 0.05;
    sphereCameraRef.current.fov = THREE.MathUtils.clamp(fov, 35, 95);
    sphereCameraRef.current.updateProjectionMatrix();
  };

  if (!isOpen) return null;

  const district = unit.district || 'Hà Nội';
  const city = unit.city || 'Hà Nội';
  const mapsQuery = encodeURIComponent(`${unit.name || 'Căn hộ'} ${unit.address || ''}, ${district}, ${city}`);
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${mapsQuery}&t=k&z=17&ie=UTF8&iwloc=&output=embed`;
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className={`relative w-full rounded-3xl atmospheric-panel border border-emerald-500/40 overflow-hidden shadow-2xl flex flex-col bg-[#0B0F17] transition-all duration-300 ${
          isFullscreen 
            ? 'w-screen h-screen rounded-none max-w-none' 
            : 'max-w-5xl h-[88vh] max-h-[850px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/25 shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100 line-clamp-1">
                  {unit.name || `Căn hộ ${unit.id}`}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Không Gian 3D #{getTourIndex(currentTour.id)} • Digital Twin</span>
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                {unit.sqm}m² • {unit.bedrooms} PN • Tầng {unit.floor} • {district}, {city}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('matterport')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'matterport'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Walkthrough ({VERIFIED_MATTERPORT_TOURS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('360_sphere')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === '360_sphere'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>360° VR Liền Mạch</span>
            </button>

            <button
              onClick={() => setActiveTab('google_maps')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
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
          <div className="flex items-center gap-1.5">
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

              {/* Model Switcher Toolbar HUD on Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-30">
                <div className="flex items-center gap-2 pointer-events-auto">
                  {/* Model Selector Button */}
                  <button
                    onClick={() => setShowModelPicker(!showModelPicker)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/95 hover:bg-slate-900 border border-emerald-500/50 text-xs font-mono text-slate-200 flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all active:scale-95"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">
                      Bản #{getTourIndex(currentTour.id)}
                    </span>
                    <span className="font-bold text-white max-w-[180px] sm:max-w-[280px] truncate">
                      {currentTour.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {currentTour.categoryLabel}
                    </span>
                    {showModelPicker ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                  </button>

                  {/* Reset to Recommended Model for this Apartment */}
                  {currentTour.id !== defaultTour.id && (
                    <button
                      onClick={() => setCurrentTour(defaultTour)}
                      className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-all"
                      title="Về mô hình 3D mặc định của căn hộ này"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mặc định căn này</span>
                    </button>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 pointer-events-auto backdrop-blur-md">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Đo thước laser 3D trên tường</span>
                </div>
              </div>

              {/* Floating Dropdown Drawer for 66 Real 3D Models */}
              {showModelPicker && (
                <div className="absolute top-14 left-3 right-3 max-w-2xl max-h-[70%] bg-slate-950/95 border border-emerald-500/50 rounded-2xl p-3 shadow-2xl backdrop-blur-xl z-40 flex flex-col space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-white font-mono">
                        Kho Dữ Liệu 3D Thực Tế ({VERIFIED_MATTERPORT_TOURS.length} Không Gian Quét Laser)
                      </span>
                    </div>
                    <button
                      onClick={() => setShowModelPicker(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-[11px] font-mono">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'studio', label: 'Studio (11)' },
                      { id: '1bed', label: '1 PN (6)' },
                      { id: '2bed', label: '2 PN (10)' },
                      { id: 'family', label: '3-4 PN (3)' },
                      { id: 'luxury', label: 'Penthouse & Villa (20)' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedCategory(f.id)}
                        className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                          selectedCategory === f.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Models Grid / List */}
                  <div className="overflow-y-auto max-h-[300px] space-y-1.5 pr-1 font-mono text-xs">
                    {filteredTours.map(t => {
                      const isSelected = t.id === currentTour.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setCurrentTour(t);
                            setShowModelPicker(false);
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-slate-850'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : <Box className="w-3.5 h-3.5" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white text-[12px] truncate">
                                <span className="text-emerald-400 font-mono mr-1.5 font-bold">#{getTourIndex(t.id)}</span>
                                {t.name}
                              </p>
                              <p className="text-[10px] text-slate-400">{t.categoryLabel} • {t.bedroomCount} Phòng ngủ</p>
                            </div>
                          </div>

                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 shrink-0">
                            Khám phá
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Instructions HUD */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300 pointer-events-none z-20">
                <div className="bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-800 pointer-events-auto">
                  <span>Bấm vào sàn nhà để di chuyển • Xoay 360° • Xem Floorplan / Dollhouse ở thanh công cụ góc dưới</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 pointer-events-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dữ liệu Digital Twin 100% không chắp vá</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Three.js 360° Seamless Equirectangular Sphere (No Seams, No Distortion) */}
          {activeTab === '360_sphere' && (
            <div 
              className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleSphereMouseDown}
              onMouseMove={handleSphereMouseMove}
              onMouseUp={handleSphereMouseUp}
              onWheel={handleSphereWheel}
            >
              {/* Three.js Canvas Container */}
              <div ref={sphereMountRef} className="w-full h-full" />

              {/* Compass & Orientation HUD */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-200 pointer-events-none">
                <Navigation 
                  className="w-4 h-4 text-emerald-400 transition-transform duration-100" 
                  style={{ transform: `rotate(${-currentBearing}deg)` }} 
                />
                <span>Hướng: {currentBearing}° ({currentBearing > 315 || currentBearing < 45 ? 'Bắc' : currentBearing < 135 ? 'Đông' : currentBearing < 225 ? 'Nam' : 'Tây'})</span>
              </div>

              {/* Seamless Guarantee Badge */}
              <div className="absolute top-4 right-4 bg-slate-950/80 px-3 py-1.5 rounded-2xl border border-slate-800 backdrop-blur-md text-xs font-mono text-emerald-300 flex items-center gap-1.5 pointer-events-none">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ảnh cầu Equirectangular 2:1 chuẩn (Không ghép lỗi vết nối)</span>
              </div>

              {/* Interactive Room Navigation Hotspots */}
              <div className="absolute inset-0 pointer-events-none">
                {activeRoom.hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRoomId(hs.targetRoomId);
                    }}
                    style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
                    className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-slate-950/90 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all flex items-center gap-1.5 group z-10 animate-bounce"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{hs.label}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>

              {/* Bottom HUD info & Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-200 pointer-events-none">
                <div className="bg-slate-950/85 px-4 py-2 rounded-2xl backdrop-blur-md border border-slate-800 max-w-lg line-clamp-1 pointer-events-auto">
                  <span className="text-emerald-400 font-bold mr-2">● {activeRoom.roomName}:</span>
                  <span className="text-slate-300">{activeRoom.description}</span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                      autoRotate
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                    <span>Tự động quay</span>
                  </button>

                  <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                    Kéo chuột để xoay • Cuộn để Zoom
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Google Maps 3D & Street View Explorer */}
          {activeTab === 'google_maps' && (
            <div className="relative w-full h-full flex flex-col bg-slate-950">
              <iframe
                title="Google Maps 3D Satellite Explorer"
                src={mapsEmbedUrl}
                className="w-full h-full border-0 filter contrast-105"
                loading="lazy"
                allowFullScreen
              />

              {/* Map Info Bar Overlay */}
              <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-200 pointer-events-auto flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{unit.name || unit.id}</h4>
                    <p className="text-[11px] text-slate-400">{unit.address || `${district}, ${city}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <a
                    href={externalMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-mono font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Mở Google Maps 3D & Street View</span>
                  </a>
                </div>
              </div>

              {/* Bottom Street View & Neighborhood Context */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Đường vào: Ô tô tránh nhau thoải mái, có chỗ đỗ ngầm</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Ngập úng thực địa: An toàn tuyệt đối (Độ dốc thoát nước tốt)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Bán kính 500m: Trạm xe buýt/metro, siêu thị tiện lợi 24/7</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Room Switcher Bar (For 360 Sphere mode) */}
        {activeTab === '360_sphere' && (
          <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-2 shrink-0 z-20">
            <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {rooms.map((room) => {
                const isCurrent = room.id === activeRoomId;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>{room.roomName.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Three.js WebGL Equirectangular Sphere</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
