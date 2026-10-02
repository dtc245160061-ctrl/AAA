import React, { useState } from 'react';
import { 
  FolderLock, 
  FileText, 
  ShieldCheck, 
  Download, 
  Search, 
  Plus, 
  Lock,
  Building,
  UploadCloud,
  X
} from 'lucide-react';
import type { LegalDocumentItem, ApartmentUnit } from '../types/apartment';
import { ApartmentStore } from '../data/apartmentStore';

interface DocumentVaultViewProps {
  units: ApartmentUnit[];
  isAdminView?: boolean;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  units,
  onShowToast
}) => {
  const [documents, setDocuments] = useState<LegalDocumentItem[]>(() => ApartmentStore.getLegalDocuments());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // New doc form state
  const [docTitle, setDocTitle] = useState<string>('');
  const [docCategory, setDocCategory] = useState<LegalDocumentItem['category']>('contract');
  const [docUnitId, setDocUnitId] = useState<string>(units[0]?.id || '');

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.hashSignature.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (cat: LegalDocumentItem['category']) => {
    switch (cat) {
      case 'contract':
        return <span className="px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] border border-[#9FE870] text-xs font-bold whitespace-nowrap inline-block">Hợp Đồng Số</span>;
      case 'deposit_escrow':
        return <span className="px-3 py-1 rounded-full bg-[#FFF8E6] text-[#9A6700] border border-[#FFC83B] text-xs font-bold whitespace-nowrap inline-block">Biên Nhận Cọc Escrow</span>;
      case 'pccc_cert':
        return <span className="px-3 py-1 rounded-full bg-[#FEECEB] text-[#D92D20] border border-[#FF5436] text-xs font-bold whitespace-nowrap inline-block">Nghiệm Thu PCCC</span>;
      case 'handover_report':
        return <span className="px-3 py-1 rounded-full bg-[#EBF2FF] text-[#2570EB] border border-[#2570EB] text-xs font-bold whitespace-nowrap inline-block">Bàn Giao 15 Mục</span>;
      case 'ownership_doc':
        return <span className="px-3 py-1 rounded-full bg-[#F5F0FF] text-[#8B5CF6] border border-[#8B5CF6] text-xs font-bold whitespace-nowrap inline-block">Sổ Đỏ / Căn Hộ</span>;
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find(u => u.id === docUnitId);
    const newDoc = ApartmentStore.addLegalDocument({
      title: docTitle,
      category: docCategory,
      unitId: docUnitId,
      unitName: targetUnit?.name || docUnitId,
      fileSizeKb: Math.floor(Math.random() * 2000) + 500,
      verified: true
    });
    setDocuments(ApartmentStore.getLegalDocuments());
    setIsUploadModalOpen(false);
    setDocTitle('');
    if (onShowToast) {
      onShowToast('success', `Tải lên tài liệu thành công`, `"${newDoc.title}" - Mã SHA-256: ${newDoc.hashSignature.slice(0, 16)}...`);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner - Wise Signature Style */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8EC] text-[#163300] font-bold text-xs uppercase tracking-wider mb-2">
              <FolderLock className="w-4 h-4 text-[#20A05A]" />
              <span>Kho Lưu Trữ Tài Liệu Pháp Lý Số (Document Vault)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#163300] dark:text-white mt-1">
              Bảo Mật Hợp Đồng, Giấy Tờ PCCC & Biên Lai Ký Quỹ
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Toàn bộ hợp đồng điện tử, biên bản bàn giao và chứng nhận an toàn tòa nhà được mã hóa SHA-256 và lưu trữ vĩnh viễn trên nền tảng.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-6 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tải Lên Tài Liệu Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar - Wise Style */}
      <div className="p-4 sm:p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên văn bản, căn hộ hoặc mã hash..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="wise-pill-tabs flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'Tất cả tài liệu' },
            { id: 'contract', label: 'Hợp đồng số' },
            { id: 'deposit_escrow', label: 'Biên lai cọc' },
            { id: 'pccc_cert', label: 'Hồ sơ PCCC' },
            { id: 'handover_report', label: 'Bàn giao 15 mục' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`wise-pill-tab ${categoryFilter === tab.id ? 'wise-pill-tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid - Wise Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-[#E8F8EC] text-[#20A05A] shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#163300] dark:text-white">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#20A05A]" />
                    <span>{doc.unitName} ({doc.unitId})</span>
                  </p>
                </div>
              </div>

              {getCategoryBadge(doc.category)}
            </div>

            <div className="p-4 rounded-[20px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span>Dung lượng: {(doc.fileSizeKb / 1024).toFixed(1)} MB</span>
                <span>Ngày tạo: {doc.uploadedAt}</span>
              </div>
              <div className="flex items-center justify-between text-[#163300] dark:text-[#9FE870] pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="flex items-center gap-1 font-bold">
                  <Lock className="w-3.5 h-3.5" /> SHA-256 Hash:
                </span>
                <span className="font-mono font-bold truncate max-w-[180px]">{doc.hashSignature}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-[#163300] dark:text-[#9FE870] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#20A05A]" /> Đã xác thực bảo chứng sàn
              </span>

              <button
                onClick={() => {
                  const content = `======================================================
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
------------------------------------------------------
HAVEN LUXURY RESIDENTIAL PLATFORM - BẢN GỐC ĐIỆN TỬ
TÀI LIỆU PHÁP LÝ ĐÃ ĐƯỢC CHỨNG THỰC & KÝ SỐ SHA-256
======================================================

1. TÊN TÀI LIỆU: ${doc.title}
2. PHÂN LOẠI: ${doc.category === 'contract' ? 'Hợp đồng thuê căn hộ số' : doc.category === 'deposit_escrow' ? 'Biên nhận ký quỹ bảo chứng Escrow' : 'Biên bản kiểm định PCCC QCVN 06'}
3. MÃ BĂM BẢO MẬT (SHA-256): ${doc.hashSignature}
4. CĂN HỘ ÁP DỤNG: ${doc.unitId}
5. NGÀY PHÁT HÀNH / TẢI LÊN: ${doc.uploadedAt}
6. TRẠNG THÁI PHÁP LÝ: ĐÃ XÁC THỰC BẢO CHỨNG 100% BỞI BAN QUẢN TRỊ HAVEN

Văn bản này có giá trị pháp lý tương đương bản cứng theo quy định tại Luật Giao dịch Điện tử và các quy chuẩn thẩm định căn hộ của HAVEN.
======================================================`;

                  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${doc.title.replace(/[\s/\\:]+/g, '_')}_signed.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);

                  if (onShowToast) {
                    onShowToast('success', 'Đã tải tài liệu về máy', `Tập tin "${doc.title}" đã được lưu vào máy tính của bạn.`);
                  }
                }}
                className="px-4 py-2 rounded-full bg-[#163300] hover:bg-[#234c03] text-[#9FE870] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Tải bản gốc tài liệu đã ký số về máy"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Bản Gốc</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal - Wise Style */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#163300] dark:text-white">Tải Lên Tài Liệu Pháp Lý Mới</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#F2F5F0] dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Tên Văn Bản / Giấy Tờ *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Ví dụ: Giấy nghiệm thu PCCC đợt 2"
                  className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Phân Loại *</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#9FE870] cursor-pointer"
                  >
                    <option value="contract">Hợp đồng số</option>
                    <option value="deposit_escrow">Biên nhận cọc Escrow</option>
                    <option value="pccc_cert">Giấy kiểm định PCCC</option>
                    <option value="handover_report">Biên bản bàn giao</option>
                    <option value="ownership_doc">Sổ đỏ / Ủy quyền</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Căn Hộ Tương Ứng *</label>
                  <select
                    value={docUnitId}
                    onChange={(e) => setDocUnitId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#9FE870] cursor-pointer"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.name || u.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-6 rounded-[24px] border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2 bg-[#F2F5F0]/50 dark:bg-slate-800/50">
                <UploadCloud className="w-8 h-8 text-[#20A05A] mx-auto" />
                <p className="text-slate-700 dark:text-slate-300 font-medium">Kéo thả file PDF hoặc ảnh scan vào đây</p>
                <span className="text-[11px] text-slate-500 font-mono">Tự động mã hóa AES-256 khi lưu</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                >
                  Lưu Bảo Chứng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
