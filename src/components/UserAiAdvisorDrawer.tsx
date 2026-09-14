import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  Filter, 
  Loader2,
  Key,
  Zap,
  Minimize2
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { 
  askGeminiRag, 
  getGroqApiKey, 
  setGroqApiKey, 
  testGroqApiKey,
  type RagRetrievalResult 
} from '../services/geminiRagService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  modelUsed?: string;
  sources?: RagRetrievalResult[];
  suggestedAction?: {
    type: 'apply_filters';
    queryText: string;
  };
}

interface UserAiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  units?: ApartmentUnit[];
  onApplyAiSearch: (queryText: string) => void;
}

export const UserAiAdvisorDrawer: React.FC<UserAiAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  units: _units,
  onApplyAiSearch
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Xin chào! Tôi là Haven AI — Trợ lý Không Gian Sống HAVEN.\n\nHãy chia sẻ nhu cầu của bạn (ví dụ: khu vực, ngân sách tối đa, số phòng ngủ, chỗ đỗ ô tô, không gian yên tĩnh hay tránh ngập lụt...). Tôi sẽ phân tích và đề xuất ngay cho bạn.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Groq API Key Inline Config
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState(() => getGroqApiKey());
  const [keyStatusMessage, setKeyStatusMessage] = useState<string>('');
  const [isTestingKey, setIsTestingKey] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Tìm căn 2PN Tây Hồ yên tĩnh có đỗ ô tô',
    'Căn nào tại Đà Nẵng hoàn toàn không ngập lụt?',
    'Chính sách bảo chứng tiền cọc Escrow hoạt động thế nào?',
    'Tiêu chuẩn PCCC QCVN 06 trên app gồm những gì?'
  ];

  const handleSaveGroqKey = async () => {
    setIsTestingKey(true);
    setKeyStatusMessage('Đang kiểm tra kết nối Groq...');
    const result = await testGroqApiKey(groqKeyInput);
    setIsTestingKey(false);
    if (result.valid) {
      setGroqApiKey(groqKeyInput);
      setKeyStatusMessage('✅ ' + result.message);
      setTimeout(() => setShowKeyConfig(false), 1200);
    } else {
      setKeyStatusMessage('⚠️ ' + result.message);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.text
      }));

      const res = await askGeminiRag(query, 'consumer', history);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        modelUsed: res.modelUsed,
        sources: res.sources,
        suggestedAction: res.suggestedAction
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Chào bạn, hiện tại kết nối đang bận một chút. Bạn có thể thử lại câu hỏi nhé!`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Notion AI-Style Floating Window — Anchored in bottom-right with ZERO screen-dimming overlay */
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[440px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-5rem)] rounded-3xl border border-emerald-500/40 liquid-glass-origin bg-slate-950/95 [data-theme='light']_:bg-white/95 flex flex-col justify-between shadow-2xl shadow-emerald-500/20 backdrop-blur-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-left">
      {/* Top Bar Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800/80 [data-theme='light']_:border-slate-200 flex items-center justify-between bg-slate-900/60 [data-theme='light']_:bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-sm font-bold text-slate-100 [data-theme='light']_:text-slate-900">
                Haven AI Advisor
              </h3>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold">
                <Zap className="w-2.5 h-2.5" />
                <span>{getGroqApiKey() ? 'Groq Llama 3.3' : 'Haven AI'}</span>
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 [data-theme='light']_:text-slate-500">
              Tư vấn không gian sống & Phân tích chi phí
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Key Button to configure Groq API Key */}
          <button
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showKeyConfig || getGroqApiKey()
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
            }`}
            title="Cấu hình Groq API Key"
          >
            <Key className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Thu nhỏ cửa sổ"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline Groq Key Configuration Banner */}
      {showKeyConfig && (
        <div className="p-3.5 bg-emerald-950/40 [data-theme='light']_:bg-emerald-50 border-b border-emerald-500/30 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-300 [data-theme='light']_:text-emerald-800 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Kết nối Groq API Key (Llama 3.3 70B Siêu Tốc)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Miễn phí 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={groqKeyInput}
              onChange={(e) => setGroqKeyInput(e.target.value)}
              placeholder="Dán mã gsk_... vào đây"
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSaveGroqKey}
              disabled={isTestingKey || !groqKeyInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold transition-all shrink-0"
            >
              {isTestingKey ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Lưu'}
            </button>
          </div>
          {keyStatusMessage && (
            <p className="text-[10px] font-mono text-slate-300 [data-theme='light']_:text-slate-700">
              {keyStatusMessage}
            </p>
          )}
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-semibold rounded-br-none shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/90 [data-theme=\'light\']_:bg-slate-100 border border-slate-800 [data-theme=\'light\']_:border-slate-200 text-slate-200 [data-theme=\'light\']_:text-slate-800 rounded-bl-none shadow-md leading-relaxed'
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

              {/* Model Tag */}
              {msg.modelUsed && (
                <div className="text-[9px] font-mono text-emerald-400/80 [data-theme='light']_:text-emerald-700">
                  ⚡ {msg.modelUsed}
                </div>
              )}

              {/* Filter Action Chip */}
              {msg.suggestedAction && (
                <button
                  onClick={() => {
                    onApplyAiSearch(msg.suggestedAction!.queryText);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-mono text-[10px] font-semibold transition-colors mt-1"
                >
                  <Filter className="w-3 h-3" />
                  <span>Áp dụng vào trang tìm kiếm</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Typing Loader Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 justify-start items-center">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 [data-theme='light']_:bg-slate-100 border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-300 [data-theme='light']_:text-slate-700 flex items-center gap-2 font-mono text-[11px] shadow-sm">
              <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Haven AI đang phân tích dữ liệu...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-1.5 border-t border-slate-800/80 [data-theme='light']_:border-slate-200 bg-slate-950/60 [data-theme='light']_:bg-slate-50 overflow-x-auto no-scrollbar flex gap-1.5">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-900/90 [data-theme='light']_:bg-white hover:bg-slate-800 border border-slate-800 [data-theme='light']_:border-slate-200 hover:border-emerald-500/40 text-[10px] font-mono text-slate-300 [data-theme='light']_:text-slate-700 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-slate-800/80 [data-theme='light']_:border-slate-200 flex items-center gap-2 bg-slate-950 [data-theme='light']_:bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder="Nhập câu hỏi hoặc nhu cầu thuê nhà..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 [data-theme='light']_:bg-slate-50 border border-slate-800 [data-theme='light']_:border-slate-200 text-slate-100 [data-theme='light']_:text-slate-900 placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 transition-colors shadow-md shadow-emerald-500/20"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
