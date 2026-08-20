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
      {/* Hero Operational Banner */}
      <div className="p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-mono text-xs font-semibold transition-all hover:scale-105 shadow-lg shadow-emerald-500/10"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Phân Tích AI Copilot</span>
            </button>
          </div>
        </div>

        {/* 4 Core Vital Signs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          {/* Metric 1: Occupancy */}
          <div 
            onClick={() => onNavigateTab('units')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>TỶ LỆ LẤP ĐẦY</span>
              <Building className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-100">{occupancyRate}%</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">{occupiedUnits}/{totalUnits} căn</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Trống: {vacantUnits} • Cọc: {reservedUnits}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </div>
          </div>

          {/* Metric 2: Revenue */}
          <div 
            onClick={() => onNavigateTab('billing')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>DOANH THU THÁNG 8</span>
              <Receipt className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-emerald-400">
                {(totalCollectedVND / 1000000).toFixed(0)} Triệu
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Chờ thu: {(pendingRevenueVND / 1000000).toFixed(0)} Tr</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </div>
          </div>

          {/* Metric 3: Leads */}
          <div 
            onClick={() => onNavigateTab('leads')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>YÊU CẦU THUÊ MỚI</span>
              <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-100">{pendingLeads.length}</span>
              <span className="text-xs font-mono text-emerald-400">cần xử lý</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Tổng leads: {leads.length}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </div>
          </div>

          {/* Metric 4: Active Contracts */}
          <div 
            onClick={() => onNavigateTab('contracts')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>HỢP ĐỒNG HIỆU LỰC</span>
              <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-100">{activeContracts.length}</span>
              {expiringContracts.length > 0 && (
                <span className="text-xs font-mono text-amber-400">({expiringContracts.length} sắp hết hạn)</span>
              )}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Toàn hệ thống</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Leads & Expiring Leases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Rental Inquiries */}
        <div className="atmospheric-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h2 className="font-serif text-lg font-bold text-slate-100">Yêu Cầu Đặt Lịch & Thuê Mới Nhất</h2>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map(lead => (
              <div key={lead.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-slate-100 text-sm">{lead.customerName}</div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                    <span>{lead.phone}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{lead.unitName}</span>
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-slate-300 font-medium">{lead.viewingDate || 'Chưa hẹn'}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] ${
                    lead.status === 'new' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
                  }`}>
                    {lead.status === 'new' ? 'Mới' : lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Contracts Expiring Soon */}
        <div className="atmospheric-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h2 className="font-serif text-lg font-bold text-slate-100">Hợp Đồng Cho Thuê Hiện Hành</h2>
            </div>
            <button
              onClick={() => onNavigateTab('contracts')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Sổ hợp đồng</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {contracts.slice(0, 4).map(contract => (
              <div key={contract.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-slate-100 text-sm">{contract.tenantName}</div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                    <span className="text-slate-300 font-medium">{contract.unitName}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{(contract.monthlyRentVND / 1000000).toFixed(0)}Tr/tháng</span>
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-slate-400 text-[11px]">Hạn: {contract.endDate}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] ${
                    contract.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
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
  );
};
