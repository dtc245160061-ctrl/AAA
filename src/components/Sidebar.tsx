import React from 'react';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  FileText, 
  Receipt, 
  Sparkles,
  Home,
  Search,
  Bookmark,
  Leaf,
  MessageSquare,
  Crown,
  ShoppingBag,
  Layers,
  ClipboardCheck,
  Compass,
  FolderLock,
  Activity,
  type LucideIcon
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  isAdminView?: boolean;
  activeModule: string;
  setActiveModule: (module: string) => void;
  onOpenAiCopilot: () => void;
  selectedBuilding?: string;
  setSelectedBuilding?: (b: string) => void;
  savedCount?: number;
  pendingLeadsCount?: number;
  unreadMessagesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isAdminView = false,
  activeModule,
  setActiveModule,
  onOpenAiCopilot,
  savedCount = 0,
  pendingLeadsCount = 0,
  unreadMessagesCount = 0
}) => {
  const userNavItems: NavItem[] = [
    { id: 'user_home', label: 'Trang Chủ HAVEN', icon: Home },
    { id: 'user_search', label: 'Tìm Kiếm Căn Hộ', icon: Search },
    { id: 'user_neighborhoods', label: 'Cẩm Nang Khu Vực', icon: Compass },
    { id: 'user_map', label: 'Bản Đồ An Tâm (PCCC/Ngập)', icon: Layers },
    { id: 'user_compare', label: `Đấu Trường So Sánh (${savedCount})`, icon: Bookmark },
    { id: 'user_checklist', label: 'Biên Bản Bàn Giao (15 Mục)', icon: ClipboardCheck },
    { id: 'user_documents', label: 'Kho Tài Liệu & Hợp Đồng', icon: FolderLock },
    { id: 'user_services', label: 'Dịch Vụ Cư Dân (VAS)', icon: ShoppingBag },
    { id: 'user_subscriptions', label: 'Hội Viên Prime Club (0đ Cọc)', icon: Crown },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Tổng Quan Vận Hành', icon: LayoutDashboard },
    { id: 'units', label: 'Căn Hộ & Phòng Trống', icon: Building },
    { 
      id: 'leads', 
      label: 'Yêu Cầu Thuê & Lịch Xem', 
      icon: Users,
      badge: pendingLeadsCount > 0 ? pendingLeadsCount : undefined
    },
    { 
      id: 'inbox', 
      label: 'Tin Nhắn Khách Thuê', 
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    { id: 'contracts', label: 'Hợp Đồng Cho Thuê', icon: FileText },
    { id: 'billing', label: 'Thu Tiền & Hóa Đơn', icon: Receipt },
    { id: 'admin_health', label: 'Kiểm Duyệt & Sức Khỏe Sàn', icon: Activity },
    { id: 'admin_documents', label: 'Kho Pháp Lý & PCCC', icon: FolderLock },
    { id: 'subscriptions', label: 'Gói SaaS Quản Trị', icon: Crown },
    { id: 'services', label: 'Chợ Dịch Vụ Gia Tăng', icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 min-h-screen border-r border-white/[0.07] bg-[#0B0C0E] flex flex-col justify-between p-5 relative z-20">
      <div className="space-y-6">
        {/* Brand Header with Emerald Leaf Icon */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-inner">
            <Leaf className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-white tracking-wider">
              {isAdminView ? 'HAVEN OPS' : 'HAVEN'}
            </h1>
            <span className="text-[10px] font-mono-tech tracking-widest text-emerald-400/80 uppercase block">
              {isAdminView ? 'QUẢN TRỊ CHO THUÊ' : 'RESIDENTIAL SANCTUARY'}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-500 px-3 block mb-2">
            {isAdminView ? 'PHÂN HỆ QUẢN TRỊ' : 'TRẢI NGHIỆM KHÁCH THUÊ'}
          </span>
          <nav className="space-y-1">
            {(isAdminView ? adminNavItems : userNavItems).map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* AI Assistant Trigger */}
      <div className="pt-4 border-t border-white/[0.07] space-y-3">
        <button
          onClick={onOpenAiCopilot}
          className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">
              {isAdminView ? 'AI Quản Trị Vận Hành' : 'Trợ Lý AI HAVEN'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {isAdminView ? 'Phân tích doanh thu & tối ưu tỷ lệ lấp đầy...' : 'Tìm nhà theo phong cách sống...'}
          </p>
        </button>
      </div>
    </aside>
  );
};
