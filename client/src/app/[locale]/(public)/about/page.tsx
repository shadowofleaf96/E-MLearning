'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-surface text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <main className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-card border-b border-border-subtle pt-12 pb-16 px-4 md:px-10">
          <div className="max-w-container-max mx-auto">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-on-surface-variant mb-8"
            >
              <Link
                className="font-body-sm text-sm hover:text-secondary"
                href="/"
              >
                Home
              </Link>
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
              <span className="font-body-sm text-sm text-on-surface font-bold">
                About
              </span>
            </nav>
            <div className="max-w-3xl">
              <h1 className="font-display-lg text-5xl text-on-surface mb-6 font-bold">
                About Lumina Learning
              </h1>
              <p className="font-body-lg text-lg text-on-surface-variant mb-8">
                Empowering the next generation of technologists through rigorous
                academic inquiry, advanced algorithm design, and applied
                technological innovation. We believe in accessible, high-quality
                education for everyone.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/courses"
                  className="bg-secondary text-white px-6 py-3 rounded-lg font-body-md text-base hover:bg-on-secondary-fixed-variant transition-colors duration-200 flex items-center gap-2 font-semibold"
                >
                  View Courses
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="border-b border-border-subtle bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-4 md:px-10 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border-subtle">
              <div className="flex flex-col px-4 text-center">
                <span className="font-display-lg text-3xl md:text-4xl text-secondary font-bold">
                  50k+
                </span>
                <span className="font-label-md text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-wider">
                  Active Learners
                </span>
              </div>
              <div className="flex flex-col px-4 text-center">
                <span className="font-display-lg text-3xl md:text-4xl text-secondary font-bold">
                  10+
                </span>
                <span className="font-label-md text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-wider">
                  Years of Excellence
                </span>
              </div>
              <div className="flex flex-col px-4 text-center">
                <span className="font-display-lg text-3xl md:text-4xl text-secondary font-bold">
                  200+
                </span>
                <span className="font-label-md text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-wider">
                  Advanced Courses
                </span>
              </div>
              <div className="flex flex-col px-4 text-center">
                <span className="font-display-lg text-3xl md:text-4xl text-secondary font-bold">
                  95%
                </span>
                <span className="font-label-md text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-wider">
                  Placement Rate
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Bento Grid */}
        <section className="py-16 px-4 md:px-10 max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Mission Card */}
            <div className="lg:col-span-2 bg-surface-card rounded-xl border border-border-subtle p-8 md:p-12 hover:shadow-md transition-shadow flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container-low rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none group-hover:bg-secondary group-hover:opacity-10 transition-colors duration-500"></div>
              <span className="material-symbols-outlined text-secondary text-4xl mb-6">
                explore
              </span>
              <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-4">
                Our Mission
              </h2>
              <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
                To demystify complex systems and empower the next generation of
                engineers, data scientists, and theorists. We believe that
                rigorous foundational knowledge, paired with hands-on
                application in modern environments, is the key to unlocking
                technological breakthroughs.
              </p>
            </div>

            {/* Vision & History Stack */}
            <div className="flex flex-col gap-6">
              <div className="bg-surface-card rounded-xl border border-border-subtle p-8 hover:shadow-md transition-shadow flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-secondary">
                    visibility
                  </span>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface">
                    Vision
                  </h3>
                </div>
                <p className="font-body-md text-base text-on-surface-variant">
                  Establishing a global standard for computational literacy,
                  where abstract theory seamlessly translates into scalable,
                  real-world solutions.
                </p>
              </div>
              <div className="bg-surface-container-low rounded-xl border border-border-subtle p-8 hover:shadow-md transition-shadow flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-on-surface">
                    history_edu
                  </span>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface">
                    History
                  </h3>
                </div>
                <p className="font-body-sm text-sm text-on-surface-variant">
                  Founded by a collective of researchers, Lumina has evolved
                  from a boutique theoretical workshop into a leading provider
                  of enterprise-grade technical education.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 md:px-10 max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info & Map */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-4">
                  Get in Touch
                </h2>
                <p className="font-body-md text-base text-on-surface-variant">
                  Have questions about our curriculum or enterprise training
                  programs? Our team is here to help.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-lg font-bold text-on-surface">
                      Headquarters
                    </h4>
                    <p className="font-body-md text-base text-on-surface-variant">
                      400 Innovation Drive, Tech Park
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-lg font-bold text-on-surface">
                      General Inquiries
                    </h4>
                    <p className="font-body-md text-base text-on-surface-variant">
                      hello@luminalearning.edu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-surface-card rounded-xl border border-border-subtle p-8 shadow-sm">
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-6">
                Send an Inquiry
              </h3>
              <form
                className="flex flex-col gap-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1">
                    <label
                      className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-wider"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-2 font-body-md text-base text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors outline-none"
                      id="firstName"
                      placeholder="Jane"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-wider"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-2 font-body-md text-base text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors outline-none"
                      id="lastName"
                      placeholder="Doe"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-wider"
                    htmlFor="email"
                  >
                    Work Email
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-2 font-body-md text-base text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors outline-none"
                    id="email"
                    placeholder="jane@company.com"
                    type="email"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-wider"
                    htmlFor="interest"
                  >
                    Area of Interest
                  </label>
                  <select
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-2 font-body-md text-base text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors outline-none"
                    id="interest"
                  >
                    <option>Individual Courses</option>
                    <option>Enterprise Team Training</option>
                    <option>Degree Programs</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-wider"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-2 font-body-md text-base text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors outline-none resize-none"
                    id="message"
                    placeholder="How can we help you?"
                    rows={4}
                  ></textarea>
                </div>
                <button
                  className="bg-secondary text-white w-full py-3 rounded-lg font-body-md text-base font-semibold hover:bg-on-secondary-fixed-variant transition-colors duration-200 mt-2"
                  type="submit"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
