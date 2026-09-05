import React from 'react';
import {
  PenTool,
  Palette,
  Sliders,
  Info,
  Check,
} from 'lucide-react';
import type {
  BackgroundColorMode,
  InkColorMode,
  SignatureProcessOptions,
} from '../../utils/image/signatureProcess';
import {
  INK_COLOR_PRESETS,
  BG_COLOR_PRESETS,
} from '../../utils/image/signatureProcess';

interface SignatureControlsProps {
  settings: SignatureProcessOptions;
  onChangeSettings: (settings: SignatureProcessOptions) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export const SignatureControls: React.FC<SignatureControlsProps> = ({
  settings,
  onChangeSettings,
  onProcess,
  isProcessing,
}) => {
  const isTransparent = settings.backgroundColorMode === 'transparent';

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* 1. Signature Ink Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-purple-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Signature Ink Color
            </label>
          </div>
          <span className="text-[11px] text-slate-400">
            {INK_COLOR_PRESETS[settings.inkColorMode]?.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(['black', 'blue', 'red', 'custom'] as InkColorMode[]).map((mode) => {
            const preset = INK_COLOR_PRESETS[mode];
            const isSelected = settings.inkColorMode === mode;
            const displayColor =
              mode === 'custom'
                ? settings.customInkColor || '#4338CA'
                : preset.hex;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => onChangeSettings({ ...settings, inkColorMode: mode })}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500/70 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-slate-600 shadow-sm shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: displayColor }}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </span>
                <span className="truncate">{preset.name.split(' ')[1] || preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Ink Color Picker */}
        {settings.inkColorMode === 'custom' && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <label className="text-xs text-slate-400">Custom Ink Picker:</label>
            <input
              type="color"
              value={settings.customInkColor || '#4338CA'}
              onChange={(e) =>
                onChangeSettings({ ...settings, customInkColor: e.target.value })
              }
              className="w-8 h-8 rounded-xl cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={settings.customInkColor || '#4338CA'}
              onChange={(e) =>
                onChangeSettings({ ...settings, customInkColor: e.target.value })
              }
              className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase focus:outline-none"
              placeholder="#4338CA"
            />
          </div>
        )}
      </div>

      {/* 2. Background Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Background Color
            </label>
          </div>
          <span className="text-[11px] text-slate-400">
            {BG_COLOR_PRESETS[settings.backgroundColorMode]?.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(['transparent', 'white', 'black', 'custom'] as BackgroundColorMode[]).map((mode) => {
            const preset = BG_COLOR_PRESETS[mode];
            const isSelected = settings.backgroundColorMode === mode;
            const displayColor =
              mode === 'custom'
                ? settings.customBackgroundColor || '#F1F5F9'
                : preset.hex;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => onChangeSettings({ ...settings, backgroundColorMode: mode })}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500/70 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {mode === 'transparent' ? (
                  <span className="w-4 h-4 rounded-full border border-slate-600 checkerboard-pattern shrink-0 flex items-center justify-center">
                    {isSelected && <Check className="w-2.5 h-2.5 text-purple-400 stroke-[3]" />}
                  </span>
                ) : (
                  <span
                    className="w-4 h-4 rounded-full border border-slate-600 shadow-sm shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: displayColor || '#FFFFFF' }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-2.5 h-2.5 stroke-[3] ${
                          mode === 'white' ? 'text-slate-900' : 'text-white'
                        }`}
                      />
                    )}
                  </span>
                )}
                <span className="truncate">{preset.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Background Color Picker */}
        {settings.backgroundColorMode === 'custom' && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <label className="text-xs text-slate-400">Custom Background Picker:</label>
            <input
              type="color"
              value={settings.customBackgroundColor || '#F1F5F9'}
              onChange={(e) =>
                onChangeSettings({ ...settings, customBackgroundColor: e.target.value })
              }
              className="w-8 h-8 rounded-xl cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={settings.customBackgroundColor || '#F1F5F9'}
              onChange={(e) =>
                onChangeSettings({ ...settings, customBackgroundColor: e.target.value })
              }
              className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase focus:outline-none"
              placeholder="#F1F5F9"
            />
          </div>
        )}

        {isTransparent && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Transparent output automatically exports as <strong>PNG</strong> to preserve the alpha channel. Ideal for stamping onto PDFs and contracts.
            </span>
          </div>
        )}
      </div>

      {/* 3. Paper Cleaning Threshold & Edge Smoothness */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Paper Cleaning Threshold
            </label>
          </div>
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            {settings.threshold}
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="100"
            max="240"
            step="2"
            value={settings.threshold}
            onChange={(e) =>
              onChangeSettings({ ...settings, threshold: parseInt(e.target.value, 10) })
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Keep Faint Ballpoint Ink (100)</span>
            <span>Clean Heavy Paper Shadows (240)</span>
          </div>
        </div>

        {/* Smoothness Anti-Aliasing Slider */}
        <div className="pt-2 border-t border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Edge Softness & Anti-Aliasing</span>
            <span className="font-mono text-purple-400">{settings.smoothness}</span>
          </div>
          <input
            type="range"
            min="10"
            max="70"
            step="1"
            value={settings.smoothness}
            onChange={(e) =>
              onChangeSettings({ ...settings, smoothness: parseInt(e.target.value, 10) })
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      {/* 4. Output Export Format */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
          Export File Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['image/png', 'image/jpeg', 'image/webp'] as const).map((fmt) => {
            const isSelected = (settings.format || (isTransparent ? 'image/png' : 'image/jpeg')) === fmt;
            const disabled = isTransparent && fmt === 'image/jpeg';
            const label =
              fmt === 'image/png' ? 'PNG (Lossless)' : fmt === 'image/jpeg' ? 'JPG (Exams)' : 'WebP';

            return (
              <button
                key={fmt}
                type="button"
                disabled={disabled}
                onClick={() => onChangeSettings({ ...settings, format: fmt })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
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
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onProcess}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <PenTool className="w-5 h-5 animate-spin" />
              <span>Processing Signature Pixels...</span>
            </>
          ) : (
            <>
              <PenTool className="w-5 h-5" />
              <span>Clean & Recolor Signature</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
