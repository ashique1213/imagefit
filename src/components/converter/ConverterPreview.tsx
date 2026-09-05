import React from 'react';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  TrendingDown,
  TrendingUp,
  Layers,
} from 'lucide-react';
import type { ConvertResult } from '../../utils/image/convertImage';
import { FORMAT_EXT_MAP } from '../../utils/image/convertImage';
import { triggerFileDownload, generateDownloadFilename } from '../../utils/image/downloadImage';
import { formatBytes } from '../../utils/formatting/formatSize';

interface ConverterPreviewProps {
  originalName: string;
  originalSize: number;
  originalFormattedSize: string;
  originalFormat: string;
  originalDimensions: { width: number; height: number };
  originalPreviewUrl: string;
  result: ConvertResult;
  onReset: () => void;
}

export const ConverterPreview: React.FC<ConverterPreviewProps> = ({
  originalName,
  originalSize,
  originalFormattedSize,
  originalFormat,
  originalDimensions,
  originalPreviewUrl,
  result,
  onReset,
}) => {
  const extension = FORMAT_EXT_MAP[result.targetFormat] || 'jpg';
  const downloadFilename = generateDownloadFilename(originalName, 'converted', extension);

  const handleDownload = () => {
    triggerFileDownload(result.blob, downloadFilename);
  };

  const sizeDelta = result.sizeBytes - originalSize;
  const percentDelta = Math.round(((result.sizeBytes - originalSize) / originalSize) * 100);
  const isSmaller = sizeDelta < 0;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Conversion Complete
            </h2>
            <p className="text-xs text-slate-400">
              Successfully converted to {result.targetFormat.toUpperCase()} ({result.mimeType})
            </p>
          </div>
        </div>

        {/* Size Delta Badge */}
        <div className="flex items-center gap-2">
          {isSmaller ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <TrendingDown className="w-4 h-4" />
              <span>{Math.abs(percentDelta)}% Smaller ({formatBytes(Math.abs(sizeDelta))} saved)</span>
            </div>
          ) : sizeDelta > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+{percentDelta}% Size Change</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <span>Identical Size</span>
            </div>
          )}
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Original Image
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {originalFormat.replace('image/', '')}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center checkerboard-pattern">
            <img
              src={originalPreviewUrl}
              alt="Original preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px]">Dimensions</span>
              <span className="font-mono text-slate-200">
                {originalDimensions.width} × {originalDimensions.height} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">File Size</span>
              <span className="font-mono text-slate-200">{originalFormattedSize}</span>
            </div>
          </div>
        </div>

        {/* Converted */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-blue-500/30 ring-1 ring-blue-500/20 flex flex-col justify-between space-y-4 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              Converted Result
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              {result.targetFormat.toUpperCase()}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center checkerboard-pattern">
            <img
              src={result.previewUrl}
              alt="Converted output"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px]">Dimensions</span>
              <span className="font-mono text-slate-200">
                {result.width} × {result.height} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">File Size</span>
              <span className="font-mono font-bold text-white">{result.formattedSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Status Note */}
      <div className="text-xs p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-3">
        <Layers className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          {result.filledBackground ? (
            <>
              <strong>Transparency Handled:</strong> Background filled with solid color to guarantee safe rendering on standard JPEG portals.
            </>
          ) : result.targetFormat === 'jpeg' ? (
            <>
              <strong>Solid Format:</strong> Rendered as JPEG standard RGB.
            </>
          ) : (
            <>
              <strong>Alpha Transparency:</strong> Full transparent channel preserved for high-fidelity graphic display.
            </>
          )}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>Download {downloadFilename}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold transition-all cursor-pointer"
        >
          Convert Another
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Processed 100% in browser memory. Zero server uploads.</span>
      </div>
    </div>
  );
};
