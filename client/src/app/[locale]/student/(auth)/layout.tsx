import AuthLayout from '@/components/layout/AuthLayout';

export default function StudentAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout
      title="Welcome to the Student Portal"
      subtitle="Sign in to access your courses, pick up where you left off, and track your progress."
    >
      {children}
    </AuthLayout>
  );
}
