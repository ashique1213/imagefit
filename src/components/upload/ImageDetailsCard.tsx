import React from 'react';
import { RefreshCw, Trash2, FileText, Maximize2, HardDrive, Ratio, ShieldCheck } from 'lucide-react';
import type { ImageMetadata } from '../../types';
import { Badge } from '../common/Badge';

interface ImageDetailsCardProps {
  metadata: ImageMetadata;
  onChangeImage: () => void;
  onRemoveImage: () => void;
}

export const ImageDetailsCard: React.FC<ImageDetailsCardProps> = ({
  metadata,
  onChangeImage,
  onRemoveImage,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
        {/* Image Preview Box with checkerboard background for transparency checking */}
        <div className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 shadow-inner flex items-center justify-center">
          {/* Transparency checkerboard */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(#d1d5db 1px, transparent 1px)`,
              backgroundSize: '12px 12px',
            }}
          />

          <img
            src={metadata.previewUrl}
            alt={metadata.name}
            className="max-w-full max-h-full object-contain relative z-10 p-2"
          />

          <div className="absolute bottom-2 left-2 z-20">
            <Badge variant="slate" size="sm">
              {metadata.formatExtension}
            </Badge>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="flex-1 w-full space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="red" size="sm">
                  Original Source File
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Safe</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight break-all">
                {metadata.name}
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onChangeImage}
                className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                <span>Change Image</span>
              </button>

              <button
                type="button"
                onClick={onRemoveImage}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-600 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* File Size */}
            <div className="bg-gray-50/80 border border-gray-200/80 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-[#e5322d]" />
                <span>File Size</span>
              </div>
              <div className="text-sm font-extrabold text-gray-900 font-mono">
                {metadata.formattedSize}
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                {metadata.sizeBytes.toLocaleString()} bytes
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-gray-50/80 border border-gray-200/80 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-semibold">
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Resolution</span>
              </div>
              <div className="text-sm font-extrabold text-gray-900 font-mono">
                {metadata.width} × {metadata.height}
              </div>
              <div className="text-[10px] text-gray-400">
                pixels (WxH)
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-gray-50/80 border border-gray-200/80 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-semibold">
                <Ratio className="w-3.5 h-3.5 text-purple-600" />
                <span>Aspect Ratio</span>
              </div>
              <div className="text-sm font-extrabold text-gray-900 font-mono">
                {metadata.aspectRatio}
              </div>
              <div className="text-[10px] text-gray-400">
                {metadata.aspectRatioNumeric.toFixed(2)} decimal
              </div>
            </div>

            {/* Format & MIME */}
            <div className="bg-gray-50/80 border border-gray-200/80 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-semibold">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format</span>
              </div>
              <div className="text-sm font-extrabold text-gray-900 font-mono">
                {metadata.formatExtension}
              </div>
              <div className="text-[10px] text-gray-400 truncate">
                {metadata.type}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
