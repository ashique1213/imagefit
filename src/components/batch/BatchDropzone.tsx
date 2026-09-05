import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import { UploadCloud, Layers, Sparkles, ShieldCheck } from 'lucide-react';

interface BatchDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const BatchDropzone: React.FC<BatchDropzoneProps> = ({
  onFilesSelected,
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
      const fileList = Array.from(e.dataTransfer.files);
      onFilesSelected(fileList);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      onFilesSelected(fileList);
    }
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
      tabIndex={disabled || isLoading ? -1 : 0}
      onClick={triggerBrowse}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer select-none group focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
        isDragOver
          ? 'border-2 border-dashed border-blue-400 bg-blue-500/15 scale-[1.01] shadow-2xl shadow-blue-500/20'
          : 'glass-panel border-2 border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 shadow-xl'
      } ${disabled || isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isLoading}
      />

      <div className="flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto">
        {/* Animated Icon badge */}
        <div
          className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            isDragOver
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40'
              : 'bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 text-blue-400 border border-blue-500/30'
          }`}
        >
          {isDragOver ? (
            <Layers className="w-9 h-9 animate-bounce" />
          ) : (
            <UploadCloud className="w-9 h-9" />
          )}
        </div>

        {/* Primary Prompt */}
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Drop Multiple Images Here
          </h3>
          <p className="text-sm text-slate-300">
            Drag & drop several files or{' '}
            <span className="text-blue-400 font-semibold underline decoration-blue-500/40 underline-offset-4 group-hover:text-blue-300">
              browse from your device
            </span>
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Batch processing
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Export as .ZIP
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Client-Side
          </span>
        </div>

        <p className="text-xs text-slate-500 pt-1">
          Supports JPG, PNG, and WebP up to 30 MB each. No server uploads.
        </p>
      </div>
    </div>
  );
};
