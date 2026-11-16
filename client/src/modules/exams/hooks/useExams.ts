'use client';

import { useState, useCallback } from 'react';
import { examsService } from '../services/exams.service';
import { Exam, ExamAttempt } from '@/types/exam.types';

export function useExams() {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(
    null
  );

  const loadExam = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await examsService.getExamById(id);
      setExam(res);
      return { success: true, data: res };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to load exam';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const startExam = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await examsService.startAttempt(id);
      setCurrentAttempt(res);
      return { success: true, data: res };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Failed to start exam attempt';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAttempt = useCallback(
    async (_id: string, attemptId: string, answers: any) => {
      setLoading(true);
      setError(null);
      try {
        const formattedAnswers = Array.isArray(answers)
          ? answers
          : Object.entries(answers).map(([questionId, val]) => {
              const isCode =
                typeof val === 'string' &&
                (val.includes(' ') || val.includes('\n') || val.length > 36);
              return {
                questionId,
                optionId: isCode ? undefined : val,
                code: isCode ? val : undefined,
              };
            });

        const res = await examsService.submitAttempt(
          attemptId,
          formattedAnswers
        );
        setCurrentAttempt(res);
        return { success: true, data: res };
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Failed to submit exam';
        setError(errMsg);
        return { success: false, error: errMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    exam,
    loading,
    error,
    currentAttempt,
    loadExam,
    startExam,
    submitAttempt,
  };
}
