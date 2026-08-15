import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, MapPin, Grid, List, Check, Bookmark, X, AlertTriangle, ShieldCheck, Car, CloudRain, Zap, RefreshCw } from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { type ConsumerFilters, parseNaturalLanguageQuery, calculateMatchScore } from '../services/aiAdvisorService';

interface UserSearchViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onToggleSaveUnit: (id: string) => void;
  onSelectUnit: (id: string) => void;
  initialAiQuery?: string;
}

export const UserSearchView: React.FC<UserSearchViewProps> = ({
  units,
  savedUnitIds,
  onToggleSaveUnit,
  onSelectUnit,
  initialAiQuery = ''
}) => {
  const [aiPromptInput, setAiPromptInput] = useState(initialAiQuery);
  const [aiUnderstoodText, setAiUnderstoodText] = useState<string | null>(null);
  const [aiFollowUp, setAiFollowUp] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter States
  const [cityFilter, setCityFilter] = useState<'All' | 'Hanoi' | 'Ho Chi Minh City' | 'Da Nang'>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [bedroomsFilter, setBedroomsFilter] = useState<number>(0);
  const [maxRentVND, setMaxRentVND] = useState<number>(450000000); // 450M max default
  const [carParkingOnly, setCarParkingOnly] = useState<boolean>(false);
  const [lowFloodOnly, setLowFloodOnly] = useState<boolean>(false);
  const [backupPowerOnly, setBackupPowerOnly] = useState<boolean>(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState<boolean>(false);

  // Process initial AI query on mount if passed
  useEffect(() => {
    if (initialAiQuery) {
      handleApplyAiPrompt(initialAiQuery);
    }
  }, [initialAiQuery]);

  const handleApplyAiPrompt = (promptText: string) => {
    if (!promptText.trim()) return;
    const parsed = parseNaturalLanguageQuery(promptText);
    setAiUnderstoodText(parsed.understoodText);
    setAiFollowUp(parsed.followUpQuestion || null);

    if (parsed.extractedFilters.city) {
      setCityFilter(parsed.extractedFilters.city);
    }
    if (parsed.extractedFilters.district) {
      setDistrictFilter(parsed.extractedFilters.district);
    }
    if (parsed.extractedFilters.minBedrooms) {
      setBedroomsFilter(parsed.extractedFilters.minBedrooms);
    }
    if (parsed.extractedFilters.maxRentVND) {
      setMaxRentVND(parsed.extractedFilters.maxRentVND);
    }
    if (parsed.extractedFilters.hasCarParking) {
      setCarParkingOnly(true);
    }
    if (parsed.extractedFilters.floodingRisk === 'Low') {
      setLowFloodOnly(true);
    }
    if (parsed.extractedFilters.hasBackupPower) {
      setBackupPowerOnly(true);
    }
    if (parsed.extractedFilters.petFriendly) {
      setPetFriendlyOnly(true);
    }
  };

  const handleAiFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyAiPrompt(aiPromptInput);
  };

  const activeFiltersObj: ConsumerFilters = useMemo(() => ({
    city: cityFilter,
    district: districtFilter || undefined,
    minBedrooms: bedroomsFilter || undefined,
    maxRentVND: maxRentVND < 450000000 ? maxRentVND : undefined,
    hasCarParking: carParkingOnly || undefined,
    floodingRisk: lowFloodOnly ? 'Low' : undefined,
    hasBackupPower: backupPowerOnly || undefined,
    petFriendly: petFriendlyOnly || undefined
  }), [cityFilter, districtFilter, bedroomsFilter, maxRentVND, carParkingOnly, lowFloodOnly, backupPowerOnly, petFriendlyOnly]);

  // Filtered and Scored units
  const filteredUnits = useMemo(() => {
    return units
      .map(unit => {
        const { score, matchReasons } = calculateMatchScore(unit, activeFiltersObj);
        return { unit, score, matchReasons };
      })
      .filter(item => {
        if (cityFilter !== 'All' && item.unit.city !== cityFilter) return false;
        if (districtFilter && !item.unit.district.toLowerCase().includes(districtFilter.toLowerCase())) return false;
        if (bedroomsFilter > 0 && item.unit.bedrooms < bedroomsFilter) return false;
        if (maxRentVND < 450000000 && item.unit.monthlyRentVND > maxRentVND) return false;
        if (carParkingOnly && !item.unit.hasCarParking) return false;
        if (lowFloodOnly && item.unit.floodingRisk !== 'Low') return false;
        if (backupPowerOnly && !item.unit.hasBackupPower) return false;
        if (petFriendlyOnly && !item.unit.petFriendly) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score);
  }, [units, activeFiltersObj, cityFilter, districtFilter, bedroomsFilter, maxRentVND, carParkingOnly, lowFloodOnly, backupPowerOnly, petFriendlyOnly]);

  const handleResetFilters = () => {
    setCityFilter('All');
    setDistrictFilter('');
    setBedroomsFilter(0);
    setMaxRentVND(450000000);
    setCarParkingOnly(false);
    setLowFloodOnly(false);
    setBackupPowerOnly(false);
    setPetFriendlyOnly(false);
    setAiPromptInput('');
    setAiUnderstoodText(null);
    setAiFollowUp(null);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-slate-100 tracking-tight">Explore Residences</h1>
          <p className="text-slate-400 text-sm mt-1">Search apartments across Vietnam manually or describe your criteria to AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white transition-colors"
            title="Toggle Grid / List View"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* AI Natural Language Bar */}
      <div className="rounded-2xl liquid-glass border border-emerald-500/30 p-4 space-y-3 backdrop-blur-xl shadow-xl">
        <form onSubmit={handleAiFormSubmit} className="flex items-center gap-2">
          <div className="pl-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={aiPromptInput}
            onChange={(e) => setAiPromptInput(e.target.value)}
            placeholder='Describe what you need e.g. "I need a 2-bedroom in Hanoi around 16M VND, car parking, low flood risk"'
            className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-0 px-3 py-2"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs font-mono transition-all shadow-md shadow-emerald-500/20 shrink-0"
          >
            Update AI Filters
          </button>
        </form>

        {/* AI Understood Banner */}
        {aiUnderstoodText && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="font-mono text-emerald-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Interpretation:
              </span>
              <button onClick={() => setAiUnderstoodText(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-200 font-sans leading-relaxed">{aiUnderstoodText}</p>
            {aiFollowUp && (
              <div className="pt-1.5 border-t border-emerald-500/20 text-sky-300 font-sans flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-sky-400">Follow-up Tip:</span>
                <span>{aiFollowUp}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Filter & Results Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-serif text-lg text-slate-100 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>Search Filters</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">{filteredUnits.length} found</span>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">City Location</label>
              <div className="grid grid-cols-2 gap-2">
                {(['All', 'Hanoi', 'Ho Chi Minh City', 'Da Nang'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCityFilter(c)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border text-left truncate ${
                      cityFilter === c
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c === 'Ho Chi Minh City' ? 'HCMC' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Bedrooms</label>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map(b => (
                  <button
                    key={b}
                    onClick={() => setBedroomsFilter(b)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all border ${
                      bedroomsFilter === b
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {b === 0 ? 'Any' : `${b}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Maximum Rent VND Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-wider">Max Budget (VND)</span>
                <span className="text-emerald-400 font-semibold">
                  {maxRentVND >= 450000000 ? 'Any Budget' : `${(maxRentVND / 1000000).toFixed(0)}M VND`}
                </span>
              </div>
              <input
                type="range"
                min={10000000}
                max={450000000}
                step={5000000}
                value={maxRentVND}
                onChange={(e) => setMaxRentVND(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>10M VND</span>
                <span>200M VND</span>
                <span>450M+ VND</span>
              </div>
            </div>

            {/* Vietnam Criteria Toggles */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Residential Features</label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
                <span className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-sky-400" />
                  <span>Car Parking Required</span>
                </span>
                <input
                  type="checkbox"
                  checked={carParkingOnly}
                  onChange={(e) => setCarParkingOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
                <span className="flex items-center gap-2">
                  <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Low Flooding Risk Only</span>
                </span>
                <input
                  type="checkbox"
                  checked={lowFloodOnly}
                  onChange={(e) => setLowFloodOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Backup Power</span>
                </span>
                <input
                  type="checkbox"
                  checked={backupPowerOnly}
                  onChange={(e) => setBackupPowerOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pet Friendly Residence</span>
                </span>
                <input
                  type="checkbox"
                  checked={petFriendlyOnly}
                  onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Property Results Listing */}
        <div className="lg:col-span-3 space-y-6">
          {filteredUnits.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-xl font-serif text-slate-200">No Residences Match Exact Criteria</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Try relaxing budget limits, city filters, or parking toggles, or ask AI to find alternative options.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-medium"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredUnits.map(({ unit, score, matchReasons }) => {
                const isSaved = savedUnitIds.includes(unit.id);
                return (
                  <div
                    key={unit.id}
                    className={`group product-ui-card rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col justify-between'
                    }`}
                  >
                    {/* Image Area */}
                    <div
                      className={`relative bg-slate-900 cursor-pointer overflow-hidden ${
                        viewMode === 'list' ? 'sm:w-64 h-56 shrink-0' : 'h-56'
                      }`}
                      onClick={() => onSelectUnit(unit.id)}
                    >
                      <img
                        src={unit.images[0]}
                        alt={unit.name || unit.id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium">
                          {score}% Match
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

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {unit.district}, {unit.city}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
                          Fl. {unit.floor}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2 cursor-pointer" onClick={() => onSelectUnit(unit.id)}>
                        <h3 className="font-serif text-lg text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {unit.name || unit.id}
                        </h3>

                        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                          <span>{unit.bedrooms} Bedrooms</span>
                          <span>•</span>
                          <span>{unit.bathrooms} Baths</span>
                          <span>•</span>
                          <span>{unit.sqm} sqm</span>
                        </div>
                      </div>

                      {/* AI Match Reasons */}
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                        <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                          AI Compatibility Highlight:
                        </span>
                        <ul className="space-y-1 text-slate-300 font-sans">
                          {matchReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing & CTA */}
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
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
