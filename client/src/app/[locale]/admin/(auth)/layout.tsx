import AuthLayout from '@/components/layout/AuthLayout';

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout
      title="Welcome to the Tenant Admin Portal"
      subtitle="Sign in to configure your platform, manage users, and view analytics."
    >
      {children}
    </AuthLayout>
  );
}
