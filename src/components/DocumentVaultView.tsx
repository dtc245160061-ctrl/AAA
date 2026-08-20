import React, { useState } from 'react';
import { 
  FolderLock, 
  FileText, 
  ShieldCheck, 
  Download, 
  Search, 
  Plus, 
  Lock,
  Building
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
        return <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold whitespace-nowrap inline-block">Hợp Đồng Số</span>;
      case 'deposit_escrow':
        return <span className="px-2.5 py-1 rounded-full bg-amber-950/90 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold whitespace-nowrap inline-block">Biên Nhận Cọc Escrow</span>;
      case 'pccc_cert':
        return <span className="px-2.5 py-1 rounded-full bg-rose-950/90 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold whitespace-nowrap inline-block">Nghiệm Thu PCCC</span>;
      case 'handover_report':
        return <span className="px-2.5 py-1 rounded-full bg-sky-950/90 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-bold whitespace-nowrap inline-block">Bàn Giao 15 Mục</span>;
      case 'ownership_doc':
        return <span className="px-2.5 py-1 rounded-full bg-purple-950/90 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold whitespace-nowrap inline-block">Sổ Đỏ / Ủy Quyền</span>;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            <FolderLock className="w-4 h-4 text-emerald-400" />
            <span>Kho Lưu Trữ Tài Liệu Pháp Lý Số (Document Vault)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-100 font-bold mt-1">
            Bảo Mật Hợp Đồng, Giấy Tờ PCCC & Biên Lai Ký Quỹ
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Toàn bộ hợp đồng điện tử, biên bản bàn giao và chứng nhận an toàn tòa nhà được mã hóa và lưu trữ vĩnh viễn trên nền tảng.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tải Lên Tài Liệu Mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl atmospheric-panel border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên văn bản, căn hộ hoặc mã hash..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono">
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
              className={`px-3 py-1.5 rounded-xl transition-all ${
                categoryFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl atmospheric-panel border border-slate-800 hover:border-emerald-500/50 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-200 space-y-4 shadow-xl group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {doc.title}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{doc.unitName} ({doc.unitId})</span>
                  </p>
                </div>
              </div>

              {getCategoryBadge(doc.category)}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Dung lượng: {(doc.fileSizeKb / 1024).toFixed(1)} MB</span>
                <span>Ngày tạo: {doc.uploadedAt}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400/90 pt-1 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Mã băm SHA-256:
                </span>
                <span className="font-bold truncate max-w-[180px]">{doc.hashSignature}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Đã xác thực bảo chứng sàn
              </span>

              <button
                onClick={() => {
                  if (onShowToast) {
                    onShowToast('info', 'Đang tải tài liệu an toàn', `Tài liệu "${doc.title}" đã được ký số.`);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Bản Gốc</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl atmospheric-panel border border-emerald-500/40 p-6 md:p-8 space-y-5 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-slate-100">Tải Lên Tài Liệu Pháp Lý Mới</h3>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Tên Văn Bản / Giấy Tờ *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Ví dụ: Giấy nghiệm thu PCCC đợt 2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Phân Loại *</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans focus:outline-none focus:border-emerald-500"
                  >
                    <option value="contract">Hợp đồng số</option>
                    <option value="deposit_escrow">Biên nhận cọc Escrow</option>
                    <option value="pccc_cert">Giấy kiểm định PCCC</option>
                    <option value="handover_report">Biên bản bàn giao</option>
                    <option value="ownership_doc">Sổ đỏ / Ủy quyền</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Căn Hộ Tương Ứng *</label>
                  <select
                    value={docUnitId}
                    onChange={(e) => setDocUnitId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans focus:outline-none focus:border-emerald-500"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.name || u.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-700 text-center space-y-1">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-slate-300">Kéo thả file PDF hoặc ảnh scan vào đây</p>
                <span className="text-[10px] text-slate-500">Tự động mã hóa AES-256 khi lưu</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
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
