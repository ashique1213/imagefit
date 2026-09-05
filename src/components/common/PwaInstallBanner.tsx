import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePwaInstallPrompt } from '../../utils/pwa/pwa';

export const PwaInstallBanner: React.FC = () => {
  const { canInstall, promptInstall, dismissPrompt } = usePwaInstallPrompt();

  if (!canInstall) return null;

  return (
    <div
      role="region"
      aria-label="Install ImageFit Application"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="glass-panel p-4 rounded-3xl border border-blue-500/30 bg-slate-900/95 shadow-2xl shadow-blue-500/20 backdrop-blur-xl flex items-center justify-between gap-3">
        {/* App Icon */}
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shrink-0 flex items-center justify-center shadow-md shadow-blue-500/30">
          <Smartphone className="w-5 h-5 text-white" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-white truncate">Install ImageFit</h4>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              Offline Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            Install to your desktop or home screen
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={promptInstall}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={dismissPrompt}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Dismiss installation prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
