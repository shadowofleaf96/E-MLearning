'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export default function AltLogin2Page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-surface-bg min-h-screen flex flex-col font-body-md text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Main Content */}
      <main className="grow flex items-center justify-center p-4 md:p-10 w-full max-w-container-max mx-auto">
        <div className="w-full max-w-md">
          {/* Brand Context */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-card border border-border-subtle rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <FlaskConical className="text-secondary w-8 h-8" />
            </div>
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
              Sign In
            </h1>
            <p className="text-base font-medium text-on-surface-variant">
              Quantum Systems Research Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-surface-card border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-bold text-on-surface uppercase tracking-wider"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-on-surface-variant w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="scholar@quantum.edu"
                      className="block w-full pl-10 pr-3 py-2.5 border border-border-subtle rounded-xl bg-surface-bg text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder:text-on-surface-variant/70"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-bold text-on-surface uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-on-surface-variant w-5 h-5" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-2.5 border border-border-subtle rounded-xl bg-surface-bg text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder:text-on-surface-variant/70"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-on-surface-variant hover:text-secondary focus:outline-none transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-secondary focus:ring-secondary border-border-subtle rounded bg-surface-bg cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm font-medium text-on-surface-variant cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <div>
                    <Link
                      href="#"
                      className="text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>

            {/* Secondary Action */}
            <div className="bg-surface-bg border-t border-border-subtle px-6 py-5 text-center">
              <p className="text-sm font-medium text-on-surface-variant">
                Don't have an account?
                <Link
                  href="#"
                  className="text-sm font-bold text-secondary hover:text-secondary/80 transition-colors ml-1.5"
                >
                  Request access
                </Link>
              </p>
            </div>
          </div>

          {/* Trust/Info Footer specific to tenant */}
          <div className="mt-8 text-center flex items-center justify-center gap-2 text-sm font-bold text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-on-surface-variant" />
            Secure Institutional Login
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-bg border-t border-border-subtle mt-auto max-w-container-max mx-auto">
        <div className="font-headline-md text-xl font-bold text-on-surface">
          Lumina Learning
        </div>
        <div className="text-sm font-medium text-on-surface-variant">
          © 2024 Lumina Learning. All rights reserved.
        </div>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary underline transition-all"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary underline transition-all"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary underline transition-all"
          >
            Help Center
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary underline transition-all"
          >
            Cookie Settings
          </Link>
        </nav>
      </footer>
    </div>
  );
}
