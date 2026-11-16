import { redirect } from 'next/navigation';

export default async function StudentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  redirect(`/${resolvedParams.locale}/student/dashboard`);
}
