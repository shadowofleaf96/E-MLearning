import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { examsService } from '../../services/exams.service';
import { Plus, Trash2 } from 'lucide-react';

interface ExamBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  examToEdit?: any;
  onSaved: () => void;
}

export function ExamBuilderModal({
  isOpen,
  onClose,
  moduleId,
  examToEdit,
  onSaved,
}: ExamBuilderModalProps) {
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passingScore, setPassingScore] = useState(50);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (examToEdit) {
      setTitle(examToEdit.title);
      setDurationMinutes(examToEdit.durationMinutes || 60);
      setPassingScore(examToEdit.passingScore || 50);
      setQuestions(examToEdit.questions || []);
    } else {
      setTitle('');
      setDurationMinutes(60);
      setPassingScore(50);
      setQuestions([]);
    }
  }, [examToEdit, isOpen]);

  const addQcmQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'QCM',
        questionText: '',
        points: 1,
        qcmOptions: [
          { optionText: '', isCorrect: true },
          { optionText: '', isCorrect: false },
        ],
      },
    ]);
  };

  const addCodingQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'CODING',
        questionText: '',
        points: 5,
        codingExercise: {
          language: 'javascript',
          starterCode: '// Write your code here\n',
          solutionTemplate: '',
          testCases: [
            { inputData: '{}', expectedOutput: '{}', isHidden: false },
          ],
        },
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, updates: any) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], ...updates };
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (!title) return toast.error('Title is required');
    setLoading(true);
    try {
      if (examToEdit) {
        await examsService.updateExam(examToEdit.id, {
          title,
          durationMinutes,
          passingScore,
          questions,
        });
        toast.success('Exam updated');
      } else {
        await examsService.createExam({
          moduleId,
          title,
          durationMinutes,
          passingScore,
          questions,
        });
        toast.success('Exam created');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error('Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{examToEdit ? 'Edit Exam' : 'Add Exam'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exam Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Final Assessment"
                className="bg-zinc-800 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (Minutes)</Label>
              <Input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="bg-zinc-800 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="bg-zinc-800 border-white/10"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Questions ({questions.length})
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addQcmQuestion}
                  className="border-white/10 text-zinc-300"
                >
                  <Plus size={16} className="mr-2" /> Add QCM
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCodingQuestion}
                  className="border-white/10 text-purple-400"
                >
                  <Plus size={16} className="mr-2" /> Add Coding
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-white/5 bg-zinc-800/50 rounded-lg relative group"
                >
                  <button
                    onClick={() => removeQuestion(idx)}
                    className="absolute top-2 right-2 p-1 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="mb-4 space-y-2">
                    <Label className="text-zinc-400">
                      {q.type === 'QCM'
                        ? 'QCM Question Text'
                        : 'Coding Problem Description'}
                    </Label>
                    <Input
                      value={q.questionText}
                      onChange={(e) =>
                        updateQuestion(idx, { questionText: e.target.value })
                      }
                      className="bg-zinc-900 border-white/10"
                    />
                  </div>

                  {q.type === 'QCM' && (
                    <div className="space-y-2 ml-4 border-l-2 border-zinc-700 pl-4">
                      {q.qcmOptions?.map((opt: any, oIdx: number) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={opt.isCorrect}
                            onChange={() => {
                              const newOpts = q.qcmOptions.map(
                                (o: any, i: number) => ({
                                  ...o,
                                  isCorrect: i === oIdx,
                                })
                              );
                              updateQuestion(idx, { qcmOptions: newOpts });
                            }}
                          />
                          <Input
                            value={opt.optionText}
                            onChange={(e) => {
                              const newOpts = [...q.qcmOptions];
                              newOpts[oIdx].optionText = e.target.value;
                              updateQuestion(idx, { qcmOptions: newOpts });
                            }}
                            className="h-8 bg-zinc-900 border-white/10"
                            placeholder="Option text"
                          />
                          <button
                            onClick={() => {
                              const newOpts = q.qcmOptions.filter(
                                (_: any, i: number) => i !== oIdx
                              );
                              updateQuestion(idx, { qcmOptions: newOpts });
                            }}
                            className="text-zinc-500 hover:text-rose-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateQuestion(idx, {
                            qcmOptions: [
                              ...q.qcmOptions,
                              { optionText: '', isCorrect: false },
                            ],
                          });
                        }}
                        className="text-zinc-400 mt-2 h-6 text-xs"
                      >
                        + Add Option
                      </Button>
                    </div>
                  )}

                  {q.type === 'CODING' && (
                    <div className="space-y-4 ml-4 border-l-2 border-purple-500/50 pl-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-zinc-400">
                          Language
                        </Label>
                        <select
                          className="w-full bg-zinc-900 border border-white/10 rounded-md p-2 text-sm text-white"
                          value={q.codingExercise.language}
                          onChange={(e) =>
                            updateQuestion(idx, {
                              codingExercise: {
                                ...q.codingExercise,
                                language: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-zinc-400">
                          Starter Code
                        </Label>
                        <textarea
                          rows={3}
                          className="w-full bg-zinc-900 font-mono text-sm border border-white/10 rounded-md p-2 text-white"
                          value={q.codingExercise.starterCode}
                          onChange={(e) =>
                            updateQuestion(idx, {
                              codingExercise: {
                                ...q.codingExercise,
                                starterCode: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-400">
                          Test Cases
                        </Label>
                        {q.codingExercise.testCases?.map(
                          (tc: any, tIdx: number) => (
                            <div
                              key={tIdx}
                              className="flex gap-2 mt-2 items-center"
                            >
                              <Input
                                placeholder="Input Data (JSON)"
                                value={tc.inputData}
                                onChange={(e) => {
                                  const newTcs = [
                                    ...q.codingExercise.testCases,
                                  ];
                                  newTcs[tIdx].inputData = e.target.value;
                                  updateQuestion(idx, {
                                    codingExercise: {
                                      ...q.codingExercise,
                                      testCases: newTcs,
                                    },
                                  });
                                }}
                                className="h-8 bg-zinc-900 border-white/10 text-xs font-mono"
                              />
                              <Input
                                placeholder="Expected Output (JSON)"
                                value={tc.expectedOutput}
                                onChange={(e) => {
                                  const newTcs = [
                                    ...q.codingExercise.testCases,
                                  ];
                                  newTcs[tIdx].expectedOutput = e.target.value;
                                  updateQuestion(idx, {
                                    codingExercise: {
                                      ...q.codingExercise,
                                      testCases: newTcs,
                                    },
                                  });
                                }}
                                className="h-8 bg-zinc-900 border-white/10 text-xs font-mono"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
