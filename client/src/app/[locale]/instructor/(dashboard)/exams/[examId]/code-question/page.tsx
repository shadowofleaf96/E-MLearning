'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  PenTool,
  BarChart2,
  Video,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  UserCircle,
  GripVertical,
  Plus,
  Trash2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  PlusCircle,
  X,
} from 'lucide-react';

export default function ExamBuilderCodeQuestionPage() {
  return (
    <div className="h-screen bg-surface-bg text-on-surface font-body-md text-base overflow-hidden flex selection:bg-secondary/20">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-full py-6 fixed left-0 top-0 w-70 bg-surface-container-low border-r border-border-subtle z-20">
        <div className="px-6 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white font-headline-md text-2xl font-extrabold shadow-sm">
            E
          </div>
          <div>
            <h1 className="font-headline-md text-2xl font-extrabold text-secondary tracking-tight leading-none">
              EduStudio
            </h1>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">
              Instructor Portal
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 px-4 scrollbar-hide">
          <Link
            href="/instructor"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-all font-medium text-sm"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/instructor/courses"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary border-l-4 border-secondary bg-surface-container-high transition-all font-bold text-sm shadow-sm"
          >
            <PenTool className="w-5 h-5 fill-secondary/20" />
            Course Builder
          </Link>
          <Link
            href="/instructor/analytics"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-all font-medium text-sm"
          >
            <BarChart2 className="w-5 h-5" />
            Student Analytics
          </Link>
          <Link
            href="/instructor/live"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-all font-medium text-sm"
          >
            <Video className="w-5 h-5" />
            Live Sessions
          </Link>
          <Link
            href="/instructor/earnings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-all font-medium text-sm"
          >
            <DollarSign className="w-5 h-5" />
            Earnings
          </Link>
          <Link
            href="/instructor/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-all font-medium text-sm"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
        <div className="mt-auto px-4 space-y-1 pt-4 border-t border-border-subtle">
          <Link
            href="/instructor/help"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-all font-medium text-sm"
          >
            <HelpCircle className="w-5 h-5" />
            Help Center
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              sessionStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all font-medium text-sm focus:outline-none"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-[280px] flex flex-col h-full bg-surface-bg relative">
        {/* TopNavBar */}
        <header className="flex justify-between items-center px-4 md:px-10 w-full h-16 bg-surface-container-lowest border-b border-border-subtle z-10 shrink-0 shadow-sm">
          <div className="flex-1 flex items-center gap-4">
            <nav className="flex items-center gap-2 text-on-surface-variant text-xs font-medium uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-500">
              <Link href="#" className="hover:text-secondary transition-colors">
                My Courses
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="#" className="hover:text-secondary transition-colors">
                React Fundamentals
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-secondary font-bold">Exam Builder</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 mr-4">
              <button className="px-4 py-2 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors border border-border-subtle uppercase tracking-wider shadow-sm">
                Preview Exam
              </button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors border border-border-subtle uppercase tracking-wider shadow-sm">
                Save Draft
              </button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold bg-secondary text-white hover:bg-secondary/90 transition-opacity uppercase tracking-wider shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                Update Exam
              </button>
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors focus:outline-none">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors focus:outline-none">
              <UserCircle className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Exam Workspace */}
        <main className="flex-1 flex overflow-hidden">
          {/* Question List Sidebar */}
          <aside className="hidden xl:flex w-[320px] bg-surface-container-lowest border-r border-border-subtle flex-col shrink-0 shadow-sm z-10">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-xl font-headline-md font-bold text-on-surface mb-1 tracking-tight">
                Final Assessment
              </h2>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                React Fundamentals
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {/* Question Item 1 */}
              <div className="group flex items-center gap-3 p-3 rounded-lg bg-surface-bg border border-border-subtle hover:border-outline-variant transition-colors cursor-pointer shadow-sm">
                <GripVertical className="w-5 h-5 text-outline cursor-grab opacity-50 group-hover:opacity-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-bold text-on-surface truncate">
                      Q1: Component State
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant shrink-0 uppercase tracking-wider">
                      10 pts
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-surface-variant text-on-surface-variant uppercase tracking-wider">
                    Multiple Choice
                  </span>
                </div>
              </div>

              {/* Question Item 2 (Active) */}
              <div className="group flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary shadow-sm cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                <GripVertical className="w-5 h-5 text-outline cursor-grab opacity-50 group-hover:opacity-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-bold text-secondary truncate">
                      Q2: Custom Hook
                    </span>
                    <span className="text-[10px] font-bold text-secondary shrink-0 uppercase tracking-wider">
                      25 pts
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/20 text-[#004395] uppercase tracking-wider">
                    Code Challenge
                  </span>
                </div>
              </div>

              {/* Question Item 3 */}
              <div className="group flex items-center gap-3 p-3 rounded-lg bg-surface-bg border border-border-subtle hover:border-outline-variant transition-colors cursor-pointer shadow-sm">
                <GripVertical className="w-5 h-5 text-outline cursor-grab opacity-50 group-hover:opacity-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-bold text-on-surface truncate">
                      Q3: Context API
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant shrink-0 uppercase tracking-wider">
                      15 pts
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-surface-variant text-on-surface-variant uppercase tracking-wider">
                    Multiple Choice
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border-subtle bg-surface-container-lowest">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-outline-variant text-on-surface-variant hover:text-secondary hover:border-secondary hover:bg-secondary/5 transition-all text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent">
                <Plus className="w-4 h-4" />
                Add New Question
              </button>
            </div>
          </aside>

          {/* Edit Question Area */}
          <div className="flex-1 overflow-y-auto bg-surface-bg scrollbar-hide">
            <div className="max-w-4xl mx-auto p-4 md:p-10">
              {/* Editor Header */}
              <div className="flex flex-col gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-3xl font-headline-lg font-bold text-on-surface mb-3 tracking-tight">
                      Edit Question 2
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-surface-card p-1 rounded-lg border border-border-subtle shadow-sm">
                        <label
                          className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-2"
                          htmlFor="q-type"
                        >
                          Type:
                        </label>
                        <select
                          className="bg-transparent text-sm font-bold text-on-surface focus:outline-none py-1 pr-6 cursor-pointer"
                          id="q-type"
                        >
                          <option>Multiple Choice</option>
                          <option selected>Coding Challenge</option>
                          <option>Short Answer</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 bg-surface-card p-1 rounded-lg border border-border-subtle shadow-sm">
                        <label
                          className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-2"
                          htmlFor="q-points"
                        >
                          Points:
                        </label>
                        <input
                          className="bg-transparent text-sm font-bold text-on-surface focus:outline-none py-1 w-12 text-center"
                          id="q-points"
                          type="number"
                          defaultValue="25"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-[#EF4444] transition-colors p-2 rounded-lg hover:bg-[#EF4444]/10 focus:outline-none self-start">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Problem Description */}
              <div className="bg-surface-card rounded-xl border border-border-subtle p-6 mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700">
                <h4 className="text-xs font-bold text-on-surface mb-4 uppercase tracking-wider">
                  Problem Description
                </h4>
                <div className="border border-border-subtle rounded-lg overflow-hidden flex flex-col">
                  {/* Toolbar */}
                  <div className="bg-surface-container-low border-b border-border-subtle p-2 flex gap-1">
                    <button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant focus:outline-none hover:text-secondary transition-colors">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant focus:outline-none hover:text-secondary transition-colors">
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-border-subtle mx-1 self-center"></div>
                    <button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant focus:outline-none hover:text-secondary transition-colors">
                      <List className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant focus:outline-none hover:text-secondary transition-colors">
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-border-subtle mx-1 self-center"></div>
                    <button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant focus:outline-none hover:text-secondary transition-colors">
                      <Code className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Editor Area */}
                  <div
                    className="p-4 min-h-[120px] font-medium text-sm text-on-surface focus:outline-none prose prose-sm max-w-none"
                    contentEditable
                    suppressContentEditableWarning
                  >
                    <p className="mb-2">
                      Create a custom React hook named{' '}
                      <code className="bg-surface-container-low px-1 rounded border border-border-subtle">
                        useDebounce
                      </code>
                      .
                    </p>
                    <p className="mb-2">This hook should take two arguments:</p>
                    <ol className="list-decimal list-inside mb-4 pl-2 space-y-1">
                      <li>
                        <code className="bg-surface-container-low px-1 rounded border border-border-subtle">
                          value
                        </code>
                        : The value to be debounced.
                      </li>
                      <li>
                        <code className="bg-surface-container-low px-1 rounded border border-border-subtle">
                          delay
                        </code>
                        : The delay in milliseconds.
                      </li>
                    </ol>
                    <p>
                      The hook should return the debounced value, updating only
                      after the specified delay has passed without the value
                      changing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Editors */}
              <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                {/* Tabs */}
                <div className="flex border-b border-border-subtle bg-surface-container-lowest">
                  <button className="px-6 py-3 text-xs font-bold text-secondary border-b-2 border-secondary bg-surface-container-low transition-colors uppercase tracking-wider focus:outline-none">
                    Starter Code
                  </button>
                  <button className="px-6 py-3 text-xs font-bold text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors uppercase tracking-wider focus:outline-none">
                    Solution Code
                  </button>
                </div>
                {/* Editor Content */}
                <div className="bg-[#1E1E1E] text-[#D4D4D4] p-4 font-mono text-sm min-h-[200px] overflow-x-auto relative">
                  <div className="absolute top-3 right-4 text-[#858585] text-xs font-bold uppercase tracking-wider">
                    javascript
                  </div>
                  <pre>
                    <code>
                      <span className="text-[#C586C0]">import</span> {'{'}{' '}
                      useState, useEffect {'}'}{' '}
                      <span className="text-[#C586C0]">from</span>{' '}
                      <span className="text-[#CE9178]">'react'</span>;
                      <span className="text-[#C586C0]">export</span>{' '}
                      <span className="text-[#569CD6]">function</span>{' '}
                      <span className="text-[#DCDCAA]">useDebounce</span>(value,
                      delay) {'{'}
                      <span className="text-[#6A9955]">// Your code here</span>
                      {'}'}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Test Cases */}
              <div className="bg-surface-card rounded-xl border border-border-subtle p-6 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Test Cases
                  </h4>
                  <button className="flex items-center gap-1.5 text-secondary hover:text-[#004395] transition-colors text-xs font-bold uppercase tracking-wider focus:outline-none">
                    <PlusCircle className="w-4 h-4" />
                    Add Test Case
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Case 1 */}
                  <div className="border border-border-subtle rounded-lg p-5 bg-surface-bg relative group">
                    <div className="absolute top-4 right-4 flex gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="rounded text-secondary focus:ring-secondary border-outline-variant h-4 w-4 bg-surface-card"
                          type="checkbox"
                        />
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Hidden
                        </span>
                      </label>
                      <button className="text-outline-variant hover:text-[#EF4444] transition-colors focus:outline-none">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                          Input (Args)
                        </label>
                        <textarea
                          className="w-full rounded-md border border-border-subtle font-mono text-sm focus:ring-2 focus:ring-secondary focus:border-transparent focus:outline-none h-20 bg-surface-container-lowest p-3 shadow-inner"
                          spellCheck="false"
                          defaultValue={'"test", 500'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                          Expected Output
                        </label>
                        <textarea
                          className="w-full rounded-md border border-border-subtle font-mono text-sm focus:ring-2 focus:ring-secondary focus:border-transparent focus:outline-none h-20 bg-surface-container-lowest p-3 shadow-inner"
                          spellCheck="false"
                          defaultValue={'"test" (after 500ms)'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="border border-border-subtle rounded-lg p-5 bg-surface-bg relative group">
                    <div className="absolute top-4 right-4 flex gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          defaultChecked
                          className="rounded text-secondary focus:ring-secondary border-outline-variant h-4 w-4 bg-surface-card"
                          type="checkbox"
                        />
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Hidden
                        </span>
                      </label>
                      <button className="text-outline-variant hover:text-[#EF4444] transition-colors focus:outline-none">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                          Input (Args)
                        </label>
                        <textarea
                          className="w-full rounded-md border border-border-subtle font-mono text-sm focus:ring-2 focus:ring-secondary focus:border-transparent focus:outline-none h-20 bg-surface-container-lowest p-3 shadow-inner"
                          spellCheck="false"
                          defaultValue={'"", 1000'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                          Expected Output
                        </label>
                        <textarea
                          className="w-full rounded-md border border-border-subtle font-mono text-sm focus:ring-2 focus:ring-secondary focus:border-transparent focus:outline-none h-20 bg-surface-container-lowest p-3 shadow-inner"
                          spellCheck="false"
                          defaultValue={'"" (after 1000ms)'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
