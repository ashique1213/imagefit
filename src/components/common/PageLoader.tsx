import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8 animate-in fade-in duration-300"
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 blur-xl opacity-40 animate-pulse" />
        <div className="relative w-12 h-12 rounded-2xl bg-slate-900 border border-blue-500/30 flex items-center justify-center shadow-lg">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-white">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Loading ImageFit Tool...</span>
        </div>
        <p className="text-xs text-slate-400">
          Preparing local browser canvas and memory buffer
        </p>
      </div>
    </div>
  );
};
