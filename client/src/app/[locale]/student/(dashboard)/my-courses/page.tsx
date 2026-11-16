'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  PlayCircle,
  BookOpen,
  ArrowRight,
  CheckCircle,
  BadgeCheck,
  Award,
  Zap,
  Rocket,
  Compass,
  Search,
} from 'lucide-react';
import { useStudentCourses } from '@/modules/courses/hooks/useStudentCourses';
import { bookmarksService } from '@/modules/bookmarks/services/bookmarks.service';

export default function MyCoursesPage() {
  const { data: courses, isLoading } = useStudentCourses();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedCourses, setBookmarkedCourses] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  React.useEffect(() => {
    if (filter === 'Wishlist') {
      setLoadingBookmarks(true);
      bookmarksService
        .getBookmarks()
        .then((res) => {
          if (res?.data) {
            setBookmarkedCourses(res.data);
          }
        })
        .finally(() => setLoadingBookmarks(false));
    }
  }, [filter]);

  const activeList = filter === 'Wishlist' ? bookmarkedCourses : courses;

  const filteredCourses =
    activeList?.filter((course) => {
      // Search query match
      if (
        searchQuery &&
        !course.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Filter match
      if (filter === 'In Progress') {
        return course.progress && course.progress > 0 && course.progress < 100;
      }
      if (filter === 'Completed') {
        return course.progress === 100;
      }
      return true;
    }) || [];

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed space-y-12 pb-12">
      {/* Page Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
              My Courses
            </h2>
            <p className="text-on-surface-variant font-body-md">
              You have {courses?.length || 0} active courses in your learning
              library.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border border-border-subtle bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-full sm:w-64"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'In Progress', 'Completed', 'Wishlist'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full font-bold text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${
                    filter === f
                      ? 'bg-secondary text-white hover:bg-secondary/90'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {isLoading || (filter === 'Wishlist' && loadingBookmarks) ? (
          // Loading skeletons
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-80 bg-surface-container animate-pulse rounded-2xl"
              ></div>
            ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-surface-card rounded-2xl border border-border-subtle overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-surface-container-low">
                {course.thumbnail && (
                  <Image
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={course.title}
                    src={course.thumbnail}
                  />
                )}
                {course.progress === 100 ? (
                  <div className="absolute bottom-4 right-4 bg-on-tertiary-container backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-2 border border-white/20">
                    <CheckCircle className="text-white w-4 h-4" />
                    <span className="text-xs font-bold text-white">100%</span>
                  </div>
                ) : (
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-2 border border-white/20">
                    <PlayCircle className="text-secondary w-4 h-4 fill-current" />
                    <span className="text-xs font-bold text-on-surface">
                      {course.progress || 0}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-primary-container rounded flex items-center justify-center overflow-hidden">
                    <span className="text-[8px] font-bold text-white">INS</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter line-clamp-1">
                    {course.instructor
                      ? `${course.instructor.firstName} ${course.instructor.lastName}`
                      : 'TBA'}
                  </span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-4 group-hover:text-secondary transition-colors line-clamp-2">
                  <Link href={`/student/course/${course.id}/learn`}>
                    {course.title}
                  </Link>
                </h3>
                <div className="mt-auto">
                  <div className="w-full bg-surface-container-low h-2 rounded-full mb-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-on-tertiary-container' : 'bg-secondary'}`}
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>

                  {course.progress === 100 ? (
                    <>
                      <div className="flex items-center justify-between text-xs text-on-surface-variant mb-6">
                        <div className="flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4 text-on-tertiary-container" />
                          <span className="text-on-tertiary-container font-semibold">
                            Completed
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/student/certificates`}
                        className="w-full bg-surface-container text-on-surface-variant font-bold py-3 rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 border border-border-subtle focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                      >
                        View Certificate
                        <Award className="w-5 h-5" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs text-on-surface-variant mb-6">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>Continue learning</span>
                        </div>
                      </div>
                      <Link
                        href={`/student/course/${course.id}/learn`}
                        className="w-full bg-secondary text-white font-bold py-3 rounded-xl hover:bg-secondary/90 transition-opacity flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                      >
                        Resume Course
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-12 text-on-surface-variant">
            No courses found matching your criteria.
          </div>
        )}

        {/* Bento-style Engagement Card */}
        <div className="group bg-primary-container rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden xl:col-span-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary rounded-full blur-[100px] opacity-20"></div>
          <div className="relative z-10">
            <span className="text-on-secondary-container/60 font-bold tracking-widest text-[10px] uppercase mb-4 block">
              Recommended for you
            </span>
            <h3 className="font-display-lg text-3xl md:text-4xl font-bold text-white mb-6 max-w-lg leading-tight">
              Master the future of Collaborative Design with AI.
            </h3>
            <p className="text-on-primary-container text-base max-w-md mb-8">
              Specialized workshop starting next week. Enrollment ends soon for
              the 2024 cohort.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/courses">
                <button className="w-full sm:w-auto px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-secondary/20 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary">
                  Explore Catalog
                  <Zap className="w-5 h-5 fill-current" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State / Explore More CTA */}
      <div className="mt-16 py-16 text-center border-2 border-dashed border-border-subtle rounded-3xl bg-surface-container-low/30">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
            <Rocket className="text-secondary w-8 h-8" />
          </div>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-3">
            Ready for a new challenge?
          </h3>
          <p className="text-on-surface-variant font-body-md mb-8 text-sm md:text-base">
            Our curriculum expands every week. Discover courses tailored to your
            recent progress.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-10 py-4 bg-on-surface text-white font-bold rounded-full hover:bg-on-surface/90 transition-opacity focus:outline-none focus:ring-2 focus:ring-on-surface focus:ring-offset-2"
          >
            Explore more courses
            <Compass className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
