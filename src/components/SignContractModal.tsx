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
    ctx.strokeStyle = '#10b981'; // Emerald stroke
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl atmospheric-panel border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-slate-100 font-bold">Ký Hợp Đồng Thuê Nhà Số (E-Signature)</h3>
              <p className="text-xs text-slate-400 font-mono">Bảo chứng điện tử an toàn • Mã hợp đồng: {contract.contractNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400">Căn hộ:</span>
              <p className="text-slate-100 font-bold font-serif">{contract.unitName}</p>
            </div>
            <div>
              <span className="text-slate-400">Khách thuê:</span>
              <p className="text-slate-100 font-bold">{contract.tenantName} ({contract.tenantPhone})</p>
            </div>
            <div>
              <span className="text-slate-400">Giá thuê:</span>
              <p className="text-emerald-400 font-bold">{(contract.monthlyRentVND / 1000000).toFixed(0)} Triệu VNĐ/tháng</p>
            </div>
            <div>
              <span className="text-slate-400">Tiền cọc bảo chứng:</span>
              <p className="text-slate-100 font-bold">{(contract.depositVND / 1000000).toFixed(0)} Triệu VNĐ</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Thời hạn: {contract.startDate} ➔ {contract.endDate}</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <Lock className="w-3 h-3" /> Mã Hash: {signatureHash.slice(0, 18)}...
            </span>
          </div>
        </div>

        {/* E-Signature Canvas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vẽ Chữ Ký Điện Tử Trực Tiếp (Dùng chuột hoặc cảm ứng):</span>
            </label>
            <button
              type="button"
              onClick={handleClearSignature}
              className="text-[11px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Ký lại</span>
            </button>
          </div>

          <div className="relative rounded-2xl border-2 border-dashed border-emerald-500/40 bg-slate-950 overflow-hidden shadow-inner">
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
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono text-slate-400">
                ✍️ Ký tên vào khung này để xác nhận hợp đồng
              </div>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20 mt-0.5"
          />
          <span className="font-sans leading-relaxed">
            Tôi xác nhận đã đọc kỹ điều khoản hợp đồng thuê nhà, chính sách hoàn cọc minh bạch trong 72 giờ và cam kết tuân thủ quy chuẩn an toàn Sanctuary của HAVEN.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-mono hover:bg-slate-800 transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            disabled={!hasSigned || !agreedTerms}
            onClick={handleComplete}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Kích Hoạt Hợp Đồng Số</span>
          </button>
        </div>
      </div>
    </div>
  );
};
