import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

          <div className="hidden sm:flex items-center gap-2.5 min-w-0 font-sans text-xs">
            <button
              onClick={() => {
                if (onNavigate) onNavigate(isAdminView ? 'dashboard' : 'user_home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 cursor-pointer group select-none px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isAdminView ? "Quay về Bảng điều khiển" : "Quay về Trang Chủ"}
            >
              <div className="w-6 h-6 rounded-xl bg-[#9FE870] flex items-center justify-center text-[#163300] shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <Leaf className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="flex items-center gap-2 leading-none">
                <span className="font-black text-base text-[#163300] dark:text-white tracking-tight">
                  HAVEN
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#9FE870]/25 text-[#163300] dark:text-[#9FE870] text-[9.5px] font-bold tracking-wide uppercase hidden lg:inline">
                  {isAdminView ? 'Operations' : 'Residential'}
                </span>
              </div>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium tabular-nums">
              <Clock className="w-3.5 h-3.5 text-[#20A05A] dark:text-[#9FE870]" />
              <span>{time || '--:--'}</span>
              <span className="text-[10px] text-slate-400">UTC+7</span>
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
        <div className="flex items-center gap-3">
          {/* Wise Quick Switcher between Tenant & Admin Ops with Smooth Sliding Pill */}
          {onToggleAdminView && (
            <div className="hidden xl:inline-flex items-center p-1 bg-[#E8ECE5] dark:bg-slate-800 rounded-full border border-[#163300]/10 dark:border-slate-700/80 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  if (isAdminView) onToggleAdminView();
                }}
                className={`relative px-4 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-full select-none ${
                  !isAdminView
                    ? 'text-[#163300] dark:text-[#9FE870]'
                    : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300] dark:hover:text-white'
                }`}
              >
                {!isAdminView && (
                  <motion.div
                    layoutId="portal-active-pill"
                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-xs border border-black/5 dark:border-white/10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Khách Thuê</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isAdminView) onToggleAdminView();
                }}
                className={`relative px-4 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-full select-none ${
                  isAdminView
                    ? 'text-[#163300] dark:text-[#9FE870]'
                    : 'text-[#495E35] dark:text-slate-400 hover:text-[#163300] dark:hover:text-white'
                }`}
              >
                {isAdminView && (
                  <motion.div
                    layoutId="portal-active-pill"
                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-xs border border-black/5 dark:border-white/10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Quản Trị Sàn</span>
              </button>
            </div>
          )}

          {/* Dynamic Action Buttons with Stable Width Container to Prevent Layout Shift */}
          <div className="flex items-center justify-end gap-2 min-w-[155px] shrink-0">
            {!isAdminView ? (
              <>
                {/* Lifestyle Matchmaker AI (Consumer) - Wise Royal Violet Pill */}
                {onOpenLifestyleMatchmaker && (
                  <button
                    onClick={onOpenLifestyleMatchmaker}
                    className="h-8 flex items-center gap-1.5 px-3 text-xs font-bold text-[#431A7A] bg-[#F3E8FF] border border-[#8B5CF6]/30 rounded-full hover:bg-[#E9D5FF] transition-all shrink-0 hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                    title="Khảo sát phong cách sống AI (Lifestyle Matchmaker)"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span className="hidden sm:inline">Khảo Sát AI</span>
                  </button>
                )}

                {/* Saved Units (Consumer) - Wise Terracotta Coral Pill */}
                <button
                  onClick={onOpenSaved}
                  className="h-8 flex items-center gap-1.5 px-3 text-xs font-bold text-[#8C1F08] bg-[#FFEAE5] border border-[#FF5436]/25 rounded-full hover:bg-[#FFD6CD] transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  title="Căn hộ đã lưu"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current text-[#FF5436]" />
                  <span>{savedCount}</span>
                </button>
              </>
            ) : (
              /* Quick Action (Admin) - Wise Spring Lime Pill */
              onOpenQuickAction && (
                <button
                  onClick={onOpenQuickAction}
                  className="h-8 flex items-center gap-1.5 px-4 text-xs font-black text-[#163300] bg-[#9FE870] hover:bg-[#8CD85E] rounded-full transition-all shadow-xs shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-[#163300]" />
                  <span>Tạo Mới</span>
                </button>
              )
            )}
          </div>

          {/* Theme Switcher with Clear Selection State */}
          <div ref={themeRef} className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="h-8 w-8 flex items-center justify-center text-[#163300] dark:text-emerald-300 bg-white dark:bg-[#163300] border border-[#163300]/15 dark:border-[#9FE870]/30 rounded-full hover:bg-[#F2F5F0] transition-colors focus-ring relative shadow-xs cursor-pointer"
              title={`Giao diện hiện tại: ${themeMode === 'light' ? 'Sáng' : themeMode === 'dark' ? 'Tối' : 'Hệ thống'}`}
            >
              <CurrentThemeIcon className="w-3.5 h-3.5 text-[#163300] dark:text-[#9FE870]" />
              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#9FE870]" />
            </button>

            {themeDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 p-2 rounded-[22px] bg-white dark:bg-slate-900 shadow-xl z-50 space-y-1 border border-slate-200/90 dark:border-slate-800 animate-in fade-in duration-150"
              >
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 py-1 block tracking-wider">
                  GIAO DIỆN
                </span>
                {themeOptions.map(({ mode, label, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => {
                      onThemeChange?.(mode);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      themeMode === mode
                        ? 'bg-[#E8F8EC] text-[#163300] dark:bg-emerald-950/40 dark:text-[#9FE870] font-bold'
                        : 'text-[#495E35] dark:text-slate-300 hover:bg-[#F2F5F0] dark:hover:bg-slate-800 hover:text-[#163300]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#20A05A]" />
                      <span>{label}</span>
                    </div>
                    {themeMode === mode && <span className="w-2 h-2 rounded-full bg-[#20A05A]" />}
                  </button>
                ))}

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={handleResetDemo}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#FF5436] hover:bg-[#FFEAE5] dark:hover:bg-rose-950/30 transition-all text-left cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#FF5436]" />
                  <span>Khôi phục Dữ liệu Demo</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive User Profile with Dropdown */}
          <div ref={profileRef} className="relative pl-1 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#9FE870] transition-all cursor-pointer"
              title="Xem hồ sơ cá nhân"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="Nguyễn An"
                className="h-8 w-8 rounded-full object-cover border border-[#163300]/15 dark:border-[#9FE870]/30 shadow-2xs"
              />
              <ChevronDown className="w-3 h-3 text-[#495E35] dark:text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 p-3 rounded-[28px] bg-white dark:bg-slate-900 shadow-2xl z-50 space-y-2.5 border border-slate-200/90 dark:border-slate-800 animate-in fade-in duration-150">
                {/* User Profile Header Card */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F2F5F0] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <img
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                    alt={currentUser?.name || "Nguyễn An"}
                    className="h-10 w-10 rounded-full object-cover border-2 border-[#9FE870] shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#163300] dark:text-white truncate">
                        {currentUser?.name || 'Nguyễn An'}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#20A05A] shrink-0" />
                    </div>
                    <div className="text-[11px] font-bold text-[#20A05A] dark:text-[#9FE870] truncate">
                      {isAdminView ? 'Ban Quản Trị Sàn' : (currentUser?.role || 'Hội Viên Cư Dân Prime')}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {currentUser?.email || 'an.nguyen@haven.luxury'}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1 pt-0.5">
                  {/* Auth Access Hub Modal Trigger */}
                  {onOpenAuthModal && (
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#163300] dark:text-slate-200 hover:bg-[#F2F5F0] dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogIn className="w-4 h-4 text-[#20A05A]" />
                        <span>{currentUser ? 'Đổi Tài Khoản / Định Danh' : 'Đăng Nhập / Đăng Ký'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#E8F8EC] text-[#163300] border border-[#9FE870] text-[10px] font-bold">
                        CCCD
                      </span>
                    </button>
                  )}

                  {/* Role Switcher */}
                  {onToggleAdminView && (
                    <button
                      onClick={() => {
                        onToggleAdminView();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-[#E8F8EC] dark:bg-emerald-950/40 hover:bg-[#D4F4DA] text-[#163300] dark:text-[#9FE870] border border-[#9FE870]/40 transition-all text-left font-bold cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-4 h-4 text-[#20A05A]" />
                        <span>{isAdminView ? 'Chuyển Chế Độ Khách Thuê' : 'Chuyển Quản Trị Sàn'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#163300] text-[#9FE870] text-[10px] font-bold">
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
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#163300] dark:text-slate-200 hover:bg-[#F2F5F0] dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bookmark className="w-4 h-4 text-[#FF5436]" />
                          <span>Căn Hộ Đã Lưu</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#FFEAE5] text-[#8C1F08] font-bold text-[10px]">
                          {savedCount}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate?.('user_checklist');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#163300] dark:text-slate-200 hover:bg-[#F2F5F0] dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-[#2570EB]" />
                        <span>Lịch Hẹn & Bàn Giao</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                {/* 1-Click Fast Role Switcher */}
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 tracking-wider block">
                    CHUYỂN ĐỔI TÀI KHOẢN NHANH
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      currentUser?.email === 'zeecuchuoi@gmail.com'
                        ? 'bg-[#FFF6DB] text-[#7A5200] border border-[#FFC83B]/40 font-bold'
                        : 'text-[#495E35] dark:text-slate-300 hover:bg-[#F2F5F0] dark:hover:bg-slate-800 hover:text-[#163300]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Crown className="w-4 h-4 text-[#E5A000] shrink-0" />
                      <span className="truncate">zeecuchuoi@gmail.com</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFC83B] text-[#7A5200] font-bold shrink-0">Admin</span>
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      currentUser?.email === 'dtc245160061@ictu.edu.vn'
                        ? 'bg-[#E8F8EC] text-[#163300] border border-[#9FE870] font-bold'
                        : 'text-[#495E35] dark:text-slate-300 hover:bg-[#F2F5F0] dark:hover:bg-slate-800 hover:text-[#163300]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <UserCheck className="w-4 h-4 text-[#20A05A] shrink-0" />
                      <span className="truncate">dtc245160061@ictu.edu.vn</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#9FE870] text-[#163300] font-bold shrink-0">Thuê</span>
                  </button>
                </div>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                {/* Logout if authenticated */}
                {currentUser && onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-[#F2F5F0] dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span>Đăng Xuất Tài Khoản</span>
                  </button>
                )}

                {/* Reset Demo */}
                <button
                  onClick={() => {
                    handleResetDemo();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#FF5436] hover:bg-[#FFEAE5] dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#FF5436]" />
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
