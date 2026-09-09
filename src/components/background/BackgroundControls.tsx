import React from 'react';
import {
  Palette,
  Sliders,
  Check,
  Pipette,
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
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
      {/* Mode Switcher */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Replacement Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, mode: 'color-key' })}
            className={`p-4 rounded-2xl border text-xs font-semibold flex flex-col items-start gap-1 transition-all text-left cursor-pointer ${
              settings.mode === 'color-key'
                ? 'bg-red-50/70 border-[#e5322d] text-gray-900 shadow-xs ring-1 ring-red-400'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-bold text-sm text-gray-900">Replace Plain Backdrop</span>
            <span className="text-[11px] text-gray-500 font-normal">
              For studio/passport photos taken against a solid or plain wall
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, mode: 'transparent-fill' })}
            className={`p-4 rounded-2xl border text-xs font-semibold flex flex-col items-start gap-1 transition-all text-left relative cursor-pointer ${
              settings.mode === 'transparent-fill'
                ? 'bg-red-50/70 border-[#e5322d] text-gray-900 shadow-xs ring-1 ring-red-400'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-sm text-gray-900">Fill Transparent Cutout</span>
              {hasTransparency && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Detected
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-500 font-normal">
              Fills background on existing transparent PNGs or logo graphics
            </span>
          </button>
        </div>
      </div>

      {/* Target Color Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#e5322d]" />
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Choose Target Background Color
            </label>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
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
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-red-50/70 border-[#e5322d] text-gray-900 shadow-xs ring-1 ring-red-400'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {preset.id === 'transparent' ? (
                  <span className="w-4 h-4 rounded-full border border-gray-300 checkerboard-pattern shrink-0 flex items-center justify-center">
                    {isSelected && <Check className="w-2.5 h-2.5 text-[#e5322d] stroke-[3]" />}
                  </span>
                ) : (
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-xs shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: displayColor || '#FFFFFF' }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-2.5 h-2.5 stroke-[3] ${
                          preset.id === 'white' || preset.id === 'light-blue' || preset.id === 'off-white'
                            ? 'text-gray-900'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </span>
                )}
                <div className="truncate">
                  <span className="block truncate text-gray-900 font-bold">{preset.name}</span>
                  {preset.isPortalStandard && (
                    <span className="text-[9px] text-[#e5322d] font-semibold">Official Std</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Color Picker */}
        {settings.targetColorPreset === 'custom' && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <label className="text-xs font-bold text-gray-700">Custom Target Color:</label>
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
              className="w-28 bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 font-mono uppercase focus:outline-none focus:border-[#e5322d] font-bold"
              placeholder="#FDE047"
            />
          </div>
        )}
      </div>

      {/* Color-Key Mode Details (Source Backdrop, Tolerance, Feathering) */}
      {settings.mode === 'color-key' && (
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Pipette className="w-4 h-4 text-[#e5322d]" />
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Source Backdrop Color to Replace
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                style={{ backgroundColor: settings.sourceColor || detectedSourceColor }}
              />
              <span className="text-xs font-mono font-bold text-gray-800">
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
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span className="flex items-center gap-1.5 font-bold">
                <Sliders className="w-3.5 h-3.5 text-[#e5322d]" />
                Color Match Tolerance
              </span>
              <span className="font-mono font-bold text-[#e5322d]">{settings.tolerance}%</span>
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e5322d]"
            />
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>Strict Match (5%)</span>
              <span>Broader Range / Casts (70%)</span>
            </div>
          </div>

          {/* Feathering Slider */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span className="font-bold">Edge Softness & Feathering</span>
              <span className="font-mono font-bold text-[#e5322d]">{settings.feather} px</span>
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e5322d]"
            />
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>Sharp Cutout (0 px)</span>
              <span>Smooth Natural Hair Blending (30 px)</span>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Selector */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
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
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-red-50 border-[#e5322d] text-[#e5322d] shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Process Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onProcess}
          disabled={isProcessing}
          className="w-full py-4 px-8 rounded-2xl bg-[#e5322d] hover:bg-[#cb1b16] active:scale-[0.99] font-black text-white shadow-xl shadow-red-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
        >
          {isProcessing ? (
            <>
              <Palette className="w-5 h-5 animate-spin" />
              <span>Processing Background Pixels...</span>
            </>
          ) : (
            <>
              <Palette className="w-5 h-5" />
              <span>Apply Background Color</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
