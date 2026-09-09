import React, { useState, useRef, useEffect } from 'react';
import { Sliders, ShieldCheck, HelpCircle, FlipHorizontal, RotateCw, Sun } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { EditorControls } from '../components/editor/EditorControls';
import { EditorPreview } from '../components/editor/EditorPreview';
import { useImageUpload } from '../hooks/useImageUpload';
import {
  exportEditedImage,
  DEFAULT_EDITOR_SETTINGS,
} from '../utils/image/editImage';
import type {
  EditorSettings,
  EditorResult,
} from '../utils/image/editImage';
import { revokeObjectUrl } from '../utils/image/loadImage';

export const ImageEditorPage: React.FC = () => {
  const { image, isLoading, error: uploadError, handleFileSelect, clearImage, clearError } = useImageUpload();

  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_EDITOR_SETTINGS);
  const [editorResult, setEditorResult] = useState<EditorResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

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

  const handleResetAll = () => {
    if (previousResultUrlRef.current) {
      revokeObjectUrl(previousResultUrlRef.current);
      previousResultUrlRef.current = null;
    }
    setEditorResult(null);
    setEditorError(null);
    setSettings(DEFAULT_EDITOR_SETTINGS);
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
      setEditorResult(null);
      setEditorError(null);
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

  const handleApplyTransforms = async () => {
    if (!image) return;

    setEditorError(null);
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = image.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image in browser memory for editing.'));
      });

      const result = await exportEditedImage(img, settings);

      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
      previousResultUrlRef.current = result.previewUrl;

      setEditorResult(result);
    } catch (err) {
      setEditorError(
        err instanceof Error ? err.message : 'An unexpected error occurred during image editing.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const activeError = uploadError || editorError;

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
        <Badge variant="amber" size="md">
          Orientation & Color Studio
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
          <Sliders className="w-8 h-8 text-[#e5322d]" />
          Photo Studio Editor
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Rotate photos, fix mirrored selfie cameras, fine-tune brightness and contrast, or convert scans to black & white without quality loss.
        </p>
      </div>

      {/* Error Alert */}
      {activeError && (
        <ErrorBanner
          message={activeError}
          onDismiss={() => {
            clearError();
            setEditorError(null);
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
                <FlipHorizontal className="w-4 h-4" />
                Mirror / Selfie Fix
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Flip horizontally with one click to un-invert webcam and front-facing smartphone camera photos for passport standards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                <RotateCw className="w-4 h-4" />
                Lossless 90° Rotation
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Correct sideways or upside-down document scans without degrading pixel resolution or creating letterboxing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <Sun className="w-4 h-4" />
                Lighting & Contrast
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enhance underexposed certificate scans or washed-out photographs with precision contrast curves.
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
          {editorResult ? (
            <EditorPreview
              originalName={image.name}
              originalWidth={image.width}
              originalHeight={image.height}
              originalFormattedSize={image.formattedSize}
              originalFormat={image.formatExtension}
              originalPreviewUrl={image.previewUrl}
              result={editorResult}
              settings={settings}
              onEditSettings={() => setEditorResult(null)}
              onResetAll={handleResetAll}
            />
          ) : (
            <EditorControls
              settings={settings}
              onChangeSettings={setSettings}
              onApply={handleApplyTransforms}
              isProcessing={isProcessing}
            />
          )}
        </div>
      )}

      {/* Guidelines Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-900">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-base">Application Photo Guidelines & Common Fixes</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
          <div className="space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block">
              Why do portals reject front-camera selfie photos?
            </span>
            <p>
              Front smartphone selfie cameras produce mirrored images by default, causing shirt logos, facial features, or moles to be reversed. Official consular rules require an un-mirrored real-world perspective. Click <strong>Mirror (Selfie Fix)</strong> to restore accurate orientation.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block">
              Fixing Faint or Underexposed Document Scans
            </span>
            <p>
              If your scanned mark sheet, degree certificate, or government ID has grayed-out or faint text, increase <strong>Contrast (+20% to +35%)</strong> and toggle <strong>Black & White Document Mode</strong> to make fine lettering sharp and easily legible for document verification officers.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
          <span>Native HTML5 Canvas matrix transformations</span>
          <div className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% In-Memory Processing
          </div>
        </div>
      </div>
    </div>
  );
};
