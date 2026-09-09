import React, { useState, useRef, useEffect } from 'react';
import { PenTool, ShieldCheck, HelpCircle, FileCheck, Layers } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { SignatureControls } from '../components/signature/SignatureControls';
import { SignaturePreview } from '../components/signature/SignaturePreview';
import { useImageUpload } from '../hooks/useImageUpload';
import { processSignature } from '../utils/image/signatureProcess';
import type {
  SignatureProcessOptions,
  SignatureResult,
} from '../utils/image/signatureProcess';
import { revokeObjectUrl } from '../utils/image/loadImage';

export const SignatureToolPage: React.FC = () => {
  const { image, isLoading, error: uploadError, handleFileSelect, clearImage, clearError } = useImageUpload();

  const [settings, setSettings] = useState<SignatureProcessOptions>({
    backgroundColorMode: 'white',
    inkColorMode: 'black',
    threshold: 210,
    smoothness: 35,
    format: 'image/jpeg',
    quality: 0.92,
  });

  const [signatureResult, setSignatureResult] = useState<SignatureResult | null>(null);
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

  const handleResetAll = () => {
    if (previousResultUrlRef.current) {
      revokeObjectUrl(previousResultUrlRef.current);
      previousResultUrlRef.current = null;
    }
    setSignatureResult(null);
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
      setSignatureResult(null);
      setProcessError(null);
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

  const handleProcessSignature = async () => {
    if (!image) return;

    setProcessError(null);
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = image.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load signature image into memory.'));
      });

      const result = await processSignature(img, settings);

      if (previousResultUrlRef.current) {
        revokeObjectUrl(previousResultUrlRef.current);
      }
      previousResultUrlRef.current = result.previewUrl;

      setSignatureResult(result);
    } catch (err) {
      setProcessError(
        err instanceof Error ? err.message : 'An unexpected error occurred while processing signature.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const activeError = uploadError || processError;

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
          Signature Preparation Studio
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
          <PenTool className="w-8 h-8 text-[#e5322d]" />
          Signature Editor
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Turn rough smartphone photos of paper signatures into crisp, shadow-free, high-contrast digital signatures with official black or blue ink.
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

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                <PenTool className="w-4 h-4" />
                Paper Shadow Removal
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Threshold engine removes gray shadows, yellow lighting casts, and phone camera glare from notebook paper.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <FileCheck className="w-4 h-4" />
                Official Exam Ink Standards
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Recolor faint or faded handwriting directly into deep black or official ballpoint blue ink.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Layers className="w-4 h-4" />
                Transparent or Solid
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Export transparent PNGs to stamp directly onto PDFs, or solid pure white backgrounds for government portal uploads.
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
          {signatureResult ? (
            <SignaturePreview
              originalName={image.name}
              originalWidth={image.width}
              originalHeight={image.height}
              originalFormattedSize={image.formattedSize}
              originalFormat={image.formatExtension}
              originalPreviewUrl={image.previewUrl}
              result={signatureResult}
              inkColorMode={settings.inkColorMode}
              backgroundColorMode={settings.backgroundColorMode}
              onEditSettings={() => setSignatureResult(null)}
              onResetAll={handleResetAll}
            />
          ) : (
            <SignatureControls
              settings={settings}
              onChangeSettings={setSettings}
              onProcess={handleProcessSignature}
              isProcessing={isProcessing}
            />
          )}
        </div>
      )}

      {/* Signature Guidelines Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-900">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-base">Official Signature Guidelines for Applications</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
          <div className="space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block">
              Gov / Exam Portals (SSC, UPSC, NTA, IBPS, Banking)
            </span>
            <p>
              Most entrance exam portals explicitly stipulate: <strong>"Signature must be made with a black or dark blue ink pen on unruled white paper."</strong> Always select <strong>Solid White</strong> background and <strong>JPG</strong> format for online job submissions.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block">
              Digital Contracts, PDF Signing & Offer Letters
            </span>
            <p>
              When embedding your signature into Word docs, Google Docs, or PDF files, select <strong>Transparent (PNG)</strong>. This guarantees your signature appears seamlessly above the signature line without an unsightly white box covering the text underneath.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
          <span>Actual pixel manipulation on HTML5 Canvas ImageData buffer</span>
          <div className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% In-Memory Processing
          </div>
        </div>
      </div>
    </div>
  );
};
