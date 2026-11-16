'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CourseModulesSyllabusPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Course Syllabus & Modules
          </h1>
          <p className="mt-2 text-zinc-400">
            Organize teaching segments and lessons for course ID: {courseId}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/instructor/courses')}
          className="border-white/10 text-zinc-300 hover:text-white"
        >
          Back to List
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-6 text-center text-zinc-400">
        No modules created yet. Add your first section modules.
      </div>
    </div>
  );
}
