import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  Filter, 
  Loader2
} from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { askGeminiRag, type RagRetrievalResult } from '../services/geminiRagService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
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
      text: `Xin chào! Tôi là Haven AI — Trợ lý Tư Vấn Không Gian Sống HAVEN.\n\nHãy chia sẻ mong muốn của bạn (ví dụ: thành phố, tầm ngân sách hàng tháng, số phòng ngủ, chỗ đỗ xe ô tô, yêu cầu yên tĩnh hay tránh ngập lụt...). Tôi sẽ phân tích và đề xuất các căn hộ phù hợp nhất cho bạn ngay lập tức.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Tìm căn 2PN Tây Hồ yên tĩnh có đỗ ô tô',
    'Căn nào tại Đà Nẵng hoàn toàn không ngập lụt?',
    'Chính sách bảo chứng tiền cọc Escrow hoạt động thế nào?',
    'Tiêu chuẩn PCCC QCVN 06 trên app gồm những gì?'
  ];

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
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Floating Drawer Container shifted leftwards with margin */}
      <div className="fixed inset-y-0 right-0 max-w-full flex items-center justify-end p-3 sm:p-6 sm:mr-4 pointer-events-none">
        <div className="w-screen max-w-md h-[94vh] rounded-3xl border border-emerald-500/30 liquid-glass-origin bg-slate-950/95 flex flex-col justify-between shadow-2xl backdrop-blur-2xl overflow-hidden pointer-events-auto text-left">
          {/* Top Bar Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-slate-100 font-bold">Haven AI Advisor</h3>
                <p className="text-[11px] font-mono text-emerald-400">Tìm Kiếm Ngôn Ngữ Tự Nhiên & Môi Trường</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-sans text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1 shadow-md shadow-emerald-500/10">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] p-4 rounded-2xl space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-semibold rounded-br-none shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg leading-relaxed'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Filter Action Chip */}
                  {msg.suggestedAction && (
                    <button
                      onClick={() => {
                        onApplyAiSearch(msg.suggestedAction!.queryText);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-mono text-[11px] font-semibold transition-colors mt-2"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Áp dụng bộ lọc này vào trang tìm kiếm</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Loader Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2.5 font-mono text-xs shadow-lg">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Haven AI đang phân tích dữ liệu...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto no-scrollbar flex gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-mono text-slate-300 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-slate-800/80 flex items-center gap-2 bg-slate-950">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Nhập câu hỏi hoặc nhu cầu thuê nhà..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 transition-colors shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
