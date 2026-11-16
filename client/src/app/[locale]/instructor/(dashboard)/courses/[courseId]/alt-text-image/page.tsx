'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Video,
  DollarSign,
  Settings,
  Plus,
  Search,
  Bell,
  MessageSquare,
  ChevronRight,
  Eye,
  Save,
  Rocket,
  ChevronDown,
  GripVertical,
  MoreVertical,
  PlayCircle,
  FileText,
  HelpCircle,
  Code,
  PlusCircle,
  Edit3,
  Paperclip,
  ChevronsUpDown,
  Image as ImageIcon,
  Type,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  ImagePlus,
  Check,
} from 'lucide-react';

export default function AltTextImageBuilderPage() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-surface-bg text-on-surface font-body-md selection:bg-secondary/20 h-screen overflow-hidden flex flex-col">
      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-280px)] h-16 bg-surface-container-lowest border-b border-border-subtle flex justify-between items-center px-4 md:px-10 z-40">
        <div className="flex items-center gap-6 flex-1">
          <span className="text-xl font-headline-md text-primary font-bold">
            Lumina Learning
          </span>
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-4 h-4" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-bg border border-border-subtle rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-sm transition-all"
              placeholder="Search courses, lessons, or files..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 text-on-surface-variant">
            <button className="hover:text-secondary transition-colors relative focus:outline-none">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <button className="hover:text-secondary transition-colors focus:outline-none hidden sm:block">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
          <div className="h-8 w-px bg-border-subtle hidden sm:block"></div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface leading-none">
                Prof. Elena Vance
              </p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">
                Senior Instructor
              </p>
            </div>
            <NextImage
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
              alt="Instructor Profile"
              width={40}
              height={40}
              className="rounded-full object-cover border-2 border-transparent group-hover:border-secondary transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16 h-full">
        {/* SideNavBar */}
        <aside className="fixed left-0 top-0 h-screen w-70 bg-surface-container-lowest border-r border-border-subtle flex-col py-6 z-50 hidden lg:flex">
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-sm">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-headline-md text-primary font-bold leading-none tracking-tight">
                EduStudio
              </h1>
              <p className="text-xs font-bold text-on-surface-variant opacity-70 uppercase tracking-wider mt-1">
                Instructor Portal
              </p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
            <Link
              href="/instructor"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 group text-sm font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/instructor/courses"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary font-bold border-l-4 border-secondary bg-surface-container-low group text-sm shadow-sm"
            >
              <BookOpen className="w-5 h-5 fill-secondary/20" />
              Course Builder
            </Link>
            <Link
              href="/instructor/analytics"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 group text-sm font-medium"
            >
              <BarChart2 className="w-5 h-5" />
              Student Analytics
            </Link>
            <Link
              href="/instructor/live"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 group text-sm font-medium"
            >
              <Video className="w-5 h-5" />
              Live Sessions
            </Link>
            <Link
              href="/instructor/earnings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 group text-sm font-medium"
            >
              <DollarSign className="w-5 h-5" />
              Earnings
            </Link>
            <Link
              href="/instructor/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 group text-sm font-medium"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="px-4 mt-auto pt-4 border-t border-border-subtle">
            <button className="w-full flex items-center justify-center gap-2 bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary/90 active:scale-95 transition-all shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2">
              <Plus className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">
                Create New Course
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-[280px] h-full flex flex-col relative overflow-hidden">
          {/* Sub-Header / Tool Bar */}
          <div className="bg-surface-container-lowest px-4 md:px-10 py-6 border-b border-border-subtle z-30 flex-shrink-0">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl md:text-3xl font-headline-lg font-bold text-primary tracking-tight">
                      Advanced React Frameworks
                    </h2>
                    <span className="px-2 py-0.5 bg-surface-container-high text-[#004395] text-[10px] font-bold rounded uppercase tracking-widest border border-secondary/20">
                      Draft
                    </span>
                  </div>
                  <nav className="flex items-center gap-2 mt-2 text-on-surface-variant text-xs font-medium">
                    <span>My Courses</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>Development</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-secondary font-bold">
                      Course Builder
                    </span>
                  </nav>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container border border-border-subtle transition-all active:scale-95 text-xs uppercase tracking-wider shadow-sm">
                  <Eye className="w-4 h-4" />
                  Preview Course
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container border border-border-subtle transition-all active:scale-95 text-xs uppercase tracking-wider shadow-sm">
                  <Save className="w-4 h-4" />
                  Save Progress
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-secondary text-white rounded-lg font-bold hover:shadow-lg hover:bg-secondary/90 transition-all active:scale-95 text-xs uppercase tracking-wider focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  <Rocket className="w-4 h-4 fill-current" />
                  Publish
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8 flex flex-col xl:flex-row gap-8 flex-1 overflow-hidden h-full">
            {/* Left Column: Curriculum Navigator */}
            <aside className="w-full xl:w-[320px] flex flex-col bg-surface-container-lowest rounded-xl border border-border-subtle shadow-sm overflow-hidden flex-shrink-0">
              <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-bright">
                <h3 className="font-headline-md font-bold text-primary text-lg tracking-tight">
                  Curriculum
                </h3>
                <button className="p-1 hover:bg-surface-container rounded-full text-secondary transition-colors focus:outline-none">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
                {/* Module 1 */}
                <div>
                  <div className="flex items-center justify-between mb-2 group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-5 h-5 text-outline-variant cursor-grab active:cursor-grabbing" />
                      <h4 className="font-bold text-on-surface text-sm">
                        Module 1: Foundations
                      </h4>
                    </div>
                    <MoreVertical className="w-4 h-4 text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2 ml-4 border-l-2 border-border-subtle pl-4">
                    <div className="flex items-center gap-3 p-2 hover:bg-surface-container rounded-lg group cursor-pointer transition-colors">
                      <PlayCircle className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                        1.1 Introduction
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-secondary/5 rounded-lg border-l-4 border-secondary group cursor-pointer shadow-sm">
                      <FileText className="w-4 h-4 text-secondary fill-secondary/10" />
                      <span className="text-sm font-bold text-secondary">
                        1.2 Dev Environment Setup
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-surface-container rounded-lg group cursor-pointer transition-colors">
                      <HelpCircle className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                        1.3 Baseline Quiz
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module 2 */}
                <div>
                  <div className="flex items-center justify-between mb-2 group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-5 h-5 text-outline-variant cursor-grab active:cursor-grabbing" />
                      <h4 className="font-bold text-on-surface text-sm">
                        Module 2: Hooks & Context
                      </h4>
                    </div>
                    <MoreVertical className="w-4 h-4 text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2 ml-4 border-l-2 border-border-subtle pl-4 opacity-70">
                    <div className="flex items-center gap-3 p-2 hover:bg-surface-container rounded-lg group cursor-pointer transition-colors">
                      <PlayCircle className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                        2.1 Advanced useEffect
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-surface-container rounded-lg group cursor-pointer transition-colors">
                      <Code className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                        2.2 Custom Hooks Challenge
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border-subtle mt-auto bg-surface-bright">
                <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border-subtle rounded-lg text-on-surface-variant hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all outline-none focus:ring-2 focus:ring-secondary focus:border-transparent">
                  <PlusCircle className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Add Module
                  </span>
                </button>
              </div>
            </aside>

            {/* Right Column: Lesson Workspace */}
            <section className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl border border-border-subtle shadow-sm overflow-hidden">
              {/* Workspace Tabs */}
              <div className="flex bg-surface-bright border-b border-border-subtle overflow-x-auto scrollbar-hide">
                <button className="px-6 md:px-8 py-4 border-b-2 border-secondary text-secondary font-bold flex items-center gap-2 text-sm whitespace-nowrap focus:outline-none">
                  <Edit3 className="w-4 h-4" />
                  Lesson Editor
                </button>
                <button className="px-6 md:px-8 py-4 text-on-surface-variant hover:bg-surface-container font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap focus:outline-none">
                  <Paperclip className="w-4 h-4" />
                  Resources
                  <span className="bg-surface-container-high text-secondary px-1.5 py-0.5 rounded text-[10px] font-bold">
                    2
                  </span>
                </button>
                <button className="px-6 md:px-8 py-4 text-on-surface-variant hover:bg-surface-container font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap focus:outline-none">
                  <Settings className="w-4 h-4" />
                  Lesson Settings
                </button>
              </div>

              {/* Editor Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide space-y-8 pb-20">
                {/* Lesson Basic Info */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Lesson Title
                      </label>
                      <input
                        className="w-full text-2xl font-headline-md font-bold text-primary p-3 border-b-2 border-border-subtle focus:border-secondary outline-none transition-all bg-transparent"
                        type="text"
                        defaultValue="1.2 Dev Environment Setup"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Lesson Type
                      </label>
                      <div className="relative">
                        <select className="w-full p-3 bg-surface-bg border border-border-subtle rounded-lg appearance-none focus:ring-2 focus:ring-secondary/20 outline-none font-medium text-sm text-on-surface">
                          <option>Video Content</option>
                          <option selected>Text & Image Content</option>
                          <option>Quiz / Assessment</option>
                          <option>Coding Challenge</option>
                        </select>
                        <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Featured Image Upload */}
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Featured Image
                    </label>
                    <div className="p-8 border-2 border-dashed border-border-subtle rounded-xl bg-surface-bg/50 flex flex-col items-center justify-center text-center space-y-3 hover:border-secondary hover:bg-secondary/5 transition-all group cursor-pointer">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-border-subtle">
                        <ImageIcon className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">
                          Set lesson thumbnail / header
                        </p>
                        <p className="text-xs font-medium text-on-surface-variant mt-1">
                          Click to browse or drag and drop (PNG, JPG, WebP)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Page Structured Editor */}
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Lesson Content
                    </label>
                    <div className="border border-border-subtle rounded-xl overflow-hidden shadow-sm bg-white">
                      {/* Rich Toolbar */}
                      <div className="bg-surface-container-low p-2 border-b border-border-subtle flex flex-wrap gap-1 items-center">
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Heading"
                        >
                          <Type className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-border-subtle mx-1"></div>
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Bold"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Italic"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-border-subtle mx-1"></div>
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Bulleted List"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Numbered List"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-border-subtle mx-1"></div>
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Code Block"
                        >
                          <Code className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Blockquote"
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-border-subtle mx-1"></div>
                        <button
                          className="p-2 hover:bg-white rounded transition-colors text-on-surface-variant hover:text-secondary focus:outline-none"
                          title="Insert Image"
                        >
                          <ImagePlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content Area (Preview Mode) */}
                      <div className="p-6 md:p-10 min-h-100 outline-none prose prose-slate max-w-none text-base">
                        <h2 className="text-2xl font-headline-lg font-bold text-primary mb-6 tracking-tight">
                          Setting up your Environment
                        </h2>
                        <p className="text-on-surface mb-4 leading-relaxed font-medium">
                          Before we dive into the complex architectures of
                          modern frameworks, we need a robust local environment.
                          Modern development relies heavily on stable
                          toolchains. We will be using Node.js as our runtime
                          environment, specifically opting for the Long Term
                          Support (LTS) version to ensure maximum compatibility
                          with the frameworks covered in this course.
                        </p>
                        <p className="text-on-surface mb-8 leading-relaxed font-medium">
                          Ensure you have a terminal emulator that supports
                          Unicode symbols, as many CLI tools used in the React
                          ecosystem leverage them for visual feedback during
                          build processes.
                        </p>

                        <blockquote className="border-l-4 border-secondary bg-surface-container-low p-6 rounded-r-xl italic text-on-surface mb-8 font-medium shadow-sm">
                          "Consistency is the key to a manageable codebase.
                          Standardizing your environment across your team
                          eliminates the 'it works on my machine' syndrome
                          before it starts."
                        </blockquote>

                        {/* Inline Image Placeholder */}
                        <div className="my-8 space-y-3">
                          <div className="aspect-video w-full bg-surface-container-high rounded-xl border border-border-subtle flex flex-col items-center justify-center text-on-surface-variant/70 shadow-inner">
                            <ImageIcon className="w-12 h-12 mb-3" />
                            <p className="text-xs font-bold uppercase tracking-wider">
                              Visual: Terminal configuration example
                            </p>
                          </div>
                          <p className="text-center text-xs font-medium text-on-surface-variant italic">
                            Fig 1.1: Recommended VS Code terminal configuration
                            for React development.
                          </p>
                        </div>

                        <p className="text-on-surface leading-relaxed font-medium">
                          In the next steps, we'll configure your global
                          packages and set up a custom ESLint profile that
                          aligns with our architectural standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer / Save Actions inside Workspace */}
              <div className="p-4 md:px-8 py-4 flex flex-wrap justify-end gap-3 border-t border-border-subtle bg-surface-bright mt-auto">
                <button className="px-6 py-2 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-xs uppercase tracking-wider">
                  Discard Changes
                </button>
                <button className="px-8 py-2 bg-secondary text-white rounded-lg font-bold hover:shadow-lg hover:bg-secondary/90 transition-all active:scale-95 text-xs uppercase tracking-wider focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  Save Lesson Content
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Simple Notification Toast */}
      <div
        className={`fixed bottom-8 right-8 bg-primary-container text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-transform duration-500 z-50 ${showToast ? 'translate-y-0' : 'translate-y-32'}`}
      >
        <div className="w-8 h-8 bg-[#009668] rounded-full flex items-center justify-center shadow-sm">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">Autosave successful</p>
          <p className="text-xs font-medium opacity-70 mt-0.5">
            Lesson 1.2 updated 2 seconds ago.
          </p>
        </div>
      </div>
    </div>
  );
}
