'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGamificationStats } from '@/store/slices/gamificationSlice';
import Image from 'next/image';
import {
  LayoutDashboard,
  GraduationCap,
  Medal,
  Settings,
  Search,
  Star,
  Flame,
  Bell,
  Clock,
  Video,
  PlayCircle,
  PenTool,
  Code,
  Target,
  Award,
  Timer,
  Trophy,
} from 'lucide-react';

export default function StudentDashboardHubPage() {
  const dispatch = useAppDispatch();
  const { stats, loading: statsLoading } = useAppSelector(
    (state) => state.gamification
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchGamificationStats());
  }, [dispatch]);

  return (
    <div className="h-screen bg-background text-on-surface font-body-md antialiased overflow-hidden flex selection:bg-secondary/10 selection:text-secondary">
      {/* Global SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen py-6 px-4 bg-surface-container-lowest border-r border-border-subtle fixed left-0 top-0 w-70 z-50">
        <div className="flex items-center gap-3 px-4 mb-8">
          <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-on-secondary font-headline-md font-bold">
            L
          </div>
          <div>
            <h1 className="text-xl font-headline-md font-bold text-on-surface leading-tight">
              Lumina
            </h1>
            <p className="text-xs font-medium text-on-surface-variant">
              Modern Scholastic
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 grow">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary border-l-4 border-secondary bg-surface-container hover:bg-surface-container-low transition-colors duration-200 active:scale-[0.99]"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-body-md text-sm font-bold">Dashboard</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-body-md text-sm font-medium">My Courses</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200"
          >
            <Medal className="w-5 h-5" />
            <span className="font-body-md text-sm font-medium">
              Achievements
            </span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200"
          >
            <Settings className="w-5 h-5" />
            <span className="font-body-md text-sm font-medium">Settings</span>
          </Link>
        </div>

        <div className="mt-auto px-4">
          <button className="w-full py-3 px-4 rounded-lg bg-surface-container-highest text-secondary text-xs font-bold hover:bg-surface-container-high transition-colors border border-border-subtle uppercase tracking-wider">
            Upgrade to Pro
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[280px] h-screen overflow-hidden">
        {/* TopNavBar */}
        <header className="flex justify-between items-center h-16 px-4 md:px-8 bg-surface border-b border-border-subtle sticky top-0 w-full z-40">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-headline-md font-bold text-on-surface hidden lg:block tracking-tight">
              Lumina Learning
            </h2>
            <div className="relative w-full max-w-md ml-0 lg:ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-subtle bg-surface-container-lowest focus:ring-2 focus:ring-secondary focus:border-secondary transition-all font-body-sm text-sm outline-none placeholder:text-on-surface-variant"
                placeholder="Search courses..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* XP & Streak Widgets */}
            <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 rounded-full bg-surface-container-lowest border border-border-subtle">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="font-mono text-sm font-bold text-on-surface">
                  1,240
                </span>
              </div>
              <div className="w-px h-4 bg-border-subtle"></div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-[#EF4444] text-[#EF4444]" />
                <span className="font-mono text-sm font-bold text-on-surface">
                  7
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-on-surface-variant hover:text-secondary transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface"></span>
              </button>
              <button className="w-8 h-8 rounded-full overflow-hidden border border-border-subtle">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                  alt="User profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <div className="max-w-container-max mx-auto flex flex-col gap-8 pb-20">
            {/* Welcome Header */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-headline-lg font-bold text-on-surface mb-2 tracking-tight">
                Welcome back, Alex!
              </h1>
              <p className="text-base text-on-surface-variant font-medium">
                You're making great progress. Let's keep the momentum going.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Main Content */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Continue Learning Hero */}
                <section className="bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-shadow group animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="md:w-2/5 h-48 md:h-auto bg-surface-tint relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                      alt="Systems Architecture Course"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 shadow-sm">
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Continue Learning
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                        Systems Architecture • Module 1
                      </p>
                      <h3 className="text-2xl font-headline-md font-bold text-on-surface mb-3 group-hover:text-secondary transition-colors">
                        Principles of Structural Design
                      </h3>
                      <div className="flex items-center gap-4 text-on-surface-variant text-sm font-medium mb-6">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>45 min remaining</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Video className="w-4 h-4" />
                          <span>Video Lesson</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full w-[28%]"></div>
                        </div>
                        <span className="text-sm text-on-surface font-bold font-mono">
                          28%
                        </span>
                      </div>
                      <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-secondary text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors shadow-sm self-start focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                        <PlayCircle className="w-5 h-5" />
                        Resume Lesson
                      </button>
                    </div>
                  </div>
                </section>

                {/* My Courses Grid */}
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                  <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-headline-md font-bold text-on-surface">
                      My Courses
                    </h2>
                    <Link
                      href="#"
                      className="text-xs font-bold text-secondary hover:underline uppercase tracking-wider"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Course Card 1 */}
                    <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-5 hover:border-secondary transition-colors cursor-pointer group shadow-sm hover:shadow-md">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary border border-border-subtle group-hover:bg-secondary group-hover:text-white transition-colors">
                          <PenTool className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold bg-surface-container text-on-surface-variant px-2 py-1 rounded">
                          UI/UX
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-on-surface group-hover:text-secondary transition-colors mb-2 leading-snug">
                        Advanced Prototyping
                      </h4>
                      <p className="text-sm text-on-surface-variant mb-4 font-medium">
                        Master complex interactions and micro-animations.
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-on-surface-variant uppercase tracking-wider">
                            Progress
                          </span>
                          <span className="text-on-surface font-mono">64%</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full w-[64%]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Course Card 2 */}
                    <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-5 hover:border-secondary transition-colors cursor-pointer group shadow-sm hover:shadow-md">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-[#009668] border border-border-subtle group-hover:bg-[#009668] group-hover:text-white transition-colors">
                          <Code className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold bg-surface-container text-on-surface-variant px-2 py-1 rounded">
                          Development
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-on-surface group-hover:text-secondary transition-colors mb-2 leading-snug">
                        Frontend Frameworks
                      </h4>
                      <p className="text-sm text-on-surface-variant mb-4 font-medium">
                        Deep dive into React, Vue, and modern state management.
                      </p>
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-on-surface-variant uppercase tracking-wider">
                            Progress
                          </span>
                          <span className="text-on-surface font-mono">12%</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full w-[12%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Upcoming Sessions */}
                <section className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                  <h2 className="text-xl font-headline-md font-bold text-on-surface mb-4">
                    Upcoming Live Sessions
                  </h2>
                  <div className="bg-surface-container-lowest rounded-xl border border-border-subtle flex flex-col shadow-sm overflow-hidden">
                    <div className="flex items-center gap-4 p-4 border-b border-border-subtle hover:bg-surface-container-low transition-colors cursor-pointer group">
                      <div className="w-14 h-14 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center border border-border-subtle group-hover:border-secondary group-hover:bg-surface-container transition-colors shadow-sm">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider leading-none mb-1 group-hover:text-secondary">
                          Oct
                        </span>
                        <span className="text-xl font-bold text-on-surface leading-none group-hover:text-secondary font-mono">
                          24
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">
                          Systems Architecture Q&A
                        </h5>
                        <p className="text-xs font-medium text-on-surface-variant mt-1">
                          2:00 PM - 3:30 PM • with Dr. Sarah Jenkins
                        </p>
                      </div>
                      <button className="px-4 py-2 rounded-lg border border-border-subtle text-on-surface text-xs font-bold hover:bg-surface-container-high hover:border-secondary transition-colors uppercase tracking-wider">
                        RSVP
                      </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
                      <div className="w-14 h-14 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center border border-border-subtle group-hover:border-secondary group-hover:bg-surface-container transition-colors shadow-sm">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider leading-none mb-1 group-hover:text-secondary">
                          Oct
                        </span>
                        <span className="text-xl font-bold text-on-surface leading-none group-hover:text-secondary font-mono">
                          26
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">
                          Peer Review: Prototyping
                        </h5>
                        <p className="text-xs font-medium text-on-surface-variant mt-1">
                          10:00 AM - 11:00 AM • Study Group Alpha
                        </p>
                      </div>
                      <button className="px-4 py-2 rounded-lg border border-border-subtle text-on-surface text-xs font-bold hover:bg-surface-container-high hover:border-secondary transition-colors uppercase tracking-wider">
                        Join
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Sidebar / Gamification */}
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                {/* Profile Stats */}
                <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6 flex flex-col items-center text-center shadow-sm">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-secondary mb-4 relative shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                      alt="User profile"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-7 h-7 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white font-mono shadow-sm">
                      L9
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface">
                    {user ? `${user.firstName} ${user.lastName}` : 'Student'}
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant mb-6 uppercase tracking-wider">
                    Level {stats?.level || 1} Learner
                  </p>

                  <div className="w-full flex justify-around items-center pt-6 border-t border-border-subtle">
                    <div className="flex flex-col items-center group cursor-default">
                      <Star className="w-6 h-6 fill-[#F59E0B] text-[#F59E0B] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xl font-bold text-on-surface leading-none mb-1 font-mono">
                        {stats?.xp || 0}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        XP Earned
                      </span>
                    </div>
                    <div className="w-px h-12 bg-border-subtle"></div>
                    <div className="flex flex-col items-center group cursor-default">
                      <Flame className="w-6 h-6 fill-[#EF4444] text-[#EF4444] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xl font-bold text-on-surface leading-none mb-1 font-mono">
                        {stats?.streak || 0}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Day Streak
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weekly Goals */}
                <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-secondary" />
                    Weekly Goals
                  </h3>

                  {statsLoading ? (
                    <div className="animate-pulse flex flex-col gap-4">
                      <div className="h-4 bg-surface-container-high rounded w-full"></div>
                      <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
                    </div>
                  ) : stats?.goals && stats.goals.length > 0 ? (
                    <div className="flex flex-col gap-6">
                      {stats.goals.slice(0, 2).map((goal: any, idx: number) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-on-surface">
                              {goal.title}
                            </span>
                            <span className="text-on-surface-variant font-mono">
                              {goal.progress}%
                            </span>
                          </div>
                          <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${idx % 2 === 0 ? 'bg-secondary' : 'bg-[#F59E0B]'}`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-on-surface-variant italic mb-3">
                        You don't have any active goals right now.
                      </p>
                      <button className="text-xs font-bold text-secondary uppercase tracking-wider hover:underline">
                        Set a Goal
                      </button>
                    </div>
                  )}
                </div>

                {/* Recent Achievements */}
                <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-on-surface">
                      Achievements
                    </h3>
                    <Link
                      href="/student/achievements"
                      className="text-xs font-bold text-secondary hover:underline uppercase tracking-wider"
                    >
                      View All
                    </Link>
                  </div>

                  {statsLoading ? (
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      <div className="w-14 h-14 bg-surface-container-high rounded-full animate-pulse"></div>
                      <div className="w-14 h-14 bg-surface-container-high rounded-full animate-pulse"></div>
                    </div>
                  ) : stats?.milestones && stats.milestones.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {stats.milestones.map((milestone: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center flex-shrink-0 w-20 text-center gap-3 group cursor-pointer"
                          title={milestone.description}
                        >
                          <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center border border-border-subtle shadow-sm group-hover:border-secondary transition-colors">
                            {idx % 2 === 0 ? (
                              <Award className="w-6 h-6 text-[#009668]" />
                            ) : (
                              <Timer className="w-6 h-6 text-[#0058be]" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-on-surface leading-tight line-clamp-2">
                            {milestone.title}
                          </span>
                        </div>
                      ))}

                      {/* Placeholder for next achievement */}
                      <div className="flex flex-col items-center flex-shrink-0 w-20 text-center gap-3 opacity-50 grayscale group cursor-pointer hover:opacity-100 hover:grayscale-0 transition-all">
                        <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center border border-border-subtle border-dashed group-hover:border-solid group-hover:border-secondary transition-colors">
                          <Trophy className="w-6 h-6 text-on-surface-variant group-hover:text-[#F59E0B]" />
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface leading-tight">
                          Next Goal
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-surface-container-lowest border border-dashed border-border-subtle rounded-xl">
                      <Trophy className="w-8 h-8 text-on-surface-variant mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-on-surface-variant italic mb-3">
                        No achievements yet.
                      </p>
                      <p className="text-xs font-bold text-secondary">
                        Complete lessons to earn XP!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
