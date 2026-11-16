'use client';

import React, { useEffect } from 'react';
import {
  BookOpen,
  BarChart2,
  Flame,
  Star,
  ChevronDown,
  Activity,
  Code2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGamificationStats } from '@/store/slices/gamificationSlice';

export default function StudentProgressPage() {
  const dispatch = useAppDispatch();
  const { stats } = useAppSelector((state) => state.gamification);
  const { courses } = useAppSelector((state) => state.course); // For course count if loaded elsewhere

  useEffect(() => {
    dispatch(fetchGamificationStats());
  }, [dispatch]);

  return (
    <div className="flex-1 p-6 md:p-10 max-w-container-max mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-headline-lg text-3xl md:text-4xl font-bold text-primary mb-2">
          Your Progress
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Track your learning journey and performance analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Performance Overview Cards */}
        <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-secondary">
                <BookOpen size={20} />
              </div>
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Courses
              </span>
            </div>
            <div className="font-headline-lg text-4xl text-primary font-bold">
              {courses?.length || 0}
            </div>
            <div className="font-medium text-sm text-on-surface-variant mt-2">
              Enrolled courses
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <BarChart2 size={20} />
              </div>
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Avg Score
              </span>
            </div>
            <div className="font-headline-lg text-4xl text-primary font-bold">
              0%
            </div>
            <div className="font-medium text-sm text-on-surface-variant mt-2">
              Start a quiz
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Flame size={20} />
              </div>
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Streak
              </span>
            </div>
            <div className="font-headline-lg text-4xl text-primary font-bold">
              {stats?.streak || 0}
            </div>
            <div className="font-medium text-sm text-on-surface-variant mt-2">
              Days active
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                <Star size={20} />
              </div>
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Total XP
              </span>
            </div>
            <div className="font-mono text-4xl font-bold text-primary tracking-tight">
              {stats?.xp || 0}
            </div>
            <div className="font-medium text-sm text-on-surface-variant mt-2">
              Level {stats?.level || 1}
            </div>
          </div>
        </div>

        {/* Learning Activity Analytics */}
        <div className="md:col-span-8 bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 flex flex-col h-[400px] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              Learning Activity
            </h2>
            <div className="relative">
              <select className="appearance-none bg-surface-container-lowest border border-border-subtle rounded-lg pl-4 pr-10 py-2 font-medium text-sm text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cursor-pointer">
                <option>Past Week</option>
                <option>Past Month</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
              />
            </div>
          </div>

          {/* Empty State for Chart Area */}
          <div className="flex-1 w-full h-full border border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center bg-surface-container-lowest">
            <Activity className="w-12 h-12 text-on-surface-variant opacity-50 mb-4" />
            <p className="text-on-surface font-bold text-lg mb-1">
              Not enough data
            </p>
            <p className="text-sm text-on-surface-variant text-center max-w-sm">
              Keep learning to populate your activity chart. Your daily progress
              will appear here.
            </p>
          </div>
        </div>

        {/* Skill Mastery Radar/Bars */}
        <div className="md:col-span-4 bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 flex flex-col h-[400px] shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-8">
            Skill Mastery
          </h2>

          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border-subtle rounded-xl bg-surface-container-lowest">
            <Code2 className="w-12 h-12 text-on-surface-variant opacity-50 mb-4" />
            <p className="text-on-surface font-bold text-lg mb-1">
              No skills tracked yet
            </p>
            <p className="text-sm text-on-surface-variant text-center max-w-50">
              Complete course modules to start tracking your skill mastery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
