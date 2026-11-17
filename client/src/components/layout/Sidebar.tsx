'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import { useTenant } from '@/components/providers/TenantProvider';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsTenantId = searchParams.get('tenantId');
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { tenant } = useTenant();

  const role = user?.role || 'student';
  const brandName = tenant?.name || 'Lumina Learning';
  const logo = tenant?.logoUrl || null;

  const rolePaths: Record<string, string> = {
    student: '/student',
    instructor: '/instructor',
    admin: '/admin',
    super_admin: '/super-admin',
  };

  const prefix = rolePaths[role] || '';

  const getNavItems = (): NavItem[] => {
    // Check if Super Admin is inspecting a specific tenant or viewing any /admin route
    const tenantMatch = pathname.match(/\/super-admin\/tenants\/([^/]+)/);
    const inspectingTenantId = tenantMatch
      ? tenantMatch[1]
      : searchParamsTenantId;
    const isSuperAdminRole = role === 'super_admin';
    const isAdminRoute =
      pathname.includes('/admin/') ||
      pathname.endsWith('/admin') ||
      pathname.endsWith('/admin/dashboard');

    if (
      isSuperAdminRole &&
      (isAdminRoute || (inspectingTenantId && inspectingTenantId !== 'page'))
    ) {
      const targetTenantId =
        inspectingTenantId && inspectingTenantId !== 'page'
          ? inspectingTenantId
          : '';
      const querySuffix = targetTenantId ? `?tenantId=${targetTenantId}` : '';
      const tenantOverviewHref = targetTenantId
        ? `/super-admin/tenants/${targetTenantId}`
        : `/admin/dashboard${querySuffix}`;

      return [
        {
          label: '⬅ Exit to Super Admin',
          href: '/super-admin/tenants',
          icon: 'arrow_back',
        },
        {
          label: 'Tenant Details',
          href: tenantOverviewHref,
          icon: 'info',
        },
        {
          label: 'Tenant Dashboard',
          href: `/admin/dashboard${querySuffix}`,
          icon: 'dashboard',
        },
        {
          label: 'Courses',
          href: `/admin/courses${querySuffix}`,
          icon: 'school',
        },
        {
          label: 'Categories & Tags',
          href: `/admin/categories${querySuffix}`,
          icon: 'category',
        },
        {
          label: 'Moderation',
          href: `/admin/moderation${querySuffix}`,
          icon: 'gavel',
        },
        { label: 'Users', href: `/admin/users${querySuffix}`, icon: 'group' },
        {
          label: 'Payments & Payouts',
          href: `/admin/payments${querySuffix}`,
          icon: 'payments',
        },
        {
          label: 'Analytics',
          href: `/admin/analytics${querySuffix}`,
          icon: 'analytics',
        },
        {
          label: 'Branding',
          href: `/admin/branding${querySuffix}`,
          icon: 'palette',
        },
        {
          label: 'Notifications',
          href: `/admin/notifications-management${querySuffix}`,
          icon: 'notifications',
        },
        {
          label: 'Billing',
          href: `/admin/billing${querySuffix}`,
          icon: 'receipt_long',
        },
        {
          label: 'Settings',
          href: `/admin/settings${querySuffix}`,
          icon: 'settings',
        },
      ];
    }

    switch (role) {
      case 'super_admin':
        return [
          {
            label: 'Dashboard',
            href: `${prefix}/dashboard`,
            icon: 'dashboard',
          },
          { label: 'Tenants', href: `${prefix}/tenants`, icon: 'domain' },
          {
            label: 'Platform Users',
            href: `${prefix}/platform-users`,
            icon: 'group',
          },
          {
            label: 'Analytics',
            href: `${prefix}/analytics`,
            icon: 'analytics',
          },
          { label: 'Plans', href: `${prefix}/plans`, icon: 'view_list' },
          { label: 'Security', href: `${prefix}/security`, icon: 'security' },
          { label: 'Settings', href: `${prefix}/settings`, icon: 'settings' },
        ];
      case 'admin':
        return [
          {
            label: 'Dashboard',
            href: `${prefix}/dashboard`,
            icon: 'dashboard',
          },
          { label: 'Courses', href: `${prefix}/courses`, icon: 'school' },
          {
            label: 'Categories & Tags',
            href: `${prefix}/categories`,
            icon: 'category',
          },
          { label: 'Moderation', href: `${prefix}/moderation`, icon: 'gavel' },
          { label: 'Users', href: `${prefix}/users`, icon: 'group' },
          {
            label: 'Payments & Payouts',
            href: `${prefix}/payments`,
            icon: 'payments',
          },
          {
            label: 'Analytics',
            href: `${prefix}/analytics`,
            icon: 'analytics',
          },
          { label: 'Reports', href: `${prefix}/reports`, icon: 'assessment' },
          { label: 'Branding', href: `${prefix}/branding`, icon: 'palette' },
          {
            label: 'Content Branding',
            href: `${prefix}/content-branding`,
            icon: 'brush',
          },
          {
            label: 'Notifications',
            href: `${prefix}/notifications-management`,
            icon: 'notifications',
          },
          { label: 'Billing', href: `${prefix}/billing`, icon: 'receipt_long' },
          { label: 'Settings', href: `${prefix}/settings`, icon: 'settings' },
        ];
      case 'instructor':
        return [
          {
            label: 'Dashboard',
            href: `${prefix}/dashboard`,
            icon: 'dashboard',
          },
          {
            label: 'Course Builder',
            href: `${prefix}/courses`,
            icon: 'architecture',
          },
          {
            label: 'Learning Paths',
            href: `${prefix}/learning-paths`,
            icon: 'alt_route',
          },
          { label: 'Exams', href: `${prefix}/exams`, icon: 'quiz' },
          {
            label: 'Student Analytics',
            href: `${prefix}/students`,
            icon: 'analytics',
          },
          {
            label: 'Live Sessions',
            href: `${prefix}/live`,
            icon: 'video_call',
          },
          { label: 'Messages', href: `${prefix}/messages`, icon: 'chat' },
          { label: 'Earnings', href: `${prefix}/earnings`, icon: 'payments' },
          {
            label: 'Profile Settings',
            href: `${prefix}/settings`,
            icon: 'settings',
          },
        ];
      case 'student':
      default:
        return [
          {
            label: 'Dashboard',
            href: `${prefix}/dashboard`,
            icon: 'dashboard',
          },
          { label: 'My Courses', href: `${prefix}/my-courses`, icon: 'school' },
          {
            label: 'Learning Paths',
            href: `${prefix}/learning-paths`,
            icon: 'alt_route',
          },
          {
            label: 'Achievements',
            href: `${prefix}/achievements`,
            icon: 'emoji_events',
          },
          {
            label: 'Progress',
            href: `${prefix}/progress`,
            icon: 'trending_up',
          },
          {
            label: 'Certificates',
            href: `${prefix}/certificates`,
            icon: 'workspace_premium',
          },
          {
            label: 'Messages',
            href: `${prefix}/messages`,
            icon: 'chat',
          },
          ...(user?.tenant?.isInstitution
            ? []
            : [
                {
                  label: 'Billing',
                  href: `${prefix}/billing`,
                  icon: 'receipt_long',
                },
              ]),
          {
            label: 'Profile',
            href: `${prefix}/profile`,
            icon: 'person',
          },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-70 bg-surface-container-lowest border-r border-border-subtle flex flex-col py-10 z-50 transition-transform duration-300 md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="px-8 mb-10">
          {logo ? (
            <Image
              src={logo}
              alt={brandName}
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              unoptimized
            />
          ) : (
            <>
              <h1 className="font-display-lg text-2xl font-extrabold text-on-surface tracking-tight">
                {brandName.split(' ')[0]}
              </h1>
              <p className="font-label-md text-secondary font-bold uppercase tracking-widest text-[10px] mt-1">
                {brandName.split(' ').slice(1).join(' ') || 'Learning System'}
              </p>
            </>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const basePath = item.href.split('?')[0];
            const isActive =
              pathname.endsWith(basePath) || pathname.includes(`${basePath}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 transition-all duration-200 group',
                  isActive
                    ? 'text-secondary font-bold border-l-4 border-secondary bg-secondary-container/10 rounded-r-lg'
                    : 'text-on-surface-variant font-body-md hover:bg-surface-container-low rounded-lg'
                )}
              >
                <span
                  className={cn(
                    'material-symbols-outlined transition-colors',
                    isActive ? 'text-secondary' : 'group-hover:text-secondary'
                  )}
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA Widgets */}
        <div className="px-4 mt-auto">
          {role === 'student' && (
            <>
              {!user?.tenant?.isInstitution &&
                user?.subscriptionStatus !== 'active' && (
                  <div className="mx-4 p-5 bg-white rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-xp-gold">
                        stars
                      </span>
                      <p className="font-label-md text-on-surface">
                        Pro Member
                      </p>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mb-4">
                      Unlock advanced architecture tracks and expert
                      certifications.
                    </p>
                    <Link href={`${prefix}/billing`}>
                      <button className="w-full py-2.5 bg-secondary text-on-secondary font-bold rounded-xl text-xs hover:opacity-90 transition-opacity">
                        Upgrade Now
                      </button>
                    </Link>
                  </div>
                )}
              <a
                href="mailto:support@e-tactiques.com"
                className="flex items-center gap-3 px-8 py-4 text-on-surface-variant font-body-md hover:text-secondary transition-colors duration-200"
              >
                <span className="material-symbols-outlined">help</span>
                Help Center
              </a>
            </>
          )}

          {role === 'instructor' && (
            <div className="px-2 pt-4 border-t border-border-subtle">
              <Link
                href={`${prefix}/courses/new`}
                onClick={() => dispatch(setSidebarOpen(false))}
              >
                <button className="w-full bg-secondary text-on-secondary font-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '20px' }}
                  >
                    add
                  </span>
                  Create New Course
                </button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
