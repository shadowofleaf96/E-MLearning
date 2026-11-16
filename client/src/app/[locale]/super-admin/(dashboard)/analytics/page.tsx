'use client';

import React from 'react';
import { toast } from 'react-toastify';
import { exportToCsv } from '@/lib/exportCsv';
import {
  ChevronDown,
  Download,
  DollarSign,
  Users,
  ShieldCheck,
  Building2,
  TrendingUp,
  BarChart2,
  Award,
  BookOpen,
} from 'lucide-react';
import { useGlobalAnalytics } from '@/modules/super-admin/hooks/useGlobalAnalytics';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function GlobalAnalyticsPage() {
  const { data, loading, range, setRange } = useGlobalAnalytics();

  const handleExport = () => {
    if (!data) return;
    const exportData = [
      {
        metric: 'Total Platform Revenue',
        value: `$${data.totalRevenue.toLocaleString()}`,
      },
      {
        metric: 'Active Learners',
        value: data.activeLearners.toLocaleString(),
      },
      { metric: 'Avg Completion Rate', value: data.completionRate },
      { metric: 'Total Active Tenants', value: data.activeTenants },
      { metric: 'Enterprise Tier Count', value: data.tiers.enterprise },
      { metric: 'Pro Tier Count', value: data.tiers.pro },
      { metric: 'Starter Tier Count', value: data.tiers.starter },
    ];
    exportToCsv(`global_analytics_${range.replace(/ /g, '_')}`, exportData, [
      { header: 'Metric', accessor: (row) => row.metric },
      { header: 'Value', accessor: (row) => row.value },
    ]);
    toast.success('Analytics report exported successfully!');
  };

  if (loading && !data) {
    return <LoadingSpinner fullScreen />;
  }

  const analytics = data || {
    totalRevenue: 0,
    activeLearners: 0,
    completionRate: '0.0%',
    activeTenants: 0,
    tiers: { enterprise: 0, pro: 0, starter: 0, free: 0 },
    monthlyTrends: [],
    topTenants: [],
    regionalTelemetry: [
      {
        region: 'North America (AWS-US-East)',
        pct: '45%',
        count: '12 Active Nodes',
        top: '32%',
        left: '26%',
      },
      {
        region: 'Europe (AWS-EU-West)',
        pct: '30%',
        count: '8 Active Nodes',
        top: '28%',
        left: '48%',
      },
      {
        region: 'MENA / North Africa (Local Node)',
        pct: '15%',
        count: '4 Active Nodes',
        top: '42%',
        left: '55%',
      },
      {
        region: 'Asia Pacific (AWS-AP-South)',
        pct: '10%',
        count: '2 Active Nodes',
        top: '54%',
        left: '76%',
      },
    ],
    totalNodes: 26,
  };

  // Find maximum values for chart scaling
  const maxTrendVal = Math.max(
    ...analytics.monthlyTrends.map((t) => Math.max(t.revenue, t.enrollment)),
    1
  );

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed min-h-screen">
      {/* Executive Summary Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
            Global Platform Analytics
          </h2>
          <p className="text-on-surface-variant text-sm mt-1 font-medium">
            Consolidated multi-tenant performance metrics directly from live
            database telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="appearance-none flex items-center gap-2 bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-2.5 pr-10 text-sm font-bold cursor-pointer hover:bg-surface-container-low transition-colors shadow-sm outline-none text-on-surface"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="Year to Date">Year to Date</option>
            </select>
            <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-secondary text-white rounded-xl px-5 py-2.5 font-bold hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-sm focus:outline-none"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-on-tertiary-container text-xs font-bold bg-tertiary-fixed-dim/20 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              Annualized
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">
            Total Annual Revenue
          </p>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">
            ${analytics.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-on-surface-variant mt-2 font-medium">
            Based on active tenant subscriptions
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-xp-gold/10 flex items-center justify-center text-xp-gold group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xp-gold text-xs font-bold bg-xp-gold/10 px-2 py-0.5 rounded-full">
              Live DB
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">
            Active Student Learners
          </p>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">
            {analytics.activeLearners.toLocaleString()}
          </h3>
          <p className="text-[11px] text-on-surface-variant mt-2 font-medium">
            Verified platform student accounts
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed-dim/10 flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-on-tertiary-container text-xs font-bold bg-tertiary-fixed-dim/20 px-2 py-0.5 rounded-full">
              Overall
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">
            Course Completion Rate
          </p>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">
            {analytics.completionRate}
          </h3>
          <p className="text-[11px] text-on-surface-variant mt-2 font-medium">
            Completed vs total course enrollments
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-streak-orange/10 flex items-center justify-center text-streak-orange group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-streak-orange text-xs font-bold bg-streak-orange/10 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">
            Total Institutions
          </p>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">
            {analytics.activeTenants}
          </h3>
          <p className="text-[11px] text-on-surface-variant mt-2 font-medium">
            {analytics.tiers.enterprise} Enterprise, {analytics.tiers.pro} Pro
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue vs Enrollment Trends */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-border-subtle shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-headline-md text-xl font-bold text-on-surface">
                Revenue &amp; Enrollment Trajectory
              </h4>
              <p className="text-sm font-medium text-on-surface-variant mt-0.5">
                Multi-month scaling analytics ({range})
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Revenue
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Enrollments
                </span>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {analytics.monthlyTrends.map((data, i) => {
              const revPercent = Math.min(
                Math.round((data.revenue / maxTrendVal) * 100),
                100
              );
              const enrollPercent = Math.min(
                Math.round((data.enrollment / maxTrendVal) * 100),
                100
              );
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  <div className="w-full flex gap-1 items-end justify-center h-full">
                    <div
                      className="bg-outline-variant/40 w-3 rounded-t-sm group-hover:bg-outline-variant transition-colors"
                      style={{ height: `${Math.max(10, enrollPercent)}%` }}
                      title={`Enrollments: ${data.enrollment}`}
                    ></div>
                    <div
                      className="bg-secondary w-3 rounded-t-sm group-hover:opacity-80 transition-opacity"
                      style={{ height: `${Math.max(15, revPercent)}%` }}
                      title={`Revenue: $${data.revenue}`}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">
                    {data.m}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tenant Plan Tier Breakdown */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-border-subtle shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-headline-md text-xl font-bold text-on-surface">
                Plan Tier Share
              </h4>
              <BarChart2 className="w-5 h-5 text-on-surface-variant" />
            </div>
            <p className="text-sm font-medium text-on-surface-variant mb-6">
              Distribution of active institutions by tier
            </p>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-bold text-on-surface mb-1">
                  <span>Enterprise</span>
                  <span>{analytics.tiers.enterprise}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all"
                    style={{
                      width: `${(analytics.tiers.enterprise / Math.max(analytics.activeTenants, 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-on-surface mb-1">
                  <span>Pro Tiers</span>
                  <span>{analytics.tiers.pro}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-xp-gold h-full rounded-full transition-all"
                    style={{
                      width: `${(analytics.tiers.pro / Math.max(analytics.activeTenants, 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-on-surface mb-1">
                  <span>Starter Tiers</span>
                  <span>{analytics.tiers.starter}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-on-tertiary-container h-full rounded-full transition-all"
                    style={{
                      width: `${(analytics.tiers.starter / Math.max(analytics.activeTenants, 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border-subtle mt-6 flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span>Total Active Workspace Nodes</span>
            <span className="text-secondary">
              {analytics.activeTenants} Nodes
            </span>
          </div>
        </div>
      </div>

      {/* Top Performing Institutions List */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-border-subtle shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-headline-md text-xl font-bold text-on-surface">
              Top Active Institutions
            </h4>
            <p className="text-sm font-medium text-on-surface-variant mt-0.5">
              Workspaces ranked by member count and active curriculum
            </p>
          </div>
          <Award className="w-6 h-6 text-xp-gold" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.topTenants.map((tenant) => (
            <div
              key={tenant.id}
              className="p-5 border border-border-subtle rounded-xl bg-surface-bg hover:bg-surface-container-low transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold uppercase text-sm">
                  {tenant.name.substring(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface">
                    {tenant.name}
                  </p>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    {tenant.subscriptionPlan}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs font-medium text-on-surface-variant">
                <div className="flex items-center gap-1 justify-end font-bold text-on-surface">
                  <Users className="w-3.5 h-3.5 text-secondary" />
                  <span>{tenant._count.users}</span>
                </div>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <BookOpen className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span>{tenant._count.courses} Courses</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Node Distribution & World Map */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-border-subtle shadow-sm mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="font-headline-md text-xl font-bold text-on-surface">
              Global Distribution &amp; Node Telemetry
            </h4>
            <p className="text-sm font-medium text-on-surface-variant mt-0.5">
              Active traffic distribution across global server clusters
            </p>
          </div>
          <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Live Clusters
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/3 space-y-4">
            {(analytics.regionalTelemetry || []).map((reg, i) => (
              <div
                key={i}
                className="p-4 border border-border-subtle rounded-xl bg-surface-bg"
              >
                <div className="flex justify-between text-sm font-bold text-on-surface mb-1">
                  <span>{reg.region}</span>
                  <span className="text-secondary">{reg.pct}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="bg-secondary h-full rounded-full transition-all"
                    style={{ width: reg.pct }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">
                  {reg.count}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-2/3">
            <div className="w-full aspect-[2/1] rounded-2xl bg-[#090D1A] overflow-hidden border border-cyan-500/20 relative shadow-2xl group">
              {/* Dark Cyber Mesh Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15),transparent_75%)] pointer-events-none"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

              {/* 100% Scalable Synchronized SVG World Map Canvas */}
              <svg
                className="w-full h-full relative z-10"
                viewBox="0 0 1000 500"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* World Map SVG Vector Image Locked inside 1000x500 Coordinate Space */}
                <image
                  href="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
                  x="0"
                  y="0"
                  width="1000"
                  height="500"
                  preserveAspectRatio="none"
                  className="opacity-35 filter brightness-125 contrast-125"
                />

                {/* Connected Telemetry Arcs */}
                <path
                  d="M 230 150 Q 370 75 510 100"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-pulse opacity-80"
                />
                <path
                  d="M 510 100 Q 525 135 520 170"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-pulse opacity-80"
                />
                <path
                  d="M 520 170 Q 630 220 740 210"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-pulse opacity-80"
                />

                {/* Synchronized Live Node Pins */}
                {(analytics.regionalTelemetry || []).map((pin, i) => {
                  let x = 500;
                  let y = 250;
                  if (pin.region.includes('North America')) {
                    x = 230;
                    y = 150;
                  } else if (pin.region.includes('Europe')) {
                    x = 510;
                    y = 100;
                  } else if (pin.region.includes('MENA')) {
                    x = 520;
                    y = 170;
                  } else if (pin.region.includes('Asia')) {
                    x = 740;
                    y = 210;
                  }

                  return (
                    <g key={i} className="cursor-pointer group/pin">
                      {/* Pulse Ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="#38bdf8"
                        fillOpacity="0.25"
                      >
                        <animate
                          attributeName="r"
                          values="8;20;8"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="fill-opacity"
                          values="0.4;0.1;0.4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Solid Center Pin */}
                      <circle
                        cx={x}
                        cy={y}
                        r="7"
                        fill="#38bdf8"
                        stroke="#020617"
                        strokeWidth="3"
                      />

                      {/* Tooltip Overlay */}
                      <foreignObject
                        x={x - 90}
                        y={y - 55}
                        width="180"
                        height="48"
                        className="overflow-visible pointer-events-none"
                      >
                        <div className="hidden group-hover/pin:flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-white text-[11px] font-bold px-2 py-1 rounded-xl shadow-2xl text-center">
                          <span className="text-cyan-400 text-[9px] uppercase tracking-wider">
                            {pin.region}
                          </span>
                          <span className="text-[11px] font-bold">
                            {pin.count}
                          </span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>

              {/* Responsive Footer Status Bar */}
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[11px] font-mono text-cyan-400/90 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/20 pointer-events-none z-20">
                <span className="flex items-center gap-2 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  LIVE PLATFORM TELEMETRY MESH
                </span>
                <span className="font-bold text-white">
                  TOTAL ACTIVE NODES:{' '}
                  {analytics.totalNodes || analytics.activeTenants}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
