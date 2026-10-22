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
  RefreshCw,
  Sparkles,
  Bot
} from 'lucide-react';
import type { MarketplaceModerationItem } from '../types/apartment';
import { ApartmentStore } from '../data/apartmentStore';
import { 
  runAutonomousModerationSweep,
  type ModerationSweepResult 
} from '../services/aiAdminOperationsService';
import { useAiCommand } from '../services/aiCommandBus';

interface MarketplaceHealthViewProps {
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const MarketplaceHealthView: React.FC<MarketplaceHealthViewProps> = ({
  onShowToast
}) => {
  const [kpis, setKpis] = useState(() => ApartmentStore.getMarketplaceHealthKPIs());
  const [moderationQueue, setModerationQueue] = useState<MarketplaceModerationItem[]>(() => ApartmentStore.getModerationQueue());
  const [selectedQueueStatus, setSelectedQueueStatus] = useState<string>('all');

  // AI Autonomous Governance Sweep State
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [sweepResult, setSweepResult] = useState<ModerationSweepResult | null>(null);

  // Listen to Global AI Command Bus
  useAiCommand((cmd) => {
    if (cmd.type === 'moderate_marketplace') {
      handleRunAiSweep();
    }
  });

  const filteredQueue = moderationQueue.filter(item => 
    selectedQueueStatus === 'all' || item.status === selectedQueueStatus
  );

  const pendingCount = moderationQueue.filter(i => i.status === 'pending').length;

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

  // Autonomous 1-click Governance Sweep
  const handleRunAiSweep = () => {
    setIsSweeping(true);
    setTimeout(() => {
      const result = runAutonomousModerationSweep();
      setSweepResult(result);
      setModerationQueue(ApartmentStore.getModerationQueue());
      setKpis(ApartmentStore.getMarketplaceHealthKPIs());
      setIsSweeping(false);

      if (onShowToast) {
        onShowToast(
          'success',
          `AI Governance Sweep Hoàn Tất (${result.totalProcessed} tin)`,
          `Đã phê duyệt ${result.approvedCount} tin đạt chuẩn Verified Plus & gắn cờ cách ly ${result.flaggedCount} tin nghi vấn bẫy cọc/ảnh trùng.`
        );
      }
    }, 700);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300 text-left">
      {/* Header Banner - Wise Signature Style */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] font-bold text-xs uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Bảng Sức Khỏe Marketplace & Giám Sát Niềm Tin (Health & Governance)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-white mt-1">
              Giám Sát Kiểm Duyệt, Chống Lừa Đảo & Tỷ Lệ Hoàn Cọc
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Thuật toán đối chiếu giá thuê với phân phối median 1.700 căn hộ toàn thành phố, nhận diện ảnh trùng lặp nguồn mạng và tự động cách ly tin mồi nhử bẫy cọc.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setKpis(ApartmentStore.getMarketplaceHealthKPIs());
                setModerationQueue(ApartmentStore.getModerationQueue());
                if (onShowToast) {
                  onShowToast('info', 'Dữ liệu đã cập nhật', 'Chỉ số sức khỏe marketplace đã được làm mới.');
                }
              }}
              className="px-4 py-2.5 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto shrink-0 whitespace-nowrap shadow-sm cursor-pointer hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
              <span>Làm Mới Số Liệu</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NEW HIGH-IMPACT: AI AUTO-GOVERNANCE ACTION BAR */}
        {/* ========================================================================= */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F7FAF6] dark:bg-slate-800/60 border border-[#9FE870]/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#163300] text-[#9FE870]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#163300] dark:text-white flex items-center gap-2">
                <span>AI Tự Động Duyệt & Chặn Tin Rác/Lừa Đảo Cọc (Auto-Governance Sweep)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#163300] text-[#9FE870] text-[10px] font-mono font-bold">
                  Qwen 2.5 7B
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Hiện có <span className="font-bold text-[#FF5436] font-mono">{pendingCount}</span> tin đăng đang chờ thẩm định hồ sơ PCCC, đối soát giá median & ảnh thật.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunAiSweep}
              disabled={isSweeping || pendingCount === 0}
              className="px-6 py-3 rounded-full bg-[#163300] hover:bg-[#204900] text-[#9FE870] font-black text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isSweeping ? 'animate-spin' : ''}`} />
              <span>{isSweeping ? 'Đang Quét & Thẩm Định...' : 'AI Quét & Xử Lý Toàn Bộ Hàng Đợi'}</span>
            </button>
          </div>
        </div>

        {/* Sweep Results Notification */}
        {sweepResult && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#9FE870]" />
                <span>Báo Cáo Kiểm Duyệt Tự Động Vừa Thực Hiện:</span>
              </span>
              <span className="font-mono">
                {sweepResult.approvedCount} Đã Duyệt • {sweepResult.flaggedCount} Đã Gắn Cờ Cách Ly
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {sweepResult.auditNotes.map((note) => (
                <div 
                  key={note.id}
                  className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                    note.action === 'approved'
                      ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    note.action === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <div>
                    <span className="font-bold">{note.unitName}: </span>
                    <span className="text-[11px] opacity-90">{note.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top 4 Core Health KPIs - Wise KPI Cards with Multi-Currency Flag Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 - Forest / Lime */}
        <div className="wise-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Tin Xác Minh</span>
            <div className="p-2.5 rounded-2xl bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#163300] dark:text-[#9FE870]">
            {kpis.verifiedListingsPercent}%
          </div>
          <p className="text-xs text-slate-500">
            {kpis.totalVerifiedLandlords} chủ nhà đã xác thực CCCD & Sổ đỏ
          </p>
        </div>

        {/* KPI 2 - Cobalt Blue */}
        <div className="wise-kpi-card border-l-4 border-l-[#2570EB]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Căn Hộ Đang Đăng</span>
            <div className="p-2.5 rounded-2xl bg-[#EBF2FF] text-[#2570EB]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#2570EB] dark:text-blue-400">
            {kpis.totalActiveListings} căn
          </div>
          <p className="text-xs text-slate-500">
            Tăng trưởng: +{kpis.weeklyReportsTrendPercent}% tuần này
          </p>
        </div>

        {/* KPI 3 - Sunshine Gold */}
        <div className="wise-kpi-card border-l-4 border-l-[#FFC83B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tốc Độ Duyệt Tin AI</span>
            <div className="p-2.5 rounded-2xl bg-[#FFF8E6] text-[#9A6700]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#9A6700] dark:text-[#FFC83B]">
            {kpis.averageApprovalHours} giờ
          </div>
          <p className="text-xs text-slate-500">
            Cam kết SLA: &lt; 24 giờ cho tin đăng mới
          </p>
        </div>

        {/* KPI 4 - Royal Violet */}
        <div className="wise-kpi-card border-l-4 border-l-[#8B5CF6]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Giải Quyết Tranh Chấp</span>
            <div className="p-2.5 rounded-2xl bg-[#F5F0FF] text-[#8B5CF6]">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#8B5CF6] dark:text-purple-400">
            {kpis.depositDisputeResolutionPercent}%
          </div>
          <p className="text-xs text-slate-500">
            Bảo chứng hoàn cọc bởi HAVEN Escrow
          </p>
        </div>
      </div>

      {/* Moderation Queue Area - Wise Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <h3 className="text-xl font-bold text-[#163300] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#163300] dark:text-[#9FE870]" />
              <span>Hàng Đợi Thẩm Định & Kiểm Duyệt Tin Đăng (Moderation Queue)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Phát hiện gian lận hình ảnh AI, phát hiện giá ảo mồi nhử và đối soát an toàn PCCC.
            </p>
          </div>

          {/* Status Filter Tabs - Wise Pill Tabs */}
          <div className="wise-pill-tabs flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: `Tất cả (${moderationQueue.length})` },
              { id: 'pending', label: `Chờ duyệt (${pendingCount})` },
              { id: 'approved', label: 'Đã duyệt' },
              { id: 'flagged', label: 'Cảnh báo/Chặn' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedQueueStatus(tab.id)}
                className={`wise-pill-tab ${selectedQueueStatus === tab.id ? 'wise-pill-tab-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Moderation Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F2F5F0] dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider rounded-xl">
                <th className="py-3.5 px-4 rounded-l-xl w-60">Căn Hộ & Chủ Nhà</th>
                <th className="py-3.5 px-4">Giá Thuê Đăng</th>
                <th className="py-3.5 px-4">Điểm Ảnh Thật (AI)</th>
                <th className="py-3.5 px-4">Phân Tích Gian Lận / Giá Ảo</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 rounded-r-xl text-right">Thao Tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredQueue.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#163300] dark:text-white text-sm">
                      {item.unitName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.landlordName} ({item.landlordPhone}) • Mã: {item.id}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-sm text-[#163300] dark:text-[#9FE870]">
                    {item.monthlyRentVND ? `${(item.monthlyRentVND / 1000000).toFixed(1)} Tr/tháng` : 'Theo thỏa thuận'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                      item.autoCheckResult.photoAuthenticityScore > 80
                        ? 'bg-[#E8F8EC] text-[#163300] border border-[#9FE870]'
                        : 'bg-[#FEECEB] text-[#D92D20] border border-[#FF5436]'
                    }`}>
                      {item.autoCheckResult.photoAuthenticityScore} / 100
                    </span>
                  </td>
                  <td className="py-4 px-4 space-y-1">
                    {item.priceAnomalyPercent && item.priceAnomalyPercent < -25 ? (
                      <span className="text-[#D92D20] flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Nghi vấn bẫy cọc ({item.priceAnomalyPercent}%)
                      </span>
                    ) : (
                      <span className="text-[#163300] dark:text-[#9FE870] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Khớp median khu vực
                      </span>
                    )}

                    {item.flagReason && (
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 font-mono bg-rose-50 dark:bg-rose-950/30 p-1 rounded">
                        {item.flagReason}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {item.status === 'approved' ? (
                      <span className="px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] text-xs font-bold border border-[#9FE870] flex items-center gap-1 w-fit">
                        <Check className="w-3.5 h-3.5 text-[#163300]" />
                        <span>Đã Phê Duyệt</span>
                      </span>
                    ) : item.status === 'flagged' ? (
                      <span className="px-3 py-1 rounded-full bg-[#FEECEB] text-[#D92D20] text-xs font-bold border border-[#FF5436] flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Đã Cách Ly</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#FFF8E6] text-[#9A6700] text-xs font-bold border border-[#FFC83B] flex items-center gap-1 w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Chờ Thẩm Định</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'approved' ? (
                        <span className="text-slate-400 text-xs">Đang hiển thị</span>
                      ) : item.status === 'flagged' ? (
                        <span className="text-rose-500 text-xs font-bold">Đã ẩn khỏi sàn</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3.5 py-1.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
                            title="Duyệt xuất bản tin"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Duyệt</span>
                          </button>
                          <button
                            onClick={() => handleFlag(item.id)}
                            className="px-3.5 py-1.5 rounded-full bg-[#FF5436] hover:bg-[#E03B1F] text-white text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
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

      {/* Monetization Revenue Breakdown Section - 4 Multi-Currency Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#163300] dark:text-white flex items-center gap-2">
          <Coins className="w-5 h-5 text-[#163300] dark:text-[#9FE870]" />
          <span>Cơ Cấu 4 Dòng Doanh Thu Thương Mại HAVEN (Revenue Streams)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-1">
          {/* Stream 1 - Lime */}
          <div className="p-5 rounded-[24px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 border-t-4 border-t-[#9FE870]">
            <span className="text-slate-500 font-bold block">1. SaaS B2B Chủ Nhà (MRR)</span>
            <p className="text-[#163300] dark:text-[#9FE870] text-2xl font-bold">{kpis.revenueByStream.saasPercent}%</p>
            <span className="text-[11px] text-slate-500 block">Gói Pro (399k) / Business (999k)</span>
          </div>

          {/* Stream 2 - Cobalt */}
          <div className="p-5 rounded-[24px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 border-t-4 border-t-[#2570EB]">
            <span className="text-slate-500 font-bold block">2. Phí Ký Quỹ Bảo Chứng Escrow</span>
            <p className="text-[#2570EB] dark:text-blue-400 text-2xl font-bold">{kpis.revenueByStream.escrowPercent}%</p>
            <span className="text-[11px] text-slate-500 block">0.5% - 1% giá trị tiền cọc giữ hộ</span>
          </div>

          {/* Stream 3 - Gold */}
          <div className="p-5 rounded-[24px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 border-t-4 border-t-[#FFC83B]">
            <span className="text-slate-500 font-bold block">3. Hoa Hồng Dịch Vụ VAS</span>
            <p className="text-[#9A6700] dark:text-[#FFC83B] text-2xl font-bold">{kpis.revenueByStream.vasPercent}%</p>
            <span className="text-[11px] text-slate-500 block">Dọn dẹp, xe chuyển nhà, máy lạnh</span>
          </div>

          {/* Stream 4 - Violet */}
          <div className="p-5 rounded-[24px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 border-t-4 border-t-[#8B5CF6]">
            <span className="text-slate-500 font-bold block">4. Hoa Hồng Môi Giới Sàn</span>
            <p className="text-[#8B5CF6] dark:text-purple-400 text-2xl font-bold">{kpis.revenueByStream.commissionPercent}%</p>
            <span className="text-[11px] text-slate-500 block">Giao dịch thành công qua nền tảng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
