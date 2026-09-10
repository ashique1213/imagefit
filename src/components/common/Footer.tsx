import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8 sm:py-10 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          {/* Brand & Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 text-center md:text-left">
            <Link
              to="/"
              className="flex items-center gap-1 font-bold text-gray-900 hover:text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
              aria-label="ImageFit Home"
            >
              <span className="font-black text-sm tracking-tight">i</span>
              <Heart className="w-3.5 h-3.5 fill-[#e5322d] text-[#e5322d]" />
              <span className="font-black text-sm tracking-tight">
                Image<span className="text-[#e5322d]">Fit</span>
              </span>
            </Link>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span>© {new Date().getFullYear()} ImageFit. All rights reserved.</span>
          </div>

          {/* Quick Tool Navigation Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-2 text-xs font-medium text-gray-600"
          >
            <Link to="/compress" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Compress</Link>
            <Link to="/resize" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Resize</Link>
            <Link to="/crop" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Crop</Link>
            <Link to="/convert" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Convert</Link>
            <Link to="/background" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Background</Link>
            <Link to="/signature" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Signature</Link>
            <Link to="/batch" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Batch</Link>
            <Link to="/metadata" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Metadata</Link>
            <Link to="/pipeline" className="px-1.5 py-1 rounded hover:text-[#e5322d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Wizard</Link>
          </nav>
        </div>

        {/* Agency Attribution Section */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center text-xs text-gray-500">
          <span className="text-gray-400 font-medium tracking-wide uppercase text-[11px]">Powered by</span>
          <a
            href="https://questacksolutions.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-gray-800 hover:text-[#e5322d] transition-all duration-150 px-3 py-1.5 rounded-lg border border-gray-200/80 bg-gray-50/60 hover:bg-red-50 hover:border-red-200 text-[11px] sm:text-xs text-center max-w-full break-words shadow-xs"
          >
            <span>FREELANCE AGENCY: QUESTACK SOLUTIONS</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </a>
        </div>
      </div>
    </footer>
  );
};
