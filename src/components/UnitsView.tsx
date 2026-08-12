import React, { useState } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  Maximize2, 
  Bed, 
  Bath, 
  Wrench, 
  Clock, 
  ChevronRight,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { MOCK_UNITS } from '../data/mockData';
import type { UnitStatus } from '../types/apartment';

interface UnitsViewProps {
  onSelectUnit: (unitId: string) => void;
  onOpenQuickAction: () => void;
}

export const UnitsView: React.FC<UnitsViewProps> = ({
  onSelectUnit,
  onOpenQuickAction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredUnits = MOCK_UNITS.filter((unit) => {
    const matchesSearch = 
      unit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.resident?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'occupied':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono-tech uppercase rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Occupied
          </span>
        );
      case 'vacant':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono-tech uppercase rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Vacant
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono-tech uppercase rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
            <Wrench className="w-3 h-3 text-rose-400" />
            Maintenance
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono-tech uppercase rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-400" />
            Reserved
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header & Section Title */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            PORTFOLIO DIRECTORY / 32 TOTAL SUITES
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            Apartments & Residential Units
          </h1>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Onboard New Unit</span>
        </button>
      </div>

      {/* Filter & View Switcher Bar (Liquid Glass) */}
      <div className="liquid-glass p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by unit ID (e.g. PH-2401), type, or resident name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 font-mono-tech"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/80 text-xs font-mono-tech">
            {['all', 'occupied', 'vacant', 'maintenance'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((u) => (
            <div
              key={u.id}
              onClick={() => onSelectUnit(u.id)}
              className="product-ui-card p-6 space-y-4 cursor-pointer group hover:border-emerald-500/50 transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono-tech font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {u.id}
                  </span>
                  <span className="text-xs font-mono-tech text-slate-400">Floor {u.floor}</span>
                </div>
                {getStatusBadge(u.status)}
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-serif-editorial text-white">{u.type} Sky Residence</h3>
                <p className="text-xs font-mono-tech text-slate-400">{u.viewType} View</p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-[11px] font-mono-tech text-slate-300">
                <div className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{u.sqm} sqm</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-sky-400" />
                  <span>{u.bedrooms} Bed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-teal-400" />
                  <span>{u.bathrooms} Bath</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">RENT RATE</span>
                  <span className="text-base font-mono-tech font-semibold text-emerald-300">
                    ${u.monthlyRentUSD.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/mo</span>
                  </span>
                </div>

                <button className="p-2 rounded-xl bg-slate-800 group-hover:bg-emerald-400 group-hover:text-slate-950 text-slate-300 transition-all flex items-center gap-1 text-xs font-mono-tech">
                  <span>Inspect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {u.resident && (
                <div className="text-[11px] font-mono-tech text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>Resident: <span className="text-slate-200 font-medium">{u.resident.name}</span></span>
                  <span className="text-emerald-400">Lease Active</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Table Mode */
        <div className="liquid-glass p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono-tech text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Unit ID</th>
                <th className="py-3 px-4">Floor & Type</th>
                <th className="py-3 px-4">Sqm / Specs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4 text-right">Monthly Rent</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUnits.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-white text-sm">{u.id}</td>
                  <td className="py-4 px-4">
                    <span className="text-white block font-medium">{u.type}</span>
                    <span className="text-slate-400 text-[11px]">Floor {u.floor} • {u.viewType}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {u.sqm} sqm • {u.bedrooms}B / {u.bathrooms}B
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(u.status)}</td>
                  <td className="py-4 px-4 text-slate-200">
                    {u.resident ? u.resident.name : <span className="text-slate-500 italic">Unassigned</span>}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-emerald-300">
                    ${u.monthlyRentUSD.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onSelectUnit(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-400 hover:text-slate-950 text-slate-200 transition-all flex items-center gap-1 ml-auto"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
