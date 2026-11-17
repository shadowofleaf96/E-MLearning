'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  learningPathsService,
  LearningPath,
} from '@/modules/learning-paths/services/learningPaths.service';
import {
  Compass,
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function StudentLearningPathsPage() {
  const [activeTab, setActiveTab] = useState<'enrolled' | 'browse'>('enrolled');
  const [enrolledPaths, setEnrolledPaths] = useState<LearningPath[]>([]);
  const [allPaths, setAllPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrolledRes, allRes] = await Promise.all([
        learningPathsService.getEnrolledPaths().catch(() => ({ data: [] })),
        learningPathsService
          .getPaths({ isPublished: true })
          .catch(() => ({ data: [] })),
      ]);
      setEnrolledPaths(enrolledRes.data || []);
      setAllPaths(allRes.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (pathId: string) => {
    setEnrollingId(pathId);
    setMessage(null);
    try {
      await learningPathsService.enrollPath(pathId);
      setMessage({
        type: 'success',
        text: 'Enrolled in learning path successfully! All bundled courses are now available.',
      });
      await fetchData();
      setActiveTab('enrolled');
    } catch (err: any) {
      setMessage({
        type: 'error',
        text:
          err?.response?.data?.message || 'Failed to enroll in learning path.',
      });
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredPaths = allPaths.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent p-6 md:p-8 border border-border-subtle">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1">
              <Compass className="w-4 h-4" />
              <span>Curated Learning Sequences</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
              Learning Paths & Bundles
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base mt-1 max-w-2xl">
              Master complex domains step-by-step with structured sequences of
              courses designed by expert instructors.
            </p>
          </div>

          <div className="flex items-center bg-surface-bg/80 backdrop-blur-sm p-1 rounded-xl border border-border-subtle self-start md:self-auto">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'enrolled'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              My Paths ({enrolledPaths.length})
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'browse'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Explore Paths ({allPaths.length})
            </button>
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
            className="text-xs underline ml-4 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === 'enrolled' ? (
        /* Enrolled Paths Tab */
        <div className="space-y-6">
          {enrolledPaths.length === 0 ? (
            <div className="text-center py-16 bg-surface-bg rounded-2xl border border-border-subtle p-8">
              <Layers className="w-12 h-12 text-on-surface-variant mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-semibold text-on-surface mb-2">
                No Active Learning Paths
              </h3>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
                You haven&apos;t enrolled in any learning path sequences yet.
                Explore curated paths to level up your expertise.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Browse Paths Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledPaths.map((item: any) => {
                const path = item.learningPath || item;
                const progressPct = item.progressPercentage ?? 0;
                const completedCount = item.completedCourses ?? 0;
                const totalCount =
                  item.totalCourses ?? path.courses?.length ?? 0;

                return (
                  <div
                    key={path.id}
                    className="bg-surface-bg rounded-2xl border border-border-subtle overflow-hidden flex flex-col hover:border-primary/40 transition-all shadow-sm"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
                            <BookOpen className="w-3 h-3" />
                            {totalCount} Courses in Sequence
                          </span>
                          <h3 className="text-lg font-bold text-on-surface hover:text-primary transition-colors">
                            <Link href={`/student/learning-paths/${path.id}`}>
                              {path.title}
                            </Link>
                          </h3>
                        </div>
                        {progressPct === 100 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            <Clock className="w-3.5 h-3.5" /> In Progress
                          </span>
                        )}
                      </div>

                      {path.description && (
                        <p className="text-sm text-on-surface-variant line-clamp-2 mb-6">
                          {path.description}
                        </p>
                      )}

                      {/* Progress Bar */}
                      <div className="mt-auto space-y-2 mb-6">
                        <div className="flex justify-between text-xs text-on-surface-variant">
                          <span>Overall Path Progress</span>
                          <span className="font-semibold text-on-surface">
                            {completedCount} of {totalCount} completed (
                            {progressPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Course Sequence Timeline Preview */}
                      <div className="border-t border-border-subtle pt-4 space-y-2 mb-6">
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                          Course Milestones
                        </p>
                        {path.courses
                          ?.slice(0, 3)
                          .map((ci: any, idx: number) => (
                            <div
                              key={ci.id || idx}
                              className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-container/50"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
                                  {idx + 1}
                                </span>
                                <span className="truncate text-on-surface font-medium">
                                  {ci.course?.title}
                                </span>
                              </div>
                              <Link
                                href={`/student/learn/${ci.course?.id}`}
                                className="text-primary hover:underline font-semibold ml-2 shrink-0 flex items-center gap-1"
                              >
                                Open <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          ))}
                        {path.courses && path.courses.length > 3 && (
                          <p className="text-[11px] text-on-surface-variant text-center pt-1">
                            +{path.courses.length - 3} more courses in path
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-on-surface-variant">
                          By {path.instructor?.firstName}{' '}
                          {path.instructor?.lastName}
                        </span>
                        <Link
                          href={`/student/learning-paths/${path.id}`}
                          className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                        >
                          View Full Roadmap{' '}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Explore / Browse Paths Tab */
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-surface-bg p-3 rounded-2xl border border-border-subtle">
            <Search className="w-5 h-5 text-on-surface-variant ml-2" />
            <input
              type="text"
              placeholder="Search learning paths by topic, role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => {
              const isAlreadyEnrolled = enrolledPaths.some(
                (ep: any) => (ep.learningPathId || ep.id) === path.id
              );

              return (
                <div
                  key={path.id}
                  className="bg-surface-bg rounded-2xl border border-border-subtle overflow-hidden flex flex-col hover:border-primary/40 transition-all shadow-sm"
                >
                  {path.thumbnail ? (
                    <div className="relative h-44 w-full bg-surface-container">
                      <Image
                        src={path.thumbnail}
                        alt={path.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-36 w-full bg-gradient-to-br from-primary/15 via-secondary/10 to-primary/5 flex items-center justify-center">
                      <Layers className="w-12 h-12 text-primary/40" />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {path.courses?.length || 0} Courses Bundle
                      </span>
                      <span className="text-xs font-bold text-on-surface">
                        {Number(path.price) === 0
                          ? 'Free'
                          : `$${Number(path.price).toFixed(2)}`}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-on-surface mb-2">
                      {path.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">
                      {path.description ||
                        'Comprehensive step-by-step curriculum to achieve domain mastery.'}
                    </p>

                    {/* Sequential Courses List Preview */}
                    <div className="space-y-1.5 mb-6 mt-auto">
                      <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Sequence Blueprint
                      </p>
                      {path.courses?.slice(0, 3).map((ci, idx) => (
                        <div
                          key={ci.id}
                          className="flex items-center gap-2 text-xs text-on-surface py-1 border-b border-border-subtle/50"
                        >
                          <span className="w-4 h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate">{ci.course.title}</span>
                        </div>
                      ))}
                      {path.courses && path.courses.length > 3 && (
                        <p className="text-[10px] text-on-surface-variant italic pt-0.5">
                          +{path.courses.length - 3} additional courses included
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      {isAlreadyEnrolled ? (
                        <Link
                          href={`/student/learning-paths/${path.id}`}
                          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-center transition-all inline-flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> Continue Path
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(path.id)}
                          disabled={enrollingId === path.id}
                          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          {enrollingId === path.id ? (
                            <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              Enroll in Entire Bundle
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
