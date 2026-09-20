import React from 'react';

export function TxSkeletonLoader(): JSX.Element {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="h-4 bg-slate-800 rounded w-1/4 mb-3" />
        <div className="h-6 bg-slate-800 rounded w-3/4 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-16 bg-slate-950/80 rounded-xl border border-slate-800/80" />
          <div className="h-16 bg-slate-950/80 rounded-xl border border-slate-800/80" />
          <div className="h-16 bg-slate-950/80 rounded-xl border border-slate-800/80" />
          <div className="h-16 bg-slate-950/80 rounded-xl border border-slate-800/80" />
        </div>
      </div>

      {/* Inputs / Outputs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
          <div className="h-14 bg-slate-950/80 rounded-xl border border-slate-800" />
          <div className="h-14 bg-slate-950/80 rounded-xl border border-slate-800" />
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
          <div className="h-14 bg-slate-950/80 rounded-xl border border-slate-800" />
          <div className="h-14 bg-slate-950/80 rounded-xl border border-slate-800" />
        </div>
      </div>
    </div>
  );
}

export function BlockTxSkeletonLoader(): JSX.Element {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-4 bg-slate-800 rounded" />
            <div className="space-y-2">
              <div className="w-48 h-4 bg-slate-800 rounded" />
              <div className="w-32 h-3 bg-slate-800/60 rounded" />
            </div>
          </div>
          <div className="w-24 h-6 bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  );
}
