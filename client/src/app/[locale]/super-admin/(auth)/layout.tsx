import AuthLayout from '@/components/layout/AuthLayout';

export default function SuperAdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout
      title="Welcome to the Super Admin Portal"
      subtitle="Sign in to manage tenants, system settings, and oversee platform health."
    >
      {children}
    </AuthLayout>
  );
}
