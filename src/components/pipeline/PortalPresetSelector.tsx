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
        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
          Select Application Standard
        </label>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'all'
              ? 'bg-[#e5322d] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          All Portals
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('gov-exam')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeCategory === 'gov-exam'
              ? 'bg-[#e5322d] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Gov Exams (SSC, UPSC)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('passport-visa')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeCategory === 'passport-visa'
              ? 'bg-[#e5322d] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Passports & Visas</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('banking')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeCategory === 'banking'
              ? 'bg-[#e5322d] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
                  ? 'bg-red-50/70 border-[#e5322d] text-gray-900 shadow-md ring-2 ring-red-500/20'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs text-gray-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                    {portal.portal.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#e5322d] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-gray-900">{portal.name}</h4>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="font-mono font-semibold text-gray-700">
                  {portal.width} × {portal.height} px
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
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
              ? 'bg-red-50/70 border-[#e5322d] text-gray-900 shadow-md ring-2 ring-red-500/20'
              : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs text-gray-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                Custom
              </span>
              {selectedPortalId === null && (
                <span className="w-5 h-5 rounded-full bg-[#e5322d] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#e5322d]" />
              Custom Requirements
            </h4>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>User Configured</span>
            <span className="text-[#e5322d] font-bold">Flexible</span>
          </div>
        </button>
      </div>
    </div>
  );
};
