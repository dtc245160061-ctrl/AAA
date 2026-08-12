import React from 'react';
import { Plus } from 'lucide-react';
import { MOCK_UNITS } from '../data/mockData';

interface BuildingsViewProps {
  selectedBuilding: string;
  onSelectUnit: (unitId: string) => void;
  onOpenQuickAction: () => void;
}

export const BuildingsView: React.FC<BuildingsViewProps> = ({
  selectedBuilding,
  onSelectUnit,
  onOpenQuickAction,
}) => {

  const totalUnits = MOCK_UNITS.length;
  const occupiedUnits = MOCK_UNITS.filter((u) => u.status === 'occupied').length;
  const vacantUnits = MOCK_UNITS.filter((u) => u.status === 'vacant').length;
  const maintenanceUnits = MOCK_UNITS.filter((u) => u.status === 'maintenance').length;
  const occupancyRate = ((occupiedUnits / totalUnits) * 100).toFixed(1);

  // Group units by floor
  const floors = [24, 20, 16, 12, 8];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900';
      case 'vacant':
        return 'bg-sky-950/80 border-sky-500/50 text-sky-300 hover:bg-sky-900';
      case 'maintenance':
        return 'bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900';
      case 'reserved':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            BUILDING PORTFOLIO ASSET / ELEVATION MAP
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            {selectedBuilding}
          </h1>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Unit to Building</span>
        </button>
      </div>

      {/* Hero Property Overview (Liquid Glass) */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/90 shadow-2xl p-8 flex flex-col justify-between min-h-[220px]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('/images/property-hero.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D12] via-[#0A0D12]/90 to-transparent" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 font-mono-tech">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400">Total Structure</span>
            <span className="text-2xl font-bold text-white block">24 Floors</span>
            <span className="text-xs text-emerald-400">Class A Luxury Residence</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400">Portfolio Occupancy</span>
            <span className="text-2xl font-bold text-white block">{occupancyRate}%</span>
            <span className="text-xs text-emerald-400">{occupiedUnits} / {totalUnits} Units Leased</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400">Monthly Rent Roll</span>
            <span className="text-2xl font-bold text-emerald-300 block">$148,500</span>
            <span className="text-xs text-slate-400">June 2026 Target Achieved</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400">Active Maintenance</span>
            <span className="text-2xl font-bold text-rose-400 block">{maintenanceUnits} Ticket</span>
            <span className="text-xs text-rose-300 font-mono-tech">Technician Assigned</span>
          </div>
        </div>
      </div>

      {/* Floor Elevation Matrix (Liquid Glass) */}
      <div className="liquid-glass p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-xl font-serif-editorial text-white">Floor Elevation Matrix & Unit Map</h3>
            <p className="text-xs font-mono-tech text-slate-400 mt-0.5">Click any suite block to inspect resident details & telemetry</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tech">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Occupied ({occupiedUnits})
            </span>
            <span className="flex items-center gap-1.5 text-sky-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Vacant ({vacantUnits})
            </span>
            <span className="flex items-center gap-1.5 text-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Maintenance ({maintenanceUnits})
            </span>
          </div>
        </div>

        {/* Vertical Floor Stack */}
        <div className="space-y-6">
          {floors.map((floorNum) => {
            const floorUnits = MOCK_UNITS.filter((u) => u.floor === floorNum);
            return (
              <div key={floorNum} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono-tech uppercase tracking-widest text-slate-400 font-bold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    Floor {floorNum} — {floorNum === 24 ? 'Penthouse Sky Suites' : floorNum === 20 ? 'Sky Villas' : floorNum === 16 ? 'Executive Suites' : 'Deluxe Residences'}
                  </span>
                  <div className="flex-1 h-px bg-slate-800/80" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {floorUnits.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => onSelectUnit(u.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer shadow-md ${getStatusColor(u.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-mono-tech font-bold">{u.id}</span>
                        <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded bg-slate-950/60">
                          {u.status}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1">
                        <span className="text-xs font-serif-editorial block">{u.type}</span>
                        <span className="text-[11px] font-mono-tech text-slate-300 block">
                          ${u.monthlyRentUSD.toLocaleString()}/mo • {u.sqm} sqm
                        </span>
                        {u.resident && (
                          <span className="text-[10px] font-mono-tech text-emerald-300 block truncate mt-1">
                            Resident: {u.resident.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
