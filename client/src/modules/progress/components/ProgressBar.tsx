'use client';

import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  percentage,
  showLabel = true,
}: ProgressBarProps) {
  const cappedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <span>Course Completion</span>
          <span className="text-emerald-400">{cappedPercentage}%</span>
        </div>
      )}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800 border border-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/20 transition-all duration-500 ease-out"
          style={{ width: `${cappedPercentage}%` }}
        />
      </div>
    </div>
  );
}
