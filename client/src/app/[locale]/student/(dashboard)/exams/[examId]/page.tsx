'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ExamViewer from '@/modules/exams/components/ExamViewer';

export default function StudentExamPage() {
  const params = useParams();
  const examId = params.examId as string;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Course Assessment
        </h1>
        <p className="mt-2 text-zinc-400">
          Complete the exam questions and code challenges to unlock your
          certificate.
        </p>
      </div>
      <ExamViewer examId={examId} />
    </div>
  );
}
