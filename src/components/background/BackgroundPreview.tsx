import React from 'react';
import {
  Download,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Palette,
  Layers,
} from 'lucide-react';
import type { BackgroundResult } from '../../utils/image/backgroundProcess';
import { triggerFileDownload, generateDownloadFilename } from '../../utils/image/downloadImage';

interface BackgroundPreviewProps {
  originalName: string;
  originalWidth: number;
  originalHeight: number;
  originalFormattedSize: string;
  originalFormat: string;
  originalPreviewUrl: string;
  result: BackgroundResult;
  targetColorName: string;
  onEditSettings: () => void;
  onResetAll: () => void;
}

export const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  originalName,
  originalWidth,
  originalHeight,
  originalFormattedSize,
  originalFormat,
  originalPreviewUrl,
  result,
  targetColorName,
  onEditSettings,
  onResetAll,
}) => {
  const downloadFilename = generateDownloadFilename(originalName, 'bg', result.format);

  const handleDownload = () => {
    triggerFileDownload(result.blob, downloadFilename);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Background Color Replaced
            </h2>
            <p className="text-xs text-gray-500">
              New background applied at native resolution ({result.width} × {result.height} px)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {result.targetColorHex && (
            <span
              className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
              style={{ backgroundColor: result.targetColorHex }}
            />
          )}
          <span className="text-xs font-bold text-gray-800">{targetColorName}</span>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Original Photo
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200 font-semibold">
              {originalFormat.replace('image/', '')}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center checkerboard-pattern">
            <img
              src={originalPreviewUrl}
              alt="Original unedited photo"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200 text-gray-600">
            <div>
              <span className="text-gray-400 block text-[10px]">Dimensions</span>
              <span className="font-mono font-bold text-gray-800">
                {originalWidth} × {originalHeight} px
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">File Size</span>
              <span className="font-mono font-bold text-gray-800">{originalFormattedSize}</span>
            </div>
          </div>
        </div>

        {/* Processed Output */}
        <div className="p-4 rounded-2xl bg-red-50/40 border border-red-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#e5322d] uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              New Background Output
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white text-gray-700 border border-red-200 font-bold">
              {result.format.toUpperCase()}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center checkerboard-pattern">
            <img
              src={result.previewUrl}
              alt="Processed background output"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-red-100 text-gray-600">
            <div>
              <span className="text-gray-400 block text-[10px]">Target Color</span>
              <span className="font-bold text-gray-800">{targetColorName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Result Size</span>
              <span className="font-mono font-bold text-[#e5322d]">{result.formattedSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="text-xs p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 flex items-center gap-3">
        <Layers className="w-4 h-4 text-[#e5322d] shrink-0" />
        <span>
          {result.isTransparent ? (
            <>
              <strong className="text-gray-900">Transparent Backdrop:</strong> Background replaced with transparent alpha channel. Exported as lossless PNG.
            </>
          ) : (
            <>
              <strong className="text-gray-900">Clean Solid Fill:</strong> Replaced with uniform {targetColorName} background ready for official portal upload.
            </>
          )}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#e5322d] hover:bg-[#cb1b16] active:scale-[0.99] font-black text-white shadow-xl shadow-red-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer text-base"
        >
          <Download className="w-5 h-5" />
          <span>Download Image</span>
        </button>

        <button
          type="button"
          onClick={onEditSettings}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
        >
          <Palette className="w-4 h-4 text-[#e5322d]" />
          <span>Adjust Settings</span>
        </button>

        <button
          type="button"
          onClick={onResetAll}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Process Another</span>
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Color replacement executed 100% locally in browser memory.</span>
      </div>
    </div>
  );
};
