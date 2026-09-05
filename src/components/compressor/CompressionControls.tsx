import React, { useState } from 'react';
import { Sliders, Target, Zap, Loader2, ArrowRight } from 'lucide-react';
import { kbToBytes, mbToBytes } from '../../utils/formatting/formatSize';

export type CompressionMode = 'target' | 'quality';

export interface CompressionSettings {
  mode: CompressionMode;
  targetSizeBytes: number;
  quality: number; // 0.05 to 1.0
  format: 'image/jpeg' | 'image/webp';
  allowDimensionReduction: boolean;
}

interface CompressionControlsProps {
  originalSizeBytes: number;
  onCompress: (settings: CompressionSettings) => void;
  isProcessing: boolean;
}

const PRESET_SIZES_KB = [20, 50, 100, 200, 500];

export const CompressionControls: React.FC<CompressionControlsProps> = ({
  originalSizeBytes,
  onCompress,
  isProcessing,
}) => {
  const [mode, setMode] = useState<CompressionMode>('target');
  const [customValue, setCustomValue] = useState<string>('100');
  const [unit, setUnit] = useState<'KB' | 'MB'>('KB');
  const [qualityPercent, setQualityPercent] = useState<number>(80);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [allowDimensionReduction, setAllowDimensionReduction] = useState<boolean>(true);

  const handlePresetClick = (kb: number) => {
    setCustomValue(kb.toString());
    setUnit('KB');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    let targetBytes = 100 * 1024;
    const num = parseFloat(customValue) || 100;
    if (unit === 'KB') {
      targetBytes = kbToBytes(num);
    } else {
      targetBytes = mbToBytes(num);
    }

    onCompress({
      mode,
      targetSizeBytes: targetBytes,
      quality: qualityPercent / 100,
      format,
      allowDimensionReduction,
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            Compression Settings
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose your desired target file size or manual quality level
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('target')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'target'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target File Size</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('quality')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'quality'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Quality</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'target' ? (
          <div className="space-y-4">
            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Common Form Presets</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_SIZES_KB.map((kb) => {
                  const isSelected = unit === 'KB' && customValue === kb.toString();
                  return (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => handlePresetClick(kb)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {kb} KB
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-2">
              <label htmlFor="targetSizeInput" className="text-xs font-semibold text-slate-300">
                Custom Target Size
              </label>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  id="targetSizeInput"
                  type="number"
                  min="1"
                  max="50000"
                  step="1"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. 100"
                  required
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'KB' | 'MB')}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400">
                Targeting smaller than original size (Original: {(originalSizeBytes / 1024).toFixed(1)} KB).
              </p>
            </div>

            {/* Dimension scaling checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={allowDimensionReduction}
                  onChange={(e) => setAllowDimensionReduction(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  Automatically scale pixel dimensions if image cannot reach target size at minimum quality.
                  <span className="block text-[11px] text-slate-400">
                    (Recommended for high-resolution photos being compressed to strict limits like 20 KB or 50 KB).
                  </span>
                </span>
              </label>
            </div>
          </div>
        ) : (
          /* Manual Quality Slider */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="qualitySlider" className="text-xs font-semibold text-slate-300">
                Image Quality Level
              </label>
              <span className="text-sm font-bold font-mono text-blue-400">
                {qualityPercent}%
              </span>
            </div>

            <input
              id="qualitySlider"
              type="range"
              min="5"
              max="100"
              value={qualityPercent}
              onChange={(e) => setQualityPercent(parseInt(e.target.value, 10))}
              className="w-full accent-blue-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Smallest Size (Low quality)</span>
              <span>Balanced</span>
              <span>Best Quality (Large size)</span>
            </div>
          </div>
        )}

        {/* Output Format Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300">
            Export Format
          </label>
          <div className="flex gap-4 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="image/jpeg"
                checked={format === 'image/jpeg'}
                onChange={() => setFormat('image/jpeg')}
                className="text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
              />
              <span>JPG / JPEG (Standard for all applications)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="image/webp"
                checked={format === 'image/webp'}
                onChange={() => setFormat('image/webp')}
                className="text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
              />
              <span>WebP (Modern high-efficiency)</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all ${
              isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Compressing image in browser...</span>
              </>
            ) : (
              <>
                <span>Compress Image</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
