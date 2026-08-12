import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus
} from 'lucide-react';
import { MOCK_UNITS } from '../data/mockData';

interface ContractsViewProps {
  onSelectUnit: (unitId: string) => void;
  onOpenAiCopilot: () => void;
  onOpenQuickAction: () => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  onSelectUnit,
  onOpenAiCopilot,
  onOpenQuickAction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const contracts = MOCK_UNITS.filter((u) => u.resident).map((u) => {
    const r = u.resident!;
    const leaseEnd = new Date(r.leaseEnd);
    const now = new Date();
    const daysLeft = Math.max(0, Math.floor((leaseEnd.getTime() - now.getTime()) / (1000 * 3600 * 24)));
    const status = daysLeft < 60 ? 'Expiring Soon' : 'Active';

    return {
      contractId: `CTR-${u.id}-2023`,
      unitId: u.id,
      unitType: u.type,
      residentName: r.name,
      monthlyRent: u.monthlyRentUSD,
      deposit: u.monthlyRentUSD * 2,
      startDate: r.moveInDate,
      endDate: r.leaseEnd,
      daysLeft,
      status,
      autoPay: r.autoPayActive,
    };
  });

  const filteredContracts = contracts.filter(
    (c) =>
      c.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.unitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contractId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            LEASE CONTRACT LIFECYCLE / REAL-TIME AGREEMENTS
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            Lease Contracts & Agreements
          </h1>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Contract</span>
        </button>
      </div>

      {/* Search Bar (Liquid Glass) */}
      <div className="liquid-glass p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contracts by ID (e.g. CTR-PH-2401), tenant, or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 font-mono-tech"
          />
        </div>
      </div>

      {/* Contracts Table (Liquid Glass) */}
      <div className="liquid-glass p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono-tech text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Contract ID</th>
              <th className="py-3 px-4">Residence & Tenant</th>
              <th className="py-3 px-4">Monthly Rate</th>
              <th className="py-3 px-4">Security Escrow</th>
              <th className="py-3 px-4">Term Expiration</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredContracts.map((c) => (
              <tr key={c.contractId} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-4 px-4 font-bold text-white text-sm">{c.contractId}</td>
                <td className="py-4 px-4">
                  <span className="text-white block font-semibold">{c.residentName}</span>
                  <span className="text-emerald-400 text-[11px]">Unit {c.unitId} ({c.unitType})</span>
                </td>
                <td className="py-4 px-4 font-semibold text-emerald-300">
                  ${c.monthlyRent.toLocaleString()}/mo
                </td>
                <td className="py-4 px-4 text-slate-300">
                  ${c.deposit.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-slate-300">
                  <span>{c.endDate}</span>
                  <span className="text-slate-500 block text-[10px]">{c.daysLeft} days remaining</span>
                </td>
                <td className="py-4 px-4">
                  {c.status === 'Expiring Soon' ? (
                    <span className="px-2.5 py-1 text-[10px] uppercase rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-fit">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Expiring Soon
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] uppercase rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Active
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {c.status === 'Expiring Soon' && (
                      <button
                        onClick={onOpenAiCopilot}
                        className="px-2.5 py-1 text-[11px] bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 rounded-lg hover:bg-emerald-900 transition-all flex items-center gap-1"
                      >
                        <span>Renew</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => onSelectUnit(c.unitId)}
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
                    >
                      Inspect Unit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
