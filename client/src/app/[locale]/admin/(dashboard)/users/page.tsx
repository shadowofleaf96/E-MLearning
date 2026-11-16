'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  MoreVertical,
  Trash2,
  UserX,
  UserCheck,
} from 'lucide-react';
import { useUsers } from '@/modules/admin/hooks/useUsers';
import DataTable from '@/components/shared/DataTable';
import { User } from '@/types/user.types';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { toast } from 'react-toastify';
import CreateUserModal from '@/components/modals/CreateUserModal';

export default function AdminUsersPage() {
  const { users, loading, deleteUser, updateUserStatus, createUser } =
    useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'instructors', 'admins'

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const students = users.filter((u) => u.role === 'student');
  const instructors = users.filter((u) => u.role === 'instructor');
  const admins = users.filter(
    (u) => u.role === 'admin' || u.role === 'super_admin'
  );

  let activeUsersList = students;
  if (activeTab === 'instructors') activeUsersList = instructors;
  if (activeTab === 'admins') activeUsersList = admins;

  const filteredAndSortedUsers = activeUsersList
    .filter((u) => {
      const matchesSearch =
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize) || 1;
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // If we filter and the current page is now empty, reset to page 1
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleCreateUser = async (data: any) => {
    setIsCreating(true);
    const res = await createUser(data);
    setIsCreating(false);
    if (res?.success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const res = await updateUserStatus(user.id, newStatus);
    if (res.success) {
      toast.success(`User successfully ${newStatus}.`);
    } else {
      toast.error(res.error || 'Failed to update user status.');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName}?`)) {
      await deleteUser(user.id);
    }
  };

  const columns = [
    {
      header: 'User',
      accessor: (user: User) => (
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-surface-dim flex items-center justify-center font-bold text-secondary text-sm">
            {user.avatar ? (
              <Image
                alt="Avatar"
                fill
                className="object-cover"
                src={user.avatar}
              />
            ) : (
              `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-on-surface">
              {user.firstName} {user.lastName}
            </div>
            <div className="font-medium text-xs text-on-surface-variant mt-0.5">
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Joined',
      accessor: (user: User) => (
        <div className="font-medium text-sm text-on-surface">
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: 'Last Active',
      accessor: (user: User) => (
        <div className="font-medium text-sm text-on-surface-variant">
          {user.lastActive
            ? new Date(user.lastActive).toLocaleDateString()
            : 'Never'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (user: User) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
            user.status === 'active'
              ? 'bg-[#dcfce7] text-[#166534]'
              : user.status === 'suspended'
                ? 'bg-error-container text-on-error-container'
                : 'bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              user.status === 'active'
                ? 'bg-[#166534]'
                : user.status === 'suspended'
                  ? 'bg-on-error-container'
                  : 'bg-on-surface-variant'
            }`}
          ></span>
          {user.status
            ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
            : 'Unknown'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="p-2 rounded-full text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors focus:outline-none">
            <MoreVertical className="w-5 h-5" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-surface-card border border-border-subtle rounded-xl shadow-lg focus:outline-none z-10 p-1">
            <MenuItem>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={() => handleToggleStatus(user)}
                  className={`${
                    active
                      ? 'bg-surface-container-low text-secondary'
                      : 'text-on-surface'
                  } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {user.status === 'active' ? (
                    <UserX className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={() => handleDeleteUser(user)}
                  className={`${
                    active ? 'bg-error-container text-error' : 'text-error'
                  } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      ),
    },
  ];

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-2">
            User Management
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm md:text-base">
            Manage students, instructors, and administrative access across the
            platform.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-secondary text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors shadow-sm w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          <UserPlus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Main Card container */}
      <div className="bg-surface-card border border-border-subtle rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden min-h-125">
        {/* Tabs */}
        <div className="border-b border-border-subtle px-4 md:px-6 flex overflow-x-auto hide-scrollbar custom-scrollbar">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-5 py-4 font-bold text-sm whitespace-nowrap focus:outline-none transition-colors border-b-2 ${
              activeTab === 'students'
                ? 'text-secondary border-secondary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface hover:border-border-subtle'
            }`}
          >
            Students ({loading ? '...' : students.length})
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-5 py-4 font-bold text-sm whitespace-nowrap focus:outline-none transition-colors border-b-2 ${
              activeTab === 'instructors'
                ? 'text-secondary border-secondary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface hover:border-border-subtle'
            }`}
          >
            Instructors ({loading ? '...' : instructors.length})
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-5 py-4 font-bold text-sm whitespace-nowrap focus:outline-none transition-colors border-b-2 ${
              activeTab === 'admins'
                ? 'text-secondary border-secondary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface hover:border-border-subtle'
            }`}
          >
            Administrators ({loading ? '...' : admins.length})
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container-lowest border-b border-border-subtle">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              className="w-full bg-surface-bg border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 font-medium text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
              placeholder="Search by name or email..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto hide-scrollbar custom-scrollbar pb-1 md:pb-0">
            <Listbox value={statusFilter} onChange={setStatusFilter}>
              <div className="relative z-20">
                <ListboxButton className="px-4 py-2 border border-border-subtle rounded-xl font-bold text-sm text-on-surface-variant flex items-center gap-2 hover:bg-surface-container-low transition-colors whitespace-nowrap bg-surface-card focus:outline-none focus:ring-2 focus:ring-secondary">
                  <Filter className="w-4 h-4" />
                  Status:{' '}
                  {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </ListboxButton>
                <ListboxOptions className="absolute right-0 mt-2 w-40 origin-top-right bg-surface-card border border-border-subtle rounded-xl shadow-lg focus:outline-none p-1">
                  {['all', 'active', 'inactive', 'suspended'].map((status) => (
                    <ListboxOption
                      key={status}
                      value={status}
                      className={({ active }) =>
                        `cursor-pointer select-none rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-surface-container-low text-secondary'
                            : 'text-on-surface'
                        }`
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>

            <Listbox value={sortOrder} onChange={setSortOrder}>
              <div className="relative z-20">
                <ListboxButton className="px-4 py-2 border border-border-subtle rounded-xl font-bold text-sm text-on-surface-variant flex items-center gap-2 hover:bg-surface-container-low transition-colors whitespace-nowrap bg-surface-card focus:outline-none focus:ring-2 focus:ring-secondary">
                  <Calendar className="w-4 h-4" />
                  Joined: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </ListboxButton>
                <ListboxOptions className="absolute right-0 mt-2 w-40 origin-top-right bg-surface-card border border-border-subtle rounded-xl shadow-lg focus:outline-none p-1">
                  <ListboxOption
                    value="desc"
                    className={({ active }) =>
                      `cursor-pointer select-none rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-surface-container-low text-secondary'
                          : 'text-on-surface'
                      }`
                    }
                  >
                    Newest First
                  </ListboxOption>
                  <ListboxOption
                    value="asc"
                    className={({ active }) =>
                      `cursor-pointer select-none rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-surface-container-low text-secondary'
                          : 'text-on-surface'
                      }`
                    }
                  >
                    Oldest First
                  </ListboxOption>
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-on-surface-variant">
            Loading users...
          </div>
        ) : (
          <DataTable
            data={paginatedUsers}
            columns={columns}
            emptyMessage="No users found matching your criteria."
            className="border-none shadow-none rounded-none"
            pagination={{
              page: currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
          />
        )}
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        isLoading={isCreating}
      />
    </div>
  );
}
