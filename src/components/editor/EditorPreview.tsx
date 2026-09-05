import React from 'react';
import {
  Download,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import type { EditorResult, EditorSettings } from '../../utils/image/editImage';
import { triggerFileDownload, generateDownloadFilename } from '../../utils/image/downloadImage';

interface EditorPreviewProps {
  originalName: string;
  originalWidth: number;
  originalHeight: number;
  originalFormattedSize: string;
  originalFormat: string;
  originalPreviewUrl: string;
  result: EditorResult;
  settings: EditorSettings;
  onEditSettings: () => void;
  onResetAll: () => void;
}

export const EditorPreview: React.FC<EditorPreviewProps> = ({
  originalName,
  originalWidth,
  originalHeight,
  originalFormattedSize,
  originalFormat,
  originalPreviewUrl,
  result,
  settings,
  onEditSettings,
  onResetAll,
}) => {
  const downloadFilename = generateDownloadFilename(originalName, 'edited', result.format);

  const handleDownload = () => {
    triggerFileDownload(result.blob, downloadFilename);
  };

  const isDimensionChanged =
    originalWidth !== result.width || originalHeight !== result.height;

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
              Transformations Applied
            </h2>
            <p className="text-xs text-slate-400">
              Output processed in browser memory ({result.width} × {result.height} px)
            </p>
          </div>
        </div>

        {/* Applied Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {settings.rotation !== 0 && (
            <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-semibold">
              {settings.rotation}° Rotated
            </span>
          )}
          {settings.flipHorizontal && (
            <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
              Mirrored (H)
            </span>
          )}
          {settings.flipVertical && (
            <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
              Mirrored (V)
            </span>
          )}
          {settings.brightness !== 0 && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
              Brightness {settings.brightness > 0 ? `+${settings.brightness}` : settings.brightness}%
            </span>
          )}
          {settings.contrast !== 0 && (
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
              Contrast {settings.contrast > 0 ? `+${settings.contrast}` : settings.contrast}%
            </span>
          )}
          {settings.grayscale && (
            <span className="px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40 text-[11px] font-semibold">
              B&W Grayscale
            </span>
          )}
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Original Photo
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {originalFormat.replace('image/', '')}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center checkerboard-pattern">
            <img
              src={originalPreviewUrl}
              alt="Original unedited"
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

        {/* Processed Result */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-blue-500/30 ring-1 ring-blue-500/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Edited Result
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              {result.format.toUpperCase()}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center checkerboard-pattern">
            <img
              src={result.previewUrl}
              alt="Edited output"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px]">Dimensions</span>
              <span
                className={`font-mono font-bold ${
                  isDimensionChanged ? 'text-blue-300' : 'text-slate-200'
                }`}
              >
                {result.width} × {result.height} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">New File Size</span>
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
          onClick={onEditSettings}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>Adjust Settings</span>
        </button>

        <button
          type="button"
          onClick={onResetAll}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Edit Another</span>
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Pixel matrices and color filters executed 100% locally in browser memory.</span>
      </div>
    </div>
  );
};
