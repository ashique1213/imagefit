import React from 'react';
import {
  Download,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  PenTool,
  Layers,
} from 'lucide-react';
import type { SignatureResult } from '../../utils/image/signatureProcess';
import { triggerFileDownload, generateDownloadFilename } from '../../utils/image/downloadImage';

interface SignaturePreviewProps {
  originalName: string;
  originalWidth: number;
  originalHeight: number;
  originalFormattedSize: string;
  originalFormat: string;
  originalPreviewUrl: string;
  result: SignatureResult;
  inkColorMode: string;
  backgroundColorMode: string;
  onEditSettings: () => void;
  onResetAll: () => void;
}

export const SignaturePreview: React.FC<SignaturePreviewProps> = ({
  originalName,
  originalWidth,
  originalHeight,
  originalFormattedSize,
  originalFormat,
  originalPreviewUrl,
  result,
  inkColorMode,
  backgroundColorMode,
  onEditSettings,
  onResetAll,
}) => {
  const downloadFilename = generateDownloadFilename(originalName, 'signature', result.format);

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
              Signature Cleaned & Recolored
            </h2>
            <p className="text-xs text-slate-400">
              Paper grain removed, ink normalized ({result.width} × {result.height} px)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold">
            <PenTool className="w-3.5 h-3.5" />
            <span>Anti-Aliased Ink</span>
          </span>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Scanned Signature */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Original Scanned Photo
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {originalFormat.replace('image/', '')}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center checkerboard-pattern">
            <img
              src={originalPreviewUrl}
              alt="Original scanned signature"
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

        {/* Processed Signature Output */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-purple-500/30 ring-1 ring-purple-500/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5" />
              Processed Signature
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {result.format.toUpperCase()}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center checkerboard-pattern">
            <img
              src={result.previewUrl}
              alt="Cleaned signature output"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px]">Background & Ink</span>
              <span className="font-semibold text-white capitalize">
                {backgroundColorMode} / {inkColorMode}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Processed Size</span>
              <span className="font-mono font-bold text-white">{result.formattedSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency / Background Badge Note */}
      <div className="text-xs p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-3">
        <Layers className="w-4 h-4 text-purple-400 shrink-0" />
        <span>
          {result.isTransparent ? (
            <>
              <strong>Transparent PNG Ready:</strong> Paper background is completely removed (alpha 0). Ready for embedding into PDFs, job letters, and digital forms.
            </>
          ) : (
            <>
              <strong>Clean Solid Background:</strong> Paper grain and camera shadows flattened to a uniform solid backdrop.
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
          onClick={onEditSettings}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <PenTool className="w-4 h-4" />
          <span>Adjust Settings</span>
        </button>

        <button
          type="button"
          onClick={onResetAll}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Process Another</span>
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Pixel data thresholding executed 100% locally in browser memory.</span>
      </div>
    </div>
  );
};
