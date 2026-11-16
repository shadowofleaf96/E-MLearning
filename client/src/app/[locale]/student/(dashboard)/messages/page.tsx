'use client';

import React from 'react';
import { MessagingCenter } from '@/modules/messaging/components/MessagingCenter';

export default function StudentMessagesPage() {
  return (
    <div className="max-w-container-max mx-auto space-y-6">
      <div>
        <h1 className="font-headline-lg text-2xl font-bold text-on-surface mb-1">
          Messages & Direct Support
        </h1>
        <p className="text-on-surface-variant text-sm">
          Connect with course instructors and discuss your learning journey.
        </p>
      </div>

      <MessagingCenter />
    </div>
  );
}
