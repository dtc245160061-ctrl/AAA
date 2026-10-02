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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-3xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 bg-[#F2F5F0] dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center shadow-2xs shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5 text-[#163300]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-[#163300] dark:text-white tracking-tight">
                  Quy Trình Cọc An Tâm (HAVEN Escrow Protection)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#163300] text-[#9FE870] dark:bg-[#9FE870]/20 dark:text-[#9FE870] text-[10px] font-bold uppercase tracking-wider">
                  Escrow 100%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Bảo vệ 100% tiền cọc • Chống lừa đảo và giữ cọc vô cớ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Step Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isDone = currentStep > step.number;
              return (
                <div
                  key={step.number}
                  onClick={() => setCurrentStep(step.number)}
                  className={`p-3.5 rounded-[20px] border-2 text-left cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 border-[#163300] dark:border-[#9FE870] ring-2 ring-[#9FE870]/30 shadow-xs'
                      : isDone
                      ? 'bg-[#E8F8EC] dark:bg-emerald-950/30 border-[#9FE870] text-[#163300] dark:text-[#9FE870]'
                      : 'bg-[#F9FAF8] dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#20A05A] dark:text-[#9FE870]" />
                    ) : (
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isActive ? 'bg-[#163300] dark:bg-[#9FE870] text-[#9FE870] dark:text-[#163300]' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {step.number}
                      </span>
                    )}
                    <span className={isActive ? 'text-[#163300] dark:text-white' : ''}>{step.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Step 1 Content: Payment & QR Escrow */}
          {currentStep === 1 && (
            <div className="p-6 rounded-[24px] bg-[#F7FAF6] dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-3.5 flex-1">
                  <span className="text-xs font-bold text-[#20A05A] dark:text-[#9FE870] uppercase tracking-wider">
                    Bước 1: Quét Mã VietQR Chuyển Tiền Cọc Vào Tài Khoản Bảo Chứng
                  </span>
                  <div className="space-y-0.5">
                    <div className="text-3xl font-black text-[#163300] dark:text-white tabular-nums">
                      {(depositAmountVND / 1000000).toFixed(0)} Triệu VNĐ
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      (Tiền cọc {depositMonths} tháng căn hộ {unit.name || unit.id})
                    </p>
                  </div>

                  <div className="p-4 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-xs space-y-1.5 shadow-2xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Ngân hàng thụ hưởng:</span>
                      <span className="text-slate-900 dark:text-white font-bold">MB Bank (Tài khoản Ký Quỹ Escrow)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Số tài khoản:</span>
                      <span className="text-[#20A05A] dark:text-[#9FE870] font-black">0988-888-HAVEN-ESCROW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Nội dung chuyển khoản:</span>
                      <span className="text-[#7A5200] dark:text-[#FFC83B] font-bold">COC {unit.id} HAVEN</span>
                    </div>
                  </div>
                </div>

                {/* QR Box */}
                <div className="p-5 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 shadow-md">
                  <QrCode className="w-32 h-32 text-slate-900 dark:text-white" />
                  <span className="text-[11px] text-[#163300] dark:text-[#9FE870] mt-2 font-bold">VietQR Escrow Tạm Giữ</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/30 border border-[#9FE870]/40 text-xs text-[#163300] dark:text-[#9FE870] flex items-center gap-2 font-medium">
                <Lock className="w-4 h-4 text-[#20A05A] dark:text-[#9FE870] shrink-0" />
                <span>Tiền của bạn KHÔNG chuyển ngay cho chủ nhà. HAVEN giữ an toàn đến khi bạn nhận phòng.</span>
              </div>
            </div>
          )}

          {/* Step 2 Content: Landlord Locks Room */}
          {currentStep === 2 && (
            <div className="p-6 rounded-[24px] bg-[#F7FAF6] dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/40 border border-[#9FE870]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#163300] dark:text-[#9FE870] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#20A05A] dark:text-[#9FE870]" />
                  <span>Đã Ghi Nhận Ký Quỹ Cọc {(depositAmountVND / 1000000).toFixed(0)} Triệu VNĐ</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Hệ thống HAVEN đã gửi thông báo xác nhận tiền cọc cho chủ nhà <strong>{unit.landlord?.name}</strong>. Căn hộ {unit.name || unit.id} đã tự động chuyển sang trạng thái <strong>[Đã Giữ Chỗ]</strong> trên sàn, không ai có thể tranh phòng của bạn.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 Content: Handover Inspection */}
          {currentStep === 3 && (
            <div className="p-6 rounded-[24px] bg-[#F7FAF6] dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-[#163300] dark:text-white font-bold text-sm">
                  <FileCheck2 className="w-4 h-4 text-[#20A05A] dark:text-[#9FE870]" />
                  <span>Biên Bản Bàn Giao 15 Hạng Mục Kèm Ảnh Chụp</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Khi đến nhận phòng thực tế, bạn và chủ nhà sẽ mở mục <strong>[Biên Bản Bàn Giao]</strong> trên HAVEN, tick kiểm tra 15 hạng mục nội thất và chụp ảnh số công tơ điện nước ban đầu để khóa dữ liệu.
                </p>
              </div>
            </div>
          )}

          {/* Step 4 Content: 72h Refund Protection Active */}
          {currentStep === 4 && (
            <div className="p-6 rounded-[24px] bg-[#E8F8EC] dark:bg-emerald-950/30 border border-[#9FE870]/40 space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#163300] dark:text-[#9FE870] font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-[#20A05A] dark:text-[#9FE870]" />
                  <span>Cam Kết Bảo Vệ Tiền Cọc Sanctuary 72 Giờ Hoạt Động</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Khi hợp đồng kết thúc, hệ thống sẽ đối chiếu ảnh bàn giao ban đầu vs hiện trạng trả phòng. Tiền cọc được chuyển khoản hoàn trả tự động vào tài khoản ngân hàng của bạn trong vòng tối đa 72 giờ.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4.5 border-t border-slate-200/80 dark:border-slate-800 bg-[#F2F5F0] dark:bg-slate-850 shrink-0">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            Quay lại bước trước
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] text-[#163300] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
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
                className="px-6 py-2.5 rounded-full bg-[#163300] hover:bg-[#20A05A] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
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
