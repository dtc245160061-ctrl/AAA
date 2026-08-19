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
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
  const borderColor = toast.type === 'success' ? 'border-emerald-500/40' : toast.type === 'error' ? 'border-rose-500/40' : 'border-sky-500/40';
  const iconColor = toast.type === 'success' ? 'text-emerald-500' : toast.type === 'error' ? 'text-rose-500' : 'text-sky-500';
  const bgBadge = toast.type === 'success' ? 'bg-emerald-500/10' : toast.type === 'error' ? 'bg-rose-500/10' : 'bg-sky-500/10';

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-2xl bg-[var(--haven-surface-elevated)] border ${borderColor} shadow-[var(--shadow-elevated)] backdrop-blur-xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-200`}
    >
      <div className={`p-1.5 rounded-xl ${bgBadge} ${iconColor} shrink-0 mt-0.5`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-0.5 min-w-0">
        <h4 className="text-xs font-display font-bold text-[var(--haven-text-primary)]">{toast.title}</h4>
        {toast.description && (
          <p className="text-[11px] text-[var(--haven-text-secondary)] font-sans leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-[var(--haven-text-tertiary)] hover:text-[var(--haven-text-primary)] hover:bg-[var(--haven-surface-hover)] transition-colors shrink-0"
        title="Đóng thông báo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
