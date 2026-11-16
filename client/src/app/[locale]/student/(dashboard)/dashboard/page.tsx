'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStudentCourses } from '@/modules/courses/hooks/useStudentCourses';
import { useGamificationStats } from '@/modules/gamification/hooks/useGamificationStats';
import { useDashboardStats } from '@/modules/progress/hooks/useDashboardStats';
import api from '@/services/api';
import { toast } from 'react-toastify';

export default function StudentDashboard() {
  const { data: courses, isLoading: coursesLoading } = useStudentCourses();
  const { data: gamification } = useGamificationStats();
  const { data: stats } = useDashboardStats();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [notifRes, certRes] = await Promise.all([
          api.get('/notifications'),
          api.get('/certificates'),
        ]);
        setNotifications(notifRes.data.data.slice(0, 3));
        setCertificates(certRes.data.data);
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      }
    };
    fetchDashboardData();
  }, []);
  useEffect(() => {
    // Simple progress bar animation on scroll/load
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    progressBars.forEach((bar) => {
      const el = bar as HTMLElement;
      const width = el.style.width;
      el.style.width = '0%';
      setTimeout(() => {
        el.style.width = width;
      }, 300);
    });
  }, []);

  return (
    <div className="px-4 md:px-10 py-6 md:py-10 max-w-container-max mx-auto">
      {/* Hero: Continue Learning */}
      <section className="mb-10 md:mb-16">
        {coursesLoading ? (
          <div className="w-full h-64 bg-surface-container rounded-xl animate-pulse"></div>
        ) : courses && courses.length > 0 ? (
          <div className="relative overflow-hidden rounded-xl bg-on-primary-fixed p-6 md:p-8 lg:p-12 text-white shadow-lg flex flex-col lg:flex-row items-center gap-8 md:gap-12 group">
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  In Progress
                </span>
              </div>
              <h2 className="font-display-lg text-3xl md:text-[48px] mb-4 leading-tight font-bold">
                {courses[0].title}
              </h2>
              <p className="text-on-primary-container font-body-lg text-sm md:text-lg mb-8 max-w-2xl line-clamp-2">
                {courses[0].description ||
                  'Continue your learning journey with this course.'}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link href={`/student/course/${courses[0].id}/learn`}>
                  <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary hover:bg-secondary-container text-white rounded-lg font-bold transition-all active:scale-95 w-full sm:w-auto">
                    <span className="material-symbols-outlined">
                      play_arrow
                    </span>
                    Resume Lesson
                  </button>
                </Link>
                <div className="flex-1 w-full max-w-xs">
                  <div className="flex justify-between text-xs mb-2 text-on-primary-container">
                    <span>Course Progress</span>
                    <span>{courses[0].progress || 0}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full progress-bar-fill transition-all duration-1000 ease-out"
                      style={{ width: `${courses[0].progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {courses[0].thumbnail && (
              <div className="relative w-full lg:w-1/3 aspect-video lg:aspect-square rounded-xl overflow-hidden tonal-stroke shadow-2xl">
                <Image
                  alt={courses[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={courses[0].thumbnail}
                  fill
                />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full rounded-xl bg-surface-container p-8 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">
              school
            </span>
            <h2 className="font-headline-md text-xl font-bold mb-2">
              Ready to start learning?
            </h2>
            <p className="text-on-surface-variant mb-6">
              You aren't enrolled in any active courses right now.
            </p>
            <Link href="/student/my-courses">
              <button className="px-6 py-2 bg-secondary text-white rounded-lg font-bold hover:bg-secondary-container transition-colors">
                Browse Catalog
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enrolled Courses */}
        <div className="col-span-1 lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-2xl font-bold">
              My Active Courses
            </h3>
            <Link href="/student/my-courses">
              <button className="text-secondary font-label-md text-sm hover:underline">
                View All
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coursesLoading ? (
              <>
                <div className="h-64 bg-surface-container animate-pulse rounded-xl"></div>
                <div className="h-64 bg-surface-container animate-pulse rounded-xl"></div>
              </>
            ) : courses && courses.length > 0 ? (
              courses.slice(0, 2).map((course) => (
                <Link href={`/student/course/${course.id}`} key={course.id}>
                  <div className="bg-surface-card rounded-xl p-5 border border-border-subtle hover:border-secondary hover:shadow-lg transition-all group flex flex-col cursor-pointer hover:-translate-y-1 h-full">
                    {course.thumbnail && (
                      <div className="relative h-32 w-full rounded-lg mb-4 overflow-hidden">
                        <Image
                          alt={course.title}
                          className="object-cover"
                          src={course.thumbnail}
                          fill
                        />
                      </div>
                    )}
                    <h4 className="font-headline-sm text-lg font-bold mb-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-on-surface-variant mb-6">
                      Instructor:{' '}
                      {course.instructor
                        ? `${course.instructor.firstName} ${course.instructor.lastName}`
                        : 'TBA'}
                    </p>
                    <div className="space-y-3 mt-auto">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-on-surface-variant">
                          {course.progress || 0}% Complete
                        </span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-low rounded-full">
                        <div
                          className="h-full bg-secondary rounded-full progress-bar-fill transition-all duration-1000 ease-out"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center text-on-surface-variant py-8 bg-surface-container-low rounded-xl">
                No active courses.
              </div>
            )}
          </div>
        </div>

        {/* Stats & XP */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          <h3 className="font-headline-md text-2xl font-bold mb-6">
            Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-card rounded-xl p-4 border border-border-subtle shadow-sm flex flex-col justify-center">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">
                Completed
              </span>
              <span className="font-headline-lg text-3xl font-bold text-primary">
                {stats?.completedCourses || 0}
              </span>
            </div>
            <div className="bg-surface-card rounded-xl p-4 border border-border-subtle shadow-sm flex flex-col justify-center">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">
                Avg. Score
              </span>
              <span className="font-headline-lg text-3xl font-bold text-secondary">
                {stats?.averageProgress ? Math.round(stats.averageProgress) : 0}
                %
              </span>
            </div>
          </div>

          {/* Level Card */}
          <div className="bg-surface-card rounded-xl p-6 border border-border-subtle flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                Your Rank
              </p>
              <h4 className="font-headline-md text-xl font-bold text-primary">
                {gamification ? `Level ${gamification.level}` : 'Rookie'}
              </h4>
              <p className="text-sm text-secondary font-bold mt-1">
                {gamification ? `${gamification.xp} XP Earned` : '0 XP'}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-secondary flex items-center justify-center bg-surface-container-low">
              <span className="font-headline-md text-xl font-bold text-secondary">
                {gamification?.level || 1}
              </span>
            </div>
          </div>

          {/* Streak Widget */}
          <div className="bg-surface-card rounded-xl p-6 border border-border-subtle shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-streak-orange/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-streak-orange"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
              </div>
              <div>
                <h4 className="font-label-md text-sm font-bold">
                  Learning Streak
                </h4>
                <p className="font-headline-md text-2xl font-bold leading-tight">
                  {gamification?.streak || 0} Days
                </p>
              </div>
            </div>
            <div className="flex justify-between gap-1 mt-2">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                Keep learning daily to increase your streak multiplier!
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="col-span-1 lg:col-span-4">
          <h3 className="font-headline-md text-2xl font-bold mb-6">
            Live Sessions
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-col items-center justify-center text-center opacity-75 py-10">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                videocam_off
              </span>
              <p className="text-sm text-on-surface-variant">
                No upcoming live sessions
              </p>
            </div>
          </div>
        </div>

        {/* Notifications & Activity */}
        <div className="col-span-1 lg:col-span-4">
          <h3 className="font-headline-md text-2xl font-bold mb-6">
            Recent Activity
          </h3>
          <div className="bg-surface-card rounded-xl border border-border-subtle divide-y divide-border-subtle shadow-sm">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 flex gap-4 items-start">
                  <div
                    className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.isRead ? 'bg-border-subtle' : 'bg-secondary'}`}
                  ></div>
                  <div>
                    <p className="text-sm font-bold">{notif.title}</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wide mt-2 block font-semibold">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-on-surface-variant text-sm">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Certificates */}
        <div className="col-span-1 lg:col-span-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-2xl font-bold">
              Certificates
            </h3>
            <span className="text-xs font-bold bg-surface-container-high px-2 py-1 rounded text-on-surface">
              {certificates.length} Total
            </span>
          </div>
          <div className="space-y-4">
            {certificates.length > 0 ? (
              certificates.slice(0, 3).map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-xl bg-surface-card border border-border-subtle group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-xp-gold/10 flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-xp-gold"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        workspace_premium
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="font-bold text-sm truncate">
                        {cert.course?.title || 'Course Certificate'}
                      </h5>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Earned {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toast.info('Download coming soon')}
                      className="flex-1 py-2 bg-surface-container-low text-secondary rounded-lg text-xs font-bold hover:bg-secondary hover:text-white transition-all"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-col items-center justify-center text-center opacity-75 py-10">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                  workspace_premium
                </span>
                <p className="text-sm text-on-surface-variant">
                  No certificates earned yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
