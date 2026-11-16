'use client';

import React from 'react';
import Link from 'next/link';
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
  ChevronRight,
  Bookmark,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Subtitles,
  Maximize,
  Lightbulb,
  Clock,
  CheckCircle2,
  ChevronDown,
  PlayCircle,
  Lock,
  Key,
} from 'lucide-react';

export default function AltLearn1Page() {
  return (
    <div className="h-screen bg-background text-on-surface font-body-md antialiased overflow-hidden flex selection:bg-secondary/10 selection:text-secondary">
      {/* Global SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen py-6 px-4 bg-surface-container-lowest border-r border-border-subtle fixed left-0 top-0 w-70 z-50">
        <div className="flex items-center gap-3 px-4 mb-8">
          <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-on-secondary font-headline-md font-bold">
            L
          </div>
          <div>
            <h1 className="text-xl font-headline-md font-bold text-on-surface">
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-body-md text-sm font-medium">Dashboard</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary border-l-4 border-secondary bg-surface-container hover:bg-surface-container-low transition-colors duration-200 active:scale-[0.99]"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-body-md text-sm font-bold">My Courses</span>
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
      <div className="flex-1 flex flex-col md:ml-[280px] md:mr-[320px] h-screen overflow-hidden">
        {/* TopNavBar */}
        <header className="flex justify-between items-center h-16 px-4 md:px-6 bg-surface border-b border-border-subtle sticky top-0 w-full z-40">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-headline-md font-bold text-on-surface hidden lg:block">
              Lumina Learning
            </h2>
            <div className="relative w-full max-w-md lg:ml-4">
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <div className="max-w-container-max mx-auto flex flex-col gap-6 pb-20">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
              <Link href="#" className="hover:text-secondary transition-colors">
                Courses
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="#" className="hover:text-secondary transition-colors">
                Systems Architecture
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-on-surface font-bold">
                Principles of Structural Design
              </span>
            </nav>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Module 1 • Lesson 2 of 15
                </p>
                <h1 className="text-3xl md:text-4xl font-headline-lg font-bold text-on-surface tracking-tight">
                  Principles of Structural Design
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg border border-border-subtle text-on-surface text-xs font-bold flex items-center gap-2 hover:bg-surface-container-low transition-colors bg-surface-container-lowest uppercase tracking-wider">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button className="px-6 py-2 rounded-lg bg-secondary text-white text-xs font-bold flex items-center gap-2 hover:bg-secondary/90 transition-colors shadow-sm uppercase tracking-wider focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  Next Lesson
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-subtle animate-in fade-in slide-in-from-bottom-6 duration-700">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider whitespace-nowrap">
                Course Progress
              </span>
              <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full w-[28%]"></div>
              </div>
              <span className="font-mono text-sm text-secondary font-bold">
                28%
              </span>
            </div>

            {/* Video Player Container */}
            <div className="rounded-xl overflow-hidden bg-black aspect-video relative group shadow-sm border border-border-subtle animate-in fade-in zoom-in-95 duration-700 delay-100">
              {/* Placeholder Video Image */}
              <div className="absolute inset-0 bg-surface-tint">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                  alt="Video presentation"
                  fill
                  className="object-cover opacity-80"
                />
              </div>

              {/* Play Button Overlay */}
              <button className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-all focus:outline-none">
                <div className="w-16 h-16 rounded-full bg-secondary/90 flex items-center justify-center backdrop-blur-sm text-white shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current" />
                </div>
              </button>

              {/* Custom Controls (Bottom) */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                {/* Scrub Bar */}
                <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer relative group/scrub">
                  <div className="absolute top-0 left-0 h-full bg-secondary rounded-full w-[45%]"></div>
                  <div className="absolute top-1/2 left-[45%] -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/scrub:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex justify-between items-center text-white pt-2">
                  <div className="flex items-center gap-4">
                    <button className="hover:text-secondary transition-colors">
                      <Pause className="w-5 h-5 fill-current" />
                    </button>
                    <button className="hover:text-secondary transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-xs font-medium text-white/80">
                      12:34 / 45:00
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-xs font-bold hover:text-secondary transition-colors">
                      1x
                    </button>
                    <button className="hover:text-secondary transition-colors">
                      <Subtitles className="w-5 h-5" />
                    </button>
                    <button className="hover:text-secondary transition-colors">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabbed Interface */}
            <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {/* Tabs Header */}
              <div className="flex gap-8 border-b border-border-subtle mb-6">
                <button className="pb-4 text-sm text-secondary border-b-2 border-secondary font-bold">
                  Overview
                </button>
                <button className="pb-4 text-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Resources
                </button>
                <button className="pb-4 text-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Notes
                </button>
              </div>

              {/* Tab Content: Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <h3 className="text-2xl font-headline-md font-bold text-on-surface">
                    About this lesson
                  </h3>
                  <p className="text-base text-on-surface-variant leading-relaxed font-medium">
                    In this foundational lesson, we explore the core principles
                    that dictate structural design in modern systems
                    architecture. You'll learn how to balance scalability with
                    performance, and understand the trade-offs between
                    monolithic and microservice approaches. This conceptual
                    framework is essential for the practical coding challenges
                    in subsequent modules.
                  </p>

                  <div className="mt-4 p-4 rounded-lg bg-surface-container border border-border-subtle border-l-4 border-l-secondary">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-secondary" />
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                        Pro Tip
                      </h4>
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium">
                      Pay special attention to the section on state management;
                      it's a common stumbling block in advanced assessments.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Duration Card */}
                  <div className="p-4 rounded-xl border border-border-subtle bg-surface-bg flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant border border-border-subtle">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Duration
                      </p>
                      <p className="text-xl font-headline-md font-bold text-on-surface">
                        45 min
                      </p>
                    </div>
                  </div>

                  {/* Key Concepts Card */}
                  <div className="p-5 rounded-xl border border-border-subtle bg-surface-bg flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                      Key Concepts
                    </h4>
                    <ul className="flex flex-col gap-3 text-sm text-on-surface-variant font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        Coupling vs. Cohesion
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        CAP Theorem Basics
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        Design Patterns Overview
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Right Curriculum Sidebar (Course Nav) */}
      <aside className="hidden md:flex flex-col h-[calc(100vh-64px)] w-[320px] fixed right-0 top-16 bg-surface-container-lowest border-l border-border-subtle z-30">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border-subtle">
          <h2 className="text-xl font-headline-md font-bold text-on-surface mb-2">
            UI Design Mastery
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              12 of 45 lessons
            </span>
            <span className="font-mono text-sm text-secondary font-bold">
              28%
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full w-[28%]"></div>
          </div>
        </div>

        {/* Scrollable Curriculum List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-hide">
          {/* Module Accordion Header */}
          <button className="flex items-center justify-between w-full p-2 mb-2 group outline-none">
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                Module 1
              </span>
              <span className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                Foundations
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-on-surface-variant" />
          </button>

          {/* Lesson Items */}
          {/* Completed */}
          <Link
            href="#"
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors group"
          >
            <div className="mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-[#009668] fill-[#009668]/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-on-surface font-medium line-through opacity-70 group-hover:opacity-100 transition-opacity">
                Introduction to Systems
              </span>
              <span className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-wider">
                15 min • Video
              </span>
            </div>
          </Link>

          {/* Current Playing State */}
          <Link
            href="#"
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20 transition-all relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
            <div className="mt-0.5 ml-1">
              <PlayCircle className="w-5 h-5 text-secondary fill-secondary/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-secondary font-bold">
                Principles of Structural Design
              </span>
              <span className="text-xs font-bold text-secondary mt-1 flex items-center gap-1 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                Now Playing • 45 min
              </span>
            </div>
          </Link>

          {/* Locked */}
          <div className="flex items-start gap-3 p-3 rounded-lg opacity-60 cursor-not-allowed">
            <div className="mt-0.5">
              <Lock className="w-5 h-5 text-on-surface-variant" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-on-surface-variant font-bold">
                Edge Computing Basics
              </span>
              <span className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-wider">
                30 min • Reading
              </span>
            </div>
          </div>

          {/* Locked */}
          <div className="flex items-start gap-3 p-3 rounded-lg opacity-60 cursor-not-allowed">
            <div className="mt-0.5">
              <Lock className="w-5 h-5 text-on-surface-variant" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-on-surface-variant font-bold">
                Scalability and Growth
              </span>
              <span className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-wider">
                60 min • Assessment
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border-subtle my-2"></div>

          {/* Next Module Header (Collapsed) */}
          <button className="flex items-center justify-between w-full p-2 group opacity-60 hover:opacity-100 transition-opacity outline-none">
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider group-hover:text-secondary transition-colors">
                Module 2
              </span>
              <span className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                Data Structures
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors" />
          </button>
        </div>

        {/* Bottom Widget */}
        <div className="p-6 border-t border-border-subtle bg-surface-container-lowest">
          <div className="p-4 rounded-xl bg-linear-to-br from-surface-container-low to-surface-container-high border border-border-subtle shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-border-subtle">
                <Key className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Next Module Unlock
              </span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant mb-3">
              Complete 2 more lessons to unlock Module 2.
            </p>
            <div className="flex gap-1">
              <div className="h-1.5 flex-1 bg-secondary rounded-full shadow-sm"></div>
              <div className="h-1.5 flex-1 bg-secondary rounded-full shadow-sm"></div>
              <div className="h-1.5 flex-1 bg-surface-variant rounded-full border border-border-subtle"></div>
              <div className="h-1.5 flex-1 bg-surface-variant rounded-full border border-border-subtle"></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
