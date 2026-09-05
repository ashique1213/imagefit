import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Crop, ShieldCheck, HelpCircle, Scissors, FileCheck, Info } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { InteractiveCropArea } from '../components/crop/InteractiveCropArea';
import { CropControls } from '../components/crop/CropControls';
import type { CropOutputSettings } from '../components/crop/CropControls';
import { CropPreview } from '../components/crop/CropPreview';
import { useImageUpload } from '../hooks/useImageUpload';
import {
  cropImage,
  getInitialCropBox,
  mapDisplayToNaturalCoords,
  CROP_RATIO_PRESETS,
} from '../utils/image/cropImage';
import type {
  AspectRatioPreset,
  PixelCropArea,
  CropResult,
} from '../utils/image/cropImage';
import { revokeObjectUrl } from '../utils/image/loadImage';

export const CropToolPage: React.FC = () => {
  const { image, isLoading, error: uploadError, handleFileSelect, clearImage, clearError } = useImageUpload();

  const [activeRatioId, setActiveRatioId] = useState<AspectRatioPreset>('free');
  const [cropBox, setCropBox] = useState<PixelCropArea>({ x: 0, y: 0, width: 250, height: 250 });
  const [displayedRect, setDisplayedRect] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [outputSettings, setOutputSettings] = useState<CropOutputSettings>({
    format: 'image/jpeg',
    quality: 0.92,
  });

  const [cropResult, setCropResult] = useState<CropResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropError, setCropError] = useState<string | null>(null);

  const fileInputHiddenRef = useRef<HTMLInputElement>(null);
  const previousResultUrlRef = useRef<string | null>(null);

  // Safely cleanup preview object URLs on unmount
  useEffect(() => {
    return () => {
      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
    };
  }, []);

  // When rendered dimensions change or ratio changes, initialize crop box
  const initCropBox = useCallback((rectWidth: number, rectHeight: number, ratioPreset: AspectRatioPreset) => {
    if (rectWidth <= 0 || rectHeight <= 0) return;
    const preset = CROP_RATIO_PRESETS.find((p) => p.id === ratioPreset);
    const initial = getInitialCropBox(rectWidth, rectHeight, preset ? preset.ratio : null);
    setCropBox(initial);
  }, []);

  const handleDimensionsMeasured = useCallback(
    (rect: { width: number; height: number }) => {
      setDisplayedRect(rect);
      if (cropBox.width === 0 || cropBox.height === 0 || displayedRect.width === 0) {
        initCropBox(rect.width, rect.height, activeRatioId);
      }
    },
    [activeRatioId, cropBox.height, cropBox.width, displayedRect.width, initCropBox]
  );

  const handleSelectRatio = (presetId: AspectRatioPreset) => {
    setActiveRatioId(presetId);
    if (displayedRect.width > 0 && displayedRect.height > 0) {
      initCropBox(displayedRect.width, displayedRect.height, presetId);
    }
  };

  const handleResetCropBox = () => {
    if (displayedRect.width > 0 && displayedRect.height > 0) {
      initCropBox(displayedRect.width, displayedRect.height, activeRatioId);
    }
    setZoom(1);
  };

  const handleResetAll = () => {
    if (previousResultUrlRef.current) {
      revokeObjectUrl(previousResultUrlRef.current);
      previousResultUrlRef.current = null;
    }
    setCropResult(null);
    setCropError(null);
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
      setCropResult(null);
      setCropError(null);
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

  const handleApplyCrop = async () => {
    if (!image || displayedRect.width === 0 || displayedRect.height === 0) return;

    setCropError(null);
    setIsProcessing(true);

    try {
      // Map display crop coordinates to original image pixel coordinates
      const naturalCrop = mapDisplayToNaturalCoords(
        cropBox,
        displayedRect,
        image.width,
        image.height
      );

      const img = new Image();
      img.src = image.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image in browser memory for cropping.'));
      });

      const result = await cropImage(img, {
        cropArea: naturalCrop,
        format: outputSettings.format,
        quality: outputSettings.quality,
      });

      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
      previousResultUrlRef.current = result.previewUrl;

      setCropResult(result);
    } catch (err) {
      setCropError(
        err instanceof Error ? err.message : 'An unexpected error occurred during image cropping.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const activeError = uploadError || cropError;

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
        <Badge variant="purple" size="md">
          Precision Aspect Ratio Cropper
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Crop className="w-8 h-8 text-purple-400" />
          Interactive Image Crop Tool
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Crop photo and signature uploads with official passport ratios (35:45 mm, 1:1 square, 3:4 portrait) or freeform drag handles.
        </p>
      </div>

      {/* Error Alert */}
      {activeError && (
        <ErrorBanner
          message={activeError}
          onDismiss={() => {
            clearError();
            setCropError(null);
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

          {/* Quick Guidance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Scissors className="w-4 h-4" />
                Passport Photo Ratios
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-click presets for official 3.5 × 4.5 cm (India/UK/EU), 2 × 2 in (US Visa), and standard 3:4 exam portraits.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <FileCheck className="w-4 h-4" />
                Signature Framing
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Wide 2:1 and 7:2 bounding boxes to crop scanned signatures cleanly without unnecessary paper margins.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Lossless Precision
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Source coordinate mapping crops at native original resolution to prevent blurriness and pixelation.
              </p>
            </div>
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

          {/* If Result exists, display Preview; otherwise display Interactive Editor */}
          {cropResult ? (
            <CropPreview
              originalName={image.name}
              originalWidth={image.width}
              originalHeight={image.height}
              originalFormattedSize={image.formattedSize}
              originalFormat={image.formatExtension}
              originalPreviewUrl={image.previewUrl}
              result={cropResult}
              onEditCrop={() => setCropResult(null)}
              onResetAll={handleResetAll}
            />
          ) : (
            <div className="space-y-6">
              {/* Interactive Cropper Canvas */}
              <InteractiveCropArea
                imageSrc={image.previewUrl}
                naturalWidth={image.width}
                naturalHeight={image.height}
                aspectRatio={
                  CROP_RATIO_PRESETS.find((p) => p.id === activeRatioId)?.ratio ?? null
                }
                cropBox={cropBox}
                onChangeCropBox={setCropBox}
                zoom={zoom}
                onImageDimensionsMeasured={handleDimensionsMeasured}
              />

              {/* Controls */}
              <CropControls
                activeRatioId={activeRatioId}
                onSelectRatio={handleSelectRatio}
                zoom={zoom}
                onChangeZoom={setZoom}
                outputSettings={outputSettings}
                onChangeOutputSettings={setOutputSettings}
                onResetCropBox={handleResetCropBox}
                onApplyCrop={handleApplyCrop}
                isProcessing={isProcessing}
              />
            </div>
          )}
        </div>
      )}

      {/* Guidelines Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-slate-200">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base">Application Photo & Signature Cropping Rules</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block flex items-center gap-1.5">
              <Info className="w-4 h-4 text-purple-400" />
              Passport & Visa Photo Composition
            </span>
            <p>
              Your head and face must occupy <strong>70% to 80%</strong> of the photo height. Position the rule-of-thirds grid so your eyes align along the upper horizontal line, leaving balanced margins above your hair.
            </p>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block flex items-center gap-1.5">
              <Info className="w-4 h-4 text-purple-400" />
              Signature Scan Tight Cropping
            </span>
            <p>
              When photographing a signature on white paper, crop tightly around the signature using the <strong>2:1 Signature</strong> or <strong>7:2 Wide</strong> preset. This eliminates shadow gradients, paper edges, and desktop clutter.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60">
          <span>HTML5 Canvas pixel sub-rectangle extraction</span>
          <div className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            100% In-Memory Processing
          </div>
        </div>
      </div>
    </div>
  );
};
