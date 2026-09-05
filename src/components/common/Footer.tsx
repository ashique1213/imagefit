import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Cpu, Image as ImageIcon } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 mt-20">
      {/* Top Banner: Privacy Commitment */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-slate-900/50 via-blue-950/20 to-slate-900/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">100% Client-Side</h4>
                <p className="text-xs text-slate-400">Zero backend uploads or server storage.</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Privacy Guaranteed</h4>
                <p className="text-xs text-slate-400">Your photos & signatures remain strictly private.</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Lightning Fast</h4>
                <p className="text-xs text-slate-400">Powered directly by modern Web Canvas API.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Image<span className="text-gradient">Fit</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier client-side image preparation suite for application forms, exams, government portals, college admissions, and banking uploads.
            </p>
          </div>

          {/* Quick Tools */}
          <div>
            <h5 className="text-sm font-semibold text-slate-200 mb-3 tracking-wider uppercase text-xs">Primary Tools</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/compress" className="hover:text-blue-400 transition-colors">Target KB Compressor</Link>
              </li>
              <li>
                <Link to="/resize" className="hover:text-blue-400 transition-colors">Pixel & Percentage Resizer</Link>
              </li>
              <li>
                <Link to="/convert" className="hover:text-blue-400 transition-colors">JPG / PNG / WebP Converter</Link>
              </li>
              <li>
                <Link to="/signature" className="hover:text-blue-400 transition-colors">Signature Enhancer & Recolor</Link>
              </li>
            </ul>
          </div>

          {/* Additional Features */}
          <div>
            <h5 className="text-sm font-semibold text-slate-200 mb-3 tracking-wider uppercase text-xs">More Utilities</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/background" className="hover:text-blue-400 transition-colors">Photo Background Swap</Link>
              </li>
              <li>
                <Link to="/crop" className="hover:text-blue-400 transition-colors">Aspect Ratio Cropper</Link>
              </li>
              <li>
                <Link to="/editor" className="hover:text-blue-400 transition-colors">All-in-One Studio Editor</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Notice */}
          <div>
            <h5 className="text-sm font-semibold text-slate-200 mb-3 tracking-wider uppercase text-xs">Browser Processing</h5>
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs leading-relaxed text-slate-400">
              <p className="font-medium text-slate-300 mb-1">Notice:</p>
              ImageFit processes images using standard HTML5 Canvas & HTML Blob Web APIs inside your browser session. Files are never transmitted anywhere.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ImageFit. All rights reserved.</p>
          <p className="flex items-center gap-1">
            100% Client-Side In-Browser Processing
          </p>
        </div>
      </div>
    </footer>
  );
};
