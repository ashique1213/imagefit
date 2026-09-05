import React from 'react';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Contrast,
  FileText,
  Sliders,
  Rotate3D,
} from 'lucide-react';
import type { EditorSettings } from '../../utils/image/editImage';
import { DEFAULT_EDITOR_SETTINGS } from '../../utils/image/editImage';

interface EditorControlsProps {
  settings: EditorSettings;
  onChangeSettings: (settings: EditorSettings) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const EditorControls: React.FC<EditorControlsProps> = ({
  settings,
  onChangeSettings,
  onApply,
  isProcessing,
}) => {
  const handleRotateCW = () => {
    const next = ((settings.rotation + 90) % 360) as 0 | 90 | 180 | 270;
    onChangeSettings({ ...settings, rotation: next });
  };

  const handleRotateCCW = () => {
    const next = ((settings.rotation - 90 + 360) % 360) as 0 | 90 | 180 | 270;
    onChangeSettings({ ...settings, rotation: next });
  };

  const handleToggleFlipH = () => {
    onChangeSettings({ ...settings, flipHorizontal: !settings.flipHorizontal });
  };

  const handleToggleFlipV = () => {
    onChangeSettings({ ...settings, flipVertical: !settings.flipVertical });
  };

  const handleReset = () => {
    onChangeSettings(DEFAULT_EDITOR_SETTINGS);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* 1. Orientation & Transform Tools */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rotate3D className="w-4 h-4 text-blue-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Orientation & Mirror Transforms
            </label>
          </div>
          {settings.rotation !== 0 && (
            <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {settings.rotation}° Rotated
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Rotate 90 CW */}
          <button
            type="button"
            onClick={handleRotateCW}
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4 text-blue-400" />
            <span>Rotate 90° CW</span>
          </button>

          {/* Rotate 90 CCW */}
          <button
            type="button"
            onClick={handleRotateCCW}
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-blue-400" />
            <span>Rotate 90° CCW</span>
          </button>

          {/* Flip Horizontal */}
          <button
            type="button"
            onClick={handleToggleFlipH}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              settings.flipHorizontal
                ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <FlipHorizontal className="w-4 h-4 text-blue-400" />
            <span>Mirror (Selfie Fix)</span>
          </button>

          {/* Flip Vertical */}
          <button
            type="button"
            onClick={handleToggleFlipV}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              settings.flipVertical
                ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <FlipVertical className="w-4 h-4 text-blue-400" />
            <span>Flip Vertical</span>
          </button>
        </div>
      </div>

      {/* 2. Brightness & Contrast Adjustment Sliders */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        {/* Brightness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Sun className="w-3.5 h-3.5 text-blue-400" />
              Brightness Adjustment
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-400">
                {settings.brightness > 0 ? `+${settings.brightness}` : settings.brightness}%
              </span>
              {settings.brightness !== 0 && (
                <button
                  type="button"
                  onClick={() => onChangeSettings({ ...settings, brightness: 0 })}
                  className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 bg-slate-800 rounded"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={settings.brightness}
            onChange={(e) =>
              onChangeSettings({ ...settings, brightness: parseInt(e.target.value, 10) })
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Darker (-100%)</span>
            <span>Neutral (0%)</span>
            <span>Brighter (+100%)</span>
          </div>
        </div>

        {/* Contrast */}
        <div className="space-y-2 pt-3 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Contrast className="w-3.5 h-3.5 text-blue-400" />
              Contrast Adjustment
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-400">
                {settings.contrast > 0 ? `+${settings.contrast}` : settings.contrast}%
              </span>
              {settings.contrast !== 0 && (
                <button
                  type="button"
                  onClick={() => onChangeSettings({ ...settings, contrast: 0 })}
                  className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 bg-slate-800 rounded"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={settings.contrast}
            onChange={(e) =>
              onChangeSettings({ ...settings, contrast: parseInt(e.target.value, 10) })
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Low Contrast (-100%)</span>
            <span>Original (0%)</span>
            <span>High Contrast (+100%)</span>
          </div>
        </div>

        {/* Black & White Document Mode Toggle */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-xs font-semibold text-white block">Black & White Document Mode</span>
              <span className="text-[10px] text-slate-400">
                Converts photos to grayscale for official document submissions
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.grayscale}
              onChange={(e) => onChangeSettings({ ...settings, grayscale: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* 3. Export File Format & Quality */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Export File Format
            </label>
          </div>
          {settings.format !== 'image/png' && (
            <span className="text-xs font-mono text-blue-400 font-bold">
              {Math.round(settings.quality * 100)}% Quality
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => {
            const isSelected = settings.format === fmt;
            const label =
              fmt === 'image/jpeg' ? 'JPG (Portals)' : fmt === 'image/png' ? 'PNG (Lossless)' : 'WebP';

            return (
              <button
                key={fmt}
                type="button"
                onClick={() => onChangeSettings({ ...settings, format: fmt })}
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

        {settings.format !== 'image/png' && (
          <div className="space-y-1 pt-1">
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.02"
              value={settings.quality}
              onChange={(e) =>
                onChangeSettings({ ...settings, quality: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onApply}
          disabled={isProcessing}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Sliders className="w-5 h-5 animate-spin" />
              <span>Rendering Transforms...</span>
            </>
          ) : (
            <>
              <Sliders className="w-5 h-5" />
              <span>Apply & Preview Adjustments</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Reset All</span>
        </button>
      </div>
    </div>
  );
};
