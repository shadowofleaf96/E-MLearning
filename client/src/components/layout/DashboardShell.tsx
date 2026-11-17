'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import TenantContextBanner from './TenantContextBanner';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const { user, refreshProfile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || sessionStorage.getItem('token')
        : null;

    const localePrefix = pathname?.match(/^\/(en|fr|ar)/)?.[0] || '/en';
    const pathWithoutLocale = pathname?.replace(/^\/(en|fr|ar)/, '') || '/';

    // 1. Missing Token Check
    if (!token) {
      let loginPath = '/student/login';
      if (pathWithoutLocale.startsWith('/instructor'))
        loginPath = '/instructor/login';
      if (pathWithoutLocale.startsWith('/admin')) loginPath = '/admin/login';
      if (pathWithoutLocale.startsWith('/super-admin'))
        loginPath = '/super-admin/login';

      router.replace(`${localePrefix}${loginPath}`);
      return;
    }

    // 2. Refresh Profile if user not loaded yet
    if (token && !user) {
      refreshProfile();
      return;
    }

    // 3. Role-based Route Protection
    if (user) {
      const roleDashboards: Record<string, string> = {
        student: '/student/dashboard',
        instructor: '/instructor/dashboard',
        admin: '/admin/dashboard',
        super_admin: '/super-admin/dashboard',
      };
      const defaultDashboard =
        roleDashboards[user.role] || '/student/dashboard';

      const isStudentPreviewRoute = pathWithoutLocale.match(
        /^\/student\/course\/[^/]+\/learn/
      );

      if (
        pathWithoutLocale.startsWith('/student') &&
        user.role !== 'student' &&
        !isStudentPreviewRoute
      ) {
        router.replace(`${localePrefix}${defaultDashboard}`);
        return;
      }
      if (
        pathWithoutLocale.startsWith('/instructor') &&
        user.role !== 'instructor'
      ) {
        router.replace(`${localePrefix}${defaultDashboard}`);
        return;
      }
      if (
        pathWithoutLocale.startsWith('/admin') &&
        user.role !== 'admin' &&
        user.role !== 'super_admin'
      ) {
        router.replace(`${localePrefix}${defaultDashboard}`);
        return;
      }
      if (
        pathWithoutLocale.startsWith('/super-admin') &&
        user.role !== 'super_admin'
      ) {
        router.replace(`${localePrefix}${defaultDashboard}`);
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, refreshProfile, pathname, router]);

  const isLearnWorkspace = pathname?.includes('/learn');
  const isLiveWorkspace = pathname?.includes('/live/');

  if (
    !isAuthorized &&
    typeof window !== 'undefined' &&
    !localStorage.getItem('token') &&
    !sessionStorage.getItem('token')
  ) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
