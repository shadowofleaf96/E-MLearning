'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function AltReset2Page() {
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
    <div className="bg-surface-bg text-on-surface font-body-md flex flex-col min-h-screen selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopNavBar */}
      <header className="bg-surface-bg flex justify-between items-center w-full px-4 md:px-10 py-4 border-b border-border-subtle fixed top-0 left-0 z-50">
        <div className="text-xl font-bold text-on-surface flex items-center gap-2">
          <Lightbulb className="text-secondary w-7 h-7" />
          Lumina Learning
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="#"
            className="text-secondary font-bold hover:text-secondary/80 transition-colors"
          >
            Contact Support
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="grow flex items-center justify-center p-4 md:p-10 w-full relative overflow-hidden mt-[72px]">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-surface-container-high opacity-30 blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-secondary-fixed-dim opacity-20 blur-3xl -z-10 pointer-events-none"></div>

        {/* Reset Password Card */}
        <div className="bg-surface-card w-full max-w-md rounded-2xl border border-border-subtle shadow-sm p-8 sm:p-10 relative z-10 transition-all hover:shadow-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface-container-low mb-5 border border-border-subtle">
              <Unlock className="text-secondary w-7 h-7" />
            </div>
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
              Reset Password
            </h1>
            <p className="text-sm font-medium text-on-surface-variant">
              Please enter a new password below to secure your Lumina Learning
              account.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* New Password */}
            <div>
              <label
                className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5"
                htmlFor="new_password"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new_password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-surface-bg text-on-surface border border-border-subtle rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              <div className="mt-4">
                <div className="flex gap-1.5 h-1.5 mb-2">
                  <div className="flex-1 bg-border-subtle rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{
                        width: strength.width === '10%' ? '100%' : '100%',
                      }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-border-subtle rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{
                        width:
                          strength.label === 'Medium' ||
                          strength.label === 'Strong'
                            ? '100%'
                            : '0%',
                      }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-border-subtle rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{
                        width: strength.label === 'Strong' ? '100%' : '0%',
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs font-bold flex justify-between text-on-surface-variant">
                  <span>Password strength:</span>
                  <span
                    className={`${
                      strength.label === 'Strong'
                        ? 'text-[#009668]'
                        : strength.label === 'Medium'
                          ? 'text-[#F59E0B]'
                          : 'text-error'
                    }`}
                  >
                    {strength.label}
                  </span>
                </p>
              </div>

              {/* Requirements */}
              <div className="mt-4 space-y-2">
                <div
                  className={`flex items-center gap-2 text-xs font-medium ${hasMinLength ? 'text-on-surface' : 'text-on-surface-variant'}`}
                >
                  <CheckCircle
                    className={`w-4 h-4 ${hasMinLength ? 'text-[#009668]' : 'text-border-subtle'}`}
                  />
                  <span>At least 8 characters</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-xs font-medium ${hasUppercase ? 'text-on-surface' : 'text-on-surface-variant'}`}
                >
                  <CheckCircle
                    className={`w-4 h-4 ${hasUppercase ? 'text-[#009668]' : 'text-border-subtle'}`}
                  />
                  <span>One uppercase letter</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-xs font-medium ${hasNumberOrSpecial ? 'text-on-surface' : 'text-on-surface-variant'}`}
                >
                  <CheckCircle
                    className={`w-4 h-4 ${hasNumberOrSpecial ? 'text-[#009668]' : 'text-border-subtle'}`}
                  />
                  <span>One number or special character</span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5"
                htmlFor="confirm_password"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="w-full bg-surface-bg text-on-surface border border-border-subtle rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors text-sm font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-secondary text-white font-bold text-sm py-3 px-4 rounded-xl hover:bg-secondary/90 transition-colors shadow-sm flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Update Password
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border-subtle pt-6">
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-secondary transition-colors group/link"
            >
              <ArrowLeft className="w-4 h-4 group-hover/link:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-bg border-t border-border-subtle w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <div className="text-xl font-bold text-on-surface flex items-center gap-2 opacity-50 grayscale">
          <Lightbulb className="text-secondary w-6 h-6" />
          <span className="text-sm font-semibold">Lumina Learning</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary hover:underline transition-all"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary hover:underline transition-all"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary hover:underline transition-all"
          >
            Help Center
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-on-surface-variant hover:text-secondary hover:underline transition-all"
          >
            Cookie Settings
          </Link>
        </div>
        <div className="text-sm font-medium text-on-surface-variant text-center md:text-right">
          © 2024 Lumina Learning. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
