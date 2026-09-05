import React from 'react';
import {
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';
import type { BatchItem } from '../../utils/image/batchProcess';
import { triggerFileDownload } from '../../utils/image/downloadImage';

interface BatchQueueListProps {
  items: BatchItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onAddMore: () => void;
  isProcessing: boolean;
}

export const BatchQueueList: React.FC<BatchQueueListProps> = ({
  items,
  onRemoveItem,
  onClearAll,
  onAddMore,
  isProcessing,
}) => {
  const completedCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">
            Queue ({items.length} {items.length === 1 ? 'file' : 'files'})
          </h3>
          {completedCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
              {completedCount} Done
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddMore}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More</span>
          </button>
          <button
            type="button"
            onClick={onClearAll}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Queue</span>
          </button>
        </div>
      </div>

      {/* Queue items */}
      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {items.map((item) => {
          const isDone = item.status === 'done';
          const isBusy = item.status === 'processing';
          const isErr = item.status === 'error';

          return (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : isBusy
                  ? 'bg-blue-950/20 border-blue-500/40 ring-1 ring-blue-500/20'
                  : isErr
                  ? 'bg-red-950/20 border-red-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Thumbnail & File Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center checkerboard-pattern">
                  <img
                    src={item.result?.previewUrl || item.previewUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{item.originalFormattedSize}</span>
                    <span>•</span>
                    <span className="font-mono">
                      {item.result
                        ? `${item.result.width} × ${item.result.height} px`
                        : `${item.width} × ${item.height} px`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge & Action */}
              <div className="flex items-center gap-2 shrink-0">
                {isBusy && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-500/40">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Processing</span>
                  </div>
                )}

                {isDone && item.result && (
                  <div className="text-right space-y-0.5 hidden sm:block">
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.result.formattedSize}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">
                      {item.result.format}
                    </span>
                  </div>
                )}

                {isErr && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[11px]">
                    <AlertCircle className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{item.error || 'Error'}</span>
                  </div>
                )}

                {item.status === 'pending' && (
                  <div className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" />
                    <span>Queued</span>
                  </div>
                )}

                {/* Individual Download if completed */}
                {isDone && item.result && (
                  <button
                    type="button"
                    onClick={() => triggerFileDownload(item.result!.blob, item.result!.outputFilename)}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
                    title={`Download ${item.result.outputFilename}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Remove from queue */}
                {!isProcessing && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
