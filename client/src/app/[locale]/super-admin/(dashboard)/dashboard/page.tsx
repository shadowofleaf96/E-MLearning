'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  TrendingUp,
  CreditCard,
  Users,
  Server,
  Activity,
  Video,
  MoreHorizontal,
  Building,
  ArrowUpCircle,
  AlertTriangle,
} from 'lucide-react';
import { useSuperAdminStats } from '@/modules/super-admin/hooks/useSuperAdminStats';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SuperAdminDashboardPage() {
  const {
    totalTenants,
    totalActiveUsers,
    totalRevenue,
    tenantGrowthTrend,
    infraHealth,
    activeNode,
    serverLoad,
    activeLiveSessions,
    subscriptionTiers,
    recentEvents,
    loading,
    error,
  } = useSuperAdminStats();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-error">
        Error loading statistics: {error}
      </div>
    );
  }

  const formatRevenue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Global KPIs (4 Grid Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {/* Total Tenants */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-container rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors text-on-surface-variant">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="flex items-center text-on-tertiary-container font-bold text-xs bg-on-tertiary-container/10 px-2.5 py-1 rounded-lg gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +8%
            </span>
          </div>
          <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            Total Tenants
          </h3>
          <p className="font-headline-lg text-3xl font-bold mt-1 text-on-surface">
            {totalTenants}
          </p>
          <div className="w-full bg-surface-container h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-secondary h-full w-[72%] rounded-full"></div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-container rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors text-on-surface-variant">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-on-surface-variant font-bold text-xs">
              vs last mo.
            </span>
          </div>
          <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            Platform Revenue
          </h3>
          <p className="font-headline-lg text-3xl font-bold mt-1 text-on-surface">
            {formatRevenue(totalRevenue)}
          </p>
          <p className="text-sm font-medium text-on-tertiary-container mt-2">
            Monthly trend
          </p>
        </div>

        {/* Total Active Users */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-container rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors text-on-surface-variant">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            Active Users
          </h3>
          <p className="font-headline-lg text-3xl font-bold mt-1 text-on-surface">
            {formatNumber(totalActiveUsers)}
          </p>
          <p className="text-sm font-medium text-on-surface-variant mt-2">
            Distributed globally
          </p>
        </div>

        {/* Infrastructure Health */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-container rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors text-on-surface-variant">
              <Server className="w-6 h-6" />
            </div>
            <span className="flex items-center text-on-tertiary-container font-bold text-xs bg-on-tertiary-container/20 px-3 py-1 rounded-lg animate-pulse">
              ONLINE
            </span>
          </div>
          <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            Infra Health
          </h3>
          <p className="font-headline-lg text-3xl font-bold mt-1 text-on-surface">
            {infraHealth}
          </p>
          <p className="text-sm font-medium text-on-surface-variant mt-2">
            Active Node: {activeNode}
          </p>
        </div>
      </section>

      {/* Middle Section: Growth & Health */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {/* New Tenant Onboarding Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-border-subtle shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                Tenant Growth
              </h3>
              <p className="text-on-surface-variant font-medium text-sm mt-1">
                New institution registrations over the last 6 months
              </p>
            </div>
            <select className="bg-surface-container-low border border-border-subtle rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-secondary outline-none cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>

          <div className="relative h-64 w-full flex items-end justify-between gap-4 px-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              <div className="border-b border-border-subtle w-full h-0"></div>
              <div className="border-b border-border-subtle w-full h-0"></div>
              <div className="border-b border-border-subtle w-full h-0"></div>
              <div className="border-b border-border-subtle w-full h-0"></div>
            </div>

            {/* Chart Bars */}
            {tenantGrowthTrend.length > 0 ? (
              tenantGrowthTrend.map((item, index) => {
                const maxVal = Math.max(
                  ...tenantGrowthTrend.map((t) => t.value),
                  1
                );
                const heightPercentage = Math.max(
                  (item.value / maxVal) * 100,
                  5
                ); // min 5% height
                const isLast = index === tenantGrowthTrend.length - 1;
                return (
                  <div
                    key={item.month}
                    className="flex flex-col items-center gap-3 z-10 w-full group h-full justify-end"
                  >
                    <div
                      className={`w-full rounded-t-xl transition-all ${isLast ? 'bg-secondary shadow-lg' : 'bg-secondary-fixed group-hover:bg-secondary'}`}
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    <span
                      className={`font-bold text-xs ${isLast ? 'text-secondary' : 'text-on-surface-variant'}`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center text-on-surface-variant font-medium z-10 h-full pb-8">
                No growth data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Revenue by Tier */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-border-subtle flex flex-col shadow-sm">
          <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
            Subscription Tiers
          </h3>
          <p className="text-on-surface-variant font-medium text-sm mb-8">
            Revenue distribution by institutional tier
          </p>

          <div className="flex-1 flex flex-col justify-center space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-on-surface">
                <span>Enterprise</span>
                <span>{subscriptionTiers?.enterprise || 0}%</span>
              </div>
              <div className="w-full h-3.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-container rounded-full"
                  style={{ width: `${subscriptionTiers?.enterprise || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-on-surface">
                <span>Pro</span>
                <span>{subscriptionTiers?.pro || 0}%</span>
              </div>
              <div className="w-full h-3.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: `${subscriptionTiers?.pro || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-on-surface">
                <span>Starter</span>
                <span>{subscriptionTiers?.starter || 0}%</span>
              </div>
              <div className="w-full h-3.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary-fixed-dim rounded-full"
                  style={{ width: `${subscriptionTiers?.starter || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-subtle flex justify-between items-center">
            <span className="text-sm font-medium text-on-surface-variant">
              Total Tiers: 3
            </span>
            <button className="text-secondary font-bold text-sm hover:underline focus:outline-none">
              View Breakdown
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Section: Infrastructure & Sessions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Global Server Load */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-6 h-6 text-secondary" />
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                Server Load
              </h3>
            </div>

            <div className="space-y-8 flex-1 justify-center flex flex-col">
              <div>
                <div className="flex justify-between mb-2 text-on-surface">
                  <span className="font-mono font-bold text-xs uppercase text-on-surface-variant">
                    CPU Utilization
                  </span>
                  <span className="font-mono font-bold text-xs text-on-surface">
                    {serverLoad?.cpu || 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-on-tertiary-container rounded-full"
                    style={{ width: `${serverLoad?.cpu || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono font-bold text-xs uppercase text-on-surface-variant">
                    RAM Usage
                  </span>
                  <span className="font-mono font-bold text-xs text-on-surface">
                    {serverLoad?.ram || 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-xp-gold rounded-full"
                    style={{ width: `${serverLoad?.ram || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono font-bold text-xs uppercase text-on-surface-variant">
                    Storage
                  </span>
                  <span className="font-mono font-bold text-xs text-on-surface">
                    {serverLoad?.storage || '0 TB'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${serverLoad?.storagePercent || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Live Sessions */}
          <div className="bg-primary-container text-white p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="absolute -right-8 -top-8 opacity-10">
              <Video className="w-48 h-48" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-on-tertiary-container rounded-full animate-ping"></span>
                <span className="font-bold text-xs uppercase tracking-widest text-on-primary-container">
                  Live Sessions
                </span>
              </div>
              <p className="font-headline-lg text-5xl font-bold">
                {activeLiveSessions}
              </p>
            </div>

            <div className="mt-8 md:mt-0 relative z-10">
              <p className="text-sm font-medium text-on-primary-container mb-6">
                Simultaneous classes in progress across all nodes.
              </p>
              <Link
                href={`/${locale}/super-admin/analytics`}
                className="w-full flex items-center justify-center py-3.5 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary-container"
              >
                Monitor Traffic
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Critical Events / System Logs */}
        <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle flex flex-col overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-border-subtle flex justify-between items-center bg-surface-bg">
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Critical Events
            </h3>
            <button className="p-2 hover:bg-surface-container rounded-lg transition-colors focus:outline-none text-on-surface-variant">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="divide-y divide-border-subtle flex-1 flex flex-col">
            {recentEvents?.map((event) => (
              <div
                key={event.id}
                className="px-6 py-5 flex gap-4 hover:bg-surface-container-low transition-colors cursor-pointer group flex-1"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    event.type === 'alert'
                      ? 'bg-streak-orange/10 text-streak-orange'
                      : event.type === 'update'
                        ? 'bg-on-tertiary-container/10 text-on-tertiary-container'
                        : 'bg-secondary/10 text-secondary'
                  }`}
                >
                  {event.type === 'alert' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : event.type === 'update' ? (
                    <ArrowUpCircle className="w-6 h-6" />
                  ) : (
                    <Building className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-sm text-on-surface group-hover:text-secondary transition-colors line-clamp-1">
                      {event.title}
                    </p>
                    <span className="text-on-surface-variant font-bold text-xs shrink-0 mt-0.5">
                      {event.time}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant mt-1 line-clamp-1">
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
            {(!recentEvents || recentEvents.length === 0) && (
              <div className="px-6 py-8 text-center text-on-surface-variant text-sm font-medium">
                No recent critical events recorded.
              </div>
            )}
          </div>

          <button className="block w-full text-center py-4 text-secondary font-bold text-sm hover:bg-surface-container-low transition-colors border-t border-border-subtle focus:outline-none">
            View Full Audit Logs
          </button>
        </div>
      </section>
    </div>
  );
}
