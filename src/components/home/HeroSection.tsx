import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, CloudRain, Car, Zap } from 'lucide-react';
import { useFirstLoadReveal } from '../../hooks/useFirstLoadReveal';

interface HeroSectionProps {
  onSearch: (query?: string) => void;
}

const quickSuggestions = [
  { label: 'căn 2 phòng HN tầm 18 củ có ô tô', query: 'căn 2 phòng ở HN tầm 18 củ có ô tô' },
  { label: '2pn tây hồ dưới 20 củ, tầng cao', query: '2pn tây hồ dưới 20 củ, tầng cao' },
  { label: 'vợ chồng 1 con, cầu giấy, yên tĩnh', query: 'vợ chồng 1 con, cầu giấy, yên tĩnh' },
  { label: 'sky villa ngắm biển mỹ khê', query: 'sky villa ngắm biển mỹ khê' },
];

const trustBadges = [
  { icon: ShieldCheck, label: 'Kiểm Định Pháp Lý Rõ Ràng', color: 'text-emerald-500' },
  { icon: Car, label: 'Chỗ Đỗ Ô Tô Hầm Thông Minh', color: 'text-sky-500' },
  { icon: CloudRain, label: 'Đánh Giá Ngập Úng & Mưa Bão', color: 'text-emerald-500' },
  { icon: Zap, label: 'Điện Dự Phòng 100% Tự Động', color: 'text-amber-500' },
];

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const searchBarVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.4 },
  },
};

const badgeContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.7 },
  },
};

const badgeItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [aiPromptInput, setAiPromptInput] = useState('');
  const phase = useFirstLoadReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(aiPromptInput.trim() || undefined);
  };

  return (
    <section className="relative rounded-3xl overflow-hidden min-h-[520px] md:min-h-[560px] flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-14 shadow-2xl border border-[var(--haven-border)] always-dark">
      {/* Background: Real Architectural Luxury Residence + Layered Scrims */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600"
          alt="HAVEN Architecture"
          className="w-full h-full object-cover object-center filter brightness-[0.55] transition-transform duration-1000 scale-[1.02]"
        />
        {/* Deep atmospheric gradient scrims keeping text 100% crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        <div className="light-hero-gradient absolute inset-0 opacity-60" />
        {/* Ambient glow accent */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Top Tagline & Contextual AI Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono tracking-wider uppercase backdrop-blur-md shadow-lg always-white self-start">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-300 always-white font-medium">HAVEN — Không Gian Sống An Yên</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-200 always-white">
          <span className="always-white font-medium">Hà Nội · TP.HCM · Đà Nẵng</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 font-semibold always-white">Haven AI Phân Tích Môi Trường</span>
        </div>
      </motion.div>

      {/* Center: Headline + Search */}
      <div className="relative z-10 max-w-3xl my-6 md:my-8 space-y-6">
        {/* Staggered headline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={phase >= 2 ? 'visible' : 'hidden'}
          className="space-y-1"
        >
          <motion.h1 variants={lineVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] always-white">
            Tìm nơi ở
          </motion.h1>
          <motion.h1 variants={lineVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.15]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300">
              thực sự thuộc về bạn.
            </span>
          </motion.h1>
          <motion.p variants={lineVariants} className="text-slate-100 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mt-4 always-white font-sans font-light">
            Không chỉ là 4 bức tường. HAVEN thấu hiểu phong cách sống và đánh giá toàn diện nguy cơ ngập úng, độ ồn, chỗ đỗ xe ô tô và nguồn điện dự phòng.
          </motion.p>
        </motion.div>

        {/* AI Search Bar with Gemini-like Breathing Sparkle */}
        <motion.form
          variants={searchBarVariants}
          initial="hidden"
          animate={phase >= 3 ? 'visible' : 'hidden'}
          onSubmit={handleSubmit}
          className="relative max-w-2xl"
        >
          <div className="relative flex items-center rounded-2xl border border-emerald-500/40 p-1.5 sm:p-2 shadow-2xl backdrop-blur-xl bg-slate-950/80 group focus-within:border-emerald-400 transition-all duration-300">
            <div className="pl-3 pr-2 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <input
              type="text"
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              placeholder='Nhập nhu cầu của bạn e.g. "căn 2 phòng ở HN tầm 18 củ có ô tô, tầng cao"'
              className="w-full bg-transparent border-none text-white placeholder:text-slate-400 text-sm md:text-base focus:outline-none focus:ring-0 pr-3 py-2.5 sm:py-3 always-white font-sans"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="hidden sm:inline">Hỏi AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 text-xs font-mono">
            <span className="text-slate-200 font-medium mr-1 always-white">Gợi ý:</span>
            {quickSuggestions.map((s) => (
              <button
                key={s.query}
                type="button"
                onClick={() => onSearch(s.query)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-emerald-950/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-100 hover:text-emerald-300 transition-colors backdrop-blur-sm always-white always-dark"
              >
                "{s.label}"
              </button>
            ))}
          </div>
        </motion.form>
      </div>

      {/* Bottom Trust Badges */}
      <motion.div
        variants={badgeContainerVariants}
        initial="hidden"
        animate={phase >= 4 ? 'visible' : 'hidden'}
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-5 border-t border-white/10 text-xs font-mono text-slate-200 always-white"
      >
        {trustBadges.map((badge) => (
          <motion.div key={badge.label} variants={badgeItemVariants} className="flex items-center gap-2">
            <badge.icon className={`w-4 h-4 ${badge.color} shrink-0`} />
            <span className="always-white">{badge.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
