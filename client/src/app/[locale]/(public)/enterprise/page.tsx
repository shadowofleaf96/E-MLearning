'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  BarChart,
  Lock,
  Globe2,
  Zap,
} from 'lucide-react';

export default function EnterprisePage() {
  return (
    <div className="bg-surface-bg text-on-surface antialiased font-body-md flex flex-col min-h-screen selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Main Content */}
      <main className="grow pt-24 pb-16 w-full">
        {/* Hero Section */}
        <section className="relative w-full max-w-container-max mx-auto px-4 md:px-10 mb-24 md:mb-32">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary-container/20 rounded-l-full blur-3xl -z-10 opacity-60"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container-low text-secondary font-label-md text-xs font-bold uppercase tracking-widest mb-8 border border-secondary/20">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                Lumina for Enterprise
              </div>
              <h1 className="font-display-lg text-5xl md:text-6xl lg:text-7xl text-on-surface mb-8 font-bold leading-[1.1] tracking-tight">
                Scale learning across your{' '}
                <span className="text-secondary">entire workforce.</span>
              </h1>
              <p className="font-body-lg text-lg md:text-xl text-on-surface-variant mb-10 max-w-xl leading-relaxed">
                Transform your organization with a modern, secure, and highly
                scalable learning platform designed to close skill gaps and
                accelerate technical innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-secondary text-white font-label-lg text-base font-bold px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                >
                  Request a Demo <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing#enterprise"
                  className="bg-surface text-on-surface font-label-lg text-base font-bold px-8 py-4 rounded-xl hover:bg-surface-container-low transition-all active:scale-95 border border-border-subtle flex items-center justify-center shadow-sm"
                >
                  View Enterprise Pricing
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 text-on-surface-variant text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span>SSO & SCIM Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span>Dedicated Support</span>
                </div>
              </div>
            </div>

            {/* Visual Right Side */}
            <div className="relative lg:ml-auto w-full max-w-lg aspect-square">
              {/* Abstract Dashboard Representation */}
              <div className="absolute inset-0 bg-surface-card border border-border-subtle rounded-3xl shadow-xl overflow-hidden flex flex-col z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="h-12 border-b border-border-subtle bg-surface-container-lowest flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="p-8 grow flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Total Completion
                      </div>
                      <div className="text-3xl font-display-md font-bold text-on-surface">
                        94.2%
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-secondary flex items-center justify-center text-secondary font-bold bg-secondary-container-low">
                      +12%
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-4 bg-surface-container rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-secondary"></div>
                    </div>
                    <div className="h-4 bg-surface-container rounded-full overflow-hidden">
                      <div className="w-[60%] h-full bg-tertiary"></div>
                    </div>
                    <div className="h-4 bg-surface-container rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-primary"></div>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-border-subtle">
                      <div className="text-2xl font-bold text-on-surface">
                        12k+
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Active Learners
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-border-subtle">
                      <div className="text-2xl font-bold text-on-surface">
                        450+
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Live Sessions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/20 rounded-full blur-3xl z-0"></div>
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-tertiary/20 rounded-full blur-3xl z-0"></div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-y border-border-subtle bg-surface-container-lowest py-16 px-4 md:px-10 mb-24">
          <div className="max-w-container-max mx-auto text-center">
            <p className="font-label-md text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-10">
              Trusted by innovative engineering teams worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholder Logos for Trust */}
              <div className="text-xl font-display-md font-bold text-on-surface flex items-center gap-2">
                <Globe2 className="w-6 h-6" /> Acme Corp
              </div>
              <div className="text-xl font-display-md font-bold text-on-surface flex items-center gap-2">
                <Zap className="w-6 h-6" /> Innotech
              </div>
              <div className="text-xl font-display-md font-bold text-on-surface flex items-center gap-2">
                <Building2 className="w-6 h-6" /> Globex
              </div>
              <div className="text-xl font-display-md font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="w-6 h-6" /> NextGen
              </div>
            </div>
          </div>
        </section>

        {/* Core Enterprise Features */}
        <section className="max-w-container-max mx-auto px-4 md:px-10 mb-24 md:mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="font-display-md text-3xl md:text-5xl font-bold text-on-surface mb-6">
              Built for scale, designed for impact.
            </h2>
            <p className="font-body-lg text-lg text-on-surface-variant">
              Provide your teams with a premium learning experience that matches
              the tools they use every day. Manage everything from a powerful
              admin dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-surface-card p-10 rounded-3xl border border-border-subtle shadow-sm hover:shadow-md hover:border-secondary/30 transition-all group">
              <div className="w-16 h-16 bg-secondary-container-low rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-4">
                Advanced Team Management
              </h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
                Organize users by department, assign customized learning paths,
                and delegate administrative roles with granular permissions.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-surface-card p-10 rounded-3xl border border-border-subtle shadow-sm hover:shadow-md hover:border-secondary/30 transition-all group">
              <div className="w-16 h-16 bg-primary-container-low rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <BarChart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-4">
                Enterprise Analytics
              </h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
                Gain actionable insights into learning performance. Export
                custom reports, track ROI, and identify skill gaps across your
                organization.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-surface-card p-10 rounded-3xl border border-border-subtle shadow-sm hover:shadow-md hover:border-secondary/30 transition-all group">
              <div className="w-16 h-16 bg-tertiary-container-low rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-tertiary" />
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-4">
                Enterprise-Grade Security
              </h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
                SOC2 compliant infrastructure, SAML SSO integration, custom data
                retention policies, and dedicated tenant isolation.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Deep Dive - White-labeling */}
        <section className="max-w-container-max mx-auto px-4 md:px-10 mb-24 md:mb-32">
          <div className="bg-surface-card border border-border-subtle rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="font-display-md text-3xl md:text-4xl font-bold text-on-surface mb-6">
                  Your platform, your brand.
                </h2>
                <p className="font-body-lg text-lg text-on-surface-variant mb-8 leading-relaxed">
                  Lumina Enterprise provides complete white-labeling
                  capabilities. Customize the look and feel of the platform to
                  match your corporate identity, ensuring a seamless experience
                  for your employees.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 font-medium text-on-surface">
                    <div className="w-6 h-6 rounded-full bg-secondary-container-low flex items-center justify-center text-secondary">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    Custom Domain & SSL
                  </li>
                  <li className="flex items-center gap-3 font-medium text-on-surface">
                    <div className="w-6 h-6 rounded-full bg-secondary-container-low flex items-center justify-center text-secondary">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    Brand Colors & Typography
                  </li>
                  <li className="flex items-center gap-3 font-medium text-on-surface">
                    <div className="w-6 h-6 rounded-full bg-secondary-container-low flex items-center justify-center text-secondary">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    Customized Certificates
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] bg-surface rounded-2xl border border-border-subtle shadow-lg p-6 relative z-10">
                  {/* Mockup of customization panel */}
                  <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
                    <div className="font-bold text-on-surface">
                      Theme Settings
                    </div>
                    <div className="text-xs bg-secondary text-white px-3 py-1 rounded-full font-bold">
                      Active
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-bold text-on-surface-variant uppercase mb-3">
                        Primary Color
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary shadow-inner ring-2 ring-offset-2 ring-secondary"></div>
                        <div className="w-10 h-10 rounded-full bg-primary shadow-inner"></div>
                        <div className="w-10 h-10 rounded-full bg-tertiary shadow-inner"></div>
                        <div className="w-10 h-10 rounded-full bg-error shadow-inner"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface-variant uppercase mb-3">
                        Typography
                      </div>
                      <div className="bg-surface-container p-3 rounded-lg border border-border-subtle flex justify-between items-center">
                        <span className="font-medium text-on-surface">
                          Inter (Default)
                        </span>
                        <ChevronDownIcon className="w-4 h-4 text-on-surface-variant" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-secondary-container rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-4 md:px-10">
          <div className="bg-on-surface rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-on-surface to-on-surface-variant opacity-50 z-0"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-display-lg text-4xl md:text-5xl font-bold text-surface mb-8">
                Ready to transform your organization's learning culture?
              </h2>
              <p className="font-body-lg text-xl text-outline-variant mb-12">
                Join hundreds of industry leaders who trust Lumina to upskill
                their teams.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-secondary text-white font-label-lg text-lg font-bold px-10 py-5 rounded-xl hover:bg-opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  Contact Sales <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
