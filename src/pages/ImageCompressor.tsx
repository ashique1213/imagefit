import React, { useState, useRef, useEffect } from 'react';
import { Minimize2 } from 'lucide-react';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { CompressionControls } from '../components/compressor/CompressionControls';
import type { CompressionSettings } from '../components/compressor/CompressionControls';
import { ComparisonPreview } from '../components/preview/ComparisonPreview';
import { useImageUpload } from '../hooks/useImageUpload';
import { compressToTargetSize, compressWithQuality } from '../utils/image/compressImage';
import type { CompressionResultExtended } from '../utils/image/compressImage';
import { revokeObjectUrl } from '../utils/image/loadImage';

export const ImageCompressorPage: React.FC = () => {
  const { image, isLoading, error: uploadError, handleFileSelect, clearImage, clearError } = useImageUpload();
  const [compressionResult, setCompressionResult] = useState<CompressionResultExtended | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const [currentTargetBytes, setCurrentTargetBytes] = useState<number | undefined>(undefined);

  const fileInputHiddenRef = useRef<HTMLInputElement>(null);
  const previousResultUrlRef = useRef<string | null>(null);

  // Safely cleanup compressed image preview URL when changing image or unmounting
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
    setCompressionResult(null);
    setCompressionError(null);
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
      setCompressionResult(null);
      setCompressionError(null);
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

  const handleRunCompression = async (settings: CompressionSettings) => {
    if (!image) return;

    setCompressionError(null);
    setIsCompressing(true);

    try {
      // Create HTMLImageElement to load the source
      const img = new Image();
      img.src = image.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image in memory for compression.'));
      });

      let result: CompressionResultExtended;

      if (settings.mode === 'target') {
        setCurrentTargetBytes(settings.targetSizeBytes);
        result = await compressToTargetSize(
          img,
          settings.targetSizeBytes,
          image.sizeBytes,
          {
            format: settings.format,
            allowDimensionReduction: settings.allowDimensionReduction,
          }
        );
      } else {
        setCurrentTargetBytes(undefined);
        result = await compressWithQuality(
          img,
          settings.quality,
          settings.format
        );
      }

      // Revoke old compressed preview URL
      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
      previousResultUrlRef.current = result.previewUrl;

      setCompressionResult(result);
      setIsCompressing(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Compression failed due to a browser canvas error.';
      setCompressionError(msg);
      setIsCompressing(false);
    }
  };

  const activeError = uploadError || compressionError;

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
          <Minimize2 className="w-8 h-8 text-[#e5322d]" />
          Compress IMAGE
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Upload your photo or document and compress it to an exact target file size (e.g. 20KB, 50KB, 100KB) for government, exam, and job portals.
        </p>
      </div>

      {/* Error Alert */}
      {activeError && (
        <ErrorBanner
          message={activeError}
          onDismiss={() => {
            clearError();
            setCompressionError(null);
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

          {/* Compression Configuration Stage */}
          <CompressionControls
            originalSizeBytes={image.sizeBytes}
            onCompress={handleRunCompression}
            isProcessing={isCompressing}
          />

          {/* Results Comparison View */}
          {compressionResult && (
            <ComparisonPreview
              original={image}
              result={compressionResult}
              targetSizeBytes={currentTargetBytes}
            />
          )}
        </div>
      )}

      {/* Explanatory Guidelines Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 pt-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="font-bold text-gray-900">Binary Search Precision</span>
          <p>Iterates quality factors dynamically to pinpoint within 1-2 KB of your target size.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="font-bold text-gray-900">Dimension Safeguards</span>
          <p>Optional smart dimension scaling kicks in if quality reduction alone cannot fit strict limits.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="font-bold text-gray-900">100% In-Browser Privacy</span>
          <p>The entire binary search and canvas export run in your browser. Zero data transmission.</p>
        </div>
      </div>
    </div>
  );
};
