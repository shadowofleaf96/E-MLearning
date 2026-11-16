'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  Bell,
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  Medal,
  Settings,
  ChevronRight,
  Bookmark,
  ArrowRight,
  Play,
  SkipForward,
  Volume2,
  Subtitles,
  Maximize,
  Lightbulb,
  Timer,
  File,
  Download,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  History,
  Check,
  Lock,
  Info,
  Pause,
} from 'lucide-react';

export default function VideoLearnPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-surface-bg font-body-md text-on-surface text-base selection:bg-secondary/10 selection:text-secondary">
      {/* Top Navigation Anchor */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-10 w-full h-16 bg-surface border-b border-border-subtle shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-headline-lg text-secondary font-bold tracking-tight">
            Lumina Learning
          </span>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#"
              className="text-on-surface-variant font-medium text-sm hover:text-secondary transition-colors uppercase tracking-wider"
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className="text-secondary font-bold border-b-2 border-secondary pb-1 text-sm uppercase tracking-wider"
            >
              My Learning
            </Link>
            <Link
              href="#"
              className="text-on-surface-variant font-medium text-sm hover:text-secondary transition-colors uppercase tracking-wider"
            >
              Course Catalog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-surface-container px-3 py-1.5 rounded-full shadow-sm">
            <Award className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B] mr-1" />
            <span className="font-mono text-on-surface font-bold text-sm">
              1,240 XP
            </span>
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all focus:outline-none">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-secondary-container border border-outline-variant overflow-hidden shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
              alt="Avatar"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left SideNavBar (Platform Nav) */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] flex-col p-4 w-72 bg-surface-container-low border-r border-border-subtle z-40 hidden xl:flex">
          <div className="mb-8 p-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-on-surface font-bold">
                  Lumina Student
                </p>
                <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                  Pro Plan Member
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all text-sm font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              Home
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 bg-secondary/10 text-secondary font-bold border-l-4 border-secondary rounded-r-lg transition-transform scale-[0.98] text-sm"
            >
              <BookOpen className="w-5 h-5 fill-secondary/20" />
              My Courses
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all text-sm font-medium"
            >
              <FileText className="w-5 h-5" />
              Assignments
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all text-sm font-medium"
            >
              <Medal className="w-5 h-5" />
              Achievements
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all text-sm font-medium"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 xl:ml-72 xl:mr-80 bg-surface-bg p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs & Header */}
            <nav className="flex items-center gap-2 text-on-surface-variant text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span>Courses</span>
              <ChevronRight className="w-4 h-4" />
              <span>Systems Architecture</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-secondary font-bold">
                Principles of Structural Design
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div>
                <h1 className="text-3xl md:text-4xl font-headline-lg font-bold text-on-surface mb-2 tracking-tight">
                  Principles of Structural Design
                </h1>
                <p className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">
                  Module 1 • Lesson 2 of 15
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-on-surface-variant font-bold text-xs border border-outline-variant rounded-lg hover:bg-surface-container transition-all uppercase tracking-wider bg-surface-card shadow-sm">
                  <Bookmark className="w-4 h-4" /> Save
                </button>
                <button className="flex items-center gap-2 px-5 py-2 bg-secondary text-white font-bold text-xs rounded-lg hover:bg-secondary/90 transition-all transform active:scale-95 uppercase tracking-wider shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  Next Lesson <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                  COURSE PROGRESS
                </span>
                <span className="font-mono text-sm text-secondary font-bold">
                  28% COMPLETE
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden shadow-sm">
                <div className="h-full bg-secondary rounded-full w-[28%]"></div>
              </div>
            </div>

            {/* Video Player Section */}
            <div
              className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl group border border-outline-variant/20 mb-8 cursor-pointer animate-in fade-in zoom-in-95 duration-700 delay-100"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Image
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
                alt="Video Player"
                fill
                className="object-cover opacity-80"
              />

              {/* Play Overlay */}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transform group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-10 h-10 text-white fill-current ml-1" />
                </div>
              </div>

              {/* Custom Player Controls */}
              <div
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full h-1.5 bg-white/30 rounded-full mb-4 relative cursor-pointer group/scrub">
                  <div className="absolute top-0 left-0 h-full bg-secondary w-1/3 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/scrub:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-white">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-secondary-fixed transition-colors focus:outline-none"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current" />
                      )}
                    </button>
                    <button className="hover:text-secondary-fixed transition-colors focus:outline-none">
                      <SkipForward className="w-5 h-5 fill-current" />
                    </button>
                    <button className="hover:text-secondary-fixed transition-colors focus:outline-none">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-sm font-medium">
                      12:45 / 45:00
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <button className="hover:text-secondary-fixed transition-colors focus:outline-none">
                      <Subtitles className="w-5 h-5" />
                    </button>
                    <button className="hover:text-secondary-fixed transition-colors focus:outline-none">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button className="hover:text-secondary-fixed transition-colors focus:outline-none">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-1 mb-10 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="flex border-b border-border-subtle mb-2">
                <button
                  className={`px-8 py-4 text-sm transition-all focus:outline-none ${activeTab === 'overview' ? 'font-bold text-secondary border-b-2 border-secondary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-8 py-4 text-sm transition-all focus:outline-none ${activeTab === 'resources' ? 'font-bold text-secondary border-b-2 border-secondary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => setActiveTab('resources')}
                >
                  Resources
                </button>
                <button
                  className={`px-8 py-4 text-sm transition-all focus:outline-none ${activeTab === 'notes' ? 'font-bold text-secondary border-b-2 border-secondary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => setActiveTab('notes')}
                >
                  Notes
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="p-6 animate-in fade-in duration-300">
                  <h3 className="text-xl font-headline-md font-bold text-on-surface mb-4">
                    About this lesson
                  </h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed mb-6">
                    In this session, we dive deep into the fundamental
                    principles that govern modern structural design. We will
                    analyze the relationship between load-bearing capacities and
                    material efficiency, focusing on how these concepts
                    transition from traditional skyscrapers to decentralized
                    edge computing nodes.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-surface-container-low rounded-xl border border-border-subtle shadow-sm">
                      <Lightbulb className="w-6 h-6 text-secondary mb-3" />
                      <p className="text-sm font-bold text-on-surface uppercase tracking-wider mb-1">
                        Key Concepts
                      </p>
                      <p className="text-sm text-on-surface-variant font-medium">
                        Stress, Strain, and Material Resilience.
                      </p>
                    </div>
                    <div className="p-5 bg-surface-container-low rounded-xl border border-border-subtle shadow-sm">
                      <Timer className="w-6 h-6 text-secondary mb-3" />
                      <p className="text-sm font-bold text-on-surface uppercase tracking-wider mb-1">
                        Duration
                      </p>
                      <p className="text-sm text-on-surface-variant font-medium">
                        45 Minutes of high-intensity content.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="p-6 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low border border-border-subtle rounded-xl hover:bg-surface-container transition-colors cursor-pointer shadow-sm group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-error" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                          Structural_Diagrams_V2.pdf
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1 font-medium">
                          2.4 MB • PDF Document
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-container-low border border-border-subtle rounded-xl hover:bg-surface-container transition-colors cursor-pointer shadow-sm group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <File className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                          Reading_Material_Week1.docx
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1 font-medium">
                          1.1 MB • Word Document
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors" />
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="p-6 animate-in fade-in duration-300">
                  <div className="border border-border-subtle rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-surface-container-low px-4 py-3 border-b border-border-subtle flex gap-4">
                      <button className="text-on-surface-variant hover:text-on-surface focus:outline-none">
                        <Bold className="w-4 h-4" />
                      </button>
                      <button className="text-on-surface-variant hover:text-on-surface focus:outline-none">
                        <Italic className="w-4 h-4" />
                      </button>
                      <button className="text-on-surface-variant hover:text-on-surface focus:outline-none">
                        <List className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-outline-variant/40 self-center"></div>
                      <button className="text-on-surface-variant hover:text-on-surface focus:outline-none">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      className="w-full h-40 p-4 font-body-md text-sm focus:ring-0 focus:outline-none border-none resize-none placeholder:text-on-surface-variant/40"
                      placeholder="Type your personal lesson notes here..."
                    ></textarea>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-6 py-2 bg-secondary text-white font-bold rounded-lg text-sm uppercase tracking-wider hover:bg-secondary/90 transition-colors shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                      Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right SideNavBar (Curriculum) */}
        <aside className="fixed right-0 top-16 h-[calc(100vh-64px)] flex-col p-6 w-80 bg-surface-container-lowest border-l border-border-subtle z-30 hidden lg:flex">
          <div className="mb-6">
            <h2 className="text-lg font-headline-md text-on-surface font-bold mb-2 tracking-tight">
              UI Design Mastery
            </h2>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <History className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-wider">
                12 of 45 lessons complete
              </p>
            </div>
          </div>

          <div className="mb-8 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-4">
              Module 1: Advanced Systems Architecture
            </p>
            <div className="space-y-2">
              {/* Completed Item */}
              <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition-all cursor-pointer">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#009668]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Check className="w-3 h-3 text-[#009668] font-bold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Principles of Structural Design
                  </p>
                  <p className="text-[11px] text-on-surface-variant/80 font-medium uppercase tracking-wider mt-1">
                    Video • 12m
                  </p>
                </div>
              </div>

              {/* Active Item */}
              <div className="flex items-start gap-3 p-3 bg-secondary/5 rounded-lg translate-x-1 transition-transform border-l-[3px] border-secondary shadow-sm">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-secondary">
                    Introduction to Neural Nets
                  </p>
                  <p className="text-[11px] text-secondary/80 font-bold uppercase tracking-wider mt-1">
                    Video • 45m • Now Playing
                  </p>
                </div>
              </div>

              {/* Locked Item */}
              <div className="flex items-start gap-3 p-3 rounded-lg opacity-50 grayscale transition-all">
                <div className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center text-on-surface-variant">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface-variant">
                    Edge Computing Basics
                  </p>
                  <p className="text-[11px] text-on-surface-variant/80 font-medium uppercase tracking-wider mt-1">
                    Quiz • 10 Questions
                  </p>
                </div>
              </div>

              {/* Locked Item */}
              <div className="flex items-start gap-3 p-3 rounded-lg opacity-50 grayscale transition-all">
                <div className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center text-on-surface-variant">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface-variant">
                    Scalability and Growth
                  </p>
                  <p className="text-[11px] text-on-surface-variant/80 font-medium uppercase tracking-wider mt-1">
                    Reading • 15m
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border-subtle">
            <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle shadow-sm">
              <p className="text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                Next Module Unlock
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-secondary flex-shrink-0" />
                <p className="text-[11px] font-medium text-on-surface-variant leading-tight">
                  Finish all quizzes to unlock Module 2.
                </p>
              </div>
              <button className="w-full py-2 bg-surface-container-highest text-on-surface font-bold rounded-lg text-xs uppercase tracking-wider opacity-50 cursor-not-allowed">
                Locked Content
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
