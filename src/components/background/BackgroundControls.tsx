import React from 'react';
import {
  Palette,
  Sliders,
  Sparkles,
  Check,
  Pipette,
  ShieldAlert,
} from 'lucide-react';
import type {
  BackgroundProcessOptions,
} from '../../utils/image/backgroundProcess';
import { BACKGROUND_PRESETS } from '../../utils/image/backgroundProcess';

interface BackgroundControlsProps {
  settings: BackgroundProcessOptions;
  onChangeSettings: (settings: BackgroundProcessOptions) => void;
  detectedSourceColor: string;
  hasTransparency: boolean;
  onProcess: () => void;
  isProcessing: boolean;
}

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  settings,
  onChangeSettings,
  detectedSourceColor,
  hasTransparency,
  onProcess,
  isProcessing,
}) => {
  const isTargetTransparent = settings.targetColorPreset === 'transparent';

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Mode Switcher */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Replacement Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, mode: 'color-key' })}
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-start gap-1 transition-all text-left ${
              settings.mode === 'color-key'
                ? 'bg-blue-600/20 border-blue-500/70 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="font-bold text-sm">Replace Plain Backdrop</span>
            <span className="text-[11px] text-slate-500 font-normal">
              For studio/passport photos taken against a solid or plain wall
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, mode: 'transparent-fill' })}
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-start gap-1 transition-all text-left relative ${
              settings.mode === 'transparent-fill'
                ? 'bg-blue-600/20 border-blue-500/70 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-sm">Fill Transparent Cutout</span>
              {hasTransparency && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Detected
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-normal">
              Fills background on existing transparent PNGs or logo graphics
            </span>
          </button>
        </div>
      </div>

      {/* Target Color Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Choose Target Background Color
            </label>
          </div>
          <span className="text-[11px] text-slate-400">
            {BACKGROUND_PRESETS.find((p) => p.id === settings.targetColorPreset)?.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BACKGROUND_PRESETS.map((preset) => {
            const isSelected = settings.targetColorPreset === preset.id;
            const displayColor =
              preset.id === 'custom'
                ? settings.customTargetColor || '#FDE047'
                : preset.hex;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChangeSettings({ ...settings, targetColorPreset: preset.id })}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/70 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {preset.id === 'transparent' ? (
                  <span className="w-4 h-4 rounded-full border border-slate-600 checkerboard-pattern shrink-0 flex items-center justify-center">
                    {isSelected && <Check className="w-2.5 h-2.5 text-blue-400 stroke-[3]" />}
                  </span>
                ) : (
                  <span
                    className="w-4 h-4 rounded-full border border-slate-600 shadow-sm shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: displayColor || '#FFFFFF' }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-2.5 h-2.5 stroke-[3] ${
                          preset.id === 'white' || preset.id === 'light-blue' || preset.id === 'off-white'
                            ? 'text-slate-900'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </span>
                )}
                <div className="truncate">
                  <span className="block truncate">{preset.name}</span>
                  {preset.isPortalStandard && (
                    <span className="text-[9px] text-blue-400 font-normal">Official Std</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Color Picker */}
        {settings.targetColorPreset === 'custom' && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <label className="text-xs text-slate-400">Custom Target Color:</label>
            <input
              type="color"
              value={settings.customTargetColor || '#FDE047'}
              onChange={(e) =>
                onChangeSettings({ ...settings, customTargetColor: e.target.value })
              }
              className="w-8 h-8 rounded-xl cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={settings.customTargetColor || '#FDE047'}
              onChange={(e) =>
                onChangeSettings({ ...settings, customTargetColor: e.target.value })
              }
              className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase focus:outline-none"
              placeholder="#FDE047"
            />
          </div>
        )}
      </div>

      {/* Color-Key Mode Details (Source Backdrop, Tolerance, Feathering) */}
      {settings.mode === 'color-key' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Pipette className="w-4 h-4 text-blue-400" />
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Source Backdrop Color to Replace
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-slate-600 shadow-sm"
                style={{ backgroundColor: settings.sourceColor || detectedSourceColor }}
              />
              <span className="text-xs font-mono font-bold text-slate-300">
                {settings.sourceColor || detectedSourceColor}
              </span>
              <input
                type="color"
                value={settings.sourceColor || detectedSourceColor}
                onChange={(e) =>
                  onChangeSettings({ ...settings, sourceColor: e.target.value })
                }
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                title="Adjust source color"
              />
            </div>
          </div>

          {/* Tolerance Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Color Match Tolerance
              </span>
              <span className="font-mono font-bold text-blue-400">{settings.tolerance}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              step="1"
              value={settings.tolerance}
              onChange={(e) =>
                onChangeSettings({ ...settings, tolerance: parseInt(e.target.value, 10) })
              }
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Strict Match (5%)</span>
              <span>Broader Range / Casts (70%)</span>
            </div>
          </div>

          {/* Feathering Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Edge Softness & Feathering</span>
              <span className="font-mono text-blue-400">{settings.feather} px</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={settings.feather}
              onChange={(e) =>
                onChangeSettings({ ...settings, feather: parseInt(e.target.value, 10) })
              }
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Sharp Cutout (0 px)</span>
              <span>Smooth Natural Hair Blending (30 px)</span>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
          Export File Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => {
            const isSelected = (settings.format || (isTargetTransparent ? 'image/png' : 'image/jpeg')) === fmt;
            const disabled = isTargetTransparent && fmt === 'image/jpeg';
            const label =
              fmt === 'image/jpeg' ? 'JPG (Portals)' : fmt === 'image/png' ? 'PNG (Lossless)' : 'WebP';

            return (
              <button
                key={fmt}
                type="button"
                disabled={disabled}
                onClick={() => onChangeSettings({ ...settings, format: fmt })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
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

      {/* Honest Technology & Privacy Disclaimer */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-blue-200">
            Privacy & Architecture Guarantee
          </p>
          <p className="text-slate-300 leading-relaxed">
            ImageFit performs mathematical color-key replacement and edge-tolerance smoothing locally in browser memory for photos taken against uniform walls. We deliberately avoid sending your biometric face photos to third-party cloud AI servers.
          </p>
        </div>
      </div>

      {/* Process Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onProcess}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Palette className="w-5 h-5 animate-spin" />
              <span>Processing Background Pixels...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Apply Background Color</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
