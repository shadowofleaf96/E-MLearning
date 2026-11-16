'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Users,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  Ban,
  CheckCircle2,
  Download,
  Building,
} from 'lucide-react';
import {
  usePlatformUsers,
  PlatformUser,
} from '@/modules/super-admin/hooks/usePlatformUsers';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Modal from '@/components/shared/Modal';
import { exportToCsv } from '@/lib/exportCsv';

export default function PlatformUsersPage() {
  const {
    data,
    loading,
    page,
    setPage,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    updateUserRole,
    toggleUserStatus,
  } = usePlatformUsers();

  const [roleModalUser, setRoleModalUser] = useState<PlatformUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('student');

  const handleOpenRoleModal = (user: PlatformUser) => {
    setRoleModalUser(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!roleModalUser) return;
    try {
      await updateUserRole(roleModalUser.id, selectedRole);
      toast.success(
        `Role for ${roleModalUser.firstName} updated to ${selectedRole.toUpperCase()}`
      );
      setRoleModalUser(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user role');
    }
  };

  const handleToggleStatus = async (user: PlatformUser) => {
    try {
      await toggleUserStatus(user.id, user.status);
      toast.success(
        `User ${user.firstName} ${user.status === 'active' ? 'suspended' : 'activated'} successfully`
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  const handleExportCsv = () => {
    if (!data?.users) return;
    exportToCsv('platform_users_export', data.users, [
      { header: 'ID', accessor: (u) => u.id },
      { header: 'Name', accessor: (u) => `${u.firstName} ${u.lastName}` },
      { header: 'Email', accessor: (u) => u.email },
      { header: 'Role', accessor: (u) => u.role },
      {
        header: 'Tenant',
        accessor: (u) => u.tenant?.name || 'Global / Platform',
      },
      { header: 'Status', accessor: (u) => u.status },
      {
        header: 'Joined',
        accessor: (u) => new Date(u.createdAt).toLocaleDateString(),
      },
    ]);
    toast.success('Platform users exported successfully!');
  };

  if (loading && !data) {
    return <LoadingSpinner fullScreen />;
  }

  const counts = data?.counts || {
    total: 0,
    students: 0,
    instructors: 0,
    admins: 0,
    superAdmins: 0,
  };
  const usersList = data?.users || [];

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
            Platform-wide Users
          </h1>
          <p className="text-body-md font-medium text-on-surface-variant mt-1 text-sm md:text-base">
            View, audit, and manage user accounts across all institutions and
            system roles.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-sm w-full md:w-auto focus:outline-none"
        >
          <Download className="w-4 h-4" />
          Export User Directory
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-secondary text-xs font-bold uppercase tracking-wider">
              Total Global
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Users
            </p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">
              {counts.total}
            </h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-xp-gold/10 flex items-center justify-center text-xp-gold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xp-gold text-xs font-bold uppercase tracking-wider">
              Enrolled
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Students
            </p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">
              {counts.students}
            </h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed-dim/10 flex items-center justify-center text-on-tertiary-container">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-on-tertiary-container text-xs font-bold uppercase tracking-wider">
              Educators
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Instructors
            </p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">
              {counts.instructors}
            </h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-streak-orange/10 flex items-center justify-center text-streak-orange">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-streak-orange text-xs font-bold uppercase tracking-wider">
              System Admin
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Admins & Super
            </p>
            <h3 className="text-3xl font-bold text-on-surface mt-1">
              {counts.admins + counts.superAdmins}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table Wrapper */}
      <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle overflow-hidden shadow-sm flex flex-col min-h-125">
        {/* Table Controls */}
        <div className="p-6 border-b border-border-subtle flex flex-wrap gap-4 justify-between items-center bg-surface-bg">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold focus:ring-2 focus:ring-secondary/20 outline-none cursor-pointer text-on-surface"
              >
                <option value="All Roles">All Roles</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Tenant Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold focus:ring-2 focus:ring-secondary/20 outline-none cursor-pointer text-on-surface"
              >
                <option value="All Status">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm font-medium border border-outline-variant/30 rounded-xl bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 outline-none text-on-surface"
              />
            </div>
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

        {/* Table Content */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-surface-container-lowest">
              <tr className="border-b border-border-subtle">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Institution / Tenant
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  System Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Account Status
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
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-outline-variant" />
                      <p className="text-on-surface-variant font-medium">
                        No users match your query criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                usersList.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-container-low/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold uppercase text-sm shrink-0 border border-secondary/20">
                          {user.firstName
                            ? user.firstName.substring(0, 1)
                            : 'U'}
                          {user.lastName ? user.lastName.substring(0, 1) : ''}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-on-surface">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-on-surface-variant font-mono">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
                        <Building className="w-4 h-4 text-on-surface-variant shrink-0" />
                        <span>{user.tenant?.name || 'Global Platform'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border ${
                          user.role === 'super_admin'
                            ? 'bg-streak-orange/10 text-streak-orange border-streak-orange/20'
                            : user.role === 'admin'
                              ? 'bg-secondary/10 text-secondary border-secondary/20'
                              : user.role === 'instructor'
                                ? 'bg-tertiary-fixed-dim/10 text-on-tertiary-container border-tertiary-fixed-dim/20'
                                : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
                        }`}
                      >
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-2 ${user.status === 'active' ? 'text-on-tertiary-container' : 'text-streak-orange'}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-on-tertiary-container animate-pulse' : 'bg-streak-orange'}`}
                        ></span>
                        <span className="font-bold text-sm capitalize">
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface-variant whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors focus:outline-none"
                          title="Change Role"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 hover:bg-surface-container-high rounded-lg transition-colors focus:outline-none ${user.status === 'active' ? 'text-streak-orange' : 'text-on-tertiary-container'}`}
                          title={
                            user.status === 'active'
                              ? 'Suspend User'
                              : 'Activate User'
                          }
                        >
                          {user.status === 'active' ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-bg text-sm font-bold text-on-surface-variant">
          <span>Total {data?.total || 0} registered users</span>
          <span>
            Page {page} of {data?.totalPages || 1}
          </span>
        </div>
      </div>

      {/* Edit Role Modal */}
      {roleModalUser && (
        <Modal
          isOpen={!!roleModalUser}
          onClose={() => setRoleModalUser(null)}
          title={`Update System Role`}
          subtitle={`Modify permissions for ${roleModalUser.firstName} ${roleModalUser.lastName}`}
          maxWidth="md"
          footer={
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setRoleModalUser(null)}
                className="flex-1 py-2.5 border border-outline-variant/50 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-low transition-all"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="flex-1 py-2.5 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-sm"
                type="button"
              >
                Update Role
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            <p className="text-sm font-medium text-on-surface-variant">
              Select the role to assign to{' '}
              <strong className="text-on-surface">{roleModalUser.email}</strong>
              :
            </p>
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {[
                {
                  id: 'student',
                  title: 'Student',
                  desc: 'Standard learner access',
                },
                {
                  id: 'instructor',
                  title: 'Instructor',
                  desc: 'Can create and grade courses',
                },
                {
                  id: 'admin',
                  title: 'Tenant Admin',
                  desc: 'Manages institution courses and members',
                },
                {
                  id: 'super_admin',
                  title: 'Super Admin',
                  desc: 'Full system control across all tenants',
                },
              ].map((r) => (
                <label
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-3.5 border-2 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    selectedRole === r.id
                      ? 'border-secondary bg-secondary/5'
                      : 'border-outline-variant/20 hover:bg-surface-container-low'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm text-on-surface capitalize">
                      {r.title}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {r.desc}
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="roleOption"
                    checked={selectedRole === r.id}
                    onChange={() => setSelectedRole(r.id)}
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
