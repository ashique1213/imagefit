import React, { useState } from 'react';
import {
  Archive,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  HardDrive,
} from 'lucide-react';
import type { BatchItem } from '../../utils/image/batchProcess';
import { formatBytes } from '../../utils/formatting/formatSize';
import { generateBatchZip } from '../../utils/image/batchProcess';
import { triggerFileDownload } from '../../utils/image/downloadImage';

interface BatchProgressCardProps {
  items: BatchItem[];
  isProcessing: boolean;
  onReset: () => void;
}

export const BatchProgressCard: React.FC<BatchProgressCardProps> = ({
  items,
  isProcessing,
  onReset,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

  const totalCount = items.length;
  const completedItems = items.filter((i) => i.status === 'done');
  const errorItems = items.filter((i) => i.status === 'error');
  const doneCount = completedItems.length;
  const errorCount = errorItems.length;
  const processedCount = doneCount + errorCount;
  const progressPercent = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  // Aggregate size calculations
  const originalTotalBytes = completedItems.reduce((acc, i) => acc + i.originalSizeBytes, 0);
  const processedTotalBytes = completedItems.reduce(
    (acc, i) => acc + (i.result?.sizeBytes || 0),
    0
  );
  const bytesSaved = Math.max(0, originalTotalBytes - processedTotalBytes);
  const reductionPercentage =
    originalTotalBytes > 0
      ? Math.round(((originalTotalBytes - processedTotalBytes) / originalTotalBytes) * 100)
      : 0;

  const handleDownloadZip = async () => {
    if (completedItems.length === 0) return;
    try {
      setIsZipping(true);
      setZipError(null);
      const zipName = `imagefit-batch-${new Date().toISOString().slice(0, 10)}.zip`;
      const { blob, filename } = await generateBatchZip(items, zipName);
      triggerFileDownload(blob, filename);
    } catch (err: any) {
      setZipError(err.message || 'Failed to assemble ZIP archive.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Progress Header & Percentage */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">
              {isProcessing
                ? 'Processing Batch...'
                : doneCount === totalCount
                ? 'Batch Processing Complete!'
                : 'Batch Progress'}
            </h3>
            {doneCount === totalCount && !isProcessing && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {processedCount} of {totalCount} files finished ({progressPercent}%)
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          {doneCount > 0 && (
            <span className="text-xs px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
              {doneCount} Succeeded
            </span>
          )}
          {errorCount > 0 && (
            <span className="text-xs px-3 py-1 rounded-xl bg-red-500/10 text-red-400 font-medium border border-red-500/20 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {errorCount} Failed
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-900/80 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isProcessing
                ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Statistics Cards (when at least one item completed) */}
      {completedItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>Original Size</span>
            </div>
            <div className="text-base font-bold text-white">
              {formatBytes(originalTotalBytes)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Processed Size</span>
            </div>
            <div className="text-base font-bold text-white">
              {formatBytes(processedTotalBytes)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Size Saved</span>
            </div>
            <div className="text-base font-bold text-emerald-400">
              {reductionPercentage > 0 ? (
                <>
                  -{reductionPercentage}%{' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({formatBytes(bytesSaved)})
                  </span>
                </>
              ) : (
                '0%'
              )}
            </div>
          </div>
        </div>
      )}

      {/* ZIP Error Alert */}
      {zipError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{zipError}</span>
        </div>
      )}

      {/* Main Download and Reset Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={completedItems.length === 0 || isZipping || isProcessing}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isZipping ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Packing ZIP Archive...</span>
            </>
          ) : (
            <>
              <Archive className="w-5 h-5" />
              <span>Download All as ZIP ({doneCount} {doneCount === 1 ? 'file' : 'files'})</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isProcessing}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold border border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
        >
          Reset Batch
        </button>
      </div>
    </div>
  );
};
