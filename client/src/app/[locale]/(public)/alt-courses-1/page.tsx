'use client';

import React from 'react';
import Image from 'next/image';
import { Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AltCourses1Page() {
  return (
    <div className="bg-surface-bg text-on-background font-body-md selection:bg-secondary/10 min-h-screen">
      {/* Main Content Layout */}
      <main className="max-w-container-max mx-auto px-4 md:px-10 py-12">
        {/* Search & Header Section */}
        <header className="mb-12">
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold mb-6 text-on-background tracking-tight">
            Explore Our Catalog
          </h1>
          <div className="relative max-w-2xl group transition-transform focus-within:scale-[1.01] duration-300">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
            <input
              className="w-full pl-12 pr-4 py-4 bg-white border border-border-subtle rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none text-base shadow-sm text-on-surface placeholder:text-on-surface-variant"
              placeholder="Search for courses, skills, or institutions..."
              type="text"
            />
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-70 flex-shrink-0 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="font-headline-md text-sm font-semibold mb-4 text-on-surface uppercase tracking-wider">
                Category
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    defaultChecked
                    className="w-5 h-5 rounded border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Development
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Data Science
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Design
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Business
                  </span>
                </label>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-8">
              <h3 className="font-headline-md text-sm font-semibold mb-4 text-on-surface uppercase tracking-wider">
                Pricing
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    name="price"
                    type="radio"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Free
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    defaultChecked
                    className="w-5 h-5 border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    name="price"
                    type="radio"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Paid
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    name="price"
                    type="radio"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Subscription
                  </span>
                </label>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-8">
              <h3 className="font-headline-md text-sm font-semibold mb-4 text-on-surface uppercase tracking-wider">
                Difficulty
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Beginner
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Intermediate
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-border-subtle text-secondary focus:ring-secondary transition-all cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Advanced
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="bg-white border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                  alt="Development"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                  Development
                </span>
              </div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-on-surface-variant">
                    Nexus University
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    $89.99
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-4 text-on-background line-clamp-2 leading-snug">
                  Advanced Systems Architecture with Rust
                </h2>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-background">
                      4.9
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">
                      (1.2k)
                    </span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">
                    24h content
                  </span>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                  alt="Data Science"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                  Data Science
                </span>
              </div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-on-surface-variant">
                    Quant Institute
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    $124.00
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-4 text-on-background line-clamp-2 leading-snug">
                  Predictive Modeling for Modern Financial Markets
                </h2>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-background">
                      4.8
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">
                      (856)
                    </span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">
                    18h content
                  </span>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-white border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop"
                  alt="Design"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                  Design
                </span>
              </div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-on-surface-variant">
                    Studio Academy
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    $59.99
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-4 text-on-background line-clamp-2 leading-snug">
                  UI Design Systems: From Concept to Component
                </h2>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-background">
                      5.0
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">
                      (423)
                    </span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">
                    12h content
                  </span>
                </div>
              </div>
            </div>

            {/* Course Card 4 */}
            <div className="bg-white border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5972d9ea1369?q=80&w=800&auto=format&fit=crop"
                  alt="Business"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                  Business
                </span>
              </div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-on-surface-variant">
                    Beacon Business School
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    $199.00
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-4 text-on-background line-clamp-2 leading-snug">
                  Strategic Leadership in Global Markets
                </h2>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-background">
                      4.7
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">
                      (2.1k)
                    </span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">
                    32h content
                  </span>
                </div>
              </div>
            </div>

            {/* Course Card 5 */}
            <div className="bg-white border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
                  alt="Development"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                  Development
                </span>
              </div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-on-surface-variant">
                    CodeMasters Org
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    $74.50
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-4 text-on-background line-clamp-2 leading-snug">
                  Full-Stack Development with Next.js 15
                </h2>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-background">
                      4.9
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">
                      (3.4k)
                    </span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">
                    45h content
                  </span>
                </div>
              </div>
            </div>

            {/* Course Card 6 */}
            <div className="bg-white border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                  alt="Data Science"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                  Data Science
                </span>
              </div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-on-surface-variant">
                    DataFlow Academy
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    $0.00
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-4 text-on-background line-clamp-2 leading-snug">
                  Foundations of Machine Learning
                </h2>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-bold text-on-background">
                      4.6
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">
                      (12.1k)
                    </span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">
                    6h content
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-16 flex justify-center items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle hover:bg-surface-container transition-colors">
            <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-white font-bold">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle hover:bg-surface-container transition-colors text-on-surface font-medium">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle hover:bg-surface-container transition-colors text-on-surface font-medium">
            3
          </button>
          <span className="px-2 text-on-surface-variant">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle hover:bg-surface-container transition-colors text-on-surface font-medium">
            12
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle hover:bg-surface-container transition-colors">
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </main>
    </div>
  );
}
