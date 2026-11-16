'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Download,
  Eye,
  Calendar,
  BookOpen,
  Search,
  Filter,
  Terminal,
  ChevronRight,
} from 'lucide-react';

import { useCourses } from '@/modules/courses/hooks/useCourses';
import { toast } from 'react-toastify';
import DataTable from '@/components/shared/DataTable';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Course } from '@/types/course.types';
import { exportToCSV } from '@/utils/exportToCSV';

export default function CourseModerationPage() {
  const [activeTab, setActiveTab] = useState<
    'pending' | 'visibility' | 'reports'
  >('pending');
  const {
    courses,
    loading,
    loadCourses,
    toggleCoursePublish,
    deleteCourseAdmin,
  } = useCourses();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const pendingCourses = courses?.filter((c) => !c.isPublished) || [];
  const publishedCourses = courses?.filter((c) => c.isPublished) || [];

  const handleApprove = async (courseId: string) => {
    const res = await toggleCoursePublish(courseId, true);
    if (res.success) {
      toast.success('Course approved and published.');
      loadCourses();
    } else {
      toast.error(res.error || 'Failed to approve course.');
    }
  };

  const handleReject = async (courseId: string) => {
    if (
      !window.confirm('Are you sure you want to reject and delete this course?')
    )
      return;
    const res = await deleteCourseAdmin(courseId);
    if (res.success) {
      toast.success('Course rejected and deleted.');
      loadCourses();
    } else {
      toast.error(res.error || 'Failed to reject course.');
    }
  };

  const handleToggleVisibility = async (
    courseId: string,
    currentStatus: boolean
  ) => {
    const res = await toggleCoursePublish(courseId, !currentStatus);
    if (res.success) {
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'}.`);
      loadCourses();
    } else {
      toast.error(res.error || 'Failed to update visibility.');
    }
  };

  const visibilityColumns = [
    {
      header: 'Course Information',
      accessor: (course: Course) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-white shrink-0 overflow-hidden relative">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt="course"
                fill
                className="object-cover"
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
              {course.instructor?.firstName} {course.instructor?.lastName}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Enrollment',
      accessor: (course: any) => (
        <div>
          <div className="text-sm font-bold text-on-surface">
            {course.enrollments?.length || 0}
          </div>
          <div className="text-xs font-medium text-on-surface-variant mt-0.5">
            Active Learners
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: () => (
        <span className="px-2.5 py-1 bg-tertiary-fixed/30 text-on-tertiary-fixed-variant text-[10px] font-bold rounded-md uppercase tracking-wider">
          Live
        </span>
      ),
    },
    {
      header: 'Visibility',
      accessor: (course: Course) => (
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={course.isPublished}
              onChange={() =>
                handleToggleVisibility(
                  (course as any)._id || course.id,
                  course.isPublished
                )
              }
            />
            <div className="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
          </label>
          <span className="text-xs font-bold text-on-surface">Public</span>
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
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant tracking-wider uppercase">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-secondary">Course Moderation</span>
          </div>
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
            Moderation Workspace
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (!courses) {
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
                  status: c.isPublished ? 'Published' : 'Pending',
                  createdAt: new Date(c.createdAt).toLocaleDateString(),
                })),
                'course_moderation_report',
                [
                  { key: 'id', label: 'ID' },
                  { key: 'title', label: 'Course Title' },
                  { key: 'instructor', label: 'Instructor' },
                  { key: 'status', label: 'Status' },
                  { key: 'createdAt', label: 'Created At' },
                ]
              );
              toast.success('Report exported successfully');
            }}
            className="px-4 py-2 border border-border-subtle rounded-xl text-sm font-bold hover:bg-surface-container-low transition-all flex items-center gap-2 shadow-sm focus:outline-none"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border-subtle gap-8 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 text-sm font-bold transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'pending'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          Pending Approvals
          <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[11px] rounded-full">
            {pendingCourses.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('visibility')}
          className={`pb-4 text-sm font-bold transition-all focus:outline-none ${
            activeTab === 'visibility'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          Course Visibility
        </button>
      </div>

      {/* Tab Contents */}

      {activeTab === 'pending' && (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {pendingCourses.length > 0 ? (
            pendingCourses.map((course) => (
              <div
                key={course.id}
                className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:border-secondary transition-all hover:shadow-md group"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-32 h-32 sm:h-20 rounded-xl overflow-hidden bg-surface-container shrink-0 relative">
                    {course.thumbnail ? (
                      <Image
                        className="object-cover"
                        src={course.thumbnail}
                        alt="Course Thumbnail"
                        fill
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-headline-md text-xl font-bold text-on-surface">
                        {course.title}
                      </h3>
                      <span className="px-2.5 py-1 bg-surface-container-highest text-secondary text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm font-medium text-on-surface-variant">
                      Instructor:{' '}
                      <span className="text-on-surface font-bold">
                        {course.instructor?.firstName}{' '}
                        {course.instructor?.lastName}
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
                        <Calendar className="w-4 h-4" /> Submitted{' '}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle flex flex-wrap justify-between items-center gap-4">
                  <button className="text-secondary font-bold text-sm hover:underline flex items-center gap-1.5 focus:outline-none">
                    <Eye className="w-4 h-4" /> Full Review
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleReject((course as any)._id || course.id)
                      }
                      className="px-4 py-2 text-error font-bold text-sm hover:bg-error-container/20 rounded-xl transition-all focus:outline-none"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        handleApprove((course as any)._id || course.id)
                      }
                      className="px-4 py-2 bg-secondary text-white font-bold text-sm rounded-xl hover:bg-secondary/90 transition-all focus:outline-none shadow-sm"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-on-surface-variant text-sm font-medium">
              No pending courses to review.
            </div>
          )}
        </section>
      )}

      {/* Visibility Tab */}
      {activeTab === 'visibility' && (
        <section className="animate-in fade-in duration-300">
          <div className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-bg/50">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  type="text"
                  placeholder="Filter courses by name or instructor..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-border-subtle rounded-xl text-sm font-medium focus:border-secondary focus:ring-1 focus:ring-secondary/20 focus:outline-none transition-all"
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="p-2 border border-border-subtle rounded-xl hover:bg-surface-container-low transition-all text-on-surface-variant hover:text-secondary focus:outline-none">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <DataTable
              data={publishedCourses}
              columns={visibilityColumns}
              emptyMessage="No published courses available for visibility settings."
            />
          </div>
        </section>
      )}
    </div>
  );
}
