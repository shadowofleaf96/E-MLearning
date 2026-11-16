'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-surface-bg text-on-surface font-body-md min-h-screen flex flex-col">
      <main className="grow max-w-[800px] mx-auto w-full px-4 py-16">
        <h1 className="font-display-lg text-4xl font-bold mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant">
          <p className="mb-4">Last updated: June 2026</p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including
            when you create an account, update your profile, use our interactive
            learning tools, or communicate with us.
          </p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            2. How We Use Information
          </h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve
            our services, including delivering personalized learning paths and
            calculating XP and streaks.
          </p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            3. Contact Us
          </h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at privacy@luminalearning.com.
          </p>
        </div>
      </main>
    </div>
  );
}
