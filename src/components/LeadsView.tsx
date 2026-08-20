import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building, 
  FileText, 
  Sparkles,
  Check,
  ArrowRight
} from 'lucide-react';
import type { RentalLead, LeadStatus } from '../types/apartment';

interface LeadsViewProps {
  leads: RentalLead[];
  onUpdateLeadStatus: (id: string, status: LeadStatus) => void;
  onCreateContractFromLead: (lead: RentalLead) => void;
  onSelectUnit: (unitId: string) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onUpdateLeadStatus,
  onCreateContractFromLead,
  onSelectUnit,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'table'>('pipeline');

  const filteredLeads = leads.filter(l => {
    if (selectedFilter === 'all') return true;
    return l.status === selectedFilter;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-medium">Yêu cầu mới</span>;
      case 'viewing_scheduled':
        return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] font-mono font-medium">Đã hẹn xem nhà</span>;
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-medium">Đã duyệt hồ sơ</span>;
      case 'converted':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[11px] font-mono font-medium">Đã ký hợp đồng</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-mono font-medium">Từ chối / Hủy</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[11px] font-mono">{status}</span>;
    }
  };

  const newCount = leads.filter(l => l.status === 'new').length;
  const scheduledCount = leads.filter(l => l.status === 'viewing_scheduled').length;
  const approvedCount = leads.filter(l => l.status === 'approved').length;

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Quản Lý Yêu Cầu Thuê & Lịch Hẹn Xem Phòng (Leads Pipeline)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold">
              Khách Tiềm Năng & Lịch Hẹn Trực Tuyến
            </h1>
            <p className="text-sm text-slate-400">
              Tiếp nhận và xử lý yêu cầu đặt lịch xem phòng gửi trực tiếp từ Cổng Khách Thuê HAVEN.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-center">
              <div className="text-xl font-serif font-bold text-emerald-400">{newCount}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Yêu cầu mới</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-sky-500/30 text-center">
              <div className="text-xl font-serif font-bold text-sky-400">{scheduledCount}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Đã hẹn xem</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-center">
              <div className="text-xl font-serif font-bold text-amber-400">{approvedCount}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Chờ ký HĐ</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `Tất cả (${leads.length})` },
              { id: 'new', label: `Mới nhận (${newCount})` },
              { id: 'viewing_scheduled', label: `Đã hẹn xem (${scheduledCount})` },
              { id: 'approved', label: `Chờ ký HĐ (${approvedCount})` },
              { id: 'converted', label: 'Đã ký HĐ' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  selectedFilter === tab.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                activeTab === 'pipeline'
                  ? 'bg-slate-800 border-slate-700 text-white font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              Dạng Thẻ (Pipeline)
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                activeTab === 'table'
                  ? 'bg-slate-800 border-slate-700 text-white font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              Dạng Bảng (Table)
            </button>
          </div>
        </div>
      </div>

      {/* Leads Content List */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl atmospheric-panel border border-slate-800 space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-serif text-slate-100">Không có yêu cầu thuê nào trong mục này</h3>
          <p className="text-xs text-slate-400">Các yêu cầu mới từ khách hàng sẽ xuất hiện tự động tại đây.</p>
        </div>
      ) : activeTab === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map(lead => (
            <div
              key={lead.id}
              className="product-ui-card rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl border border-slate-800/90 hover:border-emerald-500/40 transition-all"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  {getStatusBadge(lead.status)}
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lead.createdAt}
                  </span>
                </div>

                {/* Customer Identity */}
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-100">{lead.customerName}</h3>
                  <div className="flex flex-col gap-1 mt-1.5 text-xs font-mono text-slate-400">
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-emerald-400 hover:underline">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lead.phone}</span>
                    </a>
                    {lead.email && (
                      <div className="flex items-center gap-1.5 text-slate-400 truncate">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{lead.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Target Apartment Details */}
                <div 
                  onClick={() => onSelectUnit(lead.unitId)}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/30 cursor-pointer transition-all space-y-1"
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Building className="w-3 h-3 text-emerald-400" />
                    <span>Căn Hộ Yêu Cầu Thuê</span>
                  </div>
                  <h4 className="text-xs font-serif font-bold text-slate-100 line-clamp-1">{lead.unitName}</h4>
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {(lead.unitPriceVND / 1000000).toFixed(0)}Tr/tháng
                  </div>
                </div>

                {/* Requirements / Notes */}
                <div className="space-y-1 text-xs font-sans">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dự kiến vào ở: <strong className="text-slate-200">{lead.desiredMoveInDate || 'Càng sớm càng tốt'}</strong></span>
                  </div>
                  {lead.viewingDate && (
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lịch hẹn xem: <strong className="text-amber-300">{lead.viewingDate}</strong></span>
                    </div>
                  )}
                  {lead.notes && (
                    <p className="text-slate-300 text-xs italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                      "{lead.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                {lead.status === 'new' && (
                  <>
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'viewing_scheduled')}
                      className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Hẹn Xem Nhà</span>
                    </button>
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'approved')}
                      className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-semibold transition-all"
                      title="Duyệt hồ sơ"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </>
                )}

                {lead.status === 'viewing_scheduled' && (
                  <>
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'approved')}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã Xem & Duyệt</span>
                    </button>
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, 'rejected')}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 font-mono text-xs transition-all"
                      title="Từ chối"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}

                {lead.status === 'approved' && (
                  <button
                    onClick={() => onCreateContractFromLead(lead)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Lập Hợp Đồng Thuê</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {lead.status === 'converted' && (
                  <div className="w-full py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono text-xs text-center font-medium">
                    ✓ Đã chuyển thành Hợp đồng thuê
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="atmospheric-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Khách Hàng</th>
                  <th className="p-4">Căn Hộ</th>
                  <th className="p-4">Giá Thuê</th>
                  <th className="p-4">Ngày Dự Kiến</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <div className="font-serif font-bold text-slate-100 text-sm">{lead.customerName}</div>
                      <div className="text-slate-400">{lead.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-200 line-clamp-1">{lead.unitName}</div>
                      <div className="text-slate-500">{lead.unitId}</div>
                    </td>
                    <td className="p-4 text-emerald-400 font-bold whitespace-nowrap">
                      {(lead.unitPriceVND / 1000000).toFixed(0)}Tr/tháng
                    </td>
                    <td className="p-4 text-slate-300">{lead.desiredMoveInDate}</td>
                    <td className="p-4">{getStatusBadge(lead.status)}</td>
                    <td className="p-4 text-right">
                      {lead.status === 'approved' ? (
                        <button
                          onClick={() => onCreateContractFromLead(lead)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                        >
                          Lập Hợp Đồng
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateLeadStatus(lead.id, 'approved')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          Duyệt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
