import React, { useState } from 'react';
import type { ApartmentUnit, UnitStatus } from '../types/apartment';
import { Building, Lock, Thermometer, Zap, ArrowUpRight, Wrench, Eye } from 'lucide-react';

interface BuildingTowerMapProps {
  units: ApartmentUnit[];
  onSelectUnit: (unit: ApartmentUnit) => void;
  searchQuery: string;
}

export const BuildingTowerMap: React.FC<BuildingTowerMapProps> = ({
  units,
  onSelectUnit,
  searchQuery,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFloorGroup, setSelectedFloorGroup] = useState<string>('all');

  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.resident && unit.resident.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      unit.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || unit.status === selectedStatus;

    let matchesFloor = true;
    if (selectedFloorGroup === 'penthouse') matchesFloor = unit.floor >= 22;
    if (selectedFloorGroup === 'skyvilla') matchesFloor = unit.floor >= 18 && unit.floor < 22;
    if (selectedFloorGroup === 'executive') matchesFloor = unit.floor >= 14 && unit.floor < 18;
    if (selectedFloorGroup === 'deluxe') matchesFloor = unit.floor < 14;

    return matchesSearch && matchesStatus && matchesFloor;
  });

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'occupied':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Có Cư Dân
          </span>
        );
      case 'vacant':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Phòng Trống
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full flex items-center gap-1.5">
            <Wrench className="w-3 h-3 text-rose-400 animate-bounce" />
            Bảo Trì IoT
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Đã Đặt Cọc
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Building Stats */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="space-y-1 text-left w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Sơ Đồ Mặt Bằng & Căn Hộ Tầng 8 - 24
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Hệ thống hiển thị trực quan Awwwards-style với cảm biến IoT thời gian thực.
          </p>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'occupied', label: 'Đang Thuê' },
              { id: 'vacant', label: 'Trống' },
              { id: 'maintenance', label: 'Bảo Trì' },
              { id: 'reserved', label: 'Đặt Cọc' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedStatus === st.id
                    ? 'bg-amber-500 text-black shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Floor Level Filter */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            {[
              { id: 'all', label: 'Tất Cả Tầng' },
              { id: 'penthouse', label: 'Penthouse (T22-24)' },
              { id: 'skyvilla', label: 'Sky Villa (T18-21)' },
              { id: 'executive', label: 'Executive (T14-17)' },
              { id: 'deluxe', label: 'Deluxe (T8-13)' },
            ].map((fl) => (
              <button
                key={fl.id}
                onClick={() => setSelectedFloorGroup(fl.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedFloorGroup === fl.id
                    ? 'bg-white/20 text-white font-bold border border-white/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Apartment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            onClick={() => onSelectUnit(unit)}
            className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer relative group overflow-hidden border border-white/10 flex flex-col justify-between"
          >
            {/* Top Accent Gradient Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                unit.status === 'occupied'
                  ? 'bg-emerald-500'
                  : unit.status === 'vacant'
                  ? 'bg-cyan-500'
                  : unit.status === 'maintenance'
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
            />

            {/* Card Content Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400/90 uppercase">
                    TẦNG {unit.floor} • {unit.type}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2 mt-0.5">
                    {unit.id}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                  </h3>
                </div>
                {getStatusBadge(unit.status)}
              </div>

              {/* View Type & Details */}
              <div className="text-xs text-slate-400 mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  View: <strong className="text-slate-200">{unit.viewType}</strong>
                </span>
                <span>
                  {unit.sqm} m² • {unit.bedrooms} Phòng Ngủ
                </span>
              </div>

              {/* Resident Info or Vacant Banner */}
              {unit.resident ? (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mb-4">
                  <img
                    src={unit.resident.avatar}
                    alt={unit.resident.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                  />
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-semibold text-white truncate">
                      {unit.resident.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Hạn HĐ: {unit.resident.leaseEnd}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/20 mb-4 text-center">
                  <p className="text-xs text-cyan-300 font-medium">
                    Đang chào thuê • Giá: ${unit.monthlyRentUSD.toLocaleString()}/tháng
                  </p>
                </div>
              )}
            </div>

            {/* IoT Sensor Bar Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Khoá Smart: {unit.sensors.smartLockBattery}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                <span>{unit.sensors.targetTempC}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{unit.sensors.energyConsumptionKwh} kWh</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
