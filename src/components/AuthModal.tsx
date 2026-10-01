import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  UserCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string; avatar: string; role: string }) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

type AuthTab = 'login' | 'register';
type RegisterStep = 'input_info' | 'verify_otp';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('input_info');

  // Single Unified Login Input (Email or Phone)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Fields
  const [registerIdentifier, setRegisterIdentifier] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // OTP Fields
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (registerStep === 'verify_otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [registerStep, otpTimer]);

  if (!isOpen) return null;

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://esgzwwpvzdwsjkkeryeu.supabase.co';
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rM3Noo8PgnXEByo9SOZ4Dw_vbqk8SW6';

  // Fast 1-Click Login for User's 2 Exact Accounts
  const handleFastLogin = (accountType: 'admin' | 'resident') => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (accountType === 'admin') {
        const adminUser = {
          name: 'Zee Củ Chuối',
          email: 'zeecuchuoi@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          role: 'Hệ Thống Quản Trị Viên (Admin)',
        };
        localStorage.setItem('haven_current_user', JSON.stringify(adminUser));
        setIsSubmitting(false);
        onAuthSuccess(adminUser);
        onShowToast('success', 'Đăng nhập Quản trị viên thành công!', 'Chào mừng zeecuchuoi@gmail.com quay lại trang quản trị.');
        onClose();
      } else {
        const residentUser = {
          name: 'DTC Sinh Viên ICTU',
          email: 'dtc245160061@ictu.edu.vn',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          role: 'Cư Dân ICTU (Khách Thuê)',
        };
        localStorage.setItem('haven_current_user', JSON.stringify(residentUser));
        setIsSubmitting(false);
        onAuthSuccess(residentUser);
        onShowToast('success', 'Đăng nhập Khách thuê thành công!', 'Chào mừng dtc245160061@ictu.edu.vn khám phá căn hộ HAVEN.');
        onClose();
      }
    }, 350);
  };

  // Google Login
  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const demoUser = {
        name: 'Zee Củ Chuối (Google)',
        email: 'zeecuchuoi@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        role: 'Hệ Thống Quản Trị Viên (Admin)',
      };
      localStorage.setItem('haven_current_user', JSON.stringify(demoUser));
      setIsSubmitting(false);
      onAuthSuccess(demoUser);
      onShowToast('success', 'Đăng nhập Google thành công!', 'Đã liên kết tài khoản zeecuchuoi@gmail.com.');
      onClose();
    }, 450);
  };

  // Social Logins (Zalo, Apple, Facebook)
  const handleMockSocialLogin = (provider: 'Zalo' | 'Apple' | 'Facebook') => {
    if (provider === 'Zalo') {
      setIsSubmitting(true);
      setTimeout(() => {
        const zaloUser = {
          name: 'Zee (Zalo Cư Dân)',
          email: 'zeecuchuoi@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          role: 'Hệ Thống Quản Trị Viên (Admin)',
        };
        localStorage.setItem('haven_current_user', JSON.stringify(zaloUser));
        setIsSubmitting(false);
        onAuthSuccess(zaloUser);
        onShowToast('success', 'Đăng nhập Zalo thành công!', 'Đã đồng bộ tài khoản Zalo & HAVEN.');
        onClose();
      }, 400);
    } else if (provider === 'Apple') {
      setIsSubmitting(true);
      setTimeout(() => {
        const appleUser = {
          name: 'Zee (Apple ID)',
          email: 'zeecuchuoi@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          role: 'Hệ Thống Quản Trị Viên (Admin)',
        };
        localStorage.setItem('haven_current_user', JSON.stringify(appleUser));
        setIsSubmitting(false);
        onAuthSuccess(appleUser);
        onShowToast('success', 'Đăng nhập Apple ID thành công!', 'Chào mừng bạn quay lại hệ sinh thái HAVEN.');
        onClose();
      }, 400);
    } else {
      onShowToast('info', 'Cổng Facebook', 'Đang chuyển tiếp bảo mật qua Meta OAuth.');
    }
  };

  // Unified Form Login Handler
  const handleUnifiedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = loginIdentifier.trim();
    if (!id || !password.trim()) {
      onShowToast('error', 'Thiếu thông tin', 'Vui lòng nhập Email / Số điện thoại và Mật khẩu.');
      return;
    }

    setIsSubmitting(true);

    // Check specific user accounts
    if (id.toLowerCase() === 'zeecuchuoi@gmail.com' || id === '0988888888') {
      setTimeout(() => {
        const user = {
          name: 'Zee Củ Chuối',
          email: 'zeecuchuoi@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          role: 'Hệ Thống Quản Trị Viên (Admin)',
        };
        localStorage.setItem('haven_current_user', JSON.stringify(user));
        setIsSubmitting(false);
        onAuthSuccess(user);
        onShowToast('success', 'Đăng nhập Quản trị viên thành công!', 'Chào mừng Admin quay lại.');
        onClose();
      }, 350);
      return;
    }

    if (id.toLowerCase() === 'dtc245160061@ictu.edu.vn') {
      setTimeout(() => {
        const user = {
          name: 'DTC Sinh Viên ICTU',
          email: 'dtc245160061@ictu.edu.vn',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          role: 'Cư Dân ICTU (Khách Thuê)',
        };
        localStorage.setItem('haven_current_user', JSON.stringify(user));
        setIsSubmitting(false);
        onAuthSuccess(user);
        onShowToast('success', 'Đăng nhập Khách thuê thành công!', 'Chào mừng bạn đến với HAVEN.');
        onClose();
      }, 350);
      return;
    }

    // Try Supabase auth if it's an email
    if (id.includes('@')) {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: id, password: password.trim() })
        });
        const data = await res.json();
        if (res.ok && data?.access_token) {
          const user = {
            name: data.user?.user_metadata?.full_name || id.split('@')[0] || 'Cư Dân HAVEN',
            email: id,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            role: 'Cư Dân Xác Thực (Supabase)',
          };
          localStorage.setItem('haven_current_user', JSON.stringify(user));
          localStorage.setItem('haven_supabase_session', JSON.stringify(data));
          setIsSubmitting(false);
          onAuthSuccess(user);
          onShowToast('success', 'Đăng nhập thành công!', `Chào mừng ${user.name} trở lại.`);
          onClose();
          return;
        }
      } catch (err) {
        console.warn('Supabase auth notice:', err);
      }
    }

    // Default seamless login
    setTimeout(() => {
      const isEmail = id.includes('@');
      const user = {
        name: isEmail ? id.split('@')[0] : `Cư Dân (${id.slice(-4)})`,
        email: isEmail ? id : `${id}@haven.luxury`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        role: 'Cư Dân HAVEN',
      };
      localStorage.setItem('haven_current_user', JSON.stringify(user));
      setIsSubmitting(false);
      onAuthSuccess(user);
      onShowToast('success', 'Đăng nhập thành công!', `Chào mừng ${user.name} đã đăng nhập.`);
      onClose();
    }, 400);
  };

  // Register Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = registerIdentifier.trim();
    if (!id || !registerPassword.trim() || !fullName.trim()) {
      onShowToast('error', 'Thiếu thông tin', 'Vui lòng điền họ tên, email/số điện thoại và mật khẩu.');
      return;
    }

    setIsSubmitting(true);
    setRegisterStep('verify_otp');
    setOtpTimer(60);
    setIsSubmitting(false);
    onShowToast('info', 'Mã OTP xác thực', `Mã OTP xác minh 6 số đã được phát hành cho ${id}.`);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newCode = [...otpCode];
    newCode[index] = val;
    setOtpCode(newCode);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    setOtpCode(['8', '8', '8', '9', '9', '9']);
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const isEmail = registerIdentifier.includes('@');
      const newUser = {
        name: fullName.trim(),
        email: isEmail ? registerIdentifier.trim() : `${registerIdentifier.trim()}@haven.luxury`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        role: 'Cư Dân Mới Xác Thực',
      };
      localStorage.setItem('haven_current_user', JSON.stringify(newUser));
      setIsSubmitting(false);
      onAuthSuccess(newUser);
      onShowToast('success', 'Đăng ký tài khoản thành công!', 'Chào mừng bạn tham gia cộng đồng HAVEN.');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Expanded Modal Box: 500px width with deep crisp contrast */}
      <div className="relative w-full max-w-[500px] rounded-3xl border border-emerald-500/50 bg-[#0B0F17] shadow-2xl shadow-emerald-500/15 flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/90 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100 tracking-wide">
                HAVEN Sanctuary Access
              </h3>
              <p className="text-[10px] font-mono text-emerald-400 font-medium">
                Định danh cư dân & khách hàng bảo mật
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Đăng Nhập / Đăng Ký) */}
        <div className="p-1 mx-6 mt-5 rounded-xl bg-slate-900/90 border border-slate-800 flex">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setRegisterStep('input_info');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegisterStep('input_info');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đăng Ký Tài Khoản
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* 4 Social Auth Providers: Google, Zalo, Facebook, Apple */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-100 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            {/* 2. Zalo: Authentic speech bubble logo with white Zalo text */}
            <button
              type="button"
              onClick={() => handleMockSocialLogin('Zalo')}
              className="py-2.5 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="10" fill="#0068FF" />
                <path d="M14 32L24 17H14V14H28V16.5L18 31.5H28V34.5H14V32Z" fill="white" />
                <circle cx="33" cy="24" r="3.5" fill="white" />
              </svg>
              <span>Zalo</span>
            </button>

            {/* 3. Facebook */}
            <button
              type="button"
              onClick={() => handleMockSocialLogin('Facebook')}
              className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>

            {/* 4. Apple ID: Authentic Apple bitten-apple vector logo */}
            <button
              type="button"
              onClick={() => handleMockSocialLogin('Apple')}
              className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.63-13.99-5.24-8.08-9.35-17.15-12.33-27.21-2.98-10.06-4.47-19.51-4.47-28.34 0-13.88 3.59-25.13 10.77-33.75 7.18-8.62 16.02-13.04 26.52-13.26 5.34 0 10.98 1.34 16.92 4.02 5.94 2.68 9.94 4.08 12 4.2 1.74-.24 5.92-1.68 12.54-4.33 6.62-2.65 12.33-3.85 17.13-3.6 12.63.85 22.84 5.35 30.63 13.51-11.03 6.66-16.42 15.82-16.18 27.48.24 9.17 3.86 16.89 10.86 23.16 7 6.27 15.22 9.77 24.66 10.5-2.22 6.66-4.99 13.43-8.31 20.31zM119.22 31.84c0-7.25 2.65-13.88 7.95-19.89 5.3-6.01 11.75-9.61 19.35-10.8 1.01 7.42-1.39 14.28-7.21 20.58-5.82 6.3-12.52 10.01-20.09 10.11z" />
              </svg>
              <span>Apple ID</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute px-3 bg-[#0B0F17] text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Hoặc đăng nhập trực tiếp
            </span>
          </div>

          {/* 1-Click Fast Login Chips for User's 2 Exact Accounts */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10.5px] font-mono text-emerald-400 font-semibold block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Tài khoản Demo Nhanh (1-Click Login):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFastLogin('admin')}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-left transition-colors flex items-center gap-2 group cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10.5px] font-mono font-bold truncate">zeecuchuoi@gmail.com</div>
                  <div className="text-[9px] text-emerald-400/80 font-mono">Quyền Quản Trị Viên (Admin)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFastLogin('resident')}
                className="px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 hover:text-teal-200 text-left transition-colors flex items-center gap-2 group cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10.5px] font-mono font-bold truncate">dtc245160061@ictu.edu.vn</div>
                  <div className="text-[9px] text-teal-400/80 font-mono">Quyền Khách Thuê (Resident)</div>
                </div>
              </button>
            </div>
          </div>

          {activeTab === 'login' ? (
            /* Single Unified Login Form (Email OR Phone in 1 box) */
            <form onSubmit={handleUnifiedLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 block font-medium">
                  Email hoặc Số Điện Thoại
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="zeecuchuoi@gmail.com hoặc số điện thoại..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-sans placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-slate-400 block font-medium">Mật Khẩu</label>
                  <button
                    type="button"
                    onClick={() => onShowToast('info', 'Khôi phục mật khẩu', 'Vui lòng liên hệ quản trị viên hoặc sử dụng 1-Click Fast Login ở trên.')}
                    className="text-[10.5px] font-mono text-emerald-400 hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (hoặc gõ bất kỳ để thử)..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-sans placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Xác Nhận Đăng Nhập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register Form with 2 Steps */
            registerStep === 'input_info' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 block font-medium">Họ Và Tên Cư Dân</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Hoàng Tuấn Kiệt"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-sans placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 block font-medium">Email hoặc Số Điện Thoại</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={registerIdentifier}
                      onChange={(e) => setRegisterIdentifier(e.target.value)}
                      placeholder="Nhập email hoặc số điện thoại..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-sans placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 block font-medium">Thiết Lập Mật Khẩu</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-sans placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Tiếp Tục Xác Thực OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* OTP Verification Step */
              <form onSubmit={handleConfirmOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-mono text-slate-300">
                    Mã xác minh 6 số đã được gửi đến:
                  </div>
                  <div className="text-sm font-mono text-emerald-400 font-bold">
                    {registerIdentifier}
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-input-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-10 h-12 text-center text-lg font-mono font-bold rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 focus:outline-none focus:border-emerald-400"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Điền nhanh mã Demo (888999)</span>
                  </button>
                  <span>{otpTimer > 0 ? `Gửi lại sau ${otpTimer}s` : 'Có thể gửi lại'}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hoàn Tất Xác Thực & Tạo Tài Khoản</span>
                </button>
              </form>
            )
          )}

        </div>
      </div>
    </div>
  );
};
