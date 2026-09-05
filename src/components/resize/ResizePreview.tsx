import React from 'react';
import { Download, CheckCircle2, ArrowRight, ShieldCheck, Maximize2 } from 'lucide-react';
import type { ImageMetadata } from '../../types';
import type { ResizeResult, FitMode } from '../../utils/image/resizeImage';
import { Badge } from '../common/Badge';
import { triggerFileDownload, generateDownloadFilename } from '../../utils/image/downloadImage';

interface ResizePreviewProps {
  original: ImageMetadata;
  result: ResizeResult;
  fitMode?: FitMode;
}

export const ResizePreview: React.FC<ResizePreviewProps> = ({
  original,
  result,
  fitMode = 'exact',
}) => {
  const handleDownload = () => {
    const filename = generateDownloadFilename(original.name, 'resized', result.format);
    triggerFileDownload(result.blob, filename);
  };

  const scaleChange =
    original.width > 0
      ? Math.round((result.width / original.width) * 100)
      : 100;

  const fitModeLabel =
    fitMode === 'contain' ? 'Fit & Pad' : fitMode === 'cover' ? 'Crop & Fill' : 'Exact Stretch';

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Banner with status badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-purple-400" />
              Resize Complete
            </h3>
            <Badge variant="purple" size="sm">
              <CheckCircle2 className="w-3 h-3" />
              {result.width} × {result.height} px
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Dimension conversion rendered with smooth bicubic canvas resampling
          </p>
        </div>

        {/* Big Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" />
          <span>Download Resized Image</span>
        </button>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Box */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Before (Original)</span>
            <Badge variant="slate" size="sm">{original.formatExtension}</Badge>
          </div>

          <div className="w-full h-56 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center overflow-hidden p-2">
            <img
              src={original.previewUrl}
              alt="Original preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/80 pt-3">
            <div>
              <span className="text-slate-500 block text-[11px]">Original Resolution</span>
              <span className="font-mono font-semibold text-slate-200">
                {original.width} × {original.height} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">File Size</span>
              <span className="font-mono font-semibold text-slate-200">{original.formattedSize}</span>
            </div>
          </div>
        </div>

        {/* Processed Box */}
        <div className="rounded-2xl bg-slate-900/90 border border-purple-500/30 p-5 space-y-4 relative overflow-hidden shadow-xl shadow-purple-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">After (Resized)</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                {scaleChange}% scale
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                {fitModeLabel}
              </span>
              <Badge variant="purple" size="sm">{result.format}</Badge>
            </div>
          </div>

          <div className="w-full h-56 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center overflow-hidden p-2">
            <img
              src={result.previewUrl}
              alt="Resized result preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/80 pt-3">
            <div>
              <span className="text-slate-500 block text-[11px]">New Resolution</span>
              <span className="font-mono font-bold text-purple-300 text-sm">
                {result.width} × {result.height} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">New File Size</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-emerald-400 text-sm">{result.formattedSize}</span>
                {result.reductionPercentage > 0 && (
                  <span className="text-[10px] text-emerald-400">(-{result.reductionPercentage}%)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Resized locally in browser memory (no upload required)</span>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>Click to download {result.format} ({result.width}×{result.height})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
