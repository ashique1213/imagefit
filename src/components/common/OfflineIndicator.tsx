import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../../utils/pwa/pwa';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setHasBeenOffline(true);
      setShowReconnected(false);
    } else if (hasBeenOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, hasBeenOffline]);

  // Offline status banner
  if (!isOnline) {
    return (
      <aside
        aria-live="polite"
        className="w-full bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-amber-700/90 text-white text-xs py-2 px-4 border-b border-amber-500/40 shadow-lg backdrop-blur-md sticky top-16 z-40"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <WifiOff className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
            <span>
              <strong>Offline Mode Active:</strong> You are currently disconnected, but ImageFit is
              100% functional locally in your browser.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-black/20 text-amber-100 font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            Zero Server Dependency
          </span>
        </div>
      </aside>
    );
  }

  // Brief "Back Online" notification toast
  if (showReconnected) {
    return (
      <aside
        aria-live="polite"
        className="w-full bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white text-xs py-2 px-4 border-b border-emerald-500/40 shadow-lg backdrop-blur-md sticky top-16 z-40 transition-all duration-300 animate-in fade-in"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-medium">
          <Wifi className="w-4 h-4 text-emerald-200" />
          <span>Connection Restored: You are back online.</span>
        </div>
      </aside>
    );
  }

  return null;
};
