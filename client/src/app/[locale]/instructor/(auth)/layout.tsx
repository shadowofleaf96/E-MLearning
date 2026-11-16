import AuthLayout from '@/components/layout/AuthLayout';

export default function InstructorAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout
      title="Welcome to the Instructor Portal"
      subtitle="Sign in to manage your courses, view analytics, and grade students."
    >
      {children}
    </AuthLayout>
  );
}
