'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FlaskConical, Mail, CheckCircle, ArrowLeft } from 'lucide-react';

export default function AltForgot1Page() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="bg-surface-bg text-on-surface antialiased flex flex-col items-center justify-center p-4 md:p-10 min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Main Container */}
      <main className="w-full max-w-md bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm transition-shadow hover:shadow-md flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          {/* Tenant Logo Placeholder */}
          <div className="h-14 w-14 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary border border-border-subtle">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface">
              Forgot Password
            </h1>
            <p className="text-sm font-medium text-on-surface-variant">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>
        </div>

        {/* Form */}
        {!isSubmitted ? (
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitted(true);
            }}
          >
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-bold text-on-surface uppercase tracking-wider"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-border-subtle rounded-xl bg-surface-bg text-on-surface text-base font-medium focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white text-sm font-bold py-3 rounded-xl hover:bg-secondary/90 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-secondary flex justify-center items-center gap-2 shadow-sm focus:outline-none"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          /* Success Message */
          <div className="flex flex-col items-center text-center gap-4 py-4 animate-in zoom-in duration-300">
            <div className="h-14 w-14 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-secondary">
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-on-surface">
                Check your email
              </h2>
              <p className="text-sm font-medium text-on-surface-variant">
                We have sent a password reset link to your email address.
              </p>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="flex justify-center border-t border-border-subtle pt-6">
          <Link
            href="#"
            className="text-sm font-bold text-secondary hover:underline flex items-center gap-1.5 transition-all hover:-translate-x-1 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Login
          </Link>
        </div>
      </main>

      {/* Footer Component (Shared) */}
      <footer className="fixed bottom-0 left-0 w-full bg-surface-bg border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-10 z-0">
        <div className="font-headline-md text-xl font-bold text-on-surface">
          Lumina Learning
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
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
        </div>
        <div className="text-sm font-medium text-on-surface-variant text-center">
          © 2024 Lumina Learning. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
