import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus
} from 'lucide-react';
import { MOCK_UNITS } from '../data/mockData';

interface TenantsViewProps {
  onSelectUnit: (unitId: string) => void;
  onOpenQuickAction: () => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  onSelectUnit,
  onOpenQuickAction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Extract residents from mock units
  const residents = MOCK_UNITS.filter((u) => u.resident).map((u) => ({
    ...u.resident!,
    unitId: u.id,
    unitType: u.type,
    floor: u.floor,
  }));

  const filteredResidents = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unitId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            RESIDENT DIRECTORY / VERIFIED LEASEHOLDERS
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            Tenants & Verified Residents
          </h1>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Resident</span>
        </button>
      </div>

      {/* Search Bar (Liquid Glass) */}
      <div className="liquid-glass p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by resident name, email, or assigned unit ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 font-mono-tech"
          />
        </div>
      </div>

      {/* Resident Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidents.map((r) => (
          <div
            key={r.id}
            className="product-ui-card p-6 space-y-5 flex flex-col justify-between group hover:border-emerald-500/50 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md" />
                  <div>
                    <h3 className="text-base font-serif-editorial text-white font-bold group-hover:text-emerald-300 transition-colors">
                      {r.name}
                    </h3>
                    <p className="text-[11px] font-mono-tech text-slate-400">
                      Primary Leaseholder
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-[10px] font-mono-tech text-emerald-300 bg-emerald-950/80 rounded-full border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified
                </span>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 text-xs font-mono-tech text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Phone:
                  </span>
                  <span className="text-white font-medium">{r.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    Email:
                  </span>
                  <span className="text-slate-200 truncate max-w-[180px]">{r.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    Lease Term:
                  </span>
                  <span className="text-slate-200">{r.moveInDate} → {r.leaseEnd}</span>
                </div>
              </div>
            </div>

            {/* Bottom Assigned Unit Link */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">ASSIGNED RESIDENCE</span>
                <span className="text-xs font-mono-tech font-bold text-emerald-300">
                  Unit {r.unitId} ({r.unitType})
                </span>
              </div>

              <button
                onClick={() => onSelectUnit(r.unitId)}
                className="px-3 py-1.5 text-xs font-mono-tech bg-slate-800 hover:bg-emerald-400 hover:text-slate-950 text-slate-200 rounded-lg transition-all flex items-center gap-1"
              >
                <span>Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
