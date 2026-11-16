'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface InstitutePageProps {
  params: Promise<{
    locale: string;
    tenantId: string;
  }>;
}

export default function InstitutePage({ params }: InstitutePageProps) {
  const { tenantId } = React.use(params);

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
              <span className="font-body-sm text-sm hover:text-secondary cursor-pointer">
                Institutes
              </span>
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
              <span className="font-body-sm text-sm text-on-surface font-bold capitalize">
                {tenantId.replace(/-/g, ' ')}
              </span>
            </nav>
            <div className="max-w-3xl">
              <h1 className="font-display-lg text-5xl text-on-surface mb-6 font-bold capitalize">
                {tenantId.replace(/-/g, ' ')}
              </h1>
              <p className="font-body-lg text-lg text-on-surface-variant mb-8">
                Pioneering the future of computational sciences through rigorous
                academic inquiry, advanced algorithm design, and applied
                technological innovation.
              </p>
              <div className="flex gap-4">
                <button className="bg-secondary text-white px-6 py-3 rounded-lg font-body-md text-base hover:bg-on-secondary-fixed-variant transition-colors duration-200 flex items-center gap-2 font-semibold">
                  View Courses
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
                <button className="bg-surface-container text-on-surface px-6 py-3 rounded-lg font-body-md text-base border border-border-subtle hover:bg-surface-container-high transition-colors duration-200 font-semibold">
                  Research Papers
                </button>
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
                  24k+
                </span>
                <span className="font-label-md text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-wider">
                  Active Students
                </span>
              </div>
              <div className="flex flex-col px-4 text-center">
                <span className="font-display-lg text-3xl md:text-4xl text-secondary font-bold">
                  15
                </span>
                <span className="font-label-md text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-wider">
                  Years of Excellence
                </span>
              </div>
              <div className="flex flex-col px-4 text-center">
                <span className="font-display-lg text-3xl md:text-4xl text-secondary font-bold">
                  120
                </span>
                <span className="font-label-md text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-wider">
                  Advanced Courses
                </span>
              </div>
              <div className="flex flex-col px-4 text-center">
                <span className="font-display-lg text-3xl md:text-4xl text-secondary font-bold">
                  98%
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
                  Founded in 2009 by a collective of researchers, QSR has
                  evolved from a boutique theoretical workshop into a leading
                  provider of enterprise-grade technical education.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Faculty Section */}
        <section className="bg-surface-container-lowest border-y border-border-subtle py-16 px-4 md:px-10">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
                  Lead Faculty
                </h2>
                <p className="font-body-md text-base text-on-surface-variant">
                  Learn directly from industry pioneers and published
                  researchers.
                </p>
              </div>
              <button className="hidden md:flex text-secondary font-label-md text-sm font-semibold items-center gap-1 hover:underline">
                View All Instructors
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Faculty Card 1 */}
              <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="aspect-square bg-surface-container-low w-full relative overflow-hidden">
                  <Image
                    alt="Dr. Aris Thorne"
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgPlVqCMppgLvGycAjL8huAAsx3yvgYDT3b4IXaJIkmzw1lIYELW5XHhxcAyvP57qiApSAiyLalnEMtdOSUZYNHnPuF0jCNCxgRUvI2OCxPqoCil4xi8GeR_6e5sgwcW839wa_2DF7FpPAolnzZk_b-34voIvIViVjiAUhLutTg8sXx_vWSHOBI-tXSxxia__faiL6RosUhdG4AUEoQ30LHiW2n1Uu6NOY6cCdSElzZegpol1mGN4gK51wxESq54ecFmVDIweTI1Q"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mb-1">
                    Dr. Aris Thorne
                  </h3>
                  <p className="font-label-md text-xs font-semibold text-secondary mb-4 uppercase tracking-wider">
                    Head of Distributed Systems
                  </p>
                  <p className="font-body-sm text-sm text-on-surface-variant">
                    Former lead architect at major cloud providers, specializing
                    in high-throughput microservice architectures.
                  </p>
                </div>
              </div>

              {/* Faculty Card 2 */}
              <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="aspect-square bg-surface-container-low w-full relative overflow-hidden">
                  <Image
                    alt="Dr. Elena Rostova"
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo-IQLPaVfp-5bp-Ha2kCTCt1IuLbjK_SEIbVAslVYqRGXRDd0mP9UhKheqEpQybzmveJDHW7gpBCliPNR2E11xL_PahA_22d-hpTA-45l6svBVYaXfXgfcM0W8w1TR7tGsbFB74GGYplnnVUreoldNoD-ewy-Vi4sBAPQUW8PpZoritdT-ygllSgMFYxYRn4K0AFeGG4xR24xi-nnfOohFQZOfq6zDphwC-Ixg7ru_bmcqdxZMENmSxXK6wo8z0pZJDmS4vXIJcI"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mb-1">
                    Dr. Elena Rostova
                  </h3>
                  <p className="font-label-md text-xs font-semibold text-secondary mb-4 uppercase tracking-wider">
                    Director of Machine Learning
                  </p>
                  <p className="font-body-sm text-sm text-on-surface-variant">
                    Published author on deep learning optimization. Focuses on
                    pragmatic AI implementation for enterprise.
                  </p>
                </div>
              </div>

              {/* Faculty Card 3 */}
              <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="aspect-square bg-surface-container-low w-full relative overflow-hidden">
                  <Image
                    alt="Marcus Chen"
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4jPWbGd6jQ6_VMAXL_91M1bLPIUp80HMTOlkfnY48xCsY1HAi0t-5qNXuhctGvogsw4JtTpVR7FdHCEE3-pnD_Z6gX-R_Sw0LXLNWMz1rwAHestVRqjmIsVuH19cxcz0WZFbs0osvpFAl83otresULr6zjz_-L81-z1xAwg_010P8_Btr6HcXKOWYpvvCy1s8cdCxtj1PfB--OFG5KpaZwspoE8yCrWz6xrFdNQUBNHnMQQivmqEzS6GWo3oe3wNyreQeG37o5n0"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mb-1">
                    Marcus Chen
                  </h3>
                  <p className="font-label-md text-xs font-semibold text-secondary mb-4 uppercase tracking-wider">
                    Lead Instructor, Cryptography
                  </p>
                  <p className="font-body-sm text-sm text-on-surface-variant">
                    Security consultant and open-source contributor. Teaches
                    modern cryptographic protocols and secure coding.
                  </p>
                </div>
              </div>

              {/* Faculty Card 4 */}
              <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="aspect-square bg-surface-container-low w-full relative overflow-hidden">
                  <Image
                    alt="Sarah Jenkins"
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlK9D0UPa87E8AeYHRmooGNBaiWHoc1zeeOjyFkBkpwCvqZ7-4e34LtfkHwVFK0_QbmQwlLohRtdzCELw5kr0pMS04PGeEDGa0uNhUws-_9uI7PlBbh8G_UePp-4DXK0nhdMLAIr6UguplDzv0iydOBBZdPgtSHCu67YV3ZafosR0riGY05-I8EXfYDzmMoG_rd3d0p-dnydrsePTCTqGJZhVtXHCoO_f7827qfp51j9MRPKhyjhlrRWpPcpU-boeSycKF-t6ubQI"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mb-1">
                    Sarah Jenkins
                  </h3>
                  <p className="font-label-md text-xs font-semibold text-secondary mb-4 uppercase tracking-wider">
                    Senior Data Scientist
                  </p>
                  <p className="font-body-sm text-sm text-on-surface-variant">
                    Expert in statistical modeling and data visualization.
                    Bridges the gap between complex data and business strategy.
                  </p>
                </div>
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
                  programs? Our admissions team is here to help.
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
                      Campus Headquarters
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
                      admissions@quantumsystems.edu
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div
                className="w-full h-64 bg-surface-dim rounded-xl border border-border-subtle overflow-hidden relative flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-highest"
                title="Map View: San Francisco"
              >
                <span className="material-symbols-outlined text-4xl mb-2 text-secondary">
                  map
                </span>
                <span className="font-label-md text-xs font-semibold uppercase tracking-wider">
                  Map View: San Francisco
                </span>
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
    </div>
  );
}
