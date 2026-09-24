import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Search, 
  MapPin, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Star, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  Box, 
  Sparkles,
  ArrowRight
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
  const [displayLimit, setDisplayLimit] = useState<number>(12);

  // Reset pagination when search or filters change to keep interactions snappy
  useEffect(() => {
    setDisplayLimit(12);
  }, [searchQuery, cityFilter, statusFilter]);

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

  const renderVerificationBadge = (level?: string) => {
    switch (level) {
      case 'full_ownership_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold backdrop-blur-md shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>✓✓ Sổ Đỏ & Ảnh Thật</span>
          </span>
        );
      case 'id_verified':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950/90 border border-sky-400 text-sky-300 text-[10px] font-mono font-bold backdrop-blur-md shadow-lg">
            <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
            <span>✓ Xác Minh CCCD</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Luxury Ambient Border */}
      <div className="relative rounded-3xl p-[1.5px] overflow-hidden shadow-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent group">
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
                Quản lý toàn bộ {units.length} không gian sống trong hệ sinh thái HAVEN: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng & Thái Nguyên.
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

      {/* Grid of Unit Cards Styled Exactly Like User Search View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.slice(0, displayLimit).map(unit => {
          const trueCostTotal = unit.trueCost?.totalMonthlyEstimatedVND || Math.round(unit.monthlyRentVND * 1.15);
          const extraFees = trueCostTotal - unit.monthlyRentVND;

          return (
            <div
              key={unit.id}
              className="group relative rounded-3xl p-[2.5px] shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 apartment-card"
            >
              {/* Dynamic Orbiting Dual Laser Beam */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-75 group-hover:opacity-100" />
              </div>

              {/* Inner Container: Translucent atmospheric-panel */}
              <div className="relative z-10 w-full h-full rounded-[22px] overflow-hidden flex flex-col justify-between atmospheric-panel border border-slate-800/80 [data-theme='light']_:border-slate-200">
                {/* Image Area - TALL & MAJESTIC (h-64 sm:h-72) */}
                <div
                  className="relative h-64 sm:h-72 bg-slate-900 cursor-pointer overflow-hidden rounded-t-[22.5px]"
                  onClick={() => onSelectUnit(unit.id)}
                >
                  <img
                    src={unit.images[0]?.replace('w=1200', 'w=600&q=75') || unit.images[0]}
                    alt={unit.name || unit.id}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=75&w=600';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Top Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                    <div className="flex flex-col gap-1.5 items-start pointer-events-auto">
                      {renderVerificationBadge(unit.verificationLevel)}
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold shadow-md">
                        99% Khớp AI
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-0.5 shadow-md">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{unit.landlord?.trustScore || 4.8}★</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700 text-slate-300 text-[11px] font-mono font-bold">
                        #{unit.id}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Info Bar Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white">
                    <span className="flex items-center gap-1.5 text-[11px] truncate max-w-[65%] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{unit.district}, {normalizeCity(unit.city)}</span>
                    </span>
                    
                    <div className="flex items-center gap-1.5 text-[10px] shrink-0">
                      {unit.pcccReport?.inspectionCertificateStatus === 'certified' && (
                        <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-0.5 font-semibold">
                          <Flame className="w-2.5 h-2.5 text-rose-400" /> PCCC ✓
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-white/20">
                        Tầng {unit.floor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                    <h3 className="font-serif text-lg font-bold text-slate-100 [data-theme='light']_:text-slate-900 group-hover:text-emerald-500 transition-colors line-clamp-1">
                      {unit.name || unit.id}
                    </h3>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-500">
                      <span>{unit.bedrooms} PN</span>
                      <span>•</span>
                      <span>{unit.bathrooms} WC</span>
                      <span>•</span>
                      <span>{unit.sqm} m²</span>
                    </div>
                  </div>

                  {/* AI Match Reasons Box */}
                  <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 [data-theme='light']_:text-emerald-600 uppercase tracking-wider font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>ĐIỂM KHỚP NHU CẦU:</span>
                    </span>
                    <ul className="space-y-1 text-slate-300 [data-theme='light']_:text-slate-700 font-sans text-xs">
                      <li className="flex items-center gap-1.5 leading-snug">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">Đã kiểm định an toàn PCCC & Pháp lý</span>
                      </li>
                      <li className="flex items-center gap-1.5 leading-snug">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{unit.hasCarParking ? 'Có chỗ đỗ ô tô hầm thông minh' : 'Tòa nhà văn minh, an ninh 24/7'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pricing & 3D / Chi Tiết Action Row */}
                  <div className="pt-3 border-t border-slate-800/80 [data-theme='light']_:border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-xl font-serif font-bold text-emerald-400 [data-theme='light']_:text-emerald-600">
                          {(trueCostTotal / 1000000).toFixed(1)} Tr
                        </span>
                        <span className="text-xs text-slate-400 [data-theme='light']_:text-slate-500 font-mono">/tháng</span>
                      </div>
                      
                      <div className="text-[10px] font-mono text-slate-500 [data-theme='light']_:text-slate-400 truncate mt-0.5">
                        Gốc: {(unit.monthlyRentVND / 1000000).toFixed(0)}Tr (+{(extraFees / 1000000).toFixed(1)}Tr phí)
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onSelectUnit(unit.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 [data-theme='light']_:bg-purple-50 hover:bg-purple-900 [data-theme='light']_:hover:bg-purple-100 border border-purple-500/40 [data-theme='light']_:border-purple-200 text-purple-300 [data-theme='light']_:text-purple-700 text-xs font-mono font-bold flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Xem phối cảnh 3D"
                      >
                        <Box className="w-3.5 h-3.5 text-purple-400 [data-theme='light']_:text-purple-600" />
                        <span>3D</span>
                      </button>
                      <button
                        onClick={() => onSelectUnit(unit.id)}
                        className="group/btn relative px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-400 hover:to-cyan-400 text-white font-mono text-xs font-bold transition-all duration-300 shadow-md shadow-emerald-500/25 hover:shadow-cyan-400/50 hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1.5 border border-cyan-400/40 hover:border-cyan-300 ring-1 ring-cyan-500/20 hover:ring-cyan-400/70 overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          Chi Tiết
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                        </span>
                        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                      </button>
                    </div>
                  </div>

                  {/* Admin Operations Bar (Elevated Glass Toolbar) */}
                  <div className="pt-2.5 border-t border-slate-800/80 [data-theme='light']_:border-slate-200 flex items-center gap-2">
                    {/* Status Selector with Live Colored Dot */}
                    <div className="flex-1 relative">
                      <select
                        value={unit.status}
                        onChange={(e) => onUpdateUnitStatus?.(unit.id, e.target.value as UnitStatus)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950/90 [data-theme='light']_:bg-white border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-200 [data-theme='light']_:text-slate-800 text-[11px] font-mono focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
                      >
                        <option value="vacant">Trống (Sẵn sàng)</option>
                        <option value="occupied">Đang cho thuê</option>
                        <option value="reserved">Đã nhận cọc</option>
                        <option value="maintenance">Đang bảo trì</option>
                      </select>
                      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${
                        unit.status === 'vacant' ? 'bg-emerald-400 animate-pulse' :
                        unit.status === 'occupied' ? 'bg-sky-400' :
                        unit.status === 'reserved' ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'
                      }`} />
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingUnit({ ...unit });
                      }}
                      className="p-2 rounded-xl bg-slate-950/80 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 hover:border-amber-400/70 hover:bg-amber-500/15 text-slate-300 [data-theme='light']_:text-slate-600 hover:text-amber-500 transition-all cursor-pointer shadow-xs"
                      title="Sửa thông tin căn hộ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingUnit(unit);
                      }}
                      className="p-2 rounded-xl bg-slate-950/80 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 hover:border-rose-400/70 hover:bg-rose-500/15 text-slate-300 [data-theme='light']_:text-slate-600 hover:text-rose-500 transition-all cursor-pointer shadow-xs"
                      title="Xóa căn hộ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Load More Button For Butter-Smooth Progressive Loading */}
        {displayLimit < filteredUnits.length && (
          <div className="col-span-full pt-6 flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => setDisplayLimit(prev => Math.min(prev + 12, filteredUnits.length))}
              className="haven-btn-beam px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-100 border border-emerald-500/40 text-xs font-mono font-bold shadow-xl transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Xem Thêm 12 Căn Hộ Tiếp Theo (Còn {filteredUnits.length - displayLimit} căn)</span>
            </button>
            <span className="text-xs font-mono text-slate-400 [data-theme='light']_:text-slate-600">
              Đang hiển thị {displayLimit} / {filteredUnits.length} căn hộ trong kho
            </span>
          </div>
        )}
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
