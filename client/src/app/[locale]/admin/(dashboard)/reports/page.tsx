'use client';

import React from 'react';
import {
  Calendar,
  TrendingUp,
  Settings2,
  FileText,
  Sparkles,
} from 'lucide-react';
import api from '@/services/api';
import { exportToCSV } from '@/utils/exportToCSV';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AdminReportsPage() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [exportFormat, setExportFormat] = React.useState<'csv' | 'pdf'>('csv');
  const currentMonth = new Date().toISOString().slice(0, 7);
  const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6))
    .toISOString()
    .slice(0, 7);

  const [startDate, setStartDate] = React.useState(sixMonthsAgo);
  const [endDate, setEndDate] = React.useState(currentMonth);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/admin');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch admin analytics:', error);
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
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
            Institutional Reports
          </h2>
          <p className="text-on-surface-variant font-medium text-sm md:text-base mt-1">
            Detailed scholastic performance and financial auditing insights.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-secondary text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
          <Calendar className="w-5 h-5" />
          Schedule Report
        </button>
      </div>

      {/* High-level Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Growth Widget */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                Total Enrollments
              </p>
              <h3 className="font-headline-md text-2xl font-bold mt-1 text-on-surface">
                {stats?.totalEnrollments?.toLocaleString() || 0}
              </h3>
            </div>
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Active
            </span>
          </div>
          {/* Mini Sparkline Placeholder using CSS Gradients */}
          <div className="h-16 w-full bg-linear-to-r from-secondary/5 to-secondary/20 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-end">
              <div className="w-full h-0.5 bg-secondary/30 transform -translate-y-2.5"></div>
              <div
                className="absolute bottom-0 left-0 right-0 h-8 bg-secondary/10"
                style={{
                  clipPath:
                    'polygon(0 100%, 10% 80%, 20% 90%, 30% 60%, 40% 75%, 50% 40%, 60% 55%, 70% 30%, 80% 45%, 90% 20%, 100% 100%)',
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Completion Widget */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow flex items-center gap-6">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-surface-container"
                cx="40"
                cy="40"
                fill="transparent"
                r="34"
                stroke="currentColor"
                strokeWidth="8"
              ></circle>
              <circle
                className="text-secondary transition-all duration-1000 ease-out"
                cx="40"
                cy="40"
                fill="transparent"
                r="34"
                stroke="currentColor"
                strokeDasharray="213.6"
                strokeDashoffset={
                  213.6 - (213.6 * (stats?.avgCourseCompletion || 0)) / 100
                }
                strokeWidth="8"
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-sm text-on-surface">
                {stats?.avgCourseCompletion || 0}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              Avg Course Completion
            </p>
            <h3 className="font-headline-md text-xl font-bold mt-1 text-on-surface">
              {(stats?.avgCourseCompletion || 0) > 80
                ? 'High Accuracy'
                : (stats?.avgCourseCompletion || 0) > 50
                  ? 'Moderate'
                  : 'Needs Review'}
            </h3>
            <p className="text-on-surface-variant font-medium text-xs mt-1">
              Average across all cohorts
            </p>
          </div>
        </div>

        {/* Revenue Widget */}
        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="font-headline-md text-2xl font-bold mt-1 text-on-surface">
                ${stats?.totalRevenue?.toLocaleString() || 0}
              </h3>
            </div>
            <span className="text-on-surface-variant font-bold text-xs">
              Last 6 Months
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {(stats?.revenueTrends?.slice(-6) || []).map(
              (trend: any, idx: number, arr: any[]) => {
                const maxRev = Math.max(...arr.map((a) => a.value), 1); // avoid / 0
                const heightPct = Math.max((trend.value / maxRev) * 100, 5); // min 5%
                const isLast = idx === arr.length - 1;
                return (
                  <div
                    key={idx}
                    title={`${trend.month}: $${trend.value}`}
                    className={`flex-1 rounded-t-sm transition-all duration-500 ease-out ${isLast ? 'bg-secondary shadow-[0_0_10px_rgba(0,88,190,0.3)]' : 'bg-surface-container-high'}`}
                    style={{ height: `${heightPct}%` }}
                  ></div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Custom Report Generator Card */}
      <div className="bg-surface-card p-8 rounded-2xl border border-border-subtle shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
            <Settings2 className="w-6 h-6" />
          </div>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">
            Generate Custom Report
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="font-bold text-xs text-on-surface-variant">
              Report Type
            </label>
            <select
              id="reportType"
              className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary outline-none transition-all cursor-pointer"
            >
              <option value="enrollment">Enrollment Insights</option>
              <option value="financial">Financial Audit</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-xs text-on-surface-variant">
              Date Range
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  className="w-full bg-surface border border-border-subtle rounded-xl px-3 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary outline-none transition-all"
                  type="month"
                  title="Start Month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <input
                  className="w-full bg-surface border border-border-subtle rounded-xl px-3 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary outline-none transition-all"
                  type="month"
                  title="End Month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-xs text-on-surface-variant">
              Format
            </label>
            <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-xl border border-border-subtle">
              <button
                onClick={() => setExportFormat('csv')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 font-bold text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-all ${
                  exportFormat === 'csv'
                    ? 'bg-white shadow-sm text-secondary border border-border-subtle'
                    : 'text-on-surface-variant hover:bg-white/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => setExportFormat('pdf')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 font-bold text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-all ${
                  exportFormat === 'pdf'
                    ? 'bg-white shadow-sm text-secondary border border-border-subtle'
                    : 'text-on-surface-variant hover:bg-white/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              const selectEl = document.getElementById(
                'reportType'
              ) as HTMLSelectElement;
              const type = selectEl?.value || 'enrollment';

              if (exportFormat === 'pdf') {
                toast.info(
                  'PDF Generation is currently in development. Exporting as CSV instead.',
                  { autoClose: 5000 }
                );
              }

              if (type === 'enrollment') {
                if (
                  !stats?.enrollmentTrends ||
                  stats.enrollmentTrends.length === 0
                ) {
                  toast.error('No enrollment data available to export');
                  return;
                }
                exportToCSV(stats.enrollmentTrends, 'enrollment_report', [
                  { key: 'month', label: 'Month' },
                  { key: 'value', label: 'Total Enrollments' },
                ]);
                toast.success('Enrollment report exported successfully');
              } else if (type === 'financial') {
                if (!stats?.revenueTrends || stats.revenueTrends.length === 0) {
                  toast.error('No financial data available to export');
                  return;
                }
                exportToCSV(stats.revenueTrends, 'financial_audit_report', [
                  { key: 'month', label: 'Month' },
                  { key: 'value', label: 'Revenue ($)' },
                ]);
                toast.success('Financial report exported successfully');
              }
            }}
            className="w-full bg-secondary text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate & Download
          </button>
        </div>
      </div>
    </div>
  );
}
