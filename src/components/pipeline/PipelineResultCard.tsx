import React from 'react';
import {
  Download,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  RotateCcw,
  Sliders,
  FileCheck2,
} from 'lucide-react';
import type { PipelineExecutionResult } from '../../utils/image/pipelineEngine';
import { triggerFileDownload, generateDownloadFilename } from '../../utils/image/downloadImage';

interface PipelineResultCardProps {
  originalName: string;
  originalWidth: number;
  originalHeight: number;
  originalFormattedSize: string;
  originalFormat: string;
  originalPreviewUrl: string;
  result: PipelineExecutionResult;
  portalName?: string;
  onEditSettings: () => void;
  onResetAll: () => void;
}

export const PipelineResultCard: React.FC<PipelineResultCardProps> = ({
  originalName,
  originalWidth,
  originalHeight,
  originalFormattedSize,
  originalFormat,
  originalPreviewUrl,
  result,
  portalName = 'application',
  onEditSettings,
  onResetAll,
}) => {
  const cleanPrefix = portalName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const downloadFilename = generateDownloadFilename(`${cleanPrefix}-${originalName}`, 'ready', result.format);

  const handleDownload = () => {
    triggerFileDownload(result.blob, downloadFilename);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Application Package Ready
            </h2>
            <p className="text-xs text-slate-400">
              Processed through 4-stage pipeline: Crop, Resize, Backdrop & Target KB Compression
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {result.allPassed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Portal Compliant</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              Review Checklist
            </span>
          )}
        </div>
      </div>

      {/* Official Compliance Verification Checklist */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Portal Submission Verification Checklist
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {result.complianceList.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs"
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{item.name}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      item.passed
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-amber-400 bg-amber-500/10'
                    }`}
                  >
                    {item.passed ? 'MATCH' : 'CHECK'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Req: {item.expected}</span>
                  <span className="text-slate-300 font-mono">{item.actual}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Original Upload
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {originalFormat.replace('image/', '')}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center checkerboard-pattern">
            <img
              src={originalPreviewUrl}
              alt="Original unedited"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px]">Dimensions</span>
              <span className="font-mono text-slate-200">
                {originalWidth} × {originalHeight} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">File Size</span>
              <span className="font-mono text-slate-200">{originalFormattedSize}</span>
            </div>
          </div>
        </div>

        {/* Processed Result */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-emerald-500/30 ring-1 ring-emerald-500/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Submission-Ready Output
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {result.format.toUpperCase()}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center checkerboard-pattern">
            <img
              src={result.previewUrl}
              alt="Submission-ready output"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60 text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px]">Portal Dimensions</span>
              <span className="font-mono font-bold text-white">
                {result.width} × {result.height} px
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Target File Size</span>
              <span className="font-mono font-bold text-emerald-400">
                {result.formattedSize}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>Download {downloadFilename}</span>
        </button>

        <button
          type="button"
          onClick={onEditSettings}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>Adjust Settings</span>
        </button>

        <button
          type="button"
          onClick={onResetAll}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Prepare Another</span>
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Processed 100% locally in browser memory. Verified portal compliance.</span>
      </div>
    </div>
  );
};
