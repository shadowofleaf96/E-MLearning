'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  BarChart2,
  Flame,
  Star,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Calendar,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
  analyticsService,
  StudentAnalyticsData,
} from '@/modules/analytics/services/analytics.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGamificationStats } from '@/store/slices/gamificationSlice';

export default function StudentProgressPage() {
  const dispatch = useAppDispatch();
  const { stats } = useAppSelector((state) => state.gamification);
  const [analytics, setAnalytics] = useState<StudentAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchGamificationStats());
    loadAnalytics();
  }, [dispatch]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getStudentAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load student analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = analytics?.kpis || {
    totalEnrolled: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLessonsCompleted: 0,
    totalStudyHours: 0,
    totalStudyMinutes: 0,
    avgExamScore: 0,
    examsPassedCount: 0,
    streak: stats?.streak || 0,
    xp: stats?.xp || 0,
    level: stats?.level || 1,
  };

  const weeklyActivity = analytics?.weeklyActivity || [];
  const maxWeeklyMinutes = Math.max(
    ...weeklyActivity.map((d) => d.minutes),
    60
  );

  const categoryMastery = analytics?.categoryMastery || [];
  const recentExams = analytics?.recentExams || [];

  return (
    <div className="flex-1 p-6 md:p-10 max-w-container-max mx-auto w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold mb-2">
            <Sparkles size={14} />
            <span>Personalized Learning Analytics</span>
          </div>
          <h1 className="font-headline-lg text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Learning Progress & Analytics
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Track your study hours, exam accomplishments, and skill mastery
            milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-surface-card border border-border-subtle flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-red-500 fill-red-500" />
            <div>
              <div className="text-[10px] uppercase font-bold text-on-surface-variant">
                Streak
              </div>
              <div className="text-sm font-bold text-primary">
                {kpis.streak} Days
              </div>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-surface-card border border-border-subtle flex items-center gap-2.5">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <div className="text-[10px] uppercase font-bold text-on-surface-variant">
                Level {kpis.level}
              </div>
              <div className="text-sm font-bold text-primary">{kpis.xp} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Enrolled Courses */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <BookOpen size={24} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {kpis.completedCourses} Completed
            </span>
          </div>
          <div className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">
            {kpis.totalEnrolled}
          </div>
          <div className="font-medium text-xs text-on-surface-variant mt-1">
            Enrolled courses ({kpis.inProgressCourses} in progress)
          </div>
        </div>

        {/* Study Hours */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              Active Learner
            </span>
          </div>
          <div className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">
            {kpis.totalStudyHours}{' '}
            <span className="text-lg font-semibold text-on-surface-variant">
              hrs
            </span>
          </div>
          <div className="font-medium text-xs text-on-surface-variant mt-1">
            {kpis.totalLessonsCompleted} lessons completed
          </div>
        </div>

        {/* Average Exam Score */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <BarChart2 size={24} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
              {kpis.examsPassedCount} Passed
            </span>
          </div>
          <div className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">
            {kpis.avgExamScore}%
          </div>
          <div className="font-medium text-xs text-on-surface-variant mt-1">
            Average assessment score
          </div>
        </div>

        {/* XP & Mastery */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Award size={24} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              Tier {Math.min(Math.floor(kpis.level / 5) + 1, 5)}
            </span>
          </div>
          <div className="font-mono text-3xl md:text-4xl font-bold text-primary">
            {kpis.xp}{' '}
            <span className="text-lg font-normal text-on-surface-variant">
              XP
            </span>
          </div>
          <div className="font-medium text-xs text-on-surface-variant mt-1">
            Level {kpis.level} scholar rank
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Activity Heatmap / Bar Visualizer */}
        <div className="lg:col-span-8 bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Weekly Study Activity
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Your daily study time (minutes) and lesson completions over
                  the past 7 days.
                </p>
              </div>
              <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-container-low border border-border-subtle text-on-surface">
                Past 7 Days
              </div>
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center text-sm text-on-surface-variant">
                Loading study activity...
              </div>
            ) : weeklyActivity.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-subtle rounded-xl bg-surface-container-lowest">
                <Calendar className="w-10 h-10 text-on-surface-variant/40 mb-2" />
                <p className="text-sm font-bold text-on-surface">
                  No activity recorded yet
                </p>
                <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                  Start watching lessons and completing exercises to view your
                  daily learning stats.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-7 gap-3 h-48 items-end px-2">
                  {weeklyActivity.map((day, idx) => {
                    const heightPercent =
                      day.minutes > 0
                        ? Math.max(
                            Math.round((day.minutes / maxWeeklyMinutes) * 100),
                            12
                          )
                        : 6;
                    const isActive = day.minutes > 0;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-2 h-full justify-end group"
                      >
                        <div className="text-[11px] font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.minutes}m
                        </div>
                        <div className="w-full bg-surface-container-low rounded-t-lg overflow-hidden flex items-end h-32 p-1">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-md transition-all duration-500 ${
                              isActive
                                ? 'bg-secondary group-hover:bg-secondary/90 shadow-sm'
                                : 'bg-border-subtle/50'
                            }`}
                          />
                        </div>
                        <div className="text-center">
                          <span
                            className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                          >
                            {day.day}
                          </span>
                          <div className="text-[10px] text-on-surface-variant">
                            {day.lessons} {day.lessons === 1 ? 'les' : 'les'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
              Active Study Time
            </span>
            <span className="font-semibold text-primary">
              Total {kpis.totalStudyMinutes} minutes logged
            </span>
          </div>
        </div>

        {/* Skill / Category Mastery */}
        <div className="lg:col-span-4 bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">
              Skill Mastery
            </h2>
            <p className="text-xs text-on-surface-variant mb-6">
              Completion velocity by category and domain.
            </p>

            {categoryMastery.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-subtle rounded-xl bg-surface-container-lowest">
                <BookOpen className="w-10 h-10 text-on-surface-variant/40 mb-2" />
                <p className="text-sm font-bold text-on-surface">
                  No skill data yet
                </p>
                <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                  Enroll in curriculum tracks to begin building and measuring
                  category masteries.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryMastery.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="font-bold text-on-surface">
                        {cat.category}
                      </span>
                      <span className="text-secondary font-bold">
                        {cat.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-low overflow-hidden">
                      <div
                        style={{ width: `${cat.percentage}%` }}
                        className="h-full rounded-full bg-secondary transition-all duration-500"
                      />
                    </div>
                    <div className="text-[11px] text-on-surface-variant flex justify-between">
                      <span>
                        {cat.courseCount}{' '}
                        {cat.courseCount === 1 ? 'course' : 'courses'}
                      </span>
                      <span>
                        {cat.completedLessons}/{cat.totalLessons} lessons
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle">
            <Link
              href="/student/courses"
              className="w-full py-2.5 px-4 rounded-xl border border-secondary/30 text-secondary hover:bg-secondary/5 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen size={14} />
              Explore More Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Exam & Assessment History */}
      <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Exam & Quiz Performance History
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Review your examination submissions, scores, and accreditation
              achievements.
            </p>
          </div>
        </div>

        {recentExams.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-border-subtle rounded-xl bg-surface-container-lowest">
            <HelpCircle className="w-12 h-12 text-on-surface-variant/40 mb-3" />
            <p className="text-base font-bold text-on-surface">
              No exams attempted yet
            </p>
            <p className="text-xs text-on-surface-variant max-w-sm mt-1">
              Take course module quizzes and certification assessments to test
              your knowledge and display results here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse"
              role="table"
              aria-label="Exam performance history"
            >
              <thead>
                <tr className="border-b border-border-subtle text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  <th scope="col" className="py-3 px-4">
                    Exam Title
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Date
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Score
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Passing Score
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {recentExams.map((exam) => (
                  <tr
                    key={exam.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-on-surface">
                      {exam.examTitle}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                      {new Date(exam.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                      {exam.score}%
                    </td>
                    <td className="py-3.5 px-4 text-xs text-on-surface-variant font-mono">
                      {exam.passingScore}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {exam.passed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={13} />
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle size={13} />
                          Needs Review
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
