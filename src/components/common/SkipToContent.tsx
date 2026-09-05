import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-blue-600 focus:text-white focus:font-bold focus:text-sm focus:shadow-2xl focus:shadow-blue-500/50 focus:ring-2 focus:ring-white focus:outline-none transition-all duration-200"
    >
      Skip to Main Content
    </a>
  );
};
