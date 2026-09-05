import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, ShieldCheck } from 'lucide-react';

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelected,
  isLoading = false,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isLoading) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelected(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file);
    }
    // Reset file input value so re-uploading the same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerBrowse = () => {
    if (disabled || isLoading) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerBrowse();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload image area. Drag and drop or press enter to browse files."
      aria-disabled={disabled || isLoading}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerBrowse}
      onKeyDown={handleKeyDown}
      className={`relative w-full rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer select-none overflow-hidden outline-none ${
        isDragOver
          ? 'bg-blue-600/15 border-2 border-dashed border-blue-400 scale-[1.01] shadow-2xl shadow-blue-500/20'
          : 'glass-panel border-2 border-dashed border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-900/60'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isLoading}
      />

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
        {/* Upload Icon Container */}
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragOver
              ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/40'
              : 'bg-slate-800/90 text-blue-400 border border-slate-700 shadow-md group-hover:scale-105'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-9 h-9 animate-spin text-blue-400" />
          ) : isDragOver ? (
            <UploadCloud className="w-9 h-9 animate-bounce text-white" />
          ) : (
            <UploadCloud className="w-9 h-9 text-blue-400" />
          )}
        </div>

        {/* Text Instructions */}
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isLoading ? 'Reading image...' : isDragOver ? 'Drop image here' : 'Upload your image'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Drag & drop or browse files directly from your device
          </p>
        </div>

        {/* Browse Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={disabled || isLoading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all duration-200 pointer-events-none"
          >
            Choose Image
          </button>
        </div>

        {/* Supported Formats & Privacy Hint */}
        <div className="pt-4 flex flex-col items-center gap-2 border-t border-slate-800/80 w-full">
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>JPG, PNG, WebP supported (Max 30 MB)</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400/90">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Images stay on your device • No server upload</span>
          </div>
        </div>
      </div>
    </div>
  );
};
