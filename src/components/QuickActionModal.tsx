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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-left">
      {toast && (
        <div className="absolute top-6 right-6 z-50 bg-emerald-400 text-slate-950 px-5 py-3.5 rounded-2xl font-bold font-mono shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-slate-950" />
          <span>{toast}</span>
        </div>
      )}

      <div className="liquid-glass w-full max-w-2xl rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl relative bg-[#0A0D12]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">
              THAO TÁC VẬN HÀNH NHANH (QUICK DISPATCHER)
            </span>
            <h2 className="text-2xl font-bold text-white font-serif mt-1">
              Thực Hiện Thao Tác Nghiệp Vụ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Selector Grid */}
        <div className="p-4 md:p-6 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 font-mono">
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
                className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-2 border ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/15'
                    : 'bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-xs font-mono">
          {activeAction === 'payment' && (
            <>
              <div>
                <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Chọn Căn Hộ & Khách Thuê *</label>
                <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500">
                  <option value="SG-D1-1601">SG-D1-1601 — Nguyễn Thành Nam (443.5Tr/tháng)</option>
                  <option value="HN-CG-1402">HN-CG-1402 — Phạm Thu Trang (71.3Tr/tháng)</option>
                  <option value="HN-TH-2401">HN-TH-2401 — Alexander Vance (350Tr/tháng)</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Số Tiền Thu Thực Tế (VNĐ) *</label>
                  <input
                    type="number"
                    defaultValue={443500000}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Phương Thức Thanh Toán</label>
                  <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500">
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
                <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Họ và Tên Khách Thuê *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Minh Tuấn..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Số Điện Thoại *</label>
                  <input
                    type="text"
                    placeholder="0912 345 678"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Địa Chỉ Email</label>
                  <input
                    type="email"
                    placeholder="tuan.hoang@example.com"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeAction === 'contract' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Căn Hộ Cho Thuê *</label>
                  <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500">
                    <option value="HN-TH-2401">HN-TH-2401 (Penthouse Hồ Tây — 350Tr/tháng)</option>
                    <option value="SG-D1-1601">SG-D1-1601 (Sky Villa Bến Bạch Đằng — 420Tr/tháng)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Tiền Đặt Cọc Ký Quỹ (VNĐ) *</label>
                  <input
                    type="number"
                    defaultValue={700000000}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeAction === 'maintenance' && (
            <>
              <div>
                <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Mô Tả Sự Cố / Hư Hỏng *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kiểm tra cảm biến khóa cửa vân tay hoặc áp lực vòi sen..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Mã Căn Hộ *</label>
                  <input
                    type="text"
                    defaultValue="HN-TH-2401"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[11px]">Mức Độ Ưu Tiên</label>
                  <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500">
                    <option value="Urgent">Khẩn Cấp (Xử lý trong 2 giờ)</option>
                    <option value="Medium">Trung Bình (Trong ngày)</option>
                    <option value="Low">Tiêu Chuẩn (Trong 48 giờ)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="pt-5 border-t border-slate-800 flex justify-end gap-3 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
            >
              Lưu & Xác Nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

