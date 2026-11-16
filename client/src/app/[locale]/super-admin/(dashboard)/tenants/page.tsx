'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Building2,
  Clock,
  Ban,
  CreditCard,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Tag,
  ExternalLink,
  Info,
  Search,
} from 'lucide-react';
import { useTenants } from '@/modules/super-admin/hooks/useTenants';
import { exportToCsv } from '@/lib/exportCsv';
import Modal from '@/components/shared/Modal';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SuperAdminTenantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data,
    loading,
    filteredTenants,
    page,
    setPage,
    search,
    setSearch,
    planFilter,
    setPlanFilter,
    statusFilter,
    setStatusFilter,
    createTenant,
    toggleTenantStatus,
    updateTenantSubscription,
  } = useTenants();

  const [newTenant, setNewTenant] = useState({
    name: '',
    domain: '',
    subscriptionPlan: 'starter',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [planModalTenant, setPlanModalTenant] = useState<{
    id: string;
    name: string;
    currentPlan: string;
  } | null>(null);
  const [selectedNewPlan, setSelectedNewPlan] = useState<string>('starter');

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.domain) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTenant(newTenant);
      toast.success('Tenant workspace launched successfully!');
      setIsModalOpen(false);
      setNewTenant({ name: '', domain: '', subscriptionPlan: 'starter' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleTenantStatus(id, currentStatus);
      toast.success(
        `Tenant ${currentStatus ? 'suspended' : 'activated'} successfully.`
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update tenant status');
    }
  };

  const handleOpenPlanModal = (tenant: {
    id: string;
    name: string;
    subscriptionPlan: string;
  }) => {
    setPlanModalTenant({
      id: tenant.id,
      name: tenant.name,
      currentPlan: tenant.subscriptionPlan,
    });
    setSelectedNewPlan(tenant.subscriptionPlan);
  };

  const handleSaveNewPlan = async () => {
    if (!planModalTenant) return;
    try {
      await updateTenantSubscription(planModalTenant.id, selectedNewPlan);
      toast.success(
        `Subscription plan for ${planModalTenant.name} updated to ${selectedNewPlan.toUpperCase()}!`
      );
      setPlanModalTenant(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update subscription plan');
    }
  };

  const handleExportCsv = () => {
    if (!data?.tenants) return;
    exportToCsv('tenants_export', data.tenants, [
      { header: 'ID', accessor: (row) => row.id },
      { header: 'Institution Name', accessor: (row) => row.name },
      {
        header: 'Domain',
        accessor: (row) => (row.domain ? `${row.domain}.lumina.com` : row.slug),
      },
      { header: 'Plan Type', accessor: (row) => row.subscriptionPlan },
      { header: 'Total Users', accessor: (row) => row._count?.users || 0 },
      {
        header: 'Status',
        accessor: (row) => (row.isActive ? 'Active' : 'Suspended'),
      },
      {
        header: 'Joined Date',
        accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
      },
    ]);
    toast.success('Tenants exported successfully!');
  };

  if (loading && !data) {
    return <LoadingSpinner fullScreen />;
  }

  const totalTenantsCount = data?.total || 0;
  const suspendedCount = data?.tenants.filter((t) => !t.isActive).length || 0;

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed min-h-screen">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
            Tenant Management
          </h2>
          <p className="text-body-md font-medium text-on-surface-variant mt-1 text-sm md:text-base">
            Manage and monitor institution access, billing, and system usage.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-sm w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          <Building2 className="w-5 h-5" />
          Create New Tenant
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle flex flex-col gap-4 group hover:border-secondary/30 transition-all cursor-default shadow-sm hover:shadow-md hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-tertiary-fixed-dim text-xs flex items-center gap-1 font-bold">
              Real-time
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Tenants
            </p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">
              {totalTenantsCount}
            </h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle flex flex-col gap-4 group hover:border-secondary/30 transition-all cursor-default shadow-sm hover:shadow-md hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-xp-gold/10 flex items-center justify-center text-xp-gold">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xp-gold text-xs font-bold">Mocked</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Pending Approvals
            </p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">4</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle flex flex-col gap-4 group hover:border-secondary/30 transition-all cursor-default shadow-sm hover:shadow-md hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-streak-orange/10 flex items-center justify-center text-streak-orange">
              <Ban className="w-5 h-5" />
            </div>
            <span className="text-streak-orange text-xs font-bold">
              Page Stats
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Suspended Accounts
            </p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">
              {suspendedCount}
            </h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle flex flex-col gap-4 group hover:border-secondary/30 transition-all cursor-default shadow-sm hover:shadow-md hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed-dim/10 flex items-center justify-center text-on-tertiary-container">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-on-tertiary-container text-xs font-bold">
              Est. Monthly
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Recurring Revenue
            </p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">
              ${((data?.mrr || 0) / 1000).toFixed(1)}k
            </h3>
          </div>
        </div>
      </div>

      {/* Tenant Directory Canvas */}
      <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle overflow-hidden shadow-sm flex flex-col min-h-125">
        {/* Table Controls */}
        <div className="p-6 border-b border-border-subtle flex flex-wrap gap-4 justify-between items-center bg-surface-bg">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold focus:ring-2 focus:ring-secondary/20 outline-none cursor-pointer"
              >
                <option value="All Plans">All Plans</option>
                <option value="enterprise">Enterprise</option>
                <option value="pro">Pro</option>
                <option value="starter">Starter</option>
                <option value="free">Free</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold focus:ring-2 focus:ring-secondary/20 outline-none cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm font-medium border border-outline-variant/30 rounded-xl bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <p className="text-sm font-bold text-on-surface-variant hidden md:block">
              Total {totalTenantsCount} tenants
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container-low disabled:opacity-50 text-on-surface-variant focus:outline-none transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                disabled={page >= (data?.totalPages || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container-low disabled:opacity-50 text-on-surface-variant focus:outline-none transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-surface-container-lowest">
              <tr className="border-b border-border-subtle">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Institution Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Plan Type
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Total Users
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building2 className="w-8 h-8 text-outline-variant" />
                      <p className="text-on-surface-variant font-medium">
                        No tenants match your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="hover:bg-surface-container-low/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant/20 shrink-0 text-secondary font-bold text-lg uppercase">
                          {tenant.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-on-surface line-clamp-1">
                            {tenant.name}
                          </p>
                          <p className="text-xs text-on-surface-variant font-mono mt-0.5 line-clamp-1">
                            {tenant.domain
                              ? `${tenant.domain}.lumina.com`
                              : tenant.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[11px] uppercase font-bold tracking-tight border whitespace-nowrap ${
                          tenant.subscriptionPlan === 'enterprise'
                            ? 'bg-secondary-fixed text-on-secondary-fixed-variant border-secondary/20'
                            : tenant.subscriptionPlan === 'pro'
                              ? 'bg-surface-container-highest text-on-surface-variant border-outline-variant/30'
                              : 'bg-surface-container-low text-on-primary-container border-outline-variant/20'
                        }`}
                      >
                        {tenant.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-on-surface">
                        {tenant._count?.users || 0}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-2 ${tenant.isActive ? 'text-on-tertiary-container' : 'text-streak-orange'}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${tenant.isActive ? 'bg-on-tertiary-container animate-pulse' : 'bg-streak-orange'}`}
                        ></span>
                        <span className="font-bold text-sm">
                          {tenant.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-on-surface-variant text-sm font-medium whitespace-nowrap">
                        {new Date(tenant.createdAt).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            handleToggleStatus(tenant.id, tenant.isActive)
                          }
                          className={`p-2 hover:bg-surface-container-high rounded-lg transition-colors focus:outline-none ${tenant.isActive ? 'text-streak-orange' : 'text-secondary'}`}
                          title={
                            tenant.isActive
                              ? 'Suspend Tenant'
                              : 'Activate Tenant'
                          }
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenPlanModal(tenant)}
                          className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors focus:outline-none"
                          title="Manage Plan"
                        >
                          <Tag className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            toast.info(
                              `Navigating to ${tenant.name} dashboard...`
                            );
                            window.open(
                              `/en/admin/dashboard?tenantId=${tenant.id}`,
                              '_blank'
                            );
                          }}
                          className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors focus:outline-none"
                          title="View Dashboard"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-bg">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 text-on-surface-variant font-bold text-sm hover:text-secondary transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export CSV
          </button>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant font-bold">
            Page {page} of {data?.totalPages || 1}
          </div>
        </div>
      </div>

      {/* Create Tenant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Onboard New Institution"
        subtitle="Initialize a new secure workspace environment."
        maxWidth="2xl"
        footer={
          <div className="flex gap-4 w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 border border-outline-variant/50 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-low transition-all focus:outline-none"
              type="button"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleCreateTenant}
              className="flex-1 py-3 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 disabled:opacity-70 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 flex items-center justify-center gap-2"
              type="submit"
            >
              {isSubmitting ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              ) : null}
              Launch Workspace
            </button>
          </div>
        }
      >
        <form
          id="create-tenant-form"
          onSubmit={handleCreateTenant}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Institution Full Name
              </label>
              <input
                required
                value={newTenant.name}
                onChange={(e) =>
                  setNewTenant({ ...newTenant, name: e.target.value })
                }
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all"
                placeholder="e.g. Stanford University"
                type="text"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Workspace Domain
              </label>
              <div className="flex items-center">
                <input
                  required
                  value={newTenant.domain}
                  onChange={(e) =>
                    setNewTenant({
                      ...newTenant,
                      domain: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, ''),
                    })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/30 border-r-0 rounded-l-xl px-4 py-3 font-mono text-sm focus:border-secondary focus:ring-0 outline-none transition-all"
                  placeholder="stanford"
                  type="text"
                />
                <span className="bg-surface-container-high border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-primary-container rounded-r-xl border-l-0">
                  .lumina.com
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Primary Industry
              </label>
              <div className="relative">
                <select className="w-full appearance-none bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium focus:border-secondary outline-none cursor-pointer focus:ring-2 focus:ring-secondary/20">
                  <option>Higher Education</option>
                  <option>Corporate Training</option>
                  <option>Government</option>
                  <option>K-12 Education</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Initial Subscription Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="cursor-pointer relative">
                <input
                  checked={newTenant.subscriptionPlan === 'starter'}
                  onChange={() =>
                    setNewTenant({ ...newTenant, subscriptionPlan: 'starter' })
                  }
                  className="sr-only peer"
                  name="plan"
                  type="radio"
                  value="starter"
                />
                <div className="p-4 border-2 border-outline-variant/20 rounded-2xl peer-checked:border-secondary peer-checked:bg-secondary/5 hover:bg-surface-container-low transition-all h-full">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                    Entry Level
                  </p>
                  <p className="font-bold text-base text-on-surface">Starter</p>
                  <p className="text-xs font-medium text-on-primary-container mt-2">
                    Up to 500 users
                  </p>
                </div>
              </label>
              <label className="cursor-pointer relative">
                <input
                  checked={newTenant.subscriptionPlan === 'pro'}
                  onChange={() =>
                    setNewTenant({ ...newTenant, subscriptionPlan: 'pro' })
                  }
                  className="sr-only peer"
                  name="plan"
                  type="radio"
                  value="pro"
                />
                <div className="p-4 border-2 border-outline-variant/20 rounded-2xl peer-checked:border-secondary peer-checked:bg-secondary/5 hover:bg-surface-container-low transition-all h-full">
                  <p className="text-[10px] uppercase font-bold text-secondary mb-1">
                    Most Popular
                  </p>
                  <p className="font-bold text-base text-on-surface">Pro</p>
                  <p className="text-xs font-medium text-on-primary-container mt-2">
                    Up to 5,000 users
                  </p>
                </div>
              </label>
              <label className="cursor-pointer relative">
                <input
                  checked={newTenant.subscriptionPlan === 'enterprise'}
                  onChange={() =>
                    setNewTenant({
                      ...newTenant,
                      subscriptionPlan: 'enterprise',
                    })
                  }
                  className="sr-only peer"
                  name="plan"
                  type="radio"
                  value="enterprise"
                />
                <div className="p-4 border-2 border-outline-variant/20 rounded-2xl peer-checked:border-secondary peer-checked:bg-secondary/5 hover:bg-surface-container-low transition-all h-full">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                    Full Control
                  </p>
                  <p className="font-bold text-base text-on-surface">
                    Enterprise
                  </p>
                  <p className="text-xs font-medium text-on-primary-container mt-2">
                    Unlimited users
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-start sm:items-center gap-3 p-4 bg-tertiary-fixed-dim/10 rounded-xl border border-tertiary-fixed-dim/30">
            <Info className="w-5 h-5 text-on-tertiary-container shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm font-medium text-on-tertiary-fixed-variant leading-relaxed">
              A confirmation email with admin credentials will be sent to the
              primary contact upon activation.
            </p>
          </div>
        </form>
      </Modal>

      {/* Manage Plan Modal */}
      {planModalTenant && (
        <Modal
          isOpen={!!planModalTenant}
          onClose={() => setPlanModalTenant(null)}
          title={`Update Subscription Plan`}
          subtitle={`Change the tier level for ${planModalTenant.name}`}
          maxWidth="lg"
          footer={
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setPlanModalTenant(null)}
                className="flex-1 py-3 border border-outline-variant/50 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-low transition-all focus:outline-none"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewPlan}
                className="flex-1 py-3 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-sm focus:outline-none"
                type="button"
              >
                Save New Plan
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant font-medium">
              Select the new subscription tier for this tenant:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {['starter', 'pro', 'enterprise'].map((plan) => (
                <label
                  key={plan}
                  onClick={() => setSelectedNewPlan(plan)}
                  className={`p-4 border-2 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    selectedNewPlan === plan
                      ? 'border-secondary bg-secondary/5'
                      : 'border-outline-variant/20 hover:bg-surface-container-low'
                  }`}
                >
                  <div>
                    <span className="font-bold text-on-surface uppercase text-sm">
                      {plan}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {plan === 'starter'
                        ? 'Up to 500 users'
                        : plan === 'pro'
                          ? 'Up to 5,000 users'
                          : 'Unlimited users'}
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="updatePlanRadio"
                    checked={selectedNewPlan === plan}
                    onChange={() => setSelectedNewPlan(plan)}
                    className="accent-secondary w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
