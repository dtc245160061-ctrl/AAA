import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Check, X, Trash2 } from 'lucide-react';
import type { ApartmentUnit } from '../types/apartment';
import { compareApartments, type ComparisonResult } from '../services/aiAdvisorService';

interface UserCompareViewProps {
  units: ApartmentUnit[];
  savedUnitIds: string[];
  onRemoveFromSaved: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onBackToDirectory: () => void;
}

export const UserCompareView: React.FC<UserCompareViewProps> = ({
  units,
  savedUnitIds,
  onRemoveFromSaved,
  onSelectUnit,
  onBackToDirectory
}) => {
  const savedUnits = units.filter(u => savedUnitIds.includes(u.id));
  const [aiComparison, setAiComparison] = useState<ComparisonResult | null>(null);

  const handleRunAiComparison = () => {
    const result = compareApartments(savedUnits);
    setAiComparison(result);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-slate-100 tracking-tight">Compare Saved Residences</h1>
          <p className="text-slate-400 text-sm mt-1">Side-by-side decision matrix & AI trade-off evaluation.</p>
        </div>
        <button
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore More Units</span>
        </button>
      </div>

      {savedUnits.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
          <Sparkles className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-serif text-slate-200">No Saved Residences to Compare</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Click the bookmark icon on any apartment listing to add it to your comparison workspace.
          </p>
          <button
            onClick={onBackToDirectory}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-medium"
          >
            Browse Residences
          </button>
        </div>
      ) : (
        <>
          {/* AI Decision Helper Banner */}
          <div className="rounded-2xl liquid-glass border border-emerald-500/30 p-6 space-y-4 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>HAVEN AI Decision Engine</span>
                </div>
                <h2 className="text-xl font-serif text-slate-100">Which residence is best for you?</h2>
              </div>
              <button
                onClick={handleRunAiComparison}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-medium text-xs transition-all shadow-lg shadow-emerald-500/20 shrink-0"
              >
                Analyze Trade-offs with AI
              </button>
            </div>

            {aiComparison && (
              <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-3 animate-in fade-in duration-300">
                <h4 className="font-serif text-lg text-emerald-300">{aiComparison.headline}</h4>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">{aiComparison.reasoning}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-emerald-500/20">
                  {aiComparison.tradeOffs.map(item => (
                    <div key={item.unitId} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                      <span className="font-serif text-slate-100 font-semibold">{item.unitName}</span>
                      <div className="space-y-1">
                        {item.pros.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-emerald-400">
                            <Check className="w-3 h-3 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                        {item.cons.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-amber-400">
                            <X className="w-3 h-3 shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="p-4 text-slate-400 font-normal uppercase tracking-wider w-48">Feature / Metric</th>
                  {savedUnits.map(unit => (
                    <th key={unit.id} className="p-4 text-slate-100 font-serif text-sm">
                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[180px]">{unit.name || unit.id}</span>
                        <button
                          onClick={() => onRemoveFromSaved(unit.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {/* Monthly Rent */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Monthly Rent (VND)</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4 text-emerald-400 font-serif text-base font-semibold">
                      {(u.monthlyRentVND / 1000000).toFixed(0)}M VND
                      <span className="block text-[11px] font-mono text-slate-500 font-normal">~${u.monthlyRentUSD.toLocaleString()} USD</span>
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Location</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.district}, {u.city}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms / Baths */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Bedrooms / Baths</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.bedrooms} Beds / {u.bathrooms} Baths
                    </td>
                  ))}
                </tr>

                {/* Area & Floor */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Area & Floor</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.sqm} sqm (Floor {u.floor})
                    </td>
                  ))}
                </tr>

                {/* Car Parking */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Car Parking</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.hasCarParking ? (
                        <span className="text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> Available</span>
                      ) : (
                        <span className="text-slate-500">Not included</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Flooding Risk */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Flooding Risk</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      <span className={u.floodingRisk === 'Low' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                        {u.floodingRisk} Risk
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Backup Power */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Backup Generator</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      {u.hasBackupPower ? (
                        <span className="text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> 100% Redundant</span>
                      ) : (
                        <span className="text-slate-500">Standard Grid</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Action CTA Row */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium">Inspect Unit</td>
                  {savedUnits.map(u => (
                    <td key={u.id} className="p-4">
                      <button
                        onClick={() => onSelectUnit(u.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-medium transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
