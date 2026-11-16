'use client';

import React, { useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Course } from '@/types/course.types';
import { useCourses } from '@/modules/courses/hooks/useCourses';
import {
  BookOpen,
  Users,
  Star,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import Image from 'next/image';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AdminCoursesPage() {
  const {
    courses,
    loading,
    loadCourses,
    deleteCourseAdmin,
    toggleCoursePublish,
  } = useCourses();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleTogglePublish = async (course: Course) => {
    const courseId = (course as any)._id || course.id;
    if (!courseId) return;
    const newStatus = !course.isPublished;
    const res = await toggleCoursePublish(courseId, newStatus);
    if (res.success) {
      toast.success(
        `Course ${newStatus ? 'published' : 'unpublished'} successfully.`
      );
      loadCourses();
    } else {
      toast.error(res.error || 'Failed to update course status.');
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    const courseId = (course as any)._id || course.id;
    if (!courseId) return;
    if (
      !window.confirm(
        `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }
    const res = await deleteCourseAdmin(courseId);
    if (res.success) {
      toast.success('Course deleted successfully.');
      loadCourses();
    } else {
      toast.error(res.error || 'Failed to delete course.');
    }
  };

  const columns = [
    {
      header: 'Course Information',
      accessor: (course: Course) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-20 rounded-lg overflow-hidden bg-surface-container shrink-0">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt="Thumbnail"
                width={80}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-surface-dim flex items-center justify-center">
                <BookOpen className="text-secondary opacity-50 w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <h5 className="font-bold text-sm text-on-surface">
              {course.title}
            </h5>
            <p className="text-xs text-on-surface-variant max-w-62.5 truncate">
              {course.description || 'No description provided.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Instructor',
      accessor: (course: any) => (
        <div className="font-medium text-sm text-on-surface">
          {course.instructor
            ? `${course.instructor.firstName} ${course.instructor.lastName}`
            : 'Unassigned'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (course: Course) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
            course.isPublished
              ? 'bg-[#dcfce7] text-[#166534]'
              : 'bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${course.isPublished ? 'bg-[#166534]' : 'bg-on-surface-variant'}`}
          ></span>
          {course.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      header: 'Metrics',
      accessor: (course: Course) => (
        <div className="flex gap-4">
          <div
            className="flex items-center gap-1 text-on-surface-variant text-sm"
            title="Active Students"
          >
            <Users className="w-4 h-4" />
            <span>{course._count?.enrollments || 0}</span>
          </div>
          <div
            className="flex items-center gap-1 text-xp-gold text-sm"
            title="Rating"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>{course.isPublished ? '4.8' : '-'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (course: Course) => (
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="p-2 rounded-full text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors focus:outline-none">
            <MoreVertical className="w-5 h-5" />
          </MenuButton>
          <MenuItems
            modal={false}
            className="absolute right-0 mt-2 w-48 origin-top-right bg-surface-card border border-border-subtle rounded-xl shadow-xl focus:outline-none z-50 p-1"
          >
            <MenuItem>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={() => handleTogglePublish(course)}
                  className={`${
                    active
                      ? 'bg-surface-container-low text-secondary'
                      : 'text-on-surface'
                  } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {course.isPublished ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {course.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={() => handleDeleteCourse(course)}
                  className={`${
                    active ? 'bg-error-container text-error' : 'text-error'
                  } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      ),
    },
  ];

  return (
    <div className="max-w-container-max mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Platform Courses
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm md:text-base">
            View and moderate all courses created across the tenant.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-on-surface-variant bg-surface-card border border-border-subtle rounded-2xl">
          <div className="flex flex-col items-center justify-center gap-4 text-on-surface-variant">
            <LoadingSpinner size="md" />
            <span className="font-medium text-sm">Loading courses...</span>
          </div>
        </div>
      ) : (
        <DataTable
          data={courses || []}
          columns={columns}
          emptyMessage="No courses have been created yet."
        />
      )}
    </div>
  );
}
