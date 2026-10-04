import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Zap, 
  Droplets, 
  ShieldCheck,
  Calendar,
  Building,
  Check
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
      {/* Header Banner - Wise Signature Style */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] font-bold text-xs uppercase tracking-wider mb-2">
              <ClipboardCheck className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Biên Bản Bàn Giao Hiện Trạng 15 Hạng Mục (Move-in Condition Handover)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-white mt-1">
              Bảo Vệ Tiền Cọc: Kiểm Kê Hiện Trạng Khi Nhận Phòng
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
              Lưu vết ảnh chụp, số công tơ điện nước và tình trạng 15 hạng mục cốt lõi làm căn cứ hoàn 100% tiền cọc khi kết thúc hợp đồng minh bạch.
            </p>
          </div>

          {onBackToDirectory && (
            <button
              onClick={onBackToDirectory}
              className="px-5 py-2.5 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 text-[#163300] dark:text-white font-bold text-xs transition-colors self-start md:self-auto cursor-pointer"
            >
              ← Quay lại tìm kiếm
            </button>
          )}
        </div>
      </div>

      {/* Unit Selector & Meter Indicators Bar - Wise Multi-Accent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Apartment Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-2 border-l-4 border-l-[#9FE870]">
          <label className="text-xs font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider block flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" /> Căn Hộ Bàn Giao
          </label>
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="w-full px-3 py-2 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870] cursor-pointer"
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>
                {u.name || u.id} ({u.district})
              </option>
            ))}
          </select>
        </div>

        {/* Handover Date */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-2 border-l-4 border-l-[#8B5CF6]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" /> Ngày Bàn Giao
            </span>
          </div>
          <input
            type="date"
            value={handoverDate}
            onChange={(e) => setHandoverDate(e.target.value)}
            className="w-full px-3 py-2 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] cursor-pointer"
          />
        </div>

        {/* Initial Electric Meter Reading */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-2 border-l-4 border-l-[#FFC83B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9A6700] dark:text-[#FFC83B] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FFC83B]" /> Công Tơ Điện
            </span>
            <span className="text-[11px] font-bold text-slate-500">kWh</span>
          </div>
          <input
            type="text"
            value={electricMeterNumber}
            onChange={(e) => setElectricMeterNumber(e.target.value)}
            className="w-full px-3.5 py-1.5 rounded-full bg-[#FFF8E6] dark:bg-slate-800 border border-[#FFC83B] text-[#9A6700] dark:text-[#FFC83B] font-mono font-bold text-sm"
          />
        </div>

        {/* Initial Water Meter Reading */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-2 border-l-4 border-l-[#2570EB]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2570EB] uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#2570EB]" /> Đồng Hồ Nước
            </span>
            <span className="text-[11px] font-bold text-slate-500">m³</span>
          </div>
          <input
            type="text"
            value={waterMeterNumber}
            onChange={(e) => setWaterMeterNumber(e.target.value)}
            className="w-full px-3.5 py-1.5 rounded-full bg-[#EBF2FF] dark:bg-slate-800 border border-[#2570EB] text-[#2570EB] dark:text-blue-300 font-mono font-bold text-sm"
          />
        </div>
      </div>

      {/* Overview Status Metrics - Wise Pill Bar */}
      <div className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F8EC] text-[#163300] text-xs font-bold border border-[#9FE870]">
            <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
            <span>{goodCount} / 15 Đạt Chuẩn Tốt</span>
          </div>

          {minorCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8E6] text-[#9A6700] text-xs font-bold border border-[#FFC83B]">
              <AlertTriangle className="w-4 h-4 text-[#FFC83B]" />
              <span>{minorCount} Vết Xước Nhẹ (Chấp nhận)</span>
            </div>
          )}

          {repairCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEECEB] text-[#D92D20] text-xs font-bold border border-[#FF5436]">
              <AlertTriangle className="w-4 h-4 text-[#FF5436]" />
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
            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              isFinalized 
                ? 'bg-[#163300] text-[#9FE870]'
                : 'bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] hover:scale-105 active:scale-95'
            }`}
          >
            {isFinalized ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{isFinalized ? 'Đã Khóa Bảo Chứng' : 'Khóa Biên Bản & Lưu Hồ Sơ'}</span>
          </button>
        </div>
      </div>

      {/* 15-Item Checklist Table - Clean Wise Style */}
      <div className="overflow-x-auto rounded-[28px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-2 sm:p-4">
        <table className="w-full text-left text-xs border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-[#F2F5F0] dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider rounded-xl">
              <th className="p-3.5 w-12 text-center rounded-l-xl">STT</th>
              <th className="p-3.5 w-48">Phân Nhóm</th>
              <th className="p-3.5">Hạng Mục Kiểm Tra</th>
              <th className="p-3.5 w-56">Tình Trạng Hiện Tại</th>
              <th className="p-3.5">Ghi Chú Chi Tiết</th>
              <th className="p-3.5 w-32 text-center rounded-r-xl">Ảnh Minh Chứng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-3.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                <td className="p-3.5 text-slate-500 font-semibold">{item.category}</td>
                <td className="p-3.5 font-bold text-[#163300] dark:text-white">{item.name}</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'good')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        item.status === 'good'
                          ? 'bg-[#9FE870] text-[#163300] shadow-sm'
                          : 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      Tốt
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'minor_issue')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        item.status === 'minor_issue'
                          ? 'bg-[#FFC83B] text-[#163300] shadow-sm'
                          : 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      Xước nhẹ
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'needs_repair')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        item.status === 'needs_repair'
                          ? 'bg-[#FF5436] text-white shadow-sm'
                          : 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      Cần sửa
                    </button>
                  </div>
                </td>
                <td className="p-3.5">
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
                  />
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => {
                      if (onShowToast) {
                        onShowToast('info', `Ảnh hiện trạng: ${item.name}`, `Đang tải ${item.photoCount} ảnh minh chứng độ phân giải cao.`);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
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
