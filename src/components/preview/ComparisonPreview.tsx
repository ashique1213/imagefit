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
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Banner with status badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Compression Results</h3>
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
              <Badge variant="blue" size="sm">
                Custom Quality
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Compare your source file with the compressed output below
          </p>
        </div>

        {/* Big Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" />
          <span>Download Processed Image</span>
        </button>
      </div>

      {/* Target Status Clarification */}
      {targetSizeBytes && (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-center gap-3 ${
            isTargetAchieved
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          }`}
        >
          {isTargetAchieved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
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
              <span className="text-slate-500 block text-[11px]">Size</span>
              <span className="font-mono font-semibold text-slate-200">{original.formattedSize}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Resolution</span>
              <span className="font-mono font-semibold text-slate-200">{original.width} × {original.height} px</span>
            </div>
          </div>
        </div>

        {/* Processed Box */}
        <div className="rounded-2xl bg-slate-900/90 border border-blue-500/30 p-5 space-y-4 relative overflow-hidden shadow-xl shadow-blue-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">After (Compressed)</span>
              {result.reductionPercentage > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  -{result.reductionPercentage}% smaller
                </span>
              )}
            </div>
            <Badge variant="blue" size="sm">{result.format}</Badge>
          </div>

          <div className="w-full h-56 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center overflow-hidden p-2">
            <img
              src={result.previewUrl}
              alt="Compressed result preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/80 pt-3">
            <div>
              <span className="text-slate-500 block text-[11px]">New Size</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{result.formattedSize}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Resolution</span>
              <span className="font-mono font-semibold text-slate-200">{result.width} × {result.height} px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Image processed locally in browser session</span>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
        >
          <span>Click to download {result.format} file</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
