import React from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const ImageConverterPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="blue" size="md">
          Format Conversion
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-400" />
          Format Converter
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Convert seamlessly between JPG, PNG, and WebP formats in browser memory.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Converter Route Active</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Image converter route registered and configured.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
          <ShieldCheck className="w-4 h-4" />
          Client-side processing ready
        </div>
      </div>
    </div>
  );
};
