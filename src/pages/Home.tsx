import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Lock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Search,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { TOOLS } from '../constants/tools';
import { ToolCard } from '../components/common/ToolCard';

export const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs = [
    {
      q: 'Are my images uploaded to any server?',
      a: 'No! Absolutely not. ImageFit performs 100% of image processing inside your web browser using HTML5 Canvas and JavaScript Web APIs. Your images never leave your computer or phone.',
    },
    {
      q: 'How does target size compression work?',
      a: 'Our smart compression algorithm analyzes your image and runs a fast local binary search to find the optimal quality level and pixel dimension ratio that achieves your requested KB/MB limit without unnecessary quality degradation.',
    },
    {
      q: 'Can I fix scanned signatures with grey/dark backgrounds?',
      a: 'Yes! Our Signature Tool is specifically built to isolate signature pen strokes, remove paper shadows or grey backgrounds, and allow you to recolor the ink to official blue or black colors.',
    },
    {
      q: 'Is ImageFit free to use?',
      a: 'Yes, ImageFit is completely free with no registration required, no ads tracking your files, and no watermark on processed images.',
    },
    {
      q: 'What image formats are supported?',
      a: 'We support JPG/JPEG, PNG, and WebP images. You can convert seamlessly between these formats in your browser.',
    },
  ];

  const presets = [
    { id: 'ssc-cgl-photo', name: 'SSC / Exam Photo', dimensions: '350 × 450 px', size: 'Max 50 KB', desc: 'Standard passport aspect ratio for government portals.' },
    { id: 'ssc-cgl-sig', name: 'Exam Signature', dimensions: '140 × 60 px', size: 'Max 20 KB', desc: 'Clean white background & crisp blue/black ink.' },
    { id: 'us-visa-ds160', name: 'US Visa / DS-160', dimensions: '600 × 600 px', size: 'Max 240 KB', desc: 'Square 2×2 inch portrait suitable for US embassy portals.' },
    { id: 'indian-passport-seva', name: 'Passport Seva', dimensions: '413 × 531 px', size: 'Max 100 KB', desc: 'High resolution 300-DPI specification for passports.' },
  ];

  const filteredTools = useMemo(() => {
    return TOOLS.filter((t) => {
      // Category filter
      if (selectedCategory === 'popular' && !t.popular) return false;
      if (selectedCategory === 'optimize' && t.group !== 'optimize') return false;
      if (selectedCategory === 'edit' && t.group !== 'edit') return false;
      if (selectedCategory === 'security' && t.group !== 'security') return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.longDescription.toLowerCase().includes(q) ||
        (t.badge && t.badge.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6 px-4">
          {/* Privacy Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% In-Browser & Local File Privacy</span>
          </div>

          {/* iLovePDF Iconic Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.15]">
            Every tool you need to <br className="hidden sm:inline" />
            work with images <span className="text-[#e5322d]">in one place</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Every tool you need to use images, right at your fingertips. All are 100% FREE and easy to use! Compress, resize, crop, convert, edit signatures, and prepare photos for any application.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="pt-2 max-w-xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools (e.g. compress, resize, crop, signature, convert)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:border-[#e5322d] focus:ring-2 focus:ring-red-100 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 px-2 py-1 bg-gray-100 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold">
              {[
                { id: 'all', label: 'All Tools' },
                { id: 'popular', label: 'Popular' },
                { id: 'optimize', label: 'Optimize & Convert' },
                { id: 'edit', label: 'Edit & Resize' },
                { id: 'security', label: 'Forms & Privacy' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#e5322d] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Wizard Callout */}
          <div className="pt-2 flex justify-center">
            <Link
              to="/pipeline"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-50 text-[#e5322d] hover:bg-red-100 border border-red-200 text-xs font-bold transition-all hover:scale-[1.02]"
            >
              <FileCheck className="w-4 h-4" />
              <span>Need guided photo & signature prep? Try Application Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Key Specs Reassurance */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-500 border-t border-gray-200/60 mt-6">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#e5322d]" />
              <span>Exact Target KB Compression</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#e5322d]" />
              <span>Passport & Signature Presets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#e5322d]" />
              <span>Zero Server Transmission</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Image Tools
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-[#e5322d] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No tools found matching "{searchQuery}"</h3>
            <p className="text-xs text-gray-500 mt-1">Try searching for compress, resize, crop, or signature.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#e5322d] text-white text-xs font-bold shadow-xs hover:bg-[#cb1b16] transition-colors"
            >
              View All Tools
            </button>
          </div>
        )}
      </section>

      {/* Quick Application Presets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e5322d] uppercase tracking-wider mb-2">
                Quick Presets
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Popular Portal Preset Formats</h2>
              <p className="text-xs text-gray-500 mt-1">
                Common sample formats used across exam and job portals. Custom dimensions & sizes are always fully adjustable.
              </p>
            </div>
            <Link
              to="/pipeline"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e5322d] text-white hover:bg-[#cb1b16] text-xs font-bold transition-all shadow-sm hover:shadow"
            >
              <span>Launch Application Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {presets.map((item, idx) => (
              <Link
                key={idx}
                to={`/pipeline?preset=${item.id}`}
                className="bg-gray-50/70 border border-gray-200 p-5 rounded-2xl space-y-2 hover:border-red-300 hover:bg-white hover:shadow-md transition-all block group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-[#e5322d] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#e5322d] border border-red-100">
                    {item.size}
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold text-gray-700">{item.dimensions}</div>
                <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
                <div className="text-[10px] text-[#e5322d] font-bold pt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Apply Preset</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ImageFit */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Why Use ImageFit?</h2>
          <p className="text-sm text-gray-500 mt-2">
            Built for maximum privacy, speed, and precision when preparing confidential photos and signature documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">100% Client-Side Privacy</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your files never touch remote servers or databases. All computations execute locally in your web browser memory.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#e5322d] border border-red-100 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">Instant Browser Processing</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              No uploading delays or server queues. Process images of any size instantly using high-speed HTML5 Canvas APIs.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">Target KB Precision</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Set target file size limits (e.g. 50 KB) and let our binary search algorithm calculate the exact compression needed.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">How It Works</h2>
            <p className="text-sm text-gray-500 mt-2">Three simple steps to prepare compliant images.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#e5322d] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-red-500/25">
                1
              </div>
              <h3 className="text-base font-bold text-gray-900">Select Your File</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Click Select IMAGE or drag and drop your photo or signature (JPG, PNG, WebP) directly into the browser.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#e5322d] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-red-500/25">
                2
              </div>
              <h3 className="text-base font-bold text-gray-900">Configure Requirements</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Specify target KB size, pixel dimensions, background color, or signature ink options.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#e5322d] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-red-500/25">
                3
              </div>
              <h3 className="text-base font-bold text-gray-900">Download Result</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Compare original vs processed details and download your compliant image immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e5322d] uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-800 hover:text-[#e5322d] transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#e5322d] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
