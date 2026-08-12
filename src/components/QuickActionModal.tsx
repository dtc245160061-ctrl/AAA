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
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAction === 'tenant') showToast('Đã thêm hồ sơ cư dân mới thành công!');
    if (activeAction === 'contract') showToast('Đã tạo hợp đồng thuê mới thành công!');
    if (activeAction === 'payment') showToast('Đã ghi nhận thanh toán tiền nhà thành công!');
    if (activeAction === 'maintenance') showToast('Đã tạo vé yêu cầu bảo trì thành công!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-left">
      {toast && (
        <div className="absolute top-6 right-6 z-50 bg-amber-500 text-black px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-black" />
          <span>{toast}</span>
        </div>
      )}

      <div className="origin-card w-full max-w-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div>
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
              THAO TÁC QUẢN TRỊ NHANH
            </span>
            <h2 className="text-xl font-bold text-white font-['Cinzel'] mt-0.5">
              Tác Vụ Vận Hành BQL
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Type Selector Grid */}
        <div className="p-6 border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/30">
          {[
            { id: 'payment', label: 'Ghi Thu Tiền', icon: DollarSign },
            { id: 'tenant', label: 'Thêm Cư Dân', icon: UserPlus },
            { id: 'contract', label: 'Tạo Hợp Đồng', icon: FileCheck },
            { id: 'maintenance', label: 'Tạo Vé Bảo Trì', icon: Wrench },
          ].map((act) => {
            const Icon = act.icon;
            const isActive = activeAction === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setActiveAction(act.id as any)}
                className={`p-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 border ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {activeAction === 'payment' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Căn Hộ Thanh Toán</label>
                <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500">
                  <option value="SV-2002">SV-2002 — Marcus Sterling ($8,750)</option>
                  <option value="DL-0801">DL-0801 — Kenji Takahashi ($3,650)</option>
                  <option value="PH-2401">PH-2401 — Alexander Vance ($14,500)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Số Tiền Thu (USD)</label>
                  <input
                    type="number"
                    defaultValue={8750}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Hình Thức</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500">
                    <option>Chuyển Khoản Ngân Hàng</option>
                    <option>Tiền Mặt</option>
                    <option>Thẻ Tín Dụng</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeAction === 'tenant' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Họ và Tên Cư Dân</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Số Điện Thoại</label>
                  <input
                    type="text"
                    placeholder="+84 901 234 567"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Email</label>
                  <input
                    type="email"
                    placeholder="cudan@gmail.com"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeAction === 'contract' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Chọn Căn Hộ</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500">
                    <option value="PH-2402">PH-2402 (Penthouse - $16,800/tháng)</option>
                    <option value="DL-1202">DL-1202 (Deluxe - $4,100/tháng)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Tiền Đặt Cọc ($)</label>
                  <input
                    type="number"
                    defaultValue={33600}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeAction === 'maintenance' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Tên Sự Cố / Yêu Cầu</label>
                <input
                  type="text"
                  placeholder="Mô tả sự cố (vd: Rò rỉ ống nước căn 1601)..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Căn Hộ</label>
                  <input
                    type="text"
                    defaultValue="EX-1601"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Mức Ưu Tiên</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500">
                    <option value="Urgent">Gấp (Urgent)</option>
                    <option value="Medium">Vừa</option>
                    <option value="Low">Bình Thường</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              Xác Nhận Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
