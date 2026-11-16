'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  ChevronRight,
  Plus,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building,
  Infinity as InfinityIcon,
  ChevronDown,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useSaaSPlans } from '@/modules/super-admin/hooks/useSaaSPlans';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Modal from '@/components/shared/Modal';

export default function SuperAdminPlansPage() {
  const { data, loading, savePlanConfigs, refresh } = useSaaSPlans();

  // Configuration matrix state
  const [formState, setFormState] = useState<any>({
    starter: {
      price: 299,
      capacity: 500,
      storage: 50,
      coding: false,
      whiteLabel: false,
      api: false,
    },
    pro: {
      price: 899,
      capacity: 5000,
      storage: 500,
      coding: true,
      whiteLabel: true,
      api: false,
    },
    enterprise: {
      price: 'Custom',
      capacity: 'Unlimited',
      storage: 5000,
      coding: true,
      whiteLabel: true,
      api: true,
    },
  });

  const [saving, setSaving] = useState(false);

  // Modal state for Create New Plan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    description: '',
    studentCapacity: '1000',
    storageGb: '100',
  });

  useEffect(() => {
    if (data?.plans) {
      setFormState({
        starter: {
          price: data.plans.starter.price,
          capacity: data.plans.starter.studentCapacity,
          storage: data.plans.starter.storageGb,
          coding: data.plans.starter.codingChallenges,
          whiteLabel: data.plans.starter.whiteLabeling,
          api: data.plans.starter.apiAccess,
        },
        pro: {
          price: data.plans.pro.price,
          capacity: data.plans.pro.studentCapacity,
          storage: data.plans.pro.storageGb,
          coding: data.plans.pro.codingChallenges,
          whiteLabel: data.plans.pro.whiteLabeling,
          api: data.plans.pro.apiAccess,
        },
        enterprise: {
          price: data.plans.enterprise.price,
          capacity: data.plans.enterprise.studentCapacity,
          storage: data.plans.enterprise.storageGb,
          coding: data.plans.enterprise.codingChallenges,
          whiteLabel: data.plans.enterprise.whiteLabeling,
          api: data.plans.enterprise.apiAccess,
        },
      });
    }
  }, [data]);

  const handleInputChange = (tier: string, field: string, value: any) => {
    setFormState((prev: any) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePlanConfigs(formState);
      toast.success('SaaS Plan Configurations saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save configurations');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    refresh();
    toast.info('Changes discarded');
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price) {
      toast.error('Please fill in required plan details');
      return;
    }
    toast.success(`New custom plan "${newPlan.name}" created successfully!`);
    setIsModalOpen(false);
    setNewPlan({
      name: '',
      price: '',
      description: '',
      studentCapacity: '1000',
      storageGb: '100',
    });
    refresh();
  };

  if (loading && !data) {
    return <LoadingSpinner fullScreen />;
  }

  const plans = data?.plans || {
    starter: { price: 299, activeTenants: 0, mrr: 0 },
    pro: { price: 899, activeTenants: 0, mrr: 0 },
    enterprise: { price: 'Custom', activeTenants: 0, mrr: 0 },
  };

  const stats = data?.stats || {
    totalTenants: 0,
    starterMrr: 0,
    proMrr: 0,
    enterpriseMrr: 0,
  };

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <nav className="flex items-center gap-2 mb-2 text-on-surface-variant text-xs font-bold">
            <span>Platform</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-secondary">SaaS Plans</span>
          </nav>
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
            SaaS Plans Management
          </h2>
          <p className="text-on-surface-variant font-medium text-sm mt-1">
            Configure global pricing tiers, usage quotas, and feature
            availability powered by live tenant telemetry.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-secondary/90 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          Create New Plan
        </button>
      </div>

      {/* Pricing Tiers Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Starter Plan */}
        <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-md transition-all group flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-tertiary-fixed-dim/20 text-on-tertiary-container rounded-lg text-xs font-bold">
              {plans.starter.activeTenants} Active{' '}
              {plans.starter.activeTenants === 1 ? 'Tenant' : 'Tenants'}
            </span>
          </div>
          <h3 className="font-headline-md text-2xl font-bold mb-1 text-on-surface">
            Starter
          </h3>
          <div className="flex items-baseline gap-1 mb-4 text-on-surface">
            <span className="font-headline-lg text-4xl font-bold">
              ${formState.starter.price}
            </span>
            <span className="text-on-surface-variant text-sm font-medium">
              /month
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-8 flex-1">
            Perfect for small local academies and boutique coaching centers.
          </p>

          <div className="space-y-4 pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              <span className="text-sm font-medium text-on-surface">
                Up to {formState.starter.capacity} Students
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              <span className="text-sm font-medium text-on-surface">
                {formState.starter.storage} GB Storage
              </span>
            </div>
            <div
              className={`flex items-center gap-3 ${!formState.starter.whiteLabel ? 'opacity-50' : ''}`}
            >
              {formState.starter.whiteLabel ? (
                <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              ) : (
                <XCircle className="w-5 h-5 text-on-surface-variant" />
              )}
              <span
                className={`text-sm font-medium ${formState.starter.whiteLabel ? 'text-on-surface' : 'text-on-surface-variant line-through'}`}
              >
                White-labeling
              </span>
            </div>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-primary-container rounded-2xl p-6 border-2 border-secondary shadow-lg relative overflow-hidden group flex flex-col">
          <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
            Popular
          </div>

          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-bold mt-1 mr-16">
              {plans.pro.activeTenants} Active{' '}
              {plans.pro.activeTenants === 1 ? 'Tenant' : 'Tenants'}
            </span>
          </div>
          <h3 className="font-headline-md text-2xl font-bold mb-1 text-white">
            Pro
          </h3>
          <div className="flex items-baseline gap-1 mb-4 text-white">
            <span className="font-headline-lg text-4xl font-bold">
              ${formState.pro.price}
            </span>
            <span className="text-on-primary-container text-sm font-medium">
              /month
            </span>
          </div>
          <p className="text-on-primary-container text-sm font-medium mb-8 flex-1">
            Scalable solution for growing institutions and regional schools.
          </p>

          <div className="space-y-4 pt-6 border-t border-on-primary-fixed-variant">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              <span className="text-sm font-medium text-white">
                Up to {formState.pro.capacity} Students
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              <span className="text-sm font-medium text-white">
                {formState.pro.storage} GB Storage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              <span className="text-sm font-medium text-white">
                White-labeling included
              </span>
            </div>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm hover:shadow-md transition-all group flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface">
              <Building className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-surface-container rounded-lg text-xs font-bold text-on-surface-variant">
              {plans.enterprise.activeTenants} Active{' '}
              {plans.enterprise.activeTenants === 1 ? 'Tenant' : 'Tenants'}
            </span>
          </div>
          <h3 className="font-headline-md text-2xl font-bold mb-1 text-on-surface">
            Enterprise
          </h3>
          <div className="flex items-baseline gap-1 mb-4 text-on-surface">
            <span className="font-headline-lg text-4xl font-bold">
              {formState.enterprise.price}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-8 flex-1">
            Bespoke infrastructure for universities and global franchises.
          </p>

          <div className="space-y-4 pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              <span className="text-sm font-medium text-on-surface">
                Unlimited Students
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              <span className="text-sm font-medium text-on-surface">
                Priority 24/7 Support
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim" />
              <span className="text-sm font-medium text-on-surface">
                API &amp; Webhooks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Configuration Matrix Section */}
      <section className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden shadow-sm mb-16">
        <div className="p-6 border-b border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-bg">
          <div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Plan Configuration Matrix
            </h3>
            <p className="text-xs font-medium text-on-surface-variant mt-0.5">
              Edit pricing, limits, and features in real-time across all tenant
              nodes
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDiscard}
              className="px-4 py-2.5 text-sm font-bold rounded-xl border border-border-subtle hover:bg-surface-container-low transition-colors text-on-surface flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold rounded-xl bg-secondary text-white hover:bg-secondary/90 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Configurations'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-border-subtle">
                  Feature / Limit
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-border-subtle">
                  Starter
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-border-subtle">
                  Pro
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-border-subtle">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {/* Pricing Row */}
              <tr>
                <td className="px-6 py-5 font-bold text-sm text-on-surface">
                  Monthly Price ($)
                </td>
                <td className="px-6 py-5">
                  <input
                    className="w-28 px-3 py-2 bg-surface-bg border border-outline-variant/30 rounded-lg font-mono text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none text-on-surface"
                    type="text"
                    value={formState.starter.price}
                    onChange={(e) =>
                      handleInputChange('starter', 'price', e.target.value)
                    }
                  />
                </td>
                <td className="px-6 py-5">
                  <input
                    className="w-28 px-3 py-2 bg-surface-bg border border-outline-variant/30 rounded-lg font-mono text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none text-on-surface"
                    type="text"
                    value={formState.pro.price}
                    onChange={(e) =>
                      handleInputChange('pro', 'price', e.target.value)
                    }
                  />
                </td>
                <td className="px-6 py-5">
                  <input
                    className="w-28 px-3 py-2 bg-surface-bg border border-outline-variant/30 rounded-lg font-mono text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none text-on-surface"
                    type="text"
                    value={formState.enterprise.price}
                    onChange={(e) =>
                      handleInputChange('enterprise', 'price', e.target.value)
                    }
                  />
                </td>
              </tr>

              {/* Student Limit Row */}
              <tr className="bg-surface-bg/30">
                <td className="px-6 py-5">
                  <p className="font-bold text-sm text-on-surface">
                    Student Capacity
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Max concurrent users
                  </p>
                </td>
                <td className="px-6 py-5">
                  <div className="relative w-32">
                    <select
                      value={formState.starter.capacity}
                      onChange={(e) =>
                        handleInputChange('starter', 'capacity', e.target.value)
                      }
                      className="w-full appearance-none bg-surface-card border border-outline-variant/30 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:ring-2 focus:ring-secondary/20 outline-none cursor-pointer text-on-surface"
                    >
                      <option value="500">500</option>
                      <option value="1000">1,000</option>
                      <option value="2000">2,000</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="relative w-32">
                    <select
                      value={formState.pro.capacity}
                      onChange={(e) =>
                        handleInputChange('pro', 'capacity', e.target.value)
                      }
                      className="w-full appearance-none bg-surface-card border border-outline-variant/30 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:ring-2 focus:ring-secondary/20 outline-none cursor-pointer text-on-surface"
                    >
                      <option value="5000">5,000</option>
                      <option value="10000">10,000</option>
                      <option value="25000">25,000</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <InfinityIcon className="w-5 h-5 text-secondary" />
                    <span className="font-bold text-sm text-on-surface">
                      Unlimited
                    </span>
                  </div>
                </td>
              </tr>

              {/* Storage Row */}
              <tr>
                <td className="px-6 py-5">
                  <p className="font-bold text-sm text-on-surface">
                    Storage Quota
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Video &amp; Document cloud storage
                  </p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <input
                      className="w-20 px-3 py-2 bg-surface-bg border border-outline-variant/30 rounded-lg font-mono text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none text-on-surface"
                      type="number"
                      value={formState.starter.storage}
                      onChange={(e) =>
                        handleInputChange('starter', 'storage', e.target.value)
                      }
                    />
                    <span className="text-xs font-bold text-on-surface-variant">
                      GB
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <input
                      className="w-20 px-3 py-2 bg-surface-bg border border-outline-variant/30 rounded-lg font-mono text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none text-on-surface"
                      type="number"
                      value={formState.pro.storage}
                      onChange={(e) =>
                        handleInputChange('pro', 'storage', e.target.value)
                      }
                    />
                    <span className="text-xs font-bold text-on-surface-variant">
                      GB
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <input
                      className="w-20 px-3 py-2 bg-surface-bg border border-outline-variant/30 rounded-lg font-mono text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none text-on-surface"
                      type="number"
                      value={formState.enterprise.storage}
                      onChange={(e) =>
                        handleInputChange(
                          'enterprise',
                          'storage',
                          e.target.value
                        )
                      }
                    />
                    <span className="text-xs font-bold text-on-surface-variant">
                      GB
                    </span>
                  </div>
                </td>
              </tr>

              {/* Feature Toggles */}
              <tr className="bg-surface-bg/30">
                <td className="px-6 py-5">
                  <p className="font-bold text-sm text-on-surface">
                    Coding Challenges
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Interactive IDE module
                  </p>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.starter.coding}
                      onChange={(e) =>
                        handleInputChange('starter', 'coding', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.pro.coding}
                      onChange={(e) =>
                        handleInputChange('pro', 'coding', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.enterprise.coding}
                      onChange={(e) =>
                        handleInputChange(
                          'enterprise',
                          'coding',
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-5">
                  <p className="font-bold text-sm text-on-surface">
                    White-labeling
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Custom domain &amp; branding
                  </p>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.starter.whiteLabel}
                      onChange={(e) =>
                        handleInputChange(
                          'starter',
                          'whiteLabel',
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.pro.whiteLabel}
                      onChange={(e) =>
                        handleInputChange('pro', 'whiteLabel', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.enterprise.whiteLabel}
                      onChange={(e) =>
                        handleInputChange(
                          'enterprise',
                          'whiteLabel',
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
              </tr>

              <tr className="bg-surface-bg/30">
                <td className="px-6 py-5">
                  <p className="font-bold text-sm text-on-surface">
                    API Access
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Developer tools &amp; integrations
                  </p>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.starter.api}
                      onChange={(e) =>
                        handleInputChange('starter', 'api', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.pro.api}
                      onChange={(e) =>
                        handleInputChange('pro', 'api', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
                <td className="px-6 py-5">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.enterprise.api}
                      onChange={(e) =>
                        handleInputChange('enterprise', 'api', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Real Live Database Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
            Total Active Tenants
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-on-surface">
              {stats.totalTenants}
            </span>
            <span className="text-tertiary-container font-bold text-[10px] bg-tertiary-fixed-dim/20 px-2 py-0.5 rounded-md mb-1">
              Live DB
            </span>
          </div>
        </div>

        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
            Starter MRR Contribution
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-on-surface">
              ${stats.starterMrr.toLocaleString()}
            </span>
            <span className="text-on-surface-variant font-bold text-[10px] mb-1">
              {plans.starter.activeTenants} Subscribed
            </span>
          </div>
        </div>

        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
            Pro MRR Contribution
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-on-surface">
              ${stats.proMrr.toLocaleString()}
            </span>
            <span className="text-secondary-container font-bold text-[10px] bg-secondary-fixed-dim/20 px-2 py-0.5 rounded-md mb-1">
              {plans.pro.activeTenants} Subscribed
            </span>
          </div>
        </div>

        <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
            Enterprise MRR
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-on-surface">
              ${stats.enterpriseMrr.toLocaleString()}
            </span>
            <span className="text-on-surface-variant font-bold text-[10px] mb-1">
              {plans.enterprise.activeTenants} Custom Tiers
            </span>
          </div>
        </div>
      </div>

      {/* Create New SaaS Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New SaaS Tier"
        subtitle="Define a custom plan tier with specialized quotas and features"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Plan Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Growth Tier"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface-bg border border-border-subtle rounded-xl text-sm font-medium outline-none focus:border-secondary text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Monthly Price ($)
              </label>
              <input
                type="number"
                required
                placeholder="499"
                value={newPlan.price}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, price: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-surface-bg border border-border-subtle rounded-xl text-sm font-medium outline-none focus:border-secondary text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Student Capacity
              </label>
              <input
                type="text"
                placeholder="2500"
                value={newPlan.studentCapacity}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, studentCapacity: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-surface-bg border border-border-subtle rounded-xl text-sm font-medium outline-none focus:border-secondary text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Storage Quota (GB)
            </label>
            <input
              type="number"
              placeholder="250"
              value={newPlan.storageGb}
              onChange={(e) =>
                setNewPlan({ ...newPlan, storageGb: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-surface-bg border border-border-subtle rounded-xl text-sm font-medium outline-none focus:border-secondary text-on-surface"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-on-surface-variant border border-border-subtle rounded-xl hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-secondary rounded-xl hover:bg-secondary/90 shadow-sm"
            >
              Create Plan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
