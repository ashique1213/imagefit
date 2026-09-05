import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Lock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { TOOLS } from '../constants/tools';
import { ToolCard } from '../components/common/ToolCard';
import { Badge } from '../components/common/Badge';

export const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    { name: 'Passport Photo', dimensions: '350 × 450 px', size: 'Max 50 KB', desc: 'Standard passport aspect ratio for government portals.' },
    { name: 'Scanned Signature', dimensions: '300 × 80 px', size: 'Max 20 KB', desc: 'Clean white background & crisp blue/black ink.' },
    { name: 'Job Application Photo', dimensions: '600 × 600 px', size: 'Max 200 KB', desc: 'Square portrait suitable for professional profiles.' },
    { name: 'College Admission Form', dimensions: '400 × 500 px', size: 'Max 100 KB', desc: 'Compliant resolution for university upload portals.' },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% In-Browser & Local File Privacy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Prepare Your Images for <br />
            <span className="text-gradient">Any Application</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Compress, resize, convert, crop, and edit photos and signatures — directly inside your browser. No server uploads, no wait times, zero quality compromise.
          </p>

          {/* Quick Action Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/compress"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Compress Image</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/resize"
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-sm transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Resize Image</span>
            </Link>
            <Link
              to="/signature"
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-sm transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Signature Tool</span>
            </Link>
            <Link
              to="/convert"
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-sm transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Convert Format</span>
            </Link>
          </div>

          {/* Key Specs Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/60 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Exact KB / MB Compression</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Passport & Signature Presets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Zero Backend Transmission</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="purple" size="sm">
            Complete Utility Suite
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
            Select an Image Tool
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Tailored tools designed specifically for application forms, exams, government portals, and college admissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Quick Application Presets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> Quick Presets
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Popular Portal Preset Formats</h2>
              <p className="text-xs text-slate-400 mt-1">
                Common sample formats used across exam and job portals. (Custom dimensions & sizes are fully adjustable).
              </p>
            </div>
            <Link
              to="/resize"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold transition-colors"
            >
              <span>Explore All Presets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {presets.map((item, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">{item.size}</span>
                </div>
                <div className="text-xs font-mono text-slate-300">{item.dimensions}</div>
                <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ImageFit */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Use ImageFit?</h2>
          <p className="text-sm text-slate-400 mt-2">
            Built for maximum privacy, speed, and precision when preparing confidential photos and signature documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">100% Client-Side Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your files never touch remote servers or databases. All computations execute locally in your web browser memory.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Instant Browser Processing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No uploading delays or server queues. Process images of any size instantly using high-speed HTML5 Canvas APIs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Target KB Precision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set target file size limits (e.g. 50 KB) and let our binary search algorithm calculate the exact compression needed.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How It Works</h2>
            <p className="text-sm text-slate-400 mt-2">Three simple steps to prepare compliant images.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                1
              </div>
              <h3 className="text-base font-semibold text-white">Upload Your File</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag and drop your photo or signature file (JPG, PNG, WebP) into the browser editor.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
                2
              </div>
              <h3 className="text-base font-semibold text-white">Configure Requirements</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Specify target KB size, pixel dimensions, background color, or signature ink options.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                3
              </div>
              <h3 className="text-base font-semibold text-white">Download Result</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare original vs processed details and download your compliant image immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-200 hover:text-white"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
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
