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
  onBackToDirectory
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            <ClipboardCheck className="w-4 h-4" />
            <span>Biên Bản Bàn Giao Hiện Trạng 15 Hạng Mục (Move-in Condition Handover)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-100 font-bold mt-1">
            Bảo Vệ Tiền Cọc: Kiểm Kê Hiện Trạng Khi Nhận Phòng
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Lưu vết ảnh chụp, số công tơ điện nước và tình trạng 15 hạng mục cốt lõi làm căn cứ hoàn 100% tiền cọc khi kết thúc hợp đồng.
          </p>
        </div>

        {onBackToDirectory && (
          <button
            onClick={onBackToDirectory}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-800 transition-colors self-start md:self-auto"
          >
            Quay lại tìm kiếm
          </button>
        )}
      </div>

      {/* Unit Selector & Meter Indicators Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Apartment Selection */}
        <div className="p-5 rounded-2xl atmospheric-panel border border-slate-800 space-y-2">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block">
            Căn Hộ Bàn Giao
          </label>
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans text-sm focus:outline-none focus:border-emerald-500"
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>
                {u.name || u.id} ({u.district})
              </option>
            ))}
          </select>
        </div>

        {/* Handover Date */}
        <div className="p-5 rounded-2xl atmospheric-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Ngày Bàn Giao
            </span>
          </div>
          <input
            type="date"
            value={handoverDate}
            onChange={(e) => setHandoverDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Initial Electric Meter Reading */}
        <div className="p-5 rounded-2xl atmospheric-panel border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Chỉ Số Công Tơ Điện Ban Đầu
            </span>
            <span className="text-[10px] font-mono text-slate-400">kWh</span>
          </div>
          <input
            type="text"
            value={electricMeterNumber}
            onChange={(e) => setElectricMeterNumber(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold text-lg"
          />
        </div>

        {/* Initial Water Meter Reading */}
        <div className="p-5 rounded-2xl atmospheric-panel border border-sky-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-300 font-semibold flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" /> Chỉ Số Đồng Hồ Nước Ban Đầu
            </span>
            <span className="text-[10px] font-mono text-slate-400">m³</span>
          </div>
          <input
            type="text"
            value={waterMeterNumber}
            onChange={(e) => setWaterMeterNumber(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sky-300 font-mono font-bold text-lg"
          />
        </div>
      </div>

      {/* Overview Status Metrics */}
      <div className="p-6 rounded-3xl liquid-glass-origin border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl backdrop-blur-2xl">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{goodCount} / 15 Đạt Chuẩn Tốt</span>
          </div>

          {minorCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{minorCount} Vết Xước Nhẹ (Chấp nhận)</span>
            </div>
          )}

          {repairCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{repairCount} Cần Chủ Nhà Khắc Phục</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsFinalized(true);
              alert(`✅ Đã khóa biên bản bàn giao hiện trạng 15 hạng mục cho căn ${currentUnit.name || currentUnit.id}!\nMã biên bản: BB-HAVEN-${Date.now().toString().slice(-6)}`);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isFinalized ? 'Đã Khóa Bảo Chứng' : 'Khóa Biên Bản & Lưu Hồ Sơ'}</span>
          </button>
        </div>
      </div>

      {/* 15-Item Checklist Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl">
        <table className="w-full text-left text-xs font-mono border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <th className="p-4 w-12 text-center">STT</th>
              <th className="p-4 w-48">Phân Nhóm</th>
              <th className="p-4">Hạng Mục Kiểm Tra</th>
              <th className="p-4 w-52">Tình Trạng Hiện Tại</th>
              <th className="p-4">Ghi Chú Chi Tiết</th>
              <th className="p-4 w-28 text-center">Ảnh Minh Chứng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-4 text-center text-slate-500 font-bold">{idx + 1}</td>
                <td className="p-4 text-slate-400 font-semibold">{item.category}</td>
                <td className="p-4 font-serif text-sm font-bold text-slate-100">{item.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'good')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                        item.status === 'good'
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Tốt
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'minor_issue')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                        item.status === 'minor_issue'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Xước nhẹ
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'needs_repair')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                        item.status === 'needs_repair'
                          ? 'bg-rose-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
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
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 font-sans text-xs focus:outline-none focus:border-emerald-500"
                  />
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => alert(`Xem ${item.photoCount} ảnh hiện trạng chụp thực tế cho mục "${item.name}"`)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-300 text-[11px] font-mono transition-colors"
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
