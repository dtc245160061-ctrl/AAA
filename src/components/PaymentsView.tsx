import React, { useState } from 'react';
import { 
  Search, 
  Receipt,
  Check
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
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-medium">Đã thanh toán</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-medium">Chờ thanh toán</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-mono font-medium">Quá hạn nợ</span>;
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Sổ Quỹ Thu Tiền Thuê Nhà & Hóa Đơn Dịch Vụ (Rent Ledger)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold">
              Thu Tiền Nhà & Hóa Đơn
            </h1>
            <p className="text-sm text-slate-400">
              Kiểm soát dòng tiền thực thu hàng tháng, tiền điện nước dịch vụ và đôn đốc thanh toán đúng hạn.
            </p>
          </div>
        </div>

        {/* 3 Cashflow Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-slate-400 text-xs font-mono">ĐÃ THU (THÁNG HIỆN TẠI)</div>
            <div className="text-2xl font-serif font-bold text-emerald-400 mt-2">
              {(totalCollectedVND / 1000000).toFixed(0)} Triệu VNĐ
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {invoices.filter(i => i.status === 'paid').length} hóa đơn đã hoàn tất
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-slate-400 text-xs font-mono">CHỜ THU TRONG KỲ</div>
            <div className="text-2xl font-serif font-bold text-amber-400 mt-2">
              {(pendingRevenueVND / 1000000).toFixed(0)} Triệu VNĐ
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {invoices.filter(i => i.status === 'pending').length} căn đến hạn
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-slate-400 text-xs font-mono">NỢ QUÁ HẠN CẦN THU HỒI</div>
            <div className="text-2xl font-serif font-bold text-rose-400 mt-2">
              {(overdueRevenueVND / 1000000).toFixed(0)} Triệu VNĐ
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {invoices.filter(i => i.status === 'overdue').length} hóa đơn quá hạn
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `Tất cả (${invoices.length})` },
              { id: 'paid', label: 'Đã thanh toán' },
              { id: 'pending', label: 'Chờ thanh toán' },
              { id: 'overdue', label: 'Quá hạn' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  statusFilter === tab.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên khách, phòng, mã HĐ..."
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="atmospheric-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Mã Thu / Kỳ Hạn</th>
                <th className="p-4">Người Thuê</th>
                <th className="p-4">Căn Hộ</th>
                <th className="p-4">Tiền Thuê</th>
                <th className="p-4">Dịch Vụ & Điện Nước</th>
                <th className="p-4">Tổng Thu</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-emerald-400">{inv.invoiceCode}</div>
                    <div className="text-slate-500 text-[10px]">{inv.monthYear} • Hạn {inv.dueDate}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-serif font-bold text-slate-100 text-sm">{inv.tenantName}</div>
                  </td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectUnit(inv.unitId)}>
                    <div className="font-bold text-slate-200 hover:text-emerald-400 transition-colors line-clamp-1">{inv.unitName}</div>
                    <div className="text-slate-500">{inv.unitId}</div>
                  </td>
                  <td className="p-4 text-slate-200">
                    {(inv.rentAmountVND / 1000000).toFixed(0)} Tr
                  </td>
                  <td className="p-4 text-slate-400">
                    <div>DV: {(inv.serviceFeeVND / 1000000).toFixed(1)} Tr</div>
                    <div className="text-[10px] text-slate-500">Đ/N: {(inv.electricityWaterVND / 1000000).toFixed(1)} Tr</div>
                  </td>
                  <td className="p-4 font-bold text-emerald-400 text-sm">
                    {(inv.totalAmountVND / 1000000).toFixed(1)} Triệu
                  </td>
                  <td className="p-4">
                    {getStatusBadge(inv.status)}
                    {inv.paidDate && (
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">Đã thu: {inv.paidDate}</div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {inv.status !== 'paid' ? (
                      <button
                        onClick={() => onMarkInvoicePaid(inv.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono transition-all font-semibold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Thu Tiền</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Hoàn tất</span>
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
