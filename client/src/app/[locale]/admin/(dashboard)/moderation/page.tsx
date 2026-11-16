'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Download,
  BookOpen,
  Search,
  Terminal,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  MessageSquare,
  Sparkles,
  History,
} from 'lucide-react';
import { toast } from 'react-toastify';
import DataTable from '@/components/shared/DataTable';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { exportToCSV } from '@/utils/exportToCSV';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModerationLog {
  id: string;
  action: string;
  comment?: string;
  createdAt: string;
  reviewer?: {
    firstName: string;
    lastName: string;
  };
}

interface ModerationCourse {
  id: string;
  title: string;
  description?: string;
  price: number;
  thumbnail?: string;
  isPublished: boolean;
  moderationStatus: string;
  createdAt: string;
  updatedAt: string;
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  moderationLogs?: ModerationLog[];
  _count?: {
    modules: number;
    enrollments: number;
  };
}

export default function CourseModerationPage() {
  const [courses, setCourses] = useState<ModerationCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'pending' | 'revision' | 'approved' | 'rejected'
  >('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Review Modal state
  const [selectedCourse, setSelectedCourse] = useState<ModerationCourse | null>(
    null
  );
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [logsModalCourse, setLogsModalCourse] =
    useState<ModerationCourse | null>(null);

  const fetchModerationQueue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.MODERATION.QUEUE);
      setCourses(res.data?.data || []);
    } catch {
      toast.error('Failed to load moderation queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModerationQueue();
  }, [fetchModerationQueue]);

  const handleModerateAction = async (
    action: 'approve' | 'request_revision' | 'reject'
  ) => {
    if (!selectedCourse) return;

    if (
      (action === 'request_revision' || action === 'reject') &&
      !reviewComment.trim()
    ) {
      toast.error('Please provide a feedback comment for the instructor');
      return;
    }

    try {
      setIsSubmittingReview(true);
      await api.post(ENDPOINTS.MODERATION.MODERATE(selectedCourse.id), {
        action,
        comment: reviewComment.trim(),
      });

      const actionLabels = {
        approve: 'approved and published',
        request_revision: 'returned for instructor revision',
        reject: 'rejected',
      };
      toast.success(`Course ${actionLabels[action]} successfully.`);
      setSelectedCourse(null);
      setReviewComment('');
      fetchModerationQueue();
    } catch {
      toast.error('Failed to submit moderation decision');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleToggleVisibility = async (
    courseId: string,
    currentStatus: boolean
  ) => {
    try {
      await api.put(ENDPOINTS.COURSES.PUBLISH(courseId), {
        isPublished: !currentStatus,
      });
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'}.`);
      fetchModerationQueue();
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const pendingCourses = courses.filter(
    (c) =>
      c.moderationStatus === 'pending_review' ||
      (!c.isPublished &&
        c.moderationStatus !== 'needs_revision' &&
        c.moderationStatus !== 'rejected' &&
        c.moderationStatus !== 'approved')
  );

  const revisionCourses = courses.filter(
    (c) => c.moderationStatus === 'needs_revision'
  );

  const approvedCourses = courses.filter(
    (c) => c.moderationStatus === 'approved' || c.isPublished
  );

  const rejectedCourses = courses.filter(
    (c) => c.moderationStatus === 'rejected'
  );

  const getFilteredList = (list: ModerationCourse[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.instructor?.firstName?.toLowerCase().includes(q) ||
        c.instructor?.lastName?.toLowerCase().includes(q) ||
        c.category?.name?.toLowerCase().includes(q)
    );
  };

  const currentTabList =
    activeTab === 'pending'
      ? getFilteredList(pendingCourses)
      : activeTab === 'revision'
        ? getFilteredList(revisionCourses)
        : activeTab === 'approved'
          ? getFilteredList(approvedCourses)
          : getFilteredList(rejectedCourses);

  const visibilityColumns = [
    {
      header: 'Course Information',
      accessor: (course: ModerationCourse) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-white shrink-0 overflow-hidden relative">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt="course"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Terminal className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-on-surface">
              {course.title}
            </div>
            <div className="text-xs font-medium text-on-surface-variant mt-0.5">
              {course.instructor?.firstName} {course.instructor?.lastName} •{' '}
              {course.category?.name || 'Uncategorized'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Modules / Learners',
      accessor: (course: ModerationCourse) => (
        <div>
          <div className="text-sm font-bold text-on-surface">
            {course._count?.modules || 0} modules
          </div>
          <div className="text-xs font-medium text-on-surface-variant mt-0.5">
            {course._count?.enrollments || 0} active students
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (course: ModerationCourse) => (
        <span
          className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
            course.isPublished
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
          }`}
        >
          {course.isPublished ? 'Live in Catalog' : 'Unpublished'}
        </span>
      ),
    },
    {
      header: 'Visibility Toggle',
      accessor: (course: ModerationCourse) => (
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={course.isPublished}
              onChange={() =>
                handleToggleVisibility(course.id, course.isPublished)
              }
            />
            <div className="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
          </label>
          <span className="text-xs font-bold text-on-surface">
            {course.isPublished ? 'Public' : 'Hidden'}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant tracking-wider uppercase">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-secondary">Course Moderation</span>
          </div>
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
            Course Governance &amp; Moderation
          </h2>
          <p className="text-sm text-on-surface-variant">
            Review instructor submissions, request quality revisions, and govern
            catalog publishing.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (courses.length === 0) {
                toast.error('No courses data available');
                return;
              }
              exportToCSV(
                courses.map((c) => ({
                  id: c.id,
                  title: c.title,
                  instructor: c.instructor
                    ? `${c.instructor.firstName} ${c.instructor.lastName}`
                    : 'Unknown',
                  moderationStatus: c.moderationStatus,
                  isPublished: c.isPublished ? 'Yes' : 'No',
                  createdAt: new Date(c.createdAt).toLocaleDateString(),
                })),
                'course_moderation_report',
                [
                  { key: 'id', label: 'ID' },
                  { key: 'title', label: 'Course Title' },
                  { key: 'instructor', label: 'Instructor' },
                  { key: 'moderationStatus', label: 'Review Status' },
                  { key: 'isPublished', label: 'Live' },
                  { key: 'createdAt', label: 'Created At' },
                ]
              );
              toast.success('Report exported successfully');
            }}
            className="px-4 py-2 border border-border-subtle rounded-xl text-sm font-bold hover:bg-surface-container-low transition-all flex items-center gap-2 shadow-sm focus:outline-none"
          >
            <Download className="w-4 h-4" />
            Export Audit CSV
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border-subtle gap-6 mb-6 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 text-sm font-bold transition-all flex items-center gap-2 focus:outline-none shrink-0 ${
            activeTab === 'pending'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending Approvals
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 text-[11px] font-bold rounded-full">
            {pendingCourses.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('revision')}
          className={`pb-4 text-sm font-bold transition-all flex items-center gap-2 focus:outline-none shrink-0 ${
            activeTab === 'revision'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Needs Revision
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-600 text-[11px] font-bold rounded-full">
            {revisionCourses.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-4 text-sm font-bold transition-all flex items-center gap-2 focus:outline-none shrink-0 ${
            activeTab === 'approved'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Approved / Live
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 text-[11px] font-bold rounded-full">
            {approvedCourses.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`pb-4 text-sm font-bold transition-all flex items-center gap-2 focus:outline-none shrink-0 ${
            activeTab === 'rejected'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Rejected
          <span className="px-2 py-0.5 bg-error/20 text-error text-[11px] font-bold rounded-full">
            {rejectedCourses.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course title, instructor, or category..."
            className="w-full pl-9 pr-4 py-2.5 bg-surface-card border border-border-subtle rounded-xl text-sm font-medium focus:border-secondary focus:ring-1 focus:ring-secondary/20 focus:outline-none"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tab 1: Cards View for Pending & Revision Courses */}
      {activeTab !== 'approved' ? (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {currentTabList.length > 0 ? (
            currentTabList.map((course) => (
              <div
                key={course.id}
                className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:border-secondary transition-all hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-36 h-36 sm:h-24 rounded-xl overflow-hidden bg-surface-container shrink-0 relative">
                      {course.thumbnail ? (
                        <Image
                          className="object-cover"
                          src={course.thumbnail}
                          alt="Course Thumbnail"
                          fill
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          <BookOpen className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="font-headline-md text-lg font-bold text-on-surface line-clamp-1">
                          {course.title}
                        </h3>
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0 ${
                            course.moderationStatus === 'pending_review'
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              : course.moderationStatus === 'needs_revision'
                                ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                : course.moderationStatus === 'rejected'
                                  ? 'bg-error/10 text-error border border-error/20'
                                  : 'bg-emerald-500/10 text-emerald-600'
                          }`}
                        >
                          {course.moderationStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-on-surface-variant">
                        Instructor:{' '}
                        <span className="text-on-surface font-bold">
                          {course.instructor?.firstName}{' '}
                          {course.instructor?.lastName}
                        </span>{' '}
                        ({course.instructor?.email})
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-on-surface-variant">
                        <span>{course._count?.modules || 0} Modules</span>
                        <span>•</span>
                        <span>
                          {course.price > 0 ? `$${course.price}` : 'Free'}
                        </span>
                        <span>•</span>
                        <span>{course.category?.name || 'General'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Previous moderation feedback if any */}
                  {course.moderationLogs &&
                    course.moderationLogs.length > 0 && (
                      <div className="mt-4 p-3 bg-surface-container-lowest border border-border-subtle rounded-xl text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-on-surface-variant mb-1">
                          <MessageSquare className="w-3.5 h-3.5 text-secondary" />
                          Latest Review Note:
                        </div>
                        <p className="text-on-surface italic line-clamp-2">
                          "
                          {course.moderationLogs[0].comment ||
                            'No comment provided'}
                          "
                        </p>
                        <span className="text-[10px] text-on-surface-variant mt-1 block">
                          By{' '}
                          {course.moderationLogs[0].reviewer?.firstName ||
                            'Admin'}{' '}
                          •{' '}
                          {new Date(
                            course.moderationLogs[0].createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                </div>

                <div className="mt-5 pt-4 border-t border-border-subtle flex flex-wrap justify-between items-center gap-3">
                  <button
                    onClick={() => setLogsModalCourse(course)}
                    className="text-on-surface-variant hover:text-secondary font-bold text-xs flex items-center gap-1.5 focus:outline-none"
                  >
                    <History className="w-3.5 h-3.5" />
                    Review Logs ({course.moderationLogs?.length || 0})
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setReviewComment('');
                    }}
                    className="px-4 py-2 bg-secondary text-white font-bold text-xs rounded-xl hover:bg-secondary/90 transition-all focus:outline-none shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Review &amp; Decide
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-surface-card border border-border-subtle rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
              <h4 className="text-base font-bold text-on-surface">
                No courses found in this queue
              </h4>
              <p className="text-xs text-on-surface-variant mt-1">
                Courses submitted by instructors for admin review will appear
                here.
              </p>
            </div>
          )}
        </section>
      ) : (
        /* Tab 3: Table view for Approved & Published Courses with Visibility Toggles */
        <section className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
          <DataTable
            data={currentTabList}
            columns={visibilityColumns}
            emptyMessage="No approved courses available."
          />
        </section>
      )}

      {/* Review & Decide Modal */}
      <Dialog
        open={!!selectedCourse}
        onOpenChange={(open) => !open && setSelectedCourse(null)}
      >
        <DialogContent className="max-w-2xl bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-on-surface">
              Course Moderation Decision
            </DialogTitle>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-5 py-2">
              <div className="p-4 bg-surface-container-lowest rounded-xl border border-border-subtle flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-surface-container relative overflow-hidden shrink-0">
                  {selectedCourse.thumbnail ? (
                    <Image
                      src={selectedCourse.thumbnail}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <BookOpen className="w-6 h-6 m-auto text-on-surface-variant" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-base text-on-surface">
                    {selectedCourse.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Instructor: {selectedCourse.instructor?.firstName}{' '}
                    {selectedCourse.instructor?.lastName} (
                    {selectedCourse.instructor?.email})
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Category: {selectedCourse.category?.name || 'General'} •
                    Price: ${selectedCourse.price} • Modules:{' '}
                    {selectedCourse._count?.modules || 0}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Review Feedback / Revision Notes for Instructor:
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Provide specific constructive feedback on curriculum, video quality, learning objectives, or approval remarks..."
                  className="w-full p-3.5 bg-surface-bg border border-border-subtle rounded-xl text-sm font-medium focus:border-secondary focus:ring-1 focus:ring-secondary/20 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleModerateAction('reject')}
                  disabled={isSubmittingReview}
                  className="px-4 py-2.5 text-error border border-error/30 hover:bg-error/10 font-bold text-xs rounded-xl transition-all"
                >
                  Reject Course
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleModerateAction('request_revision')}
                    disabled={isSubmittingReview}
                    className="px-4 py-2.5 bg-blue-600/10 text-blue-600 border border-blue-600/20 hover:bg-blue-600/20 font-bold text-xs rounded-xl transition-all"
                  >
                    Request Revision
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModerateAction('approve')}
                    disabled={isSubmittingReview}
                    className="px-5 py-2.5 bg-secondary text-white hover:bg-secondary/90 font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    Approve &amp; Publish
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Moderation History Logs Modal */}
      <Dialog
        open={!!logsModalCourse}
        onOpenChange={(open) => !open && setLogsModalCourse(null)}
      >
        <DialogContent className="max-w-xl bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-on-surface">
              Moderation Audit History: {logsModalCourse?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            {logsModalCourse?.moderationLogs &&
            logsModalCourse.moderationLogs.length > 0 ? (
              logsModalCourse.moderationLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-surface-container-lowest border border-border-subtle rounded-xl text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-secondary uppercase tracking-wider text-[10px]">
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="text-on-surface-variant text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-on-surface font-medium pt-1">
                    {log.comment || 'No specific comment entered.'}
                  </p>
                  <div className="text-[11px] text-on-surface-variant pt-1">
                    Reviewer: {log.reviewer?.firstName || 'System'}{' '}
                    {log.reviewer?.lastName || ''}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-on-surface-variant">
                No moderation logs recorded yet.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
