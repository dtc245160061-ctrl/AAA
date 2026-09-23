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
    <div className="space-y-8 pb-16 animate-in fade-in duration-300 text-left">
      {/* Header Banner with Rotating Border Beam */}
      <div className="relative rounded-3xl p-[2.5px] overflow-hidden shadow-2xl group transition-all">
        <div className="animate-spin-beam pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 w-full h-full rounded-[22px] atmospheric-panel haven-sheen-sweep p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Bảng Sức Khỏe Marketplace & Giám Sát Niềm Tin (Health & Governance)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold mt-1">
                Giám Sát Kiểm Duyệt, Chống Lừa Đảo & Tỷ Lệ Hoàn Cọc
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Theo dõi thời gian thực tỷ lệ tin xác minh, thuật toán phát hiện ảnh trùng/giá ảo và hiệu quả giải quyết tranh chấp bảo chứng.
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
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-emerald-500/60 text-slate-200 text-xs font-mono hover:bg-slate-800 transition-all flex items-center gap-2 self-start md:self-auto shrink-0 whitespace-nowrap shadow-md cursor-pointer hover:scale-105"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Làm Mới Số Liệu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Core Health KPIs with Dual Rotating Beams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="group relative rounded-3xl p-[2px] overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="animate-spin-beam pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 w-full h-full p-6 rounded-[22px] atmospheric-panel bg-slate-950/80 border border-emerald-500/30 group-hover:border-emerald-500/60 space-y-2 group-hover:shadow-[0_12px_35px_rgba(16,185,129,0.25)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tỷ Lệ Tin Đã Xác Minh</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-serif font-bold text-emerald-400 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all">
              {kpis.verifiedListingsPercent}%
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {kpis.totalVerifiedLandlords} chủ nhà đã xác thực CCCD & Sổ đỏ
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="group relative rounded-3xl p-[2px] overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="animate-spin-beam pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 w-full h-full p-6 rounded-[22px] atmospheric-panel bg-slate-950/80 border border-sky-500/30 group-hover:border-sky-500/60 space-y-2 group-hover:shadow-[0_12px_35px_rgba(14,165,233,0.25)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tổng Căn Hộ Đang Đăng</span>
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-serif font-bold text-sky-400 group-hover:text-sky-300 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all">
              {kpis.totalActiveListings} căn
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Tăng trưởng: +{kpis.weeklyReportsTrendPercent}% tuần này
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="group relative rounded-3xl p-[2px] overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="animate-spin-beam pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 w-full h-full p-6 rounded-[22px] atmospheric-panel bg-slate-950/80 border border-amber-500/30 group-hover:border-amber-500/60 space-y-2 group-hover:shadow-[0_12px_35px_rgba(245,158,11,0.25)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tốc Độ Duyệt Tin AI</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-serif font-bold text-amber-400 group-hover:text-amber-300 group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] transition-all">
              {kpis.averageApprovalHours} giờ
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Cam kết SLA: &lt; 24 giờ cho tin đăng mới
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="group relative rounded-3xl p-[2px] overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="animate-spin-beam pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 w-full h-full p-6 rounded-[22px] atmospheric-panel bg-slate-950/80 border border-emerald-500/30 group-hover:border-emerald-500/60 space-y-2 group-hover:shadow-[0_12px_35px_rgba(16,185,129,0.25)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tỷ Lệ Giải Quyết Tranh Chấp</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-serif font-bold text-emerald-400 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all">
              {kpis.depositDisputeResolutionPercent}%
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Bảo chứng hoàn cọc bởi HAVEN Escrow
            </p>
          </div>
        </div>
      </div>

      {/* Moderation Queue Area with Running Border Beam */}
      <div className="relative rounded-3xl p-[2px] overflow-hidden shadow-2xl group transition-all">
        <div className="animate-spin-beam pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />
        <div className="relative z-10 w-full h-full p-6 md:p-8 rounded-[22px] atmospheric-panel bg-slate-950/80 border border-slate-800 space-y-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Hàng Đợi Kiểm Duyệt Tin Đăng Tự Động (AI Moderation Queue)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Phát hiện gian lận hình ảnh AI, phát hiện giá ảo và đối soát quyền sở hữu theo thời gian thực.
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
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-800/80 [data-theme='light']_:hover:bg-emerald-50/70 border-l-4 border-l-transparent hover:border-l-emerald-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.18)] cursor-pointer"
                  >
                    <td className="py-4">
                      <div className="font-serif font-bold text-slate-100 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] text-sm transition-all">
                        {item.unitName}
                      </div>
                      <div className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
                        {item.landlordName} ({item.landlordPhone})
                      </div>
                    </td>
                    <td className="py-4 text-slate-400 group-hover:text-slate-300 transition-colors">{item.submittedAt}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                        item.autoCheckResult.photoAuthenticityScore > 80
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                          : 'bg-rose-950/90 text-rose-300 border border-rose-500/40 group-hover:shadow-[0_0_12px_rgba(244,63,94,0.4)]'
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
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Hợp chuẩn thị trường
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      {item.status === 'approved' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 shadow-sm">
                          Đã Phê Duyệt
                        </span>
                      ) : item.status === 'flagged' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-950/90 text-rose-300 text-[10px] font-bold border border-rose-500/40 shadow-sm">
                          Cảnh Báo Gian Lận
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-950/90 text-amber-300 text-[10px] font-bold border border-amber-500/40 shadow-sm">
                          Chờ Kiểm Tra
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'approved' ? (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>✓ Đã phê duyệt</span>
                          </span>
                        ) : item.status === 'flagged' ? (
                          <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold font-mono border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>⚠ Đã chặn tin</span>
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold transition-all border border-emerald-500/30 hover:border-emerald-400 flex items-center gap-1 shadow-sm hover:shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
                              title="Duyệt xuất bản tin"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Duyệt</span>
                            </button>
                            <button
                              onClick={() => handleFlag(item.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold transition-all border border-rose-500/30 hover:border-rose-400 flex items-center gap-1 shadow-sm hover:shadow-[0_0_12px_rgba(244,63,94,0.35)] cursor-pointer"
                              title="Gắn cờ cảnh báo"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Chặn</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monetization Revenue Breakdown Section with Dual Beams */}
      <div className="relative rounded-3xl p-[2px] overflow-hidden shadow-2xl group transition-all">
        <div className="animate-spin-beam pointer-events-none opacity-50 group-hover:opacity-85 transition-opacity" />
        <div className="relative z-10 w-full h-full p-6 md:p-8 rounded-[22px] atmospheric-panel bg-slate-950/80 border border-emerald-500/30 space-y-4 shadow-2xl backdrop-blur-2xl">
          <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            <span>Cơ Cấu 4 Dòng Doanh Thu Thương Mại HAVEN (Revenue Streams)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 hover:-translate-y-1 transition-all haven-beam-hover haven-beam-emerald relative overflow-hidden group/rev hover:border-emerald-500/50 hover:shadow-[0_8px_25px_rgba(16,185,129,0.2)]">
              <span className="text-slate-400">1. SaaS B2B Chủ Nhà (MRR)</span>
              <p className="text-emerald-400 font-serif text-xl font-bold group-hover/rev:text-emerald-300 group-hover/rev:drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] transition-all">{kpis.revenueByStream.saasPercent}%</p>
              <span className="text-[10px] text-slate-400">Gói Pro (399k) / Business (999k)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 hover:-translate-y-1 transition-all haven-beam-hover haven-beam-cyan relative overflow-hidden group/rev hover:border-sky-500/50 hover:shadow-[0_8px_25px_rgba(14,165,233,0.2)]">
              <span className="text-slate-400">2. Phí Ký Quỹ Bảo Chứng Escrow</span>
              <p className="text-sky-400 font-serif text-xl font-bold group-hover/rev:text-sky-300 group-hover/rev:drop-shadow-[0_0_8px_rgba(56,189,248,0.7)] transition-all">{kpis.revenueByStream.escrowPercent}%</p>
              <span className="text-[10px] text-slate-400">0.5% - 1% giá trị tiền cọc giữ hộ</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 hover:-translate-y-1 transition-all haven-beam-hover haven-beam-gold relative overflow-hidden group/rev hover:border-amber-500/50 hover:shadow-[0_8px_25px_rgba(245,158,11,0.2)]">
              <span className="text-slate-400">3. Hoa Hồng Dịch Vụ VAS</span>
              <p className="text-amber-400 font-serif text-xl font-bold group-hover/rev:text-amber-300 group-hover/rev:drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] transition-all">{kpis.revenueByStream.vasPercent}%</p>
              <span className="text-[10px] text-slate-400">Dọn dẹp, xe chuyển nhà, máy lạnh</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 hover:-translate-y-1 transition-all haven-beam-hover haven-beam-white relative overflow-hidden group/rev hover:border-purple-500/50 hover:shadow-[0_8px_25px_rgba(168,85,247,0.2)]">
              <span className="text-slate-400">4. Hoa Hồng Môi Giới Sàn</span>
              <p className="text-purple-400 font-serif text-xl font-bold group-hover/rev:text-purple-300 group-hover/rev:drop-shadow-[0_0_8px_rgba(192,132,252,0.7)] transition-all">{kpis.revenueByStream.commissionPercent}%</p>
              <span className="text-[10px] text-slate-400">Giao dịch thành công qua nền tảng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
