'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { exportToCsv } from '@/lib/exportCsv';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import {
  Filter,
  Download,
  Users,
  Target,
  Flame,
  Search,
  Mail,
  BarChart2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterCourse, setFilterCourse] = useState('All');
  const [uniqueCourses, setUniqueCourses] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, studentsRes] = await Promise.all([
          api.get(ENDPOINTS.ANALYTICS.INSTRUCTOR),
          api.get(ENDPOINTS.ANALYTICS.INSTRUCTOR_STUDENTS),
        ]);

        setStats(statsRes.data.data);
        const studentList = studentsRes.data.data || [];
        setStudents(studentList);

        // Extract unique courses from students
        const courses = Array.from(
          new Set(studentList.map((s: any) => s.course))
        ) as string[];
        setUniqueCourses(courses);
      } catch (err) {
        console.error('Failed to fetch student analytics data', err);
        toast.error('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse =
      filterCourse === 'All' || student.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const handleExport = () => {
    exportToCsv('students_report', filteredStudents, [
      { header: 'Name', accessor: (s) => s.name },
      { header: 'Email', accessor: (s) => s.email },
      { header: 'Course', accessor: (s) => s.course },
      { header: 'Progress (%)', accessor: (s) => s.progress },
      { header: 'Average Score', accessor: (s) => s.score },
      { header: 'Last Active', accessor: (s) => s.lastActive },
    ]);
    toast.success('Export downloaded successfully!');
  };

  // Compute total enrollments from performance list
  const totalEnrolled =
    stats?.coursePerformance?.reduce(
      (acc: number, curr: any) => acc + curr.enrolled,
      0
    ) || 0;
  const avgCompletion = stats?.avgCompletionRate || 0;
  const activeLearners = stats?.dailyActiveLearners || 0;

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
            Students Management
          </h2>
          <p className="font-medium text-sm text-on-surface-variant mt-1">
            Overview and manage all enrolled students across your courses.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-colors shadow-sm focus:outline-none ${
              showFilter
                ? 'bg-secondary text-white border-secondary'
                : 'bg-surface-card border-border-subtle text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-card border border-border-subtle rounded-xl text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-colors shadow-sm focus:outline-none disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-on-surface">
            <Users className="w-16 h-16" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-2">
            Total Enrolled Students
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="font-headline-lg text-4xl font-bold text-on-surface">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-surface-variant animate-pulse rounded" />
              ) : (
                totalEnrolled.toLocaleString()
              )}
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-on-surface">
            <Target className="w-16 h-16" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-2">
            Average Completion
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="font-headline-lg text-4xl font-bold text-on-surface">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-surface-variant animate-pulse rounded" />
              ) : (
                `${avgCompletion}%`
              )}
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-on-surface">
            <Flame className="w-16 h-16" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-2">
            Active Learners
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="font-headline-lg text-4xl font-bold text-on-surface">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-surface-variant animate-pulse rounded" />
              ) : (
                activeLearners.toLocaleString()
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-surface-card border border-border-subtle rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-bg border border-border-subtle rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-on-surface"
            />
          </div>

          {showFilter && (
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="bg-surface-bg border border-border-subtle rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-secondary cursor-pointer text-on-surface"
            >
              <option value="All">All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Table Wrapper for Horizontal Scroll */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-container-low/50">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Enrolled Course
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Avg. Score
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-variant shrink-0" />
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-surface-variant rounded" />
                          <div className="w-32 h-3 bg-surface-variant rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-28 h-4 bg-surface-variant rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 h-2 bg-surface-variant rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-4 bg-surface-variant rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-4 bg-surface-variant rounded" />
                    </td>
                    <td className="px-6 py-4" />
                  </tr>
                ))
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-surface-container-lowest transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-full border border-border-subtle shrink-0 overflow-hidden bg-surface-bg">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface line-clamp-1">
                            {student.name}
                          </p>
                          <p className="text-xs font-medium text-on-surface-variant line-clamp-1">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-surface-container-high rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-secondary h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-on-surface-variant">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            student.score >= 80
                              ? 'bg-[#10b981]'
                              : student.score >= 50
                                ? 'bg-xp-gold'
                                : 'bg-red-500'
                          }`}
                        />
                        <span className="font-mono text-xs font-bold text-on-surface">
                          {student.score}/100
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface-variant whitespace-nowrap">
                      {student.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`mailto:${student.email}`}
                          className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded-lg transition-colors focus:outline-none"
                          title="Email"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                        <button
                          className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded-lg transition-colors focus:outline-none"
                          title="View Progress"
                        >
                          <BarChart2 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors focus:outline-none"
                          title="More Options"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-on-surface-variant"
                  >
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Table Footer / Pagination */}
        <div className="p-4 border-t border-border-subtle bg-surface-container-lowest flex items-center justify-between">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Showing {filteredStudents.length} Students
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
