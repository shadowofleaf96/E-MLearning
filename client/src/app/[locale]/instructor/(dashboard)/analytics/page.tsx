'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Download,
  GraduationCap,
  TrendingUp,
  Users,
  ArrowUp,
  FileCheck,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { exportToCsv } from '@/lib/exportCsv';

export default function InstructorAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/instructor');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch instructor analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !stats) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <div className="flex-1 px-4 md:px-8 py-8 w-full max-w-container-max mx-auto bg-surface-bg min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline-lg text-primary tracking-tight">
            Student Analytics & Insights
          </h2>
          <p className="text-on-surface-variant mt-1 text-base">
            Track learner progress, engagement, and course performance.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <select className="appearance-none bg-surface-card border border-border-subtle rounded-lg pl-4 pr-10 py-2.5 font-bold text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-secondary w-full cursor-pointer hover:bg-surface-container-low transition-colors shadow-sm outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Quarter</option>
              <option>Year to Date</option>
            </select>
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
            />
          </div>
          <button
            onClick={() => {
              if (stats) {
                exportToCsv(
                  'analytics_overview',
                  [stats],
                  [
                    {
                      header: 'Avg Completion Rate',
                      accessor: (s) => `${s.avgCompletionRate}%`,
                    },
                    {
                      header: 'Daily Active Learners',
                      accessor: (s) => s.dailyActiveLearners,
                    },
                    {
                      header: 'Avg Exam Score',
                      accessor: (s) => s.avgExamScore,
                    },
                    {
                      header: 'Total Learning Hours',
                      accessor: (s) => s.totalLearningHours,
                    },
                  ]
                );
                toast.success('Analytics exported successfully!');
              }
            }}
            className="bg-surface-card border border-border-subtle hover:bg-surface-container-low text-primary rounded-lg px-4 py-2.5 font-bold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Avg Completion Rate */}
        <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Avg. Completion Rate
              </p>
              <h3 className="text-4xl font-black text-primary">
                {stats.avgCompletionRate}
                <span className="text-2xl text-on-surface-variant font-bold">
                  %
                </span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-secondary">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp size={14} />
              <span className="font-bold text-xs">+5.2%</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              vs last month
            </p>
          </div>
        </div>

        {/* Daily Active Learners */}
        <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Daily Active Learners
              </p>
              <h3 className="font-mono text-4xl font-bold text-primary tracking-tight">
                {stats.dailyActiveLearners.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-secondary">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <ArrowUp size={14} />
              <span className="font-bold text-xs">124</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              new today
            </p>
          </div>
        </div>

        {/* Average Exam Score */}
        <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Avg. Exam Score
              </p>
              <h3 className="text-4xl font-black text-primary">
                {stats.avgExamScore}
                <span className="text-xl text-on-surface-variant font-bold">
                  /100
                </span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-secondary">
              <FileCheck size={20} />
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-1.5">
              <span>Distribution</span>
              <span className="text-emerald-600">Top 15% &gt; 90</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex">
              <div className="bg-red-500 h-full" style={{ width: '5%' }}></div>
              <div
                className="bg-amber-400 h-full"
                style={{ width: '15%' }}
              ></div>
              <div
                className="bg-secondary h-full"
                style={{ width: '65%' }}
              ></div>
              <div
                className="bg-emerald-500 h-full"
                style={{ width: '15%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Learning Hours */}
        <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Total Learning Hours
              </p>
              <h3 className="font-mono text-4xl font-bold text-primary tracking-tight">
                {stats.totalLearningHours.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-secondary">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto relative z-10">
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp size={14} />
              <span className="font-bold text-xs">+18%</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              MoM Growth
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart: Active Learners */}
        <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-primary">
              Active Learners Over Time
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold rounded-md bg-blue-50 text-secondary border border-blue-200">
                Daily
              </button>
              <button className="px-3 py-1.5 text-xs font-bold rounded-md text-on-surface-variant hover:bg-surface-container transition-colors">
                Weekly
              </button>
            </div>
          </div>
          {/* Chart Placeholder Area */}
          <div className="relative h-[300px] w-full border-b border-l border-border-subtle pt-4 pr-4 ml-6">
            {/* Y Axis Labels */}
            <div className="absolute -left-10 h-full flex flex-col justify-between text-[10px] text-on-surface-variant font-mono py-2 font-medium">
              <span>2.5k</span>
              <span>2.0k</span>
              <span>1.5k</span>
              <span>1.0k</span>
              <span>0.5k</span>
              <span>0</span>
            </div>
            {/* Grid Lines */}
            <div className="absolute inset-0 pt-4 pr-4 flex flex-col justify-between z-0">
              <div className="w-full border-t border-border-subtle/50 h-0"></div>
              <div className="w-full border-t border-border-subtle/50 h-0"></div>
              <div className="w-full border-t border-border-subtle/50 h-0"></div>
              <div className="w-full border-t border-border-subtle/50 h-0"></div>
              <div className="w-full border-t border-border-subtle/50 h-0"></div>
            </div>
            {/* SVG Line Graph */}
            <svg
              className="absolute inset-0 pt-4 pr-4 pl-1 pb-1 w-full h-full z-10"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M0,80 C10,75 20,85 30,60 C40,35 50,50 60,30 C70,10 80,40 90,20 L100,10"
                fill="none"
                stroke="#0058be"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M0,80 C10,75 20,85 30,60 C40,35 50,50 60,30 C70,10 80,40 90,20 L100,10 L100,100 L0,100 Z"
                fill="url(#gradient-blue)"
                opacity="0.15"
              ></path>
              <defs>
                <linearGradient id="gradient-blue" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0058be" stopOpacity="1"></stop>
                  <stop
                    offset="100%"
                    stopColor="#0058be"
                    stopOpacity="0"
                  ></stop>
                </linearGradient>
              </defs>
              <circle
                cx="30"
                cy="60"
                r="1.5"
                fill="#fff"
                stroke="#0058be"
                strokeWidth="1"
              ></circle>
              <circle
                cx="60"
                cy="30"
                r="1.5"
                fill="#fff"
                stroke="#0058be"
                strokeWidth="1"
              ></circle>
              <circle
                cx="90"
                cy="20"
                r="1.5"
                fill="#fff"
                stroke="#0058be"
                strokeWidth="1"
              ></circle>
            </svg>
          </div>
          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-on-surface-variant font-mono font-medium mt-3 pl-8">
            <span>May 1</span>
            <span>May 8</span>
            <span>May 15</span>
            <span>May 22</span>
            <span>May 29</span>
          </div>
        </div>

        {/* Secondary Chart: Module Drop-off */}
        <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm lg:col-span-1 flex flex-col">
          <h3 className="text-xl font-bold text-primary mb-6">
            Module Completion Dist.
          </h3>
          <div className="flex-1 flex flex-col justify-end gap-4 h-[300px]">
            {stats.moduleCompletionDistribution.map((mod: any, idx: number) => {
              const colors = [
                'bg-secondary',
                'bg-blue-600',
                'bg-blue-500',
                'bg-amber-500',
                'bg-blue-300',
              ];
              const color = mod.hasInsight
                ? 'bg-amber-500'
                : colors[idx % colors.length];
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-12 text-right font-mono text-[11px] text-on-surface-variant font-medium">
                    {mod.label}
                  </span>
                  <div
                    className={`flex-1 h-6 bg-surface-container rounded-r-md overflow-hidden relative ${mod.hasInsight ? 'group' : ''}`}
                  >
                    <div
                      className={`absolute top-0 left-0 h-full ${color} rounded-r-md`}
                      style={{ width: `${mod.percentage}%` }}
                    ></div>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white z-10 drop-shadow-sm">
                      {mod.percentage}%
                    </span>
                    {mod.hasInsight && (
                      <div className="absolute right-0 top-0 w-2 h-2 bg-red-500 rounded-full animate-pulse -mt-1 -mr-1"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deep-Dive and Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Courses Table */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-bold text-primary">
              Course Performance
            </h3>
            <button className="text-sm font-bold text-secondary hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Enrolled
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Completion
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Avg Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {stats.coursePerformance.map((course: any) => {
                  const color =
                    course.completionRate > 70
                      ? 'bg-emerald-500'
                      : course.completionRate > 50
                        ? 'bg-amber-500'
                        : 'bg-red-500';
                  return (
                    <tr
                      key={course.id}
                      className="hover:bg-surface-container-lowest transition-colors"
                    >
                      <td className="py-4 px-6 font-bold text-primary">
                        {course.title}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-sm">
                        {course.enrolled.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-bold text-sm">
                            {course.completionRate}%
                          </span>
                          <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div
                              className={`${color} h-full`}
                              style={{ width: `${course.completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-sm font-bold">
                        {course.avgScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 shadow-lg lg:col-span-1 text-white flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Sparkles size={20} className="text-amber-400" />
            <h3 className="text-xl font-bold">Automated Insights</h3>
          </div>
          <div className="space-y-4 flex-1">
            {stats.insights.map((insight: any) => {
              const colors: Record<string, string> = {
                error: 'bg-red-500',
                success: 'bg-emerald-500',
                warning: 'bg-amber-500',
              };
              const textColors: Record<string, string> = {
                error: 'text-red-400',
                success: 'text-emerald-400',
                warning: 'text-amber-400',
              };
              const color = colors[insight.type] || 'bg-blue-500';
              const textColor = textColors[insight.type] || 'text-blue-400';

              return (
                <div
                  key={insight.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${color}`}
                  ></div>
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`font-bold text-[10px] uppercase tracking-wider ${textColor}`}
                    >
                      {insight.title}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {insight.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed mb-3">
                    {insight.description}
                  </p>
                  {insight.type === 'error' && (
                    <button className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                      Review Questions <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
