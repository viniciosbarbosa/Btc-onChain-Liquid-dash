import React, { ReactNode } from 'react';

export type CardVariant = 'default' | 'glow-amber' | 'glow-cyan' | 'slate-dark';

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  className = ''
}: CardProps): JSX.Element {
  const baseStyles = 'rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all duration-300';

  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-slate-900/80 border border-slate-800',
    'glow-amber': 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800',
    'glow-cyan': 'bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-800/40',
    'slate-dark': 'bg-slate-950/90 border border-slate-800/90'
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }): JSX.Element {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }): JSX.Element {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}
