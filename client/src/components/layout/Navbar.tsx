'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { GlobalSearchModal } from '../shared/GlobalSearchModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type Role =
  | 'guest'
  | 'student'
  | 'instructor'
  | 'admin'
  | 'tenant'
  | 'superadmin'
  | 'super_admin';

export default function Navbar({ role = 'guest' }: { role?: Role }) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { stats } = useAppSelector((state) => state.gamification);
  const { logout } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [searchOpen, setSearchOpen] = useState(false);

  const inferredRole: Role = (user?.role as Role) || role;
  const currentRole = inferredRole;
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <header className="sticky top-0 z-40 flex items-center justify-between px-margin-desktop h-16 w-full bg-surface border-b border-border-subtle shadow-sm">
        <div className="flex items-center gap-8 w-1/3">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-on-surface-variant hover:text-secondary transition-colors"
            onClick={() => dispatch(setSidebarOpen(true))}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {isAuthenticated && (
            <div
              onClick={() => setSearchOpen(true)}
              className="relative w-full max-w-md hidden lg:flex items-center bg-surface-container-low border border-border-subtle hover:border-secondary/40 rounded-lg py-2 pl-10 pr-3 cursor-pointer transition-all group"
            >
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-hover:text-secondary transition-colors">
                search
              </span>
              <span className="text-body-sm text-on-surface-variant/60 flex-1 select-none">
                {currentRole === 'instructor'
                  ? 'Search courses, students, reports...'
                  : 'Search courses, lessons, topics...'}
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-on-surface-variant bg-surface-container-high rounded border border-border-subtle">
                ⌘K
              </kbd>
            </div>
          )}
        </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        {isAuthenticated && currentRole === 'student' && (
          <>
            <div className="flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-full border border-secondary-fixed">
              <span
                className="material-symbols-outlined text-streak-orange text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="font-code-sm text-code-sm font-bold text-on-surface">
                {stats?.streak || 0}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-full border border-secondary-fixed">
              <span
                className="material-symbols-outlined text-xp-gold text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stars
              </span>
              <span className="font-code-sm text-code-sm font-bold text-on-surface">
                {stats?.xp?.toLocaleString() || 0} XP
              </span>
            </div>
            <div className="h-8 w-px bg-border-subtle mx-2 hidden sm:block"></div>
          </>
        )}

        {isAuthenticated && currentRole === 'instructor' && (
          <>
            <Link href={`/${locale}/instructor/live`}>
              <button className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full font-label-md hover:bg-secondary hover:text-white transition-all scale-95 active:scale-100 hidden sm:block">
                Go Live
              </button>
            </Link>
            <div className="h-8 w-px bg-border-subtle mx-2 hidden sm:block"></div>
          </>
        )}

        {isAuthenticated && (
          <button className="text-on-surface-variant hover:text-secondary transition-colors relative hidden sm:block">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
        )}

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center gap-3 ml-2">
              <div className="text-right hidden xl:block">
                <p className="font-label-md text-label-md text-on-surface leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">
                  {currentRole === 'instructor'
                    ? 'Premium Instructor'
                    : currentRole === 'admin'
                      ? 'Tenant Admin'
                      : currentRole === 'superadmin' ||
                          currentRole === 'super_admin'
                        ? 'Super Administrator'
                        : `Level ${stats?.level || 1} Student`}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary-container hover:ring-2 hover:ring-secondary transition-all bg-surface-container flex items-center justify-center cursor-pointer">
                {user?.avatar ? (
                  <Image
                    width={40}
                    height={40}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-full h-full object-cover"
                    src={user.avatar}
                  />
                ) : (
                  <span className="font-label-md text-on-surface font-bold">
                    {user?.firstName?.[0] || ''}
                    {user?.lastName?.[0] || ''}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-border-subtle bg-surface-container-lowest text-on-surface"
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-on-surface">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-on-surface-variant">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border-subtle" />
              <DropdownMenuItem
                className="text-error focus:bg-error-container focus:text-on-error-container cursor-pointer"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3 ml-2">
            <Link
              href="/student/login"
              className="px-4 py-2 text-secondary font-label-md hover:bg-surface-container-low rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/student/registration"
              className="px-4 py-2 bg-secondary text-on-secondary font-label-md rounded-lg hover:bg-secondary-container transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
