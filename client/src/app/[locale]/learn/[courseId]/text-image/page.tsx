'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  Medal,
  Settings,
  GraduationCap,
  ChevronRight,
  Bell,
  Bookmark,
  ArrowRight,
  List,
  Lightbulb,
  ChevronUp,
  CheckCircle2,
  FileText,
  Lock,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

export default function TextImageLearnPage() {
  return (
    <div className="bg-surface-bg text-on-surface h-screen overflow-hidden flex font-body-md text-base selection:bg-secondary/10 selection:text-secondary">
      {/* Global Side Navigation (Left) */}
      <nav className="hidden md:flex flex-col bg-surface border-r border-border-subtle h-full w-70 fixed left-0 top-0 z-40 py-8">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-headline-md leading-tight font-bold text-secondary">
              Lumina Learning
            </h1>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Premium Scholar
            </p>
          </div>
        </div>

        <ul className="flex-1 flex flex-col gap-1 w-full">
          <li>
            <Link
              href="#"
              className="text-on-surface-variant flex items-center px-6 py-3 hover:bg-surface-container-low transition-all"
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
          </li>
          <li>
            {/* Active State */}
            <Link
              href="#"
              className="text-secondary font-bold border-l-4 border-secondary pl-[20px] flex items-center py-3 bg-surface-container-low"
            >
              <BookOpen className="w-5 h-5 mr-3 fill-secondary/10" />
              <span className="font-bold text-sm">My Courses</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-on-surface-variant flex items-center px-6 py-3 hover:bg-surface-container-low transition-all"
            >
              <Medal className="w-5 h-5 mr-3" />
              <span className="font-medium text-sm">Achievements</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-on-surface-variant flex items-center px-6 py-3 hover:bg-surface-container-low transition-all"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium text-sm">Settings</span>
            </Link>
          </li>
        </ul>

        <div className="px-6 mt-auto">
          <div className="bg-surface-container p-4 rounded-2xl border border-border-subtle shadow-sm">
            <p className="text-xs font-medium text-on-surface-variant mb-3">
              Upgrade to Pro for unlimited access.
            </p>
            <button className="w-full bg-secondary text-white text-xs font-bold py-2 rounded-lg hover:bg-secondary/90 transition-colors uppercase tracking-wider shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2">
              Upgrade Pro
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full border border-border-subtle object-cover"
            />
            <div>
              <p className="text-sm font-bold text-on-surface leading-tight">
                Sarah Jenkins
              </p>
              <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Student
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] xl:mr-[320px] h-full overflow-y-auto bg-surface-bg relative flex flex-col">
        {/* Top App Bar (Workspace Header) */}
        <header className="bg-surface-container-lowest border-b border-border-subtle sticky top-0 z-30 px-4 md:px-10 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
            <Link href="#" className="hover:text-secondary transition-colors">
              Courses
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="#" className="hover:text-secondary transition-colors">
              UI Design Mastery
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-on-surface font-bold">
              Principles of Structural Design
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Workspace Content */}
        <div className="p-4 md:p-10 max-w-container-max mx-auto w-full flex-1 pb-24">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline-lg font-bold text-on-surface mb-2 tracking-tight">
                Principles of Structural Design
              </h2>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Module 1, Lesson 2
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-border-subtle text-on-surface text-xs font-bold hover:bg-surface-container-low transition-colors flex items-center gap-2 bg-surface-card shadow-sm uppercase tracking-wider">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
              <button className="px-6 py-2 rounded-lg bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2 shadow-sm uppercase tracking-wider focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lesson Highlights Bar */}
          <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex-1">
              <h4 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                <List className="w-5 h-5" />
                Lesson Highlights
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-on-surface-variant font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{' '}
                  The 12-Column Grid Framework
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{' '}
                  Baseline Rhythms and Vertical Spacing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{' '}
                  Hierarchical Spatial Relationships
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{' '}
                  Scaling for Responsive Breakpoints
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center bg-surface-card p-4 rounded-xl border border-border-subtle shadow-sm min-w-[140px]">
              <span className="text-4xl font-headline-lg font-bold text-secondary">
                15
              </span>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                Min Read
              </span>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="flex border-b border-border-subtle px-2">
              <button className="px-6 py-4 text-sm text-secondary border-b-2 border-secondary font-bold focus:outline-none">
                Overview
              </button>
              <button className="px-6 py-4 text-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium focus:outline-none">
                Resources (3)
              </button>
              <button className="px-6 py-4 text-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium focus:outline-none">
                Notes
              </button>
            </div>

            <div className="p-8">
              <article className="max-w-3xl mx-auto py-4">
                <h1 className="text-3xl font-headline-lg font-bold text-on-surface mb-6 leading-tight tracking-tight">
                  Foundations of Digital Architecture
                </h1>

                <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
                  Structural design is the backbone of any successful user
                  interface. It is the invisible framework that organizes
                  content, guides user attention, and ensures a predictable,
                  harmonious experience across varying screen sizes. In this
                  lesson, we explore how to move beyond arbitrary placement
                  toward a systematic approach to layout.
                </p>

                <figure className="mb-10">
                  <div className="w-full relative aspect-video rounded-2xl border border-border-subtle shadow-md overflow-hidden mb-3">
                    <Image
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                      alt="Grid Layout Example"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-center text-sm font-medium text-on-surface-variant italic">
                    Visualizing the 12-column grid system in a complex dashboard
                    layout.
                  </figcaption>
                </figure>

                <h2 className="text-2xl font-headline-md font-bold text-on-surface mt-12 mb-4 tracking-tight">
                  The 12-Column Grid Framework
                </h2>

                <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
                  The 12-column grid is a industry standard for a reason: its
                  mathematical flexibility. Twelve is divisible by 2, 3, 4, and
                  6, allowing designers to create perfectly balanced layouts of
                  halves, thirds, quarters, and more without breaking the
                  system.
                </p>

                <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
                  When defining your grid, consider the <strong>Gutter</strong>
                  —the space between columns—and the <strong>Margin</strong>—the
                  space between the content and the edge of the viewport. A
                  standard desktop configuration often utilizes a 24px gutter
                  and 40px margins to provide enough 'breathing room' for
                  complex components.
                </p>

                <div className="bg-surface-container-low border-l-4 border-secondary p-6 rounded-r-xl mb-10 shadow-sm">
                  <h4 className="text-base font-bold text-on-surface mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-secondary" />
                    Pro Tip
                  </h4>
                  <p className="text-on-surface-variant italic font-medium leading-relaxed">
                    Always align your grid to a base-8 pixel unit. This ensures
                    that your columns, gutters, and internal component spacing
                    all share a common mathematical denominator, leading to a
                    much cleaner visual result.
                  </p>
                </div>

                <h2 className="text-2xl font-headline-md font-bold text-on-surface mt-12 mb-4 tracking-tight">
                  Vertical Rhythm & Baseline Grids
                </h2>

                <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
                  While horizontal grids are widely understood, vertical rhythm
                  is often overlooked. A baseline grid (typically 4px or 8px)
                  acts as the 'lines on the paper' for your design. By ensuring
                  that the line-height of your typography and the height of your
                  containers are multiples of your baseline, you create a
                  cohesive vertical flow that makes the UI feel significantly
                  more professional.
                </p>
              </article>
            </div>
          </div>
        </div>
      </main>

      {/* Curriculum Sidebar (Right) */}
      <aside className="hidden xl:flex flex-col fixed right-0 top-0 h-full w-[320px] bg-surface-container-low border-l border-border-subtle z-40">
        {/* Sidebar Header & Progress */}
        <div className="p-6 border-b border-border-subtle bg-surface-card">
          <h2 className="text-xl font-headline-md leading-tight font-bold text-on-surface mb-2">
            UI Design Mastery
          </h2>
          <p className="text-xs font-bold text-on-surface-variant mb-4 uppercase tracking-wider">
            Course Progress
          </p>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-on-surface">28% Completed</span>
            <span className="text-on-surface-variant">12 of 45 Lessons</span>
          </div>
          <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full w-[28%]"></div>
          </div>
        </div>

        {/* Curriculum List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {/* Module 1 Accordion (Open) */}
          <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden shadow-sm">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-container-lowest transition-colors focus:outline-none">
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">
                  Module 1
                </span>
                <span className="text-sm font-bold text-on-surface">
                  Foundations
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-on-surface-variant" />
            </button>
            <ul className="flex flex-col pb-2">
              {/* Completed Lesson */}
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-lowest transition-colors group"
                >
                  <div className="w-6 flex justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#009668] fill-[#009668]/10 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors line-clamp-1">
                    Introduction to Systems
                  </span>
                </Link>
              </li>
              {/* Active Lesson */}
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-4 py-2 bg-[#d8e2ff]/30 border-l-[3px] border-secondary relative group"
                >
                  <div className="w-6 flex justify-center">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-sm font-bold text-secondary line-clamp-1">
                    Principles of Structural Design
                  </span>
                </Link>
              </li>
              {/* Locked Lesson */}
              <li>
                <div className="flex items-center gap-3 px-4 py-2 opacity-60 cursor-not-allowed">
                  <div className="w-6 flex justify-center">
                    <Lock className="w-5 h-5 text-outline" />
                  </div>
                  <span className="text-sm font-medium text-outline line-clamp-1">
                    Scalability & Components
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Module 2 Accordion (Closed) */}
          <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden opacity-80 hover:opacity-100 transition-opacity shadow-sm">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-container-lowest transition-colors focus:outline-none">
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">
                  Module 2
                </span>
                <span className="text-sm font-bold text-on-surface">
                  Color & Typography
                </span>
              </div>
              <ChevronDown className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          {/* Exam Prep (Locked) */}
          <div className="mt-8">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-3 px-2">
              Assessments
            </h4>
            <div className="bg-surface-card rounded-xl border border-border-subtle border-dashed p-4 flex items-center gap-3 opacity-60 cursor-not-allowed shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center border border-border-subtle">
                <HelpCircle className="w-5 h-5 text-outline" />
              </div>
              <div>
                <p className="text-sm font-bold text-outline leading-tight">
                  Exam Prep
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-outline mt-1">
                  Requires Module 1-3
                </p>
              </div>
              <Lock className="w-5 h-5 text-outline ml-auto" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
