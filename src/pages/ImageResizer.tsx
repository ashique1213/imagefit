import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, ShieldCheck, HelpCircle } from 'lucide-react';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { ResizeControls } from '../components/resize/ResizeControls';
import type { ResizeSettings } from '../components/resize/ResizeControls';
import { ResizePreview } from '../components/resize/ResizePreview';
import { useImageUpload } from '../hooks/useImageUpload';
import { resizeImage } from '../utils/image/resizeImage';
import type { ResizeResult, FitMode } from '../utils/image/resizeImage';
import { revokeObjectUrl } from '../utils/image/loadImage';

export const ImageResizerPage: React.FC = () => {
  const { image, isLoading, error: uploadError, handleFileSelect, clearImage, clearError } = useImageUpload();
  const [resizeResult, setResizeResult] = useState<ResizeResult | null>(null);
  const [lastFitMode, setLastFitMode] = useState<FitMode>('exact');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizeError, setResizeError] = useState<string | null>(null);

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

  const handleResetImage = () => {
    if (previousResultUrlRef.current) {
      revokeObjectUrl(previousResultUrlRef.current);
      previousResultUrlRef.current = null;
    }
    setResizeResult(null);
    setResizeError(null);
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
      setResizeResult(null);
      setResizeError(null);
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

  const handleRunResize = async (settings: ResizeSettings) => {
    if (!image) return;

    setResizeError(null);
    setIsProcessing(true);
    setLastFitMode(settings.fitMode);

    try {
      const img = new Image();
      img.src = image.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image into browser memory for resizing.'));
      });

      const result = await resizeImage(img, {
        targetWidth: settings.targetWidth,
        targetHeight: settings.targetHeight,
        fitMode: settings.fitMode,
        backgroundColor: settings.backgroundColor,
        format: settings.format,
        quality: settings.quality,
        originalSizeBytes: image.sizeBytes,
      });

      // Revoke old resized preview URL
      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
      previousResultUrlRef.current = result.previewUrl;

      setResizeResult(result);
      setIsProcessing(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Resizing failed due to canvas processing error.';
      setResizeError(msg);
      setIsProcessing(false);
    }
  };

  const activeError = uploadError || resizeError;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hidden file input for "Change Image" button */}
      <input
        ref={fileInputHiddenRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={onHiddenInputChange}
        className="hidden"
      />

      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
          <Maximize2 className="w-8 h-8 text-[#e5322d]" />
          Resize IMAGE
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Resize photo and document dimensions by exact pixels, scale percentages, or official government and exam application presets.
        </p>
      </div>

      {/* Error Alert */}
      {activeError && (
        <ErrorBanner
          message={activeError}
          onDismiss={() => {
            clearError();
            setResizeError(null);
          }}
        />
      )}

      {/* Upload Stage */}
      {!image ? (
        <Dropzone
          onFileSelected={handleFileSelect}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-8">
          {/* Metadata Card */}
          <ImageDetailsCard
            metadata={image}
            onChangeImage={triggerChangeFile}
            onRemoveImage={handleResetImage}
          />

          {/* Resize Controls Stage */}
          <ResizeControls
            originalWidth={image.width}
            originalHeight={image.height}
            originalFormatExtension={image.formatExtension}
            onResize={handleRunResize}
            isProcessing={isProcessing}
          />

          {/* Results Comparison View */}
          {resizeResult && (
            <ResizePreview
              original={image}
              result={resizeResult}
              fitMode={lastFitMode}
            />
          )}
        </div>
      )}

      {/* Guidance and Portal Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 pt-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="font-bold text-gray-900 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
            Aspect Ratio Lock
          </span>
          <p>Toggle the link icon to automatically recompute heights when adjusting widths, preventing unwanted image distortion.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="font-bold text-gray-900 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Fit & Pad Options
          </span>
          <p>Use "Fit & Pad" mode to convert non-standard images into required passport boxes without stretching face proportions.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="font-bold text-gray-900 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Client-Side Privacy
          </span>
          <p>Processing happens entirely inside your browser's canvas pipeline. Zero files are uploaded or transmitted to any server.</p>
        </div>
      </div>
    </div>
  );
};
