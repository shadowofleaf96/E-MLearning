'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  return (
    <div className="bg-surface-bg text-on-surface font-body-md antialiased flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="grow max-w-container-max mx-auto w-full px-4 md:px-10 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-24">
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface mb-6">
            Invest in Your Growth
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Choose the plan that fits your learning journey. Whether you're an
            individual upskilling or an institution scaling education.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`font-label-md text-sm ${!isYearly ? 'text-secondary' : 'text-on-surface-variant'}`}
            >
              Monthly
            </span>
            <button
              onClick={toggleBilling}
              aria-checked={isYearly}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              role="switch"
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-secondary transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`}
              ></span>
            </button>
            <span
              className={`font-label-md text-sm flex items-center gap-2 ${isYearly ? 'text-secondary' : 'text-on-surface-variant'}`}
            >
              Annually
              <span className="bg-surface-container-high text-secondary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Save 20%
              </span>
            </span>
          </div>
        </section>

        {/* Individual Plans */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 flex flex-col hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-surface-container-lowest to-surface-container opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
                Starter
              </h3>
              <p className="font-body-sm text-sm text-on-surface-variant mb-6">
                Perfect for exploring new skills.
              </p>
              <div className="mb-8">
                <span className="font-display-lg text-4xl font-bold text-on-surface">
                  $0
                </span>
                <span className="font-body-sm text-sm text-on-surface-variant">
                  /forever
                </span>
              </div>
              <ul className="space-y-4 mb-8 grow">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-base text-on-surface">
                    Access to 50+ basic courses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-base text-on-surface">
                    Community forum access
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-base text-on-surface">
                    Basic coding challenges
                  </span>
                </li>
              </ul>
              <Link
                href="/student/registration"
                className="block text-center w-full bg-surface-container-high text-secondary font-body-md text-base py-3 rounded-lg border border-transparent hover:border-secondary transition-colors font-semibold"
              >
                Start Free
              </Link>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="bg-surface-container-lowest border-2 border-secondary rounded-xl p-8 flex flex-col shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary text-on-secondary px-4 py-1 rounded-bl-lg font-label-md text-xs font-semibold">
              Most Popular
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
                Professional
              </h3>
              <p className="font-body-sm text-sm text-on-surface-variant mb-6">
                Accelerate your career growth.
              </p>
              <div className="mb-8 flex items-end gap-1">
                <span className="font-display-lg text-4xl font-bold text-on-surface transition-all duration-300">
                  ${isYearly ? '24' : '29'}
                </span>
                <span className="font-body-sm text-sm text-on-surface-variant pb-2">
                  /mo
                </span>
              </div>
              <ul className="space-y-4 mb-8 grow">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-base text-on-surface">
                    Unlimited access to all courses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-base text-on-surface">
                    Advanced projects & code reviews
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-base text-on-surface">
                    Verified Certificates
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-base text-on-surface">
                    1-on-1 Mentor matching
                  </span>
                </li>
              </ul>
              <Link
                href="/student/registration"
                className="block text-center w-full bg-secondary text-on-secondary font-body-md text-base py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-sm"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </section>

        {/* Enterprise / Tenant Plan */}
        <section
          id="enterprise"
          className="bg-linear-to-br from-[#0b1c30] to-[#131b2e] rounded-2xl p-8 md:p-12 mb-24 text-white flex flex-col md:flex-row gap-12 items-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          ></div>
          <div className="md:w-1/2 relative z-10">
            <span className="inline-block border border-[#6ffbbe] text-tertiary-fixed px-3 py-1 rounded-full font-label-md text-xs font-semibold mb-6 uppercase tracking-wider">
              For Organizations
            </span>
            <h2 className="font-headline-lg text-3xl md:text-4xl font-bold mb-4">
              Lumina Enterprise
            </h2>
            <p className="font-body-lg text-lg text-blue-200/70 mb-8">
              Build your own branded learning ecosystem. We provide the
              infrastructure, you provide the vision.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col">
                <span className="material-symbols-outlined text-tertiary-fixed mb-2 text-2xl">
                  dashboard_customize
                </span>
                <h4 className="font-headline-md text-lg font-bold text-white mb-1">
                  White-labeling
                </h4>
                <p className="font-body-sm text-sm text-blue-200/70">
                  Custom domains, logos, and brand colors.
                </p>
              </div>
              <div className="flex flex-col">
                <span className="material-symbols-outlined text-tertiary-fixed mb-2 text-2xl">
                  analytics
                </span>
                <h4 className="font-headline-md text-lg font-bold text-white mb-1">
                  Advanced Analytics
                </h4>
                <p className="font-body-sm text-sm text-blue-200/70">
                  Deep insights into cohort performance.
                </p>
              </div>
              <div className="flex flex-col">
                <span className="material-symbols-outlined text-tertiary-fixed mb-2 text-2xl">
                  integration_instructions
                </span>
                <h4 className="font-headline-md text-lg font-bold text-white mb-1">
                  LMS Integration
                </h4>
                <p className="font-body-sm text-sm text-blue-200/70">
                  Seamless API connects with existing tools.
                </p>
              </div>
              <div className="flex flex-col">
                <span className="material-symbols-outlined text-tertiary-fixed mb-2 text-2xl">
                  support_agent
                </span>
                <h4 className="font-headline-md text-lg font-bold text-white mb-1">
                  Dedicated Success
                </h4>
                <p className="font-body-sm text-sm text-blue-200/70">
                  Priority support and onboarding manager.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex bg-white text-[#131b2e] px-6 py-3 rounded-lg font-body-md text-base font-semibold hover:bg-gray-100 transition-colors items-center gap-2"
            >
              Contact Sales
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="md:w-1/2 relative z-10 w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl">
            <Image
              alt="Team reviewing analytics dashboard"
              fill
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx9fErn7N949MtQ0Zvm36GyXBuGi3Eu-KGaKjhf8aFNbtpH_70casGjU9ZkbG0gitMOz8EoYcFzBHsgw5jCvseCy0E5G0-XfWdKFpzrp3LhzdxYR2FGKS0y3_NK_Ge7tPTvN7hP39NH6R-ea4sE23Dbeb_VPmTXh_QVyRqnhihAA9DmLLN5ebFDvq5WJb4VVavpilIsNjfxLWBtWornQ_bdNto-YsqPFrUzpNWpBEo9NwUwEVVgjEU3mV_si1qz9SibTG_Orv2_bo"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
