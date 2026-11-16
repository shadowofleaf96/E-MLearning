'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  BarChart,
  Settings,
  Plus,
  Bell,
  MessageSquare,
  UserCircle,
  HelpCircle,
  ChevronRight,
  Eye,
  CheckCircle,
  Type,
  Star,
  FileText,
  Terminal,
  Trash2,
  EyeOff,
  Bold,
  Italic,
  Code,
  List,
  Menu,
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function CodingChallengeBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  // const challengeId = params.challengeId as string;

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'solution' | 'starter'>(
    'solution'
  );

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success('Challenge saved successfully!');
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="bg-surface-bg font-body-md text-on-surface antialiased overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <nav className="bg-surface-card h-16 fixed top-0 right-0 left-0 md:left-[280px] z-40 border-b border-border-subtle flex justify-between items-center px-4 md:px-10 w-full transition-all duration-300">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-on-surface hover:text-primary transition-colors">
            <Menu size={24} />
          </button>
          <div className="font-headline-md text-xl md:text-2xl font-bold text-primary">
            EduStudio - Instructor Portal
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 mr-4">
            <button className="px-4 py-2 rounded-lg border border-border-subtle text-on-surface-variant hover:border-secondary hover:text-secondary font-semibold text-sm transition-colors flex items-center gap-2 bg-surface-card">
              <Eye size={18} />
              Preview Challenge
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center gap-2 bg-tertiary-container text-white border-none disabled:opacity-50"
            >
              <CheckCircle size={18} />
              {isSaving ? 'Saving...' : 'Save Challenge'}
            </button>
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <button className="hover:text-secondary transition-colors cursor-pointer relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="hover:text-secondary transition-colors cursor-pointer">
              <MessageSquare size={20} />
            </button>
            <button className="hover:text-secondary transition-colors cursor-pointer">
              <UserCircle size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* SideNavBar */}
      <aside className="bg-surface-bg w-70 h-screen fixed left-0 top-0 border-r border-border-subtle hidden md:flex flex-col py-6 px-4 z-50">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <div>
            <div className="font-headline-md text-lg font-bold text-primary leading-tight">
              EduStudio
            </div>
            <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
              Instructor Portal
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push('/instructor/courses')}
          className="w-full mb-8 py-3 px-4 rounded-lg bg-secondary text-white font-semibold text-sm shadow-sm hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create New Course
        </button>
        <div className="flex flex-col gap-1 flex-1">
          <button
            onClick={() => router.push('/instructor/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-medium text-sm transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            onClick={() => router.push('/instructor/courses')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary font-bold border-l-4 border-secondary bg-surface-container-low text-sm transition-colors"
          >
            <BookOpen size={20} />
            Course Builder
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-medium text-sm transition-colors">
            <BarChart size={20} />
            Student Analytics
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-medium text-sm transition-colors">
            <Settings size={20} />
            Settings
          </button>
        </div>
        <div className="mt-auto pt-4 border-t border-border-subtle">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-medium text-sm transition-colors">
            <HelpCircle size={20} />
            Help Center
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-[280px] pt-16 min-h-screen">
        <div className="max-w-container-max mx-auto p-4 md:p-10">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-xs mb-2">
              <button
                onClick={() => router.push('/instructor/courses')}
                className="hover:text-secondary transition-colors"
              >
                Courses
              </button>
              <ChevronRight size={16} />
              <button
                onClick={() => router.push(`/instructor/courses/${courseId}`)}
                className="hover:text-secondary transition-colors"
              >
                Data Structures 101
              </button>
              <ChevronRight size={16} />
              <span className="text-primary">New Challenge</span>
            </div>
            <h1 className="text-3xl font-bold font-headline-lg text-primary tracking-tight">
              Coding Challenge Builder
            </h1>
            <p className="text-base text-on-surface-variant mt-1">
              Design, configure, and validate coding exercises for your
              students.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Core Setup */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* 1. Challenge Header */}
              <section className="bg-surface-card rounded-xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Type className="text-secondary" size={24} />
                  Challenge Basics
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                      Challenge Title
                    </label>
                    <input
                      className="w-full px-4 py-2.5 rounded-lg border border-border-subtle bg-surface-bg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-base text-on-surface placeholder:text-outline-variant transition-colors"
                      placeholder="e.g., Array Manipulation"
                      type="text"
                      defaultValue="Array Manipulation"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                        Difficulty Level
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-lg border border-border-subtle bg-surface-bg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-base text-on-surface outline-none">
                        <option>Beginner</option>
                        <option selected>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                        Reward Points (XP)
                      </label>
                      <div className="relative">
                        <Star
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500"
                        />
                        <input
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-subtle bg-surface-bg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-base text-on-surface transition-colors"
                          type="number"
                          defaultValue="150"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Problem Statement */}
              <section className="bg-surface-card rounded-xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                    <FileText className="text-secondary" size={24} />
                    Problem Statement
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant">
                      <Bold size={18} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant">
                      <Italic size={18} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant">
                      <Code size={18} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant">
                      <List size={18} />
                    </button>
                  </div>
                </div>
                <div className="border border-border-subtle rounded-lg overflow-hidden focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-colors">
                  <textarea
                    className="w-full p-4 bg-surface-bg border-none focus:ring-0 text-base text-on-surface resize-y outline-none"
                    placeholder="Describe the problem clearly..."
                    rows={8}
                    defaultValue={`Describe the problem clearly...

Constraints:
- 1 <= N <= 10^5

Example:
Input: [1, 2, 3]
Output: 6`}
                  />
                </div>
              </section>

              {/* 4. Code Editors */}
              <section className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="border-b border-border-subtle bg-surface-bg px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Terminal className="text-secondary" size={24} />
                    Workspace
                  </h2>
                  <div className="flex gap-2 bg-surface-card p-1 rounded-lg border border-border-subtle">
                    <button
                      onClick={() => setActiveTab('solution')}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                        activeTab === 'solution'
                          ? 'bg-secondary text-white shadow-sm'
                          : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      Solution Code
                    </button>
                    <button
                      onClick={() => setActiveTab('starter')}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                        activeTab === 'starter'
                          ? 'bg-secondary text-white shadow-sm'
                          : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      Starter Code
                    </button>
                  </div>
                </div>
                <div className="bg-[#1e1e1e] h-[400px] flex flex-col font-mono text-sm text-gray-300">
                  <div className="flex px-4 py-2 bg-[#252526] border-b border-[#333] text-[#9CDCFE]">
                    <span className="flex items-center gap-2 text-xs">
                      <span className="text-yellow-500">JS</span> solution.js
                    </span>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1">
                    {activeTab === 'solution' ? (
                      <pre>
                        <code>
                          <span className="text-blue-400">function</span>{' '}
                          <span className="text-yellow-200">
                            arrayManipulation
                          </span>
                          (<span className="text-blue-300">n</span>,{' '}
                          <span className="text-blue-300">queries</span>) {'{'}
                          {'\n'}
                          {'    '}
                          <span className="text-green-500">
                            // Initialize array with zeros
                          </span>
                          {'\n'}
                          {'    '}
                          <span className="text-blue-400">const</span>{' '}
                          <span className="text-blue-300">arr</span> ={' '}
                          <span className="text-blue-400">new</span> Array(n +
                          1).fill(0);{'\n'}
                          {'\n    '}
                          <span className="text-green-500">
                            // Add values at boundaries
                          </span>
                          {'\n    '}
                          <span className="text-purple-400">for</span> (
                          <span className="text-blue-400">let</span> i = 0; i{' '}
                          {'<'} queries.length; i++) {'{'}
                          {'\n'}
                          {'        '}
                          <span className="text-blue-400">const</span> [a, b, k]
                          = queries[i];
                          {'\n'}
                          {'        '}arr[a - 1] += k;{'\n'}
                          {'        '}
                          <span className="text-purple-400">if</span> (b {'<'}{' '}
                          n) {'{'}
                          {'\n'}
                          {'            '}arr[b] -= k;{'\n'}
                          {'        }'}
                          {'\n    }'}
                          {'\n\n    '}
                          <span className="text-blue-400">let</span> max = 0;
                          {'\n'}
                          {'    '}
                          <span className="text-blue-400">let</span> current =
                          0;{'\n'}
                          {'\n    '}
                          <span className="text-purple-400">for</span> (
                          <span className="text-blue-400">let</span> i = 0; i{' '}
                          {'<'} n; i++) {'{'}
                          {'\n'}
                          {'        '}current += arr[i];{'\n'}
                          {'        '}
                          <span className="text-purple-400">
                            if
                          </span> (current {'>'} max) max = current;
                          {'\n    }'}
                          {'\n\n    '}
                          <span className="text-purple-400">return</span> max;
                          {'\n'}
                          {'}'}
                        </code>
                      </pre>
                    ) : (
                      <pre>
                        <code>
                          <span className="text-blue-400">function</span>{' '}
                          <span className="text-yellow-200">
                            arrayManipulation
                          </span>
                          (<span className="text-blue-300">n</span>,{' '}
                          <span className="text-blue-300">queries</span>) {'{'}
                          {'\n'}
                          {'    '}
                          <span className="text-green-500">
                            // Write your solution here
                          </span>
                          {'\n'}
                          {'}'}
                        </code>
                      </pre>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Settings & Test Cases */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* 3. Configuration & Selection */}
              <section className="bg-surface-card rounded-xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-border-subtle pb-2">
                  Environment Config
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Primary Language
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg border border-border-subtle bg-surface-bg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm text-on-surface outline-none">
                      <option selected>JavaScript (Node.js)</option>
                      <option>Python 3</option>
                      <option>Java 17</option>
                      <option>C++</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Time Limit
                      </label>
                      <div className="flex items-center">
                        <input
                          className="w-full px-3 py-2 rounded-l-lg border border-r-0 border-border-subtle bg-surface-bg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm text-on-surface outline-none"
                          type="number"
                          defaultValue="2000"
                        />
                        <span className="bg-surface-container-low border border-border-subtle px-3 py-2 rounded-r-lg text-xs font-semibold text-on-surface-variant">
                          ms
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Memory Limit
                      </label>
                      <div className="flex items-center">
                        <input
                          className="w-full px-3 py-2 rounded-l-lg border border-r-0 border-border-subtle bg-surface-bg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm text-on-surface outline-none"
                          type="number"
                          defaultValue="256"
                        />
                        <span className="bg-surface-container-low border border-border-subtle px-3 py-2 rounded-r-lg text-xs font-semibold text-on-surface-variant">
                          MB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Test Case Management */}
              <section className="bg-surface-card rounded-xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-border-subtle pb-2">
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Test Cases
                  </h3>
                  <span className="bg-surface-container text-secondary px-2 py-0.5 rounded text-xs font-bold">
                    2 Added
                  </span>
                </div>
                <div className="space-y-3 mb-4 overflow-y-auto max-h-[400px] pr-2">
                  {/* Test Case 1 */}
                  <div className="border border-border-subtle rounded-lg p-3 bg-surface-bg relative group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-primary">
                        Test Case #1
                      </span>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-500" />
                        <button className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div className="bg-surface-card p-2 rounded border border-border-subtle">
                        <div className="text-outline-variant text-[10px] mb-1 uppercase font-semibold">
                          Input
                        </div>
                        <div className="text-on-surface truncate">
                          5 3\n1 2 100\n2 5...
                        </div>
                      </div>
                      <div className="bg-surface-card p-2 rounded border border-border-subtle">
                        <div className="text-outline-variant text-[10px] mb-1 uppercase font-semibold">
                          Output
                        </div>
                        <div className="text-on-surface truncate">200</div>
                      </div>
                    </div>
                  </div>

                  {/* Test Case 2 */}
                  <div className="border border-border-subtle rounded-lg p-3 bg-surface-bg relative group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        Test Case #2
                        <EyeOff size={14} className="text-on-surface-variant" />
                      </span>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-500" />
                        <button className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div className="bg-surface-card p-2 rounded border border-border-subtle">
                        <div className="text-outline-variant text-[10px] mb-1 uppercase font-semibold">
                          Input
                        </div>
                        <div className="text-on-surface truncate">
                          10 4\n...
                        </div>
                      </div>
                      <div className="bg-surface-card p-2 rounded border border-border-subtle">
                        <div className="text-outline-variant text-[10px] mb-1 uppercase font-semibold">
                          Output
                        </div>
                        <div className="text-on-surface truncate">350</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add New Test Case Form */}
                <div className="mt-auto pt-4 border-t border-border-subtle border-dashed">
                  <h4 className="text-sm font-bold text-primary mb-2">
                    Add New Test Case
                  </h4>
                  <div className="space-y-2 mb-3">
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-card focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-mono text-xs text-on-surface resize-none outline-none"
                      placeholder="Standard Input"
                      rows={2}
                    />
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-card focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-mono text-xs text-on-surface resize-none outline-none"
                      placeholder="Expected Output"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
                      <input
                        className="rounded border-outline-variant text-secondary focus:ring-secondary"
                        type="checkbox"
                      />
                      Hidden from students
                    </label>
                    <button className="px-3 py-1.5 rounded-lg border border-secondary text-secondary hover:bg-surface-container font-semibold text-sm transition-colors flex items-center gap-1">
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
