import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'green' | 'amber' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', size = 'sm' }) => {
  const variantStyles = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};
