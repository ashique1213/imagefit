import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Image as ImageIcon,
  MapPin,
  Camera,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { ExifViewerCard } from '../components/metadata/ExifViewerCard';
import { ExifSanitizerControls } from '../components/metadata/ExifSanitizerControls';
import {
  inspectImageMetadata,
  stripImageMetadata,
  createSampleExifDemoImage,
  type ExifReport,
  type SanitizationResult,
} from '../utils/image/exifInspector';
import { loadImageMetadata, revokeObjectUrl } from '../utils/image/loadImage';
import type { ImageMetadata } from '../types';
import { triggerFileDownload } from '../utils/image/downloadImage';

export const MetadataStripperPage: React.FC = () => {
  const [image, setImage] = useState<ImageMetadata | null>(null);
  const [report, setReport] = useState<ExifReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sanitization states
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(0.92);
  const [isStripping, setIsStripping] = useState(false);
  const [result, setResult] = useState<SanitizationResult | null>(null);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const resultPreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (resultPreviewUrlRef.current) {
        revokeObjectUrl(resultPreviewUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const meta = await loadImageMetadata(file);
      setImage(meta);

      // Inspect EXIF
      const exifReport = await inspectImageMetadata(file);
      setReport(exifReport);

      // Default to matching target format
      if (file.type === 'image/png') {
        setFormat('image/png');
      } else if (file.type === 'image/webp') {
        setFormat('image/webp');
      } else {
        setFormat('image/jpeg');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to inspect image metadata.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleReset = () => {
    if (image?.previewUrl) {
      revokeObjectUrl(image.previewUrl);
    }
    if (resultPreviewUrlRef.current) {
      revokeObjectUrl(resultPreviewUrlRef.current);
      resultPreviewUrlRef.current = null;
    }
    setImage(null);
    setReport(null);
    setResult(null);
    setError(null);
  };

  const handleStripMetadata = async () => {
    if (!image) return;
    setIsStripping(true);
    setError(null);

    try {
      const cleanResult = await stripImageMetadata(image.file, {
        format,
        quality,
      });

      if (resultPreviewUrlRef.current) {
        revokeObjectUrl(resultPreviewUrlRef.current);
      }
      resultPreviewUrlRef.current = cleanResult.previewUrl;
      setResult(cleanResult);
    } catch (err: any) {
      setError(err.message || 'Failed to strip metadata in canvas.');
    } finally {
      setIsStripping(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      triggerFileDownload(result.sanitizedBlob, result.filename);
    }
  };

  const handleLoadDemo = async () => {
    const demoFile = await createSampleExifDemoImage();
    await handleFileSelect(demoFile);
  };

  const triggerChangeFile = () => {
    hiddenInputRef.current?.click();
  };

  const onHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <input
        ref={hiddenInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={onHiddenInputChange}
        className="hidden"
      />

      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="red" size="md">
          Privacy & Anti-Tracking Studio
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
          <ShieldAlert className="w-8 h-8 text-[#e5322d]" />
          EXIF & Privacy Stripper
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Detect and wipe hidden GPS coordinates, camera serial numbers, and capture timestamps
          before submitting photos to government, visa, or job portals. 100% in-browser privacy.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Upload Stage */}
      {!image ? (
        <div className="space-y-6">
          <Dropzone
            onFileSelected={handleFileSelect}
            isLoading={isAnalyzing}
          />

          {/* Demo Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-rose-600 border border-gray-200 text-xs font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-rose-600" />
              <span>Or click here to test with a specimen photo</span>
            </button>
          </div>

          {/* Privacy Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">GPS Coordinate Wipe</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Modern smartphone photos tag your exact home or work GPS latitude and longitude.
                We detect and wipe location data cleanly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Device Anonymization</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Removes phone model, lens serials, aperture values, and software signatures to
                prevent device tracking and portal rejection.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Zero Server Uploads</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                All metadata scanning and sanitization occurs directly in your browser session via
                HTML5 Canvas. Your confidential ID photos never leave your device.
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
            onRemoveImage={handleReset}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sanitizer Controls */}
            <div className="lg:col-span-6 space-y-6">
              <ExifSanitizerControls
                format={format}
                onChangeFormat={setFormat}
                quality={quality}
                onChangeQuality={setQuality}
                onStripMetadata={handleStripMetadata}
                isStripping={isStripping}
                result={result}
                onDownload={handleDownload}
              />
            </div>

            {/* Right Column: EXIF Report Viewer */}
            <div className="lg:col-span-6">
              {report && <ExifViewerCard report={report} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
