import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1 font-bold text-gray-900 hover:text-gray-700 transition-colors">
              <span className="font-black text-sm tracking-tight">i</span>
              <Heart className="w-3.5 h-3.5 fill-[#e5322d] text-[#e5322d]" />
              <span className="font-black text-sm tracking-tight">
                Image<span className="text-[#e5322d]">Fit</span>
              </span>
            </Link>
            <span className="text-gray-300">•</span>
            <span>© {new Date().getFullYear()} ImageFit</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-medium text-gray-600">
            <Link to="/compress" className="hover:text-[#e5322d] transition-colors">Compress</Link>
            <Link to="/resize" className="hover:text-[#e5322d] transition-colors">Resize</Link>
            <Link to="/crop" className="hover:text-[#e5322d] transition-colors">Crop</Link>
            <Link to="/convert" className="hover:text-[#e5322d] transition-colors">Convert</Link>
            <Link to="/background" className="hover:text-[#e5322d] transition-colors">Background</Link>
            <Link to="/signature" className="hover:text-[#e5322d] transition-colors">Signature</Link>
            <Link to="/batch" className="hover:text-[#e5322d] transition-colors">Batch</Link>
            <Link to="/metadata" className="hover:text-[#e5322d] transition-colors">Metadata</Link>
            <Link to="/pipeline" className="hover:text-[#e5322d] transition-colors">Wizard</Link>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-[#e5322d] text-[#e5322d]" />
            <span>in browser</span>
          </div>
        </div>

        {/* Agency Attribution */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center text-xs text-gray-500">
          <span className="text-gray-500 font-medium">Powered by</span>
          <a
            href="https://questacksolutions.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-gray-800 hover:text-[#e5322d] transition-colors px-2 py-1 rounded hover:bg-red-50"
          >
            <span>[FREELANCE AGENCY: QUESTACK SOLUTIONS]</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};
