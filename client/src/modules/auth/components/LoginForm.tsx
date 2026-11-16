'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const { login, verify2FALogin, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requires2FA) {
      const result = await verify2FALogin({ tempToken, code: twoFactorCode });
      if (result.success) {
        router.push('/dashboard');
      }
    } else {
      const result = await login({ identifier: email, password });
      if (result.requires2FA) {
        setRequires2FA(true);
        setTempToken(result.tempToken!);
      } else if (result.success) {
        router.push('/dashboard');
      }
    }
  };

  if (requires2FA) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Two-Factor Authentication
          </h1>
          <p className="text-sm text-zinc-400">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="code" className="text-zinc-300">
              Authenticator Code
            </Label>
            <Input
              id="code"
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              required
              className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 text-center tracking-widest text-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || twoFactorCode.length < 6}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 py-6 text-base font-semibold shadow-lg shadow-emerald-500/10"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify'
            )}
          </Button>

          <button
            type="button"
            onClick={() => {
              setRequires2FA(false);
              setTwoFactorCode('');
            }}
            className="w-full text-sm text-zinc-400 hover:text-white transition-colors mt-4"
          >
            Back to login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/60 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-400">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-zinc-300">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-emerald-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 py-6 text-base font-semibold shadow-lg shadow-emerald-500/10"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            'Log In'
          )}
        </Button>
      </form>
    </div>
  );
}
