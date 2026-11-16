'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, FlaskConical, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function AltLogin1Page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen w-full bg-surface-bg text-on-surface font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Left Side: Dark Hero / Context (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <Image
          alt="Students studying together"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQFra_SPwQwCX_Xh5hHtSALFfNYVnyCTPw5TIiOM0HD4_Vj6k8B12xkbuKj2S9eW_jdHoRLNCsuTpVNYLdNP3mdZpuOAplXdD23bdRyfSzxMZ5SN_mb-GZ4K7OOOmG4yo8rEWxYsG2p0t3_XWHFJCFGiE2JgFgp_5W-fgRjhK3woxYdd6WRah4OQN3BotGrRk5qfSRZlJBm3yC8RRxSKvTVi0hDqAaJjVcKuF2AhDnY8Ql2ikWrwULZw2GT49BbPB6QOQxxatGBdk"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40 pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <BookOpen className="text-white w-8 h-8" />
            <span className="font-headline-md text-2xl font-bold text-white">
              Lumina Learning
            </span>
          </div>
          <div className="max-w-md">
            <h1 className="font-display-lg text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              Welcome back to your center of excellence.
            </h1>
            <p className="text-lg text-primary-fixed-dim leading-relaxed">
              Sign in to access your premium modules, pick up where you left
              off, and track your progress across the Quantum Systems Research
              Portal.
            </p>
          </div>
        </div>

        {/* Stats/Trust */}
        <div className="relative z-10 flex gap-8">
          <div>
            <div className="font-headline-md text-2xl font-bold text-white mb-1">
              450+
            </div>
            <div className="text-sm text-primary-fixed-dim font-medium">
              Premium Modules
            </div>
          </div>
          <div className="w-px bg-primary-fixed-dim/30"></div>
          <div>
            <div className="font-headline-md text-2xl font-bold text-white mb-1">
              99.9%
            </div>
            <div className="text-sm text-primary-fixed-dim font-medium">
              System Uptime
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between bg-surface-bg p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-sm mx-auto grow flex flex-col justify-center">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="flex lg:hidden items-center gap-2 mb-12">
            <BookOpen className="text-primary w-6 h-6" />
            <span className="font-headline-md text-2xl font-bold text-on-surface">
              Lumina Learning
            </span>
          </div>

          {/* Form Header */}
          <div className="mb-10">
            <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 border border-border-subtle">
              <FlaskConical className="text-primary w-7 h-7" />
            </div>
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-2 tracking-tight">
              Sign In
            </h2>
            <p className="text-base text-on-surface-variant font-medium">
              Quantum Systems Research Portal
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-bold text-on-surface-variant mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-outline-variant w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-3 py-2.5 bg-surface border border-border-subtle rounded-xl text-on-surface placeholder-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base font-medium outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-1">
                <label
                  className="block text-xs font-bold text-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-primary hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-outline-variant w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-10 py-2.5 bg-surface border border-border-subtle rounded-xl text-on-surface placeholder-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline-variant hover:text-on-surface transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary border-border-subtle rounded focus:ring-primary cursor-pointer bg-surface"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm font-medium text-on-surface-variant cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mt-6"
            >
              Sign In
            </button>
          </form>

          {/* Request Access */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-on-surface-variant">
              Don't have an account?
              <Link
                href="#"
                className="text-sm font-bold text-primary hover:underline transition-all ml-1"
              >
                Request access
              </Link>
            </p>
          </div>
        </div>

        {/* Simplified Auth Footer */}
        <footer className="w-full pt-8 mt-auto flex justify-center gap-6 text-sm font-medium text-on-surface-variant">
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Help Center
          </Link>
        </footer>
      </div>
    </main>
  );
}
