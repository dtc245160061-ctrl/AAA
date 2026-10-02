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
  Building
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
      {/* Header Banner - Wise Signature Style */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] font-bold text-xs uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4 text-[#20A05A]" />
              <span>Bảng Sức Khỏe Marketplace & Giám Sát Niềm Tin (Health & Governance)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-white mt-1">
              Giám Sát Kiểm Duyệt, Chống Lừa Đảo & Tỷ Lệ Hoàn Cọc
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
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
            className="px-5 py-2.5 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto shrink-0 whitespace-nowrap shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#20A05A]" />
            <span>Làm Mới Số Liệu</span>
          </button>
        </div>
      </div>

      {/* Top 4 Core Health KPIs - Wise KPI Cards with Multi-Currency Flag Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 - Forest / Lime */}
        <div className="wise-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Tin Xác Minh</span>
            <div className="p-2.5 rounded-2xl bg-[#E8F8EC] text-[#20A05A]">
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
              <ShieldCheck className="w-5 h-5 text-[#20A05A]" />
              <span>Hàng Đợi Kiểm Duyệt Tin Đăng Tự Động (AI Moderation Queue)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Phát hiện gian lận hình ảnh AI, phát hiện giá ảo và đối soát quyền sở hữu theo thời gian thực.
            </p>
          </div>

          {/* Status Filter Tabs - Wise Pill Tabs */}
          <div className="wise-pill-tabs flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'pending', label: 'Chờ duyệt' },
              { id: 'approved', label: 'Đã duyệt' },
              { id: 'flagged', label: 'Cảnh báo' }
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
                <th className="py-3.5 px-4 rounded-l-xl w-56">Căn Hộ & Chủ Nhà</th>
                <th className="py-3.5 px-4">Thời Gian Nộp</th>
                <th className="py-3.5 px-4">Điểm Ảnh Thật (AI)</th>
                <th className="py-3.5 px-4">Phát Hiện Bất Thường</th>
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
                      {item.landlordName} ({item.landlordPhone})
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{item.submittedAt}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                      item.autoCheckResult.photoAuthenticityScore > 80
                        ? 'bg-[#E8F8EC] text-[#163300] border border-[#9FE870]'
                        : 'bg-[#FEECEB] text-[#D92D20] border border-[#FF5436]'
                    }`}>
                      {item.autoCheckResult.photoAuthenticityScore} / 100
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {item.priceAnomalyPercent && item.priceAnomalyPercent < -30 ? (
                      <span className="text-[#D92D20] flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Giá ảo ({item.priceAnomalyPercent}%)
                      </span>
                    ) : (
                      <span className="text-[#20A05A] flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Hợp chuẩn thị trường
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {item.status === 'approved' ? (
                      <span className="px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] text-xs font-bold border border-[#9FE870]">
                        Đã Phê Duyệt
                      </span>
                    ) : item.status === 'flagged' ? (
                      <span className="px-3 py-1 rounded-full bg-[#FEECEB] text-[#D92D20] text-xs font-bold border border-[#FF5436]">
                        Cảnh Báo Gian Lận
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#FFF8E6] text-[#9A6700] text-xs font-bold border border-[#FFC83B]">
                        Chờ Kiểm Tra
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'approved' ? (
                        <span className="px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] text-xs font-bold border border-[#9FE870] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-[#20A05A]" />
                          <span>Đã duyệt</span>
                        </span>
                      ) : item.status === 'flagged' ? (
                        <span className="px-3 py-1 rounded-full bg-[#FEECEB] text-[#D92D20] text-xs font-bold border border-[#FF5436] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Đã chặn</span>
                        </span>
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
          <Coins className="w-5 h-5 text-[#20A05A]" />
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
