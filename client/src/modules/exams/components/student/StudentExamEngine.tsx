import React, { useState, useEffect } from 'react';
import { examsService } from '../../services/exams.service';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';

interface StudentExamEngineProps {
  examId: string;
  onExamCompleted: () => void;
}

export function StudentExamEngine({
  examId,
  onExamCompleted,
}: StudentExamEngineProps) {
  const [exam, setExam] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Refactored state for pagination and timer
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    loadExam();
  }, [examId]);

  useEffect(() => {
    let interval: any;
    if (attempt && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (attempt && timeRemaining <= 0) {
      // Auto submit if time is up
      if (interval) clearInterval(interval);
      // Wait to auto-submit only if it's currently running
    }
    return () => clearInterval(interval);
  }, [attempt, timeRemaining]);

  const loadExam = async () => {
    setLoading(true);
    try {
      const data = await examsService.getExamById(examId);
      setExam(data);
    } catch (err) {
      toast.error('Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const startExam = async () => {
    try {
      const newAttempt = await examsService.startAttempt(examId);
      setAttempt(newAttempt);
      setTimeRemaining(exam.durationMinutes * 60);
      setCurrentQuestionIndex(0);
    } catch (err) {
      toast.error('Failed to start exam');
    }
  };

  const submitExam = async () => {
    if (!attempt) return;
    try {
      const result = await examsService.submitAttempt(attempt.id, answers);
      toast.success(`Exam submitted! Score: ${result.score}%`);
      onExamCompleted();
    } catch (err) {
      toast.error('Failed to submit exam');
    }
  };

  const handleQcmChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, optionId } : a
        );
      }
      return [...prev, { questionId, optionId }];
    });
  };

  const handleCodeChange = (questionId: string, code: string | undefined) => {
    if (code === undefined) return;
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, code } : a
        );
      }
      return [...prev, { questionId, code }];
    });
  };

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

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Exam...</div>;
  }

  if (!exam) {
    return <div className="p-8 text-center text-rose-400">Exam not found</div>;
  }

  // Pre-Start Screen
  if (!attempt) {
    return (
      <div className="bg-surface-bg border border-border-subtle rounded-xl p-8 text-center max-w-2xl mx-auto mt-10 shadow-sm text-on-surface">
        <h2 className="text-3xl font-headline-lg font-bold mb-4">
          {exam.title}
        </h2>
        <p className="text-on-surface-variant font-body-lg mb-8">
          Duration: {exam.durationMinutes} minutes • Passing Score:{' '}
          {exam.passingScore}%
          <br />
          Questions: {exam.questions?.length || 0}
        </p>
        <button
          onClick={startExam}
          className="bg-secondary text-on-secondary font-label-md px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Start Exam
        </button>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isChecked = (qId: string) => answers.some((a) => a.questionId === qId);

  return (
    <div className="fixed inset-0 z-50 bg-surface-bg flex flex-col font-body-md text-on-surface">
      {/* Top Navbar */}
      <header className="bg-surface-container-lowest border-b border-border-subtle fixed top-0 w-full z-50 flex justify-between items-center px-10 h-16 shadow-sm">
        <div className="font-headline-md font-semibold text-on-surface flex items-center gap-2">
          <svg
            className="w-6 h-6 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          {exam.title}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-secondary font-code-sm bg-surface-container-low px-4 py-2 rounded-lg border border-border-subtle">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">{formatTime(timeRemaining)}</span>
          </div>
          <button className="font-label-md text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg border border-transparent hover:border-border-subtle transition-all">
            Review All
          </button>
          <button
            onClick={submitExam}
            className="bg-secondary text-on-secondary font-label-md px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Finish Exam
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 pt-16 h-full">
        {/* Side Navbar */}
        <nav className="bg-surface-container-low border-r border-border-subtle fixed left-0 top-16 bottom-16 w-70 z-40 flex flex-col py-6 overflow-y-auto">
          <div className="px-6 mb-6 border-b border-border-subtle pb-6">
            <h2 className="font-label-md text-on-surface font-semibold">
              Questions Overview
            </h2>
            <p className="font-body-sm text-on-surface-variant">
              {answers.length} of {exam.questions.length} Completed
            </p>
            <div className="mt-4 h-2 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full"
                style={{
                  width: `${(answers.length / exam.questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2">
            {exam.questions.map((q: any, idx: number) => {
              const isActive = idx === currentQuestionIndex;
              const hasAnswered = isChecked(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex items-center gap-3 w-full text-left transition-all duration-200 ease-in-out px-4 py-3 rounded-lg ${
                    isActive
                      ? 'text-secondary border-l-4 border-secondary bg-surface-container-high'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {hasAnswered ? (
                    <svg
                      className="w-5 h-5 text-on-tertiary-container"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : isActive ? (
                    <svg
                      className="w-5 h-5 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-outline"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    </svg>
                  )}
                  <span className="font-label-md">Question {idx + 1}</span>
                </button>
              );
            })}
          </div>
          <div className="px-6 mt-auto pt-6 border-t border-border-subtle">
            <button className="w-full flex items-center justify-center gap-2 font-label-md text-on-surface-variant hover:text-streak-orange transition-colors py-2 border border-border-subtle rounded-lg hover:border-streak-orange">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              Flag for Review
            </button>
          </div>
        </nav>

        {/* Dynamic Main Workspace depending on question type */}
        {currentQuestion?.type === 'QCM' ? (
          <main className="ml-[280px] flex-1 overflow-y-auto p-10 mb-16 bg-surface-bg h-[calc(100vh-8rem)]">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <span className="font-label-md text-secondary uppercase tracking-wider mb-2 block">
                  Question {currentQuestionIndex + 1}
                </span>
                <h1 className="font-headline-lg text-on-surface">
                  {currentQuestion.questionText}
                </h1>
              </div>

              <div className="flex flex-col gap-4">
                {currentQuestion.qcmOptions?.map((opt: any, index: number) => {
                  const isChecked =
                    answers.find((a) => a.questionId === currentQuestion.id)
                      ?.optionId === opt.id;
                  const labelLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                  return (
                    <label
                      key={opt.id}
                      className={`group flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all relative overflow-hidden ${
                        isChecked
                          ? 'bg-surface-container-high border-2 border-secondary shadow-[0_4px_12px_rgba(15,23,42,0.05)]'
                          : 'bg-surface-card border border-border-subtle hover:border-secondary hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]'
                      }`}
                    >
                      {isChecked && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-secondary"></div>
                      )}
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        checked={isChecked}
                        onChange={() =>
                          handleQcmChange(currentQuestion.id, opt.id)
                        }
                        className="mt-1 w-5 h-5 text-secondary border-outline focus:ring-secondary focus:ring-offset-surface-card"
                      />
                      <div>
                        <span
                          className={`font-label-md block mb-1 ${isChecked ? 'text-secondary' : 'text-on-surface-variant'}`}
                        >
                          Option {labelLetters[index]}
                        </span>
                        <span className="font-body-md text-on-surface">
                          {opt.optionText}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-between items-center pt-8 border-t border-border-subtle">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1)
                    )
                  }
                  disabled={currentQuestionIndex === 0}
                  className={`font-label-md px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    currentQuestionIndex === 0
                      ? 'opacity-50 cursor-not-allowed text-outline'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (currentQuestionIndex < exam.questions.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else {
                      submitExam();
                    }
                  }}
                  className="bg-secondary text-on-secondary font-label-md px-8 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
                >
                  {currentQuestionIndex < exam.questions.length - 1
                    ? 'Save & Next'
                    : 'Submit'}
                  {currentQuestionIndex < exam.questions.length - 1 && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </main>
        ) : (
          <main className="fixed top-16 left-[280px] right-0 bottom-14 flex bg-surface-bg z-10">
            {/* Split Pane: Description */}
            <section className="flex-1 flex flex-col bg-surface-card overflow-hidden h-full">
              <div className="px-8 py-6 overflow-y-auto h-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-2 py-1 bg-surface-container-high text-secondary font-label-md rounded uppercase tracking-wide">
                    Coding
                  </span>
                  <h1 className="font-headline-lg text-on-surface">
                    Question {currentQuestionIndex + 1}
                  </h1>
                </div>
                <div className="prose prose-sm max-w-none text-on-surface-variant font-body-md space-y-6">
                  <p>{currentQuestion?.questionText}</p>

                  {currentQuestion?.codingExercise?.testCases?.map(
                    (tc: any, tIdx: number) => (
                      <div
                        key={tIdx}
                        className="bg-surface-container-low p-4 rounded-lg border border-border-subtle mt-4"
                      >
                        <p className="font-label-md mb-2 text-on-surface">
                          Test Case {tIdx + 1}:
                        </p>
                        <div className="font-code-sm text-on-surface-variant pl-4 border-l-2 border-secondary">
                          Input: {tc.inputData}
                          <br />
                          Output: {tc.expectedOutput}
                        </div>
                      </div>
                    )
                  )}
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() =>
                        setCurrentQuestionIndex(
                          Math.max(0, currentQuestionIndex - 1)
                        )
                      }
                      disabled={currentQuestionIndex === 0}
                      className="text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors border border-border-subtle font-label-md"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        if (currentQuestionIndex < exam.questions.length - 1) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else {
                          submitExam();
                        }
                      }}
                      className="bg-secondary text-on-secondary hover:opacity-90 px-4 py-2 rounded-lg transition-opacity font-label-md"
                    >
                      {currentQuestionIndex < exam.questions.length - 1
                        ? 'Save & Next'
                        : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="cursor-col-resize w-1 bg-border-subtle hover:bg-secondary transition-colors"></div>

            {/* Split Pane: Code Editor */}
            <section className="flex-1 flex flex-col bg-[#1E1E1E] h-full border-l border-border-subtle relative">
              <div className="h-12 bg-[#1A1A1A] border-b border-[#333] flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2A2A2A] text-[#E0E0E0] border border-[#444] rounded text-sm px-2 py-1 font-code-sm">
                    {currentQuestion?.codingExercise?.language || 'javascript'}
                  </span>
                </div>
              </div>

              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={
                    currentQuestion?.codingExercise?.language || 'javascript'
                  }
                  theme="vs-dark"
                  value={
                    answers.find((a) => a.questionId === currentQuestion?.id)
                      ?.code ||
                    currentQuestion?.codingExercise?.starterCode ||
                    ''
                  }
                  onChange={(val) => handleCodeChange(currentQuestion.id, val)}
                  options={{ minimap: { enabled: false }, fontSize: 14 }}
                />

                <div className="absolute bottom-6 right-6 flex gap-3">
                  <button className="flex items-center gap-2 bg-secondary text-on-primary font-label-md px-6 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Run Tests
                  </button>
                </div>
              </div>

              {/* Console Output Pane */}
              <div className="h-48 bg-[#1E1E1E] border-t border-[#333] flex flex-col z-20">
                <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-[#333]">
                  <span className="text-[#E0E0E0] font-label-md">
                    Console Output
                  </span>
                </div>
                <div className="p-4 font-code-sm text-[#A0A0A0] overflow-y-auto">
                  &gt; Ready.
                  <br />
                  &gt; Click 'Run Tests' to execute your code against sample
                  cases.
                </div>
              </div>
            </section>
          </main>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-border-subtle fixed bottom-0 right-0 left-[280px] z-30 flex justify-between items-center px-10 py-4 h-14">
        <div className="font-body-sm text-on-surface-variant">
          © 2024 Institutional Exam Systems. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a
            href="#"
            className="font-body-sm text-on-surface-variant hover:text-secondary underline transition-opacity"
          >
            Technical Support
          </a>
          <a
            href="#"
            className="font-body-sm text-on-surface-variant hover:text-secondary underline transition-opacity"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="font-body-sm text-on-surface-variant hover:text-secondary underline transition-opacity"
          >
            Exam Rules
          </a>
        </div>
      </footer>
    </div>
  );
}
