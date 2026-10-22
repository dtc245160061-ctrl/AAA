import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  FileText, 
  Receipt, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  Bot,
  Zap,
  Droplets,
  KeyRound,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import type { ApartmentUnit, RentalLead, LeaseContract, RentalInvoice } from '../types/apartment';
import { 
  scanUtilityAndIotAnomalies, 
  autoCreateMaintenanceTicketsForAnomalies,
  type UtilityAnomaly 
} from '../services/aiAdminOperationsService';
import { useAiCommand } from '../services/aiCommandBus';

interface DashboardViewProps {
  units: ApartmentUnit[];
  leads: RentalLead[];
  contracts: LeaseContract[];
  invoices: RentalInvoice[];
  onSelectUnit?: (unitId: string) => void;
  onNavigateTab: (tabId: string) => void;
  onOpenAiCopilot: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  units,
  leads,
  contracts,
  invoices,
  onSelectUnit,
  onNavigateTab,
  onOpenAiCopilot,
  onShowToast
}) => {
  // Metric Computations
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'occupied').length;
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

  // IoT Utility Anomaly State
  const [anomalies, setAnomalies] = useState<UtilityAnomaly[]>(() => 
    scanUtilityAndIotAnomalies(units, invoices)
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isCreatingTickets, setIsCreatingTickets] = useState<boolean>(false);
  const [ticketSuccessMessage, setTicketSuccessMessage] = useState<string | null>(null);

  // Global AI Action Bus Listener
  useAiCommand((cmd) => {
    if (cmd.type === 'scan_iot_leaks') {
      handleRescanSensors();
      if (cmd.payload.autoCreateTickets) {
        handleCreateEmergencyTickets();
      }
    }
  });

  const handleRescanSensors = () => {
    setIsScanning(true);
    setTimeout(() => {
      const fresh = scanUtilityAndIotAnomalies(units, invoices);
      setAnomalies(fresh);
      setIsScanning(false);
      if (onShowToast) {
        onShowToast('info', 'Hoàn tất quét cảm biến IoT', `Đã phân tích dòng chảy và điện năng toàn bộ ${units.length} căn hộ.`);
      }
    }, 600);
  };

  const handleCreateEmergencyTickets = () => {
    setIsCreatingTickets(true);
    try {
      const tickets = autoCreateMaintenanceTicketsForAnomalies(anomalies);
      setAnomalies([...anomalies]); // Trigger re-render with ticketCreated flag
      setTicketSuccessMessage(`Đã tự động khởi tạo ${tickets.length} phiếu bảo trì khẩn cấp thành công.`);

      if (onShowToast) {
        onShowToast(
          'success',
          'Đã kích hoạt điều phối bảo trì khẩn cấp',
          `Hệ thống đã điều chuyển ${tickets.length} phiếu công tác (Emergency / Urgent) tới Đội ngũ Kỹ thuật Cơ điện HAVEN.`
        );
      }
    } catch (e) {
      console.error(e);
      if (onShowToast) {
        onShowToast('error', 'Lỗi tạo phiếu bảo trì', 'Không thể kết nối lưu trữ công tác bảo trì.');
      }
    } finally {
      setIsCreatingTickets(false);
    }
  };

  const totalLossVND = anomalies.reduce((acc, curr) => acc + curr.estimatedMonthlyLossVND, 0);

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Hero Operational Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#142605] border border-[#163300]/10 dark:border-[#9FE870]/20 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2F7D4] dark:bg-[#163300] border border-[#9FE870]/40 text-[#163300] dark:text-[#9FE870] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
              <span>Hệ Thống Quản Trị Cho Thuê Căn Hộ HAVEN</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#163300] dark:text-white tracking-tight">
              Báo Cáo Tổng Quan Vận Hành
            </h1>
            <p className="text-[#495E35] dark:text-emerald-200/80 text-sm max-w-2xl font-medium leading-relaxed">
              Nắm bắt tức thời tỷ lệ lấp đầy, nguồn khách thuê tiềm năng, hợp đồng gia hạn, dòng tiền thu hộ và radar rò rỉ tiện ích IoT trên toàn bộ hệ thống {totalUnits} căn hộ.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAiCopilot}
              className="wise-btn-primary px-6 py-3.5 rounded-full font-black text-xs transition-all hover:scale-105 shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-[#163300]" />
              <span>Mở AI Trợ Lý Vận Hành</span>
            </button>
          </div>
        </div>

        {/* 4 Core Operational KPI Cards - Wise Color Palette System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#163300]/10 dark:border-[#9FE870]/20">
          {/* Metric 1: Occupancy Rate (Forest Green / Lime) */}
          <div 
            onClick={() => onNavigateTab('units')}
            className="wise-kpi-card cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between text-[#163300] dark:text-[#9FE870] text-xs font-bold uppercase tracking-wider">
              <span>TỶ LỆ LẤP ĐẦY</span>
              <div className="w-8 h-8 rounded-full bg-[#E2F7D4] dark:bg-[#163300] flex items-center justify-center">
                <Building className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#163300] dark:text-white tracking-tight">{occupancyRate}%</span>
              <span className="text-xs font-bold text-[#495E35]">({occupiedUnits}/{totalUnits} căn)</span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#163300]/5">
              <span className="wise-badge-lime text-[11px] font-bold">
                {totalUnits - occupiedUnits} căn đang trống
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#163300] dark:text-[#9FE870] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Metric 2: Monthly Cashflow (Cobalt Blue) */}
          <div 
            onClick={() => onNavigateTab('billing')}
            className="wise-kpi-card cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between text-[#0F2E6B] dark:text-[#2570EB] text-xs font-bold uppercase tracking-wider">
              <span>DÒNG TIỀN ĐÃ THU</span>
              <div className="w-8 h-8 rounded-full bg-[#EBF2FF] dark:bg-[#0F2E6B]/30 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-[#2570EB]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#0F2E6B] dark:text-[#2570EB] tracking-tight">{(totalCollectedVND / 1000000).toFixed(0)}</span>
              <span className="text-xs font-bold text-[#495E35]">Tr VNĐ</span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#163300]/5">
              <span className="wise-badge-blue text-[11px] font-bold">
                {(pendingRevenueVND / 1000000).toFixed(0)}Tr chờ thu
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#2570EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Metric 3: Active Leads (Warm Amber) */}
          <div 
            onClick={() => onNavigateTab('leads')}
            className="wise-kpi-card cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between text-[#7A5200] dark:text-[#FFC83B] text-xs font-bold uppercase tracking-wider">
              <span>KHÁCH CHỜ XEM NHÀ</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF6DB] dark:bg-[#7A5200]/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#FFC83B]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#7A5200] dark:text-[#FFC83B] tracking-tight">{pendingLeads.length}</span>
              <span className="text-xs font-bold text-[#495E35]">khách hàng</span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#163300]/5">
              <span className="wise-badge-gold text-[11px] font-bold">
                {leads.filter(l => l.status === 'viewing_scheduled').length} đã xếp lịch
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#FFC83B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Metric 4: Active Contracts (Royal Violet) */}
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

      {/* ========================================================================= */}
      {/* NEW HIGH-IMPACT: AI IOT UTILITY LEAK & ANOMALY RADAR PANEL */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8F6] dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-[#FF5436] font-bold text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF5436]" />
              <span>AI Giám Sát Rò Rỉ Tiện Ích & Cảm Biến IoT (Realtime Anomaly Radar)</span>
            </div>
            <h2 className="text-2xl font-bold text-[#163300] dark:text-white">
              Cảnh Báo Bất Thường Điện, Rò Rỉ Nước & Pin Khóa Cửa
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              Thuật toán thống kê Z-score liên tục đối chiếu chỉ số công tơ với định mức tiêu thụ phòng ngủ, phát hiện ngay rò rỉ van bồn cầu, kẹt rơ-le điều hòa và sập nguồn smart lock.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRescanSensors}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#163300] dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#9FE870]' : ''}`} />
              <span>{isScanning ? 'Đang Quét IoT...' : 'Quét Lại Cảm Biến'}</span>
            </button>

            <button
              onClick={handleCreateEmergencyTickets}
              disabled={isCreatingTickets || anomalies.length === 0}
              className="px-5 py-2.5 rounded-full bg-[#FF5436] hover:bg-[#E03A1E] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Wrench className="w-4 h-4" />
              <span>{isCreatingTickets ? 'Đang Điều Phối...' : 'Tự Động Tạo Phiếu Bảo Trì Khẩn Cấp'}</span>
            </button>
          </div>
        </div>

        {/* Financial Risk Summary Bar */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Ước tính thiệt hại tài chính nếu không khắc phục kịp thời:
              </div>
              <div className="text-xs text-amber-700/80 dark:text-amber-300/80">
                Lãng phí tài nguyên nước sạch, nhảy vọt biểu giá điện EVN bậc 6 & nguy cơ đền bù thấm dột.
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-300">
              ~{totalLossVND.toLocaleString('vi-VN')} đ/tháng
            </span>
          </div>
        </div>

        {/* Anomaly Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {anomalies.map((anom) => {
            const isWater = anom.type === 'water_leak';
            const isElec = anom.type === 'electricity_spike';

            return (
              <div 
                key={anom.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        isWater 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' 
                          : isElec 
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' 
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}>
                        {isWater ? <Droplets className="w-4 h-4" /> : isElec ? <Zap className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#163300] dark:text-white block">
                          {anom.unitName}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Mã căn: {anom.unitId} • {anom.tenantName}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      anom.severity === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                    }`}>
                      {anom.severity === 'critical' ? 'Khẩn Cấp' : 'Cảnh Báo'}
                    </span>
                  </div>

                  {/* Quantitative Metric */}
                  <div className="p-3 rounded-xl bg-[#F8FAF7] dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Chỉ số cảm biến:</span>
                      <span className="font-mono font-bold text-sm text-[#163300] dark:text-[#9FE870]">
                        {anom.metricValue} {anom.metricUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Định mức tiêu chuẩn:</span>
                      <span className="font-mono">{anom.baselineValue} {anom.metricUnit}</span>
                    </div>
                    <div className="pt-1 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#FF5436]">Độ lệch bất thường:</span>
                      <span className="text-[#FF5436] font-mono">{anom.deviationRatio}x</span>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-[#163300] dark:text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5436]" />
                      <span>{anom.probableCause}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      {anom.diagnosisDetails}
                    </p>
                  </div>
                </div>

                {/* Footer Action & Risk */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Tổn thất dự kiến:</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      +{anom.estimatedMonthlyLossVND.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  {anom.ticketCreated ? (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã tạo {anom.ticketId || 'Phiếu Bảo Trì'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        autoCreateMaintenanceTicketsForAnomalies([anom]);
                        setAnomalies([...anomalies]);
                        if (onShowToast) {
                          onShowToast('success', 'Đã tạo phiếu bảo trì', `Đã lên lịch khắc phục cho căn ${anom.unitName}`);
                        }
                      }}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#163300] dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tạo Phiếu Đơn Lẻ</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {ticketSuccessMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#9FE870]" />
              <span>{ticketSuccessMessage}</span>
            </div>
            <button
              onClick={() => onNavigateTab('maintenance')}
              className="text-xs font-bold text-emerald-700 dark:text-[#9FE870] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem Sổ Lệnh Bảo Trì</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
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
                    <button
                      onClick={() => onSelectUnit && onSelectUnit(lead.unitId)}
                      className="text-[#2570EB] font-bold hover:underline"
                    >
                      {lead.unitName}
                    </button>
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
