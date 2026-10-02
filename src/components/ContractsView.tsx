import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Phone, 
  Search,
  Download,
  X,
  PenTool
} from 'lucide-react';
import type { LeaseContract, ContractStatus, ApartmentUnit } from '../types/apartment';
import { SignContractModal } from './SignContractModal';

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
  };

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
              Hợp Đồng Cho Thuê & Pháp Lý
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quản lý danh sách hợp đồng cho thuê căn hộ, điều khoản tiền cọc, kỳ thanh toán và cảnh báo gia hạn.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs transition-all shadow-sm shrink-0 self-start md:self-auto hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập Hợp Đồng Mới</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="wise-pill-tabs overflow-x-auto max-w-full">
            {[
              { id: 'all', label: `Tất cả (${contracts.length})` },
              { id: 'active', label: 'Đang hiệu lực' },
              { id: 'expiring_soon', label: 'Sắp hết hạn' },
              { id: 'terminated', label: 'Đã thanh lý' },
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
                    <span className="font-mono font-bold text-[#163300] dark:text-[#9FE870] px-3 py-1 rounded-full bg-[#9FE870]/20 dark:bg-slate-800 border border-[#9FE870]/30 inline-block shadow-xs">
                      {contract.contractNumber}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-[#163300] dark:text-slate-100 text-sm">
                      {contract.tenantName}
                    </div>
                    <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#2570EB]" />
                      <span>{contract.tenantPhone}</span>
                    </div>
                  </td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectUnit(contract.unitId)}>
                    <div className="font-bold text-[#163300] dark:text-slate-200 line-clamp-1 hover:text-[#2570EB]">
                      {contract.unitName}
                    </div>
                    <div className="text-slate-400 font-mono text-[10px]">
                      {contract.unitId}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap font-mono">
                    <div className="font-bold text-[#163300] dark:text-[#9FE870]">
                      {(contract.monthlyRentVND / 1000000).toFixed(0)} Tr/tháng
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Cọc: {(contract.depositVND / 1000000).toFixed(0)} Tr
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <div>{contract.startDate} → {contract.endDate}</div>
                    <div className="text-[10px] text-slate-400">Chu kỳ: {contract.paymentCycleMonths} tháng/lần</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">{getStatusBadge(contract.status)}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSigningContract(contract)}
                        className="px-3.5 py-1.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                        title="Vẽ chữ ký điện tử trên màn hình"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Ký Số E-Sign</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onShowToast) {
                            onShowToast('info', 'Đang tải hợp đồng điện tử', `Hợp đồng mã ${contract.contractNumber} kèm chữ ký số SHA-256.`);
                          }
                        }}
                        className="p-2 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Xem & Tải Hợp Đồng"
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

      {/* New Contract Modal - Wise Clean Surface */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-2xl w-full rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#163300] dark:text-slate-100">Lập Hợp Đồng Thuê Căn Hộ Mới</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Xác lập thỏa thuận thuê nhà và bảo chứng ký số điện tử HAVEN</p>
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Họ và Tên Khách Thuê *</label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Số Điện Thoại *</label>
                  <input
                    type="text"
                    required
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Căn Hộ Cho Thuê *</label>
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
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans cursor-pointer"
                  >
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.id} - {unit.name || unit.district} ({(unit.monthlyRentVND / 1000000).toFixed(0)} Tr/tháng)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Số CCCD / Hộ Chiếu *</label>
                  <input
                    type="text"
                    value={tenantIdCard}
                    onChange={(e) => setTenantIdCard(e.target.value)}
                    placeholder="001099012345"
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Giá Thuê Hàng Tháng (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={monthlyRentVND}
                    onChange={(e) => setMonthlyRentVND(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Tiền Đặt Cọc (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={depositVND}
                    onChange={(e) => setDepositVND(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Ngày Bắt Đầu *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Ngày Hết Hạn *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Chu Kỳ Thu Tiền</label>
                  <select
                    value={paymentCycleMonths}
                    onChange={(e) => setPaymentCycleMonths(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans cursor-pointer"
                  >
                    <option value={1}>1 tháng / lần</option>
                    <option value={3}>3 tháng / lần</option>
                    <option value={6}>6 tháng / lần</option>
                    <option value={12}>1 năm / lần</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Tóm Tắt Điều Khoản & Ghi Chú</label>
                <textarea
                  rows={2}
                  value={termsSummary}
                  onChange={(e) => setTermsSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[16px] bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9FE870] font-sans"
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
