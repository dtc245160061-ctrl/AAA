import React, { useState } from 'react';
import { 
  Search, 
  Receipt,
  Check,
  Clock,
  Wallet,
  AlertCircle
} from 'lucide-react';
import type { RentalInvoice, InvoiceStatus } from '../types/apartment';

interface PaymentsViewProps {
  invoices: RentalInvoice[];
  onMarkInvoicePaid: (id: string) => void;
  onSelectUnit: (unitId: string) => void;
  onOpenQuickAction?: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  invoices,
  onMarkInvoicePaid,
  onSelectUnit,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalCollectedVND = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, curr) => acc + curr.totalAmountVND, 0);

  const pendingRevenueVND = invoices
    .filter(i => i.status === 'pending')
    .reduce((acc, curr) => acc + curr.totalAmountVND, 0);

  const overdueRevenueVND = invoices
    .filter(i => i.status === 'overdue')
    .reduce((acc, curr) => acc + curr.totalAmountVND, 0);

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch = inv.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9FE870] text-[#163300] text-[10px] font-bold whitespace-nowrap shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#163300]" />
            <span>Đã thanh toán</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC83B] text-[#7A5200] text-[10px] font-bold whitespace-nowrap shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7A5200]" />
            <span>Chờ thanh toán</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5436] text-white text-[10px] font-bold whitespace-nowrap shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Quá hạn nợ</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner - Pure Wise Clean Surface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#163300]/70 dark:text-[#9FE870] uppercase tracking-wider">
              <Receipt className="w-4 h-4 text-[#2570EB]" />
              <span>Sổ Quỹ Thu Tiền Thuê Nhà & Hóa Đơn Dịch Vụ (Rent Ledger)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-slate-100 tracking-tight">
              Thu Tiền Nhà & Hóa Đơn
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Kiểm soát dòng tiền thực thu hàng tháng, tiền điện nước dịch vụ và đôn đốc thanh toán đúng hạn.
            </p>
          </div>
        </div>

        {/* 3 Cashflow Highlights - Wise KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Card 1: Đã thu */}
          <div className="wise-kpi-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">ĐÃ THU (THÁNG HIỆN TẠI)</span>
              <span className="p-2 rounded-full bg-[#9FE870]/20 text-[#163300] dark:text-[#9FE870]">
                <Wallet className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold tabular-nums text-[#163300] dark:text-[#9FE870]">
              {(totalCollectedVND / 1000000).toFixed(0)} Triệu VNĐ
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#20A05A]" />
              <span>{invoices.filter(i => i.status === 'paid').length} hóa đơn đã hoàn tất thu</span>
            </div>
          </div>

          {/* Card 2: Chờ thu */}
          <div className="wise-kpi-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">CHỜ THU TRONG KỲ</span>
              <span className="p-2 rounded-full bg-[#FFC83B]/20 text-[#7A5200] dark:text-[#FFC83B]">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold tabular-nums text-[#7A5200] dark:text-[#FFC83B]">
              {(pendingRevenueVND / 1000000).toFixed(0)} Triệu VNĐ
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFC83B]" />
              <span>{invoices.filter(i => i.status === 'pending').length} căn hộ đến hạn kỳ này</span>
            </div>
          </div>

          {/* Card 3: Quá hạn */}
          <div className="wise-kpi-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">NỢ QUÁ HẠN CẦN THU HỒI</span>
              <span className="p-2 rounded-full bg-[#FF5436]/15 text-[#FF5436]">
                <AlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold tabular-nums text-[#FF5436]">
              {(overdueRevenueVND / 1000000).toFixed(0)} Triệu VNĐ
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5436]" />
              <span>{invoices.filter(i => i.status === 'overdue').length} hóa đơn quá hạn cần đôn đốc</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="wise-pill-tabs overflow-x-auto max-w-full">
            {[
              { id: 'all', label: `Tất cả (${invoices.length})` },
              { id: 'paid', label: 'Đã thanh toán' },
              { id: 'pending', label: 'Chờ thanh toán' },
              { id: 'overdue', label: 'Quá hạn' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={statusFilter === tab.id ? 'wise-pill-tab-active' : 'wise-pill-tab'}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên khách, phòng, mã HĐ..."
              className="pl-10 pr-4 py-2 text-xs bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[#163300] dark:text-slate-200 placeholder:text-slate-400 font-sans focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
            />
          </div>
        </div>
      </div>

      {/* Invoices Ledger Table - Pure Wise Rounded-[24px] Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAF6] dark:bg-slate-800/90 text-[#163300] dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 whitespace-nowrap">Mã Thu / Kỳ Hạn</th>
                <th className="p-4 whitespace-nowrap">Người Thuê</th>
                <th className="p-4 whitespace-nowrap">Căn Hộ</th>
                <th className="p-4 whitespace-nowrap">Tiền Thuê</th>
                <th className="p-4 whitespace-nowrap">Dịch Vụ & Điện Nước</th>
                <th className="p-4 whitespace-nowrap">Tổng Thu</th>
                <th className="p-4 whitespace-nowrap">Trạng Thái</th>
                <th className="p-4 text-right whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredInvoices.map(inv => (
                <tr
                  key={inv.id}
                  className="hover:bg-[#F2F5F0]/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 whitespace-nowrap">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[#163300] dark:text-slate-200 tabular-nums shadow-xs">
                      {inv.invoiceCode}
                    </div>
                    <div className="text-slate-400 text-[10px] mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{inv.monthYear} • Hạn {inv.dueDate}</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-[#163300] dark:text-slate-100 text-sm">{inv.tenantName}</div>
                  </td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectUnit(inv.unitId)}>
                    <div className="font-bold text-[#163300] dark:text-slate-200 hover:text-[#2570EB] line-clamp-1">{inv.unitName}</div>
                    <div className="text-slate-400 text-[10px]">{inv.unitId}</div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-200 whitespace-nowrap tabular-nums font-medium">
                    {(inv.rentAmountVND / 1000000).toFixed(0)} Tr
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums font-medium">
                    <div>DV: {(inv.serviceFeeVND / 1000000).toFixed(1)} Tr</div>
                    <div className="text-[10px] text-slate-400">Đ/N: {(inv.electricityWaterVND / 1000000).toFixed(1)} Tr</div>
                  </td>
                  <td className="p-4 font-bold text-[#163300] dark:text-[#9FE870] text-sm whitespace-nowrap tabular-nums">
                    {(inv.totalAmountVND / 1000000).toFixed(1)} Triệu
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {getStatusBadge(inv.status)}
                    {inv.paidDate && (
                      <div className="text-[10px] text-slate-400 mt-1 tabular-nums">Đã thu: {inv.paidDate}</div>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    {inv.status !== 'paid' ? (
                      <button
                        onClick={() => onMarkInvoicePaid(inv.id)}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Thu Tiền</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#20A05A] font-bold whitespace-nowrap flex items-center justify-end gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Hoàn tất</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
