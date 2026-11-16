'use client';

import React from 'react';
import { Database, AlertTriangle, RefreshCcw } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4 antialiased">
      <div className="max-w-md w-full bg-surface-card border border-border-subtle rounded-3xl p-8 shadow-lg text-center">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
          <Database className="w-10 h-10" />
        </div>

        <h1 className="font-display-md text-3xl font-bold text-on-surface mb-3">
          System Maintenance
        </h1>

        <p className="text-on-surface-variant mb-8 text-base">
          We are currently unable to connect to the database. This could be due
          to scheduled maintenance or a temporary outage. Our engineers have
          been notified.
        </p>

        <div className="bg-surface-container-low rounded-2xl p-4 flex items-start gap-3 text-left mb-8">
          <AlertTriangle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-on-surface-variant">
            Your data is perfectly safe. Please try refreshing the page in a few
            minutes.
          </p>
        </div>

        <button
          onClick={() => (window.location.href = '/')}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again Now
        </button>
      </div>
    </div>
  );
}
