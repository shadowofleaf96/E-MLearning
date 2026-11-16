'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourses } from '@/modules/courses/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentCourseDetailPage() {
  const params = useParams() as { courseId: string; locale: string };
  const { currentCourse, loading, loadCourseDetail } = useCourses();
  const router = useRouter();
  const courseId = params?.courseId;

  useEffect(() => {
    if (params?.courseId) {
      loadCourseDetail(params.courseId);
    }
  }, [params?.courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-on-surface-variant">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!currentCourse) {
    return <div className="text-zinc-400">Course not found.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          {currentCourse.title}
        </h1>
        <p className="mt-2 text-zinc-400">{currentCourse.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-white/10 bg-zinc-900/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Course Syllabus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-zinc-300">
            {currentCourse.modules && currentCourse.modules.length > 0 ? (
              currentCourse.modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-zinc-950/40 border border-white/5"
                >
                  <span>
                    {idx + 1}. {mod.title}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {mod.isLocked ? 'Locked' : 'Available'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500">No modules uploaded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-3xl font-bold text-emerald-400">
              0% Complete
            </div>
            <Button
              onClick={() => router.push(`/student/course/${courseId}/learn`)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-6"
            >
              Start Course
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
