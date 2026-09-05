import React from 'react';
import {
  FileArchive,
  Zap,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import type {
  BatchSettings,
} from '../../utils/image/batchProcess';

interface BatchSettingsControlsProps {
  settings: BatchSettings;
  onChangeSettings: (settings: BatchSettings) => void;
  onProcessBatch: () => void;
  isProcessing: boolean;
  totalItems: number;
}

export const BatchSettingsControls: React.FC<BatchSettingsControlsProps> = ({
  settings,
  onChangeSettings,
  onProcessBatch,
  isProcessing,
  totalItems,
}) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* 1. Batch Operation Mode Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Select Batch Action
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Target KB Compress */}
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, mode: 'compress' })}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
              settings.mode === 'compress'
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileArchive className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-sm">Target KB Ceiling</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Binary search compression ensuring all files fit under target limit
            </p>
          </button>

          {/* Format Conversion */}
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, mode: 'convert' })}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
              settings.mode === 'convert'
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-sm">Convert Format</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Standardize all queue files to uniform JPG, PNG, or WebP
            </p>
          </button>

          {/* Scale / Resize */}
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, mode: 'resize' })}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
              settings.mode === 'resize'
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-sm">Batch Resize</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Scale dimensions down by percentage or constrain maximum edge
            </p>
          </button>
        </div>
      </div>

      {/* 2. Mode-Specific Configurations */}
      {settings.mode === 'compress' && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
            Target File Size Limit (KB)
          </label>
          <div className="flex flex-wrap gap-2">
            {[20, 50, 100, 200, 500].map((kb) => (
              <button
                key={kb}
                type="button"
                onClick={() => onChangeSettings({ ...settings, targetMaxKb: kb })}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  settings.targetMaxKb === kb
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                Max {kb} KB
              </button>
            ))}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1">
              <span className="text-[11px] text-slate-400">Custom:</span>
              <input
                type="number"
                min="5"
                max="10000"
                value={settings.targetMaxKb}
                onChange={(e) =>
                  onChangeSettings({ ...settings, targetMaxKb: parseInt(e.target.value, 10) || 50 })
                }
                className="w-16 bg-transparent text-xs text-white font-mono focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">KB</span>
            </div>
          </div>
        </div>
      )}

      {settings.mode === 'resize' && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
            Scale Percentage
          </label>
          <div className="flex flex-wrap gap-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => onChangeSettings({ ...settings, scalePercentage: pct })}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  settings.scalePercentage === pct
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {pct}% {pct === 100 ? '(Original)' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Output Format Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
          Target Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => {
            const isSelected = settings.targetFormat === fmt;
            const label =
              fmt === 'image/jpeg' ? 'JPG / JPEG (Exams)' : fmt === 'image/png' ? 'PNG (Lossless)' : 'WebP (Compact)';

            return (
              <button
                key={fmt}
                type="button"
                onClick={() => onChangeSettings({ ...settings, targetFormat: fmt })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onProcessBatch}
          disabled={isProcessing || totalItems === 0}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processing Batch in Browser Memory...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Process All {totalItems} Files</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
