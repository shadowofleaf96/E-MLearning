'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  themeConfig: {
    primaryColor: string;
    secondaryColor: string;
  } | null;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  error: null,
});

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const domain = window.location.hostname;
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/tenants/resolve?domain=${domain}`
        );

        const data = res.data.data;
        setTenant(data);

        // Inject dynamic CSS variables if tenant has themeConfig
        if (data.themeConfig) {
          const root = document.documentElement;
          if (data.themeConfig.primaryColor) {
            root.style.setProperty(
              '--color-primary',
              data.themeConfig.primaryColor
            );
          }
          if (data.themeConfig.secondaryColor) {
            root.style.setProperty(
              '--color-secondary',
              data.themeConfig.secondaryColor
            );
          }
        }
      } catch (err) {
        console.error('Failed to resolve tenant:', err);
        setError('Failed to load tenant configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};
