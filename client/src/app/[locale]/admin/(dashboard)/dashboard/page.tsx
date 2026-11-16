'use client';

import React, { useEffect, useState } from 'react';
import {
  Download,
  DollarSign,
  Users,
  Flame,
  UserCheck,
  TrendingUp,
  Minus,
  MoreVertical,
  Megaphone,
} from 'lucide-react';
import { useAdminStats } from '@/modules/admin/hooks/useAdminStats';
import api from '@/services/api';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const notifRes = await api.get('/notifications');
        if (notifRes.data?.data) {
          setNotifications(notifRes.data.data.slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      }
    };
    fetchDashboardData();
  }, []);

  const {
    totalRevenue,
    totalEnrollments,
    dailyActive,
    totalInstructors,
    enrollmentTrends,
    loading,
  } = useAdminStats();

  const handleExport = () => {
    if (loading) return;
    const csvContent =
      'Metric,Value\n' +
      `Total Revenue,${totalRevenue}\n` +
      `Total Enrollments,${totalEnrollments}\n` +
      `Daily Active Students,${dailyActive}\n` +
      `Total Instructors,${totalInstructors}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'tenant_stats.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported successfully');
  };

  const chartData = {
    labels: enrollmentTrends?.map((t) => t.month) || [],
    datasets: [
      {
        label: 'Enrollments',
        data: enrollmentTrends?.map((t) => t.value) || [],
        backgroundColor: '#4338CA', // Primary/Secondary color
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `Enrollments: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
        border: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 11 },
          stepSize: 10,
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 11, weight: 'bold' as const },
        },
      },
    },
  };

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
            Tenant Overview
          </h2>
          <p className="font-body-md text-on-surface-variant mt-1">
            Real-time metrics for your institution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-surface-card border border-border-subtle text-on-surface font-body-sm text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none shadow-sm cursor-pointer">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
          <button
            onClick={handleExport}
            className="p-2 bg-surface-card border border-border-subtle rounded-lg text-on-surface-variant hover:text-secondary hover:border-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* KPI Row (Spans all 12 columns, internal grid of 4) */}
        <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI Card 1 */}
          <div className="bg-surface-card rounded-xl p-5 border border-border-subtle hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-bold text-on-surface">
                {loading ? '...' : `$${(totalRevenue / 1000).toFixed(1)}k`}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-tertiary-fixed-dim text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Live Metrics</span>
            </div>
          </div>

          {/* KPI Card 2 */}
          <div className="bg-surface-card rounded-xl p-5 border border-border-subtle hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Enrollments
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-bold text-on-surface">
                {loading ? '...' : totalEnrollments.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-tertiary-fixed-dim text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Real-time</span>
            </div>
          </div>

          {/* KPI Card 3 */}
          <div className="bg-surface-card rounded-xl p-5 border border-border-subtle hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Daily Active Students
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-bold text-on-surface">
                {loading ? '...' : dailyActive.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-tertiary-fixed-dim text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>24h Window</span>
            </div>
          </div>

          {/* KPI Card 4 */}
          <div className="bg-surface-card rounded-xl p-5 border border-border-subtle hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Instructors
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-bold text-on-surface">
                {loading ? '...' : totalInstructors}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-on-surface-variant text-sm font-medium">
              <Minus className="w-4 h-4" />
              <span>Unchanged</span>
            </div>
          </div>
        </div>

        {/* Main Chart Area (Spans 8 cols on large) */}
        <div className="md:col-span-8 bg-surface-card rounded-xl border border-border-subtle p-6 flex flex-col min-h-100 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Enrollment Trends
            </h3>
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="p-2 rounded-full text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors focus:outline-none">
                <MoreVertical className="w-5 h-5" />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right bg-surface-card border border-border-subtle rounded-xl shadow-lg focus:outline-none z-10 p-1">
                <MenuItem>
                  {({ active }: { active: boolean }) => (
                    <button
                      onClick={handleExport}
                      className={`${
                        active
                          ? 'bg-surface-container-low text-secondary'
                          : 'text-on-surface'
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors`}
                    >
                      Download CSV
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          {/* Chart */}
          <div className="flex-1 relative w-full pt-4">
            {loading ? (
              <LoadingSpinner size="md" fullScreen />
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Action Center / Quick Tasks (Spans 4 cols on large) */}
        <div className="md:col-span-4 bg-surface-card rounded-xl border border-border-subtle p-6 flex flex-col min-h-100">
          <h3 className="font-headline-md text-xl font-bold text-on-surface mb-6">
            System Alerts
          </h3>

          <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 rounded-xl bg-surface-container-low border border-border-subtle flex gap-4 items-start"
                >
                  <div
                    className={`text-on-surface p-2 rounded-lg shrink-0 ${notif.isRead ? 'bg-surface-container-high' : 'bg-secondary text-white'}`}
                  >
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface mb-1">
                      {notif.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wide mt-2 block font-semibold">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-on-surface-variant border border-dashed border-border-subtle rounded-xl h-full flex items-center justify-center">
                No recent system alerts.
              </div>
            )}
          </div>

          <Link href={`/${locale}/admin/notifications-management`}>
            <button className="mt-6 w-full py-2.5 rounded-lg border border-border-subtle font-bold text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer">
              View All Notifications
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
