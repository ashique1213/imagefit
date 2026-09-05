import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Percent,
  BookmarkCheck,
  Lock,
  Unlock,
  ArrowLeftRight,
  Sliders,
  Check,
  RotateCcw,
} from 'lucide-react';
import { RESIZE_PRESETS } from '../../constants/presets';
import type { ResizePreset } from '../../constants/presets';
import {
  calculateLockedDimensions,
  calculatePercentageDimensions,
} from '../../utils/image/resizeImage';
import type { FitMode } from '../../utils/image/resizeImage';

export interface ResizeSettings {
  targetWidth: number;
  targetHeight: number;
  fitMode: FitMode;
  backgroundColor: string;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number; // 0.05 - 1.0
}

interface ResizeControlsProps {
  originalWidth: number;
  originalHeight: number;
  originalFormatExtension: string;
  onResize: (settings: ResizeSettings) => void;
  isProcessing: boolean;
}

export const ResizeControls: React.FC<ResizeControlsProps> = ({
  originalWidth,
  originalHeight,
  originalFormatExtension,
  onResize,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<'pixels' | 'percentage' | 'presets'>('pixels');

  // Pixel settings
  const [width, setWidth] = useState<number>(originalWidth);
  const [height, setHeight] = useState<number>(originalHeight);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);

  // Percentage settings
  const [percentage, setPercentage] = useState<number>(100);

  // Preset selected
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [presetCategory, setPresetCategory] = useState<'all' | 'passport' | 'exam' | 'signature' | 'web'>('all');

  // Sizing & Appearance
  const [fitMode, setFitMode] = useState<FitMode>('exact');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');

  // Format & Quality
  const defaultFmt =
    originalFormatExtension.toLowerCase() === 'png'
      ? 'image/png'
      : originalFormatExtension.toLowerCase() === 'webp'
      ? 'image/webp'
      : 'image/jpeg';
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>(defaultFmt);
  const [quality, setQuality] = useState<number>(90);

  // Synchronize when original image changes
  useEffect(() => {
    setWidth(originalWidth);
    setHeight(originalHeight);
    setPercentage(100);
    setSelectedPresetId(null);
  }, [originalWidth, originalHeight]);

  // Dimension changes
  const handleWidthChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setWidth(0);
      return;
    }
    setWidth(num);
    if (maintainAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const locked = calculateLockedDimensions(originalWidth, originalHeight, num, undefined, 'width');
      setHeight(locked.height);
    }
  };

  const handleHeightChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setHeight(0);
      return;
    }
    setHeight(num);
    if (maintainAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const locked = calculateLockedDimensions(originalWidth, originalHeight, undefined, num, 'height');
      setWidth(locked.width);
    }
  };

  const handleSwapDimensions = () => {
    const prevW = width;
    const prevH = height;
    setWidth(prevH);
    setHeight(prevW);
  };

  const handleResetToOriginal = () => {
    setWidth(originalWidth);
    setHeight(originalHeight);
    setPercentage(100);
    setSelectedPresetId(null);
  };

  // Percentage mode changes
  const handlePercentageChange = (pct: number) => {
    const clamped = Math.max(1, Math.min(1000, pct));
    setPercentage(clamped);
    const scaled = calculatePercentageDimensions(originalWidth, originalHeight, clamped);
    setWidth(scaled.width);
    setHeight(scaled.height);
  };

  // Preset selection
  const handleSelectPreset = (preset: ResizePreset) => {
    setSelectedPresetId(preset.id);
    setWidth(preset.width);
    setHeight(preset.height);
    if (preset.defaultFormat) {
      setFormat(preset.defaultFormat);
    }
    // Presets often need fitMode contain or exact
    if (maintainAspectRatio) {
      setFitMode('contain');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (width < 1 || height < 1) return;

    onResize({
      targetWidth: width,
      targetHeight: height,
      fitMode,
      backgroundColor,
      format,
      quality: quality / 100,
    });
  };

  const isDimensionInvalid = width < 1 || height < 1 || width > 10000 || height > 10000;

  const filteredPresets =
    presetCategory === 'all'
      ? RESIZE_PRESETS
      : RESIZE_PRESETS.filter((p) => p.category === presetCategory);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      {/* Header with Title and Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            Resize Settings
          </h2>
          <p className="text-xs text-slate-400">
            Choose resizing method, dimensions, aspect ratio, and output parameters
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('pixels')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'pixels'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Pixels</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('percentage')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'percentage'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Percentage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'presets'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: EXACT PIXELS */}
        {activeTab === 'pixels' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Width Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Width (px)</span>
                  <span className="text-[11px] text-slate-500">Original: {originalWidth}px</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width || ''}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Width"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">px</span>
                </div>
              </div>

              {/* Height Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Height (px)</span>
                  <span className="text-[11px] text-slate-500">Original: {originalHeight}px</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height || ''}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Height"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">px</span>
                </div>
              </div>
            </div>

            {/* Quick Actions: Maintain Aspect Ratio & Swap Dimensions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  {maintainAspectRatio ? (
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  Maintain aspect ratio
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSwapDimensions}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                  title="Swap Width and Height (Rotate Orientation)"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Swap (W↔H)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToOriginal}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Original</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERCENTAGE SCALING */}
        {activeTab === 'percentage' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Percentage Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Quick Scale Presets</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[25, 50, 75, 125, 150, 200].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentageChange(pct)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      percentage === pct
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Range Slider & Manual Input */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Scale Ratio</span>
                <span className="font-mono text-purple-400 text-sm font-bold">{percentage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={percentage}
                onChange={(e) => handlePercentageChange(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>5% (Tiny)</span>
                <span>100% (Original)</span>
                <span>300% (Enlarge)</span>
              </div>
            </div>

            {/* Computed Dimensions Feedback */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs">
              <span className="text-slate-400">Target Computed Dimensions:</span>
              <span className="font-mono font-bold text-purple-300 text-sm">
                {width} × {height} px
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pb-1">
              {(
                [
                  { id: 'all', label: 'All Presets' },
                  { id: 'passport', label: 'Passport & Visa' },
                  { id: 'exam', label: 'Exam & Portals' },
                  { id: 'signature', label: 'Signatures' },
                  { id: 'web', label: 'Web & Documents' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPresetCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    presetCategory === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500 ring-1 ring-purple-500'
                        : 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white leading-tight">
                        {preset.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[11px] font-bold text-purple-300">
                        {preset.width} × {preset.height} px
                      </span>
                      {preset.aspectRatioNote && (
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                          {preset.aspectRatioNote}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{preset.description}</p>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Note: Requirements can vary between specific examination boards. Verify with your official portal guidelines.
            </p>
          </div>
        )}

        {/* FIT MODE & BACKGROUND PAD */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            Fit & Crop Mode (When aspect ratio differs)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'exact',
                title: 'Exact Stretch',
                desc: 'Scale directly to target width & height',
              },
              {
                id: 'contain',
                title: 'Fit & Pad',
                desc: 'Fit image and pad border without distortion',
              },
              {
                id: 'cover',
                title: 'Crop & Fill',
                desc: 'Center and crop to completely fill dimensions',
              },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setFitMode(mode.id as FitMode)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  fitMode === mode.id
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold text-white">{mode.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>

          {/* Background color picker for contain / pad mode */}
          {fitMode === 'contain' && (
            <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Pad Background Color:</span>
              <div className="flex items-center gap-2">
                {[
                  { label: 'White', color: '#FFFFFF' },
                  { label: 'Black', color: '#000000' },
                  { label: 'Blue', color: '#1E40AF' },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setBackgroundColor(c.color)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${
                      backgroundColor === c.color
                        ? 'border-purple-500 text-white bg-purple-500/20'
                        : 'border-slate-700 bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-600"
                      style={{ backgroundColor: c.color }}
                    />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* OUTPUT FORMAT & QUALITY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Format Radio Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'JPG / JPEG', value: 'image/jpeg' },
                { label: 'PNG', value: 'image/png' },
                { label: 'WebP', value: 'image/webp' },
              ].map((fmt) => (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => setFormat(fmt.value as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    format === fmt.value
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPG / WebP) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Compression Quality</span>
              {format === 'image/png' ? (
                <span className="text-[11px] text-slate-500">Lossless</span>
              ) : (
                <span className="font-mono text-purple-400 font-bold">{quality}%</span>
              )}
            </div>
            {format === 'image/png' ? (
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-500 italic">
                PNG uses lossless compression (quality slider not applicable).
              </div>
            ) : (
              <div className="space-y-1">
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Smaller Size</span>
                  <span>High Quality</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Validation Error Message */}
        {isDimensionInvalid && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            Dimensions must be valid numbers between 1 and 10,000 pixels.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || isDimensionInvalid}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isProcessing || isDimensionInvalid
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 hover:-translate-y-0.5'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span>Resizing Image in Memory...</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              <span>Resize to {width} × {height} px</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
