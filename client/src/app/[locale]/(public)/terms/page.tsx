'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-surface-bg text-on-surface font-body-md min-h-screen flex flex-col">
      <main className="grow max-w-[800px] mx-auto w-full px-4 py-16">
        <h1 className="font-display-lg text-4xl font-bold mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant">
          <p className="mb-4">Last updated: June 2026</p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing or using our learning platform, you agree to be bound
            by these Terms of Service and all applicable laws and regulations.
          </p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            2. User Accounts
          </h2>
          <p className="mb-4">
            You must create an account to access our professional courses. You
            are responsible for safeguarding your account credentials.
          </p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            3. Content and Intellectual Property
          </h2>
          <p className="mb-4">
            All courses, coding challenges, and materials provided on the
            platform are the intellectual property of Lumina Learning or our
            educational partners.
          </p>
        </div>
      </main>
    </div>
  );
}
