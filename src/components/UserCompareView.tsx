import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Check, 
  X, 
  Trash2, 
  ShieldCheck, 
  Flame, 
  Calculator, 
  Star, 
  Plus, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { compareApartments, type ComparisonResult } from '../services/aiAdvisorService';

interface UserCompareViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onRemoveFromSaved: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onBackToDirectory: () => void;
  onAddSampleUnitsToCompare?: (ids: string[]) => void;
}

export const UserCompareView: React.FC<UserCompareViewProps> = ({
  units,
  savedUnitIds,
  onRemoveFromSaved,
  onSelectUnit,
  onBackToDirectory,
  onAddSampleUnitsToCompare
}) => {
  const savedUnits = useMemo(() => {
    return units.filter(u => savedUnitIds.includes(u.id));
  }, [units, savedUnitIds]);

  const [aiComparison, setAiComparison] = useState<ComparisonResult | null>(null);

  const handleRunAiComparison = () => {
    const result = compareApartments(savedUnits);
    setAiComparison(result);
  };

  const handleLoadSampleUnits = () => {
    const sampleIds = units.slice(0, 3).map(u => u.id);
    if (onAddSampleUnitsToCompare) {
      onAddSampleUnitsToCompare(sampleIds);
    }
  };

  const getCityDisplayName = (city: string) => {
    switch (city) {
      case 'Hanoi': return 'Hà Nội';
      case 'Ho Chi Minh City': return 'TP. Hồ Chí Minh';
      case 'Da Nang': return 'Đà Nẵng';
      default: return city;
    }
  };

  // Helper to compute 5-dimension radar scores (10-100) for each unit
  const radarDimensions = ['Chi Phí Hợp Lý', 'An Toàn PCCC', 'Tiện Ích Xe', 'Vị Trí Trung Tâm', 'Không Gian Sống'];
  
  const getUnitRadarScores = (unit: ApartmentUnit): number[] => {
    const rentScore = Math.max(20, Math.min(100, Math.round(100 - ((unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND) / 10000000) * 15)));
    const safetyScore = (unit.floodingRisk === 'Low' ? 45 : 20) + (unit.pcccReport?.inspectionCertificateStatus === 'certified' ? 45 : 25);
    const amenityScore = (unit.hasCarParking ? 35 : 15) + (unit.hasBackupPower ? 35 : 15) + (unit.petFriendly ? 25 : 10);
    const locationScore = unit.city === 'Ho Chi Minh City' || unit.city === 'Hanoi' ? 85 : 75;
    const spaceScore = Math.min(100, Math.round((unit.sqm / 150) * 80 + (unit.floor > 10 ? 20 : 10)));

    return [rentScore, safetyScore, amenityScore, locationScore, spaceScore];
  };

  const colorPalette = [
    { stroke: '#163300', fill: 'rgba(159, 232, 112, 0.4)', label: 'Wise Forest & Lime' },
    { stroke: '#2570EB', fill: 'rgba(37, 112, 235, 0.3)', label: 'Wise Cobalt' },
    { stroke: '#FF5436', fill: 'rgba(255, 84, 54, 0.3)', label: 'Wise Coral' }
  ];

  // SVG Radar Polygon generator
  const renderRadarPolygon = (scores: number[], colorIndex: number) => {
    const center = 140;
    const radius = 100;
    const totalAxes = 5;

    const points = scores.map((score, idx) => {
      const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
      const dist = (score / 100) * radius;
      const x = center + dist * Math.cos(angle);
      const y = center + dist * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    const color = colorPalette[colorIndex % colorPalette.length];

    return (
      <polygon
        key={colorIndex}
        points={points}
        stroke={color.stroke}
        fill={color.fill}
        strokeWidth="2.5"
        className="transition-all duration-500"
      />
    );
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#163300] dark:text-[#9FE870] uppercase tracking-wider font-extrabold">
            <Layers className="w-4 h-4" />
            <span>So Sánh Đa Chiều (Radar Chart)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#163300] dark:text-white mt-1">
            Đặt Lên Bàn Cân: Chi Phí Thật, An Toàn & Không Gian
          </h1>
          <p className="text-[#495E35] dark:text-slate-400 text-sm mt-1 font-medium">
            Trực quan hóa biểu đồ Radar 5 chiều & phân tích quyết định từ AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedUnits.length < 2 && (
            <button
              onClick={handleLoadSampleUnits}
              className="px-4 py-2 rounded-full bg-[#E8F8EC] border border-[#9FE870]/30 text-[#163300] dark:text-[#9FE870] text-xs font-bold hover:bg-[#d5f3dc] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nạp 3 Căn Mẫu So Sánh</span>
            </button>
          )}

          <button
            onClick={onBackToDirectory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white text-xs font-black transition-all shadow-xs hover:border-[#163300] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Quay Lại Tìm Kiếm</span>
          </button>
        </div>
      </div>

      {savedUnits.length === 0 ? (
        <div className="p-12 text-center rounded-[32px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
          <Sparkles className="w-10 h-10 text-[#163300] dark:text-[#9FE870] mx-auto animate-pulse" />
          <h3 className="text-xl font-black text-[#163300] dark:text-white">Chưa Có Căn Hộ Nào Trong Mục So Sánh</h3>
          <p className="text-sm text-[#495E35] dark:text-slate-400 max-w-md mx-auto font-medium">
            Hãy bấm vào biểu tượng Bookmark (Lưu) ở bất kỳ căn hộ nào bạn thích hoặc bấm nạp 3 căn mẫu có sẵn bên dưới.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleLoadSampleUnits}
              className="px-6 py-3 rounded-full bg-[#9FE870] text-[#163300] font-black text-xs shadow-sm hover:bg-[#8ee05c] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Nạp 3 Căn Hộ Mẫu Để Trải Nghiệm Radar Chart
            </button>
            <button
              onClick={onBackToDirectory}
              className="px-5 py-3 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
            >
              Khám Phá Danh Sách
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Radar Chart & AI Decision Hub Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Radar Chart Visual (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-[#163300] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
                  <span>Biểu Đồ Radar Đa Chiều</span>
                </h3>
                <span className="text-xs font-bold text-[#738565] dark:text-slate-400">{savedUnits.length} Căn hộ</span>
              </div>

              {/* Radar SVG Visual */}
              <div className="relative flex items-center justify-center py-4">
                <svg width="280" height="280" viewBox="0 0 280 280" className="overflow-visible">
                  {/* Background concentric rings */}
                  {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                    <circle
                      key={i}
                      cx="140"
                      cy="140"
                      r={100 * scale}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeDasharray={scale === 1 ? 'none' : '3,3'}
                      strokeWidth="1"
                    />
                  ))}

                  {/* Axis lines */}
                  {[0, 1, 2, 3, 4].map(idx => {
                    const angle = (Math.PI * 2 / 5) * idx - Math.PI / 2;
                    const x = 140 + 100 * Math.cos(angle);
                    const y = 140 + 100 * Math.sin(angle);
                    return (
                      <line
                        key={idx}
                        x1="140"
                        y1="140"
                        x2={x}
                        y2={y}
                        stroke="#94a3b8"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Axis Labels */}
                  {radarDimensions.map((label, idx) => {
                    const angle = (Math.PI * 2 / 5) * idx - Math.PI / 2;
                    const x = 140 + 122 * Math.cos(angle);
                    const y = 140 + 122 * Math.sin(angle);
                    return (
                      <text
                        key={idx}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#475569"
                        fontSize="10"
                        fontFamily="'Plus Jakarta Sans', sans-serif"
                        fontWeight="700"
                      >
                        {label}
                      </text>
                    );
                  })}

                  {/* Polygons for each unit */}
                  {savedUnits.slice(0, 3).map((unit, idx) => {
                    const scores = getUnitRadarScores(unit);
                    return renderRadarPolygon(scores, idx);
                  })}
                </svg>
              </div>

              {/* Legend for Radar */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {savedUnits.slice(0, 3).map((unit, idx) => {
                  const color = colorPalette[idx % colorPalette.length];
                  return (
                    <div key={unit.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.stroke }} />
                        <span className="text-[#163300] dark:text-white truncate max-w-[170px] font-bold">
                          {unit.name || unit.id}
                        </span>
                      </div>
                      <span className="text-[#163300] dark:text-[#9FE870] font-black tabular-nums">
                        {((unit.trueCost?.totalMonthlyEstimatedVND || unit.monthlyRentVND) / 1000000).toFixed(1)} Tr/tháng
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Decision Analysis Box (7 cols) */}
            <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#163300] dark:text-[#9FE870] uppercase tracking-wider font-extrabold">
                    <Sparkles className="w-4 h-4" />
                    <span>Trí Tuệ Quyết Định HAVEN AI</span>
                  </div>
                  <button
                    onClick={handleRunAiComparison}
                    className="px-4 py-2 rounded-full bg-[#9FE870] hover:bg-[#8ee05c] text-[#163300] font-black text-xs transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Chạy Phân Tích So Sánh
                  </button>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-[#163300] dark:text-white">
                  Khuyến Nghị Lựa Chọn Tốt Nhất
                </h2>

                {aiComparison ? (
                  <div className="p-5 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/30 border border-[#9FE870]/30 dark:border-emerald-500/30 space-y-3 animate-in fade-in duration-300">
                    <h4 className="font-black text-lg text-[#163300] dark:text-[#9FE870]">{aiComparison.headline}</h4>
                    <p className="text-xs text-[#2D4A1D] dark:text-slate-200 font-medium leading-relaxed">{aiComparison.reasoning}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#9FE870]/20 text-xs">
                      {aiComparison.tradeOffs.map(item => (
                        <div key={item.unitId} className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-xs">
                          <span className="font-bold text-[#163300] dark:text-white truncate block">{item.unitName}</span>
                          <div className="space-y-1 text-[11px] font-medium">
                            {item.pros.slice(0, 2).map((p, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-[#163300] dark:text-[#9FE870]">
                                <Check className="w-3 h-3 shrink-0 stroke-[3]" />
                                <span>{p}</span>
                              </div>
                            ))}
                            {item.cons.slice(0, 1).map((c, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-[#FF5436]">
                                <X className="w-3 h-3 shrink-0 stroke-[3]" />
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-700 text-center space-y-2">
                    <p className="text-xs text-[#495E35] dark:text-slate-400 font-medium">
                      Bấm nút "Chạy Phân Tích So Sánh" để AI đối chiếu chi tiết ưu / nhược điểm của từng căn hộ theo ngân sách và nhu cầu sống an tâm.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/20 border border-[#9FE870]/30 text-xs font-semibold text-[#163300] dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#163300] dark:text-[#9FE870] shrink-0" />
                <span>Toàn bộ chi phí điện, nước, phí quản lý & gửi xe đã được chuẩn hóa so sánh chính xác.</span>
              </div>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-[28px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-[#F2F5F0] dark:bg-slate-800/60">
                  <th className="p-4 text-[#495E35] dark:text-slate-400 font-bold uppercase tracking-wider w-48">Tiêu Chí So Sánh</th>
                  {savedUnits.map(unit => (
                    <th key={unit.id} className="p-4 text-[#163300] dark:text-white font-black text-sm">
                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[200px]">{unit.name || unit.id}</span>
                        <button
                          onClick={() => onRemoveFromSaved(unit.id)}
                          className="text-slate-400 hover:text-[#FF5436] transition-colors p-1 cursor-pointer"
                          title="Xóa khỏi mục so sánh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[#495E35] dark:text-slate-300 font-medium">
                {/* 1. True Cost Row */}
                <tr className="bg-[#E8F8EC]/50 dark:bg-emerald-950/20 font-bold">
                  <td className="p-4 text-[#163300] dark:text-emerald-300 flex items-center gap-1.5 font-black">
                    <Calculator className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" /> Tổng Chi Phí Thật / Tháng
                  </td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4 text-[#163300] dark:text-[#9FE870] text-base font-black tabular-nums">
                      {((u.trueCost?.totalMonthlyEstimatedVND || u.monthlyRentVND) / 1000000).toFixed(1)} Triệu VNĐ
                      <span className="block text-[10px] text-[#738565] dark:text-slate-400 font-normal">Đã gồm điện nước & DV</span>
                    </td>
                  ))}
                </tr>

                {/* Monthly Rent Base */}
                <tr>
                  <td className="p-4 text-[#738565] dark:text-slate-400 font-semibold">Giá Thuê Gốc (Niêm yết)</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4 text-[#163300] dark:text-white font-bold tabular-nums">
                      {(u.monthlyRentVND / 1000000).toFixed(0)} Triệu VNĐ/tháng
                    </td>
                  ))}
                </tr>

                {/* Verification Level */}
                <tr>
                  <td className="p-4 text-[#738565] dark:text-slate-400 font-semibold">Cấp Độ Xác Minh</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.verificationLevel === 'full_ownership_verified' ? (
                        <span className="text-[#163300] dark:text-[#9FE870] flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-4 h-4" /> Cấp 3: Sổ đỏ & Ảnh thật
                        </span>
                      ) : (
                        <span className="text-sky-600 dark:text-sky-400 flex items-center gap-1 font-bold">
                          <Check className="w-4 h-4" /> Cấp 2: Đã xác minh CCCD
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* PCCC Inspection */}
                <tr>
                  <td className="p-4 text-[#738565] dark:text-slate-400 font-semibold">An Toàn PCCC</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.pcccReport?.inspectionCertificateStatus === 'certified' ? (
                        <span className="text-[#163300] dark:text-white font-bold flex items-center gap-1">
                          <Flame className="w-4 h-4 text-[#FF5436]" /> {u.pcccReport.fireEscapeCount} Thang thoát hiểm (Đạt chuẩn)
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-bold">Đang cập nhật hồ sơ</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Flooding Risk */}
                <tr>
                  <td className="p-4 text-[#738565] dark:text-slate-400 font-semibold">Rủi Ro Ngập Mùa Mưa</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      <span className={u.floodingRisk === 'Low' ? 'text-[#163300] dark:text-[#9FE870] font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
                        {u.floodingRisk === 'Low' ? 'Không ngập (Cao ráo)' : 'Trung bình (Đọng nước)'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Landlord Trust Score */}
                <tr>
                  <td className="p-4 text-[#738565] dark:text-slate-400 font-semibold">Điểm Uy Tín Chủ Nhà</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4 text-[#7A5200] dark:text-amber-300 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#FFC83B] text-[#FFC83B]" />
                      <span>{u.landlord?.trustScore || 4.8}★</span>
                      <span className="text-slate-400 text-[10px] font-normal">({u.landlord?.name})</span>
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr>
                  <td className="p-4 text-[#738565] dark:text-slate-400 font-semibold">Khu Vực & Địa Điểm</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4 text-[#163300] dark:text-slate-200">
                      {u.district}, {getCityDisplayName(u.city)}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms / Baths / Area */}
                <tr>
                  <td className="p-4 text-[#738565] dark:text-slate-400 font-semibold">Quy Mô Căn Hộ</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4 text-[#163300] dark:text-slate-200">
                      {u.bedrooms} PN • {u.bathrooms} WC • {u.sqm} m² (Tầng {u.floor})
                    </td>
                  ))}
                </tr>

                {/* Action CTA Row */}
                <tr>
                  <td className="p-4 text-[#738565] dark:text-slate-400 font-semibold">Hành Động</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      <button
                        onClick={() => onSelectUnit(u.id)}
                        className="px-4 py-2 rounded-full bg-[#163300] hover:bg-[#223D0D] text-white font-black text-xs transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Khám Phá Căn Hộ
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
