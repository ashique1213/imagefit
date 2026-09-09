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
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
      {/* Aspect Ratio Selector Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Aspect Ratio Presets
          </label>
          <span className="text-[11px] text-gray-500 font-medium">
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
                className={`px-3.5 py-3 rounded-2xl border text-xs font-bold flex flex-col items-start gap-0.5 transition-all text-left ${
                  isSelected
                    ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-xs ring-1 ring-orange-200'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={isSelected ? 'text-orange-700 font-extrabold' : ''}>
                    {preset.label}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 truncate w-full font-medium">
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
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-orange-600" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Zoom & Framing
            </label>
          </div>
          <span className="text-xs font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChangeZoom(Math.max(1, Math.round((zoom - 0.1) * 10) / 10))}
            disabled={zoom <= 1}
            className="p-2 rounded-xl bg-white text-gray-700 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 shadow-xs"
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
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />

          <button
            type="button"
            onClick={() => onChangeZoom(Math.min(3, Math.round((zoom + 0.1) * 10) / 10))}
            disabled={zoom >= 3}
            className="p-2 rounded-xl bg-white text-gray-700 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 shadow-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {zoom !== 1 && (
            <button
              type="button"
              onClick={() => onChangeZoom(1)}
              className="text-[11px] px-2.5 py-1.5 rounded-xl bg-white text-gray-600 hover:text-gray-900 border border-gray-200 font-bold"
            >
              Reset Zoom
            </button>
          )}
        </div>
      </div>

      {/* Export Format & Quality Options */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-600" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {outputSettings.format !== 'image/png' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
              <span>Quality ({Math.round(outputSettings.quality * 100)}%)</span>
              <span className="text-[10px] text-gray-400">Higher quality preserves facial details</span>
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>
        )}
      </div>

      {/* Action Buttons: iLovePDF Style Giant Action CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onApplyCrop}
          disabled={isProcessing}
          className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-[#e5322d] hover:bg-[#cb1b16] active:scale-[0.99] font-black text-white text-base shadow-xl shadow-red-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Crop className="w-5 h-5 animate-spin" />
              <span>Cropping Image...</span>
            </>
          ) : (
            <>
              <Crop className="w-5 h-5" />
              <span>Crop IMAGE</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onResetCropBox}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm border border-gray-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Box</span>
        </button>
      </div>
    </div>
  );
};
