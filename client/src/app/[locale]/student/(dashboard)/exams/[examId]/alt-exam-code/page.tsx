'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Timer,
  CheckCircle2,
  Flag,
  CircleDashed,
  Circle,
  Settings,
  Maximize,
  Bug,
  Play,
  ChevronDown,
} from 'lucide-react';

export default function AltExamCodePage() {
  const [timeLeft, setTimeLeft] = useState(1 * 3600 + 45 * 60 + 22);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="bg-surface-bg text-on-surface min-h-screen overflow-hidden flex flex-col font-body-md selection:bg-secondary/20">
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest border-b border-border-subtle fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-headline-md text-xl md:text-2xl font-bold text-on-surface tracking-tight">
            Exam Console
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 text-secondary font-mono text-sm bg-surface-container-low px-3 md:px-4 py-2 rounded-lg border border-border-subtle shadow-sm">
            <Timer className="w-4 h-4" />
            <span className="font-bold">{formatTime(timeLeft)}</span>
          </div>
          <button className="hidden sm:block text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors px-4 py-2 rounded-lg border border-border-subtle uppercase tracking-wider">
            Review All
          </button>
          <button className="text-xs font-bold bg-secondary text-white hover:bg-secondary/90 active:scale-95 duration-150 transition-all px-4 py-2 rounded-lg uppercase tracking-wider shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2">
            Finish Exam
          </button>
        </div>
      </header>

      {/* SideNavBar */}
      <nav className="bg-surface-container-low border-r border-border-subtle fixed left-0 top-16 bottom-0 w-70 z-40 hidden lg:flex flex-col py-6">
        <div className="px-6 mb-8 flex items-center gap-4 border-b border-border-subtle pb-6">
          <Image
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"
            alt="Candidate Portrait"
            width={48}
            height={48}
            className="rounded-full border-2 border-surface-container-highest object-cover shadow-sm"
          />
          <div>
            <h2 className="text-sm font-bold text-on-surface">
              Section A: Logic
            </h2>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">
              5 of 20 Completed
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2 scrollbar-hide">
          <button className="flex items-center gap-3 w-full text-left transition-all duration-200 ease-in-out hover:bg-surface-container text-on-surface-variant px-4 py-3 rounded-lg focus:outline-none">
            <CheckCircle2 className="w-5 h-5 text-[#009668] fill-[#009668]/10" />
            <span className="text-sm font-bold">Question 1</span>
          </button>
          <button className="flex items-center gap-3 w-full text-left transition-all duration-200 ease-in-out hover:bg-surface-container text-on-surface-variant px-4 py-3 rounded-lg focus:outline-none">
            <Flag className="w-5 h-5 text-[#EF4444]" />
            <span className="text-sm font-bold">Question 2</span>
          </button>
          <button className="flex items-center gap-3 w-full text-left transition-all duration-200 ease-in-out text-secondary border-l-4 border-secondary bg-surface-container-high px-4 py-3 rounded-lg focus:outline-none shadow-sm">
            <CircleDashed className="w-5 h-5 text-secondary animate-[spin_3s_linear_infinite]" />
            <span className="text-sm font-bold">Question 3</span>
          </button>
          <button className="flex items-center gap-3 w-full text-left transition-all duration-200 ease-in-out hover:bg-surface-container text-on-surface-variant px-4 py-3 rounded-lg focus:outline-none opacity-70">
            <Circle className="w-5 h-5" />
            <span className="text-sm font-medium">Question 4</span>
          </button>
          <button className="flex items-center gap-3 w-full text-left transition-all duration-200 ease-in-out hover:bg-surface-container text-on-surface-variant px-4 py-3 rounded-lg focus:outline-none opacity-70">
            <Circle className="w-5 h-5" />
            <span className="text-sm font-medium">Question 5</span>
          </button>
        </div>

        <div className="px-6 mt-auto pt-6 border-t border-border-subtle">
          <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-on-surface-variant hover:text-[#EF4444] transition-colors py-2 border border-border-subtle rounded-lg hover:border-[#EF4444] uppercase tracking-wider focus:outline-none bg-surface-card">
            <Flag className="w-4 h-4" />
            Flag for Review
          </button>
        </div>
      </nav>

      {/* Main Workspace (Split Pane) */}
      <main className="fixed top-16 left-0 lg:left-[280px] right-0 bottom-0 md:bottom-14 flex flex-col md:flex-row bg-surface-bg z-10">
        {/* Left Pane: Description */}
        <section className="flex-1 flex flex-col bg-surface-card overflow-hidden h-1/2 md:h-full border-b md:border-b-0">
          <div className="px-6 md:px-8 py-6 overflow-y-auto h-full scrollbar-hide">
            <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="px-2 py-1 bg-surface-container-high text-secondary text-[10px] font-bold rounded uppercase tracking-widest border border-secondary/20">
                Hard
              </span>
              <h1 className="text-2xl md:text-3xl font-headline-lg font-bold text-on-surface tracking-tight">
                Valid Anagram
              </h1>
            </div>

            <div className="prose prose-sm max-w-none text-on-surface-variant font-medium text-base space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <p>
                Given two strings{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-sm text-on-surface font-mono border border-border-subtle">
                  s
                </code>{' '}
                and{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-sm text-on-surface font-mono border border-border-subtle">
                  t
                </code>
                , return{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-sm text-on-surface font-mono border border-border-subtle">
                  true
                </code>{' '}
                if{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-sm text-on-surface font-mono border border-border-subtle">
                  t
                </code>{' '}
                is an anagram of{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-sm text-on-surface font-mono border border-border-subtle">
                  s
                </code>
                , and{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-sm text-on-surface font-mono border border-border-subtle">
                  false
                </code>{' '}
                otherwise.
              </p>

              <p>
                An <strong className="text-on-surface">Anagram</strong> is a
                word or phrase formed by rearranging the letters of a different
                word or phrase, typically using all the original letters exactly
                once.
              </p>

              <div className="bg-surface-container-low p-5 rounded-xl border border-border-subtle shadow-sm">
                <p className="text-sm font-bold mb-3 text-on-surface uppercase tracking-wider">
                  Example 1:
                </p>
                <div className="font-mono text-sm text-on-surface-variant pl-4 border-l-2 border-secondary bg-surface-card p-3 rounded-r-lg border-y border-r border-border-subtle">
                  Input: s = "anagram", t = "nagaram"
                  <br />
                  Output: true
                </div>
              </div>

              <div className="bg-surface-container-low p-5 rounded-xl border border-border-subtle shadow-sm">
                <p className="text-sm font-bold mb-3 text-on-surface uppercase tracking-wider">
                  Example 2:
                </p>
                <div className="font-mono text-sm text-on-surface-variant pl-4 border-l-2 border-border-subtle bg-surface-card p-3 rounded-r-lg border-y border-r border-border-subtle">
                  Input: s = "rat", t = "car"
                  <br />
                  Output: false
                </div>
              </div>

              <div>
                <h3 className="text-xl font-headline-md font-bold text-on-surface mb-4 tracking-tight">
                  Constraints:
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-on-surface-variant marker:text-secondary">
                  <li>
                    <code className="font-mono text-sm">
                      1 &lt;= s.length, t.length &lt;= 5 * 10<sup>4</sup>
                    </code>
                  </li>
                  <li>
                    <code className="font-mono text-sm">s</code> and{' '}
                    <code className="font-mono text-sm">t</code> consist of
                    lowercase English letters.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="hidden md:flex flex-col justify-center items-center w-4 cursor-col-resize hover:bg-secondary/10 transition-colors group z-20">
          <div className="w-1 h-8 bg-outline-variant/50 rounded-full group-hover:bg-secondary transition-colors"></div>
        </div>

        {/* Right Pane: Code Editor */}
        <section className="flex-1 flex flex-col bg-[#1E1E1E] h-1/2 md:h-full border-l border-border-subtle relative z-10 animate-in fade-in slide-in-from-right-4 duration-700">
          {/* Editor Header */}
          <div className="h-12 bg-[#1A1A1A] border-b border-[#333] flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
              <select className="bg-[#2A2A2A] text-[#E0E0E0] border border-[#444] rounded-md text-sm px-3 py-1 focus:outline-none focus:border-secondary font-mono">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[#A0A0A0] hover:text-white p-1.5 rounded-md hover:bg-[#333] transition-colors focus:outline-none">
                <Settings className="w-4 h-4" />
              </button>
              <button className="text-[#A0A0A0] hover:text-white p-1.5 rounded-md hover:bg-[#333] transition-colors focus:outline-none">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monaco Mock Area */}
          <div className="flex-1 p-4 font-mono text-sm overflow-auto text-[#D4D4D4] leading-relaxed relative scrollbar-hide">
            <div className="flex">
              {/* Line Numbers */}
              <div className="text-[#858585] text-right pr-4 select-none border-r border-[#333] mr-4 w-8 opacity-50">
                1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />
                10
              </div>
              {/* Code */}
              <div className="whitespace-pre">
                <span className="text-[#569CD6]">/**</span>
                <br />
                <span className="text-[#569CD6]"> * @param {'{string}'} s</span>
                <br />
                <span className="text-[#569CD6]"> * @param {'{string}'} t</span>
                <br />
                <span className="text-[#569CD6]"> * @return {'{boolean}'}</span>
                <br />
                <span className="text-[#569CD6]"> */</span>
                <br />
                <span className="text-[#569CD6]">var</span> isAnagram ={' '}
                <span className="text-[#569CD6]">function</span>(s, t) {'{'}
                <br />
                {'    '}
                <span className="text-[#6A9955]">
                  // Write your solution here
                </span>
                <br />
                {'    '}
                <br />
                {'}'};
              </div>
            </div>

            {/* Floating Run Button within editor area */}
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button className="flex items-center gap-2 bg-[#2A2A2A] text-[#E0E0E0] text-xs font-bold px-4 py-2 rounded-lg border border-[#444] hover:bg-[#333] hover:text-white transition-colors shadow-lg uppercase tracking-wider focus:outline-none">
                <Bug className="w-4 h-4" />
                Debug
              </button>
              <button className="flex items-center gap-2 bg-secondary text-white text-xs font-bold px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors shadow-lg uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-[#1E1E1E]">
                <Play className="w-4 h-4 fill-current" />
                Run Tests
              </button>
            </div>
          </div>

          {/* Console Output Pane */}
          <div className="h-40 md:h-48 bg-[#1E1E1E] border-t border-[#333] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1A1A1A] border-b border-[#333]">
              <span className="text-[#E0E0E0] text-xs font-bold uppercase tracking-wider">
                Console Output
              </span>
              <button className="text-[#A0A0A0] hover:text-white p-1 rounded hover:bg-[#333] transition-colors focus:outline-none">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 font-mono text-xs text-[#A0A0A0] overflow-y-auto scrollbar-hide">
              &gt; Ready.
              <br />
              &gt; Click 'Run Tests' to execute your code against sample cases.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-border-subtle fixed bottom-0 right-0 left-0 lg:left-[280px] z-30 hidden md:flex justify-between items-center px-4 md:px-10 py-4 shadow-sm">
        <div className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Institutional Exam Systems
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="text-xs font-medium text-on-surface-variant hover:text-secondary underline transition-colors"
          >
            Technical Support
          </Link>
          <Link
            href="#"
            className="text-xs font-medium text-on-surface-variant hover:text-secondary underline transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-xs font-medium text-on-surface-variant hover:text-secondary underline transition-colors"
          >
            Exam Rules
          </Link>
        </div>
        <div className="text-xs font-medium text-on-surface-variant">
          © 2024 Institutional Exam Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
