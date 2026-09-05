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
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
        {/* Image Preview Box with checkerboard background for transparency checking */}
        <div className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 flex-shrink-0 shadow-lg flex items-center justify-center">
          {/* Transparency checkerboard */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">
                  Original Source File
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Safe</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight break-all">
                {metadata.name}
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onChangeImage}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Change Image</span>
              </button>

              <button
                type="button"
                onClick={onRemoveImage}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                aria-label="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* File Size */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                <span>File Size</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {metadata.formattedSize}
              </div>
              <div className="text-[10px] text-slate-400">
                {metadata.sizeBytes.toLocaleString()} bytes
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Resolution</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {metadata.width} × {metadata.height}
              </div>
              <div className="text-[10px] text-slate-400">
                pixels (WxH)
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <Ratio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aspect Ratio</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {metadata.aspectRatio}
              </div>
              <div className="text-[10px] text-slate-400">
                {metadata.aspectRatioNumeric.toFixed(2)} decimal
              </div>
            </div>

            {/* Format & MIME */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Format</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {metadata.formatExtension}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {metadata.type}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
