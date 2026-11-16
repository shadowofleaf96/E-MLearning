'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Timer,
  HelpCircle,
  RefreshCw,
  Terminal,
  Play,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function StudentCodingChallengePage() {
  const router = useRouter();
  const [codeSolution, setCodeSolution] = useState(
    '/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nvar isAnagram = function(s, t) {\n    // Write your solution here\n    \n};'
  );
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const handleFinish = () => {
    toast.success('Challenge submitted successfully!');
    router.push('/student/dashboard');
  };

  return (
    <div className="bg-surface-bg text-on-surface font-body-md antialiased h-screen overflow-hidden flex flex-col selection:bg-secondary-container selection:text-white">
      {/* TopAppBar */}
      <header className="bg-surface-card border-b border-border-subtle flex justify-between items-center w-full px-4 md:px-10 h-16 z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-headline-md text-xl md:text-2xl font-bold text-primary">
            Code Studio
          </span>
          <span className="text-on-surface-variant text-sm hidden md:inline-block pl-4 border-l border-border-subtle font-medium">
            Data Structures & Algorithms
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 font-mono text-sm text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-subtle">
            <Timer size={18} />
            <span className="font-semibold tracking-wider">01:45:22</span>
          </div>
          <button className="text-on-surface-variant hover:text-secondary transition-colors p-2 rounded-full hidden md:block">
            <HelpCircle size={20} />
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleFinish}
              className="font-bold text-sm bg-secondary text-white hover:bg-secondary-container transition-colors px-6 py-2 rounded-lg shadow-sm"
            >
              Submit Challenge
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden p-4 md:p-6 gap-6 bg-surface-bg">
        {/* Left Panel: Problem Context */}
        <div className="flex-1 flex flex-col bg-surface-card rounded-2xl border border-border-subtle overflow-hidden relative shadow-sm h-full">
          <div className="overflow-y-auto p-6 md:p-8 h-full">
            <div className="flex items-center justify-between mb-6 border-b border-border-subtle pb-4">
              <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-primary tracking-tight">
                Valid Anagram
              </h1>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold text-xs uppercase tracking-wider">
                Easy
              </span>
            </div>
            <div className="prose max-w-none text-on-surface-variant text-base leading-relaxed mb-10">
              <p>
                Given two strings{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                  s
                </code>{' '}
                and{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                  t
                </code>
                , return{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                  true
                </code>{' '}
                if{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                  t
                </code>{' '}
                is an anagram of{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                  s
                </code>
                , and{' '}
                <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                  false
                </code>{' '}
                otherwise.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-primary mb-4">Examples</h3>
              <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-5 mb-4 shadow-sm">
                <p className="font-bold text-sm text-on-surface-variant mb-3">
                  Example 1:
                </p>
                <div className="font-mono text-sm text-on-surface bg-surface-card border border-border-subtle rounded-lg p-3 mb-3 shadow-inner">
                  <span className="text-outline-variant select-none">
                    Input:{' '}
                  </span>{' '}
                  s = "anagram", t = "nagaram"
                </div>
                <div className="font-mono text-sm text-on-surface bg-surface-card border border-border-subtle rounded-lg p-3 shadow-inner">
                  <span className="text-outline-variant select-none">
                    Output:{' '}
                  </span>{' '}
                  <span className="text-emerald-600 font-bold">true</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-5 shadow-sm">
                <p className="font-bold text-sm text-on-surface-variant mb-3">
                  Example 2:
                </p>
                <div className="font-mono text-sm text-on-surface bg-surface-card border border-border-subtle rounded-lg p-3 mb-3 shadow-inner">
                  <span className="text-outline-variant select-none">
                    Input:{' '}
                  </span>{' '}
                  s = "rat", t = "car"
                </div>
                <div className="font-mono text-sm text-on-surface bg-surface-card border border-border-subtle rounded-lg p-3 shadow-inner">
                  <span className="text-outline-variant select-none">
                    Output:{' '}
                  </span>{' '}
                  <span className="text-error font-bold">false</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Constraints
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant text-base">
                <li>
                  <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                    1 &lt;= s.length, t.length &lt;= 5 * 10^4
                  </code>
                </li>
                <li>
                  <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                    s
                  </code>{' '}
                  and{' '}
                  <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                    t
                  </code>{' '}
                  consist of lowercase English letters.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel: Integrated Editor */}
        <div className="flex-[1.2] flex flex-col bg-[#1e1e1e] rounded-2xl border border-border-subtle shadow-sm overflow-hidden h-full">
          {/* Editor Header */}
          <div className="bg-[#252526] border-b border-[#333333] px-4 py-2.5 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#1e1e1e] text-white font-bold text-xs border border-[#333333] rounded px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-[#333] transition-colors">
                <span className="text-yellow-500">JS</span> JavaScript
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
            <button
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-semibold text-xs px-2 py-1 rounded hover:bg-[#333]"
              title="Reset Code"
            >
              <RefreshCw size={14} /> Reset
            </button>
          </div>

          {/* Code Editor Area */}
          <div className="grow flex relative font-mono text-sm bg-[#1e1e1e] overflow-hidden">
            {/* Line Numbers */}
            <div className="w-12 bg-[#1e1e1e] border-r border-[#333333] text-gray-500 flex flex-col items-end pr-3 py-4 select-none">
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
            </div>
            {/* Code Content */}
            <textarea
              value={codeSolution}
              onChange={(e) => setCodeSolution(e.target.value)}
              className="grow p-4 text-[#D4D4D4] whitespace-pre overflow-auto bg-transparent border-none focus:ring-0 outline-none resize-none"
              spellCheck="false"
            />
          </div>

          {/* Console Drawer */}
          {isConsoleOpen && (
            <div className="bg-[#1e1e1e] border-t border-[#333333] h-48 flex flex-col z-20">
              <div className="px-4 py-2 bg-[#252526] border-b border-[#333333] font-bold text-xs text-gray-400 uppercase tracking-wider">
                Console Output
              </div>
              <div className="grow p-4 font-mono text-sm text-gray-400 overflow-y-auto">
                <p className="text-emerald-400 mb-1">&gt; Ready.</p>
                <p>
                  &gt; Click "Run Tests" to execute your code against sample
                  cases.
                </p>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="bg-[#252526] border-t border-[#333333] px-6 py-3 flex justify-between items-center z-30">
            <button
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="text-gray-400 hover:text-white flex items-center gap-2 font-bold text-sm transition-colors px-3 py-1.5 rounded hover:bg-[#333]"
            >
              <Terminal size={18} /> Console
              {isConsoleOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </button>
            <div className="flex gap-3">
              <button className="px-5 py-2 border border-[#333333] text-white rounded-lg font-bold text-sm hover:bg-[#333333] transition-colors">
                Debug
              </button>
              <button className="px-6 py-2 bg-secondary text-white rounded-lg font-bold text-sm hover:bg-secondary-container shadow-sm flex items-center gap-2 transition-colors">
                <Play size={16} fill="currentColor" /> Run Tests
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
