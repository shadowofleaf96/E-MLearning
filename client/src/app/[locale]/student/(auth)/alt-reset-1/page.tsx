'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  HelpCircle,
  Microscope,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Circle,
  Unlock,
  ArrowRight,
} from 'lucide-react';

export default function AltReset1Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    password
  );

  const getStrength = () => {
    let strength = 0;
    if (hasMinLength) strength++;
    if (hasUppercase) strength++;
    if (hasNumberOrSpecial) strength++;

    if (strength === 0)
      return { label: 'Weak', width: '10%', color: 'bg-error' };
    if (strength === 1)
      return { label: 'Weak', width: '33%', color: 'bg-error' };
    if (strength === 2)
      return { label: 'Medium', width: '66%', color: 'bg-[#F59E0B]' };
    return { label: 'Strong', width: '100%', color: 'bg-[#009668]' };
  };

  const strength = getStrength();

  return (
    <div className="bg-surface-bg text-on-surface antialiased min-h-screen flex flex-col font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Top Navigation Bar (Transactional - Simplified) */}
      <header className="bg-surface-bg border-b border-border-subtle flex justify-between items-center w-full px-4 md:px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-secondary w-7 h-7" />
          <span className="font-headline-md text-xl font-bold text-on-surface">
            Lumina Learning
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 border-l border-border-subtle pl-4 ml-4">
          <span className="text-sm font-medium text-on-surface-variant">
            Quantum Systems Research
          </span>
        </div>
        <div className="flex items-center ml-auto md:ml-0">
          <Link
            href="#"
            className="text-sm font-bold text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Contact Support</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area - Centered Card */}
      <main className="grow flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-surface-container-high to-transparent blur-3xl mix-blend-multiply"></div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-2xl shadow-sm w-full max-w-[440px] z-10 p-6 sm:p-8 md:p-10 relative transition-all hover:shadow-md">
          {/* Tenant Logo / Identity */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-sm">
              <Microscope className="w-8 h-8" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-2">
              Reset Password
            </h1>
            <p className="text-sm font-medium text-on-surface-variant">
              Create a new, strong password for your Quantum Systems Research
              account.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* New Password Field */}
            <div>
              <label
                className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5"
                htmlFor="new_password"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="new_password"
                  name="new_password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-border-subtle rounded-xl bg-surface-bg text-on-surface focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors font-mono text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements / Strength */}
            <div className="bg-surface-bg rounded-xl p-4 border border-border-subtle">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Password Strength:
                </span>
                <span
                  className={`text-xs font-bold ${
                    strength.label === 'Strong'
                      ? 'text-[#009668]'
                      : strength.label === 'Medium'
                        ? 'text-[#F59E0B]'
                        : 'text-error'
                  }`}
                >
                  {strength.label}
                </span>
              </div>

              {/* Progress Bar style strength indicator */}
              <div className="w-full h-1.5 bg-border-subtle rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                  style={{ width: strength.width }}
                ></div>
              </div>

              <ul className="space-y-2.5">
                <li
                  className={`flex items-center gap-2 text-sm font-medium ${hasMinLength ? 'text-[#009668]' : 'text-on-surface-variant'}`}
                >
                  {hasMinLength ? (
                    <CheckCircle className="w-4 h-4 text-[#4edea3]" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  At least 8 characters
                </li>
                <li
                  className={`flex items-center gap-2 text-sm font-medium ${hasUppercase ? 'text-[#009668]' : 'text-on-surface-variant'}`}
                >
                  {hasUppercase ? (
                    <CheckCircle className="w-4 h-4 text-[#4edea3]" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  One uppercase letter
                </li>
                <li
                  className={`flex items-center gap-2 text-sm font-medium ${hasNumberOrSpecial ? 'text-[#009668]' : 'text-on-surface-variant'}`}
                >
                  {hasNumberOrSpecial ? (
                    <CheckCircle className="w-4 h-4 text-[#4edea3]" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  One number or special character
                </li>
              </ul>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5"
                htmlFor="confirm_password"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                  <Unlock className="w-5 h-5" />
                </div>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-3 py-2.5 border border-border-subtle rounded-xl bg-surface-bg text-on-surface focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors font-mono text-sm outline-none"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-secondary text-white text-sm font-bold py-3 px-4 rounded-xl hover:bg-secondary/90 transition-colors shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              >
                Update Password
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center mt-4">
              <Link
                href="#"
                className="text-sm font-bold text-secondary hover:underline transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer (Suppressed for Transactional screen, minimal legal links only) */}
      <footer className="bg-surface-bg py-6 px-4 md:px-10 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-sm font-medium text-on-surface-variant">
          © 2024 Lumina Learning. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
