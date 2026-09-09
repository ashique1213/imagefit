import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';

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


  const handleInternalDrop = (e: DragEvent<HTMLDivElement>) => {
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
      onDrop={handleInternalDrop}
      onClick={triggerBrowse}
      onKeyDown={handleKeyDown}
      className={`relative w-full rounded-3xl p-10 sm:p-16 text-center transition-all duration-200 cursor-pointer select-none overflow-hidden outline-none ${
        isDragOver
          ? 'bg-red-50/60 border-2 border-dashed border-[#e5322d] scale-[1.01] shadow-2xl shadow-red-500/15'
          : 'bg-white border-2 border-dashed border-gray-300 hover:border-[#e5322d] shadow-sm hover:shadow-md'
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

      <div className="relative z-10 flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto">
        {/* Giant Red iLovePDF Style Button */}
        <button
          type="button"
          disabled={disabled || isLoading}
          className={`px-10 py-5 rounded-2xl bg-[#e5322d] hover:bg-[#cb1b16] text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-red-500/25 flex items-center gap-3 transition-transform duration-150 pointer-events-none ${
            isDragOver ? 'scale-105' : ''
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-white" />
              <span>Reading image...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-white stroke-[2.5]" />
              <span>Select IMAGE</span>
            </>
          )}
        </button>

        {/* Text Instruction */}
        <div>
          <p className="text-base font-semibold text-gray-500">
            {isDragOver ? 'Drop image right here' : 'or drop image here'}
          </p>
        </div>
      </div>
    </div>
  );
};
