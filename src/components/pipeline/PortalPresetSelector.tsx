import React, { useState } from 'react';
import {
  Check,
  Globe,
  Landmark,
  GraduationCap,
  Sliders,
} from 'lucide-react';
import type { ApplicationPortalProfile } from '../../constants/applicationPortals';
import { APPLICATION_PORTALS } from '../../constants/applicationPortals';

interface PortalPresetSelectorProps {
  selectedPortalId: string | null;
  onSelectPortal: (portal: ApplicationPortalProfile | null) => void;
}

export const PortalPresetSelector: React.FC<PortalPresetSelectorProps> = ({
  selectedPortalId,
  onSelectPortal,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'gov-exam' | 'passport-visa' | 'banking'>('all');

  const filteredPortals = APPLICATION_PORTALS.filter((p) =>
    activeCategory === 'all' ? true : p.category === activeCategory
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Select Official Application Standard
        </label>
        <span className="text-[11px] text-slate-400">
          Auto-configures resolution, target KB, format & backdrop
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Portals ({APPLICATION_PORTALS.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('gov-exam')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'gov-exam'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Gov Exams (SSC, UPSC)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('passport-visa')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'passport-visa'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Passports & Visas</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('banking')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'banking'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Banking (IBPS)</span>
        </button>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPortals.map((portal) => {
          const isSelected = selectedPortalId === portal.id;
          return (
            <button
              key={portal.id}
              type="button"
              onClick={() => onSelectPortal(portal)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    {portal.portal.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-white">{portal.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {portal.officialRuleText}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-300">
                  {portal.width} × {portal.height} px
                </span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Max {portal.maxKb} KB
                </span>
              </div>
            </button>
          );
        })}

        {/* Custom Specifications Option */}
        <button
          type="button"
          onClick={() => onSelectPortal(null)}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2.5 transition-all cursor-pointer ${
            selectedPortalId === null
              ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Custom
              </span>
              {selectedPortalId === null && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-400" />
              Custom Requirements
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Specify your own exact width, height, target KB, and background rules manually.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>User Configured</span>
            <span className="text-blue-400">Flexible</span>
          </div>
        </button>
      </div>
    </div>
  );
};
