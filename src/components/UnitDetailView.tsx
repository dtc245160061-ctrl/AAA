import React, { useState } from 'react';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Download, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Droplets, 
  Zap, 
  Thermometer, 
  Lock,
  UserCheck
} from 'lucide-react';
import { MOCK_UNITS, MOCK_TICKETS } from '../data/mockData';
import type { ApartmentUnit } from '../types/apartment';

interface UnitDetailViewProps {
  unitId?: string;
  onOpenAiCopilot: () => void;
  onOpenQuickAction: () => void;
  onBackToDirectory?: () => void;
}

export const UnitDetailView: React.FC<UnitDetailViewProps> = ({
  unitId = 'PH-2401',
  onOpenAiCopilot,
  onOpenQuickAction,
  onBackToDirectory,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(unitId);
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'financials' | 'maintenance' | 'documents'>('overview');

  const unit: ApartmentUnit = MOCK_UNITS.find(u => u.id === selectedUnitId) || MOCK_UNITS[0];
  const unitTickets = MOCK_TICKETS.filter(t => t.unitId === unit.id);

  // Calculate lease term days
  const leaseDaysRemaining = Math.max(0, Math.floor((new Date(unit.resident?.leaseEnd || '2027-01-14').getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="space-y-12 text-left relative z-10 pb-16">
      {/* ------------------------------------------------------------- */}
      {/* BREADCRUMB & QUICK UNIT SWITCHER BAR                          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
          {onBackToDirectory && (
            <button 
              onClick={onBackToDirectory}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>APARTMENTS</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>
          )}
          <span>GRAND TOWER RESIDENCE</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span>FLOOR {unit.floor}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-white font-semibold">{unit.id}</span>
        </div>

        {/* Quick Unit Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-tech text-slate-400">Inspect Residence:</span>
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono-tech bg-slate-900/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500/60"
          >
            {MOCK_UNITS.map(u => (
              <option key={u.id} value={u.id}>
                {u.id} ({u.type} — Floor {u.floor})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: CINEMATIC RESIDENTIAL HERO & RESIDENCE IDENTITY    */}
      {/* ------------------------------------------------------------- */}
      <section className="relative">
        <div className="ambient-glow-sky -top-32 -left-20" />
        <div className="ambient-glow-forest top-10 right-0" />

        {/* Expansive Liquid Glass Hero Frame */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 bg-slate-950/90 shadow-2xl min-h-[440px] flex flex-col justify-between p-8 sm:p-12">
          {/* Integrated Natural Property Image Backdrop */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-1000 ease-out hover:scale-[1.01]"
            style={{ backgroundImage: `url('/images/property-hero.png')` }}
          />

          {/* Dual Dark Gradient Mask for Crisp Typography Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D12] via-[#0A0D12]/80 to-transparent sm:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/40 to-transparent" />

          {/* Top Floating Telemetry & Status Tags */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-200 font-medium">
                RESIDENCE STATUS • {unit.status.toUpperCase()}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono-tech text-emerald-400 font-medium">{unit.viewType}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono-tech text-slate-200">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>FLOOR {unit.floor} • SUITE {unit.unitNumber}</span>
            </div>
          </div>

          {/* Center Identity & Editorial Display Title */}
          <div className="relative z-10 max-w-2xl space-y-4 my-6">
            <div className="flex items-center gap-3 text-xs font-mono-tech text-emerald-300 uppercase tracking-widest">
              <span>{unit.id}</span>
              <span>•</span>
              <span>GRAND TOWER RESIDENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-editorial text-white leading-[1.12]">
              {unit.id} — <em className="italic text-emerald-200 font-serif font-normal">{unit.type} Sky Residence</em>
            </h1>

            {/* Core Residence Specs Bar */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono-tech text-slate-200">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{unit.sqm} SQM</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80">
                <Bed className="w-3.5 h-3.5 text-sky-400" />
                <span>{unit.bedrooms} BEDROOMS</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80">
                <Bath className="w-3.5 h-3.5 text-teal-400" />
                <span>{unit.bathrooms} BATHS</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CLASS A SANCTUARY</span>
              </div>
            </div>
          </div>

          {/* Bottom Floating Operational Bar (Liquid Glass Panel) */}
          <div className="relative z-10 liquid-glass p-5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 tracking-wider block">
                  MONTHLY LEASE RATE
                </span>
                <span className="text-2xl sm:text-3xl font-serif-editorial text-white font-mono-tech">
                  ${unit.monthlyRentUSD.toLocaleString()}
                  <span className="text-xs text-slate-400 font-sans font-normal"> / mo</span>
                </span>
              </div>

              <div className="hidden sm:block w-px h-10 bg-slate-700/60" />

              <div className="hidden sm:block">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 tracking-wider block">
                  PAYMENT TELEMETRY
                </span>
                <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-Pay Active • Account Up to Date
                </span>
              </div>
            </div>

            {/* Operational CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenQuickAction}
                className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>+ Record Payment</span>
              </button>
              <button
                onClick={onOpenAiCopilot}
                className="px-4 py-2.5 text-xs font-mono-tech text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-xl transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Draft Resident Notice</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: LIQUID GLASS NAVIGATION TABS                      */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 text-xs font-mono-tech">
          {[
            { id: 'overview', label: '01 / Resident Spotlight & Lease' },
            { id: 'telemetry', label: '02 / Climate & IoT Telemetry' },
            { id: 'financials', label: '03 / Payment Ledger & History' },
            { id: 'maintenance', label: '04 / Work Orders & Dispatch' },
            { id: 'documents', label: '05 / Lease Agreements & PDFs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'liquid-glass text-white font-semibold border-emerald-500/40 text-emerald-300 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: RESIDENT SPOTLIGHT & LEASE CONTRACT */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Resident Profile Card */}
            <div className="lg:col-span-7 liquid-glass p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-700/80 shadow-md">
                    {unit.resident?.avatar ? (
                      <img src={unit.resident.avatar} alt={unit.resident.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <UserCheck className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif-editorial text-white">
                      {unit.resident ? unit.resident.name : 'Vacant Unit — Unassigned'}
                    </h3>
                    <p className="text-xs font-mono-tech text-slate-400">
                      Primary Resident & Verified Leaseholder
                    </p>
                  </div>
                </div>

                {unit.resident && (
                  <span className="px-3 py-1 text-[10px] font-mono-tech uppercase text-emerald-300 bg-emerald-950/80 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified ID
                  </span>
                )}
              </div>

              {unit.resident ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono-tech text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block">Direct Contact Phone</span>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{unit.resident.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block">Email Address</span>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Mail className="w-3.5 h-3.5 text-sky-400" />
                        <span>{unit.resident.email}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block">Move-In Commencement</span>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{unit.resident.moveInDate}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block">Lease Expiration</span>
                      <div className="flex items-center gap-2 text-emerald-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{unit.resident.leaseEnd} ({leaseDaysRemaining}d remaining)</span>
                      </div>
                    </div>
                  </div>

                  {/* Lease Countdown Bar */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-mono-tech">
                      <span className="text-slate-400">Lease Lifecycle Progress</span>
                      <span className="text-emerald-400 font-semibold">{leaseDaysRemaining} Days Remaining</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <p className="text-sm text-slate-400">This penthouse unit is currently vacant and available for lease.</p>
                  <button onClick={onOpenQuickAction} className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all font-mono-tech">
                    + Onboard New Resident
                  </button>
                </div>
              )}
            </div>

            {/* Right Column (5 cols): Lease Terms & Deposit Escrow */}
            <div className="lg:col-span-5 space-y-6">
              <div className="liquid-glass p-7 space-y-5">
                <h4 className="text-base font-semibold text-white font-sans flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Lease Terms & Security Escrow</span>
                </h4>

                <div className="space-y-3 text-xs font-mono-tech text-slate-300">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Security Deposit</span>
                    <span className="text-white font-semibold">${(unit.monthlyRentUSD * 2).toLocaleString()} (Escrowed)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Payment Auto-Debit</span>
                    <span className="text-emerald-400 font-semibold">Enabled (1st of month)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Registered Occupants</span>
                    <span className="text-white font-semibold">{unit.resident?.occupantsCount || 0} Residents</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">On-Time Reliability</span>
                    <span className="text-emerald-400 font-semibold">100% (36 Months Track Record)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenAiCopilot}
                    className="w-full py-2.5 text-xs font-mono-tech text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Lease Renewal Assistant</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIMATE & IOT TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="liquid-glass p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400">SMART LOCK BATTERY</span>
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-3xl font-mono-tech font-semibold text-white">{unit.sensors.smartLockBattery}%</span>
              <p className="text-xs text-emerald-400 font-mono-tech">Secured • Door Latch Engaged</p>
            </div>

            <div className="liquid-glass p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400">HVAC CLIMATE CONTROL</span>
                <Thermometer className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-3xl font-mono-tech font-semibold text-white">{unit.sensors.targetTempC}°C</span>
              <p className="text-xs text-slate-300 font-mono-tech">Status: <span className="text-sky-300">{unit.sensors.hvacStatus}</span></p>
            </div>

            <div className="liquid-glass p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400">DAILY ENERGY CONSUMPTION</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-3xl font-mono-tech font-semibold text-white">{unit.sensors.energyConsumptionKwh} kWh</span>
              <p className="text-xs text-slate-300 font-mono-tech">Within Normal Range</p>
            </div>

            <div className="liquid-glass p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400">DAILY WATER CONSUMPTION</span>
                <Droplets className="w-4 h-4 text-teal-400" />
              </div>
              <span className="text-3xl font-mono-tech font-semibold text-white">{unit.sensors.waterUsageLiters} L</span>
              <p className="text-xs text-slate-300 font-mono-tech">Flow Sensor Verified</p>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL LEDGER */}
        {activeTab === 'financials' && (
          <div className="liquid-glass p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-lg font-serif-editorial text-white">Monthly Rent Roll & Invoice Ledger</h3>
                <p className="text-xs font-mono-tech text-slate-400 mt-0.5">Unit {unit.id} payment receipts & recurring monthly billing</p>
              </div>

              <button
                onClick={onOpenQuickAction}
                className="px-4 py-2 text-xs font-mono-tech text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl font-semibold transition-all"
              >
                + Record Payment
              </button>
            </div>

            <div className="space-y-3">
              {[
                { period: 'June 2026', amount: unit.monthlyRentUSD, date: '2026-06-01', ref: 'TX-908124', status: 'PAID', method: 'Bank Transfer (Auto-Pay)' },
                { period: 'May 2026', amount: unit.monthlyRentUSD, date: '2026-05-01', ref: 'TX-882103', status: 'PAID', method: 'Bank Transfer (Auto-Pay)' },
                { period: 'April 2026', amount: unit.monthlyRentUSD, date: '2026-04-01', ref: 'TX-859421', status: 'PAID', method: 'Bank Transfer (Auto-Pay)' },
              ].map((row, i) => (
                <div key={i} className="product-ui-card p-4 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs">
                  <div className="space-y-1">
                    <span className="text-white font-semibold text-sm">{row.period} Rent Invoice</span>
                    <p className="text-slate-400 text-[11px]">Ref: {row.ref} — Method: {row.method}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-base font-semibold text-white">${row.amount.toLocaleString()}</span>
                    <span className="px-2.5 py-1 text-[10px] uppercase rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      {row.status}
                    </span>
                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WORK ORDERS & DISPATCH */}
        {activeTab === 'maintenance' && (
          <div className="liquid-glass p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-lg font-serif-editorial text-white">Work Orders & Maintenance Tickets</h3>
                <p className="text-xs font-mono-tech text-slate-400 mt-0.5">Active tickets and repair logs for Unit {unit.id}</p>
              </div>

              <button
                onClick={onOpenQuickAction}
                className="px-4 py-2 text-xs font-mono-tech text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
              >
                + Log New Ticket
              </button>
            </div>

            {unitTickets.length > 0 ? (
              <div className="space-y-3">
                {unitTickets.map((t) => (
                  <div key={t.id} className="product-ui-card p-4 flex items-center justify-between gap-4 font-mono-tech text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{t.id}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">{t.category}</span>
                        <span className={`px-2 py-0.5 text-[9px] uppercase rounded ${t.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'}`}>
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-slate-200 font-sans text-xs">{t.title}</p>
                    </div>

                    <span className="px-3 py-1 text-[10px] uppercase rounded bg-slate-800 text-emerald-300 border border-slate-700">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-white">All Systems Operational</h4>
                <p className="text-xs text-slate-400 font-mono-tech">No active maintenance work orders for Unit {unit.id}.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: LEASE DOCUMENTS & PDF FILES */}
        {activeTab === 'documents' && (
          <div className="liquid-glass p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-lg font-serif-editorial text-white">Lease Contract & Verification Files</h3>
                <p className="text-xs font-mono-tech text-slate-400 mt-0.5">Signed PDFs and resident identity documentation</p>
              </div>
            </div>

            <div className="space-y-3 font-mono-tech text-xs">
              {[
                { name: `Signed_Lease_Agreement_${unit.id}.pdf`, type: 'Lease Contract', date: '2023-01-15', size: '2.4 MB' },
                { name: `Resident_Identity_Verification_${unit.resident?.id || 'doc'}.pdf`, type: 'ID Document', date: '2023-01-10', size: '1.1 MB' },
                { name: `Building_Rules_and_Bylaws_Signoff.pdf`, type: 'Regulations', date: '2023-01-15', size: '850 KB' },
              ].map((doc, idx) => (
                <div key={idx} className="product-ui-card p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-white font-semibold block">{doc.name}</span>
                      <span className="text-slate-400 text-[11px]">{doc.type} • Uploaded {doc.date} ({doc.size})</span>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
