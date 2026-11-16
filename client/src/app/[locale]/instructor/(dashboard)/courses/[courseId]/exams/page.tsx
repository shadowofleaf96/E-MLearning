'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function CourseExamsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Course Exams & Quizzes
        </h1>
        <p className="mt-2 text-zinc-400">
          Manage exams, questions, and coding exercises for course ID:{' '}
          {courseId}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-6 text-zinc-400">
        No exams created for this course. Configure a QCM or coding test case
        exam.
      </div>
    </div>
  );
}
