import React from 'react';
import {
  Download,
  CheckCircle2,
  ShieldCheck,
  Scissors,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { CropResult } from '../../utils/image/cropImage';
import { triggerFileDownload, generateDownloadFilename } from '../../utils/image/downloadImage';

interface CropPreviewProps {
  originalName: string;
  originalWidth: number;
  originalHeight: number;
  originalFormattedSize: string;
  originalFormat: string;
  originalPreviewUrl: string;
  result: CropResult;
  onEditCrop: () => void;
  onResetAll: () => void;
}

export const CropPreview: React.FC<CropPreviewProps> = ({
  originalName,
  originalWidth,
  originalHeight,
  originalFormattedSize,
  originalFormat,
  originalPreviewUrl,
  result,
  onEditCrop,
  onResetAll,
}) => {
  const downloadFilename = generateDownloadFilename(originalName, 'cropped', result.format);

  const handleDownload = () => {
    triggerFileDownload(result.blob, downloadFilename);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Image Cropped Successfully
            </h2>
            <p className="text-xs text-slate-400">
              Extracted region ready for application download ({result.width} × {result.height} px)
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Resolution Extraction</span>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Original Photo
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {originalFormat.replace('image/', '')}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center">
            <img
              src={originalPreviewUrl}
              alt="Original uncropped"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px]">Dimensions</span>
              <span className="font-mono text-slate-200">
                {originalWidth} × {originalHeight} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">File Size</span>
              <span className="font-mono text-slate-200">{originalFormattedSize}</span>
            </div>
          </div>
        </div>

        {/* Cropped Output */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-purple-500/30 ring-1 ring-purple-500/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" />
              Cropped Output
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {result.format.toUpperCase()}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center">
            <img
              src={result.previewUrl}
              alt="Cropped output"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px]">New Dimensions</span>
              <span className="font-mono font-bold text-purple-300">
                {result.width} × {result.height} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Cropped Size</span>
              <span className="font-mono font-bold text-white">{result.formattedSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
          onClick={onEditCrop}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Scissors className="w-4 h-4" />
          <span>Adjust Crop</span>
        </button>

        <button
          type="button"
          onClick={onResetAll}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Crop Another</span>
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Pixel extraction executed 100% locally in browser memory.</span>
      </div>
    </div>
  );
};
