'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useReCaptcha } from 'next-recaptcha-v3';
import DOMPurify from 'dompurify';
import ForgotPasswordModal from '@/components/auth/ForgotPassword';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
// removed unused imports

const getRoleRedirectPath = (role: string) => {
  switch (role) {
    case 'super_admin':
      return '/super-admin/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'instructor':
      return '/instructor/dashboard';
    case 'student':
    default:
      return '/student/dashboard';
  }
};

const Login: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { executeRecaptcha } = useReCaptcha();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');

    if (token && role) {
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
      document.cookie = `user_role=${role}; path=/; max-age=604800; SameSite=Lax; Secure`;
      router.push(getRoleRedirectPath(role));
    }
  }, [router]);

  const sanitizeInput = (input: string) => DOMPurify.sanitize(input.trim());

  const validateCredentials = () => {
    if (!email || !password) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    if (password.length < 8 || password.length > 50) return false;
    return true;
  };

  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateCredentials()) {
      if (!email) {
        setError('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
      } else if (!password) {
        setError('Password is required');
      } else if (password.length < 8) {
        setError('Password must be at least 8 characters');
      }
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ReCaptcha might fail or hang if not configured properly, moving inside try/catch with a timeout
      let recaptchaToken = '';
      try {
        if (executeRecaptcha) {
          recaptchaToken = (await Promise.race([
            executeRecaptcha('form_submit'),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('reCAPTCHA timeout')), 2000)
            ),
          ])) as string;
        }
      } catch (captchaErr) {
        console.warn('ReCaptcha execution failed or timed out:', captchaErr);
      }

      const res = await api.post<any>(`/auth/login`, {
        identifier: sanitizedEmail,
        password: sanitizedPassword,
        recaptchaToken,
      });

      if (res.data.requires2FA) {
        setLoading(false);
        setRequires2FA(true);
        setTempToken(res.data.tempToken);
        return;
      }

      const respdata = res.data.data;

      if (respdata?.role) {
        if (rememberMe) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', respdata.role);
        } else {
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('role', respdata.role);
        }

        const cookieOptions = rememberMe ? 'max-age=604800;' : '';
        document.cookie = `token=${res.data.token}; path=/; ${cookieOptions} SameSite=Lax; Secure`;
        document.cookie = `user_role=${respdata.role}; path=/; ${cookieOptions} SameSite=Lax; Secure`;

        dispatch(loginSuccess({ user: respdata, token: res.data.token }));
        router.push(getRoleRedirectPath(respdata.role));
      } else {
        setLoading(false);
        toast.error(t('login.invalidCredentials'));
        return;
      }
    } catch (err: any) {
      setLoading(false);
      const message =
        err?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      toast.error(message);
      console.error('Login error:', err);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!twoFactorCode || twoFactorCode.length < 6) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post<any>(`/auth/verify-2fa-login`, {
        tempToken,
        code: twoFactorCode,
      });

      const respdata = res.data.data;

      if (respdata.role) {
        if (rememberMe) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', respdata.role);
        } else {
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('role', respdata.role);
        }

        const cookieOptions = rememberMe ? 'max-age=604800;' : '';
        document.cookie = `token=${res.data.token}; path=/; ${cookieOptions} SameSite=Lax; Secure`;
        document.cookie = `user_role=${respdata.role}; path=/; ${cookieOptions} SameSite=Lax; Secure`;

        dispatch(loginSuccess({ user: respdata, token: res.data.token }));
        router.push(getRoleRedirectPath(respdata.role));
      } else {
        setLoading(false);
        toast.error(t('login.invalidCredentials'));
      }
    } catch (err: any) {
      setLoading(false);
      const message = err?.response?.data?.message || 'Invalid 2FA code';
      toast.error(message);
      console.log(err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const recaptchaToken = await executeRecaptcha('google_login');
      const res = await api.post('/auth/google-login', {
        credential: credentialResponse.credential,
        recaptchaToken,
      });

      const role = res.data.data.role;
      if (rememberMe) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', role);
      } else {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('role', role);
      }

      const cookieOptions = rememberMe ? 'max-age=604800;' : '';
      document.cookie = `token=${res.data.token}; path=/; ${cookieOptions} SameSite=Lax; Secure`;
      document.cookie = `user_role=${role}; path=/; ${cookieOptions} SameSite=Lax; Secure`;

      dispatch(loginSuccess({ user: res.data.data, token: res.data.token }));
      router.push(getRoleRedirectPath(role));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('login.googleLoginFailed'));
    }
  };

  return (
    <>
      {/* Form Header */}
      <div className="mb-10">
        <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-6 border border-border-subtle">
          <span className="material-symbols-outlined text-primary text-[28px] fill">
            science
          </span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Sign In
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Access your personalized dashboard
        </p>
      </div>

      {requires2FA ? (
        <form onSubmit={handleVerify2FA} className="space-y-5">
          <div className="space-y-1.5">
            <label
              className="block font-label-md text-label-md text-on-surface-variant"
              htmlFor="code"
            >
              Authenticator Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline-variant text-[20px]">
                  pin
                </span>
              </div>
              <input
                id="code"
                name="code"
                type="text"
                required
                placeholder="000000"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-lg text-on-surface placeholder-outline-variant focus:ring-2 focus:ring-secondary transition-colors font-body-md text-body-md tracking-widest"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-error font-medium" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || twoFactorCode.length < 6}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors mt-6 bg-secondary hover:bg-secondary-container focus:ring-secondary disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size={20} /> : 'Verify'}
          </button>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setRequires2FA(false);
                setTwoFactorCode('');
              }}
              className="font-label-md text-label-md hover:underline transition-all text-secondary"
            >
              Back to login
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              className="block font-label-md text-label-md text-on-surface-variant"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline-variant text-[20px]">
                  mail
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-lg text-on-surface placeholder-outline-variant focus:ring-2 focus:ring-secondary transition-colors font-body-md text-body-md"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                className="block font-label-md text-label-md text-on-surface-variant"
                htmlFor="password"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-label-md text-label-md hover:underline transition-all text-secondary"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline-variant text-[20px]">
                  lock
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-10 py-2.5 bg-surface border border-border-subtle rounded-lg text-on-surface placeholder-outline-variant focus:ring-2 focus:ring-secondary transition-colors font-body-md text-body-md"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-error font-medium" role="alert">
              {error}
            </p>
          )}

          {/* Remember Me */}
          <div className="flex items-center pt-2">
            <input
              className="h-4 w-4 border-border-subtle rounded cursor-pointer bg-surface text-secondary focus:ring-secondary"
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label
              className="ml-2 block font-body-sm text-body-sm text-on-surface-variant cursor-pointer"
              htmlFor="remember-me"
            >
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors mt-6 bg-secondary hover:bg-secondary-container focus:ring-secondary disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size={20} /> : 'Sign In'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-bg px-2 text-outline-variant font-label-md">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex w-full justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error(t('login.googleLoginFailed'))}
              size="large"
              type="standard"
              shape="rectangular"
              width="100%"
              useOneTap
              ux_mode="popup"
              context="signin"
              use_fedcm_for_prompt={true}
            />
          </div>
        </form>
      )}

      {/* Request Access */}
      <div className="mt-8 text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Don&apos;t have an account?
          <Link
            href="/student/registration"
            className="font-label-md text-label-md hover:underline transition-all ml-1 text-secondary"
          >
            Request access
          </Link>
        </p>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </>
  );
};

export default Login;
