import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Phone, 
  Building, 
  FileText, 
  Bot, 
  User
} from 'lucide-react';
import type { ChatConversation } from '../types/apartment';
import { ApartmentStore } from '../data/apartmentStore';

interface AdminInboxViewProps {
  conversations: ChatConversation[];
  onRefreshConversations: () => void;
  onCreateContractFromChat?: (conv: ChatConversation) => void;
  onSelectUnit: (unitId: string) => void;
}

export const AdminInboxView: React.FC<AdminInboxViewProps> = ({
  conversations,
  onRefreshConversations,
  onCreateContractFromChat,
  onSelectUnit
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const handleSendAdminReply = () => {
    if (!replyText.trim() || !activeConv) return;

    ApartmentStore.sendMessage(activeConv.id, 'landlord', 'Ban Quản Trị HAVEN', replyText);
    onRefreshConversations();
    setReplyText('');
  };

  const cannedReplies = [
    'Dạ căn này đang sẵn sàng, em xin phép gửi anh/chị xem video thực tế trước ạ!',
    'Lịch xem nhà em đã chốt lúc 15:00 ngày mai, chuyên viên HAVEN sẽ đón anh/chị tại sảnh nhé!',
    'Căn này giá thuê đã bao gồm phí quản lý tòa nhà và chỗ đỗ 01 xe máy ạ.'
  ];

  const filteredConvs = conversations.filter(c => 
    c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.customerPhone.includes(searchQuery)
  );

  return (
    <div className="space-y-8 text-left pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl atmospheric-panel border border-emerald-500/30 space-y-4 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Hộp Thư Tương Tác Trực Tiếp (Shopee-Style Messaging Hub)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold">
              Tin Nhắn Khách Thuê & Tư Vấn
            </h1>
            <p className="text-sm text-slate-400">
              Quản lý toàn bộ trao đổi trực tiếp với khách thuê từ Web Consumer, phản hồi nhanh và chốt hợp đồng ngay trên khung chat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="font-bold">{conversations.reduce((a, b) => a + b.unreadCount, 0)}</span> tin nhắn chưa đọc
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Pane Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px]">
        {/* Left Pane: Conversation List (4 cols) */}
        <div className="lg:col-span-5 atmospheric-panel rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-xl">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm khách hàng, SĐT, căn hộ..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredConvs.map(conv => {
              const isSelected = conv.id === activeConv?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConvId(conv.id);
                    conv.unreadCount = 0;
                    ApartmentStore.saveConversations(conversations);
                  }}
                  className={`p-4 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-emerald-500/15 border-l-4 border-emerald-400' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-slate-100 text-sm">{conv.customerName}</span>
                      {conv.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-mono font-bold">
                          {conv.unreadCount} MỚI
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 line-clamp-1 flex items-center gap-1">
                      <Building className="w-3 h-3 shrink-0" />
                      <span>{conv.unitName}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{conv.lastMessage}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{conv.lastTimestamp}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Message Thread (7 cols) */}
        {activeConv ? (
          <div className="lg:col-span-7 atmospheric-panel rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-xl">
            {/* Header info */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-slate-100 text-base">{activeConv.customerName}</h3>
                  <span className="text-xs font-mono text-slate-400">({activeConv.customerPhone})</span>
                </div>
                <div 
                  onClick={() => onSelectUnit(activeConv.unitId)}
                  className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>{activeConv.unitName} ({activeConv.unitId})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeConv.customerPhone}`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Gọi Điện</span>
                </a>
                <button
                  onClick={() => onCreateContractFromChat?.(activeConv)}
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lập Hợp Đồng Thuê</span>
                </button>
              </div>
            </div>

            {/* Message Thread Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs">
              {activeConv.messages.map((msg) => {
                const isLandlord = msg.sender === 'landlord';
                const isBot = msg.sender === 'bot';

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isLandlord ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isLandlord && (
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isBot ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}>
                        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                    )}

                    <div className={`max-w-[75%] space-y-1 ${isLandlord ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] font-mono text-slate-500 px-1">
                        {msg.senderName} • {msg.timestamp}
                      </div>
                      <div className={`p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                        isLandlord
                          ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm'
                          : isBot
                          ? 'bg-slate-900 text-slate-200 border border-emerald-500/30 rounded-tl-sm'
                          : 'bg-slate-800/90 text-slate-100 border border-slate-700 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>

                    {isLandlord && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Canned Responses */}
            <div className="p-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-mono text-slate-500 px-2 shrink-0">Mẫu trả lời:</span>
              {cannedReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => setReplyText(reply)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 text-[11px] font-mono whitespace-nowrap transition-all"
                >
                  {reply.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Reply Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendAdminReply();
                }}
                placeholder="Nhập tin nhắn phản hồi cho khách..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs font-sans focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendAdminReply}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 shrink-0 hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 atmospheric-panel rounded-3xl border border-slate-800 flex items-center justify-center p-8 text-center text-slate-500">
            <p>Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};
