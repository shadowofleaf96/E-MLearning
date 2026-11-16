'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGamificationStats } from '@/store/slices/gamificationSlice';
import {
  Sparkles,
  Flame,
  Medal,
  ChevronRight,
  History,
  Flag,
  Check,
} from 'lucide-react';

export default function StudentAchievementsPage() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.gamification);

  useEffect(() => {
    dispatch(fetchGamificationStats());
  }, [dispatch]);

  const progressToNextLevel = stats ? (stats.xp % 1000) / 10 : 0; // Assuming 1000 XP per level
  const remainingXp = stats ? 1000 - (stats.xp % 1000) : 1000;

  return (
    <div className="flex-1 p-6 md:p-10 max-w-container-max mx-auto w-full">
      {/* Hero Header: Level & XP */}
      <section className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-1 lg:col-span-8 bg-surface-card rounded-2xl p-8 border border-border-subtle relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group shadow-sm">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary to-transparent"></div>

          <div className="relative z-10 flex-1 w-full text-center md:text-left">
            <div className="inline-flex items-center bg-secondary-container/10 text-secondary px-3 py-1.5 rounded-full mb-4 shadow-sm border border-secondary/20">
              <Sparkles size={16} className="mr-1.5 fill-current" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Level {stats?.level || 1} Scholar
              </span>
            </div>
            <h1 className="font-headline-lg text-4xl md:text-[48px] font-bold text-primary mb-3 leading-tight tracking-tight">
              {stats?.level && stats.level > 1
                ? 'Mastering the Craft'
                : 'Begin Your Journey'}
            </h1>
            <p className="font-body-lg text-on-surface-variant mb-6 max-w-lg mx-auto md:mx-0">
              {stats?.level && stats.level > 1
                ? `You're making great progress. Keep pushing toward Level ${stats.level + 1} to unlock exclusive perks.`
                : `Complete lessons and earn XP to level up and unlock exclusive mentorship perks.`}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-8">
              <div>
                <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                  Total Experience
                </p>
                <p className="font-headline-lg text-3xl font-black text-secondary">
                  {stats?.xp || 0}{' '}
                  <span className="text-base font-normal text-on-surface-variant">
                    XP
                  </span>
                </p>
              </div>
              <div className="w-px h-12 bg-border-subtle"></div>
              <div>
                <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                  Rank
                </p>
                <p className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
                  <Medal size={24} className="text-amber-500 fill-amber-500" />
                  {stats?.level && stats.level > 5 ? 'Elite' : 'Novice'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-48 h-48">
              {/* Progress Ring */}
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  className="text-surface-container stroke-current"
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  strokeWidth="8"
                />
                <circle
                  className="text-secondary stroke-current transition-all duration-1000 ease-out"
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  strokeWidth="8"
                  strokeDasharray="263.89"
                  strokeDashoffset={
                    263.89 - (263.89 * progressToNextLevel) / 100
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-headline-lg text-4xl font-bold text-primary">
                  {Math.round(progressToNextLevel)}%
                </span>
                <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                  To Level {(stats?.level || 1) + 1}
                </span>
              </div>
            </div>
            <p className="mt-4 font-mono text-sm text-on-surface-variant italic">
              {remainingXp} XP remaining
            </p>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="col-span-1 lg:col-span-4 bg-surface-card rounded-2xl p-8 border border-border-subtle flex flex-col items-center text-center justify-center relative group shadow-sm">
          <div className="absolute top-4 right-4 bg-red-50 p-2 rounded-full border border-red-100">
            <Flame
              size={24}
              className="text-red-500 fill-red-500 animate-pulse"
            />
          </div>
          <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-2">
            Current Streak
          </p>
          <h2 className="font-headline-lg text-[56px] font-black text-red-500 leading-none mb-1">
            {stats?.streak || 0}
          </h2>
          <span className="text-xl font-bold text-primary mb-6">Days</span>

          {/* Simplified Calendar View */}
          <div className="grid grid-cols-7 gap-2 w-full max-w-50">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div
                key={`w1-${i}`}
                className="aspect-square bg-red-500 rounded-md flex items-center justify-center text-[10px] text-white font-bold shadow-inner"
              >
                {day}
              </div>
            ))}
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div
                key={`w2-${i}`}
                className="aspect-square bg-red-500 rounded-md flex items-center justify-center text-[10px] text-white font-bold shadow-inner"
              >
                {day}
              </div>
            ))}
          </div>
          <p className="font-medium text-sm text-on-surface-variant mt-6">
            Next milestone:{' '}
            <span className="font-bold text-primary">21 Days</span>
          </p>
        </div>
      </section>

      {/* Achievement Badges Grid */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">
            Achievement Badges
          </h2>
          <button className="text-secondary font-bold text-sm hover:underline flex items-center transition-colors">
            View All <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-surface-card rounded-2xl p-6 border border-border-subtle h-64 animate-pulse"
                  ></div>
                ))
            : stats?.badges && stats.badges.length > 0
              ? stats.badges.map((badge: any, i: number) => (
                  <div
                    key={i}
                    className="bg-surface-card rounded-2xl p-6 border border-border-subtle flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative"
                  >
                    <div className="absolute top-3 right-3 text-xs font-bold px-2 py-1 bg-surface-container rounded-md text-on-surface-variant flex items-center gap-1">
                      <Sparkles size={12} className="text-secondary" />+
                      {badge.triggerValue}
                    </div>
                    <div className="w-24 h-24 mb-6 relative flex items-center justify-center mt-2">
                      <div
                        className="absolute inset-0 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 opacity-20"
                        style={{ backgroundColor: badge.color }}
                      ></div>
                      <div
                        className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-3xl"
                        style={{
                          backgroundColor: `${badge.color}20`,
                          border: `2px solid ${badge.color}`,
                        }}
                      >
                        {badge.icon}
                      </div>
                    </div>
                    <h3
                      className="text-lg font-bold text-primary mb-1 line-clamp-1"
                      style={{ color: badge.color }}
                    >
                      {badge.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-4 flex-1 line-clamp-2">
                      {badge.description ||
                        `Awarded for ${badge.triggerType.replace('_', ' ')}`}
                    </p>
                    <p className="font-bold text-xs text-secondary bg-surface-container px-3 py-1.5 rounded-md">
                      Unlocked {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              : null}

          {/* Locked Badge Placeholder */}
          <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle flex flex-col items-center text-center group opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-not-allowed">
            <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"></div>
              <div className="relative z-10 w-16 h-16 bg-linear-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Sparkles size={28} className="text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-primary mb-1">Locked</h3>
            <p className="text-sm text-on-surface-variant mb-4 flex-1">
              Keep learning to unlock more achievements
            </p>
            <p className="font-bold text-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-md border border-border-subtle">
              In Progress
            </p>
          </div>
        </div>
      </section>

      {/* Milestone Timeline & Goals */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Achievements */}
        <div className="bg-surface-card rounded-2xl p-8 border border-border-subtle shadow-sm">
          <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
            <div className="bg-surface-container p-2 rounded-lg text-secondary">
              <History size={24} />
            </div>
            Recent Milestones
          </h3>

          <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
            {loading ? (
              <div className="animate-pulse flex flex-col gap-8 ml-10">
                <div className="h-16 bg-surface-container-high rounded w-full"></div>
                <div className="h-16 bg-surface-container-high rounded w-3/4"></div>
              </div>
            ) : stats?.badges && stats.badges.length > 0 ? (
              stats.badges.map((badge: any, i: number) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                    <Check size={14} className="text-white stroke-[3px]" />
                  </div>
                  <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                  <h4 className="text-base font-bold text-primary mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    {badge.description ||
                      `Awarded for ${badge.triggerType.replace('_', ' ')}`}
                  </p>
                </div>
              ))
            ) : (
              <div className="pl-10 text-on-surface-variant italic text-sm">
                No recent milestones.
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Goals */}
        <div className="bg-surface-card rounded-2xl p-8 border border-border-subtle shadow-sm">
          <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
            <div className="bg-surface-container p-2 rounded-lg text-secondary">
              <Flag size={24} />
            </div>
            Upcoming Goals
          </h3>

          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-24 bg-surface-container-high rounded-xl w-full"></div>
                <div className="h-24 bg-surface-container-high rounded-xl w-full"></div>
              </div>
            ) : false ? (
              [].map((goal: any, i: number) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-border-subtle bg-surface-container-lowest hover:border-secondary transition-colors cursor-pointer group shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-primary group-hover:text-secondary transition-colors mb-1 text-base">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-on-surface-variant">
                        {goal.subtitle || 'Active Goal'}
                      </p>
                    </div>
                    <span className="text-secondary font-mono font-bold text-base">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-on-surface-variant text-sm italic mb-2">
                  No active goals.
                </p>
                <button className="text-secondary font-bold text-xs hover:underline uppercase tracking-wider">
                  Set a Goal
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
