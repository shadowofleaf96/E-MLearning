'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  Users,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  BookOpen,
  Award,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { coursesService } from '@/modules/courses/services/courses.service';
import { Course, CourseModule } from '@/types/course.types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CourseReviewsSection } from '@/modules/reviews/components/CourseReviewsSection';
import { bookmarksService } from '@/modules/bookmarks/services/bookmarks.service';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    if (courseId) {
      bookmarksService
        .checkBookmark(courseId)
        .then((res) => {
          if (res?.data) {
            setBookmarked(res.data.bookmarked);
          }
        })
        .catch(() => {});
    }
  }, [courseId]);

  const handleToggleBookmark = async () => {
    try {
      setBookmarking(true);
      const res = await bookmarksService.toggleBookmark(courseId);
      if (res?.data) {
        setBookmarked(res.data.bookmarked);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    } finally {
      setBookmarking(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await coursesService.getCourse(courseId);
        if (isMounted && res && res.data) {
          setCourse(res.data);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const toggleModule = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
  };

  const handleEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    setEnrollMsg(null);
    try {
      const res = await coursesService.enrollInCourse(course.id);
      if (res.status === 'success' || (res as any).success) {
        setEnrolled(true);
        setEnrollMsg('Successfully enrolled in this course!');
        setTimeout(() => {
          router.push(`/${locale}/student/my-courses`);
        }, 1200);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Please log in to enroll in this course.';
      setEnrollMsg(msg);
      if (err.response?.status === 401) {
        setTimeout(() => {
          router.push(`/${locale}/student/login`);
        }, 1500);
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 bg-surface-bg">
        <LoadingSpinner />
        <p className="text-sm font-medium text-on-surface-variant mt-4 animate-pulse">
          Loading course curriculum...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <main className="max-w-container-max mx-auto px-4 md:px-10 py-20 text-center space-y-6">
        <h1 className="font-headline-lg text-3xl font-bold text-on-surface">
          Course Not Found
        </h1>
        <p className="text-on-surface-variant max-w-md mx-auto">
          The course you are looking for does not exist or has been unpublished.
        </p>
        <Link
          href={`/${locale}/courses`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Catalog
        </Link>
      </main>
    );
  }

  const priceNum = Number(course.price) || 0;
  const isFree = priceNum === 0;
  const totalLessons =
    course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <main className="min-h-screen bg-surface-bg text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Breadcrumbs & Navigation */}
      <div className="border-b border-border-subtle bg-surface-container-low/50">
        <div className="max-w-container-max mx-auto px-4 md:px-10 py-4">
          <nav className="flex items-center gap-2 text-on-surface-variant font-label-md text-xs font-bold">
            <Link
              href={`/${locale}`}
              className="hover:text-secondary transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/${locale}/courses`}
              className="hover:text-secondary transition-colors"
            >
              Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-on-surface truncate max-w-xs md:max-w-md">
              {course.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Hero Section */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {course.tenant && (
                  <span className="bg-secondary/15 text-secondary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {course.tenant.name}
                  </span>
                )}
                <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold">
                  Certified Program
                </span>
              </div>

              <h1 className="font-display-lg text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-on-surface tracking-tight">
                {course.title}
              </h1>

              <p className="text-base md:text-lg font-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                {course.description ||
                  'Advance your career with this comprehensive curriculum developed by world-class academic institutions.'}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="font-bold text-on-surface">
                    {course._count?.enrollments || 0}
                  </span>{' '}
                  Students enrolled
                </div>
                <div className="h-4 w-px bg-border-subtle hidden sm:block" />
                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <span>{course.modules?.length || 2} Modules</span>
                  <span>•</span>
                  <span>{totalLessons || 4} Lessons</span>
                </div>
              </div>
            </section>

            {/* Instructor Details Card */}
            <section className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm flex items-center gap-4">
              {course.instructor?.avatar ? (
                <Image
                  width={56}
                  height={56}
                  alt={course.instructor.firstName || 'Instructor'}
                  className="w-14 h-14 rounded-full object-cover border-2 border-secondary/30"
                  src={course.instructor.avatar}
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-lg">
                  {course.instructor?.firstName?.charAt(0) || 'P'}
                </div>
              )}
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Lead Course Instructor
                </p>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  {course.instructor?.firstName
                    ? `${course.instructor.firstName} ${course.instructor.lastName || ''}`
                    : 'Senior Academic Faculty'}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {course.tenant?.name || 'Institutional Partner'}
                </p>
              </div>
            </section>

            {/* What you'll learn */}
            <section className="bg-surface-card rounded-2xl p-8 border border-border-subtle shadow-sm space-y-6">
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                What you'll master in this course
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Architect and deploy production-ready applications with modern best practices',
                  'Gain hands-on experience through interactive coding and structured modules',
                  'Solve industry-grade problems with guided mentorship and peer review',
                  'Earn a verified Certificate of Completion from accredited institutions',
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-on-surface-variant text-sm leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section className="space-y-6" id="curriculum">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h2 className="font-headline-md text-2xl font-bold text-on-surface">
                    Course Curriculum
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Structured learning path with interactive lessons and
                    practical exercises
                  </p>
                </div>
                <span className="text-xs font-body-sm text-on-surface-variant font-semibold bg-surface-container px-3 py-1.5 rounded-lg">
                  {course.modules?.length || 0} Modules • {totalLessons} Lessons
                </span>
              </div>

              <div className="space-y-3">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module: CourseModule, idx: number) => {
                    const isOpen = openModuleIndex === idx;
                    return (
                      <div
                        key={module.id || idx}
                        className="group border border-border-subtle rounded-2xl overflow-hidden bg-surface-card transition-all hover:border-secondary/50"
                      >
                        <button
                          className="w-full flex items-center justify-between p-5 bg-surface-container-low text-left focus:outline-none cursor-pointer"
                          onClick={() => toggleModule(idx)}
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-secondary text-sm font-mono bg-secondary/10 w-8 h-8 rounded-lg flex items-center justify-center">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <h4 className="font-semibold text-on-surface text-base">
                                {module.title}
                              </h4>
                              <p className="text-xs text-on-surface-variant mt-0.5">
                                {module.lessons?.length || 0} Lessons
                              </p>
                            </div>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-secondary transition-transform" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-transform" />
                          )}
                        </button>

                        {isOpen &&
                          module.lessons &&
                          module.lessons.length > 0 && (
                            <div className="divide-y divide-border-subtle bg-surface-card">
                              {module.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="p-4 px-6 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <PlayCircle className="w-4 h-4 text-secondary" />
                                    <span className="text-on-surface text-sm font-medium">
                                      {lesson.title}
                                    </span>
                                  </div>
                                  {lesson.duration && (
                                    <span className="text-xs text-on-surface-variant font-mono">
                                      {lesson.duration}:00
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 bg-surface-card rounded-2xl border border-border-subtle text-center text-on-surface-variant text-sm">
                    Curriculum modules are being finalized for this session.
                  </div>
                )}
              </div>
            </section>

            {/* Student Reviews & Ratings Section */}
            <CourseReviewsSection courseId={courseId} isEnrolled={enrolled} />
          </div>

          {/* Right Column: Pricing & Enrollment Sticky Card */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden shadow-lg space-y-6 p-6">
              {/* Preview image */}
              <div className="aspect-[16/9] relative overflow-hidden rounded-xl bg-surface-container">
                <Image
                  fill
                  alt={course.title}
                  className="object-cover"
                  src={
                    course.thumbnail ||
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                  }
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-secondary shadow-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Price section */}
              <div className="flex items-baseline justify-between border-b border-border-subtle pb-5">
                <div>
                  <span
                    className={`text-3xl font-headline-lg font-extrabold ${
                      isFree
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-on-surface'
                    }`}
                  >
                    {isFree ? 'Free Enrollment' : `$${priceNum.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Enroll button */}
              <div className="space-y-3">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || enrolled}
                  className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-base hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-75 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
                >
                  {enrolling ? (
                    <>
                      <LoadingSpinner />
                      <span>Enrolling...</span>
                    </>
                  ) : enrolled ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Enrolled! Redirecting...</span>
                    </>
                  ) : (
                    <span>
                      {isFree ? 'Enroll for Free' : 'Enroll in Course'}
                    </span>
                  )}
                </button>

                {enrollMsg && (
                  <p
                    className={`text-xs text-center font-semibold p-2.5 rounded-xl ${
                      enrolled
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    {enrollMsg}
                  </p>
                )}

                <p className="text-xs text-center text-on-surface-variant">
                  30-Day Full Access • Certificate of Completion Included
                </p>

                <button
                  onClick={handleToggleBookmark}
                  disabled={bookmarking}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    bookmarked
                      ? 'bg-rose-500/10 text-rose-600 border-rose-300'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-border-subtle'
                  }`}
                >
                  {bookmarked ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-rose-600" />
                      <span>Saved in Wishlist</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Add to Wishlist</span>
                    </>
                  )}
                </button>
              </div>

              {/* Course Features Checklist */}
              <div className="space-y-3 pt-4 border-t border-border-subtle text-xs text-on-surface-variant">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>Self-paced on-demand video access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>Shareable accredited institution certificate</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>Full access to course materials and challenges</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
