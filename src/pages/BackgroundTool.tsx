import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Palette, ShieldCheck, HelpCircle, AlertCircle, Info } from 'lucide-react';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { BackgroundControls } from '../components/background/BackgroundControls';
import { BackgroundPreview } from '../components/background/BackgroundPreview';
import { useImageUpload } from '../hooks/useImageUpload';
import {
  processBackground,
  samplePerimeterColor,
  BACKGROUND_PRESETS,
} from '../utils/image/backgroundProcess';
import type {
  BackgroundProcessOptions,
  BackgroundResult,
} from '../utils/image/backgroundProcess';
import { canvasHasTransparency } from '../utils/image/convertImage';
import { revokeObjectUrl } from '../utils/image/loadImage';

export const BackgroundToolPage: React.FC = () => {
  const { image, isLoading, error: uploadError, handleFileSelect, clearImage, clearError } = useImageUpload();

  const [settings, setSettings] = useState<BackgroundProcessOptions>({
    mode: 'color-key',
    targetColorPreset: 'white',
    tolerance: 28,
    feather: 10,
    format: 'image/jpeg',
    quality: 0.92,
  });

  const [detectedSourceColor, setDetectedSourceColor] = useState<string>('#FFFFFF');
  const [hasTransparency, setHasTransparency] = useState<boolean>(false);

  const [backgroundResult, setBackgroundResult] = useState<BackgroundResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

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

  // When a new image is loaded, analyze its background color and transparency
  const analyzeImage = useCallback(async (previewUrl: string) => {
    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to inspect image backdrop.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const isAlpha = canvasHasTransparency(canvas);
      setHasTransparency(isAlpha);

      const sampled = samplePerimeterColor(canvas);
      setDetectedSourceColor(sampled);

      // Auto-set mode if existing image is transparent cutout
      if (isAlpha) {
        setSettings((prev) => ({
          ...prev,
          mode: 'transparent-fill',
          sourceColor: sampled,
        }));
      } else {
        setSettings((prev) => ({
          ...prev,
          mode: 'color-key',
          sourceColor: sampled,
        }));
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  useEffect(() => {
    if (image?.previewUrl) {
      analyzeImage(image.previewUrl);
    }
  }, [image?.previewUrl, analyzeImage]);

  const handleResetAll = () => {
    if (previousResultUrlRef.current) {
      revokeObjectUrl(previousResultUrlRef.current);
      previousResultUrlRef.current = null;
    }
    setBackgroundResult(null);
    setProcessError(null);
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
      setBackgroundResult(null);
      setProcessError(null);
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

  const handleProcessBackground = async () => {
    if (!image) return;

    setProcessError(null);
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = image.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for background processing.'));
      });

      const result = await processBackground(img, {
        ...settings,
        sourceColor: settings.sourceColor || detectedSourceColor,
      });

      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
      previousResultUrlRef.current = result.previewUrl;

      setBackgroundResult(result);
    } catch (err) {
      setProcessError(
        err instanceof Error ? err.message : 'An unexpected error occurred while replacing background.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const activeError = uploadError || processError;

  const targetPresetObj = BACKGROUND_PRESETS.find((p) => p.id === settings.targetColorPreset);
  const targetColorName =
    settings.targetColorPreset === 'custom'
      ? `Custom (${settings.customTargetColor || '#FDE047'})`
      : targetPresetObj?.name || 'White';

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
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
          <Palette className="w-8 h-8 text-[#e5322d]" />
          Change Background
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Replace photo backdrop colors with official Pure White, Passport Light Blue, or custom shades using client-side color-keying and soft edge feathering.
        </p>
      </div>

      {/* Error Alert */}
      {activeError && (
        <ErrorBanner
          message={activeError}
          onDismiss={() => {
            clearError();
            setProcessError(null);
          }}
        />
      )}

      {/* Step 1: Upload Stage if no image loaded */}
      {!image ? (
        <div className="space-y-6">
          <Dropzone
            onFileSelected={handleFileSelect}
            isLoading={isLoading}
          />

          {/* Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Passport & Visa Standard
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                One-click switch to Pure White (US Visa/SSC) or Light Blue (UK/EU Passport) backdrops.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-fuchsia-600 font-bold text-sm">
                <Palette className="w-4 h-4" />
                Color-Key & Feathering
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Automatic wall color detection with tolerance sliders to smoothly blend edges around hair and shoulders.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Zero Cloud Uploads
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Processes directly in browser memory without sending your personal face photos to external AI servers.
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

          {/* If Result exists, display Preview; otherwise display Controls */}
          {backgroundResult ? (
            <BackgroundPreview
              originalName={image.name}
              originalWidth={image.width}
              originalHeight={image.height}
              originalFormattedSize={image.formattedSize}
              originalFormat={image.formatExtension}
              originalPreviewUrl={image.previewUrl}
              result={backgroundResult}
              targetColorName={targetColorName}
              onEditSettings={() => setBackgroundResult(null)}
              onResetAll={handleResetAll}
            />
          ) : (
            <BackgroundControls
              settings={settings}
              onChangeSettings={setSettings}
              detectedSourceColor={detectedSourceColor}
              hasTransparency={hasTransparency}
              onProcess={handleProcessBackground}
              isProcessing={isProcessing}
            />
          )}
        </div>
      )}

      {/* Guidelines Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-900">
          <HelpCircle className="w-5 h-5 text-fuchsia-600" />
          <h3 className="font-bold text-base">Important Background Requirements by Portal</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
          <div className="space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              US Visa & Indian Passport (White Background)
            </span>
            <p>
              The US Department of State and Indian Passport Seva Kendra require a <strong>strictly pure white (`#FFFFFF`) or off-white</strong> background. Shadows, patterns, or colorful backdrops result in immediate rejection.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              UK & European Passports (Light Blue / Gray)
            </span>
            <p>
              UK HM Passport Office and European consular services frequently require a <strong>light cream, light gray, or light blue</strong> background to provide sufficient contrast with white shirts and pale complexions.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
          <span>Client-side color-keying & alpha blending on HTML5 Canvas</span>
          <div className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% In-Memory Processing
          </div>
        </div>
      </div>
    </div>
  );
};
