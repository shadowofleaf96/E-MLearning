'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  GraduationCap,
  Blocks,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function AltRegister2Page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-surface-bg text-on-surface antialiased flex flex-col min-h-screen font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* TopNavBar */}
      <header className="bg-surface-bg flex justify-between items-center w-full px-4 md:px-10 py-4 border-b border-border-subtle z-50 fixed top-0 left-0">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-secondary w-8 h-8" />
          <span className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">
            Lumina Learning
          </span>
        </div>
        <div>
          <Link
            href="#"
            className="text-sm font-bold text-secondary hover:text-secondary/80 transition-colors hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </header>

      {/* Main Content: Split Screen */}
      <main className="grow flex flex-col md:flex-row mt-[72px]">
        {/* Left Side: Visual / Brand Context */}
        <section className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-primary-container text-on-primary overflow-hidden flex-col justify-between p-12">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              alt="Modern office architecture"
              fill
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDzF1YkQFAISO9cCFIBH4qYDjB-aJS6KFkCpaATL0rWM6bU9HuhjYTCQgXBr92OR2j9DTCjIrwQ59alyDUX0TI9LROuFbX-3Hvs7zuVYeRQAsZTdOIo7vNWE2D8erD7VDtVyXbT7-rX2wAPKt3AYGQDMu7LkMLnwXF28a32hCgoENEwKk1I6Yo9vpO7dpz97_GboAO4NvQ2ARo2AMIsEoEAc5MJUop-mX6jAQTQvq_ym52lhM_c1-zYvzQDa-qBAuwgPPMtcMx5f0"
            />
            <div className="absolute inset-0 bg-linear-to-br from-primary-container/90 to-primary-container/50"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-16">
              <Blocks className="w-10 h-10 text-tertiary-fixed mb-6" />
              <h1 className="font-display-lg text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                Advance your
                <br />
                structural
                <br />
                knowledge.
              </h1>
              <p className="text-lg text-on-primary-fixed-variant max-w-md font-medium">
                Join Lumina Learning to access industry-leading curriculums and
                precision training environments.
              </p>
            </div>
          </div>

          {/* Stats/Credibility */}
          <div className="relative z-10 flex gap-12 border-t border-on-primary-fixed-variant/30 pt-8 mt-auto">
            <div>
              <div className="text-sm font-mono font-medium text-tertiary-fixed mb-1">
                Modules
              </div>
              <div className="font-headline-lg text-4xl font-bold text-white">
                450+
              </div>
            </div>
            <div>
              <div className="text-sm font-mono font-medium text-tertiary-fixed mb-1">
                Uptime
              </div>
              <div className="font-headline-lg text-4xl font-bold text-white">
                99.9%
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Registration Form */}
        <section className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-surface-card relative border-l border-border-subtle">
          <div className="w-full max-w-[480px]">
            <div className="mb-10 text-center md:text-left">
              <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
                Create Account
              </h2>
              <p className="text-base font-medium text-on-surface-variant">
                Already have an account?{' '}
                <Link
                  href="#"
                  className="text-secondary font-bold hover:underline transition-all"
                >
                  Log in here
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Name Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <label
                    className="text-xs font-bold text-on-surface-variant uppercase tracking-wider"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="Jane"
                    required
                    type="text"
                    className="w-full h-12 px-4 rounded-xl text-base font-medium bg-transparent border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label
                    className="text-xs font-bold text-on-surface-variant uppercase tracking-wider"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    type="text"
                    className="w-full h-12 px-4 rounded-xl text-base font-medium bg-transparent border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-outline"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold text-on-surface-variant uppercase tracking-wider"
                  htmlFor="email"
                >
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-outline w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    placeholder="jane.doe@company.com"
                    required
                    type="email"
                    className="w-full h-12 pl-12 pr-4 rounded-xl text-base font-medium bg-transparent border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-outline"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold text-on-surface-variant flex justify-between uppercase tracking-wider"
                  htmlFor="password"
                >
                  Password
                  <span className="text-outline font-medium normal-case tracking-normal">
                    Min. 12 characters
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-outline w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    minLength={12}
                    name="password"
                    placeholder="••••••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 pl-12 pr-12 rounded-xl text-base font-medium bg-transparent border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-outline"
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface-variant transition-colors focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Locked Institution Selector */}
              <div className="space-y-2 pt-2 border-t border-border-subtle mt-6">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Host Institution
                </label>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low border border-border-subtle rounded-xl text-on-surface-variant relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
                  <Building2 className="text-secondary w-5 h-5" />
                  <span className="text-sm font-bold grow text-on-surface">
                    Quantum Systems Research
                  </span>
                  <Lock className="text-outline w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-outline mt-1.5">
                  Institution is locked based on your invitation link.
                </p>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  className="w-full h-12 flex items-center justify-center gap-2 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-secondary shadow-sm focus:outline-none"
                  type="submit"
                >
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-bg w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border-subtle mt-auto">
        <div className="font-headline-md text-xl font-bold text-on-surface flex items-center gap-2 opacity-50 grayscale">
          <GraduationCap className="w-6 h-6" />
          <span>Lumina Learning</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
        </nav>
        <div className="text-sm font-medium text-on-surface-variant text-center md:text-right">
          © 2024 Lumina Learning. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
