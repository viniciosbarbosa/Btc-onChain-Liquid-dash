import React, { useState, ReactNode } from 'react';

export interface TooltipProps {
  children: ReactNode;
  text: string;
  className?: string;
}

export function Tooltip({ children, text, className = '' }: TooltipProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-slate-800 text-slate-100 text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
}
