'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCertificates } from '@/store/slices/certificateSlice';
import { fetchGamificationStats } from '@/store/slices/gamificationSlice';
import {
  Share2,
  BadgeCheck,
  Download,
  Sparkles,
  TerminalSquare,
  Brain,
  ChevronRight,
} from 'lucide-react';

export default function CertificatesPage() {
  const dispatch = useAppDispatch();
  const { certificates, loading: certLoading } = useAppSelector(
    (state) => state.certificate
  );
  const { stats, loading: statsLoading } = useAppSelector(
    (state) => state.gamification
  );

  useEffect(() => {
    dispatch(fetchCertificates());
    dispatch(fetchGamificationStats());
  }, [dispatch]);

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed space-y-16 pb-16">
      {/* Hero Header */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-3">
              My Certificates
            </h2>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
              Validate your expertise and showcase your professional milestones.
              Your earned credentials are a testament to your commitment to
              excellence.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-surface-container-low border border-border-subtle px-4 py-2.5 rounded-lg font-label-md font-semibold hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-secondary">
              <Share2 className="w-5 h-5" />
              Share Profile
            </button>
          </div>
        </div>
      </section>

      {/* Certificates Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {certLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-surface-card rounded-2xl border border-border-subtle h-80 animate-pulse"
              ></div>
            ))
        ) : certificates && certificates.length > 0 ? (
          certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 bg-surface-container-low overflow-hidden flex items-center justify-center">
                {cert.course?.thumbnail ? (
                  <Image
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={cert.course.title}
                    src={cert.course.thumbnail}
                  />
                ) : (
                  <BadgeCheck className="w-16 h-16 text-secondary opacity-50" />
                )}
                <div className="absolute inset-0 bg-primary/5"></div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline-md text-xl font-bold text-on-surface mb-1 leading-tight line-clamp-2">
                      {cert.course?.title || 'Course Certificate'}
                    </h3>
                    <p className="text-sm text-on-surface-variant font-medium">
                      Completed {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <BadgeCheck className="text-secondary w-6 h-6 flex-shrink-0" />
                </div>
                <div className="mt-auto pt-6 space-y-4">
                  <button className="w-full bg-secondary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-opacity focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 shadow-sm">
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  <Link
                    href={`/verify-certificate/${cert.verificationCode}`}
                    className="block text-center text-secondary font-bold text-sm hover:underline"
                  >
                    Verify Certificate
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-surface-container-lowest border border-dashed border-border-subtle rounded-2xl">
            <BadgeCheck className="w-12 h-12 text-on-surface-variant opacity-50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-2">
              No certificates yet
            </h3>
            <p className="text-on-surface-variant max-w-md mx-auto">
              Complete courses to earn certificates and validate your expertise.
            </p>
          </div>
        )}
      </section>

      {/* Motivation: Upcoming Certificates */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-xp-gold w-8 h-8" />
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">
            In Progress & Upcoming
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {statsLoading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest border border-border-subtle rounded-2xl h-32 animate-pulse"
                ></div>
              ))
          ) : stats?.goals && stats.goals.length > 0 ? (
            stats.goals.slice(0, 2).map((goal: any, idx: number) => (
              <div
                key={idx}
                className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="w-full md:w-32 h-24 bg-surface-container-low rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-surface-container transition-colors">
                  {idx % 2 === 0 ? (
                    <TerminalSquare className="text-outline-variant w-12 h-12" />
                  ) : (
                    <Brain className="text-outline-variant w-12 h-12" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline-md text-lg font-bold text-on-surface line-clamp-1">
                      {goal.title}
                    </h4>
                    <span className="text-sm font-bold text-secondary">
                      {goal.progress}%
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium mb-4 line-clamp-1">
                    {goal.subtitle || 'Active Goal'}
                  </p>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-1000"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="p-2 hover:bg-surface-container rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary">
                    <ChevronRight className="w-6 h-6 text-on-surface-variant" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-on-surface-variant italic">
              No upcoming goals at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Learning Stats / Achievement Summary */}
      <section className="bg-primary-container text-on-primary-fixed rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-headline-lg text-3xl font-bold text-white mb-4">
              Unlock Your Potential
            </h3>
            <p className="font-body-lg text-lg text-on-primary-container max-w-md">
              You've earned 3 certificates this quarter. Complete 2 more to
              achieve the 'Academic Pioneer' badge and earn a 500 XP bonus!
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center w-36">
              <div className="font-display-lg text-5xl font-bold text-white leading-none mb-3">
                {certificates?.length || 0}
              </div>
              <div className="font-label-md text-xs font-bold text-on-primary-container uppercase tracking-wider">
                Total
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center w-36">
              <div className="font-display-lg text-5xl font-bold text-xp-gold leading-none mb-3">
                {certificates?.length ? Math.min(3, certificates.length) : 0}
              </div>
              <div className="font-label-md text-xs font-bold text-on-primary-container uppercase tracking-wider">
                New
              </div>
            </div>
          </div>
        </div>

        {/* Abstract Background Ornaments */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary opacity-20 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-xp-gold opacity-10 blur-[100px] translate-y-1/2 -translate-x-1/2 rounded-full"></div>
      </section>
    </div>
  );
}
