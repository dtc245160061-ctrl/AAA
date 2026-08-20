import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingDown, 
  Check, 
  X, 
  Coins, 
  RefreshCw
} from 'lucide-react';
import type { MarketplaceModerationItem } from '../types/apartment';
import { ApartmentStore } from '../data/apartmentStore';

interface MarketplaceHealthViewProps {
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const MarketplaceHealthView: React.FC<MarketplaceHealthViewProps> = ({
  onShowToast
}) => {
  const [kpis, setKpis] = useState(() => ApartmentStore.getMarketplaceHealthKPIs());
  const [moderationQueue, setModerationQueue] = useState<MarketplaceModerationItem[]>(() => ApartmentStore.getModerationQueue());
  const [selectedQueueStatus, setSelectedQueueStatus] = useState<string>('all');

  const filteredQueue = moderationQueue.filter(item => 
    selectedQueueStatus === 'all' || item.status === selectedQueueStatus
  );

  const handleApprove = (id: string) => {
    ApartmentStore.updateModerationStatus(id, 'approved');
    setModerationQueue(ApartmentStore.getModerationQueue());
    if (onShowToast) {
      onShowToast('success', 'Phê duyệt tin thành công', `Đã cấp huy hiệu Verified toàn sàn cho tin #${id}.`);
    }
  };

  const handleFlag = (id: string) => {
    ApartmentStore.updateModerationStatus(id, 'flagged');
    setModerationQueue(ApartmentStore.getModerationQueue());
    if (onShowToast) {
      onShowToast('error', 'Đã gắn cờ cảnh báo', `Đã ẩn tin #${id} khỏi danh sách tìm kiếm do rủi ro.`);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Bảng Sức Khỏe Marketplace & Giám Sát Niềm Tin (Health & Governance)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-100 font-bold mt-1">
            Giám Sát Kiểm Duyệt, Chống Lừa Đảo & Tỷ Lệ Hoàn Cọc
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Theo dõi thời gian thực tỷ lệ tin xác minh, thuật toán phát hiện ảnh trùng/giá ảo và hiệu quả giải quyết tranh chấp.
          </p>
        </div>

        <button
          onClick={() => {
            setKpis(ApartmentStore.getMarketplaceHealthKPIs());
            setModerationQueue(ApartmentStore.getModerationQueue());
            if (onShowToast) {
              onShowToast('info', 'Dữ liệu đã cập nhật', 'Chỉ số sức khỏe marketplace đã được làm mới.');
            }
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start md:self-auto shrink-0 whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Làm Mới Số Liệu</span>
        </button>
      </div>

      {/* Top 4 Core Health KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-2 shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tỷ Lệ Tin Đã Xác Minh</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-400">
            {kpis.verifiedListingsPercent}%
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {kpis.totalVerifiedLandlords} chủ nhà đã xác thực CCCD & Sổ đỏ
          </p>
        </div>

        <div className="p-6 rounded-3xl atmospheric-panel border border-sky-500/30 space-y-2 shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tổng Căn Hộ Đang Đăng</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-sky-400">
            {kpis.totalActiveListings} căn
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Tăng trưởng: +{kpis.weeklyReportsTrendPercent}% tuần này
          </p>
        </div>

        <div className="p-6 rounded-3xl atmospheric-panel border border-amber-500/30 space-y-2 shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tốc Độ Duyệt Tin AI</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-amber-400">
            {kpis.averageApprovalHours} giờ
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Cam kết SLA: &lt; 24 giờ cho tin đăng mới
          </p>
        </div>

        <div className="p-6 rounded-3xl atmospheric-panel border border-rose-500/30 space-y-2 shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tỷ Lệ Giải Quyết Tranh Chấp</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-400">
            {kpis.depositDisputeResolutionPercent}%
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Được bảo vệ bởi HAVEN Escrow
          </p>
        </div>
      </div>

      {/* Moderation Queue & AI Auto-Inspection Area */}
      <div className="p-6 md:p-8 rounded-3xl atmospheric-panel border border-slate-800 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Hàng Đợi Kiểm Duyệt Tin Đăng Tự Động (AI Moderation Queue)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Phát hiện gian lận hình ảnh AI, phát hiện giá ảo và đối soát quyền sở hữu.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'pending', label: 'Chờ duyệt' },
              { id: 'approved', label: 'Đã duyệt' },
              { id: 'flagged', label: 'Cảnh báo' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedQueueStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedQueueStatus === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Moderation Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 w-56">Căn Hộ & Chủ Nhà</th>
                <th className="pb-3">Thời Gian Nộp</th>
                <th className="pb-3">Điểm Ảnh Thật (AI)</th>
                <th className="pb-3">Phát Hiện Bất Thường</th>
                <th className="pb-3">Trạng Thái</th>
                <th className="pb-3 text-right">Thao Tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4">
                    <div className="font-serif font-bold text-slate-100 text-sm">{item.unitName}</div>
                    <div className="text-[11px] text-slate-400">{item.landlordName} ({item.landlordPhone})</div>
                  </td>
                  <td className="py-4 text-slate-400">{item.submittedAt}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                      item.autoCheckResult.photoAuthenticityScore > 80
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    }`}>
                      {item.autoCheckResult.photoAuthenticityScore} / 100
                    </span>
                  </td>
                  <td className="py-4">
                    {item.priceAnomalyPercent && item.priceAnomalyPercent < -30 ? (
                      <span className="text-rose-400 flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Giá ảo ({item.priceAnomalyPercent}%)
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Hợp chuẩn thị trường
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    {item.status === 'approved' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        Đã Phê Duyệt
                      </span>
                    ) : item.status === 'flagged' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                        Cảnh Báo Gian Lận
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        Chờ Kiểm Tra
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1"
                        title="Duyệt xuất bản tin"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Duyệt</span>
                      </button>
                      <button
                        onClick={() => handleFlag(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold transition-all border border-rose-500/30 flex items-center gap-1"
                        title="Gắn cờ cảnh báo"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Chặn</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monetization Revenue Breakdown Section (§9) */}
      <div className="p-6 md:p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-4 shadow-2xl backdrop-blur-2xl">
        <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
          <Coins className="w-5 h-5 text-emerald-400" />
          <span>Cơ Cấu 4 Dòng Doanh Thu Thương Mại HAVEN (Revenue Streams)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono pt-2">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 hover:-translate-y-1 transition-all">
            <span className="text-slate-400">1. SaaS B2B Chủ Nhà (MRR)</span>
            <p className="text-emerald-400 font-serif text-xl font-bold">{kpis.revenueByStream.saasPercent}%</p>
            <span className="text-[10px] text-slate-400">Gói Pro (399k) / Business (999k)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 hover:-translate-y-1 transition-all">
            <span className="text-slate-400">2. Phí Ký Quỹ Bảo Chứng Escrow</span>
            <p className="text-sky-400 font-serif text-xl font-bold">{kpis.revenueByStream.escrowPercent}%</p>
            <span className="text-[10px] text-slate-400">0.5% - 1% giá trị tiền cọc giữ hộ</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 hover:-translate-y-1 transition-all">
            <span className="text-slate-400">3. Hoa Hồng Dịch Vụ VAS</span>
            <p className="text-amber-400 font-serif text-xl font-bold">{kpis.revenueByStream.vasPercent}%</p>
            <span className="text-[10px] text-slate-400">Dọn dẹp, xe chuyển nhà, bảo dưỡng máy lạnh</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 hover:-translate-y-1 transition-all">
            <span className="text-slate-400">4. Hoa Hồng Môi Giới Sàn</span>
            <p className="text-purple-400 font-serif text-xl font-bold">{kpis.revenueByStream.commissionPercent}%</p>
            <span className="text-[10px] text-slate-400">Giao dịch thành công qua nền tảng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
