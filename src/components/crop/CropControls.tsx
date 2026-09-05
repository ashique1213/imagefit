import React from 'react';
import {
  Crop,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sliders,
} from 'lucide-react';
import type { AspectRatioPreset } from '../../utils/image/cropImage';
import { CROP_RATIO_PRESETS } from '../../utils/image/cropImage';

export interface CropOutputSettings {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
}

interface CropControlsProps {
  activeRatioId: AspectRatioPreset;
  onSelectRatio: (preset: AspectRatioPreset) => void;
  zoom: number;
  onChangeZoom: (zoom: number) => void;
  outputSettings: CropOutputSettings;
  onChangeOutputSettings: (settings: CropOutputSettings) => void;
  onResetCropBox: () => void;
  onApplyCrop: () => void;
  isProcessing: boolean;
}

export const CropControls: React.FC<CropControlsProps> = ({
  activeRatioId,
  onSelectRatio,
  zoom,
  onChangeZoom,
  outputSettings,
  onChangeOutputSettings,
  onResetCropBox,
  onApplyCrop,
  isProcessing,
}) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Aspect Ratio Selector Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Aspect Ratio Presets
          </label>
          <span className="text-[11px] text-slate-400">
            {CROP_RATIO_PRESETS.find((p) => p.id === activeRatioId)?.description}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CROP_RATIO_PRESETS.map((preset) => {
            const isSelected = activeRatioId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectRatio(preset.id)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex flex-col items-start gap-0.5 transition-all text-left ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500/70 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={isSelected ? 'text-purple-300 font-bold' : ''}>
                    {preset.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 truncate w-full font-normal">
                  {preset.category === 'passport'
                    ? 'Passport Standard'
                    : preset.category === 'signature'
                    ? 'Signature Box'
                    : preset.category === 'display'
                    ? 'Standard Display'
                    : 'Universal'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zoom Control Section */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-purple-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Zoom & Framing
            </label>
          </div>
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChangeZoom(Math.max(1, Math.round((zoom - 0.1) * 10) / 10))}
            disabled={zoom <= 1}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => onChangeZoom(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          <button
            type="button"
            onClick={() => onChangeZoom(Math.min(3, Math.round((zoom + 0.1) * 10) / 10))}
            disabled={zoom >= 3}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {zoom !== 1 && (
            <button
              type="button"
              onClick={() => onChangeZoom(1)}
              className="text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            >
              Reset Zoom
            </button>
          )}
        </div>
      </div>

      {/* Export Format & Quality Options */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Output Export Format
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => {
            const isSelected = outputSettings.format === fmt;
            const label = fmt === 'image/jpeg' ? 'JPG (Portals)' : fmt === 'image/png' ? 'PNG (Lossless)' : 'WebP (Modern)';
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => onChangeOutputSettings({ ...outputSettings, format: fmt })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {outputSettings.format !== 'image/png' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Quality ({Math.round(outputSettings.quality * 100)}%)</span>
              <span className="text-[10px] text-slate-500">Higher quality preserves facial details</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.02"
              value={outputSettings.quality}
              onChange={(e) =>
                onChangeOutputSettings({
                  ...outputSettings,
                  quality: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onApplyCrop}
          disabled={isProcessing}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Crop className="w-5 h-5 animate-spin" />
              <span>Cropping Image...</span>
            </>
          ) : (
            <>
              <Crop className="w-5 h-5" />
              <span>Apply & Preview Crop</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onResetCropBox}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Box</span>
        </button>
      </div>
    </div>
  );
};
