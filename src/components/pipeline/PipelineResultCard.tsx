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
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Application Package Ready
            </h2>
            <p className="text-xs text-gray-500">
              Compliant package ready for submission
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {result.allPassed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Portal Compliant</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
              Review Checklist
            </span>
          )}
        </div>
      </div>

      {/* Official Compliance Verification Checklist */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Portal Submission Verification Checklist
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {result.complianceList.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-gray-200 flex items-start gap-2.5 text-xs shadow-xs"
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{item.name}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      item.passed
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-amber-700 bg-amber-50 border border-amber-200'
                    }`}
                  >
                    {item.passed ? 'MATCH' : 'CHECK'}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center justify-between">
                  <span>Req: {item.expected}</span>
                  <span className="text-gray-800 font-mono font-semibold">{item.actual}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Original Upload
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200 font-semibold">
              {originalFormat.replace('image/', '')}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center checkerboard-pattern">
            <img
              src={originalPreviewUrl}
              alt="Original unedited"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200 text-gray-600">
            <div>
              <span className="text-gray-400 block text-[10px]">Dimensions</span>
              <span className="font-mono font-bold text-gray-800">
                {originalWidth} × {originalHeight} px
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">File Size</span>
              <span className="font-mono font-bold text-gray-800">{originalFormattedSize}</span>
            </div>
          </div>
        </div>

        {/* Processed Result */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-emerald-200 ring-1 ring-emerald-100 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Submission-Ready Output
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold">
              {result.format.toUpperCase()}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center checkerboard-pattern">
            <img
              src={result.previewUrl}
              alt="Submission-ready output"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200 text-gray-600">
            <div>
              <span className="text-gray-400 block text-[10px]">Portal Dimensions</span>
              <span className="font-mono font-black text-gray-900">
                {result.width} × {result.height} px
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Target File Size</span>
              <span className="font-mono font-black text-emerald-600">
                {result.formattedSize}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: iLovePDF signature giant red CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-[#e5322d] hover:bg-[#cb1b16] active:scale-[0.99] font-black text-white text-base shadow-xl shadow-red-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
          <span>Download {downloadFilename}</span>
        </button>

        <button
          type="button"
          onClick={onEditSettings}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm border border-gray-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>Adjust Settings</span>
        </button>

        <button
          type="button"
          onClick={onResetAll}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm border border-gray-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Prepare Another</span>
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Processed 100% locally in browser memory. Verified portal compliance.</span>
      </div>
    </div>
  );
};
