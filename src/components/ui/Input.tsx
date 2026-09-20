import React, { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps): JSX.Element {
  return (
    <div className="space-y-1.5 w-full font-mono text-xs">
      {label && (
        <label className="block font-bold text-slate-300 font-sans">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 shrink-0 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full py-3.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none shadow-inner transition-all ${
            icon ? 'pl-11 pr-4' : 'px-4'
          } ${error ? 'border-rose-500/80 focus:border-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>
      )}
    </div>
  );
}
