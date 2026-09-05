import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { ToolInfo } from '../../types';
import { Badge } from './Badge';

interface ToolCardProps {
  tool: ToolInfo;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  // Dynamically resolve Lucide icon
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.iconName] || Icons.Wrench;

  return (
    <Link
      to={tool.path}
      className="group relative flex flex-col justify-between p-6 rounded-2xl glass-panel glass-panel-hover overflow-hidden"
    >
      {/* Background Subtle Gradient Highlight */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none" />

      <div>
        {/* Top Header inside card */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-600/20 group-hover:border-blue-500/40 transition-all duration-300 shadow-md">
            <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </div>
          {tool.badge && (
            <Badge variant="purple" size="sm">
              {tool.badge}
            </Badge>
          )}
          {!tool.badge && tool.popular && (
            <Badge variant="blue" size="sm">
              Popular
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200 mb-2 flex items-center gap-2">
          {tool.title}
          <Icons.ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
        <span>Open Tool</span>
        <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
          →
        </span>
      </div>
    </Link>
  );
};
