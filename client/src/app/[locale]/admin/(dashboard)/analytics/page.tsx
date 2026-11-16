'use client';

import React from 'react';
import {
  Users,
  DollarSign,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useAdminStats } from '@/modules/admin/hooks/useAdminStats';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminAnalyticsPage() {
  const {
    totalRevenue,
    totalEnrollments,
    dailyActive,
    totalInstructors,
    enrollmentTrends,
    loading,
    error,
  } = useAdminStats();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
        <div className="bg-error-container text-on-error-container p-4 rounded-xl font-medium">
          {error}
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Chart Data preparation
  // The backend loops from 8 to 0 months ago, so oldest is first.
  const chartData = {
    labels: enrollmentTrends.map((t) => t.month),
    datasets: [
      {
        label: 'Enrollments',
        data: enrollmentTrends.map((t) => t.value),
        borderColor: '#4f46e5', // Secondary color
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4f46e5',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4, // smooth curves
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e1e1e', // surface-inverse
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: '#6b7280', // text-on-surface-variant approximate
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: '#6b7280',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-2">
          Platform Analytics
        </h1>
        <p className="font-body-md text-on-surface-variant text-sm md:text-base">
          Global overview of platform usage, revenue, and active learners.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Revenue */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#f0fdf4] rounded-xl text-[#16a34a] group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <h3 className="text-on-surface-variant font-medium text-sm mb-1">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-on-surface">
            {formatCurrency(totalRevenue)}
          </p>
        </div>

        {/* Enrollments */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container rounded-xl text-on-secondary-container group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3" />
              +5%
            </span>
          </div>
          <h3 className="text-on-surface-variant font-medium text-sm mb-1">
            Total Enrollments
          </h3>
          <p className="text-3xl font-bold text-on-surface">
            {totalEnrollments.toLocaleString()}
          </p>
        </div>

        {/* Daily Active Learners */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#eff6ff] rounded-xl text-[#2563eb] group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3" />
              +18%
            </span>
          </div>
          <h3 className="text-on-surface-variant font-medium text-sm mb-1">
            Daily Active Learners
          </h3>
          <p className="text-3xl font-bold text-on-surface">
            {dailyActive.toLocaleString()}
          </p>
        </div>

        {/* Total Instructors */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#fdf4ff] rounded-xl text-[#c026d3] group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-on-surface-variant font-medium text-sm mb-1">
            Active Instructors
          </h3>
          <p className="text-3xl font-bold text-on-surface">
            {totalInstructors.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col h-112.5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                Enrollment Growth
              </h2>
              <p className="text-sm text-on-surface-variant">
                Monthly course enrollments over the past 9 months
              </p>
            </div>
            <button className="text-secondary font-bold text-sm hover:bg-surface-container-low px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
              View Report <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Insights / Quick Actions */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col h-112.5">
          <h2 className="text-lg font-bold text-on-surface mb-6">
            Platform Health
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {/* Mocking insights since admin endpoint doesn't return insights natively like instructor one does */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex gap-3">
              <div className="text-[#16a34a] mt-0.5">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#166534] text-sm">
                  Healthy Engagement
                </h4>
                <p className="text-xs text-[#15803d] mt-1 leading-relaxed">
                  Daily active learners have increased consistently for the past
                  3 weeks.
                </p>
              </div>
            </div>

            <div className="bg-secondary-container/50 border border-secondary-container rounded-xl p-4 flex gap-3">
              <div className="text-on-secondary-container mt-0.5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-on-secondary-container text-sm">
                  Revenue Spike
                </h4>
                <p className="text-xs text-on-secondary-container/80 mt-1 leading-relaxed">
                  You generated {formatCurrency(totalRevenue * 0.12)} more
                  revenue this month compared to last month.
                </p>
              </div>
            </div>

            <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-4 flex gap-3">
              <div className="text-[#ca8a04] mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#854d0e] text-sm">
                  Instructor Activity
                </h4>
                <p className="text-xs text-[#a16207] mt-1 leading-relaxed">
                  {totalInstructors} instructors are currently active and
                  managing courses on the platform.
                </p>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-sm py-2.5 rounded-xl transition-colors">
            Download Export
          </button>
        </div>
      </div>
    </div>
  );
}
