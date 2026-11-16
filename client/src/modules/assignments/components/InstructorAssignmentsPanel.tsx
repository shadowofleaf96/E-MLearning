'use client';

import React, { useState, useEffect } from 'react';
import {
  assignmentsService,
  AssignmentItem,
  SubmissionItem,
} from '../services/assignments.service';
import { toast } from 'react-toastify';

interface Props {
  courseId: string;
  modules?: Array<{ id: string; title: string }>;
}

export function InstructorAssignmentsPanel({ courseId, modules = [] }: Props) {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // New assignment modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [moduleId, setModuleId] = useState(modules[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [creating, setCreating] = useState(false);

  // Grading form state
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(100);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await assignmentsService.getCourseAssignments(courseId);
      if (res?.data) {
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Failed to load assignments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchAssignments();
    }
  }, [courseId]);

  const handleSelectAssignment = async (a: AssignmentItem) => {
    setSelectedAssignment(a);
    try {
      setLoadingSubmissions(true);
      const res = await assignmentsService.getAssignmentSubmissions(a.id);
      if (res?.data) {
        setSubmissions(res.data);
      }
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleId || !title.trim() || !description.trim()) {
      toast.warning('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      await assignmentsService.createAssignment({
        moduleId,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        maxScore: Number(maxScore) || 100,
      });
      toast.success('Assignment created!');
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchAssignments();
    } catch (err) {
      toast.error('Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  const handleSaveGrade = async (submissionId: string) => {
    try {
      setSavingGrade(true);
      await assignmentsService.gradeSubmission(submissionId, {
        grade: Number(gradeInput),
        feedback: feedbackInput.trim() || undefined,
      });
      toast.success('Grade and feedback saved!');
      setGradingSubmissionId(null);
      if (selectedAssignment) {
        handleSelectAssignment(selectedAssignment);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save grade');
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-headline-md text-xl font-bold text-on-surface">
            Course Assignments & Grading
          </h3>
          <p className="text-xs text-on-surface-variant">
            Create homework tasks, review student submissions, and assign grades.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white font-bold rounded-xl text-xs hover:shadow-md transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          Create Assignment
        </button>
      </div>

      {/* Grid: Left assignments list, Right submissions review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments List */}
        <div className="bg-surface-container-low rounded-2xl border border-border-subtle p-4 space-y-3">
          <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Assignments ({assignments.length})
          </h4>

          {loading ? (
            <div className="py-8 flex justify-center text-xs text-on-surface-variant">
              Loading assignments...
            </div>
          ) : assignments.length === 0 ? (
            <div className="py-8 text-center text-xs text-on-surface-variant">
              No assignments created yet.
            </div>
          ) : (
            assignments.map((a) => {
              const isSelected = selectedAssignment?.id === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => handleSelectAssignment(a)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-secondary/10 border-secondary'
                      : 'bg-surface-container-lowest border-border-subtle hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-xs text-on-surface">{a.title}</h5>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-surface-container rounded text-secondary shrink-0">
                      {a._count?.submissions || 0} Submissions
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-1">
                    {a.module?.title ? `Module: ${a.module.title}` : a.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-2">
                    <span>Max: {a.maxScore} pts</span>
                    {a.dueDate && (
                      <>
                        <span>•</span>
                        <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Submissions & Grading Drawer */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-border-subtle p-6 space-y-6">
          {selectedAssignment ? (
            <>
              <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                <div>
                  <h4 className="font-bold text-base text-on-surface">{selectedAssignment.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {selectedAssignment.description}
                  </p>
                </div>
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg shrink-0">
                  {submissions.length} Total Submissions
                </span>
              </div>

              {/* Submissions list */}
              {loadingSubmissions ? (
                <div className="py-12 flex justify-center text-xs text-on-surface-variant">
                  Loading student submissions...
                </div>
              ) : submissions.length === 0 ? (
                <div className="py-12 text-center text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-30">inbox</span>
                  <p className="font-semibold">No submissions received yet</p>
                  <p className="mt-1 opacity-70">Students who submit will appear here for grading.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 bg-surface-container-low rounded-xl border border-border-subtle space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center text-xs">
                            {sub.student.firstName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-on-surface">
                              {sub.student.firstName} {sub.student.lastName}
                            </p>
                            <span className="text-[10px] text-on-surface-variant">
                              Submitted {new Date(sub.submittedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {sub.grade !== null ? (
                          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg">
                            Score: {sub.grade} / {selectedAssignment.maxScore}
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg">
                            Needs Grading
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      {sub.content && (
                        <div className="p-3 bg-surface-container-lowest rounded-lg text-xs text-on-surface whitespace-pre-wrap">
                          {sub.content}
                        </div>
                      )}

                      {sub.fileUrl && (
                        <a
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-secondary underline font-medium"
                        >
                          <span className="material-symbols-outlined text-[16px]">attachment</span>
                          View Project / Submission Link
                        </a>
                      )}

                      {/* Grading Drawer / Button */}
                      {gradingSubmissionId === sub.id ? (
                        <div className="p-3 bg-surface-container-lowest rounded-xl border border-secondary/30 space-y-3">
                          <div className="flex items-center gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                                Score (Max {selectedAssignment.maxScore})
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={selectedAssignment.maxScore}
                                value={gradeInput}
                                onChange={(e) => setGradeInput(Number(e.target.value))}
                                className="w-24 px-2 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs font-bold"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                                Instructor Feedback
                              </label>
                              <input
                                type="text"
                                placeholder="Well done! Clean implementation..."
                                value={feedbackInput}
                                onChange={(e) => setFeedbackInput(e.target.value)}
                                className="w-full px-3 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setGradingSubmissionId(null)}
                              className="px-3 py-1 text-xs text-on-surface-variant"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={savingGrade}
                              onClick={() => handleSaveGrade(sub.id)}
                              className="px-4 py-1.5 bg-secondary text-white font-bold rounded-lg text-xs hover:shadow-md"
                            >
                              {savingGrade ? 'Saving...' : 'Save Grade'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setGradingSubmissionId(sub.id);
                              setGradeInput(sub.grade ?? selectedAssignment.maxScore);
                              setFeedbackInput(sub.feedback || '');
                            }}
                            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">grade</span>
                            {sub.grade !== null ? 'Edit Grade & Feedback' : 'Grade Submission'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-xs text-on-surface-variant">
              Select an assignment on the left to view and grade student submissions.
            </div>
          )}
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-border-subtle p-6 animate-scaleUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-on-surface">Create New Assignment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-on-surface">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Target Module
                </label>
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface outline-none focus:border-secondary"
                  required
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Build a Responsive Portfolio with Flexbox"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface outline-none focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Instructions & Requirements
                </label>
                <textarea
                  placeholder="Detail what students should build, rubric criteria, and submission format..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-28 px-3 py-2 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface outline-none focus:border-secondary resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Max Score
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-secondary text-white font-bold rounded-lg text-xs hover:shadow-md transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
