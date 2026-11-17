'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTenant } from '@/components/providers/TenantProvider';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title = 'Welcome back to your center of excellence.',
  subtitle = 'Sign in to access your premium modules, pick up where you left off, and track your progress.',
}: AuthLayoutProps) {
  const { tenant } = useTenant();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || sessionStorage.getItem('token')
        : null;

    if (token && user) {
      const localePrefix = pathname?.match(/^\/(en|fr|ar)/)?.[0] || '/en';
      const roleDashboards: Record<string, string> = {
        student: '/student/dashboard',
        instructor: '/instructor/dashboard',
        admin: '/admin/dashboard',
        super_admin: '/super-admin/dashboard',
      };
      const defaultDashboard =
        roleDashboards[user.role] || '/student/dashboard';
      router.replace(`${localePrefix}${defaultDashboard}`);
    }
  }, [user, pathname, router]);

  const brandName = tenant?.name || 'Lumina Learning';
  const logo = tenant?.logoUrl || null;

  return (
    <div className="bg-surface-bg text-on-surface min-h-screen flex flex-col font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Header */}
      <header className="bg-surface-bg dark:bg-surface-bg flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 border-b border-border-subtle dark:border-outline-variant z-50 fixed top-0">
        <div className="flex items-center gap-2">
          {logo ? (
            <Image
              src={logo}
              alt={brandName}
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              unoptimized
            />
          ) : (
            <>
              <span
                className="material-symbols-outlined filled-icon text-secondary"
                style={{ fontSize: '28px' }}
              >
                school
              </span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                {brandName}
              </span>
            </>
          )}
        </div>
        <div>
          <Link
            href="/support"
            className="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-secondary dark:hover:text-secondary-fixed transition-colors hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </header>

      {/* Split Screen Auth Canvas */}
      <main className="grow flex w-full mt-[72px]">
        {/* Left Side: Dark Hero / Context (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary flex-col justify-between p-12 overflow-hidden">
          {/* Background Image */}
          <Image
            alt="Students studying together"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            fill
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40 pointer-events-none"></div>

          {/* Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <span className="material-symbols-outlined text-white fill text-3xl">
                menu_book
              </span>
              <span className="font-headline-md text-headline-md font-bold text-white">
                {brandName}
              </span>
            </div>
            <div className="max-w-md">
              <h1 className="font-display-lg text-display-lg text-white mb-6">
                {title}
              </h1>
              <p className="font-body-lg text-body-lg text-primary-fixed-dim">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Stats/Trust */}
          <div className="relative z-10 flex gap-8">
            <div>
              <div className="font-headline-md text-headline-md text-white mb-1">
                450+
              </div>
              <div className="font-body-sm text-body-sm text-primary-fixed-dim">
                Premium Modules
              </div>
            </div>
            <div className="w-px bg-primary-fixed-dim/30"></div>
            <div>
              <div className="font-headline-md text-headline-md text-white mb-1">
                99.9%
              </div>
              <div className="font-body-sm text-body-sm text-primary-fixed-dim">
                System Uptime
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between bg-surface-bg p-8 sm:p-12 md:p-16">
          <div className="w-full max-w-sm mx-auto grow flex flex-col justify-center">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-2 mb-12">
              <span className="material-symbols-outlined text-primary fill text-2xl">
                menu_book
              </span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                {brandName}
              </span>
            </div>

            {/* Content Injected Here */}
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-bg dark:bg-surface-bg w-full py-8 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border-subtle dark:border-outline-variant mt-auto">
        <div className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 opacity-50 grayscale">
          <span className="material-symbols-outlined filled-icon">school</span>
          <span className="text-sm font-semibold">{brandName}</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link
            href="/privacy"
            className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface-variant hover:text-secondary dark:hover:text-secondary-fixed hover:underline transition-all"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface-variant hover:text-secondary dark:hover:text-secondary-fixed hover:underline transition-all"
          >
            Terms of Service
          </Link>
          <Link
            href="/help"
            className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface-variant hover:text-secondary dark:hover:text-secondary-fixed hover:underline transition-all"
          >
            Help Center
          </Link>
        </nav>
        <div className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface-variant text-center md:text-right">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
