import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Plus
} from 'lucide-react';

interface PaymentsViewProps {
  onOpenQuickAction: () => void;
  onSelectUnit: (unitId: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  onOpenQuickAction,
  onSelectUnit,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample invoices ledger
  const invoices = [
    { id: 'INV-2026-0601', unitId: 'PH-2401', resident: 'Alexander Vance', period: 'June 2026', amount: 14500, status: 'paid', dueDate: '2026-06-01', paidDate: '2026-06-01', method: 'Bank Transfer' },
    { id: 'INV-2026-0602', unitId: 'SV-2001', resident: 'Sophia Chen', period: 'June 2026', amount: 8900, status: 'paid', dueDate: '2026-06-01', paidDate: '2026-06-01', method: 'Auto-Pay' },
    { id: 'INV-2026-0603', unitId: 'SV-2002', resident: 'Marcus Sterling', period: 'June 2026', amount: 8750, status: 'overdue', dueDate: '2026-06-01', paidDate: '-', method: 'Pending' },
    { id: 'INV-2026-0604', unitId: 'EX-1601', resident: 'Elena Rostova', period: 'June 2026', amount: 5600, status: 'paid', dueDate: '2026-06-01', paidDate: '2026-06-02', method: 'Credit Card' },
    { id: 'INV-2026-0605', unitId: 'DL-1201', resident: 'David & Hannah Miller', period: 'June 2026', amount: 3900, status: 'paid', dueDate: '2026-06-01', paidDate: '2026-06-01', method: 'Auto-Pay' },
    { id: 'INV-2026-0606', unitId: 'DL-0801', resident: 'Kenji Takahashi', period: 'June 2026', amount: 3650, status: 'overdue', dueDate: '2026-06-01', paidDate: '-', method: 'Pending' },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.unitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.resident.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            FINANCIAL TELEMETRY / RENT COLLECTION LEDGER
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            Rent Collections & Payments
          </h1>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Payment</span>
        </button>
      </div>

      {/* Financial Summary Strip (Liquid Glass) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">COLLECTED THIS MONTH</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-mono-tech font-semibold text-white">$148,500</span>
            <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">92.3% of total monthly target collected</p>
        </div>

        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">OUTSTANDING OVERDUE</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-mono-tech font-semibold text-rose-400">$12,400</span>
            <span className="text-xs font-mono-tech text-rose-400">2 Accounts</span>
          </div>
          <p className="text-xs text-slate-400 font-sans">Requires payment reminder dispatch</p>
        </div>

        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">AUTO-PAY ADOPTION</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-mono-tech font-semibold text-sky-400">86.6%</span>
            <span className="text-xs font-mono-tech text-sky-300">26 / 30 Units</span>
          </div>
          <p className="text-xs text-slate-400 font-sans">Direct bank escrow auto-debit enabled</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="liquid-glass p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice ID, unit, or tenant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 font-mono-tech"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/80 text-xs font-mono-tech">
          {['all', 'paid', 'overdue'].map((st) => (
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

      {/* Ledger Table (Liquid Glass) */}
      <div className="liquid-glass p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono-tech text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Invoice ID</th>
              <th className="py-3 px-4">Residence & Resident</th>
              <th className="py-3 px-4">Billing Period</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-4 px-4 font-bold text-white text-sm">{inv.id}</td>
                <td className="py-4 px-4">
                  <span className="text-white block font-semibold">{inv.resident}</span>
                  <button 
                    onClick={() => onSelectUnit(inv.unitId)}
                    className="text-emerald-400 hover:underline text-[11px]"
                  >
                    Unit {inv.unitId}
                  </button>
                </td>
                <td className="py-4 px-4 text-slate-300">{inv.period}</td>
                <td className="py-4 px-4 font-semibold text-white text-sm">
                  ${inv.amount.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-slate-400">{inv.method}</td>
                <td className="py-4 px-4">
                  {inv.status === 'paid' ? (
                    <span className="px-2.5 py-1 text-[10px] uppercase rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Paid
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] uppercase rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      Overdue
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  {inv.status === 'overdue' ? (
                    <button
                      onClick={onOpenQuickAction}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 transition-all text-[11px]"
                    >
                      Record Payment
                    </button>
                  ) : (
                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
