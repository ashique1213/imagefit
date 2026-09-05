import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 backdrop-blur-md flex items-start justify-between gap-3 text-rose-200 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm font-medium leading-relaxed">
          {message}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          aria-label="Dismiss error notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
