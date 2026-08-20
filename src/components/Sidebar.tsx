import React from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  Receipt,
  Home,
  Search,
  Leaf,
  MessageSquare,
  Crown,
  ShoppingBag,
  Layers,
  ClipboardCheck,
  Compass,
  FolderLock,
  Activity,
  Menu,
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
  onOpenAiCopilot?: () => void;
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
        hidden md:flex flex-col justify-between sticky top-0 h-screen shrink-0
        bg-[var(--haven-bg-subtle)] border-r border-[var(--haven-border)]
        transition-[width] duration-200 ease-out
        overflow-y-auto overflow-x-hidden z-40 px-3.5 py-3
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
      `}
      style={{ zIndex: 'var(--z-sticky)' }}
    >
      <div className="space-y-4">
        {/* Top Header: Fixed Hamburger Button & Brand */}
        <div className="flex items-center gap-2.5 h-11">
          {/* YouTube-style Hamburger Button at permanent fixed position */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[var(--haven-text-secondary)] hover:text-[var(--haven-emerald-400)] hover:bg-[var(--haven-surface-hover)] transition-colors focus-ring shrink-0"
              title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
              aria-label="Thu gọn / Mở rộng thanh bên"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Brand details when expanded */}
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-[var(--haven-emerald-muted)] border border-[rgba(16,185,129,0.25)] flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 text-[var(--haven-emerald-400)] fill-[rgba(16,185,129,0.2)]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-brand text-[13px] font-bold text-[var(--haven-text-primary)] tracking-wider truncate">
                  {isAdminView ? 'HAVEN OPS' : 'HAVEN'}
                </h1>
                <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--haven-text-tertiary)] truncate">
                  <span className="text-[var(--haven-emerald-400)] font-semibold">
                    {isAdminView ? 'QUẢN TRỊ' : 'SANCTUARY'}
                  </span>
                  <span>•</span>
                  <span>{time || '--:--'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Label (Expanded only) */}
        {!collapsed && (
          <div className="px-2 pt-1 pb-0.5 animate-in fade-in duration-200">
            <span className="text-label text-[9px] uppercase tracking-wider text-[var(--haven-text-muted)] block truncate font-mono">
              {isAdminView ? 'PHÂN HỆ QUẢN TRỊ' : 'TRẢI NGHIỆM KHÁCH THUÊ'}
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full h-11 flex items-center rounded-xl focus-ring
                  transition-all duration-150 relative group
                  ${isActive
                    ? 'bg-[var(--haven-emerald-muted)] text-[var(--haven-emerald-400)] font-semibold border border-[rgba(16,185,129,0.25)] shadow-xs'
                    : 'text-[var(--haven-text-secondary)] hover:text-[var(--haven-text-primary)] hover:bg-[var(--haven-surface-hover)] border border-transparent'
                  }
                `}
              >
                {/* Fixed Icon Container: Exactly 44px wide, centered in 44px space */}
                <div className="w-11 h-11 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 transition-transform duration-150 group-hover:scale-110 ${isActive ? 'text-[var(--haven-emerald-400)]' : ''}`} />
                </div>

                {/* Label text when expanded */}
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between pr-2.5 min-w-0 animate-in fade-in duration-150">
                    <span className="truncate text-[13px] font-sans font-medium">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[var(--haven-emerald-500)] text-slate-950 text-[10px] font-mono font-bold min-w-[18px] text-center shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Badge dot when collapsed */}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--haven-emerald-500)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Clean bottom spacer */}
      <div className="pt-2" />
    </aside>
  );
};
