import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Phone, 
  Search,
  Download,
  X
} from 'lucide-react';
import type { LeaseContract, ContractStatus, ApartmentUnit } from '../types/apartment';

interface ContractsViewProps {
  contracts: LeaseContract[];
  units: ApartmentUnit[];
  onAddContract: (contract: Omit<LeaseContract, 'id' | 'createdAt'>) => void;
  onSelectUnit: (unitId: string) => void;
  onOpenAiCopilot?: () => void;
  initialLeadContractData?: Partial<LeaseContract> | null;
  onClearLeadContractData?: () => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  contracts,
  units,
  onAddContract,
  onSelectUnit,
  initialLeadContractData,
  onClearLeadContractData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(!!initialLeadContractData);
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
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-medium">Đang hiệu lực</span>;
      case 'expiring_soon':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-medium">Sắp hết hạn (30 ngày)</span>;
      case 'pending_signature':
        return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] font-mono font-medium">Chờ ký kết</span>;
      case 'terminated':
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-mono font-medium">Đã thanh lý</span>;
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Quản Lý Hợp Đồng Cho Thuê Căn Hộ (Lease Management)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold">
              Hợp Đồng Cho Thuê & Pháp Lý
            </h1>
            <p className="text-sm text-slate-400">
              Quản lý danh sách hợp đồng cho thuê căn hộ, điều khoản tiền cọc, kỳ thanh toán và cảnh báo gia hạn.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 shrink-0 self-start md:self-auto hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Lập Hợp Đồng Mới</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `Tất cả (${contracts.length})` },
              { id: 'active', label: 'Đang hiệu lực' },
              { id: 'expiring_soon', label: 'Sắp hết hạn' },
              { id: 'terminated', label: 'Đã thanh lý' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
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
              placeholder="Tìm theo tên khách, mã HĐ..."
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="atmospheric-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Mã Hợp Đồng</th>
                <th className="p-4">Người Thuê</th>
                <th className="p-4">Căn Hộ</th>
                <th className="p-4">Giá Thuê & Tiền Cọc</th>
                <th className="p-4">Thời Hạn Thuê</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredContracts.map(contract => (
                <tr key={contract.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-emerald-400">{contract.contractNumber}</td>
                  <td className="p-4">
                    <div className="font-serif font-bold text-slate-100 text-sm">{contract.tenantName}</div>
                    <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{contract.tenantPhone}</span>
                    </div>
                  </td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectUnit(contract.unitId)}>
                    <div className="font-bold text-slate-200 hover:text-emerald-400 transition-colors line-clamp-1">{contract.unitName}</div>
                    <div className="text-slate-500">{contract.unitId}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-100">{(contract.monthlyRentVND / 1000000).toFixed(0)} Triệu /tháng</div>
                    <div className="text-[10px] text-slate-400">Cọc: {(contract.depositVND / 1000000).toFixed(0)} Triệu</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{contract.startDate} $\rightarrow$ {contract.endDate}</div>
                    <div className="text-[10px] text-slate-500">Chu kỳ: {contract.paymentCycleMonths} tháng/lần</div>
                  </td>
                  <td className="p-4">{getStatusBadge(contract.status)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Xem file điện tử hợp đồng: ${contract.contractNumber}`)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Xem & Tải Hợp Đồng"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-2xl w-full rounded-3xl atmospheric-panel border border-emerald-500/30 p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="font-serif text-2xl text-slate-100 font-bold">Lập Hợp Đồng Thuê Căn Hộ Mới</h3>
                <p className="text-xs font-mono text-emerald-400 mt-0.5">Xác lập thỏa thuận thuê nhà và đưa căn hộ vào trạng thái đang thuê</p>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  onClearLeadContractData?.();
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Họ và Tên Khách Thuê *</label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Số Điện Thoại *</label>
                  <input
                    type="text"
                    required
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Căn Hộ Cho Thuê *</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.id} - {unit.name || unit.district} ({(unit.monthlyRentVND / 1000000).toFixed(0)} Tr/th)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Số CCCD / Hộ Chiếu *</label>
                  <input
                    type="text"
                    value={tenantIdCard}
                    onChange={(e) => setTenantIdCard(e.target.value)}
                    placeholder="001099012345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Giá Thuê Hàng Tháng (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={monthlyRentVND}
                    onChange={(e) => setMonthlyRentVND(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tiền Đặt Cọc (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={depositVND}
                    onChange={(e) => setDepositVND(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Ngày Bắt Đầu *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ngày Hết Hạn *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Chu Kỳ Thu Tiền</label>
                  <select
                    value={paymentCycleMonths}
                    onChange={(e) => setPaymentCycleMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    <option value={1}>1 tháng / lần</option>
                    <option value={3}>3 tháng / lần</option>
                    <option value={6}>6 tháng / lần</option>
                    <option value={12}>1 năm / lần</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tóm Tắt Điều Khoản & Ghi Chú</label>
                <textarea
                  rows={2}
                  value={termsSummary}
                  onChange={(e) => setTermsSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    onClearLeadContractData?.();
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 transition-all"
                >
                  Xác Nhận Ký Hợp Đồng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
