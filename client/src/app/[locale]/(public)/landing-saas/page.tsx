'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  ArrowRight,
  ChevronDown,
  Code,
  Users,
  Flame,
  LineChart,
  CheckCircle,
} from 'lucide-react';

export default function LandingSaasPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="bg-surface-bg font-body-md text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen">
      <main>
        {/* Hero Section */}
        <section
          className="relative overflow-hidden pt-32 pb-32 px-4 md:px-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, #E2E8F0 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        >
          <div className="max-w-container-max mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full border border-outline-variant shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Enterprise-Grade Learning
                </span>
              </div>
              <h1 className="font-headline-lg text-4xl md:text-5xl lg:text-6xl text-primary tracking-tight leading-[1.1] font-bold">
                Master Your Future with{' '}
                <span className="text-secondary">Professional</span> Learning
              </h1>
              <p className="text-base font-medium text-on-surface-variant max-w-2xl mx-auto md:mx-0">
                Join 50,000+ professionals advancing their careers. Our
                enterprise-grade courses feature live mentorship, real-world
                projects, and recognized certifications.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/register"
                  className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform flex items-center justify-center"
                >
                  Get Started
                </Link>
                <Link
                  href="#courses"
                  className="bg-white text-secondary border border-border-subtle px-8 py-4 rounded-xl font-bold text-base hover:bg-surface-bright transition-colors flex items-center justify-center"
                >
                  Browse Courses
                </Link>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto animate-in fade-in zoom-in duration-1000 delay-200">
              <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border border-border-subtle relative bg-surface-container-low">
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                  alt="Learning Network Visual"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white p-6 rounded-xl shadow-xl border border-border-subtle max-w-55 animate-[bounce_3s_infinite]">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-[#F59E0B] fill-current" />
                  <span className="font-bold text-2xl text-primary">4.9/5</span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant">
                  Average student satisfaction across 500+ courses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 border-y border-border-subtle bg-white">
          <div className="max-w-container-max mx-auto px-4 md:px-10 text-center">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-10">
              Trusted by innovative teams worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-xl font-black tracking-tighter text-on-surface">
                ACME Corp
              </div>
              <div className="text-xl font-bold tracking-widest text-on-surface">
                GLOBEX
              </div>
              <div className="text-xl font-serif italic font-bold text-on-surface">
                Soylent
              </div>
              <div className="text-xl font-mono font-bold text-on-surface">
                Initech
              </div>
              <div className="text-xl font-bold text-on-surface">Umbrella</div>
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section id="courses" className="py-20 px-4 md:px-10 bg-surface-bg">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
              <div>
                <h2 className="font-headline-lg text-3xl font-bold text-primary mb-2">
                  Popular Courses
                </h2>
                <p className="text-base font-medium text-on-surface-variant">
                  Join thousands of learners in our most in-demand programs.
                </p>
              </div>
              <Link
                href="#"
                className="text-secondary font-bold flex items-center gap-2 group whitespace-nowrap"
              >
                View All Courses{' '}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Course Card 1 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-border-subtle hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-48 overflow-hidden relative bg-surface-container-low">
                  <Image
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
                    alt="Full Stack Dev"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                    Advanced
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Code Academy Pro
                    </span>
                    <div className="flex items-center gap-1 bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
                      <span className="text-xs font-bold text-on-surface">
                        4.8
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-6 leading-tight group-hover:text-secondary transition-colors">
                    Mastering Full-Stack Web Architecture
                  </h3>
                  <div className="mt-auto flex justify-between items-center border-t border-border-subtle pt-4">
                    <span className="text-xl font-bold text-secondary">
                      $199
                    </span>
                    <button className="bg-surface-container text-on-surface hover:bg-surface-container-high px-5 py-2 rounded-xl font-bold transition-colors text-sm">
                      Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Card 2 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-border-subtle hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-48 overflow-hidden relative bg-surface-container-low">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                    alt="Data Science"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                    Bestseller
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Data Insights Institute
                    </span>
                    <div className="flex items-center gap-1 bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
                      <span className="text-xs font-bold text-on-surface">
                        4.9
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-6 leading-tight group-hover:text-secondary transition-colors">
                    Applied Machine Learning for Business
                  </h3>
                  <div className="mt-auto flex justify-between items-center border-t border-border-subtle pt-4">
                    <span className="text-xl font-bold text-secondary">
                      $249
                    </span>
                    <button className="bg-surface-container text-on-surface hover:bg-surface-container-high px-5 py-2 rounded-xl font-bold transition-colors text-sm">
                      Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Card 3 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-border-subtle hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-48 overflow-hidden relative bg-surface-container-low">
                  <Image
                    src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop"
                    alt="UX Design"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                    New
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Creative Design Lab
                    </span>
                    <div className="flex items-center gap-1 bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
                      <span className="text-xs font-bold text-on-surface">
                        4.7
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-6 leading-tight group-hover:text-secondary transition-colors">
                    Executive UI/UX Design Leadership
                  </h3>
                  <div className="mt-auto flex justify-between items-center border-t border-border-subtle pt-4">
                    <span className="text-xl font-bold text-secondary">
                      $179
                    </span>
                    <button className="bg-surface-container text-on-surface hover:bg-surface-container-high px-5 py-2 rounded-xl font-bold transition-colors text-sm">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features (Bento Grid) */}
        <section className="py-20 px-4 md:px-10 bg-white border-y border-border-subtle">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-3xl font-bold text-primary mb-4">
                Built for Serious Learners
              </h2>
              <p className="text-base font-medium text-on-surface-variant max-w-2xl mx-auto">
                Our platform combines enterprise-grade stability with modern
                learning science to help you achieve your career goals faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 (Large) */}
              <div className="md:col-span-2 bg-surface-bg rounded-2xl border border-border-subtle p-8 flex flex-col justify-between overflow-hidden relative min-h-80 group hover:border-secondary transition-colors">
                <div className="z-10 max-w-sm relative">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Interactive Coding Challenges
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant">
                    Master syntax and logic with our built-in browser IDE
                    supporting over 20 programming languages.
                  </p>
                </div>

                {/* Mock Code Snippet Visual */}
                <div className="absolute -right-8 -bottom-8 w-2/3 max-w-100 bg-[#1E1E1E] rounded-xl p-5 shadow-2xl transform -rotate-2 hidden lg:block border border-white/10 group-hover:rotate-0 group-hover:-translate-y-2 transition-all duration-500">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="font-mono text-sm text-white/80 leading-relaxed overflow-x-hidden">
                    <code>
                      <span className="text-tertiary-fixed">function</span>{' '}
                      <span className="text-secondary-fixed-dim">
                        calculateProgress
                      </span>
                      (streak) {'{\n'}
                      {'  '} <span className="text-tertiary-fixed">const</span>{' '}
                      multiplier = streak {'>'} 10 ? 1.5 : 1.0;{'\n'}
                      {'  '} <span className="text-tertiary-fixed">return</span>{' '}
                      baseXP * multiplier;{'\n'}
                      {'}'}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Feature 2 (Small) */}
              <div className="bg-surface-container-low rounded-2xl border border-border-subtle p-8 flex flex-col group hover:border-secondary transition-colors">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Live Mentorship
                </h3>
                <p className="text-sm font-medium text-on-surface-variant">
                  Connect with industry experts for weekly 1:1 sessions and
                  group workshops to accelerate your path.
                </p>
              </div>

              {/* Feature 3 (Small) */}
              <div className="bg-surface-container-low rounded-2xl border border-border-subtle p-8 flex flex-col group hover:border-secondary transition-colors">
                <div className="w-12 h-12 bg-error/10 text-error rounded-xl flex items-center justify-center mb-6">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Gamified Paths
                </h3>
                <p className="text-sm font-medium text-on-surface-variant">
                  Stay motivated with streaks, XP rewards, and global
                  leaderboards designed for consistent progress.
                </p>
              </div>

              {/* Feature 4 (Large) */}
              <div className="md:col-span-2 bg-surface-bg rounded-2xl border border-border-subtle p-8 flex flex-col md:flex-row items-center gap-8 min-h-80 group hover:border-secondary transition-colors">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Enterprise Analytics
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant">
                    For institutions: track student performance, engagement
                    trends, and ROI with our comprehensive data engine.
                  </p>
                </div>
                <div className="flex-1 w-full bg-white rounded-2xl p-6 shadow-sm border border-border-subtle group-hover:shadow-md transition-shadow">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span>Course Completion</span>
                        <span className="text-secondary">85%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[85%] rounded-full group-hover:w-[90%] transition-all duration-1000"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span>Engagement Score</span>
                        <span className="text-[#4edea3]">65%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-[#4edea3] w-[65%] rounded-full group-hover:w-[75%] transition-all duration-1000 delay-100"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span>Active Streaks</span>
                        <span className="text-error">45%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-error w-[45%] rounded-full group-hover:w-[60%] transition-all duration-1000 delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 md:px-10 bg-surface-bg">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-3xl font-bold text-primary mb-4">
                Student Success Stories
              </h2>
              <p className="text-base font-medium text-on-surface-variant">
                Hear from thousands of professionals who advanced their careers
                with Lumina.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-6 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-base italic font-medium text-on-surface-variant mb-8 grow">
                  "The structured curriculum and 1:1 mentorship sessions were
                  game-changers. I transitioned from a marketing role to a
                  Junior Developer in just 6 months."
                </p>
                <div className="flex items-center gap-4 mt-auto border-t border-border-subtle pt-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-surface-container">
                    <Image
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                      alt="Sarah Chen"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Sarah Chen</p>
                    <p className="text-xs font-medium text-on-surface-variant">
                      Full-Stack Developer
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-6 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-base italic font-medium text-on-surface-variant mb-8 grow">
                  "As a tenant admin, the analytics tools provided by Lumina
                  helped us identify exactly where our employees were
                  struggling, leading to a 40% increase in course completion."
                </p>
                <div className="flex items-center gap-4 mt-auto border-t border-border-subtle pt-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-surface-container">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
                      alt="Marcus Thompson"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Marcus Thompson</p>
                    <p className="text-xs font-medium text-on-surface-variant">
                      HR Director, TechFlow
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-6 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-base italic font-medium text-on-surface-variant mb-8 grow">
                  "The UI/UX course was incredibly deep. I finally feel like I
                  have the portfolio and the confidence to apply for
                  senior-level positions at top agencies."
                </p>
                <div className="flex items-center gap-4 mt-auto border-t border-border-subtle pt-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-surface-container">
                    <Image
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop"
                      alt="Leo Rodriguez"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Leo Rodriguez</p>
                    <p className="text-xs font-medium text-on-surface-variant">
                      Senior Product Designer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4 md:px-10 bg-white border-y border-border-subtle">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-3xl font-bold text-primary mb-4">
                Invest in Your Growth
              </h2>
              <p className="text-base font-medium text-on-surface-variant">
                Flexible plans for individuals and scaling organizations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter */}
              <div className="p-8 rounded-2xl border border-border-subtle flex flex-col bg-surface-bg/50 hover:shadow-sm transition-shadow">
                <h3 className="text-xl font-bold text-primary mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-primary">$0</span>
                  <span className="text-sm font-medium text-on-surface-variant">
                    /free forever
                  </span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant mb-8">
                  Essential tools to start your learning journey.
                </p>

                <ul className="space-y-4 mb-12 flex-1">
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-[#4edea3]" />
                    Access to free workshops
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-[#4edea3]" />
                    Community access
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-[#4edea3]" />
                    Basic coding IDE
                  </li>
                </ul>
                <button className="w-full py-3 rounded-xl border-2 border-secondary text-secondary font-bold hover:bg-secondary/5 transition-colors focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  Start Free
                </button>
              </div>

              {/* Professional */}
              <div className="p-8 rounded-2xl border-2 border-secondary flex flex-col bg-white relative shadow-xl shadow-secondary/5 transform md:-translate-y-4">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Professional
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-primary">$29</span>
                  <span className="text-sm font-medium text-on-surface-variant">
                    /mo
                  </span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant mb-8">
                  Everything you need to master new skills.
                </p>

                <ul className="space-y-4 mb-12 flex-1">
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Unlimited course access
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Live weekly mentorship
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Industry certifications
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Advanced project reviews
                  </li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-secondary text-white font-bold hover:bg-secondary/90 transition-colors shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                  Get Started
                </button>
              </div>

              {/* Enterprise */}
              <div className="p-8 rounded-2xl border border-border-subtle flex flex-col bg-surface-bg/50 hover:shadow-sm transition-shadow">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Enterprise
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-primary">
                    Custom
                  </span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant mb-8">
                  Scale your team's skills with Lumina.
                </p>

                <ul className="space-y-4 mb-12 flex-1">
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-[#4edea3]" />
                    Advanced team analytics
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-[#4edea3]" />
                    Custom learning paths
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-[#4edea3]" />
                    Dedicated account manager
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                    <CheckCircle className="w-5 h-5 text-[#4edea3]" />
                    LMS integration support
                  </li>
                </ul>
                <button className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 md:px-10 bg-surface-bg">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-3xl font-bold text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base font-medium text-on-surface-variant">
                Everything you need to know about starting your learning
                journey.
              </p>
            </div>

            <div className="space-y-4">
              {/* FAQ Items */}
              {[
                {
                  q: 'How do I access my certificates?',
                  a: "Once you successfully complete all modules and assessments in a course, your verified certificate will be automatically generated. You can view, download, or share it directly to LinkedIn from your student dashboard under the 'Achievements' tab.",
                },
                {
                  q: 'Can I cancel my subscription anytime?',
                  a: 'Yes, Lumina Learning is a monthly subscription service with no long-term contracts. You can cancel your Professional plan at any time through your account settings. You will maintain access to your courses until the end of your current billing cycle.',
                },
                {
                  q: 'Do you offer group discounts for teams?',
                  a: "Absolutely. Our Enterprise plan is specifically designed for teams of 10 or more. We offer tiered volume discounts and specialized onboarding for organizations. Please contact our sales team for a custom quote tailored to your institution's needs.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-border-subtle overflow-hidden hover:border-secondary/30 transition-colors"
                >
                  <button
                    className="w-full px-6 py-5 text-left flex justify-between items-center group focus:outline-none focus:bg-surface-bg transition-colors"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span className="font-bold text-primary text-base group-hover:text-secondary transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-secondary' : ''}`}
                    />
                  </button>
                  <div
                    className={`px-6 text-sm font-medium text-on-surface-variant overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
