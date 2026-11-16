'use client';

import React from 'react';
import Image from 'next/image';
import {
  Search,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AltCourses2Page() {
  return (
    <div className="bg-surface-bg text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      <main className="grow">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-10 bg-surface-container-lowest">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
              Master New Skills
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto">
              Advance your career with courses designed by industry experts.
              Join over 2 million learners worldwide mastering coding, design,
              and data science.
            </p>
            <div className="relative max-w-2xl mx-auto mt-10">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-outline" />
              </div>
              <input
                className="w-full pl-14 pr-32 py-5 rounded-xl border border-border-subtle focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-body-md shadow-sm outline-none placeholder:text-on-surface-variant text-on-surface"
                placeholder="Search for courses, skills, or instructors..."
                type="text"
              />
              <button className="absolute right-3 top-2 bottom-2 px-6 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-colors uppercase tracking-wider">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Catalog Layout */}
        <div className="max-w-container-max mx-auto px-4 md:px-10 py-16 flex flex-col md:flex-row gap-8">
          {/* Sidebar (Filters) */}
          <aside className="w-full md:w-72 space-y-8 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline-md font-bold text-on-surface">
                Filters
              </h2>
              <button className="text-secondary text-xs font-bold hover:underline">
                Clear all
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    defaultChecked
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Development
                  </span>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Data Science
                  </span>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Design
                  </span>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Business
                  </span>
                </label>
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-4 pt-6 border-t border-border-subtle">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Difficulty Level
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Beginner
                  </span>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Intermediate
                  </span>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Advanced
                  </span>
                </label>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 pt-6 border-t border-border-subtle">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Pricing
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    className="w-5 h-5 border-outline-variant text-secondary focus:ring-secondary"
                    name="pricing"
                    type="radio"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Free
                  </span>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    defaultChecked
                    className="w-5 h-5 border-outline-variant text-secondary focus:ring-secondary"
                    name="pricing"
                    type="radio"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Paid
                  </span>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    className="w-5 h-5 border-outline-variant text-secondary focus:ring-secondary"
                    name="pricing"
                    type="radio"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Subscription
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="grow space-y-8">
            {/* Sorting Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="font-body-md text-sm font-medium text-on-surface-variant">
                Showing 128 courses
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">
                  Sort by:
                </span>
                <select className="bg-transparent border-none font-body-md text-sm font-bold text-on-surface focus:ring-0 cursor-pointer outline-none">
                  <option>Relevance</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Course Card 1 */}
              <article className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden transition-all flex flex-col h-full hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                <div className="relative aspect-video overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                    alt="Development"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-card/90 backdrop-blur text-secondary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Development
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow space-y-4">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-surface">
                      4.9
                    </span>
                    <span className="text-on-surface-variant text-xs font-medium">
                      (1.2k)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight text-on-surface">
                    Advanced Full-Stack Web Development
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant line-clamp-2">
                    Master the modern stack including React, Node.js, and Cloud
                    Deployment with real-world projects.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
                        alt="Instructor"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      David Chen
                    </span>
                  </div>
                  <div className="pt-4 mt-auto flex items-center justify-between border-t border-border-subtle">
                    <span className="text-xl font-bold text-secondary">
                      $149
                    </span>
                    <button className="group flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Course Card 2 */}
              <article className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden transition-all flex flex-col h-full hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                <div className="relative aspect-video overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                    alt="Data Science"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-card/90 backdrop-blur text-secondary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Data Science
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow space-y-4">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-surface">
                      4.8
                    </span>
                    <span className="text-on-surface-variant text-xs font-medium">
                      (850)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight text-on-surface">
                    Data Visualization Mastery
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant line-clamp-2">
                    Learn to tell stories with data using D3.js, Tableau, and
                    modern visualization principles.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"
                        alt="Instructor"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      Sarah Jenkins
                    </span>
                  </div>
                  <div className="pt-4 mt-auto flex items-center justify-between border-t border-border-subtle">
                    <span className="text-xl font-bold text-secondary">
                      $129
                    </span>
                    <button className="group flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Course Card 3 */}
              <article className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden transition-all flex flex-col h-full hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                <div className="relative aspect-video overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop"
                    alt="Design"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-card/90 backdrop-blur text-secondary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Design
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow space-y-4">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-surface">
                      5.0
                    </span>
                    <span className="text-on-surface-variant text-xs font-medium">
                      (2.1k)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight text-on-surface">
                    UI/UX Design Systems
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant line-clamp-2">
                    The ultimate guide to building scalable, accessible, and
                    beautiful design systems in Figma.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop"
                        alt="Instructor"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      Marcus Thorne
                    </span>
                  </div>
                  <div className="pt-4 mt-auto flex items-center justify-between border-t border-border-subtle">
                    <span className="text-xl font-bold text-secondary">
                      $199
                    </span>
                    <button className="group flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Course Card 4 */}
              <article className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden transition-all flex flex-col h-full hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                <div className="relative aspect-video overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-5972d9ea1369?q=80&w=800&auto=format&fit=crop"
                    alt="Business"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-card/90 backdrop-blur text-secondary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Business
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow space-y-4">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-surface">
                      4.7
                    </span>
                    <span className="text-on-surface-variant text-xs font-medium">
                      (540)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight text-on-surface">
                    Strategic Business Leadership
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant line-clamp-2">
                    Develop critical leadership skills and strategic thinking to
                    lead high-performing teams.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1573497019230-1cb9f2a99d42?q=80&w=100&auto=format&fit=crop"
                        alt="Instructor"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      Elena Rodriguez
                    </span>
                  </div>
                  <div className="pt-4 mt-auto flex items-center justify-between border-t border-border-subtle">
                    <span className="text-xl font-bold text-secondary">
                      $175
                    </span>
                    <button className="group flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Course Card 5 */}
              <article className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden transition-all flex flex-col h-full hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                <div className="relative aspect-video overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
                    alt="Development"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-card/90 backdrop-blur text-secondary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Development
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow space-y-4">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-surface">
                      4.9
                    </span>
                    <span className="text-on-surface-variant text-xs font-medium">
                      (3.4k)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight text-on-surface">
                    Python for Automation
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant line-clamp-2">
                    Learn to automate boring tasks and build powerful scripts
                    with Python's most popular libraries.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                        alt="Instructor"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      James Wilson
                    </span>
                  </div>
                  <div className="pt-4 mt-auto flex items-center justify-between border-t border-border-subtle">
                    <span className="text-xl font-bold text-secondary">
                      Free
                    </span>
                    <button className="group flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Course Card 6 */}
              <article className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden transition-all flex flex-col h-full hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                <div className="relative aspect-video overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                    alt="Data Science"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-card/90 backdrop-blur text-secondary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Data Science
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow space-y-4">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-surface">
                      4.8
                    </span>
                    <span className="text-on-surface-variant text-xs font-medium">
                      (1.1k)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight text-on-surface">
                    Machine Learning Foundations
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant line-clamp-2">
                    A comprehensive introduction to ML algorithms using
                    Scikit-Learn and TensorFlow.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=100&auto=format&fit=crop"
                        alt="Instructor"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      Dr. Li Wei
                    </span>
                  </div>
                  <div className="pt-4 mt-auto flex items-center justify-between border-t border-border-subtle">
                    <span className="text-xl font-bold text-secondary">
                      $159
                    </span>
                    <button className="group flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            </div>

            {/* Pagination */}
            <nav className="flex items-center justify-center gap-2 pt-12">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-white text-xs font-bold">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container transition-colors text-xs font-bold">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container transition-colors text-xs font-bold">
                3
              </button>
              <span className="text-outline">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container transition-colors text-xs font-bold">
                12
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
