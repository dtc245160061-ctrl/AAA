import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Phone, 
  Search,
  Download,
  X,
  PenTool,
  Sparkles,
  Upload,
  Camera,
  CheckCircle2
} from 'lucide-react';
import type { LeaseContract, ContractStatus, ApartmentUnit } from '../types/apartment';
import { SignContractModal } from './SignContractModal';
import { 
  extractContractEntitiesFromText, 
  scanCitizenIdCccdOcr, 
  DEMO_PRESETS, 
  type CccdOcrResult 
} from '../services/aiOcrAndFormService';
import { useAiCommand } from '../services/aiCommandBus';

interface ContractsViewProps {
  contracts: LeaseContract[];
  units: ApartmentUnit[];
  onAddContract: (contract: Omit<LeaseContract, 'id' | 'createdAt'>) => void;
  onSelectUnit: (unitId: string) => void;
  onOpenAiCopilot?: () => void;
  initialLeadContractData?: Partial<LeaseContract> | null;
  onClearLeadContractData?: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  contracts,
  units,
  onAddContract,
  onSelectUnit,
  initialLeadContractData,
  onClearLeadContractData,
  onShowToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(!!initialLeadContractData);
  const [signingContract, setSigningContract] = useState<LeaseContract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form State
  const [tenantName, setTenantName] = useState(initialLeadContractData?.tenantName || '');
  const [tenantPhone, setTenantPhone] = useState(initialLeadContractData?.tenantPhone || '');
  const [tenantIdCard, setTenantIdCard] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState(initialLeadContractData?.unitId || units[0]?.id || '');
  const [monthlyRentVND, setMonthlyRentVND] = useState<number>(initialLeadContractData?.monthlyRentVND || 20000000);
  const [depositVND, setDepositVND] = useState<number>(initialLeadContractData?.monthlyRentVND ? initialLeadContractData.monthlyRentVND * 2 : 40000000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2027-08-31');
  const [paymentCycleMonths, setPaymentCycleMonths] = useState<number>(1);
  const [termsSummary, setTermsSummary] = useState('Hợp đồng thuê căn hộ 1 năm, thanh toán hàng tháng vào ngày 05, tiền đặt cọc 02 tháng tiền nhà.');

  // AI Smart Bar State
  const [aiSmartBarTab, setAiSmartBarTab] = useState<'text' | 'cccd'>('text');
  const [rawMessageInput, setRawMessageInput] = useState<string>('');
  const [isExtractingText, setIsExtractingText] = useState<boolean>(false);
  const [isScanningCccd, setIsScanningCccd] = useState<boolean>(false);
  const [cccdPreviewUrl, setCccdPreviewUrl] = useState<string | null>(null);
  const [cccdResult, setCccdResult] = useState<CccdOcrResult | null>(null);
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);

  // Listen to Global aiCommandBus for 'draft_contract'
  useAiCommand((cmd) => {
    if (cmd.type === 'draft_contract') {
      setIsModalOpen(true);
      const p = cmd.payload;
      const filled: string[] = [];

      if (p.tenantName) { setTenantName(p.tenantName); filled.push('tenantName'); }
      if (p.tenantPhone) { setTenantPhone(p.tenantPhone); filled.push('tenantPhone'); }
      if (p.tenantIdCard) { setTenantIdCard(p.tenantIdCard); filled.push('tenantIdCard'); }
      if (p.unitId && units.some(u => u.id === p.unitId)) { 
        setSelectedUnitId(p.unitId); 
        filled.push('selectedUnitId'); 
      }
      if (p.monthlyRentVND) { 
        setMonthlyRentVND(p.monthlyRentVND); 
        filled.push('monthlyRentVND'); 
      }
      if (p.depositVND) { 
        setDepositVND(p.depositVND); 
        filled.push('depositVND'); 
      } else if (p.monthlyRentVND && p.depositMonths) {
        setDepositVND(p.monthlyRentVND * p.depositMonths);
        filled.push('depositVND');
      }
      if (p.startDate) { setStartDate(p.startDate); filled.push('startDate'); }
      if (p.endDate) { setEndDate(p.endDate); filled.push('endDate'); }
      if (p.paymentCycleMonths) { setPaymentCycleMonths(p.paymentCycleMonths); filled.push('paymentCycleMonths'); }
      if (p.termsSummary) { setTermsSummary(p.termsSummary); filled.push('termsSummary'); }

      setAutoFilledFields(filled);
      setTimeout(() => setAutoFilledFields([]), 4000);

      if (onShowToast) {
        onShowToast(
          'success',
          'AI Soạn Hợp Đồng Tự Động',
          cmd.payload.summaryBadge || `Đã tự động nạp ${filled.length} trường thông tin từ trợ lý AI!`
        );
      }
    }
  });

  // Handle Natural Language Message Auto-Fill
  const handleAutoFillFromText = async (textToProcess?: string) => {
    const text = (textToProcess || rawMessageInput).trim();
    if (!text) {
      if (onShowToast) onShowToast('info', 'Chưa có nội dung', 'Vui lòng dán tin nhắn hoặc chọn tin nhắn mẫu.');
      return;
    }

    setIsExtractingText(true);
    try {
      const extracted = await extractContractEntitiesFromText(text);
      const filled: string[] = [];

      if (extracted.tenantName) {
        setTenantName(extracted.tenantName);
        filled.push('tenantName');
      }
      if (extracted.tenantPhone) {
        setTenantPhone(extracted.tenantPhone);
        filled.push('tenantPhone');
      }
      if (extracted.tenantIdCard) {
        setTenantIdCard(extracted.tenantIdCard);
        filled.push('tenantIdCard');
      }
      if (extracted.unitId && units.some(u => u.id === extracted.unitId)) {
        setSelectedUnitId(extracted.unitId);
        filled.push('selectedUnitId');
      }
      if (extracted.monthlyRentVND) {
        setMonthlyRentVND(extracted.monthlyRentVND);
        filled.push('monthlyRentVND');
      }
      if (extracted.depositVND) {
        setDepositVND(extracted.depositVND);
        filled.push('depositVND');
      }
      if (extracted.startDate) {
        setStartDate(extracted.startDate);
        filled.push('startDate');
      }
      if (extracted.endDate) {
        setEndDate(extracted.endDate);
        filled.push('endDate');
      }
      if (extracted.paymentCycleMonths) {
        setPaymentCycleMonths(extracted.paymentCycleMonths);
        filled.push('paymentCycleMonths');
      }
      if (extracted.termsSummary) {
        setTermsSummary(extracted.termsSummary);
        filled.push('termsSummary');
      }

      setAutoFilledFields(filled);
      setTimeout(() => setAutoFilledFields([]), 4500);

      if (onShowToast) {
        onShowToast(
          'success',
          'AI NER Tự Điền Thành Công',
          `Đã trích xuất & điền tự động ${filled.length} trường thông tin hợp đồng!`
        );
      }
    } catch {
      if (onShowToast) onShowToast('error', 'Lỗi trích xuất', 'Không thể phân tích tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsExtractingText(false);
    }
  };

  // Handle CCCD OCR Scan
  const handleScanCccd = async (source: File | string) => {
    setIsScanningCccd(true);
    try {
      const res = await scanCitizenIdCccdOcr(source);
      setCccdResult(res);
      const filled: string[] = [];

      if (res.fullName) {
        setTenantName(res.fullName);
        filled.push('tenantName');
      }
      if (res.idCardNumber) {
        setTenantIdCard(res.idCardNumber);
        filled.push('tenantIdCard');
      }

      setAutoFilledFields(filled);
      setTimeout(() => setAutoFilledFields([]), 4500);

      if (onShowToast) {
        onShowToast(
          'success',
          `AI OCR CCCD Thành Công (${res.confidenceScore.toFixed(1)}%)`,
          `Họ tên: ${res.fullName} • CCCD: ${res.idCardNumber}`
        );
      }
    } catch {
      if (onShowToast) onShowToast('error', 'Lỗi quét CCCD', 'Vui lòng thử lại với ảnh rõ nét hơn.');
    } finally {
      setIsScanningCccd(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find(u => u.id === selectedUnitId);
    onAddContract({
      contractNumber: `HDT-${new Date().getFullYear()}/${selectedUnitId}`,
      unitId: selectedUnitId,
      unitName: targetUnit?.name || selectedUnitId,
      tenantName,
      tenantPhone,
      tenantIdCard: tenantIdCard || '001099001234',
      startDate,
      endDate,
      monthlyRentVND: Number(monthlyRentVND),
      depositVND: Number(depositVND),
      paymentCycleMonths: Number(paymentCycleMonths),
      status: 'active',
      termsSummary
    });
    setIsModalOpen(false);
    onClearLeadContractData?.();
    if (onShowToast) {
      onShowToast('success', 'Tạo hợp đồng thành công', `Hợp đồng cho khách ${tenantName} đã được lưu vào hệ thống.`);
    }
  };

  const activeCount = contracts.filter(c => c.status === 'active').length;
  const expiringCount = contracts.filter(c => c.status === 'expiring_soon').length;
  const terminatedCount = contracts.filter(c => c.status === 'terminated').length;

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 rounded-full bg-[#9FE870] text-[#163300] text-[11px] font-bold shadow-xs">Đang hiệu lực</span>;
      case 'expiring_soon':
        return <span className="px-3 py-1 rounded-full bg-[#FFC83B] text-[#7A5200] text-[11px] font-bold shadow-xs">Sắp hết hạn (30 ngày)</span>;
      case 'pending_signature':
        return <span className="px-3 py-1 rounded-full bg-[#2570EB] text-white text-[11px] font-bold shadow-xs">Chờ ký kết</span>;
      case 'terminated':
        return <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold">Đã thanh lý</span>;
    }
  };

  // Helper function for pulse styling on auto-filled inputs
  const getFieldPulseStyle = (fieldName: string) => {
    if (autoFilledFields.includes(fieldName)) {
      return 'ring-2 ring-[#9FE870] bg-[#E8F8EC] dark:bg-emerald-950/40 border-[#9FE870] transition-all duration-500 scale-[1.01]';
    }
    return 'bg-[#F2F5F0] dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner - Pure Wise Clean Surface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#163300]/70 dark:text-[#9FE870] uppercase tracking-wider">
              <FileText className="w-4 h-4 text-[#2570EB]" />
              <span>Quản Lý Hợp Đồng Cho Thuê Căn Hộ (Lease Management)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-slate-100 tracking-tight">
              Hợp Đồng Cho Thuê & Smart Auto-Fill
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quản lý danh sách hợp đồng cho thuê căn hộ, tự động điền form từ tin nhắn Zalo/CCCD OCR và bảo chứng E-Sign.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all shadow-sm shrink-0 self-start md:self-auto hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập Hợp Đồng Mới (AI Auto-Fill)</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="wise-pill-tabs overflow-x-auto max-w-full">
            {[
              { id: 'all', label: `Tất cả (${contracts.length})` },
              { id: 'active', label: `Đang hiệu lực (${activeCount})` },
              { id: 'expiring_soon', label: `Sắp hết hạn (${expiringCount})` },
              { id: 'terminated', label: `Đã thanh lý (${terminatedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`wise-pill-tab rounded-full cursor-pointer ${
                  statusFilter === tab.id ? 'wise-pill-tab-active font-bold' : ''
                }`}
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
              placeholder="Tìm theo tên khách, mã HĐ..."
              className="pl-10 pr-4 py-2 text-xs bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[#163300] dark:text-slate-200 placeholder:text-slate-400 font-sans focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
            />
          </div>
        </div>
      </div>

      {/* Contracts Table - Pure Wise Rounded-[24px] Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAF6] dark:bg-slate-800/90 text-[#163300] dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 whitespace-nowrap">Mã Hợp Đồng</th>
                <th className="p-4 whitespace-nowrap">Người Thuê</th>
                <th className="p-4 whitespace-nowrap">Căn Hộ</th>
                <th className="p-4 whitespace-nowrap">Giá Thuê & Tiền Cọc</th>
                <th className="p-4 whitespace-nowrap">Thời Hạn Thuê</th>
                <th className="p-4 whitespace-nowrap">Trạng Thái</th>
                <th className="p-4 text-right whitespace-nowrap">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredContracts.map(contract => (
                <tr
                  key={contract.id}
                  className="hover:bg-[#F2F5F0]/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-[#163300] dark:text-slate-100">{contract.contractNumber}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-[#163300] dark:text-white">{contract.tenantName}</div>
                    <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {contract.tenantPhone}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => onSelectUnit(contract.unitId)}
                      className="font-bold text-[#163300] dark:text-[#9FE870] hover:underline cursor-pointer"
                    >
                      {contract.unitName}
                    </button>
                    <div className="text-slate-400 font-mono text-[10px]">{contract.unitId}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold font-mono text-[#163300] dark:text-slate-100">
                      {(contract.monthlyRentVND / 1000000).toFixed(1)} Tr/tháng
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      Cọc: {(contract.depositVND / 1000000).toFixed(0)} Tr
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-medium text-slate-600 dark:text-slate-300">{contract.startDate}</div>
                    <div className="text-slate-400 text-[11px]">đến {contract.endDate}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSigningContract(contract)}
                        className="p-2 rounded-full text-slate-400 hover:text-[#163300] dark:hover:text-white hover:bg-[#F2F5F0] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Ký số E-Signature"
                      >
                        <PenTool className="w-4 h-4 text-[#2570EB]" />
                      </button>
                      <button
                        onClick={() => {
                          if (onShowToast) {
                            onShowToast('info', 'Tải hợp đồng PDF', `Đang kết xuất bản PDF có chữ ký số cho HĐ ${contract.contractNumber}...`);
                          }
                        }}
                        className="p-2 rounded-full text-slate-400 hover:text-[#163300] dark:hover:text-white hover:bg-[#F2F5F0] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Tải PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW CONTRACT MODAL WITH AI SMART AUTO-FILL BAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#163300] dark:text-slate-100">
                  Lập Hợp Đồng Thuê Căn Hộ Mới
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Xác lập thỏa thuận thuê nhà và bảo chứng ký số điện tử HAVEN
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  onClearLeadContractData?.();
                }}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-[#F2F5F0] dark:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI SMART AUTO-FILL BAR (Zalo / Text & CCCD OCR) */}
            <div className="bg-gradient-to-r from-[#F7FAF6] via-white to-[#F2F5F0] dark:from-slate-900 dark:via-slate-800/60 dark:to-slate-900 rounded-[24px] border-2 border-[#9FE870]/70 dark:border-[#9FE870]/40 p-5 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#9FE870] text-[#163300] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[#163300] dark:text-white text-xs sm:text-sm">
                    AI Điền Hợp Đồng Tự Động (Dán tin nhắn Zalo / Quét ảnh CCCD)
                  </span>
                </div>

                {/* Mode Switcher Tabs */}
                <div className="flex gap-1.5 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setAiSmartBarTab('text')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      aiSmartBarTab === 'text'
                        ? 'bg-[#163300] text-[#9FE870] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    Dán Tin Nhắn / Text (NER)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAiSmartBarTab('cccd');
                      setCccdPreviewUrl(DEMO_PRESETS.cccdSvg);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      aiSmartBarTab === 'cccd'
                        ? 'bg-[#163300] text-[#9FE870] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    Quét CCCD (OCR)
                  </button>
                </div>
              </div>

              {/* TAB 1: PASTE ZALO MESSAGE / NATURAL TEXT */}
              {aiSmartBarTab === 'text' && (
                <div className="space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <textarea
                      rows={2}
                      value={rawMessageInput}
                      onChange={(e) => setRawMessageInput(e.target.value)}
                      placeholder="Dán tin nhắn Zalo hoặc ghi chú: 'Khách Nguyễn Hoàng Nam, sđt 0988123456, CCCD 001206012345 chốt thuê căn HN-TH-2401 giá 16.5 triệu từ ngày 01/11/2026, đóng 3 tháng cọc 1 tháng'..."
                      className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans text-xs leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => handleAutoFillFromText()}
                      disabled={isExtractingText}
                      className="px-5 py-2.5 rounded-2xl bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isExtractingText ? 'Đang phân tích...' : 'AI Tự Điền Form'}</span>
                    </button>
                  </div>

                  {/* Sample Zalo Message Chips for 1-Click Classroom Demo */}
                  <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
                    <span className="text-slate-500 font-bold">Tin nhắn mẫu demo:</span>
                    {[
                      {
                        label: 'Mẫu 1: Nam (HN-TH-2401, 16.5tr, cọc 1th)',
                        text: 'Khách Nguyễn Hoàng Nam, sđt 0988123456, CCCD 001206012345 chốt thuê căn HN-TH-2401 giá 16.5 triệu từ ngày 01/11/2026, đóng 3 tháng cọc 1 tháng'
                      },
                      {
                        label: 'Mẫu 2: Mai Anh (HN-CG-1402, 14tr, cọc 2th)',
                        text: 'Chốt cọc chị Lê Mai Anh 0904556677 cccd 038195009876 thuê căn HN-CG-1402 giá 14tr cọc 2 tháng từ 15/11/2026'
                      },
                      {
                        label: 'Mẫu 3: Quốc Bảo (HCM-Q7-1802, 18tr)',
                        text: 'Anh Trần Quốc Bảo 0918776655 CCCD 079092001122 cọc căn HCM-Q7-1802 giá 18 triệu từ 01/12/2026'
                      }
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setRawMessageInput(sample.text);
                          handleAutoFillFromText(sample.text);
                        }}
                        className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#9FE870] text-[#163300] dark:text-slate-200 font-medium transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                      >
                        ⚡ {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: CITIZEN ID CCCD SCANNER */}
              {aiSmartBarTab === 'cccd' && (
                <div className="space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    {/* Preview box */}
                    <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
                      {cccdPreviewUrl ? (
                        <img src={cccdPreviewUrl} alt="CCCD Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-8 h-8 text-slate-500" />
                      )}

                      {isScanningCccd && (
                        <div className="absolute inset-0 bg-[#9FE870]/10 flex items-center justify-center pointer-events-none">
                          <span className="px-3 py-1 rounded-full bg-black/80 text-[#9FE870] font-mono text-[10px] font-bold animate-pulse">
                            OCR CCCD...
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <p className="text-slate-600 dark:text-slate-300">
                        Chụp ảnh mặt trước Căn cước công dân gắn chip để trích xuất 12 số CCCD, Họ tên, Ngày sinh.
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setCccdPreviewUrl(DEMO_PRESETS.cccdSvg);
                            handleScanCccd(DEMO_PRESETS.cccdSvg);
                          }}
                          disabled={isScanningCccd}
                          className="px-4 py-2 rounded-full bg-[#163300] hover:bg-[#204900] text-[#9FE870] font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Dùng Ảnh Mẫu Demo CCCD (Nguyễn Hoàng Nam)</span>
                        </button>

                        <label className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer hover:bg-slate-100">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Tải ảnh CCCD từ máy</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setCccdPreviewUrl(url);
                                handleScanCccd(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {cccdResult && (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#E8F8EC] dark:bg-emerald-950/40 border border-[#9FE870] text-[#163300] dark:text-[#9FE870] text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã nhận diện: {cccdResult.fullName} • CCCD: {cccdResult.idCardNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Họ và Tên Khách Thuê *
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans ${getFieldPulseStyle('tenantName')}`}
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans ${getFieldPulseStyle('tenantPhone')}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Căn Hộ Cho Thuê *
                  </label>
                  <select
                    value={selectedUnitId}
                    onChange={(e) => {
                      setSelectedUnitId(e.target.value);
                      const u = units.find(unit => unit.id === e.target.value);
                      if (u) {
                        setMonthlyRentVND(u.monthlyRentVND);
                        setDepositVND(u.monthlyRentVND * 2);
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans cursor-pointer ${getFieldPulseStyle('selectedUnitId')}`}
                  >
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.id} - {unit.name || unit.district} ({(unit.monthlyRentVND / 1000000).toFixed(0)} Tr/tháng)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Số CCCD / Hộ Chiếu (12 chữ số) *
                  </label>
                  <input
                    type="text"
                    value={tenantIdCard}
                    onChange={(e) => setTenantIdCard(e.target.value)}
                    placeholder="001099012345"
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-mono ${getFieldPulseStyle('tenantIdCard')}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Giá Thuê Hàng Tháng (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    value={monthlyRentVND}
                    onChange={(e) => setMonthlyRentVND(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-mono ${getFieldPulseStyle('monthlyRentVND')}`}
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Tiền Đặt Cọc (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    value={depositVND}
                    onChange={(e) => setDepositVND(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-mono ${getFieldPulseStyle('depositVND')}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Ngày Bắt Đầu *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans ${getFieldPulseStyle('startDate')}`}
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Ngày Hết Hạn *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans ${getFieldPulseStyle('endDate')}`}
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                    Chu Kỳ Thu Tiền
                  </label>
                  <select
                    value={paymentCycleMonths}
                    onChange={(e) => setPaymentCycleMonths(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-full border text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans cursor-pointer ${getFieldPulseStyle('paymentCycleMonths')}`}
                  >
                    <option value={1}>1 tháng / lần</option>
                    <option value={3}>3 tháng / lần</option>
                    <option value={6}>6 tháng / lần</option>
                    <option value={12}>1 năm / lần</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">
                  Tóm Tắt Điều Khoản & Ghi Chú
                </label>
                <textarea
                  rows={2}
                  value={termsSummary}
                  onChange={(e) => setTermsSummary(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-[16px] border text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans ${getFieldPulseStyle('termsSummary')}`}
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    onClearLeadContractData?.();
                  }}
                  className="flex-1 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  Xác Nhận Ký Hợp Đồng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive E-Signature Modal */}
      {signingContract && (
        <SignContractModal
          contract={signingContract}
          isOpen={!!signingContract}
          onClose={() => setSigningContract(null)}
          onConfirmSign={(_, hash) => {
            if (onShowToast) {
              onShowToast('success', 'Ký số hợp đồng thành công', `Hợp đồng ${signingContract.contractNumber} đã được bảo chứng băm SHA-256: ${hash.slice(0, 16)}...`);
            }
            setSigningContract(null);
          }}
        />
      )}
    </div>
  );
};
