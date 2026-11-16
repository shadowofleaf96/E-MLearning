'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { coursesService } from '@/modules/courses/services/courses.service';
import { Course, Category } from '@/types/course.types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DIFFICULTY_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const PRICING_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popular' },
];

// Helper to get category name
function getCourseCategory(course: Course): string {
  return course.category?.name || 'Uncategorized';
}

export default function CourseCatalogPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [courses, setCourses] = useState<Course[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    coursesService
      .getCategories()
      .then((res) => {
        if (res && res.data) {
          setDbCategories(res.data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, any> = {
        page: currentPage,
        limit: 9,
        sortBy,
      };

      if (searchQuery.trim()) {
        queryParams.search = searchQuery.trim();
      }
      if (selectedCategory && selectedCategory !== 'All') {
        queryParams.category = selectedCategory;
      }
      if (selectedDifficulty && selectedDifficulty !== 'All') {
        queryParams.difficulty = selectedDifficulty;
      }
      if (selectedPricing !== 'all') {
        queryParams.pricing = selectedPricing;
      }

      const res = await coursesService.getCourses(queryParams);
      if (res && res.data) {
        setCourses(res.data);
        if (res.meta) {
          setTotalCourses(res.meta.total);
          setTotalPages(res.meta.totalPages || 1);
        } else {
          setTotalCourses(res.data.length);
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    sortBy,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedPricing,
  ]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedPricing('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== 'All') count++;
    if (selectedDifficulty !== 'All') count++;
    if (selectedPricing !== 'all') count++;
    return count;
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedPricing]);

  return (
    <main className="min-h-screen bg-surface-bg text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-10 bg-gradient-to-b from-surface via-surface-container-low to-surface-bg border-b border-border-subtle overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Academic & Professional Catalog
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-on-surface tracking-tight font-bold">
            Master New Skills with Top Institutes
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Advance your career with certified courses from world-class
            universities and institutions. Learn fullstack engineering,
            artificial intelligence, cloud architecture, and modern product
            design.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-2xl mx-auto mt-8 group"
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="text-outline w-5 h-5 group-focus-within:text-secondary transition-colors" />
            </div>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-13 pr-32 py-4.5 rounded-2xl border border-border-subtle bg-surface-card focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-body-md shadow-sm outline-none text-on-surface placeholder:text-on-surface-variant/60"
              placeholder="Search by course title, skill, instructor, or university..."
              type="text"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-2.5 bottom-2.5 px-6 bg-secondary text-white rounded-xl font-label-md font-bold hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Catalog Layout */}
      <div className="max-w-container-max mx-auto px-4 md:px-10 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-6 flex-shrink-0">
          <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2 font-headline-md text-lg font-bold">
                <Filter className="w-5 h-5 text-secondary" />
                <h2>Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-secondary font-label-md text-xs font-bold hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider">
                Category
              </h3>
              <div className="space-y-1.5">
                {/* All Option */}
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-secondary text-white font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <span>All Categories</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === 'All'
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {totalCourses}
                  </span>
                </button>

                {/* Database Categories */}
                {dbCategories.map((cat) => {
                  const isSelected =
                    selectedCategory === cat.name ||
                    selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-secondary text-white font-bold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {cat._count?.courses ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-3 pt-6 border-t border-border-subtle">
              <h3 className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider">
                Difficulty Level
              </h3>
              <div className="space-y-2">
                {DIFFICULTY_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-3 group cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      checked={selectedDifficulty === level}
                      onChange={() => {
                        setSelectedDifficulty(level);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-secondary focus:ring-secondary cursor-pointer border-outline-variant"
                    />
                    <span
                      className={`text-sm transition-colors ${
                        selectedDifficulty === level
                          ? 'text-on-surface font-bold'
                          : 'text-on-surface-variant group-hover:text-on-surface'
                      }`}
                    >
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3 pt-6 border-t border-border-subtle">
              <h3 className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider">
                Pricing
              </h3>
              <div className="space-y-2">
                {PRICING_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 group cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="pricing"
                      checked={selectedPricing === option.value}
                      onChange={() => {
                        setSelectedPricing(option.value);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-secondary focus:ring-secondary cursor-pointer border-outline-variant"
                    />
                    <span
                      className={`text-sm transition-colors ${
                        selectedPricing === option.value
                          ? 'text-on-surface font-bold'
                          : 'text-on-surface-variant group-hover:text-on-surface'
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="grow space-y-6">
          {/* Sorting & Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-card border border-border-subtle rounded-2xl px-6 py-4 shadow-sm">
            <p className="font-body-md text-sm text-on-surface-variant font-medium">
              Showing{' '}
              <span className="font-bold text-on-surface">
                {courses.length}
              </span>{' '}
              of{' '}
              <span className="font-bold text-on-surface">{totalCourses}</span>{' '}
              available courses
            </p>
            <div className="flex items-center gap-3">
              <span className="font-label-md text-xs uppercase tracking-wider text-outline font-bold">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-surface-container-low border border-border-subtle rounded-xl px-3 py-1.5 font-body-md font-bold text-sm text-on-surface focus:ring-2 focus:ring-secondary cursor-pointer outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-on-surface-variant font-semibold">
                Active filters:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-on-surface">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => {
                      setSearchInput('');
                      setSearchQuery('');
                    }}
                    className="hover:text-error ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-error ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedDifficulty !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-on-surface">
                  Level: {selectedDifficulty}
                  <button
                    onClick={() => setSelectedDifficulty('All')}
                    className="hover:text-error ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedPricing !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-on-surface">
                  Price: {selectedPricing === 'free' ? 'Free' : 'Paid'}
                  <button
                    onClick={() => setSelectedPricing('all')}
                    className="hover:text-error ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Course Grid */}
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center py-20 bg-surface-card border border-border-subtle rounded-2xl">
              <LoadingSpinner />
              <p className="text-sm font-medium text-on-surface-variant mt-4 animate-pulse">
                Fetching updated catalog...
              </p>
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => {
                const categoryName = getCourseCategory(course);
                const priceNum = Number(course.price) || 0;
                const isFree = priceNum === 0;

                return (
                  <article
                    key={course.id}
                    className="group bg-surface-card border border-border-subtle rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-secondary/40 flex flex-col h-full"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface-container">
                      <Image
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={course.title}
                        src={
                          course.thumbnail ||
                          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                        }
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-surface-card/90 backdrop-blur-md text-secondary px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                          {categoryName}
                        </span>
                        {course.tenant && (
                          <span className="bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-secondary" />
                            {course.tenant.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col grow space-y-3.5">
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-on-surface-variant">
                            <BookOpen className="w-3.5 h-3.5 text-secondary" />
                            {course._count?.modules || 0} modules
                          </span>
                          <span className="flex items-center gap-1 text-on-surface-variant">
                            <Users className="w-3.5 h-3.5 text-secondary" />
                            {course._count?.enrollments || 0} learners
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-headline-md text-lg font-bold leading-snug text-on-surface group-hover:text-secondary transition-colors line-clamp-2">
                        <Link href={`/${locale}/courses/${course.id}`}>
                          {course.title}
                        </Link>
                      </h3>

                      {/* Description */}
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {course.description ||
                          'Comprehensive expert-led curriculum designed for industry mastery.'}
                      </p>

                      {/* Instructor info */}
                      <div className="flex items-center gap-2.5 pt-2 mt-auto">
                        {course.instructor?.avatar ? (
                          <Image
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover border border-border-subtle"
                            alt={course.instructor.firstName || 'Instructor'}
                            src={course.instructor.avatar}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs">
                            {course.instructor?.firstName?.charAt(0) || 'I'}
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-bold text-on-surface truncate">
                            {course.instructor?.firstName
                              ? `${course.instructor.firstName} ${course.instructor.lastName || ''}`
                              : 'Academic Faculty'}
                          </p>
                          <p className="text-[11px] text-on-surface-variant truncate">
                            {course.tenant?.name || 'Verified Institution'}
                          </p>
                        </div>
                      </div>

                      {/* Footer: Price & Link */}
                      <div className="pt-3 flex items-center justify-between border-t border-border-subtle">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`font-headline-md text-lg font-extrabold ${
                              isFree
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-secondary'
                            }`}
                          >
                            {isFree ? 'Free' : `$${priceNum.toFixed(2)}`}
                          </span>
                        </div>

                        <Link
                          href={`/${locale}/courses/${course.id}`}
                          className="inline-flex items-center gap-1.5 text-secondary font-label-md text-xs font-bold hover:gap-2 transition-all"
                        >
                          Enroll Now
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                No courses found
              </h3>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                We couldn't find any courses matching your current search or
                filter criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-secondary text-white rounded-xl font-label-md text-sm font-bold hover:bg-secondary/90 transition-all cursor-pointer shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-label-md text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-secondary text-white shadow-md'
                          : 'border border-border-subtle text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
