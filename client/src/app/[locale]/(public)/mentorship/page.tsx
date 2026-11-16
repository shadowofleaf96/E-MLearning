'use client';

import React from 'react';
import Link from 'next/link';
export default function MentorshipPage() {
  return (
    <div className="bg-surface-bg text-on-surface font-body-md antialiased flex flex-col min-h-screen">
      <main className="grow w-full">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-[#0f172a] text-white pt-24 pb-32">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="max-w-container-max mx-auto px-4 md:px-10 relative z-10 flex flex-col items-center text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-fixed font-bold text-sm mb-6 border border-primary/30">
              Lumina Live Mentorship
            </span>
            <h1 className="font-display-lg text-4xl md:text-6xl font-bold mb-6 max-w-4xl tracking-tight leading-tight">
              Accelerate Your Growth with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6ffbbe] to-[#adc6ff]">
                Expert 1-on-1 Guidance
              </span>
            </h1>
            <p className="font-body-lg text-lg md:text-xl text-blue-100/80 max-w-2xl mb-10">
              Connect with industry leaders for personalized career coaching,
              technical code reviews, and interview preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/courses"
                className="bg-primary text-on-primary hover:bg-primary/90 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-primary/25"
              >
                Find a Mentor
              </Link>
              <Link
                href="/instructor"
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
              >
                Become a Mentor
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-container-max mx-auto px-4 md:px-10 py-24">
          <div className="text-center mb-16">
            <h2 className="font-display-md text-3xl md:text-4xl font-bold text-on-surface mb-4">
              Tailored to your goals
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
              Whether you are looking to break into tech, level up your
              architecture skills, or land that dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">
                  code_blocks
                </span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-3">
                Code Reviews
              </h3>
              <p className="text-on-surface-variant">
                Submit your projects or PRs and get in-depth, line-by-line
                feedback from senior engineers to improve your code quality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-tertiary-container text-on-tertiary-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">
                  trending_up
                </span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-3">
                Career Coaching
              </h3>
              <p className="text-on-surface-variant">
                Navigate the tech industry with strategic advice. Discuss salary
                negotiation, promotions, and transitioning into leadership.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-error-container text-on-error-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">
                  forum
                </span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-3">
                Interview Prep
              </h3>
              <p className="text-on-surface-variant">
                Practice mock interviews, whiteboard challenges, and system
                design sessions to ace your next technical interview.
              </p>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-surface-container-low py-24 border-y border-border-subtle">
          <div className="max-w-container-max mx-auto px-4 md:px-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <h2 className="font-display-md text-3xl md:text-4xl font-bold text-on-surface mb-6">
                  Simple, seamless booking
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">
                        Find your perfect match
                      </h4>
                      <p className="text-on-surface-variant">
                        Browse our vetted roster of industry experts by skill,
                        company, or role.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">
                        Sync calendars instantly
                      </h4>
                      <p className="text-on-surface-variant">
                        View real-time availability and book a slot that works
                        for your schedule, across any timezone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">
                        Meet in our built-in classroom
                      </h4>
                      <p className="text-on-surface-variant">
                        Join your 1-on-1 session directly on Lumina with
                        high-quality video, screen sharing, and a shared code
                        editor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 w-full aspect-video bg-surface rounded-2xl border border-border-subtle shadow-xl overflow-hidden relative">
                {/* Abstract graphic representing booking */}
                <div className="absolute inset-0 bg-linear-to-br from-surface to-surface-container flex items-center justify-center">
                  <div className="grid grid-cols-7 gap-2 w-3/4 opacity-30">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 rounded-md ${i === 12 || i === 15 ? 'bg-primary' : 'bg-on-surface-variant/20'}`}
                      ></div>
                    ))}
                  </div>
                  <div className="absolute bg-surface-card border border-border p-4 rounded-xl shadow-lg w-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-secondary-container"></div>
                      <div>
                        <div className="h-3 w-20 bg-on-surface/80 rounded mb-1"></div>
                        <div className="h-2 w-16 bg-on-surface-variant/50 rounded"></div>
                      </div>
                    </div>
                    <div className="w-full py-2 bg-primary text-on-primary rounded-lg text-center text-xs font-bold">
                      Book Session
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-container-max mx-auto px-4 md:px-10 py-24 text-center">
          <h2 className="font-display-sm text-3xl font-bold mb-6 text-on-surface">
            Ready to take the next step?
          </h2>
          <p className="text-on-surface-variant mb-10 max-w-xl mx-auto">
            Join thousands of learners who have accelerated their careers with
            Lumina's expert mentors.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-on-surface text-surface hover:bg-on-surface/90 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md"
          >
            Explore Mentors
          </Link>
        </section>
      </main>
    </div>
  );
}
