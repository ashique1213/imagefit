import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ShieldCheck, HelpCircle, Layers, FileImage, Sparkles } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { ConverterControls } from '../components/converter/ConverterControls';
import type { ConverterSettings } from '../components/converter/ConverterControls';
import { ConverterPreview } from '../components/converter/ConverterPreview';
import { useImageUpload } from '../hooks/useImageUpload';
import { convertImage } from '../utils/image/convertImage';
import type { ConvertResult } from '../utils/image/convertImage';
import { revokeObjectUrl } from '../utils/image/loadImage';

export const ImageConverterPage: React.FC = () => {
  const { image, isLoading, error: uploadError, handleFileSelect, clearImage, clearError } = useImageUpload();
  const [convertResult, setConvertResult] = useState<ConvertResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

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
    setConvertResult(null);
    setConvertError(null);
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
      setConvertResult(null);
      setConvertError(null);
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

  const handleRunConvert = async (settings: ConverterSettings) => {
    if (!image) return;

    setConvertError(null);
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = image.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image in browser memory for conversion.'));
      });

      const result = await convertImage(img, settings);

      // Clean up previous result URL to avoid memory leaks
      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
      previousResultUrlRef.current = result.previewUrl;

      setConvertResult(result);
    } catch (err) {
      setConvertError(
        err instanceof Error ? err.message : 'An unexpected error occurred during image conversion.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const activeError = uploadError || convertError;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Hidden File Input for seamless image swapping */}
      <input
        ref={fileInputHiddenRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={onHiddenInputChange}
        className="hidden"
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="blue" size="md">
          Format Conversion Engine
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-400" />
          Image Format Converter
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Convert instantly between JPG, PNG, and WebP formats in browser memory. Includes automated transparency handling to prevent black backgrounds on JPEG conversions.
        </p>
      </div>

      {/* Error Displays */}
      {activeError && (
        <ErrorBanner
          message={activeError}
          onDismiss={() => {
            clearError();
            setConvertError(null);
          }}
        />
      )}

      {/* Step 1: Upload Dropzone if no image is loaded */}
      {!image ? (
        <div className="space-y-6">
          <Dropzone
            onFileSelected={handleFileSelect}
            isLoading={isLoading}
          />

          {/* Quick Format Explainer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <FileImage className="w-4 h-4" />
                JPG / JPEG
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accepted by 100% of exam portals, government jobs (SSC, UPSC, Banking), and college admission forms.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                PNG
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lossless format ideal for scanned signatures, certificates, diagrams, and transparent cutouts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                WebP
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Next-gen format providing ~30% smaller file size with high visual fidelity and alpha transparency support.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Image Details Card */}
          <ImageDetailsCard
            metadata={image}
            onChangeImage={triggerChangeFile}
            onRemoveImage={handleResetImage}
          />

          {/* Converter Controls Form */}
          <ConverterControls
            originalFormat={image.formatExtension}
            originalSizeFormatted={image.formattedSize}
            onConvert={handleRunConvert}
            isProcessing={isProcessing}
          />

          {/* Converted Output Preview & Download */}
          {convertResult && (
            <ConverterPreview
              originalName={image.name}
              originalSize={image.sizeBytes}
              originalFormattedSize={image.formattedSize}
              originalFormat={image.formatExtension}
              originalDimensions={{ width: image.width, height: image.height }}
              originalPreviewUrl={image.previewUrl}
              result={convertResult}
              onReset={() => {
                if (previousResultUrlRef.current) {
                  revokeObjectUrl(previousResultUrlRef.current);
                  previousResultUrlRef.current = null;
                }
                setConvertResult(null);
              }}
            />
          )}
        </div>
      )}

      {/* Educational Guide: Image Formats Comparison */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-slate-200">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-base">Image Format Quick Guide & Important Guidelines</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block">
              Why do transparent PNGs turn black when converted to JPG?
            </span>
            <p>
              The JPEG specification does not support an alpha (transparency) channel. Without explicit background filling, standard canvas export treats transparent pixels as black (RGB 0, 0, 0). ImageFit automatically flattens transparency with a clean white (or custom) background so your photos and signatures look clean and official.
            </p>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block">
              Which format should I use for government/exam portals?
            </span>
            <p>
              Always choose <strong>JPG / JPEG</strong> unless specified otherwise. Major testing agencies (SSC, UPSC, NTA, IBPS) and government portals strictly validate file extensions and MIME headers for <code className="text-blue-300 font-mono">.jpg</code> or <code className="text-blue-300 font-mono">.jpeg</code>.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60">
          <span>Client-side format conversion using HTML5 Canvas & Blob API</span>
          <div className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Zero Server Uploads
          </div>
        </div>
      </div>
    </div>
  );
};
