'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useInstructorStats } from '@/modules/courses/hooks/useInstructorStats';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { liveService, LiveSession } from '@/modules/live/services/live.service';
import { toast } from 'react-toastify';

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    totalStudents,
    activeCourses,
    avgCompletion,
    totalEarnings,
    recentCourses,
    loading,
  } = useInstructorStats();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [chartData, setChartData] = useState<
    { month: string; value: number }[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [notifRes, liveRes, earningsRes] = await Promise.all([
          api.get('/notifications').catch(() => ({ data: { data: [] } })),
          liveService.getSessions().catch(() => ({ data: [] })),
          api
            .get('/payments/instructor/earnings')
            .catch(() => ({ data: { data: { transactions: [] } } })),
        ]);

        setNotifications(notifRes.data?.data?.slice(0, 4) || []);

        const sessions = liveRes.data || [];
        const upcoming = sessions.filter(
          (s: any) =>
            new Date(s.scheduledAt).getTime() + s.durationMinutes * 60000 >
            Date.now()
        );
        setLiveSessions(upcoming.slice(0, 4));

        // Compute chart data from earnings transactions
        const txns = earningsRes.data?.data?.transactions || [];
        const monthlyEarnings: Record<string, number> = {};
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        // initialize last 6 months
        const today = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          let mStr = months[d.getMonth()];
          last6Months.push(mStr);
          monthlyEarnings[mStr] = 0;
        }

        txns.forEach((t: any) => {
          let d = new Date(t.createdAt);
          let mStr = months[d.getMonth()];
          if (monthlyEarnings[mStr] !== undefined) {
            monthlyEarnings[mStr] += Number(t.amount);
          }
        });

        const data = last6Months.map((m) => ({
          month: m,
          value: monthlyEarnings[m],
        }));
        setChartData(data);
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      }
    };
    fetchDashboardData();
  }, []);

  const maxChartValue = Math.max(...chartData.map((d) => d.value), 100);

  return (
    <div className="max-w-container-max mx-auto pb-20 selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      <header className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Instructor Dashboard
        </h2>
        <p className="text-on-surface-variant font-body-md mt-1">
          Welcome back, {user?.firstName || 'Instructor'}. Here's what's
          happening in your academy today.
        </p>
      </header>

      {/* 0. Engagement Banner */}
      <section className="bg-[#1e6fec] rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-white shadow-md">
        <div className="max-w-3xl">
          <h3 className="font-headline-md text-[20px] font-bold mb-2 tracking-tight">
            Maximize Student Engagement
          </h3>
          <p className="text-white/90 font-body-md text-[14px] leading-relaxed max-w-2xl font-medium">
            Instructors who update their curriculum once every quarter see a 24%
            increase in student completion rates. Check your analytics to see
            where students drop off.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => toast.info('Navigating to improvement tips...')}
            className="px-5 py-2.5 bg-white text-[#1e6fec] font-label-lg font-bold rounded-[8px] hover:bg-white/95 transition-colors shadow-sm focus:outline-none"
          >
            Get Improvement Tips
          </button>
          <button
            onClick={() => toast.info('Scheduling review...')}
            className="px-5 py-2.5 bg-[#3180f6] border border-white/10 text-white font-label-lg font-bold rounded-[8px] hover:bg-[#3b87f8] transition-colors shadow-sm focus:outline-none"
          >
            Schedule Review
          </button>
        </div>
      </section>

      {/* 1. Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-subtle shadow-sm hover:border-secondary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined">group</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md uppercase tracking-wider text-[11px] font-bold">
            Total Students
          </p>
          <p className="text-[28px] font-headline-md font-bold text-primary mt-1 tracking-tight">
            {loading ? '...' : totalStudents.toLocaleString()}
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-subtle shadow-sm hover:border-secondary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined">school</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md uppercase tracking-wider text-[11px] font-bold">
            Active Courses
          </p>
          <p className="text-[28px] font-headline-md font-bold text-primary mt-1 tracking-tight">
            {loading ? '...' : activeCourses}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-subtle shadow-sm hover:border-secondary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md uppercase tracking-wider text-[11px] font-bold">
            Avg. Completion
          </p>
          <p className="text-[28px] font-headline-md font-bold text-primary mt-1 tracking-tight">
            {loading ? '...' : `${avgCompletion}%`}
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-subtle shadow-sm hover:border-secondary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md uppercase tracking-wider text-[11px] font-bold">
            Total Earnings
          </p>
          <p className="text-[28px] font-headline-md font-bold text-primary mt-1 tracking-tight">
            {loading ? '...' : `$${totalEarnings.toLocaleString()}`}
          </p>
        </div>
      </section>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* 3. Earnings Analytics (Revenue Overview) - Span 8 */}
        <div className="col-span-12 lg:col-span-8 bg-surface-card border border-border-subtle rounded-xl p-8 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-headline-md text-headline-md tracking-tight font-bold">
                Revenue Overview
              </h3>
              <p className="text-body-sm text-on-surface-variant font-medium">
                Monthly growth
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary text-white focus:outline-none">
                Last 6 Months
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative group">
            {/* Dynamic Line Chart using CSS Gradients & SVG */}
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {chartData.map((d, i) => {
                const heightPercentage = Math.max(
                  (d.value / maxChartValue) * 90,
                  10
                );
                return (
                  <div
                    key={i}
                    className="w-1/6 bg-secondary/20 hover:bg-secondary/30 rounded-t-lg relative group/bar transition-all cursor-pointer mx-1"
                    style={{ height: `${heightPercentage}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      ${d.value.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute bottom-0 w-full h-px bg-border-subtle"></div>
          </div>

          <div className="flex justify-between mt-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest px-2">
            {chartData.map((d, i) => (
              <span key={i}>{d.month}</span>
            ))}
          </div>
        </div>

        {/* 5. Upcoming Live Sessions - Span 4 */}
        <div className="col-span-12 lg:col-span-4 bg-surface-card border border-border-subtle rounded-xl p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-[20px] font-bold tracking-tight">
              Live Sessions
            </h3>
            <Link
              href="/instructor/live"
              className="text-secondary font-bold text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
            {liveSessions.length > 0 ? (
              liveSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl bg-surface-container-low border border-border-subtle hover:border-secondary/50 transition-colors"
                >
                  <h4 className="font-bold text-sm text-on-surface line-clamp-1">
                    {session.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-xs font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">
                      event
                    </span>
                    {new Date(session.scheduledAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-md">
                      {session.durationMinutes} mins
                    </span>
                    <button
                      onClick={() => router.push(`/live/${session.id}`)}
                      className="text-xs font-bold text-white bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/90 transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-border-subtle flex flex-col items-center justify-center text-center py-12 h-full">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">
                  videocam_off
                </span>
                <p className="text-sm font-bold text-on-surface-variant">
                  No upcoming sessions
                </p>
                <button
                  onClick={() => router.push('/instructor/live')}
                  className="mt-4 text-xs font-bold text-secondary hover:underline"
                >
                  Schedule one
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Courses Management (Your Courses) - Span 7 */}
        <div className="col-span-12 lg:col-span-7 bg-surface-card border border-border-subtle rounded-xl p-8 h-[450px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md font-bold tracking-tight">
              Your Courses
            </h3>
            <Link
              href="/instructor/courses"
              className="text-sm text-secondary font-bold hover:underline flex items-center gap-1"
            >
              Manage All{' '}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-surface-container-low animate-pulse rounded-xl"
                  ></div>
                ))
            ) : recentCourses.length > 0 ? (
              recentCourses.map((course: any) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors group border border-transparent hover:border-border-subtle"
                >
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-white shrink-0 ${course.isPublished ? 'bg-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {course.isPublished ? 'design_services' : 'code'}
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-body-md font-bold text-on-surface truncate">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      {course.isPublished ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#10b981]/10 text-[#10b981]">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant">
                          DRAFT
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/instructor/courses/${course.id}`)
                    }
                    className="opacity-0 group-hover:opacity-100 bg-surface-container border border-border-subtle px-4 py-2 rounded-lg text-sm font-bold text-on-surface hover:text-secondary transition-all focus:outline-none"
                  >
                    Edit
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center flex flex-col items-center justify-center h-full text-on-surface-variant">
                <p className="font-bold mb-2">No courses yet</p>
                <p className="text-sm">Start building your first curriculum.</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Students Activity (Recent Student Activity) - Span 5 */}
        <div className="col-span-12 lg:col-span-5 bg-surface-card border border-border-subtle rounded-xl p-8 h-[450px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md font-bold tracking-tight">
              Recent Notifications
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border-subtle"></div>
            <div className="space-y-6">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="relative flex gap-6 items-start"
                  >
                    <div
                      className={`z-10 w-12 h-12 rounded-full border-[3px] border-surface-bg shadow-sm shrink-0 flex items-center justify-center ${notif.isRead ? 'bg-surface-container text-on-surface-variant' : 'bg-secondary text-white'}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {notif.type === 'message' ? 'chat' : 'notifications'}
                      </span>
                    </div>
                    <div className="pt-1">
                      <p className="text-sm text-on-surface">
                        <span className="font-bold">{notif.title}</span>
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 font-medium leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wide mt-2 block font-bold">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-on-surface-variant font-bold text-sm flex flex-col h-full justify-center">
                  You're all caught up!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
