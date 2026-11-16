'use client';

import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  updateUser,
  setLoading,
} from '@/store/slices/authSlice';
import {
  authService,
  LoginPayload,
  RegisterPayload,
  GoogleAuthPayload,
  Verify2FALoginPayload,
} from '../services/auth.service';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (credentials: LoginPayload) => {
      dispatch(loginStart());
      try {
        const res = await authService.login(credentials);

        if (res.data.requires2FA) {
          dispatch(setLoading(false));
          return {
            success: true,
            requires2FA: true,
            tempToken: res.data.tempToken,
          };
        }

        const { user: loggedInUser, token } = res.data as any;

        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
        document.cookie = `user_role=${loggedInUser.role}; path=/; max-age=604800; SameSite=Lax; Secure`;
        dispatch(loginSuccess({ user: loggedInUser, token }));
        return { success: true };
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Login failed';
        dispatch(loginFailure(errMsg));
        return { success: false, error: errMsg };
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterPayload) => {
      dispatch(loginStart());
      try {
        await authService.register(data);
        // Registration returns a success message, not a user/token.
        // The user must verify their email first.
        dispatch(
          loginFailure(
            'Registration successful! Please check your email to verify.'
          )
        );
        return { success: true };
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Registration failed';
        dispatch(loginFailure(errMsg));
        return { success: false, error: errMsg };
      }
    },
    [dispatch]
  );

  const googleLogin = useCallback(
    async (data: GoogleAuthPayload) => {
      dispatch(loginStart());
      try {
        const res = await authService.googleAuth(data);
        const { user: loggedInUser, token } = res.data;

        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
        document.cookie = `user_role=${loggedInUser.role}; path=/; max-age=604800; SameSite=Lax; Secure`;
        dispatch(loginSuccess({ user: loggedInUser, token }));
        return { success: true };
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message || 'Google authentication failed';
        dispatch(loginFailure(errMsg));
        return { success: false, error: errMsg };
      }
    },
    [dispatch]
  );

  const verify2FALogin = useCallback(
    async (data: Verify2FALoginPayload) => {
      dispatch(loginStart());
      try {
        const res = await authService.verify2FALogin(data);
        const { user: loggedInUser, token } = res.data;

        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
        document.cookie = `user_role=${loggedInUser.role}; path=/; max-age=604800; SameSite=Lax; Secure`;
        dispatch(loginSuccess({ user: loggedInUser, token }));
        return { success: true };
      } catch (err: any) {
        const errMsg = err.response?.data?.message || '2FA verification failed';
        dispatch(loginFailure(errMsg));
        return { success: false, error: errMsg };
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      await authService.logout();
    } catch (err) {
      // Clean up local credentials regardless of backend status
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie =
        'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      dispatch(logoutAction());
      const locale = pathname.split('/')[1] || 'en';
      router.push(`/${locale}`);
    }
  }, [dispatch, router, pathname]);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await authService.getProfile();
      const userData = (res as any).user || res.data;
      if (userData) {
        dispatch(updateUser(userData));
      }
    } catch (err) {
      // Profile fetching error
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    verify2FALogin,
    register,
    googleLogin,
    logout,
    refreshProfile,
  };
}
