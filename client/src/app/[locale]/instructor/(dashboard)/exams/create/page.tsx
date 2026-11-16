'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ExamType = 'QUIZ' | 'CODING' | 'MIXED';
type QuestionType = 'qcm' | 'coding';

interface QCMOption {
  optionText: string;
  isCorrect: boolean;
}

interface TestCase {
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface CodingExercise {
  language: string;
  starterCode: string;
  solutionTemplate: string;
  testCases: TestCase[];
}

interface Question {
  id: string; // for React key
  type: QuestionType;
  questionText: string;
  points: number;
  qcmOptions?: QCMOption[];
  codingExercise?: CodingExercise;
}

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<any[]>([]);

  // Exam Basic Info
  const [title, setTitle] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [examType, setExamType] = useState<ExamType>('MIXED');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passingScore, setPassingScore] = useState(50);
  const [maxAttempts, setMaxAttempts] = useState(3);

  // Questions State
  const [questions, setQuestions] = useState<Question[]>([]);

  // Fetch modules/courses
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get(ENDPOINTS.COURSES.LIST);
        const courses = res.data.data || [];
        setModules(courses.map((c: any) => ({ id: c.id, title: c.title })));
      } catch (e) {
        console.error('Failed to fetch modules', e);
      }
    };
    fetchModules();
  }, []);

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      questionText: '',
      points: 10,
    };

    if (type === 'qcm') {
      newQuestion.qcmOptions = [
        { optionText: '', isCorrect: true },
        { optionText: '', isCorrect: false },
      ];
    } else {
      newQuestion.codingExercise = {
        language: 'javascript',
        starterCode: '// Write your code here\n',
        solutionTemplate: '// Solution\n',
        testCases: [{ inputData: '', expectedOutput: '', isHidden: false }],
      };
    }

    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !moduleId) {
      toast.error('Title and Course/Module are required.');
      return;
    }
    if (questions.length === 0) {
      toast.error('Please add at least one question.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        moduleId,
        type: examType,
        durationMinutes: Number(durationMinutes),
        passingScore: Number(passingScore),
        maxAttempts: Number(maxAttempts),
        questions: questions.map((q) => {
          if (q.type === 'qcm') {
            return {
              type: 'qcm',
              questionText: q.questionText,
              points: Number(q.points),
              qcmOptions: q.qcmOptions,
            };
          } else {
            return {
              type: 'coding',
              questionText: q.questionText,
              points: Number(q.points),
              codingExercise: q.codingExercise,
            };
          }
        }),
      };

      await api.post(ENDPOINTS.EXAMS.CREATE, payload);
      toast.success('Exam created successfully!');
      router.push('/instructor/exams');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  // Helper stats
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const mcqCount = questions.filter((q) => q.type === 'qcm').length;
  const codingCount = questions.filter((q) => q.type === 'coding').length;
  const selectedModuleName =
    modules.find((m) => m.id === moduleId)?.title || 'No Course Selected';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/instructor/exams"
          className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
        </Link>
        <div>
          <h2 className="text-[32px] font-bold text-primary font-headline-lg tracking-tight">
            Create Assessment
          </h2>
          <p className="text-on-surface-variant text-body-md mt-1">
            Build a comprehensive exam with multiple choice questions and coding
            challenges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Card */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-border-subtle pb-4">
                <span className="material-symbols-outlined text-secondary">
                  info
                </span>
                Assessment Info
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="exam-title"
                    className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
                  >
                    Assessment Title
                  </Label>
                  <Input
                    id="exam-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Midterm JavaScript Basics"
                    className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="exam-course"
                      className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
                    >
                      Target Course
                    </Label>
                    <select
                      id="exam-course"
                      required
                      value={moduleId}
                      onChange={(e) => setModuleId(e.target.value)}
                      className="w-full border border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-3 rounded-xl outline-none appearance-none"
                    >
                      <option value="">Select a course...</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="exam-type"
                      className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
                    >
                      Assessment Type
                    </Label>
                    <select
                      id="exam-type"
                      value={examType}
                      onChange={(e) => setExamType(e.target.value as ExamType)}
                      className="w-full border border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-3 rounded-xl outline-none appearance-none"
                    >
                      <option value="MIXED">Mixed (MCQ & Coding)</option>
                      <option value="QUIZ">MCQ Only</option>
                      <option value="CODING">Coding Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="exam-duration"
                      className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
                    >
                      Duration (Min)
                    </Label>
                    <Input
                      id="exam-duration"
                      type="number"
                      min="1"
                      required
                      value={durationMinutes}
                      onChange={(e) =>
                        setDurationMinutes(Number(e.target.value))
                      }
                      className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="exam-passing"
                      className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
                    >
                      Passing Score (%)
                    </Label>
                    <Input
                      id="exam-passing"
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={passingScore}
                      onChange={(e) => setPassingScore(Number(e.target.value))}
                      className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="exam-attempts"
                      className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider"
                    >
                      Max Attempts
                    </Label>
                    <Input
                      id="exam-attempts"
                      type="number"
                      min="1"
                      required
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(Number(e.target.value))}
                      className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List Card */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">
                    format_list_bulleted
                  </span>
                  Questions ({questions.length})
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddQuestion('qcm')}
                    className="border-border-subtle text-on-surface-variant hover:text-primary rounded-xl font-bold flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add_circle
                    </span>
                    Add MCQ
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddQuestion('coding')}
                    className="border-border-subtle text-on-surface-variant hover:text-primary rounded-xl font-bold flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      code
                    </span>
                    Add Coding
                  </Button>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="bg-surface-card border border-dashed border-border-subtle rounded-2xl p-12 flex flex-col items-center justify-center text-center opacity-80">
                  <span className="material-symbols-outlined text-4xl mb-3 text-outline">
                    assignment
                  </span>
                  <p className="text-on-surface-variant text-body-md">
                    No questions added yet.
                    <br />
                    Click the buttons above to start building your assessment.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((q, index) => (
                    <div
                      key={q.id}
                      className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm relative group space-y-6"
                    >
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition"
                          title="Remove Question"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </span>
                        <span className="text-[10px] font-bold text-secondary bg-secondary/5 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {q.type === 'qcm'
                            ? 'Multiple Choice'
                            : 'Coding Challenge'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-9 space-y-2">
                          <Label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
                            Problem Statement
                          </Label>
                          <Textarea
                            required
                            rows={q.type === 'coding' ? 4 : 2}
                            value={q.questionText}
                            onChange={(e) =>
                              handleUpdateQuestion(q.id, {
                                questionText: e.target.value,
                              })
                            }
                            placeholder="Describe the question or problem..."
                            className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 rounded-xl outline-none min-h-20 resize-none"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <Label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
                            Points
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            required
                            value={q.points}
                            onChange={(e) =>
                              handleUpdateQuestion(q.id, {
                                points: Number(e.target.value),
                              })
                            }
                            className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-4 rounded-xl outline-none"
                          />
                        </div>
                      </div>

                      {/* MCQ Options */}
                      {q.type === 'qcm' && q.qcmOptions && (
                        <div className="space-y-3">
                          <Label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
                            Answers (Select the correct one)
                          </Label>
                          {q.qcmOptions.map((opt, oIndex) => (
                            <div
                              key={oIndex}
                              className="flex items-center gap-4"
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}-correct`}
                                checked={opt.isCorrect}
                                onChange={() => {
                                  const newOpts = q.qcmOptions!.map((o, i) => ({
                                    ...o,
                                    isCorrect: i === oIndex,
                                  }));
                                  handleUpdateQuestion(q.id, {
                                    qcmOptions: newOpts,
                                  });
                                }}
                                className="w-5 h-5 text-secondary focus:ring-secondary accent-secondary"
                              />
                              <input
                                type="text"
                                required
                                value={opt.optionText}
                                onChange={(e) => {
                                  const newOpts = [...q.qcmOptions!];
                                  newOpts[oIndex].optionText = e.target.value;
                                  handleUpdateQuestion(q.id, {
                                    qcmOptions: newOpts,
                                  });
                                }}
                                placeholder={`Option ${oIndex + 1}`}
                                className={`flex-1 border p-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-secondary/15 ${
                                  opt.isCorrect
                                    ? 'border-secondary bg-secondary/5 text-primary font-bold'
                                    : 'border-border-subtle bg-surface-bg text-primary'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (q.qcmOptions!.length > 2) {
                                    const newOpts = q.qcmOptions!.filter(
                                      (_, i) => i !== oIndex
                                    );
                                    if (opt.isCorrect)
                                      newOpts[0].isCorrect = true;
                                    handleUpdateQuestion(q.id, {
                                      qcmOptions: newOpts,
                                    });
                                  } else {
                                    toast.warning(
                                      'MCQ must have at least 2 options.'
                                    );
                                  }
                                }}
                                className="text-outline hover:text-error transition"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  close
                                </span>
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateQuestion(q.id, {
                                qcmOptions: [
                                  ...q.qcmOptions!,
                                  { optionText: '', isCorrect: false },
                                ],
                              });
                            }}
                            className="text-secondary font-bold text-xs hover:underline mt-2 inline-block"
                          >
                            + Add another option
                          </button>
                        </div>
                      )}

                      {/* Coding Exercise Details */}
                      {q.type === 'coding' && q.codingExercise && (
                        <div className="space-y-6 pt-6 border-t border-border-subtle">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider flex justify-between">
                                Starter Code
                                <span className="text-[10px] text-outline font-normal uppercase">
                                  Visible to student
                                </span>
                              </Label>
                              <textarea
                                rows={5}
                                value={q.codingExercise.starterCode}
                                onChange={(e) =>
                                  handleUpdateQuestion(q.id, {
                                    codingExercise: {
                                      ...q.codingExercise!,
                                      starterCode: e.target.value,
                                    },
                                  })
                                }
                                className="w-full p-4 border border-border-subtle bg-surface-bg text-primary font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/15"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider flex justify-between">
                                Solution Reference
                                <span className="text-[10px] text-outline font-normal uppercase">
                                  Private
                                </span>
                              </Label>
                              <textarea
                                rows={5}
                                value={q.codingExercise.solutionTemplate}
                                onChange={(e) =>
                                  handleUpdateQuestion(q.id, {
                                    codingExercise: {
                                      ...q.codingExercise!,
                                      solutionTemplate: e.target.value,
                                    },
                                  })
                                }
                                className="w-full p-4 border border-border-subtle bg-surface-bg text-primary font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/15"
                              />
                            </div>
                          </div>

                          <div className="bg-surface-bg border border-border-subtle rounded-xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
                                Test Cases
                              </Label>
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateQuestion(q.id, {
                                    codingExercise: {
                                      ...q.codingExercise!,
                                      testCases: [
                                        ...q.codingExercise!.testCases,
                                        {
                                          inputData: '',
                                          expectedOutput: '',
                                          isHidden: false,
                                        },
                                      ],
                                    },
                                  });
                                }}
                                className="text-secondary font-bold text-xs flex items-center gap-1 hover:underline"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  add
                                </span>{' '}
                                Add Test Case
                              </button>
                            </div>

                            <div className="space-y-4">
                              {q.codingExercise.testCases.map((tc, tcIndex) => (
                                <div
                                  key={tcIndex}
                                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative border-b border-border-subtle md:border-b-0 pb-4 md:pb-0"
                                >
                                  <div className="md:col-span-4">
                                    <Input
                                      type="text"
                                      required
                                      placeholder="Input data (e.g. 2, 3)"
                                      value={tc.inputData}
                                      onChange={(e) => {
                                        const newTCs = [
                                          ...q.codingExercise!.testCases,
                                        ];
                                        newTCs[tcIndex].inputData =
                                          e.target.value;
                                        handleUpdateQuestion(q.id, {
                                          codingExercise: {
                                            ...q.codingExercise!,
                                            testCases: newTCs,
                                          },
                                        });
                                      }}
                                      className="w-full border-border-subtle bg-surface-card text-primary font-mono text-xs p-3 rounded-lg outline-none"
                                    />
                                  </div>
                                  <div className="md:col-span-4">
                                    <Input
                                      type="text"
                                      required
                                      placeholder="Expected output (e.g. 5)"
                                      value={tc.expectedOutput}
                                      onChange={(e) => {
                                        const newTCs = [
                                          ...q.codingExercise!.testCases,
                                        ];
                                        newTCs[tcIndex].expectedOutput =
                                          e.target.value;
                                        handleUpdateQuestion(q.id, {
                                          codingExercise: {
                                            ...q.codingExercise!,
                                            testCases: newTCs,
                                          },
                                        });
                                      }}
                                      className="w-full border-border-subtle bg-surface-card text-primary font-mono text-xs p-3 rounded-lg outline-none"
                                    />
                                  </div>
                                  <div className="md:col-span-3 flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`tc-${q.id}-${tcIndex}-hidden`}
                                      checked={tc.isHidden}
                                      onChange={(e) => {
                                        const newTCs = [
                                          ...q.codingExercise!.testCases,
                                        ];
                                        newTCs[tcIndex].isHidden =
                                          e.target.checked;
                                        handleUpdateQuestion(q.id, {
                                          codingExercise: {
                                            ...q.codingExercise!,
                                            testCases: newTCs,
                                          },
                                        });
                                      }}
                                      className="w-4 h-4 rounded text-secondary focus:ring-secondary accent-secondary"
                                    />
                                    <label
                                      htmlFor={`tc-${q.id}-${tcIndex}-hidden`}
                                      className="text-xs text-on-surface-variant font-bold cursor-pointer uppercase tracking-wider"
                                    >
                                      Hidden
                                    </label>
                                  </div>
                                  <div className="md:col-span-1 text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          q.codingExercise!.testCases.length > 1
                                        ) {
                                          const newTCs =
                                            q.codingExercise!.testCases.filter(
                                              (_, i) => i !== tcIndex
                                            );
                                          handleUpdateQuestion(q.id, {
                                            codingExercise: {
                                              ...q.codingExercise!,
                                              testCases: newTCs,
                                            },
                                          });
                                        } else {
                                          toast.warning(
                                            'Coding challenge must have at least 1 test case.'
                                          );
                                        }
                                      }}
                                      className="text-outline hover:text-error transition"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">
                                        close
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-6 border-t border-border-subtle">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/instructor/exams')}
                className="px-6 py-2.5 border-border-subtle text-on-surface-variant hover:text-primary rounded-xl font-bold transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-secondary hover:bg-secondary/95 text-white font-bold px-8 py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-secondary/10 flex items-center gap-2"
              >
                {loading ? 'Saving...' : 'Publish Assessment'}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview / Summary Sticky Column */}
        <div className="lg:col-span-5 sticky top-8 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">
              Assessment Summary
            </p>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(0,88,190,0.5)]"></span>
          </div>

          <div className="w-full bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header Gradient Thumbnail */}
            <div className="bg-linear-to-tr from-secondary/80 to-primary/80 h-48 flex flex-col items-center justify-center p-6 text-white text-center relative group overflow-hidden">
              <span className="material-symbols-outlined text-[48px] opacity-80 mb-2">
                assignment
              </span>
              <p className="text-sm font-bold uppercase tracking-wider opacity-95">
                New Assessment Draft
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <span className="text-[10px] font-bold text-secondary bg-secondary/5 px-2.5 py-1 rounded-md uppercase tracking-wider w-fit block">
                {examType}
              </span>

              <h4 className="text-xl font-extrabold text-primary line-clamp-2 min-h-[56px] leading-tight">
                {title || 'Assessment Title Placeholder'}
              </h4>

              <p className="text-body-sm text-on-surface-variant min-h-[40px] leading-relaxed">
                Target:{' '}
                <span className="font-bold text-primary">
                  {selectedModuleName}
                </span>
              </p>

              <div className="h-px bg-border-subtle" />

              <div className="grid grid-cols-2 gap-4 text-xs text-on-surface-variant font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    timer
                  </span>
                  {durationMinutes} Minutes
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    grade
                  </span>
                  Pass: {passingScore}%
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    format_list_bulleted
                  </span>
                  {mcqCount} QCM / {codingCount} Coding
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    star
                  </span>
                  {totalPoints} Total Points
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
