import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wrench, 
  FileText, 
  Sparkles,
  Search,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  selectedBuilding: string;
  onOpenAiCopilot: () => void;
  onOpenQuickAction: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  selectedBuilding,
  onOpenAiCopilot,
  onOpenQuickAction,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'6M' | '1Y'>('6M');

  return (
    <div className="space-y-16 text-left relative z-10 pb-16">
      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 1: Portfolio Context & Editorial Hero       */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-6">
        {/* Soft Background Radial Light Orb */}
        <div className="ambient-glow-gold -top-24 left-0" />

        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-400 border border-white/10 px-2.5 py-1 rounded-full bg-white/[0.02]">
              PORTFOLIO OVERVIEW • 24 FLOORS
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono-tech text-emerald-400">93.8% Occupancy</span>
          </div>

          {/* Editorial Title with Italic Highlight */}
          <h1 className="text-4xl sm:text-5xl font-serif-editorial text-white leading-tight">
            Managing <em className="italic text-slate-300 font-serif">{selectedBuilding}</em> with clarity & operational velocity.
          </h1>

          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed font-sans">
            Real-time financial cashflow telemetry, active lease contract expirations, maintenance dispatch queue, and automated AI tenant notices.
          </p>

          {/* Interactive Search & Command Bar */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Query property data or type a command (e.g. 'Show overdue rent')..."
                onKeyDown={(e) => e.key === 'Enter' && onOpenAiCopilot()}
                className="w-full pl-11 pr-24 py-3 text-xs bg-white/[0.03] border border-white/[0.09] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-white/25 transition-all font-mono-tech"
              />
              <button
                onClick={onOpenAiCopilot}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[11px] font-mono-tech text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 2: Editorial Overview of Property State     */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="border-b border-white/[0.07] pb-3 flex justify-between items-end">
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400">
            01 / KEY OPERATIONAL TELEMETRY
          </span>
          <span className="text-xs font-mono-tech text-slate-500">Updated 2m ago</span>
        </div>

        {/* Spacious 3-Column Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 1: Monthly Revenue Velocity */}
          <div className="editorial-surface p-7 space-y-3">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 tracking-wider">
              JUNE RENT COLLECTION VELOCITY
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-serif-editorial text-white font-mono-tech">
                $148,500
              </span>
              <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.4%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              $148.5k collected of $160.9k total monthly rent roll target.
            </p>
          </div>

          {/* Item 2: Occupancy Rate */}
          <div className="editorial-surface p-7 space-y-3">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 tracking-wider">
              PORTFOLIO OCCUPANCY RATE
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-serif-editorial text-white font-mono-tech">
                93.8%
              </span>
              <span className="text-xs font-mono-tech text-slate-400">
                30 / 32 Units
              </span>
            </div>
            <p className="text-xs text-slate-400">
              2 Units vacant (`PH-2402`, `DL-1202`) available for lease.
            </p>
          </div>

          {/* Item 3: Outstanding Overdue Rent */}
          <div className="editorial-surface p-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech uppercase text-slate-400 tracking-wider">
                OUTSTANDING OVERDUE RENT
              </span>
              <button
                onClick={onOpenQuickAction}
                className="text-[10px] font-mono-tech text-rose-300 hover:underline"
              >
                + Record Payment
              </button>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-serif-editorial text-rose-400 font-mono-tech">
                $12,400
              </span>
              <span className="text-xs font-mono-tech text-rose-400">
                2 Accounts
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Unit `SV-2002` (12d late) & Unit `DL-0801` (5d late).
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 3 & 4: Embedded Revenue Visualization       */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="border-b border-white/[0.07] pb-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 block">
              02 / FINANCIAL TELEMETRY
            </span>
            <h3 className="text-xl font-serif-editorial text-white mt-1">
              Monthly Revenue Stream & Collection Performance
            </h3>
          </div>

          <div className="flex items-center bg-white/[0.03] p-1 rounded-lg border border-white/[0.07] text-xs font-mono-tech">
            <button
              onClick={() => setChartPeriod('6M')}
              className={`px-3 py-1 rounded transition-all ${
                chartPeriod === '6M' ? 'bg-white/10 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setChartPeriod('1Y')}
              className={`px-3 py-1 rounded transition-all ${
                chartPeriod === '1Y' ? 'bg-white/10 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              1 Year
            </button>
          </div>
        </div>

        {/* Embedded SVG Curve Chart inside Editorial Glass Container */}
        <div className="editorial-surface p-8 space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Light Orb behind chart */}
          <div className="ambient-glow-cyan -top-20 -right-20" />

          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

              {/* Area Path */}
              <path
                d="M 0,160 Q 70,130 140,110 T 280,75 T 420,45 L 500,30 L 500,190 L 0,190 Z"
                fill="url(#lineAreaGrad)"
              />

              {/* Delicate SVG Line */}
              <path
                d="M 0,160 Q 70,130 140,110 T 280,75 T 420,45 L 500,30"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
              />

              {/* Glowing Data Hover Points */}
              <circle cx="0" cy="160" r="4" fill="#E5E7EB" />
              <circle cx="140" cy="110" r="4" fill="#E5E7EB" />
              <circle cx="280" cy="75" r="4" fill="#E5E7EB" />
              <circle cx="420" cy="45" r="4" fill="#E5E7EB" />
              <circle cx="500" cy="30" r="6" fill="#FFFFFF" stroke="#0B0C0E" strokeWidth="2" />
            </svg>

            {/* X-Axis Monospaced Month Labels */}
            <div className="flex justify-between text-[11px] font-mono-tech text-slate-400 mt-4 border-t border-white/[0.05] pt-3">
              <span>Jan ($112k)</span>
              <span>Feb ($124k)</span>
              <span>Mar ($129k)</span>
              <span>Apr ($132k)</span>
              <span>May ($141k)</span>
              <span className="text-white font-semibold">Jun ($148.5k)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 5: Maintenance & Expiring Leases            */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="border-b border-white/[0.07] pb-3">
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400">
            03 / OPERATIONAL ACTION QUEUE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Orders Requiring Immediate Attention */}
          <div className="editorial-surface p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-400" />
                <h4 className="text-sm font-semibold text-white font-sans">
                  Active Maintenance Work Orders
                </h4>
              </div>
              <span className="text-xs font-mono-tech text-slate-400">3 Active</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'TKT-8092',
                  unit: 'SV-2002',
                  tenant: 'Marcus Sterling',
                  title: 'Smart lock battery below 45% & keycard latency',
                  priority: 'Urgent',
                  tech: 'Carlos Diaz',
                },
                {
                  id: 'TKT-8088',
                  unit: 'EX-1601',
                  tenant: 'Elena Rostova',
                  title: 'Annual HVAC climate filter replacement',
                  priority: 'Normal',
                  tech: 'Unassigned',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/15 transition-all flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono-tech font-semibold text-white">{item.unit}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">{item.tenant}</span>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono-tech uppercase rounded ${
                          item.priority === 'Urgent'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{item.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono-tech">Tech: {item.tech}</p>
                  </div>

                  <button className="px-3 py-1.5 text-[11px] font-mono-tech bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg transition-all flex-shrink-0 border border-white/10">
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring Lease Contracts */}
          <div className="editorial-surface p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <h4 className="text-sm font-semibold text-white font-sans">
                  Leases Expiring in 30–60 Days
                </h4>
              </div>
              <span className="text-xs font-mono-tech text-slate-400">2 Contracts</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  unit: 'SV-2001',
                  tenant: 'Sophia Chen',
                  rent: '$8,900/mo',
                  expires: '2026-07-31',
                  days: 48,
                },
                {
                  unit: 'DL-1201',
                  tenant: 'David Miller',
                  rent: '$3,900/mo',
                  expires: '2026-08-14',
                  days: 62,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/15 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono-tech font-semibold text-white">{item.unit}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">{item.tenant}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono-tech">
                      Rate: {item.rent} — Exp: {item.expires} ({item.days} days left)
                    </p>
                  </div>

                  <button
                    onClick={onOpenAiCopilot}
                    className="px-3 py-1.5 text-[11px] font-mono-tech bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg transition-all flex-shrink-0 border border-white/10 flex items-center gap-1"
                  >
                    <span>Draft Renewal</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 6: Recent Activity & AI Copilot Entry Point */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="border-b border-white/[0.07] pb-3">
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400">
            04 / LOGS & INTELLIGENCE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Log */}
          <div className="lg:col-span-2 editorial-surface p-7 space-y-4">
            <h4 className="text-sm font-semibold text-white font-sans">Recent Activity Stream</h4>
            <div className="space-y-3">
              {[
                { time: '14:22 UTC+7', log: 'Recorded $14,500 rent payment from Alexander Vance (PH-2401).' },
                { time: '11:05 UTC+7', log: 'Logged smart lock battery work order from Marcus Sterling (SV-2002).' },
                { time: 'Yesterday', log: 'Generated June 2026 rent invoices for all 30 active units.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-xs p-3 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                  <span className="font-mono-tech text-slate-500 text-[11px] w-24 flex-shrink-0">{item.time}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                  <p className="text-slate-300">{item.log}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Copilot Launch Entry Card */}
          <div className="editorial-surface p-7 space-y-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-transparent border-amber-500/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono-tech uppercase text-amber-400 font-semibold">AI ASSISTANT</span>
              </div>
              <h4 className="text-lg font-serif-editorial text-white">
                Query property data or draft tenant communications instantly.
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The embedded AI Copilot searches tenant contracts, financial invoices, and work order histories.
              </p>
            </div>

            <button
              onClick={onOpenAiCopilot}
              className="w-full mt-4 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Launch AI Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
