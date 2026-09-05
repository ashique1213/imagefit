import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Wand2,
  RefreshCw,
  ShieldCheck,
  Palette,
  FileCheck,
  RotateCw,
  FlipHorizontal,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { PortalPresetSelector } from '../components/pipeline/PortalPresetSelector';
import { PipelineResultCard } from '../components/pipeline/PipelineResultCard';
import { useImageUpload } from '../hooks/useImageUpload';
import { APPLICATION_PORTALS } from '../constants/applicationPortals';
import type { ApplicationPortalProfile } from '../constants/applicationPortals';
import {
  executeApplicationPipeline,
} from '../utils/image/pipelineEngine';
import type {
  PipelineConfig,
  PipelineExecutionResult,
} from '../utils/image/pipelineEngine';
import { revokeObjectUrl } from '../utils/image/loadImage';

export const ApplicationPipelinePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const presetParam = searchParams.get('preset');

  const { image, isLoading, error: uploadError, handleFileSelect, clearImage, clearError } = useImageUpload();

  // Selected portal or custom
  const [selectedPortal, setSelectedPortal] = useState<ApplicationPortalProfile | null>(() => {
    if (presetParam) {
      return APPLICATION_PORTALS.find((p) => p.id === presetParam) || APPLICATION_PORTALS[0];
    }
    return APPLICATION_PORTALS[0]; // default to SSC CGL Photo
  });

  // Custom configurations (if portal is null)
  const [customWidth, setCustomWidth] = useState<number>(350);
  const [customHeight, setCustomHeight] = useState<number>(450);
  const [customMaxKb, setCustomMaxKb] = useState<number>(50);
  const [customBgColor, setCustomBgColor] = useState<string>('#FFFFFF');

  // Orientation & Background overrides
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);

  // Results & Progress
  const [pipelineResult, setPipelineResult] = useState<PipelineExecutionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  const fileInputHiddenRef = useRef<HTMLInputElement>(null);
  const previousResultUrlRef = useRef<string | null>(null);

  // Sync background color when portal changes
  useEffect(() => {
    if (selectedPortal) {
      setBackgroundColor(selectedPortal.backgroundColor);
    }
  }, [selectedPortal]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
    };
  }, []);

  const handleResetAll = () => {
    if (previousResultUrlRef.current) {
      revokeObjectUrl(previousResultUrlRef.current);
      previousResultUrlRef.current = null;
    }
    setPipelineResult(null);
    setPipelineError(null);
    clearImage();
  };

  const triggerChangeFile = () => {
    fileInputHiddenRef.current?.click();
  };

  const onHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
        previousResultUrlRef.current = null;
      }
      setPipelineResult(null);
      setPipelineError(null);
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

  const handleRunPipeline = async () => {
    if (!image) return;

    setPipelineError(null);
    setIsProcessing(true);

    try {
      const targetW = selectedPortal ? selectedPortal.width : customWidth;
      const targetH = selectedPortal ? selectedPortal.height : customHeight;
      const targetMax = selectedPortal ? selectedPortal.maxKb : customMaxKb;
      const targetMin = selectedPortal?.minKb;
      const targetFormat = selectedPortal ? selectedPortal.format : 'image/jpeg';
      const bg = selectedPortal ? backgroundColor : customBgColor;

      const config: PipelineConfig = {
        portalProfile: selectedPortal || undefined,
        targetWidth: targetW,
        targetHeight: targetH,
        fitMode: 'contain',
        backgroundColor: bg,
        rotation,
        flipHorizontal,
        targetMaxKb: targetMax,
        targetMinKb: targetMin,
        targetFormat,
      };

      const img = new Image();
      img.src = image.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image into memory for pipeline processing.'));
      });

      const result = await executeApplicationPipeline(img, config);

      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
      previousResultUrlRef.current = result.previewUrl;

      setPipelineResult(result);
    } catch (err) {
      setPipelineError(
        err instanceof Error ? err.message : 'An error occurred during pipeline execution.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const activeError = uploadError || pipelineError;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Hidden file input for "Change Image" button */}
      <input
        ref={fileInputHiddenRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={onHiddenInputChange}
        className="hidden"
      />

      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="blue" size="md">
          Flagship Feature
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Wand2 className="w-8 h-8 text-blue-400" />
          All-in-One Application Wizard
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Prepare 100% portal-compliant photos & signatures in seconds. Automatically scales dimensions, applies background fills, and compresses to target KB.
        </p>
      </div>

      {/* Error Alert */}
      {activeError && (
        <ErrorBanner
          message={activeError}
          onDismiss={() => {
            clearError();
            setPipelineError(null);
          }}
        />
      )}

      {/* Step 1: Upload Stage if no image */}
      {!image ? (
        <div className="space-y-6">
          <Dropzone
            onFileSelected={handleFileSelect}
            isLoading={isLoading}
          />

          {/* Preset Selector preview below dropzone */}
          <div className="pt-2">
            <PortalPresetSelector
              selectedPortalId={selectedPortal?.id || null}
              onSelectPortal={(portal) => setSelectedPortal(portal)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Metadata Card */}
          <ImageDetailsCard
            metadata={image}
            onChangeImage={triggerChangeFile}
            onRemoveImage={handleResetAll}
          />

          {/* If Result exists, display PipelineResultCard; otherwise display Wizard Settings */}
          {pipelineResult ? (
            <PipelineResultCard
              originalName={image.name}
              originalWidth={image.width}
              originalHeight={image.height}
              originalFormattedSize={image.formattedSize}
              originalFormat={image.formatExtension}
              originalPreviewUrl={image.previewUrl}
              result={pipelineResult}
              portalName={selectedPortal?.name || 'Custom Application'}
              onEditSettings={() => setPipelineResult(null)}
              onResetAll={handleResetAll}
            />
          ) : (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              {/* Step 1: Select Portal Preset */}
              <PortalPresetSelector
                selectedPortalId={selectedPortal?.id || null}
                onSelectPortal={(portal) => setSelectedPortal(portal)}
              />

              {/* Custom specs form if selectedPortal === null */}
              {!selectedPortal && (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                    Custom Portal Target Specifications
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Target Width (px)</label>
                      <input
                        type="number"
                        min="50"
                        max="3000"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(parseInt(e.target.value, 10) || 300)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Target Height (px)</label>
                      <input
                        type="number"
                        min="50"
                        max="3000"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(parseInt(e.target.value, 10) || 300)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Maximum File Size (KB)</label>
                      <input
                        type="number"
                        min="5"
                        max="5000"
                        value={customMaxKb}
                        onChange={(e) => setCustomMaxKb(parseInt(e.target.value, 10) || 50)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Backdrop Color</label>
                      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5">
                        <input
                          type="color"
                          value={customBgColor}
                          onChange={(e) => setCustomBgColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                        />
                        <input
                          type="text"
                          value={customBgColor}
                          onChange={(e) => setCustomBgColor(e.target.value)}
                          className="w-16 bg-transparent text-xs text-white font-mono uppercase focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Background Fill & Orientation Controls */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-400" />
                    <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Background Fill & Orientation
                    </label>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {selectedPortal?.backgroundName || 'White Background'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Background Presets */}
                  <button
                    type="button"
                    onClick={() => setBackgroundColor('#FFFFFF')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                      backgroundColor === '#FFFFFF'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-white border border-slate-500" />
                    Pure White (Official Std)
                  </button>

                  <button
                    type="button"
                    onClick={() => setBackgroundColor('#E0F2FE')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                      backgroundColor === '#E0F2FE'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#E0F2FE] border border-slate-500" />
                    Passport Light Blue
                  </button>

                  {/* Orientation Controls */}
                  <button
                    type="button"
                    onClick={() => setFlipHorizontal(!flipHorizontal)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                      flipHorizontal
                        ? 'bg-purple-600/20 border-purple-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5 text-purple-400" />
                    <span>Mirror (Selfie Fix)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRotation((((rotation + 90) % 360) as 0 | 90 | 180 | 270))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                      rotation !== 0
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                    <span>Rotate 90° ({rotation}°)</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunPipeline}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.99] font-bold text-white shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Executing 4-Stage Optimization Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>
                        Generate {selectedPortal ? selectedPortal.name : 'Compliant'} Package
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Educational Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-slate-200">
          <FileCheck className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-base">How the All-in-One Pipeline Protects Your Application</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block">
              1. Exact Pixel Conformity
            </span>
            <p>
              Portals reject images that are even 1 pixel off their aspect ratio. Our pipeline mathematically guarantees exact dimensions using high-quality multi-step half-scaling to eliminate aliasing.
            </p>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block">
              2. Guaranteed Target File Size
            </span>
            <p>
              Never guess quality sliders again. The pipeline runs an automated binary search in browser memory to find the exact JPEG quality that fits strictly below your portal's maximum KB ceiling (e.g. 50 KB).
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60">
          <span>End-to-End Pipeline in browser memory</span>
          <div className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Zero Server Uploads
          </div>
        </div>
      </div>
    </div>
  );
};
