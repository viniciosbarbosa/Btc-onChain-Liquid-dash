import React, { ReactNode } from 'react';

export type BadgeVariant = 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose' | 'slate';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = 'amber',
  icon,
  className = ''
}: BadgeProps): JSX.Element {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider';

  const variantStyles: Record<BadgeVariant, string> = {
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
