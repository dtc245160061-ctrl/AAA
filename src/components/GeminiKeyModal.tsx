import React, { useState, useEffect } from 'react';
import { X, Sparkles, Key, CheckCircle2, AlertCircle, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey, testGeminiApiKey } from '../services/geminiRagService';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: (hasKey: boolean) => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKey, setApiKeyInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid?: boolean; message?: string; model?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const currentKey = getGeminiApiKey();
      setApiKeyInput(currentKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!apiKey.trim()) {
      setGeminiApiKey('');
      setTestResult({ valid: false, message: 'Đã xóa API Key. Hệ thống sẽ sử dụng Local Semantic RAG fallback.' });
      onKeyUpdated?.(false);
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testGeminiApiKey(apiKey.trim());
    setIsTesting(false);
    setTestResult(res);

    if (res.valid) {
      setGeminiApiKey(apiKey.trim());
      onKeyUpdated?.(true);
    }
  };

  const handleClearKey = () => {
    setApiKeyInput('');
    setGeminiApiKey('');
    setTestResult({ valid: false, message: 'Đã gỡ API Key.' });
    onKeyUpdated?.(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="max-w-md w-full rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl relative text-left text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9FE870] text-[#163300] flex items-center justify-center shadow-xs shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] text-[#20A05A] dark:text-[#9FE870] uppercase tracking-wider font-bold">
                <Sparkles className="w-3 h-3" />
                <span>Google Gemini & RAG Setup</span>
              </div>
              <h3 className="text-xl font-black text-[#163300] dark:text-white leading-tight">
                Tích Hợp Google Gemini API
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-[#163300] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Nhập <strong>Google Gemini API Key</strong> để kích hoạt mô hình sinh ngôn ngữ <strong>Gemini 2.0 Flash</strong> kết hợp công nghệ <strong>RAG (Retrieval-Augmented Generation)</strong> và mô hình <strong>text-embedding-004</strong> truy xuất cơ sở tri thức căn hộ, PCCC và vận hành tòa nhà.
        </p>

        {/* Input Form */}
        <form onSubmit={handleTestAndSave} className="space-y-4 text-xs font-medium">
          <div className="space-y-1.5">
            <label className="text-slate-600 dark:text-slate-300 font-bold flex items-center justify-between">
              <span>Google AI Studio API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[#20A05A] dark:text-[#9FE870] hover:underline inline-flex items-center gap-1 text-[11px] font-bold"
              >
                <span>Lấy key miễn phí</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9FE870]/40 text-xs font-medium"
              />
              <Key className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Test Status Indicator */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs ${
                testResult.valid
                  ? 'bg-[#E8F8EC] border-[#20A05A]/30 text-[#163300]'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
              }`}
            >
              {testResult.valid ? (
                <CheckCircle2 className="w-4 h-4 text-[#20A05A] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#FF5436] shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-bold">{testResult.message}</div>
                {testResult.model && (
                  <div className="text-[11px] text-[#20A05A] dark:text-[#9FE870] font-bold">
                    Mô hình hoạt động: {testResult.model} + text-embedding-004
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="p-3.5 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#20A05A] shrink-0" />
            <span>API Key được lưu an toàn trực tiếp trên trình duyệt của bạn (localStorage).</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClearKey}
                className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-[#FF5436] hover:border-[#FF5436]/40 text-xs font-bold transition-colors cursor-pointer"
              >
                Gỡ Key
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={isTesting}
              className="flex-1 py-2.5 rounded-full bg-[#9FE870] hover:bg-[#8ee05b] disabled:bg-slate-200 disabled:text-slate-400 text-[#163300] text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang Kiểm Tra...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lưu & Kích Hoạt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
