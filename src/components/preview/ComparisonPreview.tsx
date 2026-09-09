import React from 'react';
import { Download, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import type { ImageMetadata } from '../../types';
import type { CompressionResultExtended } from '../../utils/image/compressImage';
import { Badge } from '../common/Badge';
import { triggerFileDownload, generateDownloadFilename } from '../../utils/image/downloadImage';
import { formatBytes } from '../../utils/formatting/formatSize';

interface ComparisonPreviewProps {
  original: ImageMetadata;
  result: CompressionResultExtended;
  targetSizeBytes?: number;
}

export const ComparisonPreview: React.FC<ComparisonPreviewProps> = ({
  original,
  result,
  targetSizeBytes,
}) => {
  const handleDownload = () => {
    const filename = generateDownloadFilename(original.name, 'compressed', result.format);
    triggerFileDownload(result.blob, filename);
  };

  const isTargetAchieved = result.achievableStatus === 'success';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Banner with status badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">Compression Results</h3>
            {targetSizeBytes ? (
              isTargetAchieved ? (
                <Badge variant="green" size="sm">
                  <CheckCircle2 className="w-3 h-3" />
                  Target Achieved
                </Badge>
              ) : (
                <Badge variant="amber" size="sm">
                  <AlertCircle className="w-3 h-3" />
                  Closest Achievable
                </Badge>
              )
            ) : (
              <Badge variant="red" size="sm">
                Custom Quality
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Compare your source file with the compressed output below
          </p>
        </div>

        {/* Big Red Download Button (iLovePDF signature CTA) */}
        <button
          type="button"
          onClick={handleDownload}
          className="px-8 py-3.5 rounded-2xl bg-[#e5322d] hover:bg-[#cb1b16] text-white font-extrabold text-sm shadow-xl shadow-red-500/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download Compressed IMAGE</span>
        </button>
      </div>

      {/* Target Status Clarification */}
      {targetSizeBytes && (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-center gap-3 ${
            isTargetAchieved
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {isTargetAchieved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          )}
          <div>
            {isTargetAchieved ? (
              <span>
                <strong>Target met successfully:</strong> Resulting size is{' '}
                <strong>{result.formattedSize}</strong> (Requested target: {formatBytes(targetSizeBytes)}).
              </span>
            ) : (
              <span>
                <strong>Closest achievable size: {result.formattedSize}</strong> (Requested target: {formatBytes(targetSizeBytes)}). The image reached optimal compression without exceeding safe limits.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Box */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Before (Original)</span>
            <Badge variant="slate" size="sm">{original.formatExtension}</Badge>
          </div>

          <div className="w-full h-56 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden p-2">
            <img
              src={original.previewUrl}
              alt="Original preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-200 pt-3">
            <div>
              <span className="text-gray-500 block text-[11px]">Size</span>
              <span className="font-mono font-bold text-gray-900">{original.formattedSize}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Resolution</span>
              <span className="font-mono font-bold text-gray-900">{original.width} × {original.height} px</span>
            </div>
          </div>
        </div>

        {/* Processed Box */}
        <div className="rounded-2xl bg-gray-50 border border-red-200 p-5 space-y-4 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#e5322d] uppercase tracking-wider">After (Compressed)</span>
              {result.reductionPercentage > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  -{result.reductionPercentage}% smaller
                </span>
              )}
            </div>
            <Badge variant="red" size="sm">{result.format}</Badge>
          </div>

          <div className="w-full h-56 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden p-2">
            <img
              src={result.previewUrl}
              alt="Compressed result preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-200 pt-3">
            <div>
              <span className="text-gray-500 block text-[11px]">New Size</span>
              <span className="font-mono font-black text-emerald-600 text-sm">{result.formattedSize}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Resolution</span>
              <span className="font-mono font-bold text-gray-900">{result.width} × {result.height} px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Image processed locally in browser session</span>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="text-[#e5322d] hover:text-[#cb1b16] font-bold flex items-center gap-1"
        >
          <span>Click to download {result.format} file</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
