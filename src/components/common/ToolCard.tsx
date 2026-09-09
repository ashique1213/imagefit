import React from 'react';
import { Link } from 'react-router-dom';
import {
  Minimize2,
  Maximize2,
  RefreshCw,
  PenTool,
  Palette,
  Crop,
  Sliders,
  Layers,
  ShieldAlert,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import type { ToolInfo } from '../../types';
import { Badge } from './Badge';

const TOOL_ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Minimize2,
  Maximize2,
  RefreshCw,
  PenTool,
  Palette,
  Crop,
  Sliders,
  Layers,
  ShieldAlert,
};

// Unified brand theme for all tool icons (iLovePDF signature red)
const UNIFIED_THEME = {
  bg: 'bg-red-50',
  text: 'text-[#e5322d]',
  border: 'border-red-100',
  hoverBorder: 'group-hover:border-red-300 group-hover:bg-red-100/50',
};

interface ToolCardProps {
  tool: ToolInfo;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const IconComponent = TOOL_ICONS_MAP[tool.iconName] || Wrench;

  return (
    <Link
      to={tool.path}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 overflow-hidden"
    >
      <div>
        {/* Top Header inside card */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-200 ${UNIFIED_THEME.bg} ${UNIFIED_THEME.text} ${UNIFIED_THEME.border} ${UNIFIED_THEME.hoverBorder} group-hover:scale-105`}
          >
            <IconComponent className="w-7 h-7 transition-transform duration-200" />
          </div>

          {tool.badge && (
            <Badge variant="red" size="sm">
              {tool.badge}
            </Badge>
          )}
          {!tool.badge && tool.popular && (
            <Badge variant="slate" size="sm">
              Popular
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#e5322d] transition-colors duration-150 mb-2 flex items-center justify-between">
          <span>{tool.title}</span>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#e5322d] group-hover:translate-x-1 transition-all duration-150" />
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-[#e5322d] transition-colors">
        <span>Use Tool</span>
        <span className="w-6 h-6 rounded-full bg-gray-50 group-hover:bg-red-50 flex items-center justify-center transition-colors">
          →
        </span>
      </div>
    </Link>
  );
};
