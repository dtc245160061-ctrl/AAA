import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Plus, Moon, Sun, Monitor, RotateCcw, Bookmark, Menu, Clock, Shield, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import type { ThemeMode } from '../App';

interface TopbarProps {
  isAdminView?: boolean;
  savedCount?: number;
  onOpenSaved?: () => void;
  onOpenAiCopilot: () => void;
  onOpenQuickAction?: () => void;
  themeMode?: ThemeMode;
  onThemeChange?: (mode: ThemeMode) => void;
  onResetDemoData?: () => void;
  onToggleMobileSidebar?: () => void;
  onToggleAdminView?: () => void;
  onNavigate?: (module: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  isAdminView = false,
  savedCount = 0,
  onOpenSaved,
  onOpenAiCopilot,
  onOpenQuickAction,
  themeMode = 'dark',
  onThemeChange,
  onResetDemoData,
  onToggleMobileSidebar,
  onToggleAdminView,
  onNavigate,
}) => {
  const [time, setTime] = useState<string>('');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const themeRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  // Global click-outside listener to reliably close dropdowns
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (profileDropdownOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (themeDropdownOpen && themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [profileDropdownOpen, themeDropdownOpen]);

  const handleResetDemo = () => {
    onResetDemoData?.();
    setThemeDropdownOpen(false);
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'dark', label: 'Tối', icon: Moon },
    { mode: 'light', label: 'Sáng', icon: Sun },
    { mode: 'system', label: 'Hệ thống', icon: Monitor },
  ];

  const CurrentThemeIcon = themeMode === 'light' ? Sun : themeMode === 'system' ? Monitor : Moon;

  return (
    <header
      className="sticky top-0 w-full bg-[var(--haven-bg)]/95 backdrop-blur-xl border-b border-[var(--haven-border)] px-4 md:px-6 transition-colors"
      style={{
        height: 'var(--topbar-height)',
        zIndex: 'var(--z-sticky)',
      }}
    >
      <div className="flex items-center justify-between gap-3 h-full">
        {/* Left: Mobile menu + Brand & Clock Context */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-lg text-[var(--haven-text-tertiary)] hover:text-[var(--haven-text-primary)] hover:bg-[var(--haven-surface-hover)] transition-colors focus-ring"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 min-w-0 font-mono text-[11px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--haven-emerald-400)]">
              {isAdminView ? 'QUẢN LÝ VẬN HÀNH' : 'HAVEN RESIDENTIAL'}
            </span>
            <span className="text-[var(--haven-text-muted)]">•</span>
            <span className="flex items-center gap-1 text-[var(--haven-text-secondary)] font-medium">
              <Clock className="w-3 h-3 text-[var(--haven-emerald-400)]" />
              <span>{time || '--:--:--'}</span>
              <span className="text-[9px] text-[var(--haven-text-muted)]">UTC+7</span>
            </span>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--haven-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isAdminView ? "Tìm căn hộ, cư dân..." : "Tìm thành phố, ngân sách..."}
              className="w-full pl-9 pr-4 py-1.5 text-[var(--text-sm)] bg-[var(--haven-surface-raised)] border border-[var(--haven-border)] rounded-[var(--radius-lg)] text-[var(--haven-text-primary)] placeholder-[var(--haven-text-muted)] focus:outline-none focus:border-[var(--haven-border-focus)] transition-colors font-[var(--font-mono)]"
            />
          </div>
        </div>

        {/* Right: Normalized Control Group */}
        <div className="flex items-center gap-2">
          {/* Saved Units (Consumer) */}
          {!isAdminView && (
            <button
              onClick={onOpenSaved}
              className="h-8 flex items-center gap-1.5 px-3 text-[var(--text-xs)] font-mono font-medium text-[var(--haven-emerald-400)] bg-[var(--haven-emerald-muted)] border border-[var(--haven-border-accent)] rounded-[var(--radius-lg)] hover:bg-[rgba(16,185,129,0.18)] transition-colors focus-ring shrink-0"
              title="Căn hộ đã lưu"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{savedCount}</span>
            </button>
          )}

          {/* AI Assistant Button with Subtle Breathing Pulse */}
          <button
            onClick={onOpenAiCopilot}
            className="h-8 flex items-center gap-1.5 px-3 text-[var(--text-xs)] font-medium text-[var(--haven-text-secondary)] bg-[var(--haven-surface-raised)] border border-[var(--haven-border)] rounded-[var(--radius-lg)] hover:bg-[var(--haven-surface-hover)] hover:border-[var(--haven-border-accent)] transition-colors focus-ring shrink-0 group"
            title="Haven AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--haven-emerald-400)] animate-pulse" />
            <span className="hidden sm:inline font-mono">{isAdminView ? 'AI' : 'Haven AI'}</span>
          </button>

          {/* Quick Action (Admin) */}
          {isAdminView && onOpenQuickAction && (
            <button
              onClick={onOpenQuickAction}
              className="h-8 flex items-center gap-1.5 px-3 text-[var(--text-xs)] font-semibold text-[var(--haven-text-inverse)] bg-[var(--haven-emerald-500)] hover:bg-[var(--haven-emerald-400)] rounded-[var(--radius-lg)] transition-colors shadow-sm focus-ring shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tạo Mới</span>
            </button>
          )}

          {/* Theme Switcher with Clear Selection State */}
          <div ref={themeRef} className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="h-8 w-8 flex items-center justify-center text-[var(--haven-text-secondary)] hover:text-[var(--haven-text-primary)] bg-[var(--haven-surface-raised)] border border-[var(--haven-border)] rounded-[var(--radius-lg)] hover:bg-[var(--haven-surface-hover)] hover:border-[var(--haven-border-accent)] transition-colors focus-ring relative"
              title={`Giao diện hiện tại: ${themeMode === 'light' ? 'Sáng' : themeMode === 'dark' ? 'Tối' : 'Hệ thống'}`}
            >
              <CurrentThemeIcon className="w-3.5 h-3.5 text-[var(--haven-emerald-400)]" />
              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--haven-emerald-400)]" />
            </button>

            {themeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)} />

                <div
                  className="absolute right-0 top-full mt-2 w-44 p-1.5 rounded-[var(--radius-xl)] surface-elevated shadow-[var(--shadow-overlay)] z-50 space-y-0.5 border border-[var(--haven-border)]"
                >
                  <span className="text-label text-[9px] px-2 py-1 block">
                    GIAO DIỆN
                  </span>
                  {themeOptions.map(({ mode, label, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => {
                        onThemeChange?.(mode);
                        setThemeDropdownOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-2.5 py-1.5
                        rounded-[var(--radius-md)] text-[var(--text-xs)] font-mono
                        transition-colors
                        ${themeMode === mode
                          ? 'bg-[var(--haven-emerald-muted)] text-[var(--haven-emerald-400)] font-semibold border border-[var(--haven-border-accent)]'
                          : 'text-[var(--haven-text-secondary)] hover:bg-[var(--haven-surface-hover)] hover:text-[var(--haven-text-primary)]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </div>
                      {themeMode === mode && <span className="status-dot status-dot-active" />}
                    </button>
                  ))}

                  <div className="divider my-1" />

                  <button
                    onClick={handleResetDemo}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-mono text-[var(--haven-rose-400)] hover:bg-[var(--haven-rose-muted)] transition-colors text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục Demo</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Interactive User Profile with Dropdown */}
          <div ref={profileRef} className="relative pl-1 border-l border-[var(--haven-border)]">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 p-0.5 rounded-[var(--radius-lg)] hover:ring-2 hover:ring-[var(--haven-emerald-400)] transition-all focus-ring"
              title="Xem hồ sơ cá nhân"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="Nguyễn An"
                className="h-8 w-8 rounded-[var(--radius-lg)] object-cover border border-[var(--haven-border)]"
              />
              <ChevronDown className="w-3 h-3 text-[var(--haven-text-muted)] hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-[var(--radius-xl)] surface-elevated shadow-[var(--shadow-overlay)] z-50 space-y-1.5 border border-[var(--haven-border)] animate-in fade-in">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--haven-surface-raised)] border border-[var(--haven-border)]">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                      alt="Nguyễn An"
                      className="h-10 w-10 rounded-xl object-cover border border-[var(--haven-border-accent)]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-serif font-bold text-sm text-[var(--haven-text-primary)] truncate">Nguyễn An</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--haven-emerald-400)] shrink-0" />
                      </div>
                      <div className="text-[10px] font-mono text-[var(--haven-emerald-400)] font-medium">
                        Sanctuary Member
                      </div>
                      <div className="text-[10px] font-mono text-[var(--haven-text-muted)] truncate">
                        an.nguyen@haven.luxury
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-0.5 pt-1">
                    {!isAdminView && (
                      <>
                        <button
                          onClick={() => {
                            onOpenSaved?.();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-[var(--haven-text-secondary)] hover:text-[var(--haven-text-primary)] hover:bg-[var(--haven-surface-hover)] transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Bookmark className="w-3.5 h-3.5 text-[var(--haven-emerald-400)]" />
                            <span>Căn Hộ Đã Lưu</span>
                          </div>
                          <span className="px-1.5 py-0.2 rounded-full bg-[var(--haven-emerald-500)] text-white text-[10px] font-mono font-bold">
                            {savedCount}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate?.('user_checklist');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-[var(--haven-text-secondary)] hover:text-[var(--haven-text-primary)] hover:bg-[var(--haven-surface-hover)] transition-colors text-left"
                        >
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          <span>Lịch Hẹn & Bàn Giao</span>
                        </button>
                      </>
                    )}

                    {onToggleAdminView && (
                      <button
                        onClick={() => {
                          onToggleAdminView();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-[var(--haven-emerald-400)] bg-[var(--haven-emerald-muted)] hover:bg-[rgba(16,185,129,0.2)] border border-[var(--haven-border-accent)] transition-colors text-left font-semibold"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>{isAdminView ? 'Chuyển Chế Độ Khách Thuê' : 'Chuyển Quản Trị (Admin Ops)'}</span>
                      </button>
                    )}
                  </div>

                  <div className="divider my-1" />

                  {/* Reset Demo & Logout */}
                  <button
                    onClick={() => {
                      handleResetDemo();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-[var(--haven-text-tertiary)] hover:text-[var(--haven-rose-400)] hover:bg-[var(--haven-rose-muted)] transition-colors text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục Dữ liệu Demo</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
