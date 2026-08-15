import React, { useState } from 'react';
import { ExternalLink, Terminal, Shield, User, X } from 'lucide-react';

interface DevPreviewLauncherProps {
  currentView: 'user' | 'admin';
}

/**
 * ISOLATED DEVELOPER PREVIEW SYSTEM
 * Location: src/devtools/preview/
 * Purpose: Allows developers to launch User Experience Preview and Admin Experience Preview
 * in separate browser tabs without mutating production auth or polluting the main UI.
 * Removability: Deleting this directory and removing 1 single entry line in App.tsx leaves HAVEN 100% functional.
 */
export const DevPreviewLauncher: React.FC<DevPreviewLauncherProps> = ({ currentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openUserPreviewWindow = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'user');
    window.open(url.toString(), '_blank');
  };

  const openAdminPreviewWindow = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'admin');
    window.open(url.toString(), '_blank');
  };

  return (
    <aside aria-label="Developer Preview Controls" className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-950/90 border border-emerald-500/40 text-emerald-400 shadow-2xl backdrop-blur-md hover:scale-105 transition-all"
        >
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-[11px]">DEV PREVIEW ({currentView.toUpperCase()})</span>
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-950/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-slate-200 w-72 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <Terminal className="w-4 h-4" />
              <span>Isolated Dev Preview</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Launch consumer and admin experiences in separate tabs to inspect simultaneously without altering production roles.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={openUserPreviewWindow}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/40 text-slate-200 transition-all"
            >
              <span className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open User Preview</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={openAdminPreviewWindow}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/40 text-slate-200 transition-all"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Admin Preview</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
            <span>Active View: <strong className="text-emerald-400">{currentView}</strong></span>
            <span>Removable Module</span>
          </div>
        </div>
      )}
    </aside>
  );
};
