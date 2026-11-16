'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Timer,
  HelpCircle,
  CheckCircle2,
  Code,
  Bookmark,
  Flag,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Settings,
  Terminal,
  Play,
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function StudentExamPage() {
  const router = useRouter();

  const [activeQuestion, setActiveQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: 'b',
  });
  const [codeSolution, setCodeSolution] = useState(
    'var reverseList = function(head) {\n    // Write your solution here\n    \n    \n};\n'
  );

  const handleFinishExam = () => {
    toast.success('Exam submitted successfully!');
    router.push('/student/dashboard');
  };

  const handleNext = () => {
    if (activeQuestion < 2) {
      setActiveQuestion(activeQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (activeQuestion > 1) {
      setActiveQuestion(activeQuestion - 1);
    }
  };

  return (
    <div className="bg-surface-bg text-on-surface font-body-md antialiased h-screen overflow-hidden flex flex-col">
      {/* TopAppBar */}
      <header className="bg-surface-card border-b border-border-subtle flex justify-between items-center w-full px-4 md:px-10 h-16 z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-headline-md text-xl md:text-2xl font-bold text-primary">
            Exam Console
          </span>
          <span className="text-on-surface-variant text-sm hidden md:inline-block pl-4 border-l border-border-subtle font-medium">
            Full Stack Certification Exam
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 font-mono text-sm text-error animate-pulse font-bold bg-error/10 px-3 py-1.5 rounded-lg border border-error/20">
            <Timer size={18} />
            <span>45:00</span>
          </div>
          <button className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors p-2 rounded-full hidden md:block">
            <HelpCircle size={20} />
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <button className="font-semibold text-sm text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors px-4 py-2 rounded-lg border border-border-subtle hidden sm:block">
              Review All
            </button>
            <button
              onClick={handleFinishExam}
              className="font-bold text-sm bg-secondary text-white hover:bg-secondary-container transition-colors px-4 py-2 rounded-lg shadow-sm"
            >
              Finish Exam
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar */}
        <aside className="bg-surface-container-low border-r border-border-subtle flex flex-col h-full py-6 px-4 w-72 shrink-0 overflow-y-auto hidden md:flex">
          <div className="mb-6 px-2">
            <h2 className="font-bold text-lg text-primary mb-1">
              Section 1: Core Logic
            </h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                60% Complete
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[60%]"></div>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {/* Tab 1: Completed */}
            <button
              onClick={() => setActiveQuestion(1)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeQuestion === 1
                  ? 'text-secondary border-l-4 border-secondary bg-surface-container-high font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium'
              }`}
            >
              <CheckCircle2
                size={18}
                className={
                  activeQuestion === 1 ? 'text-secondary' : 'text-emerald-600'
                }
              />
              <span className="text-sm">Problem 1</span>
            </button>
            {/* Tab 2: Current (Active) */}
            <button
              onClick={() => setActiveQuestion(2)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeQuestion === 2
                  ? 'text-secondary border-l-4 border-secondary bg-surface-container-high font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium'
              }`}
            >
              <Code size={18} />
              <span className="text-sm">Problem 2</span>
            </button>
            {/* Tab 3: Flagged */}
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-medium">
              <Bookmark size={18} className="text-amber-500 fill-amber-500" />
              <span className="text-sm">Problem 3</span>
            </button>
            {/* Tab 4: Unattempted */}
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-medium">
              <Code size={18} />
              <span className="text-sm">Problem 4</span>
            </button>
            {/* Tab 5: Unattempted */}
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-medium">
              <CheckCircle2 size={18} />
              <span className="text-sm">Problem 5</span>
            </button>
          </nav>
          <div className="mt-auto pt-6 border-t border-border-subtle flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 font-semibold text-sm text-on-surface-variant border border-border-subtle rounded-lg py-2 hover:bg-surface-container hover:text-primary transition-colors bg-surface-card">
              <Flag size={16} />
              Flag for Review
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all mt-2 font-medium">
              <HelpCircle size={18} />
              <span className="text-sm">Support</span>
            </button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-surface-bg relative pb-20">
          <div className="max-w-container-max mx-auto w-full p-4 md:p-10 flex-1 flex flex-col gap-6">
            {activeQuestion === 1 ? (
              /* Section 1: MCQ */
              <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                    Question 1 of 20
                  </span>
                  <span className="bg-surface-container px-3 py-1 rounded-full font-bold text-xs text-secondary">
                    Multiple Choice
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-headline-lg text-primary mb-8 tracking-tight">
                  What is the primary purpose of a Reducer in Redux?
                </h3>
                <div className="space-y-4">
                  {/* Option A */}
                  <label
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors group ${
                      answers[1] === 'a'
                        ? 'border-secondary bg-surface-container-low border-2'
                        : 'border-border-subtle hover:bg-surface-container hover:border-secondary'
                    }`}
                  >
                    <input
                      className="form-radio text-secondary focus:ring-secondary h-5 w-5 border-outline-variant"
                      name="q1"
                      type="radio"
                      value="a"
                      checked={answers[1] === 'a'}
                      onChange={(e) =>
                        setAnswers({ ...answers, 1: e.target.value })
                      }
                    />
                    <span
                      className={`ml-4 text-base ${
                        answers[1] === 'a'
                          ? 'text-primary font-medium'
                          : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      To trigger asynchronous side effects within the
                      application.
                    </span>
                  </label>
                  {/* Option B */}
                  <label
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors group ${
                      answers[1] === 'b'
                        ? 'border-secondary bg-surface-container-low border-2'
                        : 'border-border-subtle hover:bg-surface-container hover:border-secondary'
                    }`}
                  >
                    <input
                      className="form-radio text-secondary focus:ring-secondary h-5 w-5 border-outline-variant"
                      name="q1"
                      type="radio"
                      value="b"
                      checked={answers[1] === 'b'}
                      onChange={(e) =>
                        setAnswers({ ...answers, 1: e.target.value })
                      }
                    />
                    <span
                      className={`ml-4 text-base ${
                        answers[1] === 'b'
                          ? 'text-primary font-medium'
                          : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      To specify how the application's state changes in response
                      to actions sent to the store.
                    </span>
                  </label>
                  {/* Option C */}
                  <label
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors group ${
                      answers[1] === 'c'
                        ? 'border-secondary bg-surface-container-low border-2'
                        : 'border-border-subtle hover:bg-surface-container hover:border-secondary'
                    }`}
                  >
                    <input
                      className="form-radio text-secondary focus:ring-secondary h-5 w-5 border-outline-variant"
                      name="q1"
                      type="radio"
                      value="c"
                      checked={answers[1] === 'c'}
                      onChange={(e) =>
                        setAnswers({ ...answers, 1: e.target.value })
                      }
                    />
                    <span
                      className={`ml-4 text-base ${
                        answers[1] === 'c'
                          ? 'text-primary font-medium'
                          : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      To connect React components directly to the Redux store.
                    </span>
                  </label>
                  {/* Option D */}
                  <label
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors group ${
                      answers[1] === 'd'
                        ? 'border-secondary bg-surface-container-low border-2'
                        : 'border-border-subtle hover:bg-surface-container hover:border-secondary'
                    }`}
                  >
                    <input
                      className="form-radio text-secondary focus:ring-secondary h-5 w-5 border-outline-variant"
                      name="q1"
                      type="radio"
                      value="d"
                      checked={answers[1] === 'd'}
                      onChange={(e) =>
                        setAnswers({ ...answers, 1: e.target.value })
                      }
                    />
                    <span
                      className={`ml-4 text-base ${
                        answers[1] === 'd'
                          ? 'text-primary font-medium'
                          : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      To define the initial routing structure of a single-page
                      application.
                    </span>
                  </label>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="font-bold text-sm bg-secondary text-white hover:bg-secondary-container transition-colors px-6 py-2.5 rounded-lg shadow-sm"
                  >
                    Save & Next
                  </button>
                </div>
              </section>
            ) : (
              /* Section 2: Coding Challenge (Split Pane) */
              <section className="bg-surface-card rounded-2xl border border-border-subtle flex flex-col lg:flex-row shadow-sm flex-1 min-h-125 overflow-hidden">
                {/* Left Pane: Problem Statement */}
                <div className="w-full lg:w-5/12 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-border-subtle flex flex-col bg-surface-card">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                      Question 2 of 20
                    </span>
                    <span className="bg-surface-container px-3 py-1 rounded-full font-bold text-xs text-secondary flex items-center gap-1">
                      <Code size={14} />
                      Coding
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-headline-md text-primary mb-4 tracking-tight">
                    Reverse a Linked List
                  </h3>
                  <div className="prose prose-sm max-w-none font-body-sm text-on-surface-variant space-y-4 flex-1">
                    <p className="text-base leading-relaxed">
                      Given the{' '}
                      <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-secondary font-mono text-sm border border-border-subtle">
                        head
                      </code>{' '}
                      of a singly linked list, reverse the list, and return{' '}
                      <em>the reversed list</em>.
                    </p>
                    <div className="mt-6">
                      <h4 className="font-bold text-sm text-primary mb-2">
                        Example 1:
                      </h4>
                      <div className="bg-surface-container-low p-4 rounded-lg border border-border-subtle font-mono text-sm text-on-surface shadow-inner">
                        <strong>Input:</strong> head = [1,2,3,4,5]
                        <br />
                        <strong>Output:</strong> [5,4,3,2,1]
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-bold text-sm text-primary mb-2">
                        Constraints:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-sm">
                        <li>
                          The number of nodes in the list is the range{' '}
                          <code className="bg-surface-container-low px-1 py-0.5 rounded text-secondary font-mono text-xs border border-border-subtle">
                            [0, 5000]
                          </code>
                          .
                        </li>
                        <li>
                          <code className="bg-surface-container-low px-1 py-0.5 rounded text-secondary font-mono text-xs border border-border-subtle">
                            -5000 &lt;= Node.val &lt;= 5000
                          </code>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Right Pane: Code Editor */}
                <div className="w-full lg:w-7/12 flex flex-col bg-[#1e1e1e] overflow-hidden">
                  {/* Editor Toolbar */}
                  <div className="bg-[#252526] border-b border-[#333333] px-4 py-2.5 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold text-xs">
                        JS
                      </span>
                      <span className="font-mono text-sm text-[#D4D4D4]">
                        solution.js
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-[#A3A3A3] hover:text-white transition-colors p-1 rounded hover:bg-[#333]"
                        title="Reset Code"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        className="text-[#A3A3A3] hover:text-white transition-colors p-1 rounded hover:bg-[#333]"
                        title="Settings"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>
                  {/* The actual editor area */}
                  <div className="flex-1 flex overflow-hidden relative bg-[#1e1e1e]">
                    {/* Line numbers */}
                    <div className="w-12 bg-[#1e1e1e] text-[#858585] font-mono text-sm text-right pr-4 py-4 select-none border-r border-[#333333]">
                      1<br />
                      2<br />
                      3<br />
                      4<br />
                      5<br />
                      6<br />
                      7<br />
                      8<br />
                      9<br />
                      10
                      <br />
                      11
                    </div>
                    {/* Code content */}
                    <textarea
                      value={codeSolution}
                      onChange={(e) => setCodeSolution(e.target.value)}
                      className="flex-1 p-4 font-mono text-sm overflow-auto text-[#D4D4D4] whitespace-pre bg-transparent border-none focus:ring-0 outline-none resize-none"
                      spellCheck="false"
                    />
                  </div>
                  {/* Editor Footer / Actions */}
                  <div className="bg-[#252526] border-t border-[#333333] p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#A3A3A3] font-mono text-xs font-semibold uppercase tracking-wider">
                      <Terminal size={16} />
                      Console Ready
                    </div>
                    <button className="font-bold text-sm bg-secondary text-white hover:bg-secondary-container transition-colors px-6 py-2 rounded-lg shadow-sm flex items-center gap-2">
                      <Play size={16} fill="currentColor" />
                      Run Tests
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface-card border-t border-border-subtle flex justify-between items-center px-4 md:px-10 py-4 fixed bottom-0 right-0 w-full md:w-[calc(100%-280px)] z-40 h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-medium text-on-surface-variant flex items-center gap-4">
          <span>© 2024 EduStudio</span>
          <div className="hidden lg:flex gap-4 border-l border-border-subtle pl-4">
            <a className="hover:text-secondary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-secondary transition-colors" href="#">
              Exam Rules
            </a>
            <a className="hover:text-secondary transition-colors" href="#">
              System Check
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevious}
            disabled={activeQuestion === 1}
            className="font-semibold text-sm text-on-surface-variant border border-border-subtle bg-surface-card hover:bg-surface-container hover:text-primary transition-colors px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={activeQuestion === 2}
            className="font-bold text-sm bg-secondary text-white hover:bg-secondary-container transition-colors px-6 py-2 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
}
