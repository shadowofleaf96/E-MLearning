'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  LayoutDashboard,
  User,
  LogOut,
  BookOpen,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Courses', href: '/courses' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'About', href: '/about' },
];

export default function GuestNavbar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { logout, refreshProfile } = useAuth();

  useEffect(() => {
    if (
      !isAuthenticated &&
      typeof window !== 'undefined' &&
      (localStorage.getItem('token') || sessionStorage.getItem('token'))
    ) {
      refreshProfile();
    }
  }, [isAuthenticated, refreshProfile]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === `/${locale}` || pathname === '/';
    return pathname?.includes(href.replace('/', ''));
  };

  const getDashboardHref = () => {
    if (!user) return `/${locale}/student/dashboard`;
    const role = user.role;
    if (role === 'instructor') return `/${locale}/instructor/dashboard`;
    if (role === 'admin') return `/${locale}/admin/dashboard`;
    if (role === 'super_admin') return `/${locale}/super-admin/dashboard`;
    return `/${locale}/student/dashboard`;
  };

  const dashboardHref = getDashboardHref();

  return (
    <nav className="bg-surface dark:bg-inverse-surface border-b border-border-subtle dark:border-outline-variant sticky top-0 w-full z-50 shadow-xs">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-container-max mx-auto h-[72px]">
        {/* Brand */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-2xl font-bold font-headline-md text-on-surface dark:text-inverse-on-surface tracking-tight shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-secondary text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Lumina Learning</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
          {NAV_LINKS.map(({ label, href }) => {
            const localizedHref = `/${locale}${href}`;
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={localizedHref}
                className={
                  active
                    ? 'text-secondary dark:text-secondary-fixed-dim font-bold border-b-2 border-secondary font-body-md text-base py-2 transition-colors'
                    : 'text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-base py-2'
                }
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                href={dashboardHref}
                className="hidden sm:inline-flex items-center gap-2 bg-secondary/15 text-secondary hover:bg-secondary/20 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 outline-none cursor-pointer group">
                  {user.avatar ? (
                    <Image
                      width={38}
                      height={38}
                      alt={user.firstName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-secondary group-hover:scale-105 transition-transform shadow-sm"
                      src={user.avatar}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {user.firstName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface transition-transform" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-surface-card border border-border-subtle shadow-xl rounded-2xl p-2 z-50"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <p className="font-bold text-sm text-on-surface truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate font-normal">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                      {user.role?.replace('_', ' ')}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border-subtle my-1" />

                  <DropdownMenuItem asChild>
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-secondary" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {user.role === 'student' && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/student/my-courses`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-secondary" />
                        <span>My Courses</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/${user.role === 'student' ? 'student' : user.role === 'instructor' ? 'instructor' : 'admin'}/settings`}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors"
                    >
                      <User className="w-4 h-4 text-on-surface-variant" />
                      <span>Profile & Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border-subtle my-1" />

                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-error hover:bg-error/10 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href={`/${locale}/student/login`}
                className="hidden md:block font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors font-bold px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href={`/${locale}/student/registration`}
                className="bg-secondary text-white font-label-md text-sm font-bold px-4 py-2 rounded-xl hover:bg-secondary/90 active:scale-95 transition-all shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-on-surface-variant hover:text-secondary transition-colors ml-1 p-1"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-surface px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ label, href }) => {
            const localizedHref = `/${locale}${href}`;
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={localizedHref}
                onClick={() => setMenuOpen(false)}
                className={
                  active
                    ? 'text-secondary font-bold font-body-md py-2 px-3 rounded-xl bg-secondary/10'
                    : 'text-on-surface-variant font-body-md py-2 px-3 rounded-xl hover:bg-surface-container-low transition-colors'
                }
              >
                {label}
              </Link>
            );
          })}
          <div className="border-t border-border-subtle mt-2 pt-2 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMenuOpen(false)}
                  className="bg-secondary text-white font-label-md text-sm font-bold py-2.5 px-4 rounded-xl text-center shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="text-error font-body-md py-2 px-3 text-left rounded-xl hover:bg-error/10 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/student/login`}
                  onClick={() => setMenuOpen(false)}
                  className="text-on-surface-variant font-body-md py-2 px-3 rounded-xl hover:bg-surface-container-low transition-colors font-bold"
                >
                  Sign In
                </Link>
                <Link
                  href={`/${locale}/student/registration`}
                  onClick={() => setMenuOpen(false)}
                  className="bg-secondary text-white font-label-md text-sm font-bold py-2.5 px-4 rounded-xl text-center hover:bg-secondary/90 transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
