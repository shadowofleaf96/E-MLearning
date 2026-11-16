'use client';

import React, { useState, useEffect } from 'react';
import { useExams } from '../hooks/useExams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CodeEditor from '@/components/shared/CodeEditor';

interface ExamViewerProps {
  examId: string;
}

export default function ExamViewer({ examId }: ExamViewerProps) {
  const { exam, loading, currentAttempt, loadExam, startExam, submitAttempt } =
    useExams();
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadExam(examId);
  }, [examId, loadExam]);

  const handleStart = async () => {
    await startExam(examId);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const handleCodeChange = (questionId: string, code: string) => {
    setAnswers({
      ...answers,
      [questionId]: code,
    });
  };

  const handleSubmit = async () => {
    if (currentAttempt) {
      const res = await submitAttempt(examId, currentAttempt.id, answers);
      if (res.success) {
        setCompleted(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[320px] items-center justify-center text-zinc-400">
        <svg
          className="mr-2 h-6 w-6 animate-spin text-emerald-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Loading exam content...</span>
      </div>
    );
  }

  if (completed || (currentAttempt && currentAttempt.submittedAt)) {
    return (
      <Card className="border-white/10 bg-zinc-900/60 p-6 text-center backdrop-blur-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <CardTitle className="text-xl font-bold text-white">
            Exam Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-400">
            Your answers have been successfully submitted for grading.
          </p>
          {currentAttempt?.score !== undefined && (
            <div className="inline-block rounded-xl bg-zinc-950 px-6 py-3 border border-white/5">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">
                Your Score
              </span>
              <span className="text-3xl font-extrabold text-emerald-400">
                {currentAttempt.score}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!currentAttempt) {
    return (
      <Card className="border-white/10 bg-zinc-900/40 p-6 text-center backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            {exam?.title || 'Exam Assessment'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-zinc-950/40 p-3 border border-white/5">
              <span className="text-xs text-zinc-500 block">Duration</span>
              <span className="text-lg font-semibold text-white">
                {exam?.durationMinutes} min
              </span>
            </div>
            <div className="rounded-xl bg-zinc-950/40 p-3 border border-white/5">
              <span className="text-xs text-zinc-500 block">Passing Score</span>
              <span className="text-lg font-semibold text-white">
                {exam?.passingScore}%
              </span>
            </div>
            <div className="rounded-xl bg-zinc-950/40 p-3 border border-white/5">
              <span className="text-xs text-zinc-500 block">
                Attempts Allowed
              </span>
              <span className="text-lg font-semibold text-white">
                {exam?.maxAttempts}
              </span>
            </div>
          </div>
          <p className="text-sm text-zinc-500">
            Make sure you are in a quiet workspace. Once you click Start, the
            timer will begin.
          </p>
          <Button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 font-semibold py-6 text-base shadow-lg shadow-emerald-500/10"
          >
            Start Exam
          </Button>
        </CardContent>
      </Card>
    );
  }

  const questions = exam?.questions || [];
  const currentQuestion = questions[activeQuestionIdx];

  if (!currentQuestion) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Questions Sidebar Indicator */}
      <div className="flex flex-row gap-2 overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/30 p-4 lg:col-span-1 lg:flex-col lg:overflow-x-visible">
        <h4 className="hidden text-xs font-semibold uppercase tracking-wider text-zinc-500 lg:block mb-2 px-1">
          Questions
        </h4>
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveQuestionIdx(idx)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition lg:h-auto lg:w-full lg:justify-start lg:px-3 lg:py-2.5 ${
              activeQuestionIdx === idx
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : answers[questions[idx].id] !== undefined
                  ? 'bg-zinc-800 text-zinc-300'
                  : 'text-zinc-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="lg:hidden">{idx + 1}</span>
            <span className="hidden lg:inline">Question {idx + 1}</span>
          </button>
        ))}
      </div>

      {/* Main Question Panel */}
      <Card className="lg:col-span-3 border-white/10 bg-zinc-900/40 backdrop-blur-md">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-lg text-white">
            Question {activeQuestionIdx + 1} of {questions.length}
          </CardTitle>
          <p className="mt-2 text-base text-zinc-300 font-medium leading-relaxed">
            {currentQuestion.questionText}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {currentQuestion.type === 'qcm' && currentQuestion.qcmOptions && (
            <div className="flex flex-col gap-3">
              {currentQuestion.qcmOptions.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleSelectOption(currentQuestion.id, option.id)
                    }
                    className={`flex items-center gap-3 w-full rounded-xl border p-4 text-left text-sm font-medium transition duration-200 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400'
                        : 'border-white/10 bg-zinc-950/40 text-zinc-300 hover:border-white/20 hover:bg-zinc-950/60'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                        isSelected
                          ? 'border-emerald-400 text-emerald-400'
                          : 'border-zinc-700'
                      }`}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      )}
                    </span>
                    {option.optionText}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'coding' && (
            <div className="flex flex-col gap-4">
              <CodeEditor
                value={
                  answers[currentQuestion.id] ||
                  currentQuestion.codingExercise?.starterCode ||
                  ''
                }
                onChange={(code) => handleCodeChange(currentQuestion.id, code)}
                language={
                  currentQuestion.codingExercise?.language || 'javascript'
                }
              />
            </div>
          )}

          <div className="mt-6 flex justify-between border-t border-white/5 pt-6">
            <Button
              disabled={activeQuestionIdx === 0}
              onClick={() => setActiveQuestionIdx(activeQuestionIdx - 1)}
              variant="outline"
              className="border-white/10 hover:bg-white/5 hover:text-white"
            >
              Previous
            </Button>
            {activeQuestionIdx < questions.length - 1 ? (
              <Button
                onClick={() => setActiveQuestionIdx(activeQuestionIdx + 1)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-medium"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold"
              >
                Submit Exam
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
