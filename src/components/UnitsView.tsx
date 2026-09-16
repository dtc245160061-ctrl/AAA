import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  MapPin, 
  Eye,
  Edit2,
  Trash2,
  X,
  Check
} from 'lucide-react';
import type { ApartmentUnit, UnitStatus } from '../types/apartment';

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
  const [cityFilter, setCityFilter] = useState<'All' | 'Hanoi' | 'Ho Chi Minh City' | 'Da Nang'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUnits = units.filter(unit => {
    const matchesSearch = (unit.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          unit.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'All' || unit.city === cityFilter;
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  const vacantCount = units.filter(u => u.status === 'vacant').length;
  const occupiedCount = units.filter(u => u.status === 'occupied').length;
  const reservedCount = units.filter(u => u.status === 'reserved').length;

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'vacant':
        return <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold shadow-md">Sẵn Sàng Cho Thuê</span>;
      case 'occupied':
        return <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-sky-400 border border-sky-500/40 text-[10px] font-mono font-bold shadow-md">Đang Cho Thuê</span>;
      case 'reserved':
        return <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold shadow-md">Đã Nhận Cọc</span>;
      case 'maintenance':
        return <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-rose-400 border border-rose-500/40 text-[10px] font-mono font-bold shadow-md">Bảo Trì & Dọn Dẹp</span>;
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-6 shadow-2xl backdrop-blur-2xl">
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
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 hover:scale-105"
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
            {(['All', 'Hanoi', 'Ho Chi Minh City', 'Da Nang'] as const).map(city => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  cityFilter === city
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {city === 'All' ? 'Tất cả Thành phố' : city === 'Hanoi' ? 'Hà Nội' : city === 'Ho Chi Minh City' ? 'TP. HCM' : 'Đà Nẵng'}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

            {/* Status Filter */}
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'vacant', label: 'Trống' },
              { id: 'occupied', label: 'Đang thuê' },
              { id: 'reserved', label: 'Đã cọc' },
              { id: 'maintenance', label: 'Bảo trì' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  statusFilter === tab.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã phòng, tòa nhà, quận..."
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map(unit => (
          <div
            key={unit.id}
            className="group haven-card-interactive rounded-3xl atmospheric-panel border border-slate-800/80 hover:border-emerald-400/80 hover:shadow-2xl hover:shadow-emerald-500/15 p-5 space-y-4 shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              {/* Top Row: Image & Status */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={unit.images[0]}
                  alt={unit.name || unit.id}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
                  }}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(unit.status)}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700 text-xs font-mono font-bold text-emerald-400">
                  {(unit.monthlyRentVND / 1000000).toFixed(0)}Tr/tháng
                </div>
              </div>

              {/* Title & Location */}
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {unit.name || unit.id}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{unit.district}, {unit.city === 'Hanoi' ? 'Hà Nội' : unit.city === 'Ho Chi Minh City' ? 'TP. Hồ Chí Minh' : 'Đà Nẵng'}</span>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/60 text-center font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">DIỆN TÍCH</span>
                  <span className="text-slate-200 font-medium">{unit.sqm} m²</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">PHÒNG NGỦ</span>
                  <span className="text-slate-200 font-medium">{unit.bedrooms} PN • {unit.bathrooms} WC</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">TẦNG</span>
                  <span className="text-slate-200 font-medium">Tầng {unit.floor}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-800/80">
              <select
                value={unit.status}
                onChange={(e) => onUpdateUnitStatus?.(unit.id, e.target.value as UnitStatus)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-amber-400 transition-colors"
                title="Sửa thông tin căn hộ"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingUnit(unit);
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-400 text-slate-300 hover:text-rose-400 transition-colors"
                title="Xóa căn hộ"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectUnit(unit.id)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white transition-colors"
                title="Xem chi tiết căn"
              >
                <Eye className="w-4 h-4" />
              </button>
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
