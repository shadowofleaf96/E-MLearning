'use client';

import React, { useEffect } from 'react';
import { useCourses } from '../hooks/useCourses';
import CourseCard from './CourseCard';
import EmptyState from '@/components/shared/EmptyState';

export default function CourseList({
  fetchType = 'all',
}: {
  fetchType?: 'all' | 'enrolled';
}) {
  const { courses, loading, loadCourses, loadEnrolledCourses } = useCourses();

  useEffect(() => {
    if (fetchType === 'enrolled') {
      loadEnrolledCourses();
    } else {
      loadCourses();
    }
  }, [loadCourses, loadEnrolledCourses, fetchType]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-white/5 bg-zinc-900/30 p-4"
          >
            <div className="aspect-video rounded-xl bg-zinc-800" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-1/4 rounded bg-zinc-800" />
              <div className="h-6 w-3/4 rounded bg-zinc-800" />
              <div className="h-4 w-full rounded bg-zinc-800" />
              <div className="h-10 w-full rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No Courses Available"
        description="Check back later for new e-learning courses added to the platform."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
