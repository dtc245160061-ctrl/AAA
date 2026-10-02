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
    <div className="space-y-4 text-left pb-4 animate-in fade-in duration-300 flex flex-col h-[calc(100vh-80px)]">
      {/* Header Banner - Wise Signature Style */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#163300] dark:text-[#9FE870] uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#20A05A]" />
              <span>Hộp Thư Trực Tiếp (Live Messaging Hub)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#163300] dark:text-white">
              Tin Nhắn Khách Thuê & Tư Vấn Căn Hộ
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-[#E8F8EC] text-[#163300] border border-[#9FE870] text-xs font-bold shadow-sm">
              <span className="font-bold">{conversations.reduce((a, b) => a + b.unreadCount, 0)}</span> tin nhắn mới
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Pane Chat Container - Fitted to Remaining Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left Pane: Conversation List (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
          {/* Search bar */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-[#F2F5F0]/50 dark:bg-slate-800/40">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm khách hàng, SĐT, căn hộ..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
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
                    isSelected 
                      ? 'bg-[#E8F8EC] dark:bg-slate-800 border-l-4 border-l-[#163300] dark:border-l-[#9FE870]' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#163300] dark:text-white text-sm">{conv.customerName}</span>
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF5436] text-white text-[10px] font-bold">
                          {conv.unreadCount} MỚI
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#20A05A] font-bold line-clamp-1 flex items-center gap-1">
                      <Building className="w-3 h-3 shrink-0" />
                      <span>{conv.unitName}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{conv.lastMessage}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">{conv.lastTimestamp}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Message Thread (7 cols) */}
        {activeConv ? (
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
            {/* Header info */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-[#F2F5F0]/30 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#163300] dark:text-white text-base">{activeConv.customerName}</h3>
                  <span className="text-xs text-slate-500 font-medium">({activeConv.customerPhone})</span>
                </div>
                <div 
                  onClick={() => onSelectUnit(activeConv.unitId)}
                  className="text-xs font-bold text-[#20A05A] hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>{activeConv.unitName} ({activeConv.unitId})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeConv.customerPhone}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#F2F5F0] hover:bg-slate-200 dark:bg-slate-800 text-[#163300] dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#20A05A]" />
                  <span className="hidden sm:inline">Gọi Điện</span>
                </a>
                <button
                  onClick={() => onCreateContractFromChat?.(activeConv)}
                  className="px-4 py-2 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lập Hợp Đồng</span>
                </button>
              </div>
            </div>

            {/* Message Thread Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              {activeConv.messages.map((msg) => {
                const isLandlord = msg.sender === 'landlord';
                const isBot = msg.sender === 'bot';

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isLandlord ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isLandlord && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isBot ? 'bg-[#EBF2FF] text-[#2570EB]' : 'bg-[#F2F5F0] dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                    )}

                    <div className={`max-w-[75%] space-y-1 ${isLandlord ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] text-slate-400 px-1 font-medium">
                        {msg.senderName} • {msg.timestamp}
                      </div>
                      <div className={`p-4 rounded-[20px] leading-relaxed shadow-sm ${
                        isLandlord
                          ? 'bg-[#9FE870] text-[#163300] font-medium rounded-tr-sm'
                          : isBot
                          ? 'bg-[#EBF2FF] dark:bg-slate-800 text-[#2570EB] dark:text-blue-300 border border-[#2570EB]/20 rounded-tl-sm'
                          : 'bg-[#F2F5F0] dark:bg-slate-800 text-[#163300] dark:text-white rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>

                    {isLandlord && (
                      <div className="w-8 h-8 rounded-full bg-[#163300] text-[#9FE870] flex items-center justify-center shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Canned Responses - Wise Pill Style */}
            <div className="p-2.5 bg-[#F2F5F0]/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-slate-500 px-2 shrink-0">Gợi ý nhanh:</span>
              {cannedReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => setReplyText(reply)}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#163300] dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm"
                >
                  {reply.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Reply Input Bar */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendAdminReply();
                }}
                placeholder="Nhập tin nhắn phản hồi cho khách..."
                className="flex-1 px-4 py-2.5 rounded-full bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#163300] dark:text-white placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
              />
              <button
                onClick={handleSendAdminReply}
                className="p-2.5 rounded-full bg-[#9FE870] hover:bg-[#8CD860] text-[#163300] font-bold transition-all shadow-sm shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 flex items-center justify-center p-8 text-center text-slate-500">
            <p>Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};
