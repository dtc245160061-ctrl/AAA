import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Eye, 
  ArrowRight, 
  RotateCw,
  Building
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
  const rooms: VirtualTourRoom[] = [
    {
      id: 'room-living',
      roomName: 'Phòng Khách Panorama & Ban Công',
      imageUrl: unit.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      description: 'Không gian mở rộng rãi với kính tràn viền Low-E cách âm nhiệt và view toàn cảnh hồ nước.',
      hotspots: [
        { id: 'hs-1', label: 'Đi tới Phòng Ngủ Master', targetRoomId: 'room-master', xPercent: 78, yPercent: 48 },
        { id: 'hs-2', label: 'Đi tới Khu Vực Bếp Mở', targetRoomId: 'room-kitchen', xPercent: 22, yPercent: 52 }
      ]
    },
    {
      id: 'room-master',
      roomName: 'Phòng Ngủ Master Suite',
      imageUrl: unit.images[1] || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200',
      description: 'Trang bị giường King size, sàn gỗ tự nhiên chống ẩm và phòng tắm kính walk-in khép kín.',
      hotspots: [
        { id: 'hs-3', label: 'Quay lại Phòng Khách', targetRoomId: 'room-living', xPercent: 18, yPercent: 55 },
        { id: 'hs-4', label: 'Đi tới Ban Công View Biển/Hồ', targetRoomId: 'room-balcony', xPercent: 82, yPercent: 45 }
      ]
    },
    {
      id: 'room-kitchen',
      roomName: 'Khu Bếp Mở & Bàn Đảo Hiện Đại',
      imageUrl: unit.images[2] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      description: 'Hệ tủ bếp kịch trần, bếp từ âm đôi, máy hút mùi than hoạt tính và chậu rửa inox 304.',
      hotspots: [
        { id: 'hs-5', label: 'Quay lại Phòng Khách', targetRoomId: 'room-living', xPercent: 85, yPercent: 50 }
      ]
    },
    {
      id: 'room-balcony',
      roomName: 'Ban Công View Hoàng Hôn & Lưới An Toàn',
      imageUrl: unit.images[3] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      description: 'Lan can kính cường lực cao 1.4m đạt chuẩn an toàn, trang bị lưới bảo vệ tàng hình cho trẻ nhỏ.',
      hotspots: [
        { id: 'hs-6', label: 'Vào Phòng Ngủ Master', targetRoomId: 'room-master', xPercent: 20, yPercent: 50 }
      ]
    }
  ];

  const [activeRoomId, setActiveRoomId] = useState<string>('room-living');
  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl atmospheric-panel border border-emerald-500/40 overflow-hidden shadow-2xl flex flex-col">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Compass className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-100">{activeRoom.roomName}</h3>
              <p className="text-xs font-mono text-emerald-400">Trải Nghiệm Thực Tế Ảo 360° Virtual Tour • {unit.name || unit.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
              360° VR Mode
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 360 Canvas Viewport */}
        <div className="relative h-[480px] bg-slate-950 overflow-hidden">
          <img
            src={activeRoom.imageUrl}
            alt={activeRoom.roomName}
            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Hotspots Overlaid */}
          {activeRoom.hotspots.map((hs) => (
            <button
              key={hs.id}
              onClick={() => setActiveRoomId(hs.targetRoomId)}
              style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-slate-950/90 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all flex items-center gap-1.5 group z-10 animate-bounce"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{hs.label}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}

          {/* Bottom Info Bar in Viewport */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-200 pointer-events-none">
            <p className="bg-slate-950/80 px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-slate-800 max-w-md line-clamp-1">
              {activeRoom.description}
            </p>
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Góc nhìn 360° độ phân giải cao</span>
            </div>
          </div>
        </div>

        {/* Room Switcher Footer Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          {rooms.map((room) => {
            const isCurrent = room.id === activeRoomId;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>{room.roomName.split('&')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
