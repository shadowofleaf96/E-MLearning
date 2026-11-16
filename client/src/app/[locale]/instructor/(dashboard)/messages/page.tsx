'use client';

import React from 'react';
import { MessagingCenter } from '@/modules/messaging/components/MessagingCenter';

export default function InstructorMessagesPage() {
  return (
    <div className="max-w-container-max mx-auto space-y-6">
      <div>
        <h1 className="font-headline-lg text-2xl font-bold text-on-surface mb-1">
          Instructor Communications
        </h1>
        <p className="text-on-surface-variant text-sm">
          Chat directly with your students, provide mentorship, and answer questions.
        </p>
      </div>

      <MessagingCenter />
    </div>
  );
}
