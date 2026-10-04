import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  PenTool, 
  RotateCcw, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import type { LeaseContract } from '../types/apartment';

interface SignContractModalProps {
  contract: LeaseContract;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSign: (contractId: string, signatureHash: string) => void;
}

export const SignContractModal: React.FC<SignContractModalProps> = ({
  contract,
  isOpen,
  onClose,
  onConfirmSign
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [signatureHash, setSignatureHash] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSignatureHash(`HAVEN-ESIGN-SHA256-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      setTimeout(() => {
        handleClearSignature();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSigned(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#9FE870' : '#163300';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleComplete = () => {
    onConfirmSign(contract.id, signatureHash);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8EC] text-[#163300] dark:text-[#9FE870] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#163300] dark:text-white leading-tight">
                Ký Hợp Đồng Thuê Nhà Số (E-Signature)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Bảo chứng điện tử an toàn • Mã hợp đồng: <span className="font-bold tabular-nums">{contract.contractNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-[#163300] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Summary Box */}
        <div className="p-5 rounded-[24px] bg-[#F2F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Căn hộ:</span>
              <p className="text-[#163300] dark:text-white font-black text-sm mt-0.5">{contract.unitName}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Khách thuê:</span>
              <p className="text-[#163300] dark:text-white font-bold mt-0.5">{contract.tenantName} ({contract.tenantPhone})</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Giá thuê hàng tháng:</span>
              <p className="text-[#163300] dark:text-[#9FE870] font-black text-sm mt-0.5 tabular-nums">
                {(contract.monthlyRentVND / 1000000).toFixed(0)} Triệu VNĐ/tháng
              </p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Tiền cọc bảo chứng:</span>
              <p className="text-[#163300] dark:text-white font-black text-sm mt-0.5 tabular-nums">
                {(contract.depositVND / 1000000).toFixed(0)} Triệu VNĐ
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Thời hạn: <strong className="text-slate-700 dark:text-slate-200">{contract.startDate}</strong> ➔ <strong className="text-slate-700 dark:text-slate-200">{contract.endDate}</strong></span>
            <span className="text-[#163300] dark:text-[#9FE870] flex items-center gap-1 font-bold">
              <Lock className="w-3 h-3" /> Hash: {signatureHash.slice(0, 16)}...
            </span>
          </div>
        </div>

        {/* E-Signature Canvas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#163300] dark:text-slate-300 font-bold flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-[#163300] dark:text-[#9FE870]" />
              <span>Vẽ Chữ Ký Điện Tử Trực Tiếp (Dùng chuột hoặc cảm ứng):</span>
            </label>
            <button
              type="button"
              onClick={handleClearSignature}
              className="text-xs font-bold text-slate-500 hover:text-[#FF5436] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ký lại</span>
            </button>
          </div>

          <div className="relative rounded-[20px] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={560}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[140px] cursor-crosshair touch-none"
            />
            {!hasSigned && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-medium text-slate-400">
                ✍️ Ký tên vào khung này để xác nhận hợp đồng
              </div>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 accent-[#163300] dark:accent-[#9FE870] mt-0.5"
          />
          <span className="leading-relaxed">
            Tôi xác nhận đã đọc kỹ điều khoản hợp đồng thuê nhà, chính sách hoàn cọc minh bạch trong 72 giờ và cam kết tuân thủ quy chuẩn an toàn Sanctuary của HAVEN.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            disabled={!hasSigned || !agreedTerms}
            onClick={handleComplete}
            className="px-6 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] disabled:opacity-40 disabled:cursor-not-allowed text-[#163300] text-xs font-black transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Kích Hoạt Hợp Đồng Số</span>
          </button>
        </div>
      </div>
    </div>
  );
};
