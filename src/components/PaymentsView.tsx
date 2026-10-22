import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Receipt,
  Check,
  Clock,
  Wallet,
  AlertCircle,
  Zap,
  Droplets,
  X,
  Sparkles,
  Bot,
  Send,
  Copy,
  ShieldAlert
} from 'lucide-react';
import type { RentalInvoice, InvoiceStatus } from '../types/apartment';
import { 
  calculateEvn6TierElectricity, 
  calculateWaterCost 
} from '../services/aiOcrAndFormService';
import { 
  reconcileBankTransferMessages,
  SAMPLE_BANK_SMS_BATCH,
  dispatchOverdueDebtCampaign,
  generateBillShockExplanation,
  sendBillShockExplanationToTenant,
  type ReconciledTransaction,
  type DebtEscalationNotice
} from '../services/aiAdminOperationsService';
import { useAiCommand } from '../services/aiCommandBus';

interface PaymentsViewProps {
  invoices: RentalInvoice[];
  onMarkInvoicePaid: (id: string) => void;
  onSelectUnit: (unitId: string) => void;
  onOpenQuickAction?: () => void;
  onRefreshInvoices?: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  invoices,
  onMarkInvoicePaid,
  onSelectUnit,
  onRefreshInvoices,
  onShowToast
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Auto-Reconciliation State
  const [smsInputText, setSmsInputText] = useState<string>('');
  const [isReconciling, setIsReconciling] = useState<boolean>(false);
  const [reconcileResults, setReconcileResults] = useState<ReconciledTransaction[] | null>(null);
  const [highlightedInvoiceIds, setHighlightedInvoiceIds] = useState<string[]>([]);

  // AI Overdue Debt Campaign State
  const [isCollectingDebt, setIsCollectingDebt] = useState<boolean>(false);
  const [debtNotices, setDebtNotices] = useState<DebtEscalationNotice[] | null>(null);
  const [debtSummary, setDebtSummary] = useState<{ level1: number; level2: number; level3: number; totalOverdueAmountVND: number } | null>(null);

  // Bill Shock Explainer Modal State
  const [selectedInvoiceForExplanation, setSelectedInvoiceForExplanation] = useState<RentalInvoice | null>(null);
  const [explanationData, setExplanationData] = useState<{
    explanationMarkdown: string;
    kwh: number;
    m3: number;
    evnTotalVND: number;
    waterTotalVND: number;
  } | null>(null);
  const [isSendingExplanation, setIsSendingExplanation] = useState<boolean>(false);

  // EVN 6-Tier Calculator Modal State
  const [isEvnModalOpen, setIsEvnModalOpen] = useState<boolean>(false);
  const [calcKwh, setCalcKwh] = useState<number>(235);
  const [calcM3, setCalcM3] = useState<number>(18);

  const evnTariff = useMemo(() => calculateEvn6TierElectricity(calcKwh), [calcKwh]);
  const waterTariff = useMemo(() => calculateWaterCost(calcM3), [calcM3]);

  // Listen to Global aiCommandBus for autonomous trigger
  useAiCommand((cmd) => {
    if (cmd.type === 'reconcile_payments') {
      if (!smsInputText) {
        setSmsInputText(SAMPLE_BANK_SMS_BATCH);
      }
      handleAutoReconcile(cmd.payload.rawSmsBatch || SAMPLE_BANK_SMS_BATCH);
    } else if (cmd.type === 'collect_debts') {
      handleDispatchDebtCampaign();
    }
  });

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

  // Handler: Run Bank SMS Auto-Reconciliation
  const handleAutoReconcile = async (customText?: string) => {
    const textToProcess = customText || smsInputText;
    if (!textToProcess.trim()) {
      if (onShowToast) {
        onShowToast('error', 'Chưa có nội dung tin nhắn', 'Vui lòng dán tin nhắn SMS hoặc bấm nạp tin nhắn mẫu.');
      }
      return;
    }

    setIsReconciling(true);
    try {
      const results = await reconcileBankTransferMessages(textToProcess);
      setReconcileResults(results);

      const matchedIds = results
        .filter(r => r.status === 'matched' && r.matchedInvoiceId)
        .map(r => r.matchedInvoiceId as string);

      setHighlightedInvoiceIds(matchedIds);

      // Trigger store refresh in parent
      if (onRefreshInvoices) {
        onRefreshInvoices();
      }

      if (onShowToast) {
        const matchedCount = results.filter(r => r.status === 'matched').length;
        const totalReconciled = results.reduce((acc, curr) => acc + (curr.status === 'matched' ? curr.amountVND : 0), 0);
        onShowToast(
          'success',
          `AI Khớp Lệnh & Gạch Nợ Thành Công (${matchedCount}/${results.length})`,
          `Đã tự động gạch nợ ${totalReconciled.toLocaleString('vi-VN')} đ và gửi biên lai vào Chat khách thuê.`
        );
      }
    } catch (e) {
      console.error(e);
      if (onShowToast) {
        onShowToast('error', 'Lỗi đối soát', 'Không thể hoàn tất đối soát tự động.');
      }
    } finally {
      setIsReconciling(false);
    }
  };

  // Handler: Run Overdue Debt Collection Campaign
  const handleDispatchDebtCampaign = async () => {
    setIsCollectingDebt(true);
    try {
      const campaign = await dispatchOverdueDebtCampaign(invoices);
      setDebtNotices(campaign.dispatched);
      setDebtSummary(campaign.summary);

      if (onShowToast) {
        onShowToast(
          'success',
          `Đã gửi chiến dịch nhắc nợ (${campaign.dispatched.length} căn)`,
          `Cấp 1: ${campaign.summary.level1} | Cấp 2: ${campaign.summary.level2} | Cấp 3: ${campaign.summary.level3}. Đã chuyển thẳng vào Admin Inbox!`
        );
      }
    } catch (e) {
      console.error(e);
      if (onShowToast) {
        onShowToast('error', 'Lỗi gửi nhắc nợ', 'Không thể hoàn tất gửi thông báo thu hồi nợ.');
      }
    } finally {
      setIsCollectingDebt(false);
    }
  };

  // Handler: Open Bill Shock Modal
  const handleOpenBillShockModal = (inv: RentalInvoice) => {
    setSelectedInvoiceForExplanation(inv);
    const result = generateBillShockExplanation(inv);
    setExplanationData(result);
  };

  // Handler: Send Bill Shock to Tenant Chat
  const handleSendBillShockChat = async () => {
    if (!selectedInvoiceForExplanation || !explanationData) return;

    setIsSendingExplanation(true);
    try {
      await sendBillShockExplanationToTenant(
        selectedInvoiceForExplanation,
        explanationData.explanationMarkdown
      );
      if (onShowToast) {
        onShowToast(
          'success',
          'Đã gửi bản giải trình điện nước',
          `Đã chuyển bảng phân tích bậc thang EVN cho khách ${selectedInvoiceForExplanation.tenantName} qua Hộp thư.`
        );
      }
      setSelectedInvoiceForExplanation(null);
      setExplanationData(null);
    } catch (e) {
      console.error(e);
      if (onShowToast) {
        onShowToast('error', 'Lỗi gửi tin nhắn', 'Không thể gửi giải trình vào phòng chat.');
      }
    } finally {
      setIsSendingExplanation(false);
    }
  };

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
              Thu Tiền Nhà, Đối Soát SMS & Thu Hồi Nợ
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tự động hóa đối soát biến động số dư ngân hàng, gạch nợ tức thì và kích hoạt chiến dịch thu nợ đa tầng thông minh.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEvnModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-[#163300] hover:bg-[#204900] text-[#9FE870] font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Tra Cứu Bậc Thang Điện EVN (6 Bậc)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TWO HIGH-IMPACT AI OPERATIONAL PANELS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* PANEL 1: AI BANK SMS AUTO-RECONCILIATION */}
          <div className="p-5 md:p-6 rounded-[24px] bg-[#F7FAF6] dark:bg-slate-800/60 border border-[#9FE870]/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#9FE870] text-[#163300]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#163300] dark:text-white flex items-center gap-2">
                    <span>AI Đối Soát Biến Động Số Dư Ngân Hàng</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#163300] text-[#9FE870] text-[10px] font-mono font-bold">
                      Qwen 2.5 7B
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Nhận diện SMS Vietcombank, Techcombank, MB & VietQR Napas247
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSmsInputText(SAMPLE_BANK_SMS_BATCH)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#163300] dark:text-[#9FE870] hover:border-[#9FE870] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Copy className="w-3 h-3" />
                <span>Nạp 3 SMS Mẫu</span>
              </button>
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={smsInputText}
                onChange={(e) => setSmsInputText(e.target.value)}
                placeholder="Dán nội dung tin nhắn ngân hàng hoặc webhook VietQR vào đây...&#10;VD: VCB: +18,500,000 VND lúc 10:15. ND: TRAN MINH TUAN thanh toan tien thue phong HN-TH-2401 thang 10 HD-HNTH-2401"
                className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Tự động tính 5% SaaS take-rate & gửi biên lai vào Chat
              </span>

              <button
                onClick={() => handleAutoReconcile()}
                disabled={isReconciling}
                className="px-5 py-2.5 rounded-full bg-[#163300] hover:bg-[#204900] text-[#9FE870] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isReconciling ? 'Đang Khớp Lệnh...' : 'AI Khớp Lệnh & Gạch Nợ'}</span>
              </button>
            </div>

            {/* Reconciliation Execution Result Cards */}
            {reconcileResults && reconcileResults.length > 0 && (
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <span>Kết Quả Đối Soát Gần Nhất:</span>
                  <span className="text-emerald-600 dark:text-[#9FE870] font-mono">
                    {reconcileResults.filter(r => r.status === 'matched').length}/{reconcileResults.length} Khớp Thành Công
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {reconcileResults.map((r, idx) => (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                        r.status === 'matched' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                          : r.status === 'already_paid'
                          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center gap-2">
                          <span className="text-[#163300] dark:text-white">{r.tenantName || 'Khách chưa khớp'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({r.bankName})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {r.unitName ? `${r.unitName} • Mã HĐ: ${r.invoiceCode}` : r.reason}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-[#163300] dark:text-[#9FE870]">
                          +{r.amountVND.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-[#9FE870]">
                          Độ tin cậy: {r.confidenceScore}% {r.status === 'matched' && '• Đã gạch nợ'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PANEL 2: AI MULTI-STAGE DEBT COLLECTOR */}
          <div className="p-5 md:p-6 rounded-[24px] bg-[#FFF8F6] dark:bg-slate-800/60 border border-[#FF5436]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#FF5436] text-white">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#FF5436] dark:text-rose-400 flex items-center gap-2">
                    <span>AI Thu Hồi Công Nợ Tự Động (Multi-Stage)</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FF5436]/15 text-[#FF5436] text-[10px] font-bold">
                      3 Cấp Độ
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Phân tầng nhắc nợ: Cấp 1 (Lịch sự) → Cấp 2 (Phạt 0.05%) → Cấp 3 (Khóa Smart Lock)
                  </p>
                </div>
              </div>
            </div>

            {/* Overdue Preview Indicators */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cấp 1 (1–3 ngày)</span>
                <span className="text-sm font-bold text-amber-600 font-mono">Nhắc VietQR</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cấp 2 (4–7 ngày)</span>
                <span className="text-sm font-bold text-orange-600 font-mono">Phạt 0.05%/ngày</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cấp 3 (&gt;7 ngày)</span>
                <span className="text-sm font-bold text-rose-600 font-mono">Khóa Smart Lock</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-500">
                Tổng nợ quá hạn: <span className="font-bold font-mono text-[#FF5436]">{(overdueRevenueVND / 1000000).toFixed(1)} Tr</span>
              </div>

              <button
                onClick={() => handleDispatchDebtCampaign()}
                disabled={isCollectingDebt}
                className="px-5 py-2.5 rounded-full bg-[#FF5436] hover:bg-[#E03A1E] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isCollectingDebt ? 'Đang Gửi...' : 'Quét & Gửi Nhắc Nợ Tự Động'}</span>
              </button>
            </div>

            {/* Campaign Execution Summary */}
            {debtSummary && debtNotices && (
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <span>Nhật Ký Đã Gửi Vào Admin Inbox:</span>
                  <span className="text-[#FF5436] font-mono">
                    {debtNotices.length} thông báo phát đi
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {debtNotices.map((n, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#163300] dark:text-white flex items-center gap-2">
                          <span>{n.tenantName} ({n.unitName})</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            n.level === 1 ? 'bg-amber-100 text-amber-800' :
                            n.level === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            Cấp {n.level} • {n.daysOverdue} ngày
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {n.messageText}
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <div className="font-mono font-bold text-sm text-[#FF5436]">
                          {n.amountVND.toLocaleString('vi-VN')} đ
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold block">✓ Đã chuyển Chat</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <span className="w-2 h-2 rounded-full bg-[#163300] dark:bg-[#9FE870]" />
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
              placeholder="Tìm theo tên khách, mã HĐ, căn hộ..."
              className="pl-10 pr-4 py-2 text-xs bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[#163300] dark:text-slate-200 placeholder:text-slate-400 font-sans focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table - Pure Wise Rounded-[24px] Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAF6] dark:bg-slate-800/90 text-[#163300] dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 whitespace-nowrap">Mã Hóa Đơn</th>
                <th className="p-4 whitespace-nowrap">Khách Thuê & Căn Hộ</th>
                <th className="p-4 whitespace-nowrap">Kỳ Thu & Hạn Trả</th>
                <th className="p-4 whitespace-nowrap">Tiền Nhà</th>
                <th className="p-4 whitespace-nowrap">Điện / Nước / DV</th>
                <th className="p-4 whitespace-nowrap">Tổng Số Tiền</th>
                <th className="p-4 whitespace-nowrap">Trạng Thái</th>
                <th className="p-4 text-right whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredInvoices.map(inv => {
                const isJustReconciled = highlightedInvoiceIds.includes(inv.id);
                return (
                  <tr
                    key={inv.id}
                    className={`transition-all duration-700 ${
                      isJustReconciled 
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500 animate-pulse' 
                        : 'hover:bg-[#F2F5F0]/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#163300] dark:text-slate-100">{inv.invoiceCode}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-[#163300] dark:text-white">{inv.tenantName}</div>
                      <button
                        onClick={() => onSelectUnit(inv.unitId)}
                        className="text-slate-400 hover:text-[#163300] dark:hover:text-[#9FE870] font-sans text-[11px] block text-left"
                      >
                        {inv.unitName}
                      </button>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-medium text-slate-600 dark:text-slate-300">{inv.monthYear}</div>
                      <div className="text-slate-400 text-[11px]">Hạn: {inv.dueDate}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap font-mono">
                      {(inv.rentAmountVND / 1000000).toFixed(1)} Tr
                    </td>
                    <td className="p-4 whitespace-nowrap font-mono text-slate-500">
                      {((inv.electricityWaterVND + inv.serviceFeeVND) / 1000).toLocaleString()} k
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-bold font-mono text-sm text-[#163300] dark:text-[#9FE870]">
                        {inv.totalAmountVND.toLocaleString('vi-VN')} đ
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-2">
                      {/* AI Bill Shock Explainer Button */}
                      <button
                        onClick={() => handleOpenBillShockModal(inv)}
                        title="AI Giải Trình Biến Động Tiền Điện Nước"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF8E6] hover:bg-[#FFECC0] text-[#9A6700] text-xs font-bold transition-all shadow-2xs border border-[#FFC83B]/40 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#FFC83B]" />
                        <span>AI Giải Trình</span>
                      </button>

                      {/* Manual Mark Paid Button */}
                      {inv.status !== 'paid' ? (
                        <button
                          onClick={() => onMarkInvoicePaid(inv.id)}
                          className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Thu Tiền</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8F8EC] text-[#163300] border border-[#9FE870] text-xs font-bold whitespace-nowrap shadow-2xs">
                          <Check className="w-3.5 h-3.5 text-[#163300]" />
                          <span>Hoàn tất</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: AI BILL SHOCK EXPLAINER & EVN MESSENGER MODAL */}
      {/* ========================================================================= */}
      {selectedInvoiceForExplanation && explanationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF8E6] text-[#9A6700] dark:text-[#FFC83B] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#163300] dark:text-white">
                    AI Giải Trình Biến Động Hóa Đơn Điện Nước
                  </h3>
                  <p className="text-xs text-slate-500">
                    Căn hộ: <span className="font-bold text-[#163300] dark:text-white">{selectedInvoiceForExplanation.unitName}</span> • Khách: {selectedInvoiceForExplanation.tenantName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedInvoiceForExplanation(null);
                  setExplanationData(null);
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#FFF8E6] dark:bg-amber-950/20 border border-[#FFC83B]/30">
                <span className="text-[10px] font-bold text-[#9A6700] uppercase block">Điện Tiêu Thụ</span>
                <span className="text-xl font-bold font-mono text-[#9A6700] dark:text-[#FFC83B]">
                  {explanationData.kwh} kWh
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  EVN: {explanationData.evnTotalVND.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF2FF] dark:bg-blue-950/20 border border-[#2570EB]/30">
                <span className="text-[10px] font-bold text-[#2570EB] uppercase block">Nước Sinh Hoạt</span>
                <span className="text-xl font-bold font-mono text-[#2570EB]">
                  {explanationData.m3} m³
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Sawaco: {explanationData.waterTotalVND.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/20 border border-[#9FE870]/40">
                <span className="text-[10px] font-bold text-[#163300] dark:text-[#9FE870] uppercase block">Tổng Tiện Ích</span>
                <span className="text-xl font-bold font-mono text-[#163300] dark:text-[#9FE870]">
                  {(explanationData.evnTotalVND + explanationData.waterTotalVND).toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Đã đối soát qua IoT
                </span>
              </div>
            </div>

            {/* Message Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                Nội dung tin nhắn giải trình minh bạch sẽ gửi tới khách:
              </span>
              <div className="p-4 rounded-2xl bg-[#F8FAF7] dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
                {explanationData.explanationMarkdown}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedInvoiceForExplanation(null);
                  setExplanationData(null);
                }}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                onClick={handleSendBillShockChat}
                disabled={isSendingExplanation}
                className="px-6 py-2.5 rounded-full bg-[#163300] hover:bg-[#204900] text-[#9FE870] font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingExplanation ? 'Đang Gửi...' : 'Gửi Trực Tiếp Cho Khách Thuê (Chat)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EVN 6-TIER PROGRESSIVE CALCULATOR MODAL */}
      {/* ========================================================================= */}
      {isEvnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF8E6] text-[#9A6700] dark:text-[#FFC83B] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#163300] dark:text-white">
                    Công Cụ Tra Cứu Biểu Giá Điện EVN 6 Bậc & Nước Sạch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật mới nhất Quyết định biểu giá bán lẻ điện sinh hoạt EVN 2026
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEvnModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#163300] dark:text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#FFC83B]" /> Điện Tiêu Thụ (kWh)
                  </label>
                  <span className="text-xs text-slate-500 font-bold">kWh</span>
                </div>
                <input
                  type="number"
                  min={0}
                  value={calcKwh}
                  onChange={(e) => setCalcKwh(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-lg text-[#163300] dark:text-[#9FE870]"
                />
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {[50, 150, 250, 420].map(k => (
                    <button
                      key={k}
                      onClick={() => setCalcKwh(k)}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold hover:border-[#9FE870]"
                    >
                      {k} kWh
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#163300] dark:text-white flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-[#2570EB]" /> Nước Sinh Hoạt (m³)
                  </label>
                  <span className="text-xs text-slate-500 font-bold">m³</span>
                </div>
                <input
                  type="number"
                  min={0}
                  value={calcM3}
                  onChange={(e) => setCalcM3(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-lg text-[#2570EB]"
                />
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {[10, 18, 25, 35].map(m => (
                    <button
                      key={m}
                      onClick={() => setCalcM3(m)}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold hover:border-[#2570EB]"
                    >
                      {m} m³
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#FFF8E6] dark:bg-amber-950/20 border border-[#FFC83B]/30">
                <span className="text-[10px] font-bold text-[#9A6700] uppercase block">Tiền Điện (EVN 6 Bậc)</span>
                <span className="text-xl font-bold font-mono text-[#9A6700] dark:text-[#FFC83B]">
                  {evnTariff.totalVND.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  (VAT 8%: {evnTariff.vatVND.toLocaleString()} đ)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF2FF] dark:bg-blue-950/20 border border-[#2570EB]/30">
                <span className="text-[10px] font-bold text-[#2570EB] uppercase block">Tiền Nước Sinh Hoạt</span>
                <span className="text-xl font-bold font-mono text-[#2570EB]">
                  {waterTariff.costVND.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  ({waterTariff.ratePerM3.toLocaleString()} đ/m³)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/20 border border-[#9FE870]/40">
                <span className="text-[10px] font-bold text-[#163300] dark:text-[#9FE870] uppercase block">Tổng Điện + Nước</span>
                <span className="text-xl font-bold font-mono text-[#163300] dark:text-[#9FE870]">
                  {(evnTariff.totalVND + waterTariff.costVND).toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Đơn giá TB: {calcKwh > 0 ? (evnTariff.totalVND / calcKwh).toFixed(0) : 0} đ/kWh
                </span>
              </div>
            </div>

            {/* 6-Tier EVN Breakdown Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                Chi tiết phân bổ bậc thang EVN:
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2F5F0] dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Bậc</th>
                      <th className="p-2.5">Khoảng kWh</th>
                      <th className="p-2.5">Đơn giá (đ)</th>
                      <th className="p-2.5 text-center">Tiêu thụ (kWh)</th>
                      <th className="p-2.5 text-right">Thành tiền (đ)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {evnTariff.tiers.map((t) => (
                      <tr 
                        key={t.tier}
                        className={t.kwh > 0 ? 'font-medium bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-slate-400'}
                      >
                        <td className="p-2.5 font-bold">Bậc {t.tier}</td>
                        <td className="p-2.5">{t.label}</td>
                        <td className="p-2.5 font-mono">{t.rate.toLocaleString()}</td>
                        <td className="p-2.5 font-mono text-center">{t.kwh}</td>
                        <td className="p-2.5 font-mono text-right font-bold">{t.costVND.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsEvnModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#163300] text-[#9FE870] font-bold text-xs hover:bg-[#204900] transition-colors cursor-pointer"
              >
                Đóng Bảng Tra Cứu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
