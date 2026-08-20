import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  FileCheck2
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';

interface DepositEscrowModalProps {
  unit: ApartmentUnit;
  isOpen: boolean;
  onClose: () => void;
  onConfirmEscrow?: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const DepositEscrowModal: React.FC<DepositEscrowModalProps> = ({
  unit,
  isOpen,
  onClose,
  onConfirmEscrow,
  onShowToast
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const depositAmountVND = unit.depositTerms?.amountVND || unit.monthlyRentVND * 2;
  const depositMonths = unit.depositTerms?.months || 2;

  const steps = [
    { number: 1, title: 'Ký Quỹ Tạm Giữ', desc: 'Chuyển tiền vào tài khoản ký quỹ trung gian HAVEN Escrow' },
    { number: 2, title: 'Khóa Bảo Chứng', desc: 'Chủ nhà nhận bảo chứng và giữ phòng trống cho bạn' },
    { number: 3, title: 'Bàn Giao Hiện Trạng', desc: 'Kiểm tra 15 hạng mục và ghi số công tơ điện nước' },
    { number: 4, title: 'Kích Hoạt Bảo Vệ 72h', desc: 'Cam kết hoàn cọc tự động trong 72h khi hết hợp đồng' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl atmospheric-panel border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-slate-100 font-bold">Quy Trình Cọc An Tâm (HAVEN Escrow Protection)</h3>
              <p className="text-xs text-slate-400 font-mono">Bảo vệ 100% tiền cọc • Chống lừa đảo và giữ cọc vô cớ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isDone = currentStep > step.number;
            return (
              <div
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  isActive
                    ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-lg'
                    : isDone
                    ? 'bg-slate-900/90 border-emerald-500/40 text-slate-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold mb-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.number}
                    </span>
                  )}
                  <span className={isActive ? 'text-emerald-300' : ''}>{step.title}</span>
                </div>
                <p className="text-[10px] font-sans text-slate-400 line-clamp-1">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Step 1 Content: Payment & QR Escrow */}
        {currentStep === 1 && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Bước 1: Quét Mã VietQR Chuyển Tiền Cọc Vào Tài Khoản Bảo Chứng
                </span>
                <div className="space-y-1">
                  <div className="text-2xl font-serif font-bold text-slate-100">
                    {(depositAmountVND / 1000000).toFixed(0)} Triệu VNĐ
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    (Tiền cọc {depositMonths} tháng căn hộ {unit.name || unit.id})
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngân hàng thụ hưởng:</span>
                    <span className="text-slate-200 font-bold">MB Bank (Tài khoản Ký Quỹ Escrow)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số tài khoản:</span>
                    <span className="text-emerald-400 font-bold">0988-888-HAVEN-ESCROW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nội dung chuyển khoản:</span>
                    <span className="text-amber-300 font-bold">COC {unit.id} HAVEN</span>
                  </div>
                </div>
              </div>

              {/* QR Mock */}
              <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center shrink-0 shadow-xl">
                <QrCode className="w-32 h-32 text-slate-950" />
                <span className="text-[10px] font-mono text-slate-600 mt-1 font-bold">VietQR Escrow Tạm Giữ</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tiền của bạn KHÔNG chuyển ngay cho chủ nhà. HAVEN giữ an toàn đến khi bạn nhận phòng.</span>
            </div>
          </div>
        )}

        {/* Step 2 Content: Landlord Locks Room */}
        {currentStep === 2 && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 animate-in fade-in duration-200 text-xs font-mono">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Đã Ghi Nhận Ký Quỹ Cọc {(depositAmountVND / 1000000).toFixed(0)} Triệu VNĐ</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                Hệ thống HAVEN đã gửi thông báo xác nhận tiền cọc cho chủ nhà <strong>{unit.landlord?.name}</strong>. Căn hộ {unit.name || unit.id} đã tự động chuyển sang trạng thái <strong>[Đã Giữ Chỗ]</strong> trên sàn, không ai có thể tranh phòng của bạn.
              </p>
            </div>
          </div>
        )}

        {/* Step 3 Content: Handover Inspection */}
        {currentStep === 3 && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 animate-in fade-in duration-200 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Biên Bản Bàn Giao 15 Hạng Mục Kèm Ảnh Chụp</span>
              </div>
              <p className="text-slate-400 font-sans leading-relaxed">
                Khi đến nhận phòng thực tế, bạn và chủ nhà sẽ mở mục <strong>[Biên Bản Bàn Giao]</strong> trên HAVEN, tick kiểm tra 15 hạng mục nội thất và chụp ảnh số công tơ điện nước ban đầu để khóa dữ liệu.
              </p>
            </div>
          </div>
        )}

        {/* Step 4 Content: 72h Refund Protection Active */}
        {currentStep === 4 && (
          <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 animate-in fade-in duration-200 text-xs font-mono">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Cam Kết Bảo Vệ Tiền Cọc Sanctuary 72 Giờ Hoạt Động</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                Khi hợp đồng kết thúc, hệ thống sẽ đối chiếu ảnh bàn giao ban đầu vs hiện trạng trả phòng. Tiền cọc được chuyển khoản hoàn trả tự động vào tài khoản ngân hàng của bạn trong vòng tối đa 72 giờ.
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30 text-xs font-mono"
          >
            Quay lại bước trước
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Tiếp tục: Bước {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onConfirmEscrow?.();
                  onClose();
                  if (onShowToast) {
                    onShowToast('success', 'Bảo chứng cọc kích hoạt thành công', `Căn hộ ${unit.name || unit.id} đã được bảo vệ bởi HAVEN Escrow.`);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn Tất Kích Hoạt Bảo Chứng</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
