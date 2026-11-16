'use client';

import React from 'react';

export default function CookiesPage() {
  return (
    <div className="bg-surface-bg text-on-surface font-body-md min-h-screen flex flex-col">
      <main className="grow max-w-[800px] mx-auto w-full px-4 py-16">
        <h1 className="font-display-lg text-4xl font-bold mb-8">
          Cookie Policy
        </h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant">
          <p className="mb-4">Last updated: June 2026</p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            What Are Cookies?
          </h2>
          <p className="mb-4">
            Cookies are small text files stored on your device when you visit
            our platform. We use them to enhance your learning experience.
          </p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            How We Use Them
          </h2>
          <p className="mb-4">
            We use essential cookies to keep you logged in and functional
            cookies to remember your theme preferences (like dark mode in the
            code editor).
          </p>
        </div>
      </main>
    </div>
  );
}
