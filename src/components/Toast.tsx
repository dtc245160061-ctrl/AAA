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
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
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
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
  const borderColor = toast.type === 'success' ? 'border-emerald-500/50' : toast.type === 'error' ? 'border-rose-500/50' : 'border-sky-500/50';
  const iconColor = toast.type === 'success' ? 'text-emerald-400' : toast.type === 'error' ? 'text-rose-400' : 'text-sky-400';
  const bgBadge = toast.type === 'success' ? 'bg-emerald-500/15' : toast.type === 'error' ? 'bg-rose-500/15' : 'bg-sky-500/15';

  return (
    <div
      className={`pointer-events-auto p-4 rounded-2xl atmospheric-panel border ${borderColor} shadow-2xl backdrop-blur-xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-300`}
    >
      <div className={`p-2 rounded-xl ${bgBadge} ${iconColor} shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 space-y-0.5 pt-0.5">
        <h4 className="text-sm font-serif font-bold text-slate-100">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs text-slate-300 font-sans leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
