import React, { useState } from 'react';
import { X, UserPlus, FileCheck, DollarSign, Wrench, CheckCircle } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const [activeAction, setActiveAction] = useState<'tenant' | 'contract' | 'payment' | 'maintenance'>('payment');
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
      onClose();
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAction === 'tenant') showToast('Đã thêm hồ sơ cư dân thành công!');
    if (activeAction === 'contract') showToast('Đã lập hợp đồng thuê mới thành công!');
    if (activeAction === 'payment') showToast('Đã ghi nhận thanh toán vào sổ quỹ thành công!');
    if (activeAction === 'maintenance') showToast('Đã điều phối kỹ thuật viên bảo trì thành công!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-fade-in text-left font-sans">
      {toast && (
        <div className="absolute top-6 right-6 z-50 bg-[#9FE870] text-[#163300] px-5 py-3.5 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-[#163300]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xl relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-[#F2F5F0]/60 dark:bg-slate-850">
          <div>
            <span className="text-[11px] font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider block">
              Thao Tác Vận Hành Nhanh (Quick Dispatcher)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#163300] dark:text-white mt-1 leading-tight">
              Thực Hiện Thao Tác Nghiệp Vụ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-[#163300] dark:hover:text-white rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Selector Grid */}
        <div className="p-4 md:p-6 border-b border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900">
          {[
            { id: 'payment', label: 'Thu Tiền Nhà', icon: DollarSign },
            { id: 'tenant', label: 'Thêm Cư Dân', icon: UserPlus },
            { id: 'contract', label: 'Lập Hợp Đồng', icon: FileCheck },
            { id: 'maintenance', label: 'Báo Hỏng Hóc', icon: Wrench },
          ].map((act) => {
            const Icon = act.icon;
            const isActive = activeAction === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setActiveAction(act.id as any)}
                className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#9FE870] text-[#163300] font-black shadow-xs'
                    : 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-xs">
          {activeAction === 'payment' && (
            <>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Chọn Căn Hộ & Khách Thuê *</label>
                <select className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40">
                  <option value="SG-D1-1601">SG-D1-1601 — Nguyễn Thành Nam (443.5Tr/tháng)</option>
                  <option value="HN-CG-1402">HN-CG-1402 — Phạm Thu Trang (71.3Tr/tháng)</option>
                  <option value="HN-TH-2401">HN-TH-2401 — Alexander Vance (350Tr/tháng)</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Số Tiền Thu Thực Tế (VNĐ) *</label>
                  <input
                    type="number"
                    defaultValue={443500000}
                    className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-bold text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Phương Thức Thanh Toán</label>
                  <select className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40">
                    <option>Chuyển khoản Ngân hàng (VietQR)</option>
                    <option>Ký quỹ Escrow Tự động</option>
                    <option>Thẻ Tín Dụng Quốc Tế</option>
                    <option>Tiền mặt tại Văn phòng</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeAction === 'tenant' && (
            <>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Họ và Tên Khách Thuê *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Minh Tuấn..."
                  className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Số Điện Thoại *</label>
                  <input
                    type="text"
                    placeholder="0912 345 678"
                    className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Địa Chỉ Email</label>
                  <input
                    type="email"
                    placeholder="tuan.hoang@example.com"
                    className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
              </div>
            </>
          )}

          {activeAction === 'contract' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Căn Hộ Cho Thuê *</label>
                  <select className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40">
                    <option value="HN-TH-2401">HN-TH-2401 (Penthouse Hồ Tây — 350Tr/tháng)</option>
                    <option value="SG-D1-1601">SG-D1-1601 (Sky Villa Bến Bạch Đằng — 420Tr/tháng)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Tiền Đặt Cọc Ký Quỹ (VNĐ) *</label>
                  <input
                    type="number"
                    defaultValue={700000000}
                    className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-bold text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
              </div>
            </>
          )}

          {activeAction === 'maintenance' && (
            <>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Mô Tả Sự Cố / Hư Hỏng *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kiểm tra cảm biến khóa cửa vân tay hoặc áp lực vòi sen..."
                  className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Mã Căn Hộ *</label>
                  <input
                    type="text"
                    defaultValue="HN-TH-2401"
                    className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5 font-bold">Mức Độ Ưu Tiên</label>
                  <select className="w-full px-4 py-3 bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#163300] dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40">
                    <option value="Urgent">Khẩn Cấp (Xử lý trong 2 giờ)</option>
                    <option value="Medium">Trung Bình (Trong ngày)</option>
                    <option value="Low">Tiêu Chuẩn (Trong 48 giờ)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="pt-5 border-t border-slate-200/80 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#9FE870] hover:bg-[#8ee05b] text-[#163300] font-black rounded-full transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Lưu & Xác Nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

