import { useState, useEffect } from 'react';
import { usersService } from '../services/users.service';
import { User } from '@/types/user.types';
import { toast } from 'react-toastify';

export function useUsers(params?: Record<string, any>) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(params)]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const searchParams =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search)
          : null;
      const tenantIdParam = searchParams?.get('tenantId');
      const finalParams = {
        ...params,
        ...(tenantIdParam ? { tenantId: tenantIdParam } : {}),
      };

      const data = await usersService.getUsers(finalParams);
      setUsers(data.users || []);
      setError(null);
    } catch (err: any) {
      setError(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersService.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.success('User deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete user');
    }
  };

  const updateUserStatus = async (
    id: string,
    newStatus: 'active' | 'suspended' | 'inactive'
  ) => {
    try {
      await usersService.updateUser(id, { status: newStatus });
      setUsers(
        users.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to update user status',
      };
    }
  };

  const createUser = async (data: Partial<User>) => {
    try {
      const res = await usersService.createUser(data);
      if (res.data) {
        setUsers([res.data, ...users]);
        toast.success('User created successfully');
        return { success: true };
      }
      return { success: false, error: 'Failed to create user' };
    } catch (err: any) {
      return {
        success: false,
        error:
          err.response?.data?.message || err.message || 'Failed to create user',
      };
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    deleteUser,
    updateUserStatus,
    createUser,
  };
}
