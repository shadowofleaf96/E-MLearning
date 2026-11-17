'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  learningPathsService,
  LearningPath,
} from '@/modules/learning-paths/services/learningPaths.service';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Layers,
  Sparkles,
  Award,
  PlayCircle,
} from 'lucide-react';

export default function StudentLearningPathDetailPage() {
  const params = useParams();
  const pathId = params.pathId as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchPath = async () => {
    setLoading(true);
    try {
      const res = await learningPathsService.getPathById(pathId);
      setPath(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathId) {
      fetchPath();
    }
  }, [pathId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setMessage(null);
    try {
      await learningPathsService.enrollPath(pathId);
      setMessage({
        type: 'success',
        text: 'Enrolled in learning path successfully! All courses unlocked.',
      });
      await fetchPath();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text:
          err?.response?.data?.message || 'Failed to enroll in learning path.',
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="text-center py-16 space-y-4">
        <Layers className="w-12 h-12 text-on-surface-variant mx-auto opacity-40" />
        <h2 className="text-xl font-bold text-on-surface">
          Learning Path Not Found
        </h2>
        <Link
          href="/student/learning-paths"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Learning Paths
        </Link>
      </div>
    );
  }

  const progress = path.progress;
  const isEnrolled = path.isEnrolled;
  const courses = path.courses || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          href="/student/learning-paths"
          className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Learning Paths
        </Link>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-surface-container p-6 md:p-8 border border-border-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary">
                <BookOpen className="w-3.5 h-3.5" />
                Structured Learning Path
              </span>
              <span className="text-xs text-on-surface-variant">
                {courses.length} sequential courses
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
              {path.title}
            </h1>

            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              {path.description ||
                'Master this domain curriculum designed to take you from foundational principles to applied mastery.'}
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-on-surface-variant">
              <span>
                Curated by{' '}
                <strong className="text-on-surface">
                  {path.instructor?.firstName} {path.instructor?.lastName}
                </strong>
              </span>
            </div>
          </div>

          <div className="bg-surface-bg p-6 rounded-2xl border border-border-subtle shrink-0 md:w-72 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                Bundle Price
              </span>
              <span className="text-xl font-bold text-on-surface">
                {Number(path.price) === 0
                  ? 'Free'
                  : `$${Number(path.price).toFixed(2)}`}
              </span>
            </div>

            {isEnrolled ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enrolled & Active</span>
                </div>
                {progress && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs text-on-surface-variant">
                      <span>Completion</span>
                      <span className="font-semibold">
                        {progress.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {enrolling ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Enroll in Full Bundle
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-xs underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sequential Roadmap Tree */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">
            Curriculum Roadmap
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Follow the sequential path below. Each milestone builds on the
            previous one.
          </p>
        </div>

        <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-border-subtle">
          {courses.map((item, idx) => {
            const course = item.course;
            const progressItem = progress?.courses?.find(
              (c) => c.courseId === course.id
            );
            const isCompleted = progressItem?.isCompleted ?? false;
            const isStarted = (progressItem?.progressPercentage ?? 0) > 0;

            return (
              <div key={item.id} className="relative group">
                {/* Milestone Node Bullet */}
                <div
                  className={`absolute -left-6 md:-left-8 top-6 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isStarted
                        ? 'bg-primary border-primary text-white'
                        : 'bg-surface-bg border-border-subtle text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Course Card */}
                <div className="bg-surface-bg rounded-2xl border border-border-subtle p-5 md:p-6 hover:border-primary/40 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {course.thumbnail ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-7 h-7 text-primary/60" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          Stage {idx + 1}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-on-surface">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-xs text-on-surface-variant line-clamp-2 max-w-xl">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                    <Link
                      href={`/student/learn/${course.id}`}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 ${
                        isCompleted
                          ? 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          : 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      {isCompleted
                        ? 'Review Course'
                        : isStarted
                          ? 'Resume Learning'
                          : 'Start Course'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final Milestone: Path Certificate */}
          <div className="relative">
            <div
              className={`absolute -left-6 md:-left-8 top-6 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                progress?.isCompleted
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-surface-bg border-border-subtle text-on-surface-variant'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 via-primary/5 to-transparent rounded-2xl border border-amber-500/20 p-5 md:p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">
                    Learning Path Mastery Certificate
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Complete all {courses.length} courses in sequence to unlock
                    your verified credential.
                  </p>
                </div>
              </div>

              {progress?.isCompleted && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 text-white shadow-sm shrink-0">
                  Unlocked! 🎉
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
