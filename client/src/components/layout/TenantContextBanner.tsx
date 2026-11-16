'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import api from '@/services/api';
import { Eye, ArrowRightLeft, X } from 'lucide-react';

export default function TenantContextBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [tenantName, setTenantName] = useState<string>('');

  const tenantId = searchParams.get('tenantId');
  const locale = pathname.split('/')[1] || 'en';
  const isSuperAdmin =
    (user?.role as string) === 'super_admin' ||
    (user?.role as string) === 'superadmin';

  useEffect(() => {
    if (tenantId && isSuperAdmin) {
      // Fetch tenant details by ID
      api
        .get(`/super-admin/tenants/${tenantId}`)
        .then((res) => {
          if (res.data?.data?.name) {
            setTenantName(res.data.data.name);
          }
        })
        .catch(() => {
          setTenantName('Selected Institution');
        });
    } else if (isSuperAdmin && pathname.includes('/admin')) {
      setTenantName('Stanford University'); // Default demo context
    }
  }, [tenantId, isSuperAdmin, pathname]);

  if (!isSuperAdmin || (!tenantId && !pathname.includes('/admin'))) {
    return null;
  }

  const handleExit = () => {
    router.push(`/${locale}/super-admin/tenants`);
  };

  return (
    <div className="bg-secondary/10 border-b border-secondary/20 px-6 py-2.5 flex items-center justify-between text-sm font-medium text-on-surface animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shrink-0"></span>
        <Eye className="w-4 h-4 text-secondary shrink-0" />
        <span>
          Viewing Workspace:{' '}
          <strong className="font-bold text-secondary">
            {tenantName || 'Institution Workspace'}
          </strong>
        </span>
        <span className="hidden sm:inline text-xs bg-secondary/15 text-secondary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">
          Super Admin Mode
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 text-xs font-bold bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 text-on-surface px-3 py-1.5 rounded-lg transition-all shadow-xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-secondary" />
          <span>Switch Tenant</span>
        </button>
        <button
          onClick={handleExit}
          className="p-1 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors"
          title="Exit Tenant View"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
