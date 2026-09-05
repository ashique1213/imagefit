import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  Calendar,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import type { ExifReport } from '../../utils/image/exifInspector';

interface ExifViewerCardProps {
  report: ExifReport;
}

export const ExifViewerCard: React.FC<ExifViewerCardProps> = ({ report }) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const getRiskStyles = () => {
    switch (report.privacyRisk) {
      case 'high':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-300',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: AlertTriangle,
          title: 'High Privacy Risk Detected',
          desc: 'This image contains highly sensitive personal data (e.g., GPS home/work coordinates or camera serial). It is strongly recommended to strip this before portal submission.',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertTriangle,
          title: 'Moderate Metadata Present',
          desc: 'This image contains timestamps, software, or camera hardware identifiers that can be used to fingerprint your device.',
        };
      case 'clean':
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: ShieldCheck,
          title: 'Clean & Safe: No EXIF Found',
          desc: 'No sensitive GPS coordinates or camera device tags were found. Your image is safe for portal submission.',
        };
    }
  };

  const riskStyle = getRiskStyles();
  const RiskIcon = riskStyle.icon;

  const rawKeys = Object.keys(report.rawTags);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Privacy Risk Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${riskStyle.bg} space-y-2`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <RiskIcon className="w-5 h-5 shrink-0" />
            <span className="font-bold text-sm tracking-wide">{riskStyle.title}</span>
          </div>
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${riskStyle.badgeBg}`}
          >
            {report.privacyRisk} Risk
          </span>
        </div>
        <p className="text-xs opacity-90 leading-relaxed">{riskStyle.desc}</p>

        {report.riskReasons.length > 0 && (
          <ul className="pt-2 space-y-1 text-xs border-t border-white/10 list-disc list-inside">
            {report.riskReasons.map((reason, idx) => (
              <li key={idx} className="font-medium">
                {reason}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Metadata Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GPS Coordinates Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>GPS Location</span>
            </div>
            {report.gps && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                Found
              </span>
            )}
          </div>

          {report.gps ? (
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Latitude</span>
                  <span className="font-bold text-white">
                    {report.gps.latitude}° {report.gps.latitudeRef}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Longitude</span>
                  <span className="font-bold text-white">
                    {report.gps.longitude}° {report.gps.longitudeRef}
                  </span>
                </div>
                {report.gps.altitude !== undefined && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Altitude</span>
                    <span className="font-bold text-white">{report.gps.altitude} meters</span>
                  </div>
                )}
              </div>

              {report.gps.mapUrl && (
                <a
                  href={report.gps.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold pt-1 underline underline-offset-4"
                >
                  <span>View Exact Location on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 pt-1">
              No geographical or GPS coordinates detected in this file.
            </p>
          )}
        </div>

        {/* Camera & Hardware Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Camera className="w-4 h-4 text-blue-400" />
            <span>Camera & Device</span>
          </div>

          {report.camera.make || report.camera.model ? (
            <div className="space-y-1.5 pt-1 text-xs">
              {report.camera.make && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Make:</span>
                  <span className="font-bold text-white">{report.camera.make}</span>
                </div>
              )}
              {report.camera.model && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Model:</span>
                  <span className="font-bold text-white">{report.camera.model}</span>
                </div>
              )}
              {report.camera.lensModel && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Lens:</span>
                  <span className="font-bold text-white truncate max-w-[180px]">
                    {report.camera.lensModel}
                  </span>
                </div>
              )}
              {report.camera.software && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Software:</span>
                  <span className="font-bold text-white truncate max-w-[180px]">
                    {report.camera.software}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 pt-1">
              No camera make, model, or hardware identifiers found.
            </p>
          )}
        </div>

        {/* Capture Date & Time */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Date & Timestamp</span>
          </div>

          {report.dateTimeOriginal ? (
            <div className="pt-1 text-xs space-y-1">
              <span className="text-slate-400 block text-[11px]">Capture Timestamp:</span>
              <span className="font-bold text-white font-mono text-xs">
                {report.dateTimeOriginal}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 pt-1">
              No creation or capture timestamps stored in EXIF.
            </p>
          )}
        </div>

        {/* Technical Exposure Specs */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Exposure Specs</span>
          </div>

          {report.exposure.iso || report.exposure.fNumber || report.exposure.focalLength ? (
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              {report.exposure.iso && (
                <div>
                  <span className="text-slate-400 block text-[11px]">ISO</span>
                  <span className="font-bold text-white">{report.exposure.iso}</span>
                </div>
              )}
              {report.exposure.fNumber && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Aperture</span>
                  <span className="font-bold text-white">f/{report.exposure.fNumber}</span>
                </div>
              )}
              {report.exposure.focalLength && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Focal Length</span>
                  <span className="font-bold text-white">{report.exposure.focalLength} mm</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 pt-1">
              No technical photographic aperture or ISO data present.
            </p>
          )}
        </div>
      </div>

      {/* Raw Tags Section (Collapsible) */}
      {rawKeys.length > 0 && (
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowAllTags((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              <span>All Detected Tags ({rawKeys.length})</span>
            </div>
            {showAllTags ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAllTags && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 max-h-56 overflow-y-auto space-y-1.5 text-xs font-mono">
              {rawKeys.map((key) => (
                <div key={key} className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-blue-300 text-right font-medium truncate max-w-[240px]">
                    {String(report.rawTags[key])}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
