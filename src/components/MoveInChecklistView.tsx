import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Zap, 
  Droplets, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';

interface MoveInChecklistViewProps {
  unit?: ApartmentUnit;
  units: ApartmentUnit[];
  onBackToDirectory?: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

interface ChecklistItem {
  id: string;
  category: 'Kết Cấu & Cửa' | 'Thiết Bị Điện Tử' | 'Khu Vực Bếp' | 'Vệ Sinh & Nước' | 'PCCC & An Toàn';
  name: string;
  status: 'good' | 'minor_issue' | 'needs_repair';
  notes: string;
  photoCount: number;
}

const INITIAL_15_ITEMS: ChecklistItem[] = [
  { id: '1', category: 'Kết Cấu & Cửa', name: 'Sơn tường & Trần nhà', status: 'good', notes: 'Sơn mới, không ố mốc', photoCount: 2 },
  { id: '2', category: 'Kết Cấu & Cửa', name: 'Sàn gỗ / Gạch lát nền', status: 'good', notes: 'Không phồng rộp, ron gạch đều', photoCount: 1 },
  { id: '3', category: 'Kết Cấu & Cửa', name: 'Khóa cửa thông minh & Chìa cơ', status: 'good', notes: 'Nhận diện vân tay & mã số nhạy', photoCount: 1 },
  { id: '4', category: 'Kết Cấu & Cửa', name: 'Cửa sổ & Gioăng kính cách âm', status: 'good', notes: 'Đóng mở êm, kín nước mưa', photoCount: 1 },
  { id: '5', category: 'Thiết Bị Điện Tử', name: 'Điều hòa không khí (Inverter)', status: 'good', notes: 'Làm lạnh nhanh, đã vệ sinh lưới lọc', photoCount: 2 },
  { id: '6', category: 'Thiết Bị Điện Tử', name: 'Tủ lạnh 2 cánh', status: 'good', notes: 'Làm đông tốt, không mùi', photoCount: 1 },
  { id: '7', category: 'Thiết Bị Điện Tử', name: 'Máy giặt & Sấy', status: 'good', notes: 'Vận hành êm ái', photoCount: 1 },
  { id: '8', category: 'Khu Vực Bếp', name: 'Bếp từ đôi âm', status: 'good', notes: 'Mặt kính không nứt, cảm ứng nhạy', photoCount: 1 },
  { id: '9', category: 'Khu Vực Bếp', name: 'Máy hút mùi & Đèn bếp', status: 'good', notes: 'Lực hút mạnh, lưới lọc sạch', photoCount: 1 },
  { id: '10', category: 'Khu Vực Bếp', name: 'Tủ bếp & Chậu rửa bát', status: 'good', notes: 'Bản lề êm, xả nước thoát nhanh', photoCount: 1 },
  { id: '11', category: 'Vệ Sinh & Nước', name: 'Bình nóng lạnh & Vòi sen tắm', status: 'good', notes: 'Nóng nhanh trong 5 phút, chống giật ELCB', photoCount: 1 },
  { id: '12', category: 'Vệ Sinh & Nước', name: 'Bồn cầu & Vòi xịt vệ sinh', status: 'good', notes: 'Áp lực nước mạnh, không rò rỉ', photoCount: 1 },
  { id: '13', category: 'PCCC & An Toàn', name: 'Cảm biến khói & Đầu phun Sprinkler', status: 'good', notes: 'Đèn tín hiệu xanh hoạt động', photoCount: 1 },
  { id: '14', category: 'PCCC & An Toàn', name: 'Bình chữa cháy bột mini', status: 'good', notes: 'Đồng hồ áp suất vạch xanh, còn hạn', photoCount: 1 },
  { id: '15', category: 'PCCC & An Toàn', name: 'Ban công & Lưới an toàn', status: 'good', notes: 'Khung chắc chắn, lan can cao 1.4m', photoCount: 1 }
];

export const MoveInChecklistView: React.FC<MoveInChecklistViewProps> = ({
  unit,
  units,
  onBackToDirectory,
  onShowToast
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(unit?.id || units[0]?.id || '');
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_15_ITEMS);
  const [electricMeterNumber, setElectricMeterNumber] = useState<string>('01452.8');
  const [waterMeterNumber, setWaterMeterNumber] = useState<string>('0032.5');
  const [handoverDate, setHandoverDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  const currentUnit = units.find(u => u.id === selectedUnitId) || unit || units[0];

  const handleUpdateStatus = (id: string, status: ChecklistItem['status']) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, notes } : item));
  };

  const goodCount = items.filter(i => i.status === 'good').length;
  const minorCount = items.filter(i => i.status === 'minor_issue').length;
  const repairCount = items.filter(i => i.status === 'needs_repair').length;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Radiating Central Halo & Sheen Sweep */}
      <div className="relative rounded-3xl p-[2.5px] overflow-hidden shadow-2xl group transition-all">
        {/* Central Radiating Halo / Clockwise Light Beams */}
        <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 w-full h-full rounded-[22px] atmospheric-panel haven-sheen-sweep p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                <ClipboardCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Biên Bản Bàn Giao Hiện Trạng 15 Hạng Mục (Move-in Condition Handover)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold mt-1">
                Bảo Vệ Tiền Cọc: Kiểm Kê Hiện Trạng Khi Nhận Phòng
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Lưu vết ảnh chụp, số công tơ điện nước và tình trạng 15 hạng mục cốt lõi làm căn cứ hoàn 100% tiền cọc khi kết thúc hợp đồng.
              </p>
            </div>

            {onBackToDirectory && (
              <button
                onClick={onBackToDirectory}
                className="haven-btn-beam px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-mono hover:bg-slate-800 transition-colors self-start md:self-auto cursor-pointer"
              >
                Quay lại tìm kiếm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unit Selector & Meter Indicators Bar with Radiating Aura Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Apartment Selection */}
        <div className="group relative rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 haven-beam-emerald">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100" />
          </div>
          <div className="relative z-10 w-full h-full p-4 rounded-[14px] atmospheric-panel haven-sheen-sweep border border-emerald-500/30 space-y-2">
            <label className="text-xs font-mono text-emerald-400 [data-theme='light']_:text-emerald-700 uppercase tracking-wider font-bold block">
              Căn Hộ Bàn Giao
            </label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 [data-theme='light']_:bg-slate-50 border border-slate-700 [data-theme='light']_:border-slate-300 text-slate-100 [data-theme='light']_:text-slate-900 font-sans text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name || u.id} ({u.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Handover Date */}
        <div className="group relative rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 haven-beam-purple">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100" />
          </div>
          <div className="relative z-10 w-full h-full p-4 rounded-[14px] atmospheric-panel haven-sheen-sweep border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-300 [data-theme='light']_:text-purple-700 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Ngày Bàn Giao
              </span>
            </div>
            <input
              type="date"
              value={handoverDate}
              onChange={(e) => setHandoverDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 [data-theme='light']_:bg-slate-50 border border-slate-700 [data-theme='light']_:border-slate-300 text-slate-100 [data-theme='light']_:text-slate-900 font-mono text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Initial Electric Meter Reading */}
        <div className="group relative rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 haven-beam-gold">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100" />
          </div>
          <div className="relative z-10 w-full h-full p-4 rounded-[14px] atmospheric-panel haven-sheen-sweep border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-300 [data-theme='light']_:text-amber-700 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Công Tơ Điện
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">kWh</span>
            </div>
            <input
              type="text"
              value={electricMeterNumber}
              onChange={(e) => setElectricMeterNumber(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 [data-theme='light']_:bg-amber-50/50 border border-slate-700 [data-theme='light']_:border-amber-300 text-amber-300 [data-theme='light']_:text-amber-800 font-mono font-bold text-base cursor-pointer"
            />
          </div>
        </div>

        {/* Initial Water Meter Reading */}
        <div className="group relative rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 haven-beam-cyan">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100" />
          </div>
          <div className="relative z-10 w-full h-full p-4 rounded-[14px] atmospheric-panel haven-sheen-sweep border border-sky-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-300 [data-theme='light']_:text-sky-700 font-bold flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" /> Đồng Hồ Nước
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">m³</span>
            </div>
            <input
              type="text"
              value={waterMeterNumber}
              onChange={(e) => setWaterMeterNumber(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 [data-theme='light']_:bg-sky-50/50 border border-slate-700 [data-theme='light']_:border-sky-300 text-sky-300 [data-theme='light']_:text-sky-800 font-mono font-bold text-base cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Overview Status Metrics */}
      <div className="p-6 rounded-3xl liquid-glass-origin border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl backdrop-blur-2xl">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 [data-theme=\'light\']_:bg-emerald-50 border border-emerald-500/40 [data-theme=\'light\']_:border-emerald-300 text-emerald-300 [data-theme=\'light\']_:text-emerald-900 text-xs font-mono font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{goodCount} / 15 Đạt Chuẩn Tốt</span>
          </div>

          {minorCount > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/80 [data-theme=\'light\']_:bg-amber-50 border border-amber-500/40 [data-theme=\'light\']_:border-amber-300 text-amber-300 [data-theme=\'light\']_:text-amber-900 text-xs font-mono font-bold shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{minorCount} Vết Xước Nhẹ (Chấp nhận)</span>
            </div>
          )}

          {repairCount > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/80 [data-theme=\'light\']_:bg-rose-50 border border-rose-500/40 [data-theme=\'light\']_:border-rose-300 text-rose-300 [data-theme=\'light\']_:text-rose-900 text-xs font-mono font-bold shadow-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{repairCount} Cần Chủ Nhà Khắc Phục</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsFinalized(true);
              if (onShowToast) {
                onShowToast('success', 'Đã khóa biên bản bàn giao 15 hạng mục', `Căn hộ ${currentUnit.name || currentUnit.id} - Mã BB: BB-HAVEN-${Date.now().toString().slice(-6)}`);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isFinalized ? 'Đã Khóa Bảo Chứng' : 'Khóa Biên Bản & Lưu Hồ Sơ'}</span>
          </button>
        </div>
      </div>

      {/* 15-Item Checklist Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-800/80 [data-theme='light']_:border-slate-200/80 bg-slate-900/60 [data-theme='light']_:bg-white/80 backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left text-xs font-mono border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-slate-800/80 [data-theme='light']_:border-slate-200/80 bg-slate-950/60 [data-theme='light']_:bg-slate-50/80 text-slate-400 [data-theme='light']_:text-slate-600 font-bold">
              <th className="p-4 w-12 text-center">STT</th>
              <th className="p-4 w-48">Phân Nhóm</th>
              <th className="p-4">Hạng Mục Kiểm Tra</th>
              <th className="p-4 w-52">Tình Trạng Hiện Tại</th>
              <th className="p-4">Ghi Chú Chi Tiết</th>
              <th className="p-4 w-28 text-center">Ảnh Minh Chứng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 [data-theme='light']_:divide-slate-200 text-slate-300 [data-theme='light']_:text-slate-800">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-emerald-950/50 hover:text-emerald-200 border-l-4 border-l-transparent hover:border-l-emerald-400 transition-all duration-150">
                <td className="p-4 text-center text-slate-500 [data-theme='light']_:text-slate-400 font-bold">{idx + 1}</td>
                <td className="p-4 text-slate-400 [data-theme='light']_:text-slate-600 font-semibold">{item.category}</td>
                <td className="p-4 font-serif text-sm font-bold text-slate-100 [data-theme='light']_:text-slate-900">{item.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'good')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all font-bold ${
                        item.status === 'good'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 [data-theme=\'light\']_:bg-slate-100 text-slate-400 [data-theme=\'light\']_:text-slate-600 border border-slate-800 [data-theme=\'light\']_:border-slate-200'
                      }`}
                    >
                      Tốt
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'minor_issue')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all font-bold ${
                        item.status === 'minor_issue'
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 [data-theme=\'light\']_:bg-slate-100 text-slate-400 [data-theme=\'light\']_:text-slate-600 border border-slate-800 [data-theme=\'light\']_:border-slate-200'
                      }`}
                    >
                      Xước nhẹ
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'needs_repair')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all font-bold ${
                        item.status === 'needs_repair'
                          ? 'bg-rose-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 [data-theme=\'light\']_:bg-slate-100 text-slate-400 [data-theme=\'light\']_:text-slate-600 border border-slate-800 [data-theme=\'light\']_:border-slate-200'
                      }`}
                    >
                      Cần sửa
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/80 [data-theme='light']_:bg-slate-50 border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-200 [data-theme='light']_:text-slate-900 font-sans text-xs focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => {
                      if (onShowToast) {
                        onShowToast('info', `Ảnh hiện trạng: ${item.name}`, `Đang tải ${item.photoCount} ảnh minh chứng độ phân giải cao.`);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-300 [data-theme='light']_:text-slate-700 hover:text-emerald-500 text-[11px] font-mono transition-colors font-semibold"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.photoCount} ảnh</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
