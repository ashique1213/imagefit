import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Image, Menu, X } from 'lucide-react';
import { Badge } from './Badge';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Application Wizard', path: '/pipeline' },
    { name: 'Batch', path: '/batch' },
    { name: 'Compress', path: '/compress' },
    { name: 'Resize', path: '/resize' },
    { name: 'Convert', path: '/convert' },
    { name: 'Signature Tool', path: '/signature' },
    { name: 'Studio', path: '/editor' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Image className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Image<span className="text-gradient">Fit</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
                Browser Image Utility
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Privacy Indicator & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Badge variant="green" size="sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% In-Browser Privacy</span>
            </Badge>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? 'bg-blue-500/20 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Files never leave your device
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
