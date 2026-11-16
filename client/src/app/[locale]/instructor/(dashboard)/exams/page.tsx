'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type ExamStatus = 'Published' | 'Draft';
type ExamType = 'Multiple Choice' | 'Coding Challenge' | 'Mixed';

interface Exam {
  id: string;
  title: string;
  courseName: string;
  type: ExamType;
  status: ExamStatus;
  questionsCount: number;
  participantsCount: number;
  averageScore?: number;
  lastUpdated: string;
}

import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

const SkeletonRow = () => (
  <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-6 animate-pulse">
    <div className="flex-1">
      <div className="h-6 bg-surface-variant rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-surface-variant rounded w-1/4"></div>
    </div>
    <div className="hidden lg:flex items-center justify-end gap-8 flex-none">
      <div className="w-16 h-8 bg-surface-variant rounded"></div>
      <div className="w-16 h-8 bg-surface-variant rounded"></div>
      <div className="w-16 h-8 bg-surface-variant rounded"></div>
    </div>
    <div className="w-24 h-8 bg-surface-variant rounded hidden lg:block"></div>
  </div>
);

const getStatusBadge = (status: ExamStatus) => {
  switch (status) {
    case 'Published':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary-container text-on-tertiary-container border border-tertiary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          Published
        </span>
      );
    case 'Draft':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant/50">
          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
          Draft
        </span>
      );
  }
};

const getTypeIcon = (type: ExamType) => {
  switch (type) {
    case 'Multiple Choice':
      return 'quiz';
    case 'Coding Challenge':
      return 'code';
    case 'Mixed':
      return 'grading';
  }
};

export default function InstructorExamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await api.get(ENDPOINTS.EXAMS.INSTRUCTOR_ME);
        if (res.data && res.data.data) {
          setExams(res.data.data);
        } else {
          setExams([]);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || exam.type === filterType;
    const matchesStatus =
      filterStatus === 'All' || exam.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalExams = exams.length;
  const publishedExams = exams.filter((e) => e.status === 'Published').length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-6 sm:p-8 rounded-2xl shadow-sm border border-border-subtle">
        <div>
          <h1 className="font-display-sm text-display-sm text-on-surface mb-2">
            Assessments & Exams
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Create and manage evaluations for your courses.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6 mr-4 px-6 py-2 bg-surface-container-lowest rounded-xl border border-border-subtle">
            <div className="text-center">
              <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-0.5">
                Total
              </p>
              <p className="font-title-lg text-title-lg text-on-surface">
                {totalExams}
              </p>
            </div>
            <div className="w-px h-8 bg-border-subtle"></div>
            <div className="text-center">
              <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-0.5">
                Published
              </p>
              <p className="font-title-lg text-title-lg text-tertiary">
                {publishedExams}
              </p>
            </div>
          </div>
          <Link
            href="/instructor/exams/create"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-xl font-label-lg text-label-lg transition-all shadow-sm hover:shadow active:scale-[0.98] whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Exam
          </Link>
        </div>
      </div>

      {/* Filters and List */}
      <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-border-subtle flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest/50">
          <div className="relative w-full sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search exams or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-surface border border-border-subtle rounded-xl text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
                filter_list
              </span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-[160px] pl-9 pr-8 py-2.5 bg-surface border border-border-subtle rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer font-body-md"
              >
                <option value="All">All Types</option>
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="Coding Challenge">Coding Challenge</option>
                <option value="Mixed">Mixed</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-[140px] pl-4 pr-8 py-2.5 bg-surface border border-border-subtle rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer font-body-md"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="divide-y divide-border-subtle">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-error mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-surface border border-outline rounded-lg hover:bg-surface-variant transition"
              >
                Retry
              </button>
            </div>
          ) : filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="p-4 sm:p-6 hover:bg-surface-container-lowest/80 transition-colors group flex flex-col lg:flex-row lg:items-center gap-6"
              >
                {/* Info Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-title-md text-title-md text-on-surface truncate">
                      {exam.title}
                    </h3>
                    {getStatusBadge(exam.status)}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant truncate mb-4 lg:mb-0">
                    {exam.courseName}
                  </p>

                  {/* Mobile Metrics (Visible on small screens) */}
                  <div className="flex flex-wrap items-center gap-4 lg:hidden mt-4 pt-4 border-t border-border-subtle/50">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm">
                      <span className="material-symbols-outlined text-[16px]">
                        {getTypeIcon(exam.type)}
                      </span>
                      {exam.type}
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm">
                      <span className="material-symbols-outlined text-[16px]">
                        format_list_numbered
                      </span>
                      {exam.questionsCount} Questions
                    </div>
                    {exam.status === 'Published' && (
                      <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm">
                        <span className="material-symbols-outlined text-[16px]">
                          group
                        </span>
                        {exam.participantsCount} Takers
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Metrics Column */}
                <div className="hidden lg:flex items-center justify-end gap-8 flex-none">
                  <div className="flex flex-col items-end min-w-[120px]">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
                      Type
                    </span>
                    <div className="flex items-center gap-1.5 font-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        {getTypeIcon(exam.type)}
                      </span>
                      {exam.type}
                    </div>
                  </div>

                  <div className="flex flex-col items-end min-w-[100px]">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
                      Questions
                    </span>
                    <span className="font-body-md text-on-surface">
                      {exam.questionsCount}
                    </span>
                  </div>

                  <div className="flex flex-col items-end min-w-[100px]">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
                      Avg Score
                    </span>
                    {exam.averageScore ? (
                      <span className="font-body-md text-on-surface flex items-center gap-1">
                        {exam.averageScore}%
                      </span>
                    ) : (
                      <span className="font-body-md text-outline-variant">
                        —
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex items-center justify-end gap-2 flex-none lg:ml-6 lg:pl-6 lg:border-l lg:border-border-subtle">
                  <span className="text-xs text-outline-variant mr-2 hidden sm:inline-block">
                    {exam.lastUpdated}
                  </span>
                  <button
                    className="p-2 text-outline-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    title="Edit Exam"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </button>
                  <button
                    className="p-2 text-outline-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                    title="Preview"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </button>
                  <button
                    className="p-2 text-outline-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-error/20"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-outline">
                  quiz
                </span>
              </div>
              <h3 className="font-title-lg text-title-lg text-on-surface mb-2">
                No exams found
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto mb-6">
                Try adjusting your search or filters to find what you're looking
                for, or create a new assessment.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('All');
                  setFilterStatus('All');
                }}
                className="font-label-lg text-label-lg text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
