import React, { useRef } from 'react';
import { Minimize2, ShieldCheck, Sliders, ArrowRight } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Dropzone } from '../components/upload/Dropzone';
import { ImageDetailsCard } from '../components/upload/ImageDetailsCard';
import { useImageUpload } from '../hooks/useImageUpload';

export const ImageCompressorPage: React.FC = () => {
  const { image, isLoading, error, handleFileSelect, clearImage, clearError } = useImageUpload();
  const fileInputHiddenRef = useRef<HTMLInputElement>(null);

  const triggerChangeFile = () => {
    fileInputHiddenRef.current?.click();
  };

  const onHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputHiddenRef.current) {
      fileInputHiddenRef.current.value = '';
    }
  };

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
      <div className="text-center space-y-3">
        <Badge variant="blue" size="md">
          Target KB & MB Compression
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Minimize2 className="w-8 h-8 text-blue-400" />
          Image Compressor
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Upload your photo to inspect metadata and compress it to an exact target file size (e.g. 20KB, 50KB, 100KB) for government and application forms.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorBanner message={error} onDismiss={clearError} />
      )}

      {/* Main Upload / Metadata Stage */}
      {!image ? (
        <Dropzone
          onFileSelected={handleFileSelect}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-6">
          {/* Uploaded Image Metadata Card */}
          <ImageDetailsCard
            metadata={image}
            onChangeImage={triggerChangeFile}
            onRemoveImage={clearImage}
          />

          {/* Compression Configuration Preview Stage (Coming in Day 3) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <h3 className="text-base font-bold text-white">Compression Settings Ready</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Image validated and decoded successfully in browser memory.
                </p>
              </div>
              <Badge variant="green" size="sm">
                Ready for Day 3
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Size</span>
                <div className="text-2xl font-bold font-mono text-white">{image.formattedSize}</div>
                <p className="text-[11px] text-slate-400">Original uncompressed file weight</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Target Size Engine</span>
                <div className="text-2xl font-bold font-mono text-blue-400">Target KB / MB</div>
                <p className="text-[11px] text-slate-400">Binary-search canvas compression algorithm scheduled for Day 3</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                No data transmitted to any external server
              </span>
              <button
                type="button"
                onClick={triggerChangeFile}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>Upload another photo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines & Safety Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 pt-4">
        <div className="p-4 rounded-2xl glass-panel space-y-1">
          <span className="font-semibold text-slate-200">Supported Formats</span>
          <p>JPEG, PNG, and WebP images up to 30 MB.</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel space-y-1">
          <span className="font-semibold text-slate-200">Magic Byte Check</span>
          <p>Files are verified by byte signature, not just extension.</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel space-y-1">
          <span className="font-semibold text-slate-200">Memory Cleanup</span>
          <p>Temporary object URLs are immediately revoked upon file change.</p>
        </div>
      </div>
    </div>
  );
};
