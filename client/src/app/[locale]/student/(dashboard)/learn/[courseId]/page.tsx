'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ChevronRight,
  Bookmark,
  ArrowRight,
  Play,
  SkipForward,
  Volume2,
  Subtitles,
  Settings,
  Maximize,
  Lightbulb,
  Timer,
  FileText,
  Download,
  File,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  GraduationCap,
  Check,
  Lock,
  Info,
  Pause,
  X,
} from 'lucide-react';

export default function CourseLearningPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'resources' | 'notes'
  >('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileCurriculumOpen, setIsMobileCurriculumOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-64px)] selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Main Content Area */}
      <main className="flex-1 xl:mr-80 bg-surface-bg p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs & Header */}
          <nav className="flex items-center gap-2 text-on-surface-variant font-label-md mb-4 text-xs font-bold">
            <span>Courses</span>
            <ChevronRight className="w-4 h-4" />
            <span>Systems Architecture</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-secondary font-semibold">
              Principles of Structural Design
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-2">
                Principles of Structural Design
              </h1>
              <p className="text-on-surface-variant font-body-md text-sm md:text-base">
                Module 1 • Lesson 2 of 15
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-on-surface-variant font-semibold border border-outline-variant rounded-lg hover:bg-surface-container transition-all font-label-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                <Bookmark className="w-4 h-4" /> Save
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 shadow-md hover:shadow-lg transition-all active:scale-95 font-label-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                Next Lesson <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Curriculum Trigger */}
          <div className="xl:hidden flex items-center justify-between p-3.5 mb-6 rounded-xl bg-surface-container/70 border border-border-subtle">
            <div className="flex items-center gap-2 text-xs">
              <GraduationCap className="w-4 h-4 text-secondary" />
              <span className="font-semibold text-on-surface">
                12 of 45 lessons complete
              </span>
            </div>
            <button
              onClick={() => setIsMobileCurriculumOpen(true)}
              className="px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded-lg hover:bg-secondary/90 shadow-sm"
            >
              Curriculum Roadmap
            </button>
          </div>

          {/* Progress Tracker */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label-md text-xs text-on-surface-variant font-bold tracking-wider">
                COURSE PROGRESS
              </span>
              <span className="font-code-sm text-sm text-secondary font-bold">
                28% COMPLETE
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-1000"
                style={{ width: '28%' }}
              ></div>
            </div>
          </div>

          {/* Video Player Section */}
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl group border border-outline-variant/20 mb-8 cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <Image
              fill
              alt="Video Player"
              className={`object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-80'}`}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxP0bhiwBBk3kD-QPT9t_13yFdinx82YPNssKksTejCfJbCbTk13bb4ylbqkGVPnioC66RgMncJbnvoRc6j_RTI2hIZ7AZOK8qC80VhpbOxEQcGigrRQkuiSIElrXkp8WSNBTUuR5CDPPMS7PvCIxTZIOTgxouUI4jBLmGdavQEtwf_Qdd49Vj42IPtiHkW6770wY2QxzIAtaDlvtEZDY2TUejCLHCqBb5eKKcm0U5aHJ3YQ30FT-aT4ZUZZna536aQM0Ce6A2_14"
            />

            {/* Play Overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transform group-hover:scale-110 transition-transform">
                <Play className="text-white w-10 h-10 fill-current ml-1" />
              </div>
            </div>

            {/* Custom Player Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-full h-1 bg-white/30 rounded-full mb-4 relative cursor-pointer">
                <div className="absolute top-0 left-0 h-full bg-secondary w-1/3 rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-white">
                  {isPlaying ? (
                    <Pause className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors fill-current" />
                  ) : (
                    <Play className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors fill-current" />
                  )}
                  <SkipForward className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors fill-current" />
                  <Volume2 className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors" />
                  <span className="font-code-sm text-sm font-medium">
                    12:45 / 45:00
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <Subtitles className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors" />
                  <Settings className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors" />
                  <Maximize className="w-5 h-5 cursor-pointer hover:text-secondary-fixed transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-1 mb-10 shadow-sm">
            <div className="flex border-b border-border-subtle mb-6 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-8 py-4 font-label-md text-sm whitespace-nowrap transition-all focus:outline-none ${activeTab === 'overview' ? 'font-bold text-secondary border-b-2 border-secondary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-8 py-4 font-label-md text-sm whitespace-nowrap transition-all focus:outline-none ${activeTab === 'resources' ? 'font-bold text-secondary border-b-2 border-secondary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
              >
                Resources
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-8 py-4 font-label-md text-sm whitespace-nowrap transition-all focus:outline-none ${activeTab === 'notes' ? 'font-bold text-secondary border-b-2 border-secondary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
              >
                Notes
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 md:p-6 min-h-[300px]">
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mb-4">
                    About this lesson
                  </h3>
                  <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
                    In this session, we dive deep into the fundamental
                    principles that govern modern structural design. We will
                    analyze the relationship between load-bearing capacities and
                    material efficiency, focusing on how these concepts
                    transition from traditional skyscrapers to decentralized
                    edge computing nodes.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                      <Lightbulb className="text-secondary w-6 h-6 mb-2" />
                      <p className="font-label-md font-bold text-sm text-on-surface">
                        Key Concepts
                      </p>
                      <p className="text-sm text-on-surface-variant mt-1">
                        Stress, Strain, and Material Resilience.
                      </p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                      <Timer className="text-secondary w-6 h-6 mb-2" />
                      <p className="font-label-md font-bold text-sm text-on-surface">
                        Duration
                      </p>
                      <p className="text-sm text-on-surface-variant mt-1">
                        45 Minutes of high-intensity content.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low border border-border-subtle rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <FileText className="text-error w-6 h-6" />
                      <div>
                        <p className="font-label-md font-bold text-sm text-on-surface">
                          Structural_Diagrams_V2.pdf
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          2.4 MB • PDF Document
                        </p>
                      </div>
                    </div>
                    <Download className="text-on-surface-variant w-5 h-5 group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-low border border-border-subtle rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <File className="text-secondary w-6 h-6" />
                      <div>
                        <p className="font-label-md font-bold text-sm text-on-surface">
                          Reading_Material_Week1.docx
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          1.1 MB • Word Document
                        </p>
                      </div>
                    </div>
                    <Download className="text-on-surface-variant w-5 h-5 group-hover:text-secondary transition-colors" />
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border border-border-subtle rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-secondary focus-within:border-secondary transition-all">
                    <div className="bg-surface-container-low px-4 py-2 border-b border-border-subtle flex gap-4">
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
                      className="w-full h-40 p-4 font-body-md text-sm focus:ring-0 border-none resize-none placeholder:text-on-surface-variant/40 outline-none bg-surface-container-lowest"
                      placeholder="Type your personal lesson notes here..."
                    ></textarea>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-6 py-2 bg-secondary text-white font-bold rounded-lg font-label-md text-sm hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 shadow-sm">
                      Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Right SideNavBar (Curriculum) */}
      <aside className="hidden xl:flex fixed right-0 top-16 h-[calc(100vh-64px)] flex-col p-6 w-80 bg-surface-container-lowest border-l border-border-subtle z-30 shadow-sm">
        <div className="mb-6">
          <h2 className="font-headline-md text-lg text-on-surface font-bold mb-1">
            UI Design Mastery
          </h2>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <GraduationCap className="w-4 h-4" />
            <p className="font-body-sm text-xs font-medium">
              12 of 45 lessons complete
            </p>
          </div>
        </div>

        <div className="mb-8 overflow-y-auto hide-scrollbar flex-1">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
            Module 1: Advanced Systems Architecture
          </p>
          <div className="space-y-2">
            {/* Completed Item */}
            <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition-all cursor-pointer">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-tertiary-fixed-dim flex items-center justify-center">
                <Check className="w-3 h-3 text-on-tertiary-fixed font-bold" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface-variant">
                  Principles of Structural Design
                </p>
                <p className="text-xs text-on-surface-variant/60 mt-0.5">
                  Video • 12m
                </p>
              </div>
            </div>

            {/* Active Item */}
            <div className="flex items-start gap-3 p-3 bg-surface-container-high rounded-lg translate-x-1 transition-transform border-l-4 border-secondary shadow-sm">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center bg-white">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-secondary">
                  Introduction to Neural Nets
                </p>
                <p className="text-xs text-secondary/70 mt-0.5 font-medium">
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
                <p className="text-sm font-medium text-on-surface-variant">
                  Edge Computing Basics
                </p>
                <p className="text-xs text-on-surface-variant/60 mt-0.5">
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
                <p className="text-sm font-medium text-on-surface-variant">
                  Scalability and Growth
                </p>
                <p className="text-xs text-on-surface-variant/60 mt-0.5">
                  Reading • 15m
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border-subtle">
          <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle">
            <p className="font-label-md font-bold text-sm text-on-surface mb-2">
              Next Module Unlock
            </p>
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-secondary w-4 h-4" />
              <p className="text-xs text-on-surface-variant">
                Finish all quizzes to unlock Module 2.
              </p>
            </div>
            <button className="w-full py-2.5 bg-surface-container-highest text-on-surface font-bold rounded-lg text-xs opacity-50 cursor-not-allowed">
              Locked Content
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Curriculum Slide-Over Drawer */}
      {isMobileCurriculumOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileCurriculumOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-surface-bg border-l border-border-subtle p-6 flex flex-col z-50 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
              <div>
                <h3 className="font-bold text-sm text-on-surface">
                  Course Curriculum
                </h3>
                <p className="text-xs text-on-surface-variant">
                  12 of 45 lessons complete
                </p>
              </div>
              <button
                onClick={() => setIsMobileCurriculumOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              <div className="group flex items-start gap-3 p-3 rounded-lg bg-surface-container/50">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-tertiary-fixed-dim flex items-center justify-center">
                  <Check className="w-3 h-3 text-on-tertiary-fixed font-bold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">
                    Principles of Structural Design
                  </p>
                  <p className="text-xs text-on-surface-variant/70 mt-0.5">
                    Video • 12m • Completed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg border-l-4 border-secondary">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center bg-white">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-secondary">
                    Introduction to Neural Nets
                  </p>
                  <p className="text-xs text-secondary/80 mt-0.5 font-medium">
                    Now Playing • 45m
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg opacity-60">
                <div className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center text-on-surface-variant">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface-variant">
                    Edge Computing Basics
                  </p>
                  <p className="text-xs text-on-surface-variant/60 mt-0.5">
                    Quiz • 10 Questions
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle mt-4">
              <button
                onClick={() => setIsMobileCurriculumOpen(false)}
                className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
              >
                Resume Current Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
