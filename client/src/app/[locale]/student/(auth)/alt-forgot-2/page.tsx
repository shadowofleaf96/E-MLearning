'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ScanLine, Mail, ChevronLeft } from 'lucide-react';

export default function AltForgot2Page() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="bg-surface-bg text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Main Content */}
      <main className="grow flex items-center justify-center p-4 md:p-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-low via-surface-bg to-surface-bg">
        <div className="w-full max-w-md bg-surface-card border border-border-subtle rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden group">
          {/* Decorative Accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary-fixed-dim to-secondary"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

          {/* Brand Mark */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-105 duration-300 shadow-md">
              <ScanLine className="w-7 h-7 text-on-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
              Forgot Password
            </h1>
            <p className="text-base font-medium text-on-surface-variant">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitted(true);
              }}
            >
              <div>
                <label
                  className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 bg-surface-bg border border-border-subtle rounded-xl text-on-surface focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors placeholder-outline-variant text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-on-secondary bg-secondary hover:bg-secondary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all active:scale-[0.98]"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-on-surface mb-2">
                Email Sent!
              </h2>
              <p className="text-sm font-medium text-on-surface-variant">
                Check your inbox for a link to reset your password. It may take
                a few minutes to arrive.
              </p>
            </div>
          )}

          {/* Footer Action */}
          <div className="mt-8 pt-6 border-t border-border-subtle text-center">
            <Link
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-secondary transition-colors group/link"
            >
              <ChevronLeft className="w-4 h-4 group-hover/link:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-bg border-t border-border-subtle w-full py-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <div className="font-headline-md text-xl font-bold text-on-surface">
          Lumina Learning
        </div>
        <div className="text-sm font-medium text-on-surface-variant flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link
            href="#"
            className="hover:text-secondary underline transition-all active:scale-95"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="hover:text-secondary underline transition-all active:scale-95"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="hover:text-secondary underline transition-all active:scale-95"
          >
            Help Center
          </Link>
          <Link
            href="#"
            className="hover:text-secondary underline transition-all active:scale-95"
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
