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
  ChevronLeft,
  ChevronRight,
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
  savedCount?: number;
  pendingLeadsCount?: number;
  unreadMessagesCount?: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isAdminView = false,
  activeModule,
  setActiveModule,
  onOpenAiCopilot,
  savedCount = 0,
  pendingLeadsCount = 0,
  unreadMessagesCount = 0,
  collapsed = false,
  onToggleCollapse,
}) => {
  const userNavItems: NavItem[] = [
    { id: 'user_home', label: 'Trang Chủ', icon: Home },
    { id: 'user_search', label: 'Tìm Kiếm', icon: Search },
    { id: 'user_neighborhoods', label: 'Khu Vực', icon: Compass },
    { id: 'user_map', label: 'Bản Đồ PCCC', icon: Layers },
    { id: 'user_compare', label: `So Sánh (${savedCount})`, icon: Bookmark },
    { id: 'user_checklist', label: 'Bàn Giao', icon: ClipboardCheck },
    { id: 'user_documents', label: 'Tài Liệu', icon: FolderLock },
    { id: 'user_services', label: 'Dịch Vụ', icon: ShoppingBag },
    { id: 'user_subscriptions', label: 'Prime Club', icon: Crown },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'units', label: 'Căn Hộ', icon: Building },
    {
      id: 'leads',
      label: 'Yêu Cầu Thuê',
      icon: Users,
      badge: pendingLeadsCount > 0 ? pendingLeadsCount : undefined
    },
    {
      id: 'inbox',
      label: 'Tin Nhắn',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    { id: 'contracts', label: 'Hợp Đồng', icon: FileText },
    { id: 'billing', label: 'Thu Tiền', icon: Receipt },
    { id: 'admin_health', label: 'Sức Khỏe Sàn', icon: Activity },
    { id: 'admin_documents', label: 'Pháp Lý', icon: FolderLock },
    { id: 'subscriptions', label: 'Gói SaaS', icon: Crown },
    { id: 'services', label: 'Dịch Vụ VAS', icon: ShoppingBag },
  ];

  const [time, setTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = isAdminView ? adminNavItems : userNavItems;

  return (
    <aside
      className={`
        hidden md:flex flex-col justify-between min-h-screen
        bg-[var(--haven-bg-subtle)] border-r border-[var(--haven-border)]
        transition-all duration-[var(--duration-standard)] ease-[var(--ease-standard)]
        relative
        ${collapsed ? 'w-16 p-2' : 'w-[260px] p-4'}
      `}
      style={{ zIndex: 'var(--z-navigation)' }}
    >
      <div className="space-y-4">
        {/* Brand with quiet status & clock */}
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center px-0 py-2' : 'px-2 pt-2'}`}>
          <div className="w-8 h-8 rounded-xl bg-[var(--haven-emerald-muted)] border border-[rgba(16,185,129,0.25)] flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 text-[var(--haven-emerald-400)] fill-[rgba(16,185,129,0.2)]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-brand text-[15px] font-display font-bold text-[var(--haven-text-primary)] tracking-wider truncate">
                {isAdminView ? 'HAVEN OPS' : 'HAVEN'}
              </h1>
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-[var(--haven-text-tertiary)] truncate">
                <span className="text-[var(--haven-emerald-400)] font-semibold">
                  {isAdminView ? 'QUẢN TRỊ' : 'SANCTUARY'}
                </span>
                <span>•</span>
                <span>{time || '--:--:--'} UTC+7</span>
              </div>
            </div>
          )}
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div className="px-3">
            <span className="text-label text-[9px]">
              {isAdminView ? 'PHÂN HỆ QUẢN TRỊ' : 'TRẢI NGHIỆM KHÁCH THUÊ'}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} 
                  ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2'}
                  rounded-xl text-[var(--text-sm)] focus-ring
                  transition-all duration-[var(--duration-micro)]
                  ${isActive
                    ? 'bg-[var(--haven-emerald-muted)] text-[var(--haven-emerald-400)] font-semibold border border-[rgba(16,185,129,0.2)]'
                    : 'text-[var(--haven-text-tertiary)] hover:text-[var(--haven-text-secondary)] hover:bg-[var(--haven-surface-hover)] border border-transparent'
                  }
                `}
              >
                <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--haven-emerald-400)]' : ''}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[var(--haven-emerald-500)] text-[var(--haven-text-inverse)] text-[10px] font-mono font-bold min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--haven-emerald-500)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: AI + Collapse toggle */}
      <div className="space-y-2 pt-4 border-t border-[var(--haven-border)]">
        {/* AI Assistant */}
        <button
          onClick={onOpenAiCopilot}
          className={`
            w-full rounded-xl border border-[var(--haven-border)]
            hover:border-[var(--haven-border-accent)]
            bg-[var(--haven-surface-raised)] hover:bg-[var(--haven-surface-hover)]
            transition-all duration-[var(--duration-micro)] focus-ring
            ${collapsed ? 'p-2.5 flex items-center justify-center' : 'p-3 text-left'}
          `}
        >
          <div className={`flex items-center ${collapsed ? '' : 'gap-2'}`}>
            <Sparkles className="w-4 h-4 text-[var(--haven-emerald-400)] shrink-0" />
            {!collapsed && (
              <span className="text-[var(--text-xs)] font-semibold text-[var(--haven-text-secondary)]">
                {isAdminView ? 'AI Copilot' : 'Trợ Lý AI'}
              </span>
            )}
          </div>
        </button>

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center py-2 rounded-xl text-[var(--haven-text-muted)] hover:text-[var(--haven-text-secondary)] hover:bg-[var(--haven-surface-hover)] transition-colors duration-[var(--duration-micro)] focus-ring"
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft className="w-4 h-4" />
            }
          </button>
        )}
      </div>
    </aside>
  );
};
