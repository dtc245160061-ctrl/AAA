import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[999999] flex flex-col-reverse gap-3 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;

  const cardStyle = toast.type === 'success'
    ? 'bg-[#163300] text-white border border-[#9FE870]/40 shadow-xl'
    : toast.type === 'error'
    ? 'bg-[#8C1F08] text-white border border-[#FF5436]/40 shadow-xl'
    : 'bg-white dark:bg-slate-900 text-[#163300] dark:text-white border border-slate-200/90 dark:border-slate-800 shadow-xl';

  const iconBadge = toast.type === 'success'
    ? 'bg-[#9FE870] text-[#163300]'
    : toast.type === 'error'
    ? 'bg-[#FF5436] text-white'
    : 'bg-[#EBF2FF] dark:bg-[#0F2E6B]/40 text-[#2570EB]';

  const titleColor = toast.type === 'info'
    ? 'text-[#163300] dark:text-white'
    : 'text-white';

  const descColor = toast.type === 'info'
    ? 'text-slate-600 dark:text-slate-300'
    : 'text-white/80';

  return (
    <div
      className={`pointer-events-auto w-[380px] max-w-[92vw] p-4 rounded-[22px] ${cardStyle} backdrop-blur-md flex items-start gap-3.5 animate-in slide-in-from-bottom-4 duration-200 transition-all`}
    >
      <div className={`w-8 h-8 rounded-xl ${iconBadge} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
        <Icon className="w-4 h-4 stroke-[2.5]" />
      </div>
      <div className="flex-1 space-y-0.5 min-w-0 text-left">
        <h4 className={`text-xs font-bold leading-snug ${titleColor}`}>{toast.title}</h4>
        {toast.description && (
          <p className={`text-[11px] font-sans leading-relaxed ${descColor}`}>{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        title="Đóng thông báo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
