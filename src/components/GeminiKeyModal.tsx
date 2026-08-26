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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-md w-full rounded-3xl atmospheric-panel border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                <Sparkles className="w-3 h-3" />
                <span>Google Gemini & RAG Setup</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-100">
                Tích Hợp Google Gemini API
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Nhập <strong>Google Gemini API Key</strong> để kích hoạt mô hình sinh ngôn ngữ <strong>Gemini 2.0 Flash</strong> kết hợp công nghệ <strong>RAG (Retrieval-Augmented Generation)</strong> và mô hình <strong>text-embedding-004</strong> truy xuất cơ sở tri thức căn hộ, PCCC và vận hành tòa nhà.
        </p>

        {/* Input Form */}
        <form onSubmit={handleTestAndSave} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-300 flex items-center justify-between">
              <span>Google AI Studio API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 text-[11px]"
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
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Test Status Indicator */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                testResult.valid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-bold">{testResult.message}</div>
                {testResult.model && (
                  <div className="text-[11px] font-mono text-emerald-400">
                    Mô hình hoạt động: {testResult.model} + text-embedding-004
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>API Key được lưu an toàn trực tiếp trên trình duyệt của bạn (localStorage).</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClearKey}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
              >
                Gỡ Key
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={isTesting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-mono text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5"
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
