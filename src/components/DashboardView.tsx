import React from 'react';
import { 
  Building, 
  Users, 
  FileText, 
  Receipt, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import type { ApartmentUnit, RentalLead, LeaseContract, RentalInvoice } from '../types/apartment';

interface DashboardViewProps {
  units: ApartmentUnit[];
  leads: RentalLead[];
  contracts: LeaseContract[];
  invoices: RentalInvoice[];
  onSelectUnit?: (unitId: string) => void;
  onNavigateTab: (tabId: string) => void;
  onOpenAiCopilot: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  units,
  leads,
  contracts,
  invoices,
  onNavigateTab,
  onOpenAiCopilot
}) => {
  // Metric Computations
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'occupied').length;
  const vacantUnits = units.filter(u => u.status === 'vacant').length;
  const reservedUnits = units.filter(u => u.status === 'reserved').length;
  const occupancyRate = totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : '0';

  const pendingLeads = leads.filter(l => l.status === 'new' || l.status === 'viewing_scheduled');
  const activeContracts = contracts.filter(c => c.status === 'active' || c.status === 'expiring_soon');
  const expiringContracts = contracts.filter(c => c.status === 'expiring_soon');

  const totalCollectedVND = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, curr) => acc + curr.totalAmountVND, 0);

  const pendingRevenueVND = invoices
    .filter(i => i.status === 'pending' || i.status === 'overdue')
    .reduce((acc, curr) => acc + curr.totalAmountVND, 0);

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Hero Operational Banner with Radiating Luxury Aura */}
      <div className="relative rounded-3xl p-[2.5px] overflow-hidden shadow-2xl group">
        {/* Dynamic Sweep Beam */}
        <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />
        <div className="p-6 sm:p-8 rounded-[22px] atmospheric-panel haven-sheen-sweep space-y-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hệ Thống Quản Trị Cho Thuê Căn Hộ HAVEN</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif text-slate-100 font-bold tracking-tight">
                Báo Cáo Tổng Quan Vận Hành
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl">
                Nắm bắt tức thời tỷ lệ lấp đầy, nguồn khách thuê tiềm năng, hợp đồng gia hạn và dòng tiền thu hộ trên toàn bộ hệ thống {totalUnits} căn hộ.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAiCopilot}
                className="haven-btn-beam inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 [data-theme='light']_:bg-white border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 [data-theme='light']_:text-emerald-700 font-mono text-xs font-semibold transition-all hover:scale-105 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Phân Tích AI Copilot</span>
              </button>
            </div>
          </div>

          {/* 4 Core Vital Signs Grid with Radiating Synchronized Laser Beams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            {/* Metric 1: Occupancy (Emerald) */}
            <div 
              onClick={() => onNavigateTab('units')}
              className="group/metric relative rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 haven-beam-emerald"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-70 group-hover/metric:opacity-100" />
              </div>
              <div className="relative z-10 w-full h-full p-5 rounded-[14px] atmospheric-panel haven-sheen-sweep border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>TỶ LỆ LẤP ĐẦY</span>
                  <Building className="w-4 h-4 text-emerald-400 group-hover/metric:scale-110 transition-transform" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-slate-100">{occupancyRate}%</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{occupiedUnits}/{totalUnits} căn</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Trống: {vacantUnits} • Cọc: {reservedUnits}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/metric:text-emerald-400 group-hover/metric:translate-x-0.5 group-hover/metric:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </div>

            {/* Metric 2: Revenue (Gold) */}
            <div 
              onClick={() => onNavigateTab('billing')}
              className="group/metric relative rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 haven-beam-gold"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-70 group-hover/metric:opacity-100" />
              </div>
              <div className="relative z-10 w-full h-full p-5 rounded-[14px] atmospheric-panel haven-sheen-sweep border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>DOANH THU THÁNG 8</span>
                  <Receipt className="w-4 h-4 text-amber-400 group-hover/metric:scale-110 transition-transform" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-serif font-bold text-amber-400">
                    {(totalCollectedVND / 1000000).toFixed(0)} Triệu
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Chờ thu: {(pendingRevenueVND / 1000000).toFixed(0)} Tr</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/metric:text-amber-400 group-hover/metric:translate-x-0.5 group-hover/metric:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </div>

            {/* Metric 3: Leads (Cyan) */}
            <div 
              onClick={() => onNavigateTab('leads')}
              className="group/metric relative rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 haven-beam-cyan"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-70 group-hover/metric:opacity-100" />
              </div>
              <div className="relative z-10 w-full h-full p-5 rounded-[14px] atmospheric-panel haven-sheen-sweep border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>YÊU CẦU THUÊ MỚI</span>
                  <Users className="w-4 h-4 text-sky-400 group-hover/metric:scale-110 transition-transform" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-slate-100">{pendingLeads.length}</span>
                  <span className="text-xs font-mono text-sky-400">cần xử lý</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Tổng leads: {leads.length}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/metric:text-sky-400 group-hover/metric:translate-x-0.5 group-hover/metric:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </div>

            {/* Metric 4: Active Contracts (Purple) */}
            <div 
              onClick={() => onNavigateTab('contracts')}
              className="group/metric relative rounded-2xl p-[1.5px] shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 haven-beam-purple"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="animate-spin-beam pointer-events-none transition-opacity duration-300 opacity-70 group-hover/metric:opacity-100" />
              </div>
              <div className="relative z-10 w-full h-full p-5 rounded-[14px] atmospheric-panel haven-sheen-sweep border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span>HỢP ĐỒNG HIỆU LỰC</span>
                  <FileText className="w-4 h-4 text-purple-400 group-hover/metric:scale-110 transition-transform" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-slate-100">{activeContracts.length}</span>
                  {expiringContracts.length > 0 && (
                    <span className="text-xs font-mono text-amber-400">({expiringContracts.length} sắp hết hạn)</span>
                  )}
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Toàn hệ thống</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/metric:text-purple-400 group-hover/metric:translate-x-0.5 group-hover/metric:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Leads & Expiring Leases with Continuous Laser Aura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Rental Inquiries (Continuous Cyan Laser Beam) */}
        <div className="relative rounded-3xl p-[2.5px] overflow-hidden group shadow-2xl haven-beam-cyan">
          <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />
          <div className="atmospheric-panel p-6 rounded-[22px] haven-sheen-sweep border border-sky-500/30 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-100">Yêu Cầu Đặt Lịch & Thuê Mới Nhất</h2>
              </div>
              <button
                onClick={() => onNavigateTab('leads')}
                className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 4).map(lead => (
                <div key={lead.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between hover:border-sky-500/40 transition-colors">
                  <div>
                    <div className="font-serif font-bold text-slate-100 text-sm">{lead.customerName}</div>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{lead.phone}</span>
                      <span>•</span>
                      <span className="text-sky-400 font-medium">{lead.unitName}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-300 font-medium">{lead.viewingDate || 'Chưa hẹn'}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] ${
                      lead.status === 'new' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {lead.status === 'new' ? 'Mới' : lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contracts Expiring Soon (Continuous Gold Laser Beam) */}
        <div className="relative rounded-3xl p-[2.5px] overflow-hidden group shadow-2xl haven-beam-gold">
          <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />
          <div className="atmospheric-panel p-6 rounded-[22px] haven-sheen-sweep border border-amber-500/30 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <FileText className="w-4 h-4 text-amber-400" />
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-100">Hợp Đồng Cho Thuê Hiện Hành</h2>
              </div>
              <button
                onClick={() => onNavigateTab('contracts')}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Sổ hợp đồng</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {contracts.slice(0, 4).map(contract => (
                <div key={contract.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between hover:border-amber-500/40 transition-colors">
                  <div>
                    <div className="font-serif font-bold text-slate-100 text-sm">{contract.tenantName}</div>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span className="text-slate-300 font-medium">{contract.unitName}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-medium">{(contract.monthlyRentVND / 1000000).toFixed(0)}Tr/tháng</span>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-400 text-[11px]">Hạn: {contract.endDate}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] ${
                      contract.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {contract.status === 'active' ? 'Đang hiệu lực' : 'Sắp hết hạn'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
