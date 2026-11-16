'use client';

import React from 'react';

export default function AccessibilityPage() {
  return (
    <div className="bg-surface-bg text-on-surface font-body-md min-h-screen flex flex-col">
      <main className="grow max-w-[800px] mx-auto w-full px-4 py-16">
        <h1 className="font-display-lg text-4xl font-bold mb-8">
          Accessibility Statement
        </h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant">
          <p className="mb-4">
            Lumina Learning is committed to ensuring digital accessibility for
            people with disabilities. We are continually improving the user
            experience for everyone, and applying the relevant accessibility
            standards.
          </p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            Conformance Status
          </h2>
          <p className="mb-4">
            The Web Content Accessibility Guidelines (WCAG) defines requirements
            for designers and developers to improve accessibility for people
            with disabilities. We strive to meet WCAG 2.1 level AA conformance.
          </p>
          <h2 className="font-headline-md text-2xl font-bold mt-8 mb-4 text-on-surface">
            Feedback
          </h2>
          <p className="mb-4">
            We welcome your feedback on the accessibility of Lumina Learning.
            Please let us know if you encounter accessibility barriers at
            accessibility@luminalearning.com.
          </p>
        </div>
      </main>
    </div>
  );
}
