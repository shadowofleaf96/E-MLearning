'use client';

import React, { useState, useEffect } from 'react';
import {
  assignmentsService,
  AssignmentItem,
} from '../services/assignments.service';
import { toast } from 'react-toastify';

interface Props {
  moduleId: string;
}

export function ModuleAssignmentViewer({ moduleId }: Props) {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await assignmentsService.getModuleAssignments(moduleId);
      if (res?.data) {
        setAssignments(res.data);
        if (res.data.length > 0 && !selectedAssignmentId) {
          setSelectedAssignmentId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load assignments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchAssignments();
    }
  }, [moduleId]);

  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId) return;

    if (!submissionContent.trim() && !fileUrl.trim()) {
      toast.warning('Please enter written content or provide a file URL.');
      return;
    }

    try {
      setSubmitting(true);
      await assignmentsService.submitAssignment({
        assignmentId: selectedAssignmentId,
        content: submissionContent.trim() || undefined,
        fileUrl: fileUrl.trim() || undefined,
      });
      toast.success('Assignment submitted successfully!');
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 flex justify-center text-xs text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
        Loading module assignments...
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="py-10 text-center text-on-surface-variant text-xs">
        <span className="material-symbols-outlined text-3xl mb-2 opacity-40">assignment_turned_in</span>
        <p className="font-semibold">No homework assignments for this module.</p>
        <p className="mt-1 opacity-70">Focus on the video lessons and quizzes!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assignment selector tabs if multiple */}
      {assignments.length > 1 && (
        <div className="flex gap-2 border-b border-border-subtle pb-3 overflow-x-auto">
          {assignments.map((a, idx) => (
            <button
              key={a.id}
              onClick={() => setSelectedAssignmentId(a.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                selectedAssignmentId === a.id
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Assignment {idx + 1}: {a.title}
            </button>
          ))}
        </div>
      )}

      {activeAssignment && (
        <div className="bg-surface-container-low rounded-2xl border border-border-subtle p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-border-subtle">
            <div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                {activeAssignment.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Maximum Score: <strong className="text-on-surface">{activeAssignment.maxScore} points</strong>
                {activeAssignment.dueDate && (
                  <span>
                    {' '}• Due: {new Date(activeAssignment.dueDate).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>

            {/* Submission Status Badge */}
            <div>
              {activeAssignment.submission?.grade !== null &&
              activeAssignment.submission?.grade !== undefined ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 font-bold text-xs rounded-full border border-emerald-500/20">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Graded: {activeAssignment.submission.grade} / {activeAssignment.maxScore}
                </span>
              ) : activeAssignment.submission ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 font-bold text-xs rounded-full border border-amber-500/20">
                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  Submitted (Awaiting Grade)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface-variant font-bold text-xs rounded-full">
                  Not Submitted
                </span>
              )}
            </div>
          </div>

          {/* Description Prompt */}
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Instructions & Requirements
            </h4>
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-border-subtle text-xs text-on-surface whitespace-pre-wrap leading-relaxed">
              {activeAssignment.description}
            </div>
          </div>

          {/* Instructor Feedback if Graded */}
          {activeAssignment.submission?.feedback && (
            <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
              <h4 className="text-xs font-bold text-secondary flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-[16px]">comment</span>
                Instructor Feedback
              </h4>
              <p className="text-xs text-on-surface whitespace-pre-wrap">
                {activeAssignment.submission.feedback}
              </p>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                {activeAssignment.submission ? 'Resubmit Your Work' : 'Your Answer / Written Response'}
              </label>
              <textarea
                placeholder="Type your answer, analysis, or explanation here..."
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                className="w-full h-32 p-3 bg-surface-container-lowest border border-border-subtle rounded-xl text-xs text-on-surface focus:outline-none focus:border-secondary resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                Project Link or Uploaded File URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://github.com/your-username/project or Cloud Storage link"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-xl text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-secondary text-white font-bold rounded-xl text-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting
                  ? 'Submitting...'
                  : activeAssignment.submission
                    ? 'Update Submission'
                    : 'Submit Assignment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
