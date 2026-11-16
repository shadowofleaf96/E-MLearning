'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCourses } from '@/modules/courses/hooks/useCourses';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LandingPage() {
  const { courses, loadCourses, loading } = useCourses();

  useEffect(() => {
    loadCourses({ limit: 3 });
  }, [loadCourses]);

  return (
    <div className="bg-surface text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Hero Section */}
      <header className="py-16 px-4 md:px-10 max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[716px]">
        <div className="flex flex-col gap-6">
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface leading-tight max-w-[15ch]">
            Master Your Future with Professional Learning
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-[40ch]">
            Empower your teams and advance your career with enterprise-grade
            courses, interactive coding environments, and live mentorship.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/student/registration"
              className="bg-secondary text-white font-label-md text-sm font-semibold px-6 py-3 rounded-lg hover:bg-on-secondary-fixed-variant transition-colors flex items-center gap-2"
            >
              Get Started{' '}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/courses"
              className="bg-transparent border border-outline text-on-surface font-label-md text-sm font-semibold px-6 py-3 rounded-lg hover:bg-surface-container-low hover:border-secondary transition-colors"
            >
              Browse Courses
            </Link>
          </div>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border-subtle">
            <div className="flex -space-x-3">
              <Image
                alt="Student 1"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsQT-hAf1hCWA9IWGls3E2FU2ApzqYH3FygP2S_nVmSlc3jEJEUJqDH6jQoRfdbePCHucAZslf2a2L7Cg0nuBQlqARtJeRv-DPhcaS_ccwQzWVI1EUElhn2LDfiF0kxWcvZbNrwZLL5bYQlUtk_mAuKvWUEADNrXS9X0WXabYzfrT8j6wo3SGRlx_x5egYn3WAtTM-xa7CDghwvKxAJrN-Urk540pBN-A0ja2qj59U9s5m89cpjX_Gl1A0HHM-UZGxnMlq9NJyXRE"
              />
              <Image
                alt="Student 2"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoJgAQVZx1LnIkOjnMsL_1xZtjABtWviTDyu-qGZJhcVr2efj1ZNtrHcSnjdA06fO88Qz-U2zrz9HqyJ66Nxr4Uox2ZsIf7hhskWzbD2dP3-74x0yt1VILeQDOOusJwBv2azo5JCVe7Aa0hROZjWhlgFz-YMculgocyCFA8jXC0wsQdGRGrDLZ3eJl3CSsb0PnMHjhSrCyhx4_WfyDXuJIGvMysRT6iO9qAMRbCoL285x_COgDEK2TEBW5nBNH9GrKueRWl87RjNA"
              />
              <Image
                alt="Student 3"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYqbyMhXoMRjq-fzj_jC2ZVsL6vO_bYGCobO9OLd87AmanSkwyJtjoJkjwS03FtEGNeOa3rzsHowkw9UAgMtTWBZJpPfQDdU-SSOO6HF6G-M1W9njz8CyQTKMj8jj6BcoPns88dIOihoBBJ1pZZL6r7wTI86TAgP1ilDijCNmyOd_9kLiEI4voTa4Yeo159Y7oiwUJHzkWxocQ95giT6C8Ved5g690fAVPTSw6vKp8atFidt623z5TsRK_xlbIqA6e4-70XiJot3s"
              />
            </div>
            <div className="font-body-sm text-sm text-on-surface-variant">
              Join <span className="font-bold text-on-surface">50,000+</span>{' '}
              serious learners
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden border border-border-subtle shadow-md bg-surface-container-lowest">
          <Image
            alt="Students learning together"
            fill
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCSXPD7sKE_oStLXIXXOkCX4ZVoBoceWIabGzfTwIpp1RvCK_74WdHcUzXEjUjuSm960Ejfg10omdJFi4JiiDCah92pxW2Lob106DcaDj2Yd-gskkTjRmJpfy5HvrhjtUc-LvF7qrjKNrwUzkc3lj1pdAVq_EUBRIqFj9jSWYcWoy2Z5CHFIFJO-TPXyti2gDOSjQ5SZDGRINIPTcDVTjolge7rTivSyQSFSlONhjuJ8kY-NxWfHw-MjzcVIHB9YHRNJMqzSiwwRo"
          />
          {/* Floating Badge */}
          <div className="absolute top-8 right-8 bg-surface-card border border-border-subtle rounded-lg p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-xp-gold">
              <span className="material-symbols-outlined">
                local_fire_department
              </span>
            </div>
            <div>
              <div className="font-label-md text-xs font-semibold text-on-surface-variant">
                Current Streak
              </div>
              <div className="font-code-sm text-sm font-bold text-on-surface font-mono">
                14 Days
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By */}
      <section className="py-12 bg-surface-container-low border-y border-border-subtle">
        <div className="max-w-container-max mx-auto px-4 md:px-10 text-center">
          <p className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-6">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
            <span className="font-headline-md text-xl md:text-2xl font-bold">
              Acme Corp
            </span>
            <span className="font-headline-md text-xl md:text-2xl font-bold">
              TechFlow
            </span>
            <span className="font-headline-md text-xl md:text-2xl font-bold">
              Innovate Edu
            </span>
            <span className="font-headline-md text-xl md:text-2xl font-bold">
              GlobalData
            </span>
            <span className="font-headline-md text-xl md:text-2xl font-bold">
              Nexus
            </span>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 px-4 md:px-10 max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
              Popular Courses
            </h2>
            <p className="font-body-md text-base text-on-surface-variant">
              Accelerate your career with our top-rated programs.
            </p>
          </div>
          <Link
            href="/pricing"
            className="hidden md:flex font-label-md text-sm font-semibold text-secondary hover:text-on-secondary-fixed-variant items-center gap-1 transition-colors"
          >
            View all{' '}
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : courses && courses.length > 0 ? (
            courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full cursor-pointer"
              >
                <div className="h-48 bg-surface-container-low relative overflow-hidden">
                  <Image
                    alt={course.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={
                      course.thumbnail ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKR5Oy4TXOY9tyAxiyWJtJBqW068QlZUyqaBKjes-FyOsMUIg_U-oTFn1LwydhgKoME8wkyh5BSqZfuXt9iRfFYHg4pyhJQ71O0A94L7JC3ZXAThhQT3V1HGOeag5X17hCordILToL385iDDVdsaMamSZ3jEZcLyNdwIGSZtZiSkkj7v5P4qWd3YmKN06SR4NALjjPir_AWB8WQbnUdNhaCf4yBbg79GDlWouNX50MT-fyGGA5zSMPGOQSFAsyDCzbfiwByLyBNEI'
                    }
                  />
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-md text-xs font-semibold text-secondary bg-surface-container-low px-2 py-1 rounded">
                      {course.category?.name || 'General'}
                    </span>
                    <div className="flex items-center gap-1 text-xp-gold">
                      <span className="material-symbols-outlined text-[16px] filled-icon">
                        star
                      </span>
                      <span className="font-label-md text-xs font-semibold text-on-surface">
                        4.9
                      </span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2 mt-2">
                    {course.title}
                  </h3>
                  <p className="font-body-sm text-sm text-on-surface-variant mb-4 grow line-clamp-2">
                    {course.description ||
                      'Learn from industry experts with real-world projects.'}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-border-subtle mt-auto">
                    <div className="flex items-center gap-2">
                      {course.instructor?.avatar ? (
                        <Image
                          alt={course.instructor.firstName || 'Instructor'}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                          src={course.instructor.avatar}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-secondary text-xs">
                          {course.instructor?.firstName?.charAt(0) || 'I'}
                        </div>
                      )}
                      <span className="font-body-sm text-sm text-on-surface">
                        {course.instructor?.firstName}{' '}
                        {course.instructor?.lastName}
                      </span>
                    </div>
                    <div className="font-headline-md text-xl font-bold text-on-surface">
                      ${course.price || 'Free'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-on-surface-variant">
              No popular courses available at the moment.
            </div>
          )}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/pricing"
            className="inline-flex font-label-md text-sm text-secondary hover:text-on-secondary-fixed-variant items-center gap-1 transition-colors border border-secondary rounded-lg px-4 py-2"
          >
            View all Courses
          </Link>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-16 bg-surface-container-lowest border-y border-border-subtle">
        <div className="max-w-container-max mx-auto px-4 md:px-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-4">
              Built for Serious Learners
            </h2>
            <p className="font-body-lg text-lg text-on-surface-variant">
              A learning environment engineered for focus, retention, and
              measurable progress.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <div className="md:col-span-2 bg-surface-card border border-border-subtle rounded-xl p-8 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-secondary mb-6">
                  <span className="material-symbols-outlined text-[24px]">
                    terminal
                  </span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">
                  Interactive Coding Challenges
                </h3>
                <p className="font-body-md text-base text-on-surface-variant mb-6">
                  Practice immediately with our built-in, custom-themed Monaco
                  editor. Write, test, and debug code without leaving the
                  platform.
                </p>
                <Link
                  href="/student/registration"
                  className="font-label-md text-sm font-semibold text-secondary flex items-center gap-1 hover:underline"
                >
                  Explore Workspace{' '}
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="flex-1 w-full bg-[#1E1E1E] rounded-lg border border-border-subtle p-4 font-mono text-sm text-[#d4d4d4] shadow-md relative overflow-hidden">
                <div className="flex gap-2 mb-4 pb-2 border-b border-[#333]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <pre>
                  <code>
                    <span className="text-[#569cd6]">function</span>{' '}
                    <span className="text-[#dcdcaa]">calculateProgress</span>
                    (xp) {'{\n'}
                    {'  '}
                    <span className="text-[#569cd6]">const</span> level ={' '}
                    <span className="text-[#4ec9b0]">Math</span>.
                    <span className="text-[#dcdcaa]">floor</span>(xp /{' '}
                    <span className="text-[#b5cea8]">1000</span>);
                    {'\n'}
                    {'  '}
                    <span className="text-[#569cd6]">return</span> {'{\n'}
                    {'    '}level,{'\n'}
                    {'    '}nextTier: (level +{' '}
                    <span className="text-[#b5cea8]">1</span>) *{' '}
                    <span className="text-[#b5cea8]">1000</span>
                    {'\n'}
                    {'  '};\n
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>

            {/* Small Feature 1 */}
            <div className="bg-surface-card border border-border-subtle rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined text-[24px]">
                  group
                </span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">
                Live Mentorship Sessions
              </h3>
              <p className="font-body-sm text-sm text-on-surface-variant">
                Connect 1-on-1 with industry experts for code reviews, career
                advice, and roadblock resolution.
              </p>
            </div>

            {/* Small Feature 2 */}
            <div className="bg-surface-card border border-border-subtle rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-xp-gold">
                  <span className="material-symbols-outlined text-[24px]">
                    workspace_premium
                  </span>
                </div>
                <div className="bg-surface-container-highest px-3 py-1 rounded-full flex items-center gap-1 border border-border-subtle">
                  <span className="font-mono text-sm font-bold text-on-surface">
                    2,450 XP
                  </span>
                </div>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">
                Gamified Learning Path
              </h3>
              <p className="font-body-sm text-sm text-on-surface-variant">
                Stay motivated with streaks, earn XP, and unlock achievement
                badges as you master new skills.
              </p>
            </div>

            {/* Small Feature 3 */}
            <div className="md:col-span-2 bg-surface-card border border-border-subtle rounded-xl p-8 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 order-2 md:order-1 relative w-full h-48 bg-surface-container-low rounded-lg border border-border-subtle overflow-hidden">
                <div className="absolute inset-0 p-4 flex flex-col gap-3 justify-center">
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-secondary rounded-full"></div>
                  </div>
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className="w-[45%] h-full bg-secondary rounded-full"></div>
                  </div>
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className="w-[90%] h-full bg-secondary rounded-full"></div>
                  </div>
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-secondary rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-secondary mb-6">
                  <span className="material-symbols-outlined text-[24px]">
                    insights
                  </span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">
                  Enterprise Grade Analytics
                </h3>
                <p className="font-body-md text-base text-on-surface-variant">
                  Track your team's progress, identify skill gaps, and measure
                  ROI with our comprehensive dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-10 max-w-container-max mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-4">
            Learner Success Stories
          </h2>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto">
            See how Lumina Learning has accelerated careers worldwide.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-card border border-border-subtle rounded-xl p-8 hover:shadow-md transition-shadow">
            <div className="flex text-xp-gold mb-6">
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
            </div>
            <p className="font-body-md text-base text-on-surface-variant mb-8 grow">
              "The interactive coding environment completely changed how I
              learn. The ability to write and test code immediately helped me
              master complex concepts and land my dream role."
            </p>
            <div className="flex items-center gap-3">
              <Image
                alt="Alex Rivera"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsQT-hAf1hCWA9IWGls3E2FU2ApzqYH3FygP2S_nVmSlc3jEJEUJqDH6jQoRfdbePCHucAZslf2a2L7Cg0nuBQlqARtJeRv-DPhcaS_ccwQzWVI1EUElhn2LDfiF0kxWcvZbNrwZLL5bYQlUtk_mAuKvWUEADNrXS9X0WXabYzfrT8j6wo3SGRlx_x5egYn3WAtTM-xa7CDghwvKxAJrN-Urk540pBN-A0ja2qj59U9s5m89cpjX_Gl1A0HHM-UZGxnMlq9NJyXRE"
              />
              <div>
                <div className="font-headline-md text-base font-bold text-on-surface">
                  Alex Rivera
                </div>
                <div className="font-body-sm text-sm text-on-surface-variant">
                  Software Engineer at TechFlow
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-card border border-border-subtle rounded-xl p-8 hover:shadow-md transition-shadow">
            <div className="flex text-xp-gold mb-6">
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
            </div>
            <p className="font-body-md text-base text-on-surface-variant mb-8 grow">
              "The analytics dashboard and structured learning paths allowed our
              entire team to upskill efficiently. Highly recommend for any
              growing enterprise."
            </p>
            <div className="flex items-center gap-3">
              <Image
                alt="Priya Patel"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYqbyMhXoMRjq-fzj_jC2ZVsL6vO_bYGCobO9OLd87AmanSkwyJtjoJkjwS03FtEGNeOa3rzsHowkw9UAgMtTWBZJpPfQDdU-SSOO6HF6G-M1W9njz8CyQTKMj8jj6BcoPns88dIOihoBBJ1pZZL6r7wTI86TAgP1ilDijCNmyOd_9kLiEI4voTa4Yeo159Y7oiwUJHzkWxocQ95giT6C8Ved5g690fAVPTSw6vKp8atFidt623z5TsRK_xlbIqA6e4-70XiJot3s"
              />
              <div>
                <div className="font-headline-md text-base font-bold text-on-surface">
                  Priya Patel
                </div>
                <div className="font-body-sm text-sm text-on-surface-variant">
                  Data Analyst at Nexus
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-card border border-border-subtle rounded-xl p-8 hover:shadow-md transition-shadow">
            <div className="flex text-xp-gold mb-6">
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
              <span className="material-symbols-outlined filled-icon text-[20px]">
                star
              </span>
            </div>
            <p className="font-body-md text-base text-on-surface-variant mb-8 grow">
              "The live mentorship sessions were invaluable. Getting
              personalized feedback from industry experts elevated my product
              management skills to the next level."
            </p>
            <div className="flex items-center gap-3">
              <Image
                alt="James O'Connor"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoJgAQVZx1LnIkOjnMsL_1xZtjABtWviTDyu-qGZJhcVr2efj1ZNtrHcSnjdA06fO88Qz-U2zrz9HqyJ66Nxr4Uox2ZsIf7hhskWzbD2dP3-74x0yt1VILeQDOOusJwBv2azo5JCVe7Aa0hROZjWhlgFz-YMculgocyCFA8jXC0wsQdGRGrDLZ3eJl3CSsb0PnMHjhSrCyhx4_WfyDXuJIGvMysRT6iO9qAMRbCoL285x_COgDEK2TEBW5nBNH9GrKueRWl87RjNA"
              />
              <div>
                <div className="font-headline-md text-base font-bold text-on-surface">
                  James O'Connor
                </div>
                <div className="font-body-sm text-sm text-on-surface-variant">
                  Product Manager at Acme Corp
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-10 max-w-[800px] mx-auto">
        <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          <details className="group bg-surface-card border border-border-subtle rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-surface-container-low transition-colors">
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                How do streaks work?
              </h3>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">
                expand_more
              </span>
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant font-body-md text-base">
              <p>
                Streaks track your daily learning consistency. Complete at least
                one lesson or coding challenge every 24 hours to keep your
                streak alive. Missing a day resets your streak to zero, unless
                you use a Streak Freeze.
              </p>
            </div>
          </details>
          <details className="group bg-surface-card border border-border-subtle rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-surface-container-low transition-colors">
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                Are certificates accredited?
              </h3>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">
                expand_more
              </span>
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant font-body-md text-base">
              <p>
                Our professional certificates are recognized by top tech
                companies and industry leaders. While they are not traditional
                university degrees, they serve as verifiable proof of your skill
                mastery in specific technical domains.
              </p>
            </div>
          </details>
          <details className="group bg-surface-card border border-border-subtle rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-surface-container-low transition-colors">
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                Can I cancel my subscription at any time?
              </h3>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">
                expand_more
              </span>
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant font-body-md text-base">
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
