import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '../services/superAdmin.service';

export interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string | null;
  lastActive: string;
  createdAt: string;
  tenant?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface PlatformUsersCounts {
  total: number;
  students: number;
  instructors: number;
  admins: number;
  superAdmins: number;
}

export interface PlatformUsersResponse {
  users: PlatformUser[];
  total: number;
  counts: PlatformUsersCounts;
  page: number;
  totalPages: number;
}

export interface PlatformUsersState {
  data: PlatformUsersResponse | null;
  loading: boolean;
  error: string | null;
}

export function usePlatformUsers(initialPage = 1, initialLimit = 10) {
  const [state, setState] = useState<PlatformUsersState>({
    data: null,
    loading: true,
    error: null,
  });

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await superAdminService.getPlatformUsers({
        page,
        limit,
        search,
        role: roleFilter,
        status: statusFilter,
      });
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState({
        data: null,
        loading: false,
        error:
          err.response?.data?.message ||
          err.message ||
          'Failed to fetch platform users',
      });
    }
  }, [page, limit, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await superAdminService.updateUserRole(userId, role);
      await fetchUsers();
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          'Failed to update user role'
      );
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await superAdminService.updateUserStatus(userId, newStatus);
      await fetchUsers();
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          'Failed to update user status'
      );
    }
  };

  return {
    ...state,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    refresh: fetchUsers,
    updateUserRole,
    toggleUserStatus,
  };
}
