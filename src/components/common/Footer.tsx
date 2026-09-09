import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1 font-bold text-gray-900 hover:text-gray-700">
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
          <Link to="/pipeline" className="hover:text-[#e5322d] transition-colors">Wizard</Link>
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-[#e5322d] text-[#e5322d]" />
          <span>in browser</span>
        </div>
      </div>
    </footer>
  );
};
