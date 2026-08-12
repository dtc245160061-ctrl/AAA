import React, { useState } from 'react';
import { 
  Download
} from 'lucide-react';

interface ReportsViewProps {
  onOpenQuickAction?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = () => {
  const [timeframe, setTimeframe] = useState<'6M' | '1Y'>('6M');

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            EXECUTIVE TELEMETRY / ANALYTICS & AUDIT WORKSPACE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            Analytics Reports & Insights
          </h1>
        </div>

        <button className="px-4 py-2.5 text-xs font-mono-tech text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Full Rent Roll PDF</span>
        </button>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">YTD REVENUE</span>
          <span className="text-3xl font-mono-tech font-semibold text-white block">$845,900</span>
          <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">+14.2% YoY</span>
        </div>

        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">AVG OCCUPANCY RATE</span>
          <span className="text-3xl font-mono-tech font-semibold text-sky-400 block">94.5%</span>
          <span className="text-xs font-mono-tech text-slate-400">Past 12 Months Average</span>
        </div>

        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">OPERATIONAL EXPENSES</span>
          <span className="text-3xl font-mono-tech font-semibold text-amber-400 block">$154,200</span>
          <span className="text-xs font-mono-tech text-slate-400">18.2% Expense-to-Revenue Ratio</span>
        </div>

        <div className="liquid-glass p-6 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase text-slate-400">NET OPERATIONAL INCOME</span>
          <span className="text-3xl font-mono-tech font-semibold text-emerald-300 block">$691,700</span>
          <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">+16.5% Efficiency</span>
        </div>
      </div>

      {/* Main Financial Analytics Chart */}
      <div className="liquid-glass p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-xl font-serif-editorial text-white">Monthly Cash Flow & Occupancy Growth</h3>
            <p className="text-xs font-mono-tech text-slate-400 mt-0.5">Historical revenue velocity & tenant collection rate</p>
          </div>

          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 text-xs font-mono-tech">
            <button
              onClick={() => setTimeframe('6M')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === '6M' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'}`}
            >
              6 Months
            </button>
            <button
              onClick={() => setTimeframe('1Y')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === '1Y' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'}`}
            >
              1 Year
            </button>
          </div>
        </div>

        <div className="h-72 w-full relative pt-4 font-mono-tech text-xs">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
            <defs>
              <linearGradient id="reportsRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />
            <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />

            <path d="M 0,160 Q 70,130 140,110 T 280,75 T 420,45 L 500,30 L 500,190 L 0,190 Z" fill="url(#reportsRevenueGrad)" />
            <path d="M 0,160 Q 70,130 140,110 T 280,75 T 420,45 L 500,30" fill="none" stroke="#34D399" strokeWidth="3" />

            <circle cx="0" cy="160" r="5" fill="#34D399" />
            <circle cx="140" cy="110" r="5" fill="#34D399" />
            <circle cx="280" cy="75" r="5" fill="#34D399" />
            <circle cx="420" cy="45" r="5" fill="#34D399" />
            <circle cx="500" cy="30" r="7" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" />
          </svg>

          <div className="flex justify-between text-slate-300 mt-6 border-t border-slate-800 pt-3">
            <span>Jan ($112k)</span>
            <span>Feb ($124k)</span>
            <span>Mar ($129k)</span>
            <span>Apr ($132k)</span>
            <span>May ($141k)</span>
            <span className="text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">Jun ($148.5k)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
