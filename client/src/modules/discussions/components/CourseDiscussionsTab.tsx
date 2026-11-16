'use client';

import React, { useState, useEffect } from 'react';
import {
  discussionsService,
  CourseDiscussionItem,
} from '../services/discussions.service';
import { toast } from 'react-toastify';

interface Props {
  courseId: string;
  currentLessonId?: string;
  currentLessonTitle?: string;
}

export function CourseDiscussionsTab({
  courseId,
  currentLessonId,
  currentLessonTitle,
}: Props) {
  const [discussions, setDiscussions] = useState<CourseDiscussionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLessonOnly, setFilterLessonOnly] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [linkToCurrentLesson, setLinkToCurrentLesson] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Expanded discussion view
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(
    null
  );
  const [activeDiscussion, setActiveDiscussion] =
    useState<CourseDiscussionItem | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await discussionsService.getCourseDiscussions(
        courseId,
        filterLessonOnly ? currentLessonId : undefined
      );
      if (res?.data) {
        setDiscussions(res.data);
      }
    } catch (err) {
      console.error('Failed to load discussions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [courseId, filterLessonOnly, currentLessonId]);

  const loadSingleDiscussion = async (id: string) => {
    try {
      const res = await discussionsService.getDiscussion(id);
      if (res?.data) {
        setActiveDiscussion(res.data);
        setActiveDiscussionId(id);
      }
    } catch (err) {
      toast.error('Failed to load discussion details');
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.warning('Please enter both a title and details for your question.');
      return;
    }
    try {
      setSubmitting(true);
      await discussionsService.createDiscussion({
        courseId,
        lessonId: linkToCurrentLesson ? currentLessonId : undefined,
        title: newTitle.trim(),
        content: newContent.trim(),
      });
      toast.success('Question posted successfully!');
      setNewTitle('');
      setNewContent('');
      setShowNewModal(false);
      fetchDiscussions();
    } catch (err) {
      toast.error('Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDiscussionId || !replyContent.trim()) return;

    try {
      setReplying(true);
      await discussionsService.createReply({
        discussionId: activeDiscussionId,
        content: replyContent.trim(),
      });
      toast.success('Reply submitted!');
      setReplyContent('');
      loadSingleDiscussion(activeDiscussionId);
      fetchDiscussions();
    } catch (err) {
      toast.error('Failed to submit reply');
    } finally {
      setReplying(false);
    }
  };

  const handleUpvoteDiscussion = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await discussionsService.upvoteDiscussion(id);
      setDiscussions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d))
      );
      if (activeDiscussion && activeDiscussion.id === id) {
        setActiveDiscussion({
          ...activeDiscussion,
          upvotes: activeDiscussion.upvotes + 1,
        });
      }
    } catch (err) {
      toast.error('Failed to upvote');
    }
  };

  const handleUpvoteReply = async (replyId: string) => {
    try {
      await discussionsService.upvoteReply(replyId);
      if (activeDiscussion && activeDiscussion.replies) {
        setActiveDiscussion({
          ...activeDiscussion,
          replies: activeDiscussion.replies.map((r) =>
            r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r
          ),
        });
      }
    } catch (err) {
      toast.error('Failed to upvote reply');
    }
  };

  const handleMarkSolution = async (replyId: string) => {
    try {
      await discussionsService.markSolution(replyId);
      toast.success('Solution status updated');
      if (activeDiscussionId) {
        loadSingleDiscussion(activeDiscussionId);
      }
    } catch (err) {
      toast.error('Failed to update solution');
    }
  };

  return (
    <div className="p-6">
      {/* Top Header / Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border-subtle">
        <div>
          <h3 className="font-headline-md text-on-surface">
            Course Q&A & Community
          </h3>
          <p className="text-on-surface-variant text-sm">
            Ask questions, share insights, and get answers from instructors and
            peers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {currentLessonId && (
            <button
              onClick={() => setFilterLessonOnly(!filterLessonOnly)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                filterLessonOnly
                  ? 'bg-secondary/15 text-secondary border-secondary'
                  : 'bg-surface-container-low text-on-surface-variant border-border-subtle hover:bg-surface-container'
              }`}
            >
              {filterLessonOnly
                ? '✓ This Lesson Only'
                : 'Filter by Current Lesson'}
            </button>
          )}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-white font-bold rounded-lg text-sm hover:shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              add_comment
            </span>
            Ask a Question
          </button>
        </div>
      </div>

      {/* New Question Modal */}
      {showNewModal && (
        <div className="mb-6 p-5 bg-surface-container-low rounded-xl border border-secondary/30 shadow-sm animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-on-surface text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">
                help
              </span>
              Ask a New Question
            </h4>
            <button
              onClick={() => setShowNewModal(false)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                Question Title
              </label>
              <input
                type="text"
                placeholder="e.g. How does flex-shrink calculate the remaining space?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-sm text-on-surface focus:outline-none focus:border-secondary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                Details & Context
              </label>
              <textarea
                placeholder="Explain what you are trying to do, what you tried, or what concept needs clarification..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full h-28 px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-sm text-on-surface focus:outline-none focus:border-secondary resize-none"
                required
              />
            </div>
            {currentLessonTitle && (
              <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkToCurrentLesson}
                  onChange={(e) => setLinkToCurrentLesson(e.target.checked)}
                  className="rounded text-secondary focus:ring-secondary"
                />
                Tag with current lesson:{' '}
                <strong className="text-on-surface">
                  {currentLessonTitle}
                </strong>
              </label>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-secondary text-white font-bold rounded-lg text-sm hover:shadow-md transition-all disabled:opacity-60"
              >
                {submitting ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Single Discussion Thread View */}
      {activeDiscussion ? (
        <div className="space-y-6">
          <button
            onClick={() => {
              setActiveDiscussion(null);
              setActiveDiscussionId(null);
            }}
            className="flex items-center gap-2 text-xs font-bold text-secondary hover:underline"
          >
            ← Back to all questions
          </button>

          {/* Main Question Post */}
          <div className="p-5 bg-surface-container-low rounded-xl border border-border-subtle">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-sm">
                  {activeDiscussion.user.firstName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface">
                      {activeDiscussion.user.firstName}{' '}
                      {activeDiscussion.user.lastName}
                    </span>
                    {activeDiscussion.user.role === 'instructor' && (
                      <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary font-bold rounded">
                        Instructor
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    {new Date(activeDiscussion.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => handleUpvoteDiscussion(activeDiscussion.id, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg text-xs font-bold text-on-surface hover:border-secondary transition-all"
              >
                <span>▲</span>
                <span>{activeDiscussion.upvotes}</span>
              </button>
            </div>

            <h4 className="text-base font-bold text-on-surface mb-2">
              {activeDiscussion.title}
            </h4>
            <p className="text-sm text-on-surface-variant whitespace-pre-wrap mb-3">
              {activeDiscussion.content}
            </p>
            {activeDiscussion.lesson && (
              <span className="inline-flex items-center gap-1 text-[11px] text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-[13px]">
                  play_circle
                </span>
                {activeDiscussion.lesson.title}
              </span>
            )}
          </div>

          {/* Replies Section */}
          <div className="space-y-4 pl-4 border-l-2 border-border-subtle">
            <h5 className="font-bold text-sm text-on-surface">
              {activeDiscussion.replies?.length || 0} Replies
            </h5>

            {activeDiscussion.replies && activeDiscussion.replies.length > 0 ? (
              activeDiscussion.replies.map((reply) => (
                <div
                  key={reply.id}
                  className={`p-4 rounded-xl border transition-all ${
                    reply.isSolution
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-surface-container-lowest border-border-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-xs">
                        {reply.user.firstName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-on-surface">
                            {reply.user.firstName} {reply.user.lastName}
                          </span>
                          {reply.user.role === 'instructor' && (
                            <span className="px-1.5 py-0.2 bg-primary/10 text-primary font-bold text-[9px] rounded">
                              Instructor
                            </span>
                          )}
                          {reply.isSolution && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white font-bold text-[9px] rounded flex items-center gap-1">
                              ✓ Accepted Solution
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-on-surface-variant">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpvoteReply(reply.id)}
                        className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant hover:text-secondary px-2 py-1 rounded bg-surface-container-low"
                      >
                        <span>▲</span>
                        <span>{reply.upvotes}</span>
                      </button>
                      <button
                        onClick={() => handleMarkSolution(reply.id)}
                        className={`text-[11px] font-bold px-2 py-1 rounded border transition-all ${
                          reply.isSolution
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'text-on-surface-variant hover:text-emerald-700 border-border-subtle'
                        }`}
                        title="Toggle solution"
                      >
                        {reply.isSolution ? '✓ Solution' : 'Mark as Solution'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant whitespace-pre-wrap pl-9">
                    {reply.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-on-surface-variant py-2">
                No replies yet. Be the first to answer this question!
              </p>
            )}

            {/* Post a Reply Form */}
            <form onSubmit={handleCreateReply} className="mt-4">
              <textarea
                placeholder="Write your answer or suggestion..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full h-24 p-3 bg-surface-container-lowest border border-border-subtle rounded-xl text-xs text-on-surface focus:outline-none focus:border-secondary resize-none"
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={replying}
                  className="px-4 py-2 bg-secondary text-white font-bold rounded-lg text-xs hover:shadow-md transition-all disabled:opacity-60"
                >
                  {replying ? 'Submitting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Discussion Thread List */
        <div>
          {loading ? (
            <div className="py-12 flex justify-center text-on-surface-variant text-sm">
              <span className="material-symbols-outlined animate-spin mr-2">
                progress_activity
              </span>
              Loading discussions...
            </div>
          ) : discussions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-3 opacity-40">
                chat_bubble_outline
              </span>
              <p className="text-sm font-semibold mb-1">No questions yet</p>
              <p className="text-xs max-w-sm text-center">
                Have a question about this course or lesson? Ask the instructor
                and community!
              </p>
              <button
                onClick={() => setShowNewModal(true)}
                className="mt-4 px-4 py-2 bg-secondary text-white font-bold rounded-lg text-xs hover:shadow-md"
              >
                Ask the First Question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {discussions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadSingleDiscussion(item.id)}
                  className="p-4 bg-surface-container-low hover:bg-surface-container border border-border-subtle rounded-xl cursor-pointer transition-all hover:border-secondary/40 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {item.user.firstName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.isPinned && (
                            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 font-bold text-[10px] rounded flex items-center gap-0.5">
                              📌 Pinned
                            </span>
                          )}
                          <h4 className="font-bold text-sm text-on-surface truncate group-hover:text-secondary transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">
                          {item.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-on-surface-variant">
                          <span>
                            {item.user.firstName} {item.user.lastName}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          {item.lesson && (
                            <>
                              <span>•</span>
                              <span className="text-secondary bg-secondary/10 px-1.5 py-0.5 rounded text-[10px]">
                                {item.lesson.title}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">
                          chat
                        </span>
                        <span>{item._count?.replies || 0}</span>
                      </div>
                      <button
                        onClick={(e) => handleUpvoteDiscussion(item.id, e)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest border border-border-subtle rounded-lg text-xs font-bold hover:border-secondary transition-all"
                      >
                        <span>▲</span>
                        <span>{item.upvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
