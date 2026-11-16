'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  BookOpen,
  Users,
  Star,
  Banknote,
  Filter,
  Plus,
  Edit,
  Eye,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useInstructorStats } from '@/modules/courses/hooks/useInstructorStats';

export default function InstructorCoursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const {
    instructorCourses,
    totalStudents,
    totalEarnings,
    avgCompletion,
    loading,
  } = useInstructorStats();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCourses =
    instructorCourses?.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter === 'Published') return course.isPublished;
      if (statusFilter === 'Draft') return !course.isPublished;
      return true;
    }) || [];

  return (
    <div className="max-w-container-max mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-[32px] font-bold text-primary font-headline-lg tracking-tight">
            Manage Courses
          </h2>
          <p className="text-on-surface-variant text-body-md mt-1">
            Design, refine, and deploy your curriculum to students worldwide.
          </p>
        </div>
        <button
          onClick={() => router.push('/instructor/courses/new')}
          className="bg-secondary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-card border border-border-subtle p-6 rounded-xl flex items-center gap-4 group hover:border-secondary transition-colors">
          <div className="h-12 w-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-outline uppercase tracking-wider">
              Total Courses
            </p>
            <h4 className="text-[24px] font-bold text-primary">
              {loading ? '...' : instructorCourses?.length || 0}
            </h4>
          </div>
        </div>
        <div className="bg-surface-card border border-border-subtle p-6 rounded-xl flex items-center gap-4 group hover:border-secondary transition-colors">
          <div className="h-12 w-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-outline uppercase tracking-wider">
              Active Students
            </p>
            <h4 className="text-[24px] font-bold text-primary">
              {loading ? '...' : totalStudents.toLocaleString()}
            </h4>
          </div>
        </div>
        <div className="bg-surface-card border border-border-subtle p-6 rounded-xl flex items-center gap-4 group hover:border-secondary transition-colors">
          <div className="h-12 w-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
            <Star size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-outline uppercase tracking-wider">
              Avg. Completion
            </p>
            <h4 className="text-[24px] font-bold text-primary">
              {loading ? '...' : `${avgCompletion}%`}
            </h4>
          </div>
        </div>
        <div className="bg-surface-card border border-border-subtle p-6 rounded-xl flex items-center gap-4 group hover:border-secondary transition-colors">
          <div className="h-12 w-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
            <Banknote size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-outline uppercase tracking-wider">
              Course Revenue
            </p>
            <h4 className="text-[24px] font-bold text-primary">
              {loading ? '...' : `$${totalEarnings.toLocaleString()}`}
            </h4>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-surface-card border border-border-subtle rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            type="text"
            className="w-full bg-surface-bg border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none text-body-sm transition-all"
            placeholder="Filter by course title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-surface-bg border border-border-subtle rounded-lg py-2.5 pl-4 pr-10 text-body-sm font-semibold text-on-surface-variant focus:ring-1 focus:ring-secondary outline-none cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <button className="bg-surface-container-high hover:bg-surface-container text-secondary font-bold px-4 py-2.5 rounded-lg text-body-sm transition-colors flex items-center gap-2">
            <Filter size={18} />
            More Filters
          </button>
        </div>
      </div>

      {/* Course Table List */}
      <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-border-subtle">
              <tr>
                <th className="px-6 py-4 text-[12px] text-outline font-bold uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-4 text-[12px] text-outline font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[12px] text-outline font-bold uppercase tracking-wider">
                  Enrolled
                </th>
                <th className="px-6 py-4 text-[12px] text-outline font-bold uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-[12px] text-outline font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-outline"
                  >
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-outline"
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course: any) => (
                  <tr
                    key={course.id}
                    className="hover:bg-surface-container-lowest transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-24 rounded-lg bg-surface-container overflow-hidden border border-border-subtle shrink-0">
                          <img
                            src={
                              course.thumbnailUrl ||
                              course.thumbnail ||
                              'https://placehold.co/400x225/e2e8f0/475569?text=Course'
                            }
                            alt="Course Thumbnail"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-primary group-hover:text-secondary transition-colors">
                            {course.title}
                          </h5>
                          <p className="text-sm text-outline">
                            {course.description || 'General Course'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {course.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-tertiary-container/10 text-on-tertiary-container font-bold text-xs">
                          <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-xp-gold/10 text-xp-gold font-bold text-xs">
                          <span className="w-2 h-2 rounded-full bg-xp-gold"></span>
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 font-medium text-primary">
                      {course._count?.enrollments || 0} Students
                    </td>
                    <td className="px-6 py-5 text-sm text-outline">
                      {new Date(
                        course.updatedAt || course.createdAt || Date.now()
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/${locale}/instructor/courses/${course.id}`
                            )
                          }
                          className="p-2 text-outline hover:text-secondary hover:bg-surface-container-low rounded-lg transition-all"
                          title="Edit Content"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/${locale}/student/course/${course.id}/learn`
                            )
                          }
                          className="p-2 text-outline hover:text-secondary hover:bg-surface-container-low rounded-lg transition-all"
                          title="Preview Student View"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/${locale}/instructor/analytics`)
                          }
                          className="p-2 text-outline hover:text-secondary hover:bg-surface-container-low rounded-lg transition-all"
                          title="View Detailed Analytics"
                        >
                          <BarChart size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-border-subtle">
          <p className="text-sm text-outline">
            Showing {filteredCourses.length > 0 ? 1 : 0} to{' '}
            {filteredCourses.length} of {instructorCourses?.length || 0} courses
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-border-subtle bg-white text-outline hover:bg-surface-container transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="px-3 py-1 rounded border border-secondary bg-secondary text-white font-bold">
              1
            </button>
            <button className="px-3 py-1 rounded border border-border-subtle bg-white text-outline hover:bg-surface-container transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Promotion / Tip Card */}
      <div className="mt-10 p-8 rounded-2xl bg-linear-to-r from-secondary-container to-secondary text-on-secondary-container flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
        <div className="relative z-10 max-w-xl text-white">
          <h3 className="font-headline-md text-headline-md mb-2">
            Maximize Student Engagement
          </h3>
          <p className="opacity-90 font-body-md">
            Instructors who update their curriculum once every quarter see a 24%
            increase in student completion rates. Check your analytics to see
            where students drop off.
          </p>
        </div>
        <div className="relative z-10 flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-white text-secondary font-bold shadow-lg hover:scale-105 transition-transform">
            Get Improvement Tips
          </button>
          <button className="px-6 py-3 rounded-xl bg-secondary-container text-white border border-white/20 font-bold hover:bg-secondary transition-colors">
            Schedule Review
          </button>
        </div>
        {/* Abstract visual elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700"></div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500"></div>
      </div>
    </div>
  );
}
