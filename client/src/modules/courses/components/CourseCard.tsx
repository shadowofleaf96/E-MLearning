'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/types/course.types';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-4 transition-all duration-300 hover:border-emerald-500/30 hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-emerald-950/20">
      {/* Thumbnail placeholder with micro-gradient backdrop */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:scale-105 transition-transform duration-500">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            {course.price === 0 ? 'Free' : `${course.price} MAD`}
          </span>
        </div>

        <h3 className="line-clamp-1 font-bold text-white group-hover:text-emerald-400 transition-colors">
          {course.title}
        </h3>

        <p className="line-clamp-2 text-xs text-zinc-500 leading-relaxed">
          {course.description || 'No description provided for this course.'}
        </p>

        <div className="mt-2 flex gap-2">
          <Button
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 hover:text-white transition-all text-xs font-medium"
            asChild
          >
            <Link href={`/courses/${course.id}`}>Details</Link>
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold"
            asChild
          >
            <Link href={`/course/${course.id}/learn`}>Learn</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
