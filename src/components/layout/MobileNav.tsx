import React from 'react';
import {
  Home,
  Search,
  Bookmark,
  Compass,
  LayoutDashboard,
  Building,
  Users,
  FileText,
  Receipt,
  type LucideIcon,
} from 'lucide-react';

interface MobileNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface MobileNavProps {
  isAdminView: boolean;
  activeModule: string;
  onNavigate: (module: string) => void;
  savedCount?: number;
  pendingLeadsCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isAdminView,
  activeModule,
  onNavigate,
  savedCount = 0,
  pendingLeadsCount = 0,
}) => {
  const consumerItems: MobileNavItem[] = [
    { id: 'user_home', label: 'Trang chủ', icon: Home },
    { id: 'user_search', label: 'Tìm kiếm', icon: Search },
    { id: 'user_compare', label: 'So sánh', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'user_neighborhoods', label: 'Khu vực', icon: Compass },
  ];

  const adminItems: MobileNavItem[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'units', label: 'Căn hộ', icon: Building },
    { id: 'leads', label: 'Yêu cầu', icon: Users, badge: pendingLeadsCount > 0 ? pendingLeadsCount : undefined },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'billing', label: 'Thu tiền', icon: Receipt },
  ];

  const items = isAdminView ? adminItems : consumerItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden flex items-center justify-around bg-[var(--haven-bg)]/95 backdrop-blur-xl border-t border-[var(--haven-border)] px-2 py-1"
      style={{
        height: 'var(--mobile-nav-height)',
        zIndex: 'var(--z-navigation)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              relative flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl
              transition-colors duration-[var(--duration-micro)]
              ${isActive
                ? 'text-[var(--haven-emerald-400)]'
                : 'text-[var(--haven-text-muted)] active:text-[var(--haven-text-secondary)]'
              }
            `}
          >
            <span className="relative">
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.75} />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full bg-[var(--haven-emerald-500)] text-[9px] font-mono font-bold text-[var(--haven-text-inverse)]">
                  {item.badge}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[var(--haven-emerald-400)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
