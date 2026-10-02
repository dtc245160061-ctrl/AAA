import React, { useState, useEffect } from 'react';
import { Search, Plus, Moon, Sun, Monitor, RotateCcw, Bookmark, Menu, Clock, Leaf, Shield, Calendar, CheckCircle2, ChevronDown, Mic, MicOff, Compass, LogIn, LogOut, Crown, UserCheck } from 'lucide-react';
import type { ThemeMode } from '../App';
import { VoiceRecognitionService } from '../services/voiceRecognitionService';

interface TopbarProps {
  isAdminView?: boolean;
  activeModule?: string;
  savedCount?: number;
  onOpenSaved?: () => void;
  onOpenAiCopilot?: () => void;
  onOpenQuickAction?: () => void;
  themeMode?: ThemeMode;
  onThemeChange?: (mode: ThemeMode) => void;
  onResetDemoData?: () => void;
  onToggleMobileSidebar?: () => void;
  onToggleAdminView?: () => void;
  onNavigate?: (module: string) => void;
  onSearchSubmit?: (query: string) => void;
  onOpenLifestyleMatchmaker?: () => void;
  onOpenAuthModal?: () => void;
  currentUser?: { name: string; email: string; avatar: string; role: string } | null;
  onLogout?: () => void;
  onSwitchUserAccount?: (account: { name: string; email: string; role: string; avatar: string; isAdmin: boolean }) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  isAdminView = false,
  activeModule: _activeModule,
  savedCount = 0,
  onOpenSaved,
  onOpenAiCopilot: _onOpenAiCopilot,
  onOpenQuickAction,
  themeMode = 'dark',
  onThemeChange,
  onResetDemoData,
  onToggleMobileSidebar,
  onToggleAdminView,
  onNavigate,
  onSearchSubmit,
  onOpenLifestyleMatchmaker,
  onOpenAuthModal,
  currentUser,
  onLogout,
  onSwitchUserAccount,
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
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global click-outside listener to reliably close dropdowns anywhere on the screen
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

  const [searchValue, setSearchValue] = useState<string>('');
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);

  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    let query = (customQuery || searchValue).trim();
    if (isVoiceListening) {
      const captured = VoiceRecognitionService.stop();
      setIsVoiceListening(false);
      if (captured && captured.trim()) {
        query = captured.trim();
        setSearchValue(query);
      }
    }
    if (!query) return;
    if (!isAdminView) {
      onSearchSubmit?.(query);
      onNavigate?.('user_search');
    }
  };

  const toggleVoiceSearch = () => {
    if (isVoiceListening) {
      const captured = VoiceRecognitionService.stop();
      setIsVoiceListening(false);
      if (captured && captured.trim()) {
        setSearchValue(captured.trim());
        handleSearchSubmit(undefined, captured.trim());
      }
      return;
    }

    const started = VoiceRecognitionService.start({
      lang: 'vi-VN',
      onStart: () => setIsVoiceListening(true),
      onEnd: () => setIsVoiceListening(false),
      onResult: (transcript, isFinal) => {
        setSearchValue(transcript);
        if (isFinal) {
          handleSearchSubmit(undefined, transcript);
        }
      },
      onError: (err) => {
        console.warn('Topbar voice error:', err);
        setIsVoiceListening(false);
      }
    });

    if (!started) {
      alert('Trình duyệt chưa hỗ trợ nhận diện giọng nói hoặc chưa cấp quyền micro.');
    }
  };

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
      className="sticky top-0 w-full bg-[var(--haven-bg)]/95 backdrop-blur-xl border-b border-[var(--haven-border)] px-4 md:px-6 transition-colors z-40"
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
            <button
              onClick={() => {
                if (onNavigate) onNavigate(isAdminView ? 'dashboard' : 'user_home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-mono text-xs text-emerald-400 hover:text-emerald-300 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer group select-none px-2 py-1 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30"
              title={isAdminView ? "Quay về Bảng điều khiển" : "Quay về Trang Chủ"}
            >
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                <Leaf className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
              </div>
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="font-serif text-sm font-bold text-slate-100 [data-theme='light']_:text-slate-900 group-hover:text-emerald-300 transition-colors leading-none">
                  HAVEN
                </span>
                <span className="text-[10px] text-emerald-400 [data-theme='light']_:text-emerald-700 font-mono tracking-widest font-bold hidden lg:inline leading-none">
                  {isAdminView ? 'OPERATIONS' : 'RESIDENTIAL'}
                </span>
              </div>
            </button>
            <span className="text-[var(--haven-text-muted)]">•</span>
            <span className="flex items-center gap-1 text-[var(--haven-text-secondary)] font-medium">
              <Clock className="w-3 h-3 text-[var(--haven-emerald-400)]" />
              <span>{time || '--:--'}</span>
              <span className="text-[9px] text-[var(--haven-text-muted)]">UTC+7</span>
            </span>
          </div>
        </div>

        {/* Center: Global Search with Microphone Voice Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-1.5 sm:mx-3">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#495E35] dark:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={isVoiceListening ? "Đang lắng nghe bạn nói..." : (isAdminView ? "Tìm căn hộ, hợp đồng, cư dân..." : "Tìm thành phố, ngân sách... (Nhấn Enter)")}
              className="w-full pl-9 pr-16 py-2 text-xs sm:text-sm bg-white dark:bg-[#163300] border border-[#163300]/15 dark:border-[#9FE870]/30 rounded-full text-[#163300] dark:text-white placeholder-[#738565] dark:placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-[#9FE870] transition-all font-sans shadow-xs"
            />
            {/* Topbar Action Buttons: Search & Voice */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button
                type="submit"
                title="Tìm kiếm ngay"
                className="p-1.5 rounded-full text-[#495E35] dark:text-emerald-300 hover:text-[#163300] hover:bg-[#E2F7D4] transition-all flex items-center justify-center cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleVoiceSearch}
                title={isVoiceListening ? "Đang lắng nghe... Bấm để dừng" : "Tìm kiếm bằng giọng nói"}
                className={`p-1.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  isVoiceListening
                    ? 'bg-[#FF5436] text-white animate-pulse scale-110 shadow-md shadow-[#FF5436]/40'
                    : 'text-[#495E35] dark:text-emerald-300 hover:text-[#163300] hover:bg-[#E2F7D4]'
                }`}
              >
                {isVoiceListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </form>

        {/* Right: Wise Pill Mode Switcher & Control Group */}
        <div className="flex items-center gap-2">
          {/* Wise Quick Switcher between Tenant & Admin Ops */}
          {onToggleAdminView && (
            <div className="hidden xl:inline-flex items-center p-1 rounded-full bg-[#E8ECE5] dark:bg-[#122405] border border-[#163300]/10 dark:border-[#9FE870]/20">
              <button
                type="button"
                onClick={() => {
                  if (isAdminView) onToggleAdminView();
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !isAdminView
                    ? 'bg-[#163300] text-white shadow-xs'
                    : 'text-[#495E35] dark:text-emerald-200 hover:text-[#163300]'
                }`}
              >
                Khách Thuê
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isAdminView) onToggleAdminView();
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isAdminView
                    ? 'bg-[#9FE870] text-[#163300] shadow-xs'
                    : 'text-[#495E35] dark:text-emerald-200 hover:text-[#163300]'
                }`}
              >
                Quản Trị Sàn
              </button>
            </div>
          )}

          {/* Lifestyle Matchmaker AI (Consumer) - Wise Royal Violet Pill */}
          {!isAdminView && onOpenLifestyleMatchmaker && (
            <button
              onClick={onOpenLifestyleMatchmaker}
              className="h-8 flex items-center gap-1.5 px-3 text-xs font-bold text-[#431A7A] bg-[#F3E8FF] border border-[#8B5CF6]/30 rounded-full hover:bg-[#E9D5FF] transition-all focus-ring shrink-0 hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
              title="Khảo sát phong cách sống AI (Lifestyle Matchmaker)"
            >
              <Compass className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="hidden sm:inline">Khảo Sát AI</span>
            </button>
          )}

          {/* Saved Units (Consumer) - Wise Terracotta Coral Pill */}
          {!isAdminView && (
            <button
              onClick={onOpenSaved}
              className="h-8 flex items-center gap-1.5 px-3 text-xs font-bold text-[#8C1F08] bg-[#FFEAE5] border border-[#FF5436]/25 rounded-full hover:bg-[#FFD6CD] transition-colors focus-ring shrink-0"
              title="Căn hộ đã lưu"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current text-[#FF5436]" />
              <span>{savedCount}</span>
            </button>
          )}

          {/* Quick Action (Admin) - Wise Spring Lime Pill */}
          {isAdminView && onOpenQuickAction && (
            <button
              onClick={onOpenQuickAction}
              className="h-8 flex items-center gap-1.5 px-3.5 text-xs font-black text-[#163300] bg-[#9FE870] hover:bg-[#8CD85E] rounded-full transition-all shadow-xs focus-ring shrink-0 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#163300]" />
              <span className="hidden sm:inline">Tạo Mới</span>
            </button>
          )}

          {/* Theme Switcher with Clear Selection State */}
          <div ref={themeRef} className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="h-8 w-8 flex items-center justify-center text-[#163300] dark:text-emerald-300 bg-white dark:bg-[#163300] border border-[#163300]/15 dark:border-[#9FE870]/30 rounded-full hover:bg-[#F2F5F0] transition-colors focus-ring relative shadow-xs"
              title={`Giao diện hiện tại: ${themeMode === 'light' ? 'Sáng' : themeMode === 'dark' ? 'Tối' : 'Hệ thống'}`}
            >
              <CurrentThemeIcon className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#9FE870]" />
            </button>

            {themeDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 p-2 rounded-2xl bg-slate-900 [data-theme='light']_:bg-white shadow-2xl z-50 space-y-0.5 border border-slate-700 [data-theme='light']_:border-slate-200 animate-in fade-in duration-150"
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
              <div className="absolute right-0 top-full mt-2 w-72 p-2.5 rounded-2xl bg-slate-900 [data-theme='light']_:bg-white shadow-2xl z-50 space-y-2 border border-slate-700 [data-theme='light']_:border-slate-200 animate-in fade-in">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 [data-theme='light']_:bg-slate-50 border border-slate-800 [data-theme='light']_:border-slate-200">
                    <img
                      src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                      alt={currentUser?.name || "Nguyễn An"}
                      className="h-10 w-10 rounded-xl object-cover border border-emerald-500/40"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-serif font-bold text-sm text-white [data-theme='light']_:text-slate-900 truncate">
                          {currentUser?.name || 'Nguyễn An'}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 font-bold truncate">
                        {isAdminView ? 'Ban Quản Trị Sàn' : (currentUser?.role || 'Sanctuary Member')}
                      </div>
                      <div className="text-[10px] font-mono text-slate-200 [data-theme='light']_:text-slate-600 font-medium truncate">
                        {currentUser?.email || 'an.nguyen@haven.luxury'}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1 pt-1">
                    {/* Auth Access Hub Modal Trigger */}
                    {onOpenAuthModal && (
                      <button
                        onClick={() => {
                          onOpenAuthModal();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors text-left font-semibold cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{currentUser ? 'Đổi Tài Khoản / Định Danh' : 'Đăng Nhập / Đăng Ký'}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[9px] font-bold">
                          AUTH
                        </span>
                      </button>
                    )}

                    {/* Role Switcher - Essential for Presentation */}
                    {onToggleAdminView && (
                      <button
                        onClick={() => {
                          onToggleAdminView();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono text-emerald-300 [data-theme='light']_:text-emerald-800 bg-emerald-500/15 [data-theme='light']_:bg-emerald-100 hover:bg-emerald-500/25 border border-emerald-500/40 transition-all text-left font-bold shadow-xs group"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span>{isAdminView ? 'Chuyển Chế Độ Khách (User)' : 'Chuyển Quản Trị (Admin Ops)'}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[9px] font-bold">
                          ĐỔI
                        </span>
                      </button>
                    )}

                    {!isAdminView && (
                      <>
                        <button
                          onClick={() => {
                            onOpenSaved?.();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-slate-200 [data-theme='light']_:text-slate-700 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Căn Hộ Đã Lưu</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold">
                            {savedCount}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate?.('user_checklist');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-200 [data-theme='light']_:text-slate-700 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                        >
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          <span>Lịch Hẹn & Bàn Giao</span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="divider my-1 border-t border-slate-800 [data-theme='light']_:border-slate-200" />

                  {/* 1-Click Fast Role Switcher */}
                  <div className="space-y-1 pt-0.5">
                    <span className="text-[10px] font-mono text-slate-400 [data-theme='light']_:text-slate-600 uppercase px-2 font-bold block">
                      Chuyển Đổi Nhanh Tài Khoản
                    </span>
                    <button
                      onClick={() => {
                        onSwitchUserAccount?.({
                          name: 'Zee Cu Chuối (Admin)',
                          email: 'zeecuchuoi@gmail.com',
                          role: 'Quản Trị Viên (Admin Hệ Thống)',
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                          isAdmin: true
                        });
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                        currentUser?.email === 'zeecuchuoi@gmail.com'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'text-slate-300 [data-theme="light"]_:text-slate-700 hover:bg-slate-800/80 hover:text-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">zeecuchuoi@gmail.com</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold shrink-0">Admin</span>
                    </button>

                    <button
                      onClick={() => {
                        onSwitchUserAccount?.({
                          name: 'DTC ICTU (Cư Dân)',
                          email: 'dtc245160061@ictu.edu.vn',
                          role: 'Khách Thuê Xác Thực (ICTU)',
                          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
                          isAdmin: false
                        });
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                        currentUser?.email === 'dtc245160061@ictu.edu.vn'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'text-slate-300 [data-theme="light"]_:text-slate-700 hover:bg-slate-800/80 hover:text-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">dtc245160061@ictu.edu.vn</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold shrink-0">Thuê</span>
                    </button>
                  </div>

                  <div className="divider my-1 border-t border-slate-800 [data-theme='light']_:border-slate-200" />

                  {/* Logout if authenticated */}
                  {currentUser && onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-left font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" />
                      <span>Đăng Xuất Tài Khoản</span>
                    </button>
                  )}

                  {/* Reset Demo */}
                  <button
                    onClick={() => {
                      handleResetDemo();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition-colors text-left font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục Dữ liệu Demo</span>
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
