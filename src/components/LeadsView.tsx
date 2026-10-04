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

  const filteredLeads = leads.filter(l => {
    if (selectedFilter === 'all') return true;
    return l.status === selectedFilter;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return <span className="wise-badge-coral font-bold text-xs">Yêu cầu mới</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-full bg-[#EBF2FF] dark:bg-[#0F2E6B]/40 text-[#2570EB] border border-[#2570EB]/30 font-bold text-xs">Đã liên hệ</span>;
      case 'viewing_scheduled':
        return <span className="wise-badge-cobalt font-bold text-xs">Đã hẹn xem</span>;
      case 'approved':
        return <span className="wise-badge-gold font-bold text-xs">Đã duyệt hồ sơ</span>;
      case 'converted':
        return <span className="wise-badge-lime font-bold text-xs">Đã ký hợp đồng</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-300 text-xs font-bold">Từ chối / Hủy</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{status}</span>;
    }
  };

  const newCount = leads.filter(l => l.status === 'new').length;
  const contactedCount = leads.filter(l => l.status === 'contacted').length;
  const scheduledCount = leads.filter(l => l.status === 'viewing_scheduled').length;
  const approvedCount = leads.filter(l => l.status === 'approved').length;
  const convertedCount = leads.filter(l => l.status === 'converted').length;

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#142605] border border-[#163300]/10 dark:border-[#9FE870]/20 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2F7D4] dark:bg-[#163300] border border-[#9FE870]/40 text-xs font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Quản Lý Yêu Cầu Thuê & Lịch Hẹn Xem Phòng (Leads Pipeline)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#163300] dark:text-white tracking-tight">
              Khách Tiềm Năng & Lịch Hẹn Trực Tuyến
            </h1>
            <p className="text-sm text-[#495E35] dark:text-emerald-200/80 font-medium">
              Tiếp nhận và xử lý yêu cầu đặt lịch xem phòng gửi trực tiếp từ Cổng Khách Thuê HAVEN.
            </p>
          </div>

          {/* Quick Metrics with Flag Accents */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3.5 py-2 rounded-2xl bg-[#FFEAE5] dark:bg-[#8C1F08]/30 border border-[#FF5436]/30 text-center min-w-[80px]">
              <div className="text-xl font-black text-[#8C1F08] dark:text-[#FF5436]">{newCount}</div>
              <div className="text-[10px] font-bold text-[#8C1F08] dark:text-[#FF5436] uppercase">Yêu cầu mới</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-[#F0F5FF] dark:bg-[#0F2E6B]/30 border border-[#2570EB]/30 text-center min-w-[80px]">
              <div className="text-xl font-black text-[#2570EB] dark:text-[#60A5FA]">{contactedCount}</div>
              <div className="text-[10px] font-bold text-[#2570EB] dark:text-[#60A5FA] uppercase">Đã liên hệ</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-[#EBF2FF] dark:bg-[#0F2E6B]/30 border border-[#2570EB]/30 text-center min-w-[80px]">
              <div className="text-xl font-black text-[#0F2E6B] dark:text-[#2570EB]">{scheduledCount}</div>
              <div className="text-[10px] font-bold text-[#0F2E6B] dark:text-[#2570EB] uppercase">Đã hẹn xem</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-[#FFF6DB] dark:bg-[#7A5200]/30 border border-[#FFC83B]/30 text-center min-w-[80px]">
              <div className="text-xl font-black text-[#7A5200] dark:text-[#FFC83B]">{approvedCount}</div>
              <div className="text-[10px] font-bold text-[#7A5200] dark:text-[#FFC83B] uppercase">Chờ ký HĐ</div>
            </div>
          </div>
        </div>

        {/* Filter Controls with Wise Pill Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#163300]/10 dark:border-[#9FE870]/20">
          <div className="wise-pill-tabs flex-wrap">
            {[
              { id: 'all', label: `Tất cả (${leads.length})` },
              { id: 'new', label: `Mới nhận (${newCount})` },
              { id: 'contacted', label: `Đã liên hệ (${contactedCount})` },
              { id: 'viewing_scheduled', label: `Đã hẹn xem (${scheduledCount})` },
              { id: 'approved', label: `Chờ ký HĐ (${approvedCount})` },
              { id: 'converted', label: `Đã ký HĐ (${convertedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`wise-pill-tab cursor-pointer ${
                  selectedFilter === tab.id ? 'wise-pill-tab-active font-bold' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Content List */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-xs font-sans">
          <Sparkles className="w-8 h-8 text-[#163300] dark:text-[#9FE870] mx-auto" />
          <h3 className="text-lg font-black text-[#163300] dark:text-white">Không có yêu cầu thuê nào trong mục này</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Các yêu cầu mới từ khách hàng sẽ xuất hiện tự động tại đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map(lead => (
            <div
              key={lead.id}
              className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-[#163300]/30 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                {/* Header Row: Status & Timestamp */}
                <div className="flex items-center justify-between">
                  {getStatusBadge(lead.status)}
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lead.createdAt}
                  </span>
                </div>

                {/* Customer Identity with Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#163300] text-[#9FE870] font-bold text-sm flex items-center justify-center shrink-0">
                    {lead.customerName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-[#163300] dark:text-slate-100 truncate">
                      {lead.customerName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-[#2570EB] font-bold hover:underline">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </a>
                      {lead.email && (
                        <span className="flex items-center gap-1 text-slate-400 truncate max-w-[140px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{lead.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                  {/* Target Apartment Details */}
                  <div 
                    onClick={() => onSelectUnit(lead.unitId)}
                    className="p-3.5 rounded-[16px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-[#163300]/30 dark:hover:border-[#9FE870]/40 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#163300]/60 dark:text-slate-400 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#2570EB]" />
                      <span>Căn Hộ Đăng Ký Thuê</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#163300] dark:text-slate-100 line-clamp-1">{lead.unitName}</h4>
                    <div className="text-xs font-mono font-bold text-[#163300] dark:text-[#9FE870]">
                      {(lead.unitPriceVND / 1000000).toFixed(0)} Triệu / tháng
                    </div>
                  </div>

                  {/* Requirements / Notes */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#2570EB]" />
                      <span>Dự kiến vào ở: <strong className="text-[#163300] dark:text-slate-200">{lead.desiredMoveInDate || 'Càng sớm càng tốt'}</strong></span>
                    </div>
                    {lead.viewingDate && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#7A5200] dark:text-[#FFC83B]" />
                        <span>Lịch hẹn xem: <strong className="text-[#7A5200] dark:text-[#FFC83B]">{lead.viewingDate}</strong></span>
                      </div>
                    )}
                    {lead.notes && (
                      <p className="text-slate-600 dark:text-slate-300 text-xs italic bg-[#F2F5F0]/60 dark:bg-slate-800/40 p-2.5 rounded-[12px] border border-slate-200 dark:border-slate-700/80 mt-1">
                        "{lead.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                  {lead.status === 'new' && (
                    <>
                      <button
                        onClick={() => onUpdateLeadStatus(lead.id, 'viewing_scheduled')}
                        className="flex-1 py-2 px-3 rounded-full bg-[#2570EB] hover:bg-[#1d58bc] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Hẹn Xem Nhà</span>
                      </button>
                      <button
                        onClick={() => onUpdateLeadStatus(lead.id, 'approved')}
                        className="py-2 px-3.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all cursor-pointer shadow-sm"
                        title="Duyệt hồ sơ"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {lead.status === 'contacted' && (
                    <>
                      <button
                        onClick={() => onUpdateLeadStatus(lead.id, 'viewing_scheduled')}
                        className="flex-1 py-2 px-3 rounded-full bg-[#2570EB] hover:bg-[#1d58bc] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Hẹn Xem Nhà</span>
                      </button>
                      <button
                        onClick={() => onUpdateLeadStatus(lead.id, 'approved')}
                        className="py-2 px-3.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all cursor-pointer shadow-sm"
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
                        className="flex-1 py-2 px-3 rounded-full bg-[#FFC83B] hover:bg-[#f0ba2b] text-[#7A5200] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã Xem & Duyệt</span>
                      </button>
                      <button
                        onClick={() => onUpdateLeadStatus(lead.id, 'rejected')}
                        className="py-2 px-3.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-400 font-bold text-xs transition-all cursor-pointer"
                        title="Từ chối"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {lead.status === 'approved' && (
                    <button
                      onClick={() => onCreateContractFromLead(lead)}
                      className="w-full py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Lập Hợp Đồng Thuê (Wise Escrow)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {lead.status === 'converted' && (
                    <div className="w-full py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#a78bfa] text-xs text-center font-bold">
                      ✓ Đã chuyển đổi thành Hợp Đồng Thuê
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};
