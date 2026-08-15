import React, { useState } from 'react';
import { Sparkles, MapPin, ArrowRight, ShieldCheck, CloudRain, Car, Zap, CheckCircle2, Bookmark } from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { calculateMatchScore } from '../services/aiAdvisorService';

interface UserHomeViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onNavigateSearch: (initialQuery?: string) => void;
}

export const UserHomeView: React.FC<UserHomeViewProps> = ({
  units,
  savedUnitIds,
  onToggleSaveUnit,
  onSelectUnit,
  onNavigateSearch
}) => {
  const [aiPromptInput, setAiPromptInput] = useState('');

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPromptInput.trim()) {
      onNavigateSearch(aiPromptInput.trim());
    } else {
      onNavigateSearch();
    }
  };

  const featuredUnits = units.slice(0, 3);

  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-500">
      {/* Editorial Botanical Hero Section */}
      <section className="relative rounded-3xl overflow-hidden min-h-[540px] flex flex-col justify-between p-8 md:p-14 border border-emerald-500/20 shadow-2xl">
        {/* Background Image with Deep Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600"
            alt="HAVEN Luxury Residence"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        </div>

        {/* Top Tagline Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-emerald-500/30 text-emerald-300 text-xs font-mono tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>HAVEN — Residential Sanctuary</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-300">
            <span>Vietnam Portfolio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Verified AI Insights</span>
          </div>
        </div>

        {/* Center Editorial Title & AI Search Prompt Bar */}
        <div className="relative z-10 max-w-3xl my-8 space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.08]">
            Find a place that <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-sky-300">
              fits your life.
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg font-sans max-w-2xl leading-relaxed font-light">
            Whether for long-term living, family relocation, or a quiet city retreat — HAVEN combines fine residential properties with AI environmental intelligence.
          </p>

          {/* AI Search Prompt Form */}
          <form onSubmit={handleAiSearchSubmit} className="relative mt-6 max-w-2xl">
            <div className="relative flex items-center rounded-2xl liquid-glass border border-emerald-500/30 p-2 shadow-2xl backdrop-blur-xl group focus-within:border-emerald-400 transition-all duration-300">
              <div className="pl-4 pr-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder='Tell HAVEN what you need e.g. "2 beds in Hanoi under 18M VND, car parking, high floor"'
                className="w-full bg-transparent border-none text-slate-100 placeholder:text-slate-400 text-sm md:text-base focus:outline-none focus:ring-0 pr-4 py-3"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pl-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500 font-semibold">Test Natural AI Prompts:</span>
              <button
                type="button"
                onClick={() => onNavigateSearch("tìm hộ tao căn 2 phòng ở HN tầm 18 củ có chỗ ô tô")}
                className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/50 text-slate-300 transition-colors"
              >
                "căn 2 phòng ở HN tầm 18 củ có ô tô"
              </button>
              <button
                type="button"
                onClick={() => onNavigateSearch("2pn ở tây hồ dưới 20 củ, có thang máy, đừng tầng thấp quá")}
                className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/50 text-slate-300 transition-colors"
              >
                "2pn tây hồ dưới 20 củ, có thang máy, tầng cao"
              </button>
              <button
                type="button"
                onClick={() => onNavigateSearch("nhà cho 2 vợ chồng 1 con, đi làm cầu giấy, thích yên tĩnh")}
                className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/50 text-slate-300 transition-colors"
              >
                "2 vợ chồng 1 con, đi làm cầu giấy, yên tĩnh"
              </button>
              <button
                type="button"
                onClick={() => onNavigateSearch("tìm cái gì chill chill nhiều cây sáng sáng nhưng đi làm vào trung tâm đừng quá xa")}
                className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/50 text-slate-300 transition-colors"
              >
                "chill chill nhiều cây sáng sáng"
              </button>
              <button
                type="button"
                onClick={() => onNavigateSearch("2 phong ngu o hanoi co cho de oto duoi 20tr")}
                className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/50 text-slate-300 transition-colors"
              >
                "2 phong ngu o hanoi co cho de oto duoi 20tr"
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/60 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Property Specs</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Car className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Car & Motorbike Parking</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Flooding & Monsoon Risk</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Backup Power Reliability</span>
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-serif text-slate-100 tracking-tight">Explore Key Destinations</h2>
            <p className="text-slate-400 text-sm mt-1">Curated residential environments across Vietnam’s major urban hubs.</p>
          </div>
          <button
            onClick={() => onNavigateSearch()}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Browse All Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hanoi Card */}
          <div
            onClick={() => onNavigateSearch("Hanoi")}
            className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
              alt="Hanoi"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Capital Region</span>
              <h3 className="text-xl font-serif text-white">Hanoi</h3>
              <p className="text-xs text-slate-300">Tay Ho Lakefront & Hoan Kiem Heritage Suites</p>
            </div>
          </div>

          {/* Ho Chi Minh City Card */}
          <div
            onClick={() => onNavigateSearch("Ho Chi Minh City")}
            className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"
              alt="Ho Chi Minh City"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Metropolitan Hub</span>
              <h3 className="text-xl font-serif text-white">Ho Chi Minh City</h3>
              <p className="text-xs text-slate-300">District 1 Riverfront & Thao Dien Lofts</p>
            </div>
          </div>

          {/* Da Nang Card */}
          <div
            onClick={() => onNavigateSearch("Da Nang")}
            className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
              alt="Da Nang"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Coastal Sanctuary</span>
              <h3 className="text-xl font-serif text-white">Da Nang</h3>
              <p className="text-xs text-slate-300">My Khe Beachfront & Son Tra Sky Villas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Residences Showcase */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-serif text-slate-100 tracking-tight">Featured Residences</h2>
            <p className="text-slate-400 text-sm mt-1">High-match apartments with verified local & environmental data.</p>
          </div>
          <button
            onClick={() => onNavigateSearch()}
            className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <span>View All ({units.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredUnits.map((unit) => {
            const isSaved = savedUnitIds.includes(unit.id);
            const matchInfo = calculateMatchScore(unit, {});
            return (
              <div
                key={unit.id}
                className="group product-ui-card rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Photo & Badges */}
                <div className="relative h-56 overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                  <img
                    src={unit.images[0]}
                    alt={unit.name || unit.id}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Bar inside Card */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium">
                      {matchInfo.score}% AI Match
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveUnit(unit.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                        isSaved
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'bg-slate-950/60 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{unit.district}, {unit.city}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800">
                      Floor {unit.floor}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                    <h3 className="font-serif text-lg text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {unit.name || unit.id}
                    </h3>

                    {/* Specs Row */}
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span>{unit.bedrooms} Beds</span>
                      <span>•</span>
                      <span>{unit.bathrooms} Baths</span>
                      <span>•</span>
                      <span>{unit.sqm} sqm</span>
                    </div>
                  </div>

                  {/* AI Quick Insight */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>AI Key Advantage</span>
                    </div>
                    <p className="text-slate-300 line-clamp-1 font-sans">
                      {unit.aiInsights.whyFit[0]}
                    </p>
                  </div>

                  {/* Pricing & CTA Row */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-serif font-semibold text-emerald-400">
                        {(unit.monthlyRentVND / 1000000).toFixed(0)}M VND
                        <span className="text-xs text-slate-400 font-sans font-normal"> /mo</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        ~${unit.monthlyRentUSD.toLocaleString()} USD
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectUnit(unit.id)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-mono transition-all duration-200"
                    >
                      Inspect Residence
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Environmental Intelligence Spotlight Banner */}
      <section className="rounded-3xl liquid-glass border border-emerald-500/20 p-8 md:p-10 space-y-6 backdrop-blur-xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
            <CloudRain className="w-4 h-4 text-sky-400" />
            <span>HAVEN Concept Spotlight</span>
          </div>
          <h2 className="text-3xl font-serif text-slate-100">Environmental & Local Intelligence</h2>
          <p className="text-slate-300 text-sm leading-relaxed font-light">
            An apartment is not just four walls. HAVEN evaluates neighborhood monsoon flooding risks, heat exposure, backup power reliability, peak traffic congestion, and noise pollution so you make a confident decision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <CloudRain className="w-5 h-5 text-sky-400" />
            <h4 className="text-sm font-medium text-slate-200">Monsoon Flooding Risk</h4>
            <p className="text-xs text-slate-400">Evaluates ground street level drainage, tidal water risks, and historical rainy season access.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-medium text-slate-200">Backup Generator Power</h4>
            <p className="text-xs text-slate-400">Verifies full-capacity backup diesel power coverage during summer grid strain.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <Car className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-medium text-slate-200">Parking & Vehicle Size</h4>
            <p className="text-xs text-slate-400">Explicitly checks basement SUV parking dimensions vs. motorbike-only alleys.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-medium text-slate-200">Acoustic & Noise Level</h4>
            <p className="text-xs text-slate-400">Assesses street traffic noise based on floor height, glazing quality, and main road proximity.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
