import React, { useState, useMemo } from 'react';
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
  Check,
  Sparkles,
  Upload,
  X,
  Activity,
  ArrowRight
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { 
  scanUtilityMeterOcr, 
  calculateEvn6TierElectricity, 
  calculateWaterCost,
  evaluateChecklistFromNaturalNotes,
  DEMO_PRESETS,
  type MeterOcrResult
} from '../services/aiOcrAndFormService';

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
  const [electricMeterNumber, setElectricMeterNumber] = useState<string>('01684.5');
  const [previousElectricKwh, setPreviousElectricKwh] = useState<number>(1452.8);
  const [waterMeterNumber, setWaterMeterNumber] = useState<string>('0048.2');
  const [previousWaterM3, setPreviousWaterM3] = useState<number>(32.5);
  const [handoverDate, setHandoverDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  // Meter OCR Scanner Modal State
  const [isMeterModalOpen, setIsMeterModalOpen] = useState<boolean>(false);
  const [scanType, setScanType] = useState<'electric' | 'water'>('electric');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [ocrPreviewUrl, setOcrPreviewUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<MeterOcrResult | null>(null);

  // Natural Language Checklist Inspector State
  const [naturalNotes, setNaturalNotes] = useState<string>('');
  const [isEvaluatingNotes, setIsEvaluatingNotes] = useState<boolean>(false);
  const [updatedItemIds, setUpdatedItemIds] = useState<string[]>([]);

  const currentUnit = units.find(u => u.id === selectedUnitId) || unit || units[0];

  // Calculate Consumed Electric & Water
  const currentElectricNum = parseFloat(electricMeterNumber) || 0;
  const consumedElectricKwh = Math.max(0, currentElectricNum - previousElectricKwh);

  const currentWaterNum = parseFloat(waterMeterNumber) || 0;
  const consumedWaterM3 = Math.max(0, currentWaterNum - previousWaterM3);

  // EVN 6-Tier Calculation
  const evnCalculation = useMemo(() => {
    return calculateEvn6TierElectricity(consumedElectricKwh);
  }, [consumedElectricKwh]);

  // Water Cost Calculation
  const waterCalculation = useMemo(() => {
    return calculateWaterCost(consumedWaterM3);
  }, [consumedWaterM3]);

  // Anomaly Check against IoT Sensor Baseline
  const iotBaselineKwh = currentUnit?.sensors?.energyConsumptionKwh || 180;
  const isElectricityAnomaly = consumedElectricKwh > iotBaselineKwh * 1.8;

  const handleUpdateStatus = (id: string, status: ChecklistItem['status']) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, notes } : item));
  };

  // Open OCR Scanner Modal
  const handleOpenOcrModal = (type: 'electric' | 'water') => {
    setScanType(type);
    setOcrResult(null);
    setOcrPreviewUrl(type === 'electric' ? DEMO_PRESETS.electricMeterSvg : DEMO_PRESETS.waterMeterSvg);
    setIsMeterModalOpen(true);
  };

  // Run OCR Scan
  const executeScan = async (source: File | string, type: 'electric' | 'water') => {
    setIsScanning(true);
    try {
      const res = await scanUtilityMeterOcr(source, previousElectricKwh, previousWaterM3);
      setOcrResult(res);
      if (onShowToast) {
        onShowToast(
          'success',
          `AI OCR Thành Công (${res.confidenceScore.toFixed(1)}%)`,
          `Đã nhận diện chỉ số: ${type === 'electric' ? res.electricReadingKwh + ' kWh' : res.waterReadingM3 + ' m³'}`
        );
      }
    } catch {
      if (onShowToast) {
        onShowToast('error', 'Lỗi phân tích OCR', 'Vui lòng thử lại với ảnh rõ nét hơn.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Apply OCR Result to form
  const handleApplyOcrResult = () => {
    if (!ocrResult) return;
    if (scanType === 'electric' && ocrResult.electricReadingKwh !== undefined) {
      setElectricMeterNumber(ocrResult.electricReadingKwh.toString());
      if (ocrResult.previousElectricKwh !== undefined) {
        setPreviousElectricKwh(ocrResult.previousElectricKwh);
      }
    } else if (scanType === 'water' && ocrResult.waterReadingM3 !== undefined) {
      setWaterMeterNumber(ocrResult.waterReadingM3.toString());
      if (ocrResult.previousWaterM3 !== undefined) {
        setPreviousWaterM3(ocrResult.previousWaterM3);
      }
    }
    setIsMeterModalOpen(false);
    if (onShowToast) {
      onShowToast('info', 'Đã cập nhật biên bản', `Chỉ số công tơ ${scanType === 'electric' ? 'điện' : 'nước'} đã được điền tự động.`);
    }
  };

  // Natural language batch inspection
  const handleRunNlpInspector = async (textToProcess?: string) => {
    const text = (textToProcess || naturalNotes).trim();
    if (!text) {
      if (onShowToast) onShowToast('info', 'Vui lòng nhập ghi chú', 'Gõ hoặc chọn câu ghi chú mẫu bên dưới để AI phân tích.');
      return;
    }

    setIsEvaluatingNotes(true);
    try {
      const { updatedItems } = evaluateChecklistFromNaturalNotes(text, items);
      
      // Determine which items were modified
      const modifiedIds: string[] = [];
      updatedItems.forEach((evalItem) => {
        const orig = items.find(i => i.id === evalItem.id);
        if (orig && (orig.status !== evalItem.status || orig.notes !== evalItem.notes)) {
          modifiedIds.push(evalItem.id);
        }
      });

      setItems(updatedItems as ChecklistItem[]);
      setUpdatedItemIds(modifiedIds);

      // Clear highlight after 4 seconds
      setTimeout(() => setUpdatedItemIds([]), 4000);

      if (onShowToast) {
        onShowToast(
          'success',
          'AI Tự Động Đánh Giá 15 Hạng Mục',
          `Đã đối chiếu và cập nhật trạng thái của ${modifiedIds.length} hạng mục từ ghi chú!`
        );
      }
    } finally {
      setIsEvaluatingNotes(false);
    }
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
              Bảo Vệ Tiền Cọc: Kiểm Kê Hiện Trạng & Smart OCR Công Tơ
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
              Tích hợp AI Vision OCR quét công tơ điện nước, tính biểu giá điện sinh hoạt 6 bậc EVN minh bạch và nhận diện ghi chú tự động điền 15 hạng mục.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenOcrModal('electric')}
              className="px-4 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>AI Quét Ảnh Công Tơ (OCR)</span>
            </button>

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
            <button 
              onClick={() => handleOpenOcrModal('electric')}
              className="text-[11px] font-bold text-[#163300] dark:text-[#9FE870] underline hover:opacity-80 flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Quét OCR
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={electricMeterNumber}
              onChange={(e) => setElectricMeterNumber(e.target.value)}
              className="w-full px-3.5 py-1.5 rounded-full bg-[#FFF8E6] dark:bg-slate-800 border border-[#FFC83B] text-[#9A6700] dark:text-[#FFC83B] font-mono font-bold text-sm"
            />
            <span className="text-[11px] font-bold text-slate-500 shrink-0">kWh</span>
          </div>
        </div>

        {/* Initial Water Meter Reading */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-2 border-l-4 border-l-[#2570EB]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2570EB] uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#2570EB]" /> Đồng Hồ Nước
            </span>
            <button 
              onClick={() => handleOpenOcrModal('water')}
              className="text-[11px] font-bold text-[#2570EB] underline hover:opacity-80 flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Quét OCR
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={waterMeterNumber}
              onChange={(e) => setWaterMeterNumber(e.target.value)}
              className="w-full px-3.5 py-1.5 rounded-full bg-[#EBF2FF] dark:bg-slate-800 border border-[#2570EB] text-[#2570EB] dark:text-blue-300 font-mono font-bold text-sm"
            />
            <span className="text-[11px] font-bold text-slate-500 shrink-0">m³</span>
          </div>
        </div>
      </div>

      {/* EVN 6-TIER PROGRESSIVE TARIFF & WATER BREAKDOWN CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF8E6] text-[#FFC83B] flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-[#9A6700] dark:text-[#FFC83B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#163300] dark:text-white flex items-center gap-2">
                <span>AI Đối Chiếu Biểu Giá Điện Sinh Hoạt 6 Bậc EVN & Nước Sạch</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] text-[10px] font-bold">
                  Bảo Chứng Tiền Điện Nước
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tính toán chính xác theo Quyết định biểu giá EVN ban hành mới nhất + 8% thuế GTGT.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {isElectricityAnomaly ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F0] text-[#D92D20] text-xs font-bold border border-[#FF5436]/40">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF5436]" />
                <span>Cảnh báo: Tiêu thụ cao hơn 80% so với IoT Baseline ({iotBaselineKwh} kWh)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] text-xs font-bold border border-[#9FE870]/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
                <span>Tiêu thụ hợp lý (IoT Baseline: {iotBaselineKwh} kWh/tháng)</span>
              </div>
            )}
          </div>
        </div>

        {/* Index and Consumed Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Chỉ Số Điện Tiêu Thụ</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-[#163300] dark:text-white">
                {consumedElectricKwh.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">kWh</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>{previousElectricKwh}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>{currentElectricNum}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF8E6] dark:bg-amber-950/20 border border-[#FFC83B]/30 space-y-1">
            <span className="text-[11px] font-bold text-[#9A6700] dark:text-[#FFC83B] uppercase">Ước Tính Tiền Điện (EVN 6 Bậc)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-[#9A6700] dark:text-[#FFC83B]">
                {evnCalculation.totalVND.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs text-slate-500 font-bold">VNĐ</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Đã gồm 8% VAT ({evnCalculation.vatVND.toLocaleString('vi-VN')} đ)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EBF2FF] dark:bg-blue-950/20 border border-[#2570EB]/30 space-y-1">
            <span className="text-[11px] font-bold text-[#2570EB] uppercase">Nước Tiêu Thụ</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-[#2570EB]">
                {consumedWaterM3.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">m³</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>{previousWaterM3}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>{currentWaterNum}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/20 border border-[#9FE870]/40 space-y-1">
            <span className="text-[11px] font-bold text-[#163300] dark:text-[#9FE870] uppercase">Tổng Tiền Điện + Nước Kỳ Này</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-[#163300] dark:text-[#9FE870]">
                {(evnCalculation.totalVND + waterCalculation.costVND).toLocaleString('vi-VN')}
              </span>
              <span className="text-xs text-slate-500 font-bold">VNĐ</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Tiền nước: {waterCalculation.costVND.toLocaleString('vi-VN')} đ ({waterCalculation.ratePerM3.toLocaleString()} đ/m³)
            </div>
          </div>
        </div>

        {/* 6-Tier EVN Breakdown Bars */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Chi tiết phân bổ 6 bậc thang lũy tiến EVN:</span>
            <span className="text-slate-400">Đơn giá chưa VAT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {evnCalculation.tiers.map((tier) => (
              <div 
                key={tier.tier}
                className={`p-2.5 rounded-xl border transition-all ${
                  tier.kwh > 0 
                    ? 'bg-white dark:bg-slate-800 border-[#9FE870] shadow-xs' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span className="text-[#163300] dark:text-[#9FE870]">Bậc {tier.tier}</span>
                  <span className="text-slate-500">{tier.label}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-mono font-bold text-xs">
                    {tier.kwh} <span className="text-[10px] text-slate-400">kWh</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {tier.rate.toLocaleString()} đ
                  </span>
                </div>
                <div className="text-[11px] font-mono text-right font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  {tier.costVND.toLocaleString()} đ
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI NATURAL LANGUAGE CHECKLIST INSPECTOR BAR */}
      <div className="bg-gradient-to-r from-[#F7FAF6] via-white to-[#F2F5F0] dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 rounded-[28px] border-2 border-[#9FE870]/60 dark:border-[#9FE870]/30 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#9FE870] text-[#163300] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#163300] dark:text-white">
                AI Đánh Giá Nhanh 15 Hạng Mục Từ Ghi Chú Tóm Tắt (NLP Inspector)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gõ hoặc nói một câu tóm tắt — AI sẽ tự động phân loại đúng 15 hạng mục, đổi trạng thái và điền ghi chú chi tiết.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#163300] dark:text-[#9FE870] px-3 py-1 rounded-full bg-[#E8F8EC] dark:bg-emerald-950/40 border border-[#9FE870]/30 self-start sm:self-auto">
            Zero-Click Auto-Fill
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={naturalNotes}
              onChange={(e) => setNaturalNotes(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleRunNlpInspector();
                }
              }}
              placeholder="VD: Tất cả đều tốt trừ điều hòa phòng ngủ cần vệ sinh và tường bếp hơi xước nhẹ..."
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] pr-10 font-sans shadow-xs"
            />
            {naturalNotes && (
              <button 
                onClick={() => setNaturalNotes('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleRunNlpInspector()}
            disabled={isEvaluatingNotes}
            className="px-6 py-3 rounded-2xl bg-[#163300] hover:bg-[#204900] text-[#9FE870] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEvaluatingNotes ? 'AI Đang Phân Tích...' : 'AI Phân Tích & Điền Form'}</span>
          </button>
        </div>

        {/* Quick Sample Demo Chips for Classroom Presentation */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-slate-500 font-bold text-[11px]">Thử câu mẫu demo:</span>
          {[
            {
              label: 'Mẫu 1: Điều hòa & Tường xước',
              text: 'Tất cả đều tốt trừ điều hòa phòng ngủ cần vệ sinh và tường bếp hơi xước nhẹ'
            },
            {
              label: 'Mẫu 2: Tủ lạnh mùi, bếp từ nứt',
              text: 'Tủ lạnh có mùi, bếp từ nứt nhẹ, sàn gỗ phòng khách xước nhẹ, còn lại tất cả đạt chuẩn'
            },
            {
              label: 'Mẫu 3: Lỗi khóa vân tay & nóng lạnh',
              text: 'Khóa cửa thông minh lỗi vân tay, bình nóng lạnh không nóng, còn lại tốt'
            }
          ].map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNaturalNotes(sample.text);
                handleRunNlpInspector(sample.text);
              }}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#9FE870] text-[#163300] dark:text-slate-200 text-[11px] font-medium transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            >
              ⚡ {sample.label}
            </button>
          ))}
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
                onShowToast(
                  'success', 
                  'Đã khóa biên bản bàn giao 15 hạng mục', 
                  `Căn hộ ${currentUnit.name || currentUnit.id} - Mã BB: BB-HAVEN-${Date.now().toString().slice(-6)}`
                );
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
            {items.map((item, idx) => {
              const isRecentlyUpdated = updatedItemIds.includes(item.id);
              return (
                <tr 
                  key={item.id} 
                  className={`transition-colors ${
                    isRecentlyUpdated 
                      ? 'bg-[#E8F8EC] dark:bg-emerald-950/30 ring-2 ring-[#9FE870]' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="p-3.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                  <td className="p-3.5 text-slate-500 font-semibold">{item.category}</td>
                  <td className="p-3.5 font-bold text-[#163300] dark:text-white flex items-center gap-1.5">
                    <span>{item.name}</span>
                    {isRecentlyUpdated && (
                      <span className="w-2 h-2 rounded-full bg-[#163300] dark:bg-[#9FE870] animate-ping" />
                    )}
                  </td>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL: SMART OCR UTILITY METER SCANNER */}
      {isMeterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF8E6] text-[#9A6700] dark:text-[#FFC83B] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#163300] dark:text-white">
                    AI OCR Quét Công Tơ {scanType === 'electric' ? 'Điện (kWh)' : 'Nước (m³)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nhận diện chỉ số cơ & điện tử từ ảnh chụp, tự động phát hiện số liệu bất thường.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMeterModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setScanType('electric');
                  setOcrPreviewUrl(DEMO_PRESETS.electricMeterSvg);
                  setOcrResult(null);
                }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  scanType === 'electric'
                    ? 'bg-[#FFC83B] text-[#163300] shadow-sm'
                    : 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Công Tơ Điện (kWh)</span>
              </button>
              <button
                onClick={() => {
                  setScanType('water');
                  setOcrPreviewUrl(DEMO_PRESETS.waterMeterSvg);
                  setOcrResult(null);
                }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  scanType === 'water'
                    ? 'bg-[#2570EB] text-white shadow-sm'
                    : 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Đồng Hồ Nước (m³)</span>
              </button>
            </div>

            {/* Image Preview & Laser Scan Animation Container */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-900/90 aspect-video flex items-center justify-center">
              {ocrPreviewUrl ? (
                <img 
                  src={ocrPreviewUrl} 
                  alt="Meter Preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">Chưa có ảnh nào được tải lên</p>
                </div>
              )}

              {/* Laser Scan Animation Line */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-[#9FE870] shadow-[0_0_15px_#9FE870] animate-[laser_1.5s_ease-in-out_infinite]" />
                  <div className="absolute inset-0 bg-[#9FE870]/10 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-black/80 text-[#9FE870] font-mono text-xs font-bold tracking-wider animate-pulse">
                      SCANNING DIGITS...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Sample Action Buttons */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-500 font-bold block">1-Click Test Nhanh (Dành cho Demo Giảng Dạy):</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    const preset = scanType === 'electric' ? DEMO_PRESETS.electricMeterSvg : DEMO_PRESETS.waterMeterSvg;
                    setOcrPreviewUrl(preset);
                    executeScan(preset, scanType);
                  }}
                  disabled={isScanning}
                  className="px-4 py-2 rounded-full bg-[#163300] hover:bg-[#204900] text-[#9FE870] font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dùng Ảnh Mẫu Công Tơ ({scanType === 'electric' ? '01684.5 kWh' : '0048.2 m³'})</span>
                </button>

                <label className="px-4 py-2 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 text-[#163300] dark:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải ảnh từ máy tính</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setOcrPreviewUrl(url);
                        executeScan(file, scanType);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Extracted Results Card */}
            {ocrResult && (
              <div className="p-4 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/30 border border-[#9FE870] space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                    <span className="font-bold text-[#163300] dark:text-white text-xs">
                      Kết Quả Nhận Diện OCR Độ Chính Xác Cao
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#163300] text-[#9FE870] font-mono font-bold text-[11px]">
                    Độ tin cậy: {ocrResult.confidenceScore.toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#9FE870]/40">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Chỉ Số Nhận Diện</span>
                    <span className="font-mono font-black text-xl text-[#163300] dark:text-[#9FE870]">
                      {scanType === 'electric' ? ocrResult.electricReadingKwh : ocrResult.waterReadingM3}
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        {scanType === 'electric' ? 'kWh' : 'm³'}
                      </span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#9FE870]/40">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Số Cũ Kỳ Trước</span>
                    <span className="font-mono font-bold text-lg text-slate-600 dark:text-slate-300">
                      {scanType === 'electric' ? ocrResult.previousElectricKwh : ocrResult.previousWaterM3}
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        {scanType === 'electric' ? 'kWh' : 'm³'}
                      </span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#9FE870]/40 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Tiêu Thụ Thực Tế</span>
                    <span className="font-mono font-black text-lg text-[#2570EB]">
                      {scanType === 'electric' ? ocrResult.consumedKwh : ocrResult.consumedM3}
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        {scanType === 'electric' ? 'kWh' : 'm³'}
                      </span>
                    </span>
                  </div>
                </div>

                {ocrResult.anomalyWarning && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{ocrResult.anomalyWarning}</span>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsMeterModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyOcrResult}
                disabled={!ocrResult}
                className="px-6 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-black text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Điền Vào Biên Bản</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
