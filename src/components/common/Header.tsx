import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Menu, 
  X, 
} from 'lucide-react';
import { Badge } from './Badge';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const quickLinks = [
    { name: 'COMPRESS IMAGE', path: '/compress' },
    { name: 'RESIZE IMAGE', path: '/resize' },
    { name: 'CROP IMAGE', path: '/crop' },
    { name: 'CONVERT TO JPG', path: '/convert' },
    { name: 'CHANGE BACKGROUND', path: '/background' },
    { name: 'SIGNATURE TOOL', path: '/signature' },
    { name: 'WIZARD', path: '/pipeline' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo: i ❤️ ImageFit */}
          <Link to="/" className="flex items-center gap-1.5 group select-none">
            <span className="text-2xl font-black text-gray-900 tracking-tighter">i</span>
            <Heart className="w-6 h-6 fill-[#e5322d] text-[#e5322d] group-hover:scale-110 transition-transform duration-200" />
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              Image<span className="text-[#e5322d]">Fit</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {quickLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
                    active
                      ? 'bg-red-50 text-[#e5322d]'
                      : 'text-gray-700 hover:text-[#e5322d] hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Privacy Indicator & Free Badge */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Badge variant="green" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% In-Browser Privacy</span>
            </Badge>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#e5322d]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl max-h-[85vh] overflow-y-auto">
          {quickLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                  active
                    ? 'bg-red-50 text-[#e5322d]'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between px-3 text-xs text-emerald-700 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% In-Browser Privacy
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
