'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchService, SearchResults } from '@/modules/search/services/search.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchService.search(query.trim());
        if (res?.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const hasAnyResults =
    results &&
    (results.courses.length > 0 ||
      results.lessons.length > 0 ||
      results.instructors.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-border-subtle overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-subtle gap-3 bg-surface-container-low">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, lessons, topics, instructors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-on-surface placeholder:text-on-surface-variant/50 text-base outline-none"
          />
          {loading && (
            <span className="material-symbols-outlined animate-spin text-secondary text-[20px]">
              progress_activity
            </span>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-on-surface-variant bg-surface-container-high rounded border border-border-subtle">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query.trim() ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-30">
                manage_search
              </span>
              <p className="text-sm font-medium">Type at least 2 characters to search</p>
              <div className="flex justify-center gap-2 mt-4 text-xs">
                <span className="px-2.5 py-1 bg-surface-container rounded-full">Web Development</span>
                <span className="px-2.5 py-1 bg-surface-container rounded-full">Python</span>
                <span className="px-2.5 py-1 bg-surface-container rounded-full">Machine Learning</span>
              </div>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-on-surface-variant text-sm">
              Searching platform content...
            </div>
          ) : !hasAnyResults ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-30">
                sentiment_dissatisfied
              </span>
              <p className="text-sm font-medium">No results found for &quot;{query}&quot;</p>
              <p className="text-xs opacity-75 mt-1">Try another keyword or course title</p>
            </div>
          ) : (
            <>
              {/* Courses Section */}
              {results.courses.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-2">
                    Courses ({results.courses.length})
                  </h4>
                  <div className="space-y-1">
                    {results.courses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => navigateTo(`/student/courses/${course.id}`)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container cursor-pointer transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-secondary text-[20px]">
                              school
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-on-surface truncate group-hover:text-secondary transition-colors">
                            {course.title}
                          </p>
                          <p className="text-xs text-on-surface-variant truncate">
                            {course.category?.name || 'General'} • Instructor: {course.instructor.firstName} {course.instructor.lastName}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary group-hover:translate-x-0.5 transition-all text-[18px]">
                          arrow_forward
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lessons Section */}
              {results.lessons.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-2">
                    Lessons & Topics ({results.lessons.length})
                  </h4>
                  <div className="space-y-1">
                    {results.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() =>
                          navigateTo(`/student/course/${lesson.module.courseId}/learn`)
                        }
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container cursor-pointer transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">
                            {lesson.type === 'video'
                              ? 'play_circle'
                              : lesson.type === 'pdf'
                                ? 'picture_as_pdf'
                                : 'description'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate group-hover:text-secondary transition-colors">
                            {lesson.title}
                          </p>
                          <p className="text-[11px] text-on-surface-variant truncate">
                            In {lesson.module.course?.title} • {lesson.module.title}
                          </p>
                        </div>
                        {lesson.duration && (
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            {lesson.duration}m
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructors Section */}
              {results.instructors.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-2">
                    Instructors ({results.instructors.length})
                  </h4>
                  <div className="space-y-1">
                    {results.instructors.map((inst) => (
                      <div
                        key={inst.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                          {inst.avatar ? (
                            <img
                              src={inst.avatar}
                              alt=""
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            inst.firstName[0]
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-on-surface">
                            {inst.firstName} {inst.lastName}
                          </p>
                          <p className="text-[11px] text-on-surface-variant">
                            {inst._count?.instructorCourses || 0} active courses
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-surface-container-low border-t border-border-subtle flex items-center justify-between text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-surface-container-high px-1 rounded">↵</kbd> to select
            </span>
            <span>
              <kbd className="font-mono bg-surface-container-high px-1 rounded">esc</kbd> to close
            </span>
          </div>
          <span>Lumina Global Search</span>
        </div>
      </div>
    </div>
  );
}
