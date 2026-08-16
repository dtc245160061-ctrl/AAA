import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Check, X, Trash2 } from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { compareApartments, type ComparisonResult } from '../services/aiAdvisorService';

interface UserCompareViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onRemoveFromSaved: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onBackToDirectory: () => void;
}

export const UserCompareView: React.FC<UserCompareViewProps> = ({
  units,
  savedUnitIds,
  onRemoveFromSaved,
  onSelectUnit,
  onBackToDirectory
}) => {
  const savedUnits = units.filter(u => savedUnitIds.includes(u.id));
  const [aiComparison, setAiComparison] = useState<ComparisonResult | null>(null);

  const handleRunAiComparison = () => {
    const result = compareApartments(savedUnits);
    setAiComparison(result);
  };

  const getCityDisplayName = (city: string) => {
    switch (city) {
      case 'Hanoi': return 'Hà Nội';
      case 'Ho Chi Minh City': return 'TP. Hồ Chí Minh';
      case 'Da Nang': return 'Đà Nẵng';
      default: return city;
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-slate-100 tracking-tight">So Sánh Căn Hộ Đã Lưu</h1>
          <p className="text-slate-400 text-sm mt-1">Bảng ma trận đối chiếu chi tiết & đánh giá ưu nhược điểm từ AI.</p>
        </div>
        <button
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono transition-colors hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tìm Thêm Căn Hộ Khác</span>
        </button>
      </div>

      {savedUnits.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-slate-800 bg-slate-950/60 space-y-4 shadow-2xl">
          <Sparkles className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
          <h3 className="text-xl font-serif text-slate-200">Chưa Có Căn Hộ Nào Trong Mục So Sánh</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Hãy bấm vào biểu tượng Bookmark (Lưu) ở bất kỳ căn hộ nào bạn thích để thêm vào bàn cân so sánh tại đây.
          </p>
          <button
            onClick={onBackToDirectory}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-semibold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
          >
            Khám Phá Danh Sách Căn Hộ
          </button>
        </div>
      ) : (
        <>
          {/* AI Decision Helper Banner */}
          <div className="rounded-3xl liquid-glass-origin border border-emerald-500/30 p-6 md:p-8 space-y-4 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>Trí Tuệ Quyết Định HAVEN AI</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif text-slate-100">Căn hộ nào thực sự phù hợp nhất với bạn?</h2>
              </div>
              <button
                onClick={handleRunAiComparison}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-semibold text-xs transition-all shadow-lg shadow-emerald-500/25 shrink-0 hover:scale-105 active:scale-95"
              >
                Phân Tích So Sánh Bằng AI
              </button>
            </div>

            {aiComparison && (
              <div className="p-5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 space-y-3 animate-in fade-in duration-300">
                <h4 className="font-serif text-lg text-emerald-300">{aiComparison.headline}</h4>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">{aiComparison.reasoning}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-emerald-500/20">
                  {aiComparison.tradeOffs.map(item => (
                    <div key={item.unitId} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                      <span className="font-serif text-slate-100 font-semibold">{item.unitName}</span>
                      <div className="space-y-1.5 pt-1">
                        {item.pros.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-emerald-400">
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                        {item.cons.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-amber-400">
                            <X className="w-3.5 h-3.5 shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="p-4 text-slate-400 font-normal uppercase tracking-wider w-48">Tiêu Chí So Sánh</th>
                  {savedUnits.map(unit => (
                    <th key={unit.id} className="p-4 text-slate-100 font-serif text-sm">
                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[180px]">{unit.name || unit.id}</span>
                        <button
                          onClick={() => onRemoveFromSaved(unit.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Xóa khỏi mục so sánh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {/* Monthly Rent */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Giá Thuê Niêm Yết</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4 text-emerald-400 font-serif text-base font-semibold">
                      {(u.monthlyRentVND / 1000000).toFixed(0)} Triệu VNĐ
                      <span className="block text-[11px] font-mono text-slate-500 font-normal">/tháng</span>
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Khu Vực & Địa Điểm</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.district}, {getCityDisplayName(u.city)}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms / Baths */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Phòng Ngủ / WC</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.bedrooms} Phòng ngủ / {u.bathrooms} WC
                    </td>
                  ))}
                </tr>

                {/* Area & Floor */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Diện Tích & Tầng</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.sqm} m² (Tầng {u.floor})
                    </td>
                  ))}
                </tr>

                {/* Car Parking */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Chỗ Đỗ Ô Tô Hầm</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.hasCarParking ? (
                        <span className="text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> Có sẵn</span>
                      ) : (
                        <span className="text-slate-500">Chưa bao gồm</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Flooding Risk */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Rủi Ro Ngập Mùa Mưa</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      <span className={u.floodingRisk === 'Low' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                        {u.floodingRisk === 'Low' ? 'Không ngập (Cao ráo)' : 'Trung bình (Đọng nước)'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Backup Power */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Máy Phát Điện Dự Phòng</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.hasBackupPower ? (
                        <span className="text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> 100% Tự động</span>
                      ) : (
                        <span className="text-slate-500">Điện lưới tiêu chuẩn</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Action CTA Row */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Xem Chi Tiết Căn</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      <button
                        onClick={() => onSelectUnit(u.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-semibold transition-all shadow-md shadow-emerald-500/20"
                      >
                        Khám Phá Căn
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
