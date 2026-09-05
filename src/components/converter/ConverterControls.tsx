import React, { useState } from 'react';
import {
  RefreshCw,
  Sliders,
  AlertTriangle,
  Info,
  Palette,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { TargetFormat, ConvertOptions } from '../../utils/image/convertImage';

export interface ConverterSettings extends ConvertOptions {
  // extensions
}

interface ConverterControlsProps {
  originalFormat: string;
  originalSizeFormatted: string;
  onConvert: (settings: ConverterSettings) => void;
  isProcessing: boolean;
}

const BG_PRESETS = [
  { name: 'Pure White (Gov/Portal Std)', color: '#FFFFFF' },
  { name: 'Off-White', color: '#F8FAFC' },
  { name: 'Light Gray', color: '#E2E8F0' },
  { name: 'Pure Black', color: '#000000' },
  { name: 'Passport Light Blue', color: '#E0F2FE' },
];

export const ConverterControls: React.FC<ConverterControlsProps> = ({
  originalFormat,
  onConvert,
  isProcessing,
}) => {
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('jpeg');
  const [quality, setQuality] = useState<number>(0.92);
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [fillBackground, setFillBackground] = useState<boolean>(false);

  const cleanOriginalFormat = originalFormat.toLowerCase().replace('image/', '');
  const isOriginalPngOrWebp = ['png', 'webp', 'svg'].includes(cleanOriginalFormat);
  const isTargetJpeg = targetFormat === 'jpeg';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConvert({
      targetFormat,
      quality,
      backgroundColor,
      fillBackground: isTargetJpeg ? true : fillBackground,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Conversion Settings</h2>
            <p className="text-xs text-slate-400">Select target image format and compression preferences</p>
          </div>
        </div>
      </div>

      {/* Target Format Radio / Pill Cards */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Select Target Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* JPG Card */}
          <button
            type="button"
            onClick={() => setTargetFormat('jpeg')}
            className={`text-left p-4 rounded-2xl border transition-all relative ${
              targetFormat === 'jpeg'
                ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-base font-extrabold ${targetFormat === 'jpeg' ? 'text-white' : 'text-slate-300'}`}>
                JPG / JPEG
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">
                Universal
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard for all exam portals, job apps & government forms. Lossy, compact file size.
            </p>
            <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
              <span>Alpha transparency:</span>
              <span className="text-amber-400/90 font-medium">Flattens to background</span>
            </div>
          </button>

          {/* PNG Card */}
          <button
            type="button"
            onClick={() => setTargetFormat('png')}
            className={`text-left p-4 rounded-2xl border transition-all relative ${
              targetFormat === 'png'
                ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-base font-extrabold ${targetFormat === 'png' ? 'text-white' : 'text-slate-300'}`}>
                PNG
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                Lossless
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crisp edges, perfect for signatures, logos & graphics. Preserves transparency.
            </p>
            <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
              <span>Alpha transparency:</span>
              <span className="text-emerald-400/90 font-medium">Preserved</span>
            </div>
          </button>

          {/* WebP Card */}
          <button
            type="button"
            onClick={() => setTargetFormat('webp')}
            className={`text-left p-4 rounded-2xl border transition-all relative ${
              targetFormat === 'webp'
                ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-base font-extrabold ${targetFormat === 'webp' ? 'text-white' : 'text-slate-300'}`}>
                WebP
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                Modern Web
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google modern web format with ~30% better compression than JPEG, supports transparency.
            </p>
            <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
              <span>Alpha transparency:</span>
              <span className="text-emerald-400/90 font-medium">Preserved</span>
            </div>
          </button>
        </div>
      </div>

      {/* Format Limitation & Transparency Notice */}
      {isTargetJpeg && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-200">
              Transparency Notice for JPEG Conversion
            </p>
            <p className="text-slate-300 leading-relaxed">
              The JPEG standard does not support transparent alpha channels. Any transparent background pixels
              will be automatically filled with your chosen solid background color below (default: white), preventing default black backgrounds.
            </p>
          </div>
        </div>
      )}

      {targetFormat === 'webp' && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-blue-200">
              Portal Compatibility Note
            </p>
            <p className="text-slate-300 leading-relaxed">
              WebP offers incredible file size reduction. However, some legacy government or bank portals require strict JPG or PNG files. If your portal rejects WebP, choose JPG.
            </p>
          </div>
        </div>
      )}

      {/* Background Color Settings for JPEG or Optional Fill */}
      {(isTargetJpeg || isOriginalPngOrWebp) && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                {isTargetJpeg ? 'Background Fill Color' : 'Optional Solid Background Fill'}
              </label>
            </div>
            {!isTargetJpeg && (
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fillBackground}
                  onChange={(e) => setFillBackground(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                />
                Fill background
              </label>
            )}
          </div>

          {(isTargetJpeg || fillBackground) && (
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap gap-2 items-center">
                {BG_PRESETS.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setBackgroundColor(preset.color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                      backgroundColor.toUpperCase() === preset.color.toUpperCase()
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-600"
                      style={{ backgroundColor: preset.color }}
                    />
                    {preset.name}
                  </button>
                ))}

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-2.5 py-1">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                    title="Choose custom color"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-20 bg-transparent text-xs text-white font-mono uppercase focus:outline-none"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quality Settings Slider (JPG & WebP) */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Quality & Compression
            </label>
          </div>
          {targetFormat !== 'png' ? (
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
              {Math.round(quality * 100)}%
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              Lossless (100% Retained)
            </span>
          )}
        </div>

        {targetFormat !== 'png' ? (
          <div className="space-y-3">
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.01"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Smaller Size (20%)</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuality(0.8)}
                  className={`px-2 py-0.5 rounded text-[10px] ${quality === 0.8 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  80% (Medium)
                </button>
                <button
                  type="button"
                  onClick={() => setQuality(0.92)}
                  className={`px-2 py-0.5 rounded text-[10px] ${quality === 0.92 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  92% (High)
                </button>
                <button
                  type="button"
                  onClick={() => setQuality(1.0)}
                  className={`px-2 py-0.5 rounded text-[10px] ${quality === 1.0 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  100% (Max)
                </button>
              </div>
              <span>Highest Quality (100%)</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              PNG uses lossless compression algorithms. Every pixel and transparency level is preserved without quality degradation.
            </span>
          </div>
        )}
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Converting Format...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Convert to {targetFormat.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
