import React from 'react';
import { 
  Building, 
  Users, 
  FileText, 
  Receipt, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  Bot
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
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#142605] border border-[#163300]/10 dark:border-[#9FE870]/20 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2F7D4] dark:bg-[#163300] border border-[#9FE870]/40 text-[#163300] dark:text-[#9FE870] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#20A05A]" />
              <span>Hệ Thống Quản Trị Cho Thuê Căn Hộ HAVEN</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#163300] dark:text-white tracking-tight">
              Báo Cáo Tổng Quan Vận Hành
            </h1>
            <p className="text-[#495E35] dark:text-emerald-200/80 text-sm max-w-2xl font-medium leading-relaxed">
              Nắm bắt tức thời tỷ lệ lấp đầy, nguồn khách thuê tiềm năng, hợp đồng gia hạn và dòng tiền thu hộ trên toàn bộ hệ thống {totalUnits} căn hộ.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAiCopilot}
              className="wise-btn-primary px-6 py-3.5 rounded-full font-black text-xs transition-all hover:scale-105 shadow-sm cursor-pointer flex items-center gap-2"
              title="Mở Trợ lý Trí tuệ AI hỗ trợ điều hành và quản trị vận hành"
            >
              <Bot className="w-4 h-4 text-[#163300]" />
              <span>Báo Cáo AI Vận Hành</span>
            </button>
          </div>
        </div>

        {/* 4 Core Vital Signs Grid with Wise Multi-Accent Spectrum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#163300]/10 dark:border-[#9FE870]/20">
          {/* Metric 1: Occupancy (Wise Forest & Spring Lime) */}
          <div 
            onClick={() => onNavigateTab('units')}
            className="wise-kpi-card cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between text-[#495E35] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span>TỶ LỆ LẤP ĐẦY</span>
              <div className="w-8 h-8 rounded-full bg-[#E2F7D4] dark:bg-[#163300] flex items-center justify-center">
                <Building className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#163300] dark:text-white tracking-tight">{occupancyRate}%</span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#163300]/5">
              <span className="wise-badge-lime text-[11px] font-bold">
                {occupiedUnits}/{totalUnits} căn đang ở
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#163300] dark:text-[#9FE870] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Metric 2: Revenue (Wise Sunshine Gold) */}
          <div 
            onClick={() => onNavigateTab('billing')}
            className="wise-kpi-card cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between text-[#7A5200] dark:text-[#FFC83B] text-xs font-bold uppercase tracking-wider">
              <span>DOANH THU THỰC THU</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF6DB] dark:bg-[#7A5200]/30 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-[#7A5200] dark:text-[#FFC83B]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#7A5200] dark:text-[#FFC83B] tracking-tight">
                {(totalCollectedVND / 1000000).toFixed(0)} Triệu
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#163300]/5">
              <span className="wise-badge-gold text-[11px] font-bold">
                Chờ thu: {(pendingRevenueVND / 1000000).toFixed(0)} Tr
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#7A5200] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Metric 3: Leads (Wise Electric Cobalt) */}
          <div 
            onClick={() => onNavigateTab('leads')}
            className="wise-kpi-card cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between text-[#0F2E6B] dark:text-[#2570EB] text-xs font-bold uppercase tracking-wider">
              <span>YÊU CẦU THUÊ MỚI</span>
              <div className="w-8 h-8 rounded-full bg-[#EBF2FF] dark:bg-[#0F2E6B]/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#2570EB]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#0F2E6B] dark:text-[#2570EB] tracking-tight">{pendingLeads.length}</span>
              <span className="text-xs font-bold text-[#495E35]">yêu cầu</span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#163300]/5">
              <span className="wise-badge-cobalt text-[11px] font-bold">
                Tổng: {leads.length} khách quan tâm
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#2570EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Metric 4: Active Contracts (Wise Royal Violet) */}
          <div 
            onClick={() => onNavigateTab('contracts')}
            className="wise-kpi-card cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between text-[#431A7A] dark:text-[#8B5CF6] text-xs font-bold uppercase tracking-wider">
              <span>HỢP ĐỒNG HIỆU LỰC</span>
              <div className="w-8 h-8 rounded-full bg-[#F3E8FF] dark:bg-[#431A7A]/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#8B5CF6]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#431A7A] dark:text-[#8B5CF6] tracking-tight">{activeContracts.length}</span>
              <span className="text-xs font-bold text-[#495E35]">hợp đồng</span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#163300]/5">
              <span className="wise-badge-violet text-[11px] font-bold">
                {expiringContracts.length > 0 ? `${expiringContracts.length} sắp đến hạn` : '100% ổn định'}
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#8B5CF6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Leads & Expiring Leases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Rental Inquiries */}
        <div className="wise-card p-6 bg-white dark:bg-[#142605] border border-[#163300]/10 dark:border-[#9FE870]/20 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#163300]/10 dark:border-[#9FE870]/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EBF2FF] dark:bg-[#0F2E6B]/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#2570EB]" />
              </div>
              <h2 className="font-extrabold text-base text-[#163300] dark:text-white">Yêu Cầu Đặt Lịch & Thuê Mới Nhất</h2>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-bold text-[#2570EB] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {leads.slice(0, 4).map(lead => (
              <div key={lead.id} className="p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#163300]/50 border border-[#163300]/5 dark:border-[#9FE870]/10 flex items-center justify-between hover:bg-[#F2F5F0] transition-colors">
                <div>
                  <div className="font-extrabold text-[#163300] dark:text-white text-sm">{lead.customerName}</div>
                  <div className="text-xs text-[#738565] font-semibold flex items-center gap-2 mt-0.5">
                    <span>{lead.phone}</span>
                    <span>•</span>
                    <span className="text-[#2570EB] font-bold">{lead.unitName}</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-[#495E35] dark:text-emerald-200/80 font-bold">{lead.viewingDate || 'Chưa hẹn'}</div>
                  <span className={`inline-block mt-1 ${
                    lead.status === 'new' ? 'wise-badge-coral' : 'wise-badge-lime'
                  }`}>
                    {lead.status === 'new' ? 'Mới nhận' : 'Đã hẹn'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Contracts Expiring Soon */}
        <div className="wise-card p-6 bg-white dark:bg-[#142605] border border-[#163300]/10 dark:border-[#9FE870]/20 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#163300]/10 dark:border-[#9FE870]/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFF6DB] dark:bg-[#7A5200]/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#7A5200] dark:text-[#FFC83B]" />
              </div>
              <h2 className="font-extrabold text-base text-[#163300] dark:text-white">Hợp Đồng Cho Thuê Hiện Hành</h2>
            </div>
            <button
              onClick={() => onNavigateTab('contracts')}
              className="text-xs font-bold text-[#7A5200] dark:text-[#FFC83B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Sổ hợp đồng</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {contracts.slice(0, 4).map(contract => (
              <div key={contract.id} className="p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#163300]/50 border border-[#163300]/5 dark:border-[#9FE870]/10 flex items-center justify-between hover:bg-[#F2F5F0] transition-colors">
                <div>
                  <div className="font-extrabold text-[#163300] dark:text-white text-sm">{contract.tenantName}</div>
                  <div className="text-xs text-[#738565] font-semibold flex items-center gap-2 mt-0.5">
                    <span className="text-[#163300] dark:text-emerald-100 font-bold">{contract.unitName}</span>
                    <span>•</span>
                    <span className="text-[#7A5200] dark:text-[#FFC83B] font-bold">{(contract.monthlyRentVND / 1000000).toFixed(0)}Tr/tháng</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-[#738565] text-[11px] font-semibold">Hạn: {contract.endDate}</div>
                  <span className={`inline-block mt-1 ${
                    contract.status === 'active' ? 'wise-badge-lime' : 'wise-badge-gold'
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
