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
import { SmartImage } from './common/SmartImage';

const ADMIN_CITIES = ['Tất Cả', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Thái Nguyên', 'Bắc Ninh', 'Hải Phòng', 'Bình Dương'] as const;

interface UnitsViewProps {
  units: ApartmentUnit[];
  onSelectUnit: (unitId: string) => void;
  onUpdateUnitStatus?: (unitId: string, status: UnitStatus) => void;
  onOpenQuickAction?: () => void;
  onOpenVirtualTour?: (unit: ApartmentUnit) => void;
  onEditUnit?: (unitId: string, updates: Partial<ApartmentUnit>) => void;
  onDeleteUnit?: (unitId: string) => void;
}

export const UnitsView: React.FC<UnitsViewProps> = ({
  units,
  onSelectUnit,
  onUpdateUnitStatus,
  onOpenQuickAction,
  onOpenVirtualTour,
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2570EB] text-white text-[10px] font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
            <span>✓✓ Sổ Đỏ & Ảnh Thật</span>
          </span>
        );
      case 'id_verified':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-bold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#163300] shrink-0" />
            <span>✓ Xác Minh CCCD</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner - Pure Wise Clean Surface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#163300]/70 dark:text-[#9FE870] uppercase tracking-wider">
              <Building className="w-4 h-4 text-[#2570EB]" />
              <span>Kho Căn Hộ Cho Thuê (Inventory & Availability)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-slate-100 tracking-tight">
              Danh Mục Căn Hộ & Tình Trạng
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quản lý toàn bộ {units.length} không gian sống trong hệ sinh thái HAVEN: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng & Thái Nguyên.
            </p>
          </div>

          {/* Quick Metrics & AI Listing Button */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <button
              onClick={onOpenQuickAction}
              className="px-5 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#163300]" />
              <span>Đăng Tin Mới Bằng AI</span>
            </button>
            <span className="px-3.5 py-1.5 rounded-full bg-[#9FE870]/20 text-[#163300] dark:text-[#9FE870] border border-[#9FE870]/30 font-bold">
              {vacantCount} Trống
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#2570EB]/10 text-[#2570EB] dark:text-sky-300 border border-[#2570EB]/20 font-bold">
              {occupiedCount} Đang thuê
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FFC83B]/20 text-[#7A5200] dark:text-[#FFC83B] border border-[#FFC83B]/30 font-bold">
              {reservedCount} Đã cọc
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* City Filter Wise Pill Container */}
            <div className="wise-pill-tabs overflow-x-auto max-w-full">
              {ADMIN_CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={cityFilter === city ? 'wise-pill-tab-active' : 'wise-pill-tab'}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#9FE870] cursor-pointer"
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
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã phòng, tòa nhà, quận..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[#163300] dark:text-slate-200 placeholder:text-slate-400 font-sans focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
            />
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
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg hover:border-[#163300]/40 dark:hover:border-[#9FE870]/40 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between"
            >
              <div className="flex flex-col justify-between h-full">
                {/* Image Area */}
                <div
                  className="relative h-64 sm:h-72 bg-slate-100 dark:bg-slate-950 cursor-pointer overflow-hidden"
                  onClick={() => onSelectUnit(unit.id)}
                >
                  <SmartImage
                    src={unit.images[0]}
                    alt={unit.name || unit.id}
                    width={600}
                    quality={75}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                    <div className="flex flex-col gap-1.5 items-start pointer-events-auto">
                      {renderVerificationBadge(unit.verificationLevel)}
                      <span className="px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-[10px] font-bold shadow-xs">
                        99% Khớp AI
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <span className="px-3 py-1 rounded-full bg-[#FFC83B] text-[#7A5200] text-[11px] font-bold flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-[#7A5200] text-[#7A5200]" />
                        <span>{unit.landlord?.trustScore || 4.8}★</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tabular-nums">
                        #{unit.id}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Info Bar Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1.5 text-[11px] truncate max-w-[65%] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#9FE870] shrink-0" />
                      <span className="truncate">{unit.district}, {normalizeCity(unit.city)}</span>
                    </span>
                    
                    <div className="flex items-center gap-1.5 text-[10px] shrink-0">
                      {unit.pcccReport?.inspectionCertificateStatus === 'certified' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF5436] text-white flex items-center gap-1 font-bold shadow-xs">
                          <Flame className="w-3 h-3 text-white" /> PCCC ✓
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                        Tầng {unit.floor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                    <h3 className="text-base font-bold text-[#163300] dark:text-slate-100 hover:text-[#2570EB] transition-colors line-clamp-1">
                      {unit.name || unit.id}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{unit.bedrooms} PN</span>
                      <span>•</span>
                      <span>{unit.bathrooms} WC</span>
                      <span>•</span>
                      <span>{unit.sqm} m²</span>
                    </div>
                  </div>

                  {/* AI Match Reasons Box */}
                  <div className="p-3.5 rounded-[16px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-[#163300]/70 dark:text-[#9FE870] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2570EB] shrink-0" />
                      <span>ĐIỂM KHỚP NHU CẦU:</span>
                    </span>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                      <li className="flex items-center gap-1.5 leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870] shrink-0" />
                        <span className="truncate">Đã kiểm định an toàn PCCC & Pháp lý</span>
                      </li>
                      <li className="flex items-center gap-1.5 leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870] shrink-0" />
                        <span className="truncate">{unit.hasCarParking ? 'Có chỗ đỗ ô tô hầm thông minh' : 'Tòa nhà văn minh, an ninh 24/7'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pricing & 3D / Chi Tiết Action Row */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-xl font-extrabold tabular-nums text-[#163300] dark:text-[#9FE870]">
                          {(trueCostTotal / 1000000).toFixed(1)} Tr
                        </span>
                        <span className="text-xs text-slate-400 font-normal">/tháng</span>
                      </div>
                      
                      <div className="text-[10px] text-slate-400 truncate mt-0.5 tabular-nums">
                        Gốc: {(unit.monthlyRentVND / 1000000).toFixed(0)}Tr (+{(extraFees / 1000000).toFixed(1)}Tr phí)
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onOpenVirtualTour ? onOpenVirtualTour(unit) : onSelectUnit(unit.id)}
                        className="px-3 py-1.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        title="Xem phối cảnh 3D thực địa"
                      >
                        <Box className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>3D</span>
                      </button>
                      <button
                        onClick={() => onSelectUnit(unit.id)}
                        className="px-4 py-2 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <span>Chi Tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Admin Operations Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    {/* Status Selector with Live Colored Dot */}
                    <div className="flex-1 relative">
                      <select
                        value={unit.status}
                        onChange={(e) => onUpdateUnitStatus?.(unit.id, e.target.value as UnitStatus)}
                        className="w-full pl-7 pr-3 py-1.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-slate-200 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#9FE870] cursor-pointer"
                      >
                        <option value="vacant">Trống (Sẵn sàng)</option>
                        <option value="occupied">Đang cho thuê</option>
                        <option value="reserved">Đã nhận cọc</option>
                        <option value="maintenance">Đang bảo trì</option>
                      </select>
                      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${
                        unit.status === 'vacant' ? 'bg-[#163300] dark:bg-[#9FE870]' :
                        unit.status === 'occupied' ? 'bg-[#2570EB]' :
                        unit.status === 'reserved' ? 'bg-[#FFC83B]' : 'bg-[#FF5436]'
                      }`} />
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingUnit({ ...unit });
                      }}
                      className="p-2 rounded-full bg-[#F2F5F0] hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-[#7A5200] dark:text-slate-300 transition-all cursor-pointer"
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
                      className="p-2 rounded-full bg-[#F2F5F0] hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-[#FF5436] dark:text-slate-300 transition-all cursor-pointer"
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

        {/* Load More Button - Wise Forest Pill */}
        {displayLimit < filteredUnits.length && (
          <div className="col-span-full pt-6 flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => setDisplayLimit(prev => Math.min(prev + 12, filteredUnits.length))}
              className="px-8 py-3.5 rounded-full bg-[#163300] hover:bg-[#204500] text-[#9FE870] font-bold text-xs shadow-sm transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#9FE870]" />
              <span>Xem Thêm 12 Căn Hộ Tiếp Theo (Còn {filteredUnits.length - displayLimit} căn)</span>
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Đang hiển thị {displayLimit} / {filteredUnits.length} căn hộ trong kho
            </span>
          </div>
        )}
      </div>

      {/* Edit Unit Modal */}
      {editingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="max-w-lg w-full rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-5 shadow-2xl text-slate-900 dark:text-slate-100 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#163300] dark:text-white leading-tight">Chỉnh Sửa Thông Tin Căn Hộ</h3>
                  <p className="text-xs text-slate-500 font-medium tabular-nums">{editingUnit.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUnit(null)}
                className="p-2 rounded-full text-slate-400 hover:text-[#163300] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
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
              className="space-y-4 text-xs font-medium"
            >
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Tên / Tiêu Đề Căn Hộ</label>
                <input
                  type="text"
                  required
                  value={editingUnit.name || ''}
                  onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Giá Thuê (VNĐ/tháng)</label>
                  <input
                    type="number"
                    required
                    value={editingUnit.monthlyRentVND || 0}
                    onChange={(e) => setEditingUnit({ ...editingUnit, monthlyRentVND: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Diện Tích (m²)</label>
                  <input
                    type="number"
                    required
                    value={editingUnit.sqm || 0}
                    onChange={(e) => setEditingUnit({ ...editingUnit, sqm: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Phòng Ngủ</label>
                  <input
                    type="number"
                    value={editingUnit.bedrooms || 1}
                    onChange={(e) => setEditingUnit({ ...editingUnit, bedrooms: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Phòng Tắm</label>
                  <input
                    type="number"
                    value={editingUnit.bathrooms || 1}
                    onChange={(e) => setEditingUnit({ ...editingUnit, bathrooms: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Tầng</label>
                  <input
                    type="number"
                    value={editingUnit.floor || 1}
                    onChange={(e) => setEditingUnit({ ...editingUnit, floor: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">Trạng Thái Vận Hành</label>
                <select
                  value={editingUnit.status}
                  onChange={(e) => setEditingUnit({ ...editingUnit, status: e.target.value as UnitStatus })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
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
                  className="flex-1 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] text-[#163300] font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200 text-left font-sans">
          <div className="max-w-md w-full rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-4 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-[#FF5436] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-[#FF5436]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#163300] dark:text-white leading-tight">Xác Nhận Xóa Căn Hộ</h3>
                <p className="text-xs text-slate-500 font-medium tabular-nums">{deletingUnit.id}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Bạn có chắc chắn muốn xóa căn hộ <span className="text-[#163300] dark:text-white font-black">"{deletingUnit.name || deletingUnit.id}"</span> khỏi hệ thống HAVEN? Thao tác này sẽ lưu trực tiếp vào cơ sở dữ liệu.
            </p>

            <div className="flex gap-3 pt-2 text-xs">
              <button
                onClick={() => setDeletingUnit(null)}
                className="flex-1 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
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
                className="flex-1 py-3 rounded-full bg-[#FF5436] hover:bg-[#e04529] text-white font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
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
