import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  MapPin, 
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  Maximize2,
  Bed,
  Layers
} from 'lucide-react';
import type { ApartmentUnit, UnitStatus } from '../types/apartment';
import { normalizeCity } from '../data/apartmentStore';

const ADMIN_CITIES = ['Tất Cả', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Thái Nguyên', 'Bắc Ninh', 'Hải Phòng', 'Bình Dương'] as const;

interface UnitsViewProps {
  units: ApartmentUnit[];
  onSelectUnit: (unitId: string) => void;
  onUpdateUnitStatus?: (unitId: string, status: UnitStatus) => void;
  onOpenQuickAction?: () => void;
  onEditUnit?: (unitId: string, updates: Partial<ApartmentUnit>) => void;
  onDeleteUnit?: (unitId: string) => void;
}

export const UnitsView: React.FC<UnitsViewProps> = ({
  units,
  onSelectUnit,
  onUpdateUnitStatus,
  onOpenQuickAction,
  onEditUnit,
  onDeleteUnit
}) => {
  const [editingUnit, setEditingUnit] = useState<ApartmentUnit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<ApartmentUnit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('Tất Cả');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUnits = units.filter(unit => {
    const matchesSearch = (unit.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          unit.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'Tất Cả' || normalizeCity(unit.city) === normalizeCity(cityFilter);
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  const vacantCount = units.filter(u => u.status === 'vacant').length;
  const occupiedCount = units.filter(u => u.status === 'occupied').length;
  const reservedCount = units.filter(u => u.status === 'reserved').length;

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'vacant':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold shadow-lg shadow-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sẵn Sàng Cho Thuê</span>
          </span>
        );
      case 'occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-sky-400 border border-sky-500/40 text-[10px] font-mono font-bold shadow-lg shadow-sky-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Đang Cho Thuê</span>
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold shadow-lg shadow-amber-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Đã Nhận Cọc</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-rose-400 border border-rose-500/40 text-[10px] font-mono font-bold shadow-lg shadow-rose-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Bảo Trì & Dọn Dẹp</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Radiating Luxury Aura */}
      <div className="relative rounded-3xl p-[2.5px] overflow-hidden shadow-2xl group">
        <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />
        <div className="p-6 sm:p-8 rounded-[22px] atmospheric-panel haven-sheen-sweep space-y-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>Kho Căn Hộ Cho Thuê (Inventory & Availability)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold">
                Danh Mục Căn Hộ & Tình Trạng
              </h1>
              <p className="text-sm text-slate-400">
                Quản lý toàn bộ {units.length} căn hộ trong hệ sinh thái HAVEN: Hà Nội, TP. Hồ Chí Minh & Đà Nẵng.
              </p>
            </div>

            {/* Quick Metrics & AI Listing Button */}
            <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
              <button
                onClick={onOpenQuickAction}
                className="haven-btn-beam px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 hover:scale-105 cursor-pointer"
              >
                <span className="text-sm">✨</span>
                <span>Đăng Tin Mới Bằng AI</span>
              </button>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {vacantCount} Trống
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {occupiedCount} Đang thuê
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {reservedCount} Đã cọc
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              {/* City Filter */}
              <div className="flex items-center gap-1 bg-slate-900/80 [data-theme='light']_:bg-slate-100 p-1 rounded-xl border border-slate-700 [data-theme='light']_:border-slate-300 text-xs font-mono overflow-x-auto max-w-full">
                {ADMIN_CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => setCityFilter(city)}
                    className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      cityFilter === city
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 [data-theme=\'light\']_:text-slate-600 [data-theme=\'light\']_:hover:text-slate-900'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="vacant">Sẵn sàng (Trống)</option>
                <option value="occupied">Đang cho thuê</option>
                <option value="reserved">Đã nhận cọc</option>
                <option value="maintenance">Đang bảo trì</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo mã phòng, tòa nhà, quận..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map(unit => (
          <div
            key={unit.id}
            className="group relative rounded-3xl p-[2px] overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_50px_rgba(16,185,129,0.2)] cursor-pointer"
          >
            <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" />
            <div className="relative z-10 w-full h-full rounded-[22px] atmospheric-panel haven-sheen-sweep border border-slate-800/80 [data-theme='light']_:border-slate-200/80 group-hover:border-emerald-500/50 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Top Row: Architectural Photo & Luxury Badges */}
                <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-900 group/img">
                  <img
                    src={unit.images[0]}
                    alt={unit.name || unit.id}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(unit.status)}
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-slate-300 font-bold shadow-md">
                      #{unit.id}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/50 text-xs font-mono font-bold text-emerald-400 shadow-xl shadow-emerald-500/20 flex items-baseline gap-1 group-hover:border-emerald-400 group-hover:scale-105 transition-all">
                    <span className="text-sm font-bold">{(unit.monthlyRentVND / 1000000).toFixed(0)}Tr</span>
                    <span className="text-[10px] text-slate-400 font-normal">/tháng</span>
                  </div>
                </div>

                {/* Title & Location */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-100 [data-theme='light']_:text-slate-900 group-hover:text-emerald-300 [data-theme='light']_:group-hover:text-emerald-700 group-hover:drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all line-clamp-1">
                    {unit.name || unit.id}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">{unit.district}, {normalizeCity(unit.city)}</span>
                  </div>
                </div>

                {/* Specs as 3 Luxury Frosted Glass Pills */}
                <div className="grid grid-cols-3 gap-2 py-1 font-mono text-xs">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 [data-theme='light']_:bg-slate-100/80 border border-slate-800/80 [data-theme='light']_:border-slate-200/80 group-hover:border-emerald-500/30 transition-colors">
                    <span className="text-slate-500 [data-theme='light']_:text-slate-400 text-[10px] flex items-center gap-1 mb-0.5">
                      <Maximize2 className="w-3 h-3 text-emerald-400/80" /> DIỆN TÍCH
                    </span>
                    <span className="text-slate-200 [data-theme='light']_:text-slate-800 font-bold">{unit.sqm} m²</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 [data-theme='light']_:bg-slate-100/80 border border-slate-800/80 [data-theme='light']_:border-slate-200/80 group-hover:border-emerald-500/30 transition-colors">
                    <span className="text-slate-500 [data-theme='light']_:text-slate-400 text-[10px] flex items-center gap-1 mb-0.5">
                      <Bed className="w-3 h-3 text-emerald-400/80" /> BỐ TRÍ
                    </span>
                    <span className="text-slate-200 [data-theme='light']_:text-slate-800 font-bold">{unit.bedrooms}PN • {unit.bathrooms}WC</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 [data-theme='light']_:bg-slate-100/80 border border-slate-800/80 [data-theme='light']_:border-slate-200/80 group-hover:border-emerald-500/30 transition-colors">
                    <span className="text-slate-500 [data-theme='light']_:text-slate-400 text-[10px] flex items-center gap-1 mb-0.5">
                      <Layers className="w-3 h-3 text-emerald-400/80" /> VỊ TRÍ
                    </span>
                    <span className="text-slate-200 [data-theme='light']_:text-slate-800 font-bold">Tầng {unit.floor}</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions Bar with Radiant Glass Buttons */}
              <div className="pt-3 flex items-center gap-2 border-t border-slate-800/80 [data-theme='light']_:border-slate-200/80">
                <select
                  value={unit.status}
                  onChange={(e) => onUpdateUnitStatus?.(unit.id, e.target.value as UnitStatus)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950/80 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-300 text-slate-200 [data-theme='light']_:text-slate-800 text-xs font-mono focus:outline-none focus:border-emerald-500 hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <option value="vacant">Trạng thái: Trống</option>
                  <option value="occupied">Trạng thái: Đang thuê</option>
                  <option value="reserved">Trạng thái: Đã cọc</option>
                  <option value="maintenance">Trạng thái: Bảo trì</option>
                </select>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingUnit({ ...unit });
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/80 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-300 hover:border-amber-400/70 hover:bg-amber-500/15 text-slate-300 [data-theme='light']_:text-slate-700 hover:text-amber-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.35)] transition-all cursor-pointer"
                  title="Sửa thông tin căn hộ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingUnit(unit);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/80 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-300 hover:border-rose-400/70 hover:bg-rose-500/15 text-slate-300 [data-theme='light']_:text-slate-700 hover:text-rose-300 hover:shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all cursor-pointer"
                  title="Xóa căn hộ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectUnit(unit.id)}
                  className="p-2.5 rounded-xl bg-slate-950/80 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-300 hover:border-emerald-400/70 hover:bg-emerald-500/15 text-slate-300 [data-theme='light']_:text-slate-700 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
                  title="Xem chi tiết căn"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Unit Modal */}
      {editingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="max-w-lg w-full rounded-3xl atmospheric-panel border border-amber-500/40 p-6 md:p-8 space-y-5 shadow-2xl backdrop-blur-2xl bg-slate-950/95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Chỉnh Sửa Thông Tin Căn Hộ</h3>
                  <p className="text-xs font-mono text-slate-400">{editingUnit.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUnit(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingUnit) {
                  onEditUnit?.(editingUnit.id, {
                    name: editingUnit.name,
                    monthlyRentVND: editingUnit.monthlyRentVND,
                    sqm: editingUnit.sqm,
                    bedrooms: editingUnit.bedrooms,
                    bathrooms: editingUnit.bathrooms,
                    floor: editingUnit.floor,
                    status: editingUnit.status
                  });
                  setEditingUnit(null);
                }
              }}
              className="space-y-4 text-xs font-mono"
            >
              <div>
                <label className="text-slate-400 block mb-1">Tên / Tiêu Đề Căn Hộ</label>
                <input
                  type="text"
                  required
                  value={editingUnit.name || ''}
                  onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Giá Thuê (VNĐ/tháng)</label>
                  <input
                    type="number"
                    required
                    value={editingUnit.monthlyRentVND || 0}
                    onChange={(e) => setEditingUnit({ ...editingUnit, monthlyRentVND: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Diện Tích (m²)</label>
                  <input
                    type="number"
                    required
                    value={editingUnit.sqm || 0}
                    onChange={(e) => setEditingUnit({ ...editingUnit, sqm: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Phòng Ngủ</label>
                  <input
                    type="number"
                    value={editingUnit.bedrooms || 1}
                    onChange={(e) => setEditingUnit({ ...editingUnit, bedrooms: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phòng Tắm</label>
                  <input
                    type="number"
                    value={editingUnit.bathrooms || 1}
                    onChange={(e) => setEditingUnit({ ...editingUnit, bathrooms: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tầng</label>
                  <input
                    type="number"
                    value={editingUnit.floor || 1}
                    onChange={(e) => setEditingUnit({ ...editingUnit, floor: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Trạng Thái Vận Hành</label>
                <select
                  value={editingUnit.status}
                  onChange={(e) => setEditingUnit({ ...editingUnit, status: e.target.value as UnitStatus })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="vacant">Sẵn Sàng Cho Thuê (Trống)</option>
                  <option value="occupied">Đang Cho Thuê</option>
                  <option value="reserved">Đã Nhận Cọc</option>
                  <option value="maintenance">Bảo Trì & Dọn Dẹp</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUnit(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Unit Confirmation Modal */}
      {deletingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="max-w-md w-full rounded-3xl atmospheric-panel border border-rose-500/40 p-6 space-y-4 shadow-2xl backdrop-blur-2xl bg-slate-950/95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Xác Nhận Xóa Căn Hộ</h3>
                <p className="text-xs font-mono text-slate-400">{deletingUnit.id}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Bạn có chắc chắn muốn xóa căn hộ <span className="text-white font-bold font-serif">"{deletingUnit.name || deletingUnit.id}"</span> khỏi hệ thống HAVEN? Thao tác này sẽ lưu trực tiếp vào cơ sở dữ liệu.
            </p>

            <div className="flex gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setDeletingUnit(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => {
                  if (deletingUnit) {
                    onDeleteUnit?.(deletingUnit.id);
                    setDeletingUnit(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác Nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
