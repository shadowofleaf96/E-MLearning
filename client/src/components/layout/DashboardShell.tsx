'use client';

import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import TenantContextBanner from './TenantContextBanner';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { usePathname } from 'next/navigation';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const { user, refreshProfile } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || sessionStorage.getItem('token')
        : null;
    if (token && !user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  const isLearnWorkspace = pathname?.includes('/learn');
  const isLiveWorkspace = pathname?.includes('/live/');

  if (isLearnWorkspace || isLiveWorkspace) {
    return (
      <div className="h-screen bg-surface-bg text-on-surface font-body-md antialiased overflow-hidden flex flex-col w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-on-surface font-body-md antialiased overflow-hidden flex w-full">
      <React.Suspense fallback={<div className="w-[280px] hidden md:block" />}>
        <Sidebar />
      </React.Suspense>
      <div className="flex-1 flex flex-col md:ml-[280px] h-screen overflow-hidden">
        <React.Suspense fallback={null}>
          <TenantContextBanner />
        </React.Suspense>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-gutter bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
