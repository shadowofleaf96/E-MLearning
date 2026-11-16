'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Flame,
  Star,
  Terminal,
  Users,
  Award,
  LineChart,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';

export default function LandingCompletePage() {
  return (
    <div className="bg-surface text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen font-body-md">
      {/* Hero Section */}
      <header className="py-16 px-4 md:px-10 max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[716px]">
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <h1 className="font-headline-lg text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface max-w-[15ch] leading-tight">
            Master Your Future with Professional Learning
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-[40ch] font-medium">
            Empower your teams and advance your career with enterprise-grade
            courses, interactive coding environments, and live mentorship.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/register"
              className="bg-secondary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors flex items-center gap-2 shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#courses"
              className="bg-transparent border border-outline text-on-surface font-bold text-sm px-6 py-3 rounded-xl hover:bg-surface-container-low hover:border-secondary transition-colors"
            >
              Browse Courses
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-border-subtle">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-surface relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                  alt="Student"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-surface relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop"
                  alt="Student"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-surface relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                  alt="Student"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="text-sm font-medium text-on-surface-variant">
              Join <span className="font-bold text-on-surface">50,000+</span>{' '}
              serious learners
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-border-subtle shadow-sm bg-surface-container-lowest animate-in fade-in zoom-in duration-1000 delay-200">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
            alt="Students learning together"
            fill
            className="object-cover"
          />

          {/* Floating Badge */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 bg-surface-card border border-border-subtle rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-[#F59E0B]">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Current Streak
              </div>
              <div className="font-mono text-sm font-bold text-on-surface">
                14 Days
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By */}
      <section className="py-12 bg-surface-container-low border-y border-border-subtle">
        <div className="max-w-container-max mx-auto px-4 md:px-10 text-center">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-8">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold tracking-tighter">
              Acme Corp
            </span>
            <span className="text-xl font-bold font-serif italic">
              TechFlow
            </span>
            <span className="text-xl font-bold tracking-widest">
              Innovate Edu
            </span>
            <span className="text-xl font-bold">GlobalData</span>
            <span className="text-xl font-bold font-mono">Nexus</span>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section
        id="courses"
        className="py-20 px-4 md:px-10 max-w-container-max mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
              Popular Courses
            </h2>
            <p className="text-base font-medium text-on-surface-variant">
              Accelerate your career with our top-rated programs.
            </p>
          </div>
          <Link
            href="#"
            className="hidden md:flex text-sm font-bold text-secondary hover:text-secondary/80 items-center gap-1.5 transition-colors group"
          >
            View all{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Course Card 1 */}
          <Link
            href="#"
            className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full cursor-pointer"
          >
            <div className="h-48 bg-surface-container-low relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                alt="Coding"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#F59E0B] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                Best Seller
              </div>
            </div>
            <div className="p-6 flex flex-col grow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-secondary bg-surface-container-low px-2 py-1 rounded">
                  Development
                </span>
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-on-surface">4.9</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2 mt-2 group-hover:text-secondary transition-colors">
                Advanced Full-Stack Development
              </h3>
              <p className="text-sm font-medium text-on-surface-variant mb-4 grow">
                Master modern web architecture with React, Node, and Postgres.
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border-subtle mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full relative overflow-hidden bg-surface-container">
                    <Image
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
                      alt="Instructor"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold text-on-surface">
                    Dr. Sarah Chen
                  </span>
                </div>
                <div className="text-lg font-bold text-on-surface">$149</div>
              </div>
            </div>
          </Link>

          {/* Course Card 2 */}
          <Link
            href="#"
            className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full cursor-pointer"
          >
            <div className="h-48 bg-surface-container-low relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                alt="Product Management"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-6 flex flex-col grow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-secondary bg-surface-container-low px-2 py-1 rounded">
                  Business
                </span>
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-on-surface">4.8</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2 mt-2 group-hover:text-secondary transition-colors">
                Product Management Mastery
              </h3>
              <p className="text-sm font-medium text-on-surface-variant mb-4 grow">
                From ideation to launch: comprehensive frameworks for PMs.
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border-subtle mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full relative overflow-hidden bg-surface-container">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"
                      alt="Instructor"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold text-on-surface">
                    Marcus Vance
                  </span>
                </div>
                <div className="text-lg font-bold text-on-surface">$129</div>
              </div>
            </div>
          </Link>

          {/* Course Card 3 */}
          <Link
            href="#"
            className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex-col h-full cursor-pointer hidden lg:flex"
          >
            <div className="h-48 bg-surface-container-low relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop"
                alt="Data Science"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-6 flex flex-col grow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-secondary bg-surface-container-low px-2 py-1 rounded">
                  Data Science
                </span>
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-on-surface">4.9</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2 mt-2 group-hover:text-secondary transition-colors">
                Enterprise Grade Analytics
              </h3>
              <p className="text-sm font-medium text-on-surface-variant mb-4 grow">
                Advanced statistical modeling and data visualization techniques.
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border-subtle mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full relative overflow-hidden bg-surface-container">
                    <Image
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop"
                      alt="Instructor"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold text-on-surface">
                    Elena Rostova
                  </span>
                </div>
                <div className="text-lg font-bold text-on-surface">$169</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="#"
            className="inline-flex text-sm font-bold text-secondary hover:text-secondary/80 items-center gap-1.5 transition-colors border border-secondary rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            View all Courses
          </Link>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 bg-surface-container-lowest border-y border-border-subtle">
        <div className="max-w-container-max mx-auto px-4 md:px-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-4">
              Built for Serious Learners
            </h2>
            <p className="text-base md:text-lg font-medium text-on-surface-variant">
              A learning environment engineered for focus, retention, and
              measurable progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <div className="md:col-span-2 bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-sm transition-shadow flex flex-col md:flex-row gap-8 items-center group">
              <div className="flex-1">
                <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-secondary mb-6 border border-border-subtle group-hover:border-secondary transition-colors">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">
                  Interactive Coding Challenges
                </h3>
                <p className="text-sm font-medium text-on-surface-variant mb-6">
                  Practice immediately with our built-in, custom-themed Monaco
                  editor. Write, test, and debug code without leaving the
                  platform.
                </p>
                <Link
                  href="#"
                  className="text-sm font-bold text-secondary flex items-center gap-1.5 hover:underline group/link"
                >
                  Explore Workspace{' '}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="flex-1 w-full bg-[#1E1E1E] rounded-xl border border-border-subtle p-5 font-mono text-sm text-[#d4d4d4] shadow-sm relative overflow-hidden group-hover:shadow-md transition-shadow">
                <div className="flex gap-2 mb-4 pb-3 border-b border-[#333]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <pre className="overflow-x-auto">
                  <code>
                    <span className="text-[#569cd6]">function</span>{' '}
                    <span className="text-[#dcdcaa]">calculateProgress</span>
                    (xp) {'{\n'}
                    {'  '}
                    <span className="text-[#569cd6]">const</span> level ={' '}
                    <span className="text-[#4ec9b0]">Math</span>.
                    <span className="text-[#dcdcaa]">floor</span>(xp /{' '}
                    <span className="text-[#b5cea8]">1000</span>);{'\n'}
                    {'  '}
                    <span className="text-[#569cd6]">return</span> {'{\n'}
                    {'    '}level,{'\n'}
                    {'    '}nextTier: (level +{' '}
                    <span className="text-[#b5cea8]">1</span>) *{' '}
                    <span className="text-[#b5cea8]">1000</span>
                    {'\n'}
                    {'  }'};{'\n'}
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>

            {/* Small Feature 1 */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-sm transition-shadow group">
              <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-secondary mb-6 border border-border-subtle group-hover:border-secondary transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">
                Live Mentorship Sessions
              </h3>
              <p className="text-sm font-medium text-on-surface-variant">
                Connect 1-on-1 with industry experts for code reviews, career
                advice, and roadblock resolution.
              </p>
            </div>

            {/* Small Feature 2 */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-sm transition-shadow group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-[#F59E0B] border border-border-subtle group-hover:border-[#F59E0B] transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <div className="bg-surface-container-highest px-3 py-1 rounded-full flex items-center gap-1 border border-border-subtle">
                  <span className="font-mono text-xs font-bold text-on-surface">
                    2,450 XP
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">
                Gamified Learning Path
              </h3>
              <p className="text-sm font-medium text-on-surface-variant">
                Stay motivated with streaks, earn XP, and unlock achievement
                badges as you master new skills.
              </p>
            </div>

            {/* Small Feature 3 */}
            <div className="md:col-span-2 bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-sm transition-shadow flex flex-col md:flex-row gap-8 items-center group">
              <div className="flex-1 order-2 md:order-1 relative w-full h-48 bg-surface-container-low rounded-xl border border-border-subtle overflow-hidden flex flex-col justify-center p-6 gap-4">
                <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden">
                  <div className="w-[75%] h-full bg-secondary rounded-full group-hover:w-[85%] transition-all duration-1000"></div>
                </div>
                <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-secondary rounded-full group-hover:w-[55%] transition-all duration-1000 delay-100"></div>
                </div>
                <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden">
                  <div className="w-[90%] h-full bg-secondary rounded-full group-hover:w-[95%] transition-all duration-1000 delay-200"></div>
                </div>
                <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden">
                  <div className="w-[60%] h-full bg-secondary rounded-full group-hover:w-[70%] transition-all duration-1000 delay-300"></div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-secondary mb-6 border border-border-subtle group-hover:border-secondary transition-colors">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">
                  Enterprise Grade Analytics
                </h3>
                <p className="text-sm font-medium text-on-surface-variant">
                  Track your team's progress, identify skill gaps, and measure
                  ROI with our comprehensive dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-10 max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-4">
            Learner Success Stories
          </h2>
          <p className="text-base md:text-lg font-medium text-on-surface-variant max-w-2xl mx-auto">
            See how Lumina Learning has accelerated careers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-sm transition-shadow flex flex-col">
            <div className="flex text-[#F59E0B] mb-6 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-sm italic font-medium text-on-surface-variant mb-8 grow">
              "The interactive coding environment completely changed how I
              learn. The ability to write and test code immediately helped me
              master complex concepts and land my dream role."
            </p>
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border-subtle">
              <div className="w-12 h-12 rounded-full relative overflow-hidden bg-surface-container">
                <Image
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=100&auto=format&fit=crop"
                  alt="Alex Rivera"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">
                  Alex Rivera
                </div>
                <div className="text-xs font-medium text-on-surface-variant">
                  Software Engineer at TechFlow
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-sm transition-shadow flex flex-col">
            <div className="flex text-[#F59E0B] mb-6 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-sm italic font-medium text-on-surface-variant mb-8 grow">
              "The analytics dashboard and structured learning paths allowed our
              entire team to upskill efficiently. Highly recommend for any
              growing enterprise."
            </p>
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border-subtle">
              <div className="w-12 h-12 rounded-full relative overflow-hidden bg-surface-container">
                <Image
                  src="https://images.unsplash.com/photo-1573497019230-1cb9f2a99d42?q=80&w=100&auto=format&fit=crop"
                  alt="Priya Patel"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">
                  Priya Patel
                </div>
                <div className="text-xs font-medium text-on-surface-variant">
                  Data Analyst at Nexus
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-sm transition-shadow flex flex-col">
            <div className="flex text-[#F59E0B] mb-6 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-sm italic font-medium text-on-surface-variant mb-8 grow">
              "The live mentorship sessions were invaluable. Getting
              personalized feedback from industry experts elevated my product
              management skills to the next level."
            </p>
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border-subtle">
              <div className="w-12 h-12 rounded-full relative overflow-hidden bg-surface-container">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                  alt="James O'Connor"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">
                  James O'Connor
                </div>
                <div className="text-xs font-medium text-on-surface-variant">
                  Product Manager at Acme Corp
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-surface-container-low border-y border-border-subtle">
        <div className="max-w-container-max mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base md:text-lg font-medium text-on-surface-variant max-w-2xl mx-auto">
              Choose the plan that fits your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto items-center">
            {/* Individual */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 flex flex-col h-full hover:shadow-sm transition-shadow">
              <h3 className="text-2xl font-bold text-on-surface mb-2">
                Individual
              </h3>
              <p className="text-sm font-medium text-on-surface-variant mb-6">
                Perfect for self-paced learners.
              </p>
              <div className="text-5xl font-bold text-on-surface mb-6">
                $29
                <span className="text-base font-medium text-on-surface-variant">
                  /mo
                </span>
              </div>
              <ul className="flex flex-col gap-4 mb-8 grow">
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> Core
                  courses
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> XP system &
                  streaks
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> Community
                  access
                </li>
              </ul>
              <button className="w-full bg-surface-container-low text-secondary font-bold text-sm px-4 py-3 rounded-xl hover:bg-surface-container transition-colors focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                Start Free Trial
              </button>
            </div>

            {/* Professional */}
            <div className="bg-surface-card border-2 border-secondary rounded-2xl p-8 flex flex-col h-full relative shadow-xl transform md:scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">
                Professional
              </h3>
              <p className="text-sm font-medium text-on-surface-variant mb-6">
                For serious career advancement.
              </p>
              <div className="text-5xl font-bold text-on-surface mb-6">
                $79
                <span className="text-base font-medium text-on-surface-variant">
                  /mo
                </span>
              </div>
              <ul className="flex flex-col gap-4 mb-8 grow">
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> All courses
                  & paths
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> Live
                  mentorship sessions
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> Verified
                  certificates
                </li>
              </ul>
              <button className="w-full bg-secondary text-white font-bold text-sm px-4 py-3 rounded-xl hover:bg-secondary/90 transition-colors focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                Get Professional
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 flex flex-col h-full hover:shadow-sm transition-shadow">
              <h3 className="text-2xl font-bold text-on-surface mb-2">
                Enterprise
              </h3>
              <p className="text-sm font-medium text-on-surface-variant mb-6">
                For teams and organizations.
              </p>
              <div className="text-5xl font-bold text-on-surface mb-6">
                Custom
              </div>
              <ul className="flex flex-col gap-4 mb-8 grow">
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> Custom
                  tenant branding
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> Student
                  analytics & reporting
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <CheckCircle className="w-5 h-5 text-secondary" /> API access
                  & SSO
                </li>
              </ul>
              <button className="w-full bg-surface-container-low text-secondary font-bold text-sm px-4 py-3 rounded-xl hover:bg-surface-container transition-colors focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 md:px-10 max-w-[800px] mx-auto">
        <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          <details className="group bg-surface-card border border-border-subtle rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden hover:border-secondary/30 transition-colors">
            <summary className="flex items-center justify-between p-6 cursor-pointer focus:outline-none focus:bg-surface-container-low transition-colors">
              <h3 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">
                How do streaks work?
              </h3>
              <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform text-on-surface-variant" />
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant font-medium text-sm">
              <p>
                Streaks track your daily learning consistency. Complete at least
                one lesson or coding challenge every 24 hours to keep your
                streak alive. Missing a day resets your streak to zero, unless
                you use a Streak Freeze.
              </p>
            </div>
          </details>

          <details className="group bg-surface-card border border-border-subtle rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden hover:border-secondary/30 transition-colors">
            <summary className="flex items-center justify-between p-6 cursor-pointer focus:outline-none focus:bg-surface-container-low transition-colors">
              <h3 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">
                Are certificates accredited?
              </h3>
              <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform text-on-surface-variant" />
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant font-medium text-sm">
              <p>
                Our professional certificates are recognized by top tech
                companies and industry leaders. While they are not traditional
                university degrees, they serve as verifiable proof of your skill
                mastery in specific technical domains.
              </p>
            </div>
          </details>

          <details className="group bg-surface-card border border-border-subtle rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden hover:border-secondary/30 transition-colors">
            <summary className="flex items-center justify-between p-6 cursor-pointer focus:outline-none focus:bg-surface-container-low transition-colors">
              <h3 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">
                Can I cancel my subscription at any time?
              </h3>
              <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform text-on-surface-variant" />
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant font-medium text-sm">
              <p>
                Yes, you can cancel your subscription at any time through your
                account settings. You will continue to have access to your paid
                features until the end of your current billing period.
              </p>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
