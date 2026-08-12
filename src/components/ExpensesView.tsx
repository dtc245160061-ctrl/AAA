import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus
} from 'lucide-react';

interface ExpensesViewProps {
  onOpenQuickAction: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  onOpenQuickAction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const expenses = [
    { id: 'EXP-8091', category: 'Utilities & HVAC', title: 'District Chilled Water & Central HVAC Electricity', vendor: 'City Energy Corp', date: '2026-06-10', amount: 14200, status: 'Approved' },
    { id: 'EXP-8090', category: 'Elevator Maintenance', title: 'Bi-monthly Otis High-Speed Elevator Inspection', vendor: 'Otis Elevator Co.', date: '2026-06-08', amount: 4800, status: 'Approved' },
    { id: 'EXP-8089', category: 'Landscaping & Botanical', title: 'Lush Tropical Sanctuary Grounds Maintenance', vendor: 'GreenFlora Retreats', date: '2026-06-05', amount: 3500, status: 'Approved' },
    { id: 'EXP-8088', category: 'Security & IoT Systems', title: 'Smart Lock Gateway Firmware License Renewal', vendor: 'SecureKey Systems', date: '2026-06-02', amount: 2100, status: 'Approved' },
    { id: 'EXP-8087', category: 'Janitorial & Cleaning', title: 'Executive Lobby Marble Polishing & Cleaning', vendor: 'Apex Cleaning Solutions', date: '2026-05-28', amount: 2900, status: 'Approved' },
  ];

  const categorySummary = [
    { category: 'Utilities & HVAC', amount: 14200, percent: 51 },
    { category: 'Elevator & Mechanical', amount: 4800, percent: 17 },
    { category: 'Landscaping & Botanical', amount: 3500, percent: 13 },
    { category: 'Security & IoT Access', amount: 2100, percent: 8 },
    { category: 'Janitorial & Operations', amount: 2900, percent: 11 },
  ];

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredExpenses = expenses.filter(
    (e) =>
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            FINANCIAL OPERATIONAL EXPENSES / ASSET LEDGER
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            Property Expenses & Budget
          </h1>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log New Expense</span>
        </button>
      </div>

      {/* Category Summary Cards (Liquid Glass) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">JUNE TOTAL OPERATIONAL EXPENSE</span>
          <span className="text-3xl font-mono-tech font-semibold text-white block">${totalExpense.toLocaleString()}</span>
          <p className="text-xs text-slate-400 font-sans">Within monthly operational budget limits</p>
        </div>

        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">NET OPERATIONAL MARGIN</span>
          <span className="text-3xl font-mono-tech font-semibold text-emerald-300 block">81.5%</span>
          <p className="text-xs text-emerald-400 font-mono-tech">Net Income: $121,000 / month</p>
        </div>

        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">VENDORS AUDITED</span>
          <span className="text-3xl font-mono-tech font-semibold text-sky-400 block">5 Active</span>
          <p className="text-xs text-slate-400 font-sans">All invoices verified & approved</p>
        </div>
      </div>

      {/* Category Breakdown (Liquid Glass) */}
      <div className="liquid-glass p-6 space-y-4">
        <h3 className="text-base font-semibold text-white font-serif-editorial">Category Budget Allocation Breakdown</h3>
        <div className="space-y-3">
          {categorySummary.map((cat, idx) => (
            <div key={idx} className="space-y-1.5 font-mono-tech text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>{cat.category}</span>
                <span className="text-white font-semibold">${cat.amount.toLocaleString()} ({cat.percent}%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full" style={{ width: `${cat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="liquid-glass p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expenses by ID, category, title, or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 font-mono-tech"
          />
        </div>
      </div>

      {/* Expense Transactions Table */}
      <div className="liquid-glass p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono-tech text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Expense ID</th>
              <th className="py-3 px-4">Category & Vendor</th>
              <th className="py-3 px-4">Expense Title</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-4 px-4 font-bold text-white">{exp.id}</td>
                <td className="py-4 px-4">
                  <span className="text-white block font-semibold">{exp.category}</span>
                  <span className="text-slate-400 text-[11px]">Vendor: {exp.vendor}</span>
                </td>
                <td className="py-4 px-4 text-slate-200 font-sans max-w-xs">{exp.title}</td>
                <td className="py-4 px-4 text-slate-300">{exp.date}</td>
                <td className="py-4 px-4 text-right font-semibold text-white text-sm">
                  ${exp.amount.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors ml-auto">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
