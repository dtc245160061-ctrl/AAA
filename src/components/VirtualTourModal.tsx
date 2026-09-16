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
  Sun,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Ruler,
  Navigation,
  Info,
  ShieldCheck
} from 'lucide-react';
import type { ApartmentUnit, VirtualTourRoom } from '../types/apartment';

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
  const [activeTab, setActiveTab] = useState<'360_sphere' | 'dollhouse' | 'google_maps'>('360_sphere');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [sunHour, setSunHour] = useState<number>(10); // 10:00 AM
  const [selectedRoomDimension, setSelectedRoomDimension] = useState<string | null>(null);

  // 360 Rooms Definition
  const rooms: VirtualTourRoom[] = [
    {
      id: 'room-living',
      roomName: 'Phòng Khách Panorama & Ban Công',
      imageUrl: unit.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600',
      description: 'Không gian mở rộng rãi với kính Low-E tràn viền cách âm nhiệt và ban công đón gió Đông Nam.',
      hotspots: [
        { id: 'hs-1', label: 'Đi tới Phòng Ngủ Master', targetRoomId: 'room-master', xPercent: 78, yPercent: 48 },
        { id: 'hs-2', label: 'Đi tới Khu Vực Bếp Mở', targetRoomId: 'room-kitchen', xPercent: 22, yPercent: 52 }
      ]
    },
    {
      id: 'room-master',
      roomName: 'Phòng Ngủ Master Suite',
      imageUrl: unit.images[1] || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1600',
      description: 'Trang bị giường King size, sàn gỗ tự nhiên chống ẩm và phòng tắm kính walk-in khép kín.',
      hotspots: [
        { id: 'hs-3', label: 'Quay lại Phòng Khách', targetRoomId: 'room-living', xPercent: 18, yPercent: 55 },
        { id: 'hs-4', label: 'Đi tới Ban Công View Hoàng Hôn', targetRoomId: 'room-balcony', xPercent: 82, yPercent: 45 }
      ]
    },
    {
      id: 'room-kitchen',
      roomName: 'Khu Bếp Mở & Bàn Đảo Hiện Đại',
      imageUrl: unit.images[2] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
      description: 'Hệ tủ bếp kịch trần, bếp từ âm đôi, máy hút mùi than hoạt tính và chậu rửa inox 304.',
      hotspots: [
        { id: 'hs-5', label: 'Quay lại Phòng Khách', targetRoomId: 'room-living', xPercent: 85, yPercent: 50 }
      ]
    },
    {
      id: 'room-balcony',
      roomName: 'Ban Công View Thoáng & Lưới An Toàn',
      imageUrl: unit.images[3] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1600',
      description: 'Lan can kính cường lực cao 1.4m đạt chuẩn an toàn, trang bị lưới bảo vệ tàng hình cho trẻ nhỏ.',
      hotspots: [
        { id: 'hs-6', label: 'Vào Phòng Ngủ Master', targetRoomId: 'room-master', xPercent: 20, yPercent: 50 }
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

  // Three.js References for 3D Dollhouse
  const dollhouseMountRef = useRef<HTMLDivElement>(null);
  const dollhouseRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dollhouseSceneRef = useRef<THREE.Scene | null>(null);
  const dollhouseCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const dollhouseAnimationIdRef = useRef<number>(0);
  const dollhouseSunLightRef = useRef<THREE.DirectionalLight | null>(null);

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

  // Interaction State for Dollhouse Orbit
  const isDollhouseInteractingRef = useRef(false);
  const dollhousePrevMousePosRef = useRef({ x: 0, y: 0 });
  const dollhouseRotationRef = useRef({ x: 0.45, y: -0.6 });

  // -------------------------------------------------------------
  // 1. Initialize Three.js 360 Panoramic Sphere
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
    const texture = textureLoader.load(activeRoom.imageUrl, () => {
      renderer.render(scene, camera);
    });
    texture.colorSpace = THREE.SRGBColorSpace;

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

      // Normalize bearing for compass (0 to 360 deg)
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

  // -------------------------------------------------------------
  // 2. Initialize Three.js 3D Dollhouse Cutaway Model
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || activeTab !== 'dollhouse' || !dollhouseMountRef.current) return;

    const container = dollhouseMountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f18);
    dollhouseSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(22, 26, 28);
    camera.lookAt(0, 0, 0);
    dollhouseCameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    dollhouseRendererRef.current = renderer;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Directional Sunlight (Calculated from sunHour)
    const sunAngle = ((sunHour - 6) / 12) * Math.PI; // 6 AM to 6 PM
    const sunX = Math.cos(sunAngle) * 30;
    const sunY = Math.sin(sunAngle) * 25 + 5;
    const sunZ = 20;

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(sunX, sunY, sunZ);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);
    dollhouseSunLightRef.current = sunLight;

    // Soft fill blue light for realistic room ambiance
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-20, 10, -20);
    scene.add(fillLight);

    // Dollhouse Floor Base
    const floorGeo = new THREE.BoxGeometry(28, 0.6, 22);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      roughness: 0.7, 
      metalness: 0.1 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.3;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid guide floor beneath
    const grid = new THREE.GridHelper(36, 18, 0x10b981, 0x1e293b);
    grid.position.y = -0.61;
    scene.add(grid);

    // Room 1: Phòng khách (Wood floor)
    const livingFloorGeo = new THREE.BoxGeometry(14, 0.1, 12);
    const livingFloorMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const livingFloor = new THREE.Mesh(livingFloorGeo, livingFloorMat);
    livingFloor.position.set(-6, 0.05, 4);
    livingFloor.receiveShadow = true;
    scene.add(livingFloor);

    // Room 2: Phòng ngủ Master (Soft oak wood)
    const masterFloorGeo = new THREE.BoxGeometry(12, 0.1, 10);
    const masterFloorMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 });
    const masterFloor = new THREE.Mesh(masterFloorGeo, masterFloorMat);
    masterFloor.position.set(7, 0.05, 5);
    masterFloor.receiveShadow = true;
    scene.add(masterFloor);

    // Room 3: Bếp & Ăn (Grey Tile)
    const kitchenFloorGeo = new THREE.BoxGeometry(14, 0.1, 8);
    const kitchenFloorMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3 });
    const kitchenFloor = new THREE.Mesh(kitchenFloorGeo, kitchenFloorMat);
    kitchenFloor.position.set(-6, 0.05, -6);
    kitchenFloor.receiveShadow = true;
    scene.add(kitchenFloor);

    // Walls function helper (Cutaway walls, height: 3.5m)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1 });

    const createWall = (w: number, h: number, d: number, x: number, y: number, z: number, isGlass = false) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, isGlass ? glassMat : wallMat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    };

    // Outer Cutaway Walls (low height so interior is visible)
    createWall(28, 3.5, 0.5, 0, 1.75, -10.5); // Back wall
    createWall(0.5, 3.5, 21.5, -13.75, 1.75, 0.25); // Left wall
    createWall(0.5, 3.5, 21.5, 13.75, 1.75, 0.25); // Right wall
    createWall(14, 3.5, 0.5, -6, 1.75, 10.75, true); // Front Balcony Glass Wall

    // Partition walls inside
    createWall(0.5, 3.5, 10, 1, 1.75, 5); // Divider between living & bedroom
    createWall(14, 3.5, 0.5, -6, 1.75, -2); // Divider between living & kitchen

    // Furniture: Sofa in living room
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x059669 });
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 2.5), sofaMat);
    sofaBase.position.set(-7, 0.6, 2);
    sofaBase.castShadow = true;
    scene.add(sofaBase);

    // Coffee table
    const tableMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 2), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    tableMesh.position.set(-7, 0.4, 6);
    tableMesh.castShadow = true;
    scene.add(tableMesh);

    // King Bed in Master Bedroom
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
    const bedMesh = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.4, 7), bedMat);
    bedMesh.position.set(7.5, 0.7, 4.5);
    bedMesh.castShadow = true;
    scene.add(bedMesh);

    // PCCC Smoke detector on ceiling corner
    const pcccLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    pcccLight.position.set(-6, 3.4, 3);
    scene.add(pcccLight);

    // Animation Loop for Dollhouse Orbit
    const animate = () => {
      dollhouseAnimationIdRef.current = requestAnimationFrame(animate);

      if (!isDollhouseInteractingRef.current) {
        dollhouseRotationRef.current.y += 0.002; // slow drift
      }

      const dist = 36;
      camera.position.x = dist * Math.sin(dollhouseRotationRef.current.y) * Math.cos(dollhouseRotationRef.current.x);
      camera.position.z = dist * Math.cos(dollhouseRotationRef.current.y) * Math.cos(dollhouseRotationRef.current.x);
      camera.position.y = dist * Math.sin(dollhouseRotationRef.current.x);
      camera.lookAt(0, 1, 0);

      renderer.render(scene, camera);
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
      cancelAnimationFrame(dollhouseAnimationIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [isOpen, activeTab, sunHour]);

  // Update Sunlight in Dollhouse when slider changes
  useEffect(() => {
    if (dollhouseSunLightRef.current) {
      const sunAngle = ((sunHour - 6) / 12) * Math.PI;
      const sunX = Math.cos(sunAngle) * 32;
      const sunY = Math.max(2, Math.sin(sunAngle) * 28 + 4);
      const sunZ = 22;
      dollhouseSunLightRef.current.position.set(sunX, sunY, sunZ);
    }
  }, [sunHour]);

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

  // Mouse Handlers for 3D Dollhouse
  const handleDollhouseMouseDown = (e: React.MouseEvent) => {
    isDollhouseInteractingRef.current = true;
    dollhousePrevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleDollhouseMouseMove = (e: React.MouseEvent) => {
    if (!isDollhouseInteractingRef.current) return;
    const deltaX = e.clientX - dollhousePrevMousePosRef.current.x;
    const deltaY = e.clientY - dollhousePrevMousePosRef.current.y;
    dollhousePrevMousePosRef.current = { x: e.clientX, y: e.clientY };

    dollhouseRotationRef.current.y -= deltaX * 0.008;
    dollhouseRotationRef.current.x = Math.max(0.15, Math.min(1.4, dollhouseRotationRef.current.x + deltaY * 0.008));
  };

  const handleDollhouseMouseUp = () => {
    isDollhouseInteractingRef.current = false;
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
            : 'max-w-5xl h-[88vh] max-h-[820px]'
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
                  <span>3D Spatial Twin</span>
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                {unit.sqm}m² • {unit.bedrooms} Phòng ngủ • Tầng {unit.floor} • {district}, {city}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('360_sphere')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === '360_sphere'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>360° VR</span>
            </button>

            <button
              onClick={() => setActiveTab('dollhouse')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'dollhouse'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Dollhouse</span>
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
          
          {/* TAB 1: Three.js 360° Panoramic Sphere */}
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

          {/* TAB 2: Three.js 3D Dollhouse Cutaway Floor Plan */}
          {activeTab === 'dollhouse' && (
            <div 
              className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleDollhouseMouseDown}
              onMouseMove={handleDollhouseMouseMove}
              onMouseUp={handleDollhouseMouseUp}
            >
              {/* Three.js Dollhouse Canvas */}
              <div ref={dollhouseMountRef} className="w-full h-full" />

              {/* Sunlight & Time of Day Simulator HUD */}
              <div className="absolute top-4 left-4 bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-200 space-y-2 max-w-xs pointer-events-auto">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    <span>Mô Phỏng Hướng Nắng</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px]">
                    {sunHour}:00 {sunHour < 12 ? 'Sáng' : 'Chiều'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="6" 
                  max="18" 
                  value={sunHour}
                  onChange={(e) => setSunHour(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 leading-tight">
                  Ban công hướng {(unit as any).direction || 'Đông Nam'} đón trọn ánh sáng ban mai dịu nhẹ từ 07:00 - 11:00, tránh nắng gắt buổi chiều.
                </p>
              </div>

              {/* Room Dimensions & Calipers HUD */}
              <div className="absolute top-4 right-4 bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-200 space-y-1.5 pointer-events-auto">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Kích Thước Cắt Lớp</span>
                </div>
                <div 
                  onClick={() => setSelectedRoomDimension(selectedRoomDimension === 'living' ? null : 'living')}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex justify-between gap-3 text-[11px] ${
                    selectedRoomDimension === 'living' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                  }`}
                >
                  <span className="text-slate-300">Phòng Khách:</span>
                  <span className="text-emerald-400 font-bold">28.5 m² (4.2m × 6.8m)</span>
                </div>
                <div 
                  onClick={() => setSelectedRoomDimension(selectedRoomDimension === 'master' ? null : 'master')}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex justify-between gap-3 text-[11px] ${
                    selectedRoomDimension === 'master' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                  }`}
                >
                  <span className="text-slate-300">Phòng Ngủ Master:</span>
                  <span className="text-emerald-400 font-bold">18.2 m² (3.8m × 4.8m)</span>
                </div>
                <div 
                  onClick={() => setSelectedRoomDimension(selectedRoomDimension === 'kitchen' ? null : 'kitchen')}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex justify-between gap-3 text-[11px] ${
                    selectedRoomDimension === 'kitchen' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                  }`}
                >
                  <span className="text-slate-300">Bếp & Ăn:</span>
                  <span className="text-emerald-400 font-bold">12.0 m² (3.2m × 3.75m)</span>
                </div>
              </div>

              {/* Bottom Instructions */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300 pointer-events-none">
                <div className="bg-slate-950/85 px-4 py-2 rounded-2xl backdrop-blur-md border border-slate-800">
                  <span>🏢 Mô hình 3D cắt lớp Dollhouse được sinh tự động từ thông số diện tích {unit.sqm}m²</span>
                </div>
                <div className="bg-slate-950/85 px-3.5 py-2 rounded-2xl backdrop-blur-md border border-slate-800 text-[11px]">
                  Kéo chuột để xoay mô hình 3D
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
              <span>Three.js WebGL Photosphere</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
