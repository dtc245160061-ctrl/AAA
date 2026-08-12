import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wrench, 
  FileText, 
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Building,
  Trees,
  Compass
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
      {/* STORYLINE SECTION 1: Natural Editorial Hero & Property Identity*/}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-2">
        {/* Natural Background Ambient Glow Fields */}
        <div className="ambient-glow-sky -top-32 -left-20" />
        <div className="ambient-glow-forest top-10 right-0" />

        {/* Expansive Hero Canvas with Integrated Natural Landscape Photography */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/90 shadow-2xl min-h-[460px] lg:min-h-[500px] flex flex-col justify-between p-8 sm:p-12">
          {/* Integrated Natural Landscape Photograph */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-1000 ease-out hover:scale-[1.02]"
            style={{ backgroundImage: `url('/images/property-hero.png')` }}
          />

          {/* Calibrated Dark Gradient Mask for Crisp Typography Contrast */}
          <div className="absolute inset-0 hero-gradient-overlay sm:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/40 to-transparent" />

          {/* Top Status Bar overlaying natural landscape */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-200 font-medium">
                REAL-TIME TELEMETRY • BOTANICAL RESIDENCE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono-tech text-emerald-400 font-medium">93.8% Occupied</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/70 text-[11px] font-mono-tech text-slate-300">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRIVATE RESIDENTIAL ENCLAVE</span>
            </div>
          </div>

          {/* Center Editorial Headline & Narrative */}
          <div className="relative z-10 max-w-2xl space-y-5 my-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-editorial hero-title-text leading-[1.12]">
              Managing <em className="italic text-emerald-200 font-serif font-normal">{selectedBuilding}</em> with clarity & calm velocity.
            </h1>

            <p className="text-sm sm:text-base hero-subtext max-w-xl leading-relaxed font-sans font-light">
              Sophisticated property operations, real-time revenue telemetry, active lease contract management, and intelligent AI resident services.
            </p>

            {/* Context Property Telemetry Badges */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono-tech text-slate-200">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80">
                <Building className="w-3.5 h-3.5 text-sky-400" />
                <span>24 FLOORS</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80">
                <Trees className="w-3.5 h-3.5 text-emerald-400" />
                <span>32 RESIDENTIAL SUITES</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>CLASS A RETREAT</span>
              </div>
            </div>
          </div>

          {/* Bottom Command Bar integrated gracefully inside hero layout */}
          <div className="relative z-10 pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4.5 h-4.5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Query property data or type a command (e.g. 'Show overdue rent')..."
                onKeyDown={(e) => e.key === 'Enter' && onOpenAiCopilot()}
                className="w-full pl-11 pr-28 py-3.5 text-xs bg-slate-950/90 backdrop-blur-md border border-slate-700/90 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono-tech shadow-xl"
              />
              <button
                onClick={onOpenAiCopilot}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-2 text-xs font-mono-tech text-emerald-200 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/40 rounded-lg transition-all flex items-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 2: Open Editorial Telemetry Strip            */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium">
            01 / KEY OPERATIONAL TELEMETRY
          </span>
          <span className="text-xs font-mono-tech text-slate-400">Synchronized 2m ago</span>
        </div>

        {/* High-Readability Open Editorial Telemetry Band */}
        <div className="atmospheric-panel p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-slate-800">
            {/* Item 1: Monthly Revenue Velocity */}
            <div className="space-y-3 md:pr-8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-tech uppercase text-slate-300 font-medium tracking-wider">
                  JUNE RENT COLLECTION
                </span>
                <span className="text-xs font-mono-tech text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.4%
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-serif-editorial text-white font-mono-tech">
                  $148,500
                </span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '92.3%' }}></div>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  $148.5k collected of $160.9k total monthly target (92.3%).
                </p>
              </div>
            </div>

            {/* Item 2: Occupancy Rate */}
            <div className="space-y-3 md:px-8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-tech uppercase text-slate-300 font-medium tracking-wider">
                  PORTFOLIO OCCUPANCY
                </span>
                <span className="text-xs font-mono-tech text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                  30 / 32 Leased
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-serif-editorial text-white font-mono-tech">
                  93.8%
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">
                2 Units vacant (<code className="text-emerald-300 font-mono-tech">PH-2402</code> & <code className="text-emerald-300 font-mono-tech">DL-1202</code>) listed for immediate tenant onboarding.
              </p>
            </div>

            {/* Item 3: Outstanding Overdue Rent */}
            <div className="space-y-3 md:pl-8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-tech uppercase text-slate-300 font-medium tracking-wider">
                  OUTSTANDING OVERDUE
                </span>
                <button
                  onClick={onOpenQuickAction}
                  className="text-[11px] font-mono-tech text-rose-300 hover:text-rose-200 bg-rose-950/50 hover:bg-rose-900/60 px-2 py-0.5 rounded border border-rose-500/30 transition-all"
                >
                  + Record Payment
                </button>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-serif-editorial text-rose-400 font-mono-tech">
                  $12,400
                </span>
                <span className="text-xs font-mono-tech text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                  2 Accounts
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans pt-2">
                Unit <code className="text-rose-300 font-mono-tech">SV-2002</code> (12d late) & Unit <code className="text-rose-300 font-mono-tech">DL-0801</code> (5d late).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 3: Financial Telemetry Visualization        */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
              02 / FINANCIAL TELEMETRY
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-editorial text-white mt-1">
              Monthly Revenue Stream & Collection Growth
            </h3>
          </div>

          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 text-xs font-mono-tech">
            <button
              onClick={() => setChartPeriod('6M')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                chartPeriod === '6M' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setChartPeriod('1Y')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                chartPeriod === '1Y' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1 Year
            </button>
          </div>
        </div>

        {/* Embedded High-Contrast Chart Container */}
        <div className="atmospheric-panel p-8 space-y-6 relative overflow-hidden">
          <div className="h-72 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(148,163,184,0.1)" strokeDasharray="4 4" />

              {/* Area Path */}
              <path
                d="M 0,160 Q 70,130 140,110 T 280,75 T 420,45 L 500,30 L 500,190 L 0,190 Z"
                fill="url(#revenueGrad)"
              />

              {/* Vibrant Natural Stroke Line */}
              <path
                d="M 0,160 Q 70,130 140,110 T 280,75 T 420,45 L 500,30"
                fill="none"
                stroke="#34D399"
                strokeWidth="3"
              />

              {/* Glowing Data Nodes */}
              <circle cx="0" cy="160" r="5" fill="#34D399" />
              <circle cx="140" cy="110" r="5" fill="#34D399" />
              <circle cx="280" cy="75" r="5" fill="#34D399" />
              <circle cx="420" cy="45" r="5" fill="#34D399" />
              <circle cx="500" cy="30" r="7" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" />
            </svg>

            {/* Monospaced Month Axis Labels */}
            <div className="flex justify-between text-xs font-mono-tech text-slate-300 mt-6 border-t border-slate-800 pt-3">
              <span>Jan ($112k)</span>
              <span>Feb ($124k)</span>
              <span>Mar ($129k)</span>
              <span>Apr ($132k)</span>
              <span>May ($141k)</span>
              <span className="text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">Jun ($148.5k)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 4: Operational Action Queues                */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium">
            03 / OPERATIONAL ACTION QUEUE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Orders Panel */}
          <div className="atmospheric-panel p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white font-sans">
                    Active Maintenance Tickets
                  </h4>
                  <span className="text-[11px] font-mono-tech text-slate-400">Requiring technician dispatch</span>
                </div>
              </div>
              <span className="text-xs font-mono-tech text-slate-300 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">3 Active</span>
            </div>

            <div className="space-y-3 pt-2">
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
                  className="product-ui-card p-4 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono-tech font-semibold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{item.unit}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-200 font-medium">{item.tenant}</span>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono-tech uppercase rounded ${
                          item.priority === 'Urgent'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">{item.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono-tech">Tech: <span className="text-slate-200">{item.tech}</span></p>
                  </div>

                  <button className="px-3 py-1.5 text-xs font-mono-tech bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all flex-shrink-0 border border-slate-700 shadow-sm">
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring Lease Contracts Panel */}
          <div className="atmospheric-panel p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white font-sans">
                    Leases Expiring in 30–60 Days
                  </h4>
                  <span className="text-[11px] font-mono-tech text-slate-400 font-mono-tech">Renewal lifecycle management</span>
                </div>
              </div>
              <span className="text-xs font-mono-tech text-slate-300 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">2 Contracts</span>
            </div>

            <div className="space-y-3 pt-2">
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
                  className="product-ui-card p-4 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono-tech font-semibold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{item.unit}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-200 font-medium">{item.tenant}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono-tech">
                      Rate: <span className="text-emerald-400 font-semibold">{item.rent}</span> — Exp: {item.expires} ({item.days}d left)
                    </p>
                  </div>

                  <button
                    onClick={onOpenAiCopilot}
                    className="px-3 py-1.5 text-xs font-mono-tech bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 rounded-lg transition-all flex-shrink-0 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Draft Renewal</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STORYLINE SECTION 5: Intelligence & Activity Stream           */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium">
            04 / LOGS & INTELLIGENCE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Stream */}
          <div className="lg:col-span-2 atmospheric-panel p-7 space-y-4">
            <h4 className="text-base font-semibold text-white font-sans">Real-Time Operational Activity Stream</h4>
            <div className="space-y-3 pt-1">
              {[
                { time: '14:22 UTC+7', log: 'Recorded $14,500 rent payment from Alexander Vance (PH-2401).', tag: 'PAYMENT' },
                { time: '11:05 UTC+7', log: 'Logged smart lock battery work order from Marcus Sterling (SV-2002).', tag: 'MAINTENANCE' },
                { time: 'Yesterday', log: 'Generated June 2026 rent invoices for all 30 active units.', tag: 'INVOICING' },
              ].map((item, i) => (
                <div key={i} className="product-ui-card p-3.5 flex items-center gap-4 text-xs">
                  <span className="font-mono-tech text-slate-400 text-[11px] w-24 flex-shrink-0">{item.time}</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono-tech uppercase rounded bg-slate-800 text-emerald-300 border border-slate-700 flex-shrink-0">
                    {item.tag}
                  </span>
                  <p className="text-slate-200 font-sans">{item.log}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Copilot Launch Entry Card */}
          <div className="atmospheric-panel p-7 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono-tech uppercase text-emerald-300 font-semibold tracking-wider">AI COPILOT ASSISTANT</span>
              </div>
              <h4 className="text-xl font-serif-editorial text-white leading-snug">
                Query property data or draft tenant communications instantly.
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The embedded AI Property Copilot searches tenant contracts, financial ledgers, and maintenance logs in natural language.
              </p>
            </div>

            <button
              onClick={onOpenAiCopilot}
              className="w-full mt-6 py-3 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg font-mono-tech"
            >
              <span>Launch AI Copilot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

