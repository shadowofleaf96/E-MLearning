'use client';

import React from 'react';
import Link from 'next/link';
import {
  Timer,
  HelpCircle,
  CheckCircle2,
  Code,
  Bookmark,
  Flag,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Settings,
  Terminal,
  Play,
} from 'lucide-react';

export default function AltMixed1ExamPage() {
  return (
    <div className="bg-surface-bg text-on-surface font-body-md antialiased h-screen overflow-hidden flex flex-col selection:bg-secondary/20">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-border-subtle flex justify-between items-center w-full px-4 md:px-10 h-16 z-50 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
          <span className="text-xl md:text-2xl font-headline-md font-bold text-primary tracking-tight">
            Exam Console
          </span>
          <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider hidden md:inline-block pl-4 border-l border-border-subtle">
            Full Stack Certification Exam
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-sm font-bold animate-[pulse_2s_infinite]">
            <Timer className="w-5 h-5 text-[#ba1a1a]" />
            <span className="text-[#ba1a1a]">45:00</span>
          </div>
          <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full hidden md:block focus:outline-none">
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <button className="hidden sm:block text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors px-4 py-2 rounded-lg border border-border-subtle uppercase tracking-wider shadow-sm focus:outline-none">
              Review All
            </button>
            <button className="text-xs font-bold bg-secondary text-white hover:bg-secondary/90 transition-opacity px-4 py-2 rounded-lg shadow-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
              Finish Exam
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar */}
        <aside className="bg-surface-container-low border-r border-border-subtle h-full py-6 px-4 w-72 flex-shrink-0 overflow-y-auto hidden md:flex flex-col z-40">
          <div className="mb-6 px-2">
            <h2 className="text-lg font-headline-md font-bold text-primary mb-2 tracking-tight">
              Section 1: Core Logic
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                60% Complete
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-border-subtle h-2 rounded-full mt-3 overflow-hidden shadow-sm">
              <div className="bg-secondary h-full rounded-full w-[60%]"></div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 scrollbar-hide">
            {/* Tab 1: Completed */}
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all text-sm font-bold focus:outline-none"
            >
              <CheckCircle2 className="w-5 h-5 text-[#009668] fill-[#009668]/10" />
              Problem 1
            </Link>

            {/* Tab 2: Current (Active) */}
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary border-l-[3px] border-secondary bg-surface-container-high transition-transform scale-[0.99] text-sm font-bold shadow-sm focus:outline-none"
            >
              <Code className="w-5 h-5" />
              Problem 2
            </Link>

            {/* Tab 3: Flagged */}
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all text-sm font-bold focus:outline-none"
            >
              <Bookmark className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
              Problem 3
            </Link>

            {/* Tab 4: Unattempted */}
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all text-sm font-bold focus:outline-none opacity-70"
            >
              <Code className="w-5 h-5" />
              Problem 4
            </Link>

            {/* Tab 5: Unattempted */}
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all text-sm font-bold focus:outline-none opacity-70"
            >
              <CheckCircle2 className="w-5 h-5" />
              Problem 5
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-border-subtle flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 text-xs font-bold text-on-surface-variant border border-border-subtle rounded-lg py-2 hover:bg-surface-container hover:text-[#EF4444] hover:border-[#EF4444] transition-colors uppercase tracking-wider focus:outline-none shadow-sm bg-surface-card">
              <Flag className="w-4 h-4" />
              Flag for Review
            </button>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all mt-2 text-sm font-bold focus:outline-none"
            >
              <MessageCircle className="w-5 h-5" />
              Support
            </Link>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-surface-bg relative pb-20 scrollbar-hide">
          <div className="max-w-container-max mx-auto w-full p-4 md:p-10 flex-1 flex flex-col gap-6">
            {/* Section 1: MCQ */}
            <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Question 1 of 20
                </span>
                <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-secondary uppercase tracking-wider shadow-sm border border-secondary/10">
                  Multiple Choice
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-headline-lg font-bold text-on-surface mb-8 tracking-tight leading-tight">
                What is the primary purpose of a Reducer in Redux?
              </h3>

              <div className="space-y-4">
                {/* Option A */}
                <label className="flex items-center p-4 border border-border-subtle rounded-xl cursor-pointer hover:bg-surface-container-lowest hover:border-secondary transition-colors group">
                  <input
                    className="form-radio text-secondary focus:ring-secondary h-5 w-5 border-outline-variant bg-transparent cursor-pointer"
                    name="q1"
                    type="radio"
                  />
                  <span className="ml-4 text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    To trigger asynchronous side effects within the application.
                  </span>
                </label>

                {/* Option B (Selected) */}
                <label className="flex items-center p-4 border-2 border-secondary bg-secondary/5 rounded-xl cursor-pointer shadow-sm">
                  <input
                    defaultChecked
                    className="form-radio text-secondary focus:ring-secondary h-5 w-5 border-outline-variant bg-transparent cursor-pointer"
                    name="q1"
                    type="radio"
                  />
                  <span className="ml-4 text-sm font-bold text-on-surface">
                    To specify how the application's state changes in response
                    to actions sent to the store.
                  </span>
                </label>

                {/* Option C */}
                <label className="flex items-center p-4 border border-border-subtle rounded-xl cursor-pointer hover:bg-surface-container-lowest hover:border-secondary transition-colors group">
                  <input
                    className="form-radio text-secondary focus:ring-secondary h-5 w-5 border-outline-variant bg-transparent cursor-pointer"
                    name="q1"
                    type="radio"
                  />
                  <span className="ml-4 text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    To connect React components directly to the Redux store.
                  </span>
                </label>

                {/* Option D */}
                <label className="flex items-center p-4 border border-border-subtle rounded-xl cursor-pointer hover:bg-surface-container-lowest hover:border-secondary transition-colors group">
                  <input
                    className="form-radio text-secondary focus:ring-secondary h-5 w-5 border-outline-variant bg-transparent cursor-pointer"
                    name="q1"
                    type="radio"
                  />
                  <span className="ml-4 text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    To define the initial routing structure of a single-page
                    application.
                  </span>
                </label>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="text-xs font-bold bg-secondary text-white hover:bg-secondary/90 transition-opacity px-6 py-2.5 rounded-lg shadow-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  Save & Next
                </button>
              </div>
            </section>

            {/* Section 2: Coding Challenge (Split Pane) */}
            <section className="bg-surface-card rounded-2xl border border-border-subtle flex flex-col md:flex-row shadow-sm flex-1 min-h-125 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {/* Left Pane: Problem Statement */}
              <div className="w-full md:w-5/12 p-6 md:p-8 border-b md:border-b-0 md:border-r border-border-subtle flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Question 2 of 20
                  </span>
                  <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-secondary flex items-center gap-1.5 uppercase tracking-wider shadow-sm border border-secondary/10">
                    <Code className="w-3.5 h-3.5" />
                    Coding
                  </span>
                </div>
                <h3 className="text-2xl font-headline-md font-bold text-on-surface mb-6 tracking-tight">
                  Reverse a Linked List
                </h3>
                <div className="prose prose-sm max-w-none text-sm font-medium text-on-surface-variant space-y-4 flex-1">
                  <p>
                    Given the{' '}
                    <code className="bg-surface-container-low px-1.5 py-0.5 rounded border border-border-subtle font-mono text-sm text-on-surface">
                      head
                    </code>{' '}
                    of a singly linked list, reverse the list, and return{' '}
                    <em className="text-on-surface">the reversed list</em>.
                  </p>

                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">
                      Example 1:
                    </h4>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-border-subtle font-mono text-sm text-on-surface shadow-sm">
                      <strong>Input:</strong> head = [1,2,3,4,5]
                      <br />
                      <strong>Output:</strong> [5,4,3,2,1]
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">
                      Constraints:
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 marker:text-secondary">
                      <li>
                        The number of nodes in the list is the range{' '}
                        <code className="font-mono text-sm">[0, 5000]</code>.
                      </li>
                      <li>
                        <code className="font-mono text-sm">
                          -5000 &lt;= Node.val &lt;= 5000
                        </code>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Pane: Code Editor */}
              <div className="w-full md:w-7/12 flex flex-col bg-[#1E1E1E] overflow-hidden">
                {/* Editor Toolbar */}
                <div className="bg-[#2D2D2D] border-b border-[#404040] px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider">
                      javascript
                    </span>
                    <span className="font-mono text-sm font-bold text-[#D4D4D4] ml-2">
                      solution.js
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="text-[#A3A3A3] hover:text-white transition-colors focus:outline-none"
                      title="Reset Code"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      className="text-[#A3A3A3] hover:text-white transition-colors focus:outline-none"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* The actual editor area (mocked) */}
                <div className="flex-1 flex overflow-hidden relative">
                  {/* Line numbers */}
                  <div className="w-12 bg-[#1E1E1E] text-[#858585] font-mono text-sm text-right pr-4 py-4 select-none border-r border-[#404040] opacity-50">
                    1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9
                    <br />
                    10
                    <br />
                    11
                  </div>
                  {/* Code content */}
                  <div className="flex-1 p-4 font-mono text-sm overflow-auto text-[#D4D4D4] whitespace-pre scrollbar-hide">
                    <span className="text-[#569CD6]">/**</span>
                    <br />
                    <span className="text-[#569CD6]">
                      {' '}
                      * Definition for singly-linked list.
                    </span>
                    <br />
                    <span className="text-[#569CD6]">
                      {' '}
                      * function ListNode(val, next) {'{'}
                    </span>
                    <br />
                    <span className="text-[#569CD6]">
                      {' '}
                      * this.val = (val===undefined ? 0 : val)
                    </span>
                    <br />
                    <span className="text-[#569CD6]">
                      {' '}
                      * this.next = (next===undefined ? null : next)
                    </span>
                    <br />
                    <span className="text-[#569CD6]"> * {'}'}</span>
                    <br />
                    <span className="text-[#569CD6]"> */</span>
                    <br />
                    <span className="text-[#569CD6]">/**</span>
                    <br />
                    <span className="text-[#569CD6]">
                      {' '}
                      * <span className="text-[#C586C0]">@param</span>{' '}
                      {'{ListNode}'} head
                    </span>
                    <br />
                    <span className="text-[#569CD6]">
                      {' '}
                      * <span className="text-[#C586C0]">@return</span>{' '}
                      {'{ListNode}'}
                    </span>
                    <br />
                    <span className="text-[#569CD6]"> */</span>
                    <br />
                    <span className="text-[#569CD6]">var</span> reverseList ={' '}
                    <span className="text-[#569CD6]">function</span>(head) {'{'}
                    <br />
                    {'    '}
                    <span className="text-[#6A9955]">
                      // Write your solution here
                    </span>
                    <br />
                    {'    '}
                    <br />
                    {'    '}
                    <br />
                    {'}'};
                  </div>
                </div>

                {/* Editor Footer / Actions */}
                <div className="bg-[#2D2D2D] border-t border-[#404040] p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#A3A3A3] text-xs font-bold uppercase tracking-wider">
                    <Terminal className="w-4 h-4" />
                    Console Ready
                  </div>
                  <button className="text-xs font-bold bg-[#0058be] text-white hover:bg-[#2170e4] transition-colors px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-[#2D2D2D]">
                    <Play className="w-4 h-4 fill-current" />
                    Run Tests
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface-bg border-t border-border-subtle flex justify-between items-center px-4 md:px-10 py-4 fixed bottom-0 right-0 w-full md:w-[calc(100%-280px)] z-40 h-16 shadow-sm">
        <div className="text-xs font-medium text-on-surface-variant flex items-center gap-6">
          <span>© 2024 Modern Scholastic Assessment Pro</span>
          <div className="hidden lg:flex gap-6">
            <Link
              href="#"
              className="hover:text-secondary underline transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-secondary underline transition-colors"
            >
              Exam Rules
            </Link>
            <Link
              href="#"
              className="hover:text-secondary underline transition-colors"
            >
              System Check
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs font-bold text-on-surface-variant border border-border-subtle hover:bg-surface-container-low transition-colors px-4 py-2 rounded-lg flex items-center gap-2 uppercase tracking-wider focus:outline-none shadow-sm bg-surface-card">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button className="text-xs font-bold bg-secondary text-white hover:bg-secondary/90 transition-opacity px-6 py-2 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
