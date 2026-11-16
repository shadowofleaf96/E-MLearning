import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr', 'ar'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Locale Redirection
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/en${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // 2. Role-based Route Protection
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('user_role')?.value;

  // Extract path without locale for easier matching
  const pathWithoutLocale = pathname.replace(/^\/(en|fr|ar)/, '') || '/';

  // Define protected path prefixes
  const isStudentRoute = pathWithoutLocale.startsWith('/student');
  const isInstructorRoute = pathWithoutLocale.startsWith('/instructor');
  const isAdminRoute = pathWithoutLocale.startsWith('/admin');
  const isSuperAdminRoute = pathWithoutLocale.startsWith('/super-admin');

  const authRoutePaths = [
    '/login',
    '/registration',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/email-verified',
  ];

  const isAuthRoute =
    authRoutePaths.some((route) => pathWithoutLocale.includes(route)) ||
    pathWithoutLocale.includes('/alt-');

  // If attempting to access any protected area without a token, redirect to portal-specific login
  if (
    !isAuthRoute &&
    (isStudentRoute ||
      isInstructorRoute ||
      isAdminRoute ||
      isSuperAdminRoute) &&
    !token
  ) {
    const localePrefix = pathname.match(/^\/(en|fr|ar)/)?.[0] || '/en';

    let loginUrlPath = '/student/login';
    if (isInstructorRoute) loginUrlPath = '/instructor/login';
    if (isAdminRoute) loginUrlPath = '/admin/login';
    if (isSuperAdminRoute) loginUrlPath = '/super-admin/login';

    const loginUrl = new URL(`${localePrefix}${loginUrlPath}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in, enforce role restrictions (even for auth routes, which will then redirect to dashboard)
  if (token && role) {
    const localePrefix = pathname.match(/^\/(en|fr|ar)/)?.[0] || '/en';

    const roleDashboards: Record<string, string> = {
      student: '/student/dashboard',
      instructor: '/instructor/dashboard',
      admin: '/admin/dashboard',
      super_admin: '/super-admin/dashboard',
    };
    const defaultDashboard = roleDashboards[role] || '/student/dashboard';

    // Redirect logged-in users away from auth pages
    if (isAuthRoute) {
      return NextResponse.redirect(
        new URL(`${localePrefix}${defaultDashboard}`, request.url)
      );
    }

    // Allow any authenticated user to access /student/course/:id/learn (Preview mode)
    const isStudentPreviewRoute = pathWithoutLocale.match(
      /^\/student\/course\/[^/]+\/learn/
    );

    if (isStudentRoute && role !== 'student' && !isStudentPreviewRoute) {
      return NextResponse.redirect(
        new URL(`${localePrefix}${defaultDashboard}`, request.url)
      );
    }
    if (isInstructorRoute && role !== 'instructor') {
      return NextResponse.redirect(
        new URL(`${localePrefix}${defaultDashboard}`, request.url)
      );
    }
    if (isAdminRoute && role !== 'admin' && role !== 'super_admin') {
      return NextResponse.redirect(
        new URL(`${localePrefix}${defaultDashboard}`, request.url)
      );
    }
    if (isSuperAdminRoute && role !== 'super_admin') {
      return NextResponse.redirect(
        new URL(`${localePrefix}${defaultDashboard}`, request.url)
      );
    }
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|images/).*)',
  ],
};
