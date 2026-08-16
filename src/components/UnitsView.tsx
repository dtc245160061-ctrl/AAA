import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  MapPin, 
  Eye
} from 'lucide-react';
import type { ApartmentUnit, UnitStatus } from '../types/apartment';

interface UnitsViewProps {
  units: ApartmentUnit[];
  onSelectUnit: (unitId: string) => void;
  onUpdateUnitStatus?: (unitId: string, status: UnitStatus) => void;
  onOpenQuickAction?: () => void;
}

export const UnitsView: React.FC<UnitsViewProps> = ({
  units,
  onSelectUnit,
  onUpdateUnitStatus,
  onOpenQuickAction
}) => {
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
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium">Sẵn Sàng Cho Thuê</span>;
      case 'occupied':
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-medium">Đang Cho Thuê</span>;
      case 'reserved':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-medium">Đã Nhận Cọc</span>;
      case 'maintenance':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-medium">Bảo Trì & Dọn Dẹp</span>;
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
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
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
            className="group rounded-3xl atmospheric-panel border border-slate-800/80 hover:border-emerald-500/40 p-5 space-y-4 shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Top Row: Image & Status */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={unit.images[0]}
                  alt={unit.name || unit.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(unit.status)}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-mono font-bold text-emerald-400">
                  {(unit.monthlyRentVND / 1000000).toFixed(0)} Tr/tháng
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
    </div>
  );
};
