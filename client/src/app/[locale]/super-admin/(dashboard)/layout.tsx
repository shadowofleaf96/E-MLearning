import React from 'react';
import DashboardShell from '@/components/layout/DashboardShell';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
