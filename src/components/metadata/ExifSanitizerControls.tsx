import React from 'react';
import {
  ShieldCheck,
  Download,
  RefreshCw,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import type { SanitizationResult } from '../../utils/image/exifInspector';

interface ExifSanitizerControlsProps {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  onChangeFormat: (format: 'image/jpeg' | 'image/png' | 'image/webp') => void;
  quality: number;
  onChangeQuality: (quality: number) => void;
  onStripMetadata: () => void;
  isStripping: boolean;
  result: SanitizationResult | null;
  onDownload: () => void;
}

export const ExifSanitizerControls: React.FC<ExifSanitizerControlsProps> = ({
  format,
  onChangeFormat,
  quality,
  onChangeQuality,
  onStripMetadata,
  isStripping,
  result,
  onDownload,
}) => {
  const formats: Array<{ id: 'image/jpeg' | 'image/png' | 'image/webp'; label: string; desc: string }> = [
    { id: 'image/jpeg', label: 'JPG / JPEG', desc: 'Standard for all application portals' },
    { id: 'image/png', label: 'PNG', desc: 'Lossless quality for documents & signatures' },
    { id: 'image/webp', label: 'WebP', desc: 'Modern high compression format' },
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Sanitization Configuration</span>
        </h3>
        <p className="text-xs text-slate-400">
          Re-encodes your image through an isolated client canvas, removing all EXIF, GPS, camera
          hardware serials, and timestamps.
        </p>
      </div>

      {/* Target Format Selector */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Output Clean Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => onChangeFormat(fmt.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                format === fmt.id
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-xs">{fmt.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{fmt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quality Slider (for JPG and WebP) */}
      {format !== 'image/png' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Image Quality</span>
            <span className="font-bold text-emerald-400">{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.05"
            value={quality}
            onChange={(e) => onChangeQuality(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>50% (Smaller Size)</span>
            <span>92% (Recommended)</span>
            <span>100% (Maximum Quality)</span>
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onStripMetadata}
          disabled={isStripping}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isStripping ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Sanitizing EXIF Data in Canvas...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Strip All EXIF & GPS Metadata</span>
            </>
          )}
        </button>
      </div>

      {/* Sanitized Success Result Card */}
      {result && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm text-white">Metadata Stripped Successfully!</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
              0 EXIF Bytes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Clean Output Size</span>
              <span className="font-bold text-white text-sm">{result.formattedSize}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Clean File Format</span>
              <span className="font-bold text-emerald-300 text-sm">{result.format}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onDownload}
            className="w-full py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Clean Image ({result.filename})</span>
          </button>
        </div>
      )}
    </div>
  );
};
