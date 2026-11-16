'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  School,
  ArrowLeft,
  Settings,
  Palette,
  Globe,
  ExternalLink,
  CheckCircle,
  BarChart3,
  Sliders,
} from 'lucide-react';
import api from '@/services/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { toast } from 'react-toastify';

export default function SuperAdminTenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchTenantDetails() {
      try {
        const res = await api.get(`/super-admin/tenants/${tenantId}`);
        if (res.data?.data) {
          setTenant(res.data.data);
        } else {
          toast.error('Tenant not found');
        }
      } catch (err) {
        toast.error('Failed to load tenant workspace details');
      } finally {
        setLoading(false);
      }
    }
    fetchTenantDetails();
  }, [tenantId]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen pb-12">
      {/* Top Banner: Inspection Header */}
      <div className="bg-secondary text-white p-4 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl">👁️</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-fixed">
              Super Admin Inspection Mode
            </p>
            <h2 className="font-headline-md text-lg font-bold">
              Viewing Tenant Workspace:{' '}
              <span className="underline decoration-secondary-fixed">
                {tenant?.name}
              </span>
            </h2>
          </div>
        </div>
        <button
          onClick={() => router.push('/super-admin/tenants')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-white/20 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit to Super Admin Portal
        </button>
      </div>

      {/* Tenant Header Info */}
      <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xl uppercase">
            {tenant?.slug?.substring(0, 2) || 'TN'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">
                {tenant?.name}
              </h1>
              <span className="px-3 py-1 bg-tertiary-fixed/30 text-[#009668] text-xs font-bold rounded-full uppercase">
                {tenant?.subscriptionPlan || 'PROFESSIONAL'} TIER
              </span>
            </div>
            <p className="text-xs font-medium text-on-surface-variant mt-1 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              Domain:{' '}
              <span className="font-mono text-secondary font-bold">
                {tenant?.domain || `${tenant?.slug}.lms.com`}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={`http://${tenant?.domain || `${tenant?.slug}.lms.com`}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 border border-border-subtle rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-highest text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-secondary" />
            Visit Live Site
          </a>
        </div>
      </div>

      {/* Inspection Navigation Tabs */}
      <div className="flex border-b border-border-subtle mb-6 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'overview'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'users'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Users className="w-4 h-4" />
          Tenant Users ({tenant?._count?.users ?? tenant?.usersCount ?? 0})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'courses'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <School className="w-4 h-4" />
          Courses ({tenant?._count?.courses ?? tenant?.coursesCount ?? 0})
        </button>
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'branding'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Palette className="w-4 h-4" />
          White-label Branding
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 focus:outline-none ${
            activeTab === 'settings'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Settings className="w-4 h-4" />
          Quota &amp; Settings
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Active Users
            </h3>
            <p className="text-3xl font-bold text-on-surface">
              {tenant?._count?.users ?? tenant?.usersCount ?? 0}
            </p>
            <p className="text-xs text-[#009668] font-bold mt-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Normal capacity
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Published Courses
            </h3>
            <p className="text-3xl font-bold text-on-surface">
              {tenant?._count?.courses ?? tenant?.coursesCount ?? 0}
            </p>
            <p className="text-xs text-secondary font-bold mt-2 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> High engagement
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Subscription Status
            </h3>
            <p className="text-3xl font-bold text-on-surface capitalize">
              {tenant?.subscriptionPlan || 'Professional'}
            </p>
            <p className="text-xs text-outline font-bold mt-2">
              Billed Annually ($499/mo)
            </p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-surface-card p-8 rounded-2xl border border-border-subtle shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Sliders className="w-8 h-8 text-secondary" />
            <div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                Tenant Settings
              </h3>
              <p className="text-sm font-medium text-on-surface-variant">
                Configure feature flags and global settings for this tenant.
              </p>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between p-4 border border-border-subtle rounded-xl bg-surface-container-lowest">
              <div>
                <h4 className="font-bold text-on-surface">
                  Enable Paid Courses
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Allow instructors in this tenant to set custom prices for
                  their courses.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={tenant?.hasPaidCourses || false}
                  onChange={async (e) => {
                    const newValue = e.target.checked;
                    setTenant({ ...tenant, hasPaidCourses: newValue });
                    try {
                      await api.put(`/super-admin/tenants/${tenantId}`, {
                        hasPaidCourses: newValue,
                      });
                      toast.success(
                        `Paid courses ${newValue ? 'enabled' : 'disabled'}`
                      );
                    } catch (err) {
                      toast.error('Failed to update paid courses setting');
                      setTenant({ ...tenant, hasPaidCourses: !newValue }); // Revert on failure
                    }
                  }}
                />
                <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && activeTab !== 'settings' && (
        <div className="bg-surface-card p-8 rounded-2xl border border-border-subtle shadow-sm text-center">
          <Sliders className="w-10 h-10 text-secondary mx-auto mb-3" />
          <h3 className="font-headline-md text-xl font-bold text-on-surface">
            Managing {activeTab.toUpperCase()} for {tenant?.name}
          </h3>
          <p className="text-sm font-medium text-on-surface-variant mt-1 max-w-md mx-auto">
            Super Admin inspection controls active. You have full oversight of
            this tenant's {activeTab} parameters and configuration. this
            tenant&apos;s {activeTab} parameters and configuration.
          </p>
        </div>
      )}
    </div>
  );
}
