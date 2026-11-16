import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to inject Tenant Subdomain or header dynamically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');

      // If subdomain exists (e.g. tenant.e-tactiques.com)
      if (parts.length > 2 && parts[0] !== 'www') {
        config.headers['X-Tenant-Slug'] = parts[0];
      }

      // Fallback check: localStorage
      const tenantSlug = localStorage.getItem('tenant_slug');
      if (tenantSlug) {
        config.headers['X-Tenant-Slug'] = tenantSlug;
      }

      // Check URL query parameters for tenantId (used for Super Admin inspection)
      const urlParams = new URLSearchParams(window.location.search);
      const urlTenantId = urlParams.get('tenantId');
      if (urlTenantId) {
        config.headers['X-Tenant-Id'] = urlTenantId;
      }

      // Authorization header if token exists
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth failures, token expirations globally
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        document.cookie =
          'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie =
          'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        // Prevent redirect loop if already on an auth page
        const path = window.location.pathname;
        const isAuthPage =
          path.includes('/login') ||
          path.includes('/registration') ||
          path.includes('/forgot') ||
          path.includes('/reset') ||
          path.includes('/alt-');

        // Only redirect if the user is on a protected dashboard route
        const isProtectedPage =
          path.includes('/student/') ||
          path.includes('/instructor/') ||
          path.includes('/admin/');

        if (isProtectedPage && !isAuthPage) {
          window.location.href = '/en/student/login';
        }
      }
    }

    // Handle database/server connection errors globally
    if (error.response && error.response.status === 500) {
      if (typeof window !== 'undefined') {
        const errorData = error.response.data;
        const errorMsg =
          typeof errorData === 'string'
            ? errorData.toLowerCase()
            : errorData?.message?.toLowerCase() || '';

        if (
          errorMsg.includes('database') ||
          errorMsg.includes('prisma') ||
          errorData?.code === 'DATABASE_ERROR' ||
          errorData?.code === 'INTERNAL_ERROR'
        ) {
          const path = window.location.pathname;
          if (!path.includes('/maintenance')) {
            window.location.href = '/en/maintenance';
            // Return an unresolved promise to stop execution of the failed request chain
            // and prevent the UI from rendering a broken state before the redirect happens
            return new Promise(() => {});
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
