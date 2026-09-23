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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold whitespace-nowrap shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Đã thanh toán</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold whitespace-nowrap shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Chờ thanh toán</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold whitespace-nowrap shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>Quá hạn nợ</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Rotating Border Beam */}
      <div className="relative rounded-3xl p-[2.5px] overflow-hidden shadow-2xl group transition-all">
        <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 w-full h-full rounded-[22px] atmospheric-panel haven-sheen-sweep p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-2xl">
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

          {/* 3 Cashflow Highlights with Dual Rotating Beams */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-800/80">
            {/* Card 1: Đã thu */}
            <div className="group/card relative rounded-2xl p-[2px] overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="animate-spin-beam pointer-events-none opacity-60 group-hover/card:opacity-100 transition-opacity" />
              <div className="relative z-10 w-full h-full p-5 rounded-[14px] atmospheric-panel bg-slate-950/80 border border-emerald-500/30 group-hover/card:border-emerald-500/60 space-y-2 group-hover/card:shadow-[0_8px_30px_rgba(16,185,129,0.25)] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">ĐÃ THU (THÁNG HIỆN TẠI)</span>
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
                    <Wallet className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-2xl lg:text-3xl font-serif font-bold text-emerald-400 group-hover/card:text-emerald-300 group-hover/card:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all font-mono">
                  {(totalCollectedVND / 1000000).toFixed(0)} Triệu VNĐ
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{invoices.filter(i => i.status === 'paid').length} hóa đơn đã hoàn tất thu</span>
                </div>
              </div>
            </div>

            {/* Card 2: Chờ thu */}
            <div className="group/card relative rounded-2xl p-[2px] overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="animate-spin-beam pointer-events-none opacity-50 group-hover/card:opacity-100 transition-opacity" />
              <div className="relative z-10 w-full h-full p-5 rounded-[14px] atmospheric-panel bg-slate-950/80 border border-amber-500/30 group-hover/card:border-amber-500/60 space-y-2 group-hover/card:shadow-[0_8px_30px_rgba(245,158,11,0.25)] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">CHỜ THU TRONG KỲ</span>
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-2xl lg:text-3xl font-serif font-bold text-amber-400 group-hover/card:text-amber-300 group-hover/card:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] transition-all font-mono">
                  {(pendingRevenueVND / 1000000).toFixed(0)} Triệu VNĐ
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{invoices.filter(i => i.status === 'pending').length} căn hộ đến hạn kỳ này</span>
                </div>
              </div>
            </div>

            {/* Card 3: Quá hạn */}
            <div className="group/card relative rounded-2xl p-[2px] overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="animate-spin-beam pointer-events-none opacity-50 group-hover/card:opacity-100 transition-opacity" />
              <div className="relative z-10 w-full h-full p-5 rounded-[14px] atmospheric-panel bg-slate-950/80 border border-rose-500/30 group-hover/card:border-rose-500/60 space-y-2 group-hover/card:shadow-[0_8px_30px_rgba(244,63,94,0.25)] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">NỢ QUÁ HẠN CẦN THU HỒI</span>
                  <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-2xl lg:text-3xl font-serif font-bold text-rose-400 group-hover/card:text-rose-300 group-hover/card:drop-shadow-[0_0_12px_rgba(244,63,94,0.8)] transition-all font-mono">
                  {(overdueRevenueVND / 1000000).toFixed(0)} Triệu VNĐ
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>{invoices.filter(i => i.status === 'overdue').length} hóa đơn quá hạn cần đôn đốc</span>
                </div>
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
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
      </div>

      {/* Invoices Ledger Table with Rotating Border Beam */}
      <div className="relative rounded-3xl p-[2px] overflow-hidden shadow-2xl group transition-all">
        <div className="animate-spin-beam pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />
        <div className="relative z-10 w-full h-full rounded-[22px] atmospheric-panel overflow-hidden border border-slate-800/80 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredInvoices.map(inv => (
                  <tr
                    key={inv.id}
                    className="group hover:bg-slate-800/80 [data-theme='light']_:hover:bg-emerald-50/70 border-l-4 border-l-transparent hover:border-l-emerald-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.18)] cursor-pointer"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 group-hover:border-emerald-400/60 group-hover:bg-emerald-950/90 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_10px_rgba(52,211,153,0.9)] font-bold text-emerald-400 font-mono transition-all shadow-sm">
                        {inv.invoiceCode}
                      </div>
                      <div className="text-slate-500 group-hover:text-slate-400 text-[10px] mt-1 transition-colors flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500 group-hover:text-emerald-400/80" />
                        <span>{inv.monthYear} • Hạn {inv.dueDate}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-serif font-bold text-slate-100 group-hover:text-emerald-200 group-hover:drop-shadow-[0_0_8px_rgba(167,243,208,0.6)] text-sm transition-all">{inv.tenantName}</div>
                    </td>
                    <td className="p-4 cursor-pointer" onClick={() => onSelectUnit(inv.unitId)}>
                      <div className="font-bold text-slate-200 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.6)] transition-all line-clamp-1">{inv.unitName}</div>
                      <div className="text-slate-500 group-hover:text-emerald-400/70 text-[10px] transition-colors">{inv.unitId}</div>
                    </td>
                    <td className="p-4 text-slate-200 group-hover:text-slate-100 whitespace-nowrap font-mono transition-colors">
                      {(inv.rentAmountVND / 1000000).toFixed(0)}Tr
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap font-mono">
                      <div>DV: {(inv.serviceFeeVND / 1000000).toFixed(1)}Tr</div>
                      <div className="text-[10px] text-slate-500">Đ/N: {(inv.electricityWaterVND / 1000000).toFixed(1)}Tr</div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.9)] text-sm whitespace-nowrap transition-all font-mono">
                      {(inv.totalAmountVND / 1000000).toFixed(1)} Triệu
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(inv.status)}
                      {inv.paidDate && (
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">Đã thu: {inv.paidDate}</div>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {inv.status !== 'paid' ? (
                        <button
                          onClick={() => onMarkInvoicePaid(inv.id)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 group-hover:bg-emerald-500 text-emerald-300 group-hover:text-slate-950 border border-emerald-500/40 group-hover:border-emerald-400 text-[11px] font-mono transition-all font-semibold whitespace-nowrap shadow-sm group-hover:shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Thu Tiền</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-mono whitespace-nowrap flex items-center justify-end gap-1">
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
    </div>
  );
};
