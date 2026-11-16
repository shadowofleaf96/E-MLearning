'use client';

import React from 'react';

export default function StatusPage() {
  const services = [
    { name: 'Core Application', status: 'Operational', uptime: '99.99%' },
    { name: 'Authentication (SSO)', status: 'Operational', uptime: '99.98%' },
    { name: 'Video Delivery', status: 'Operational', uptime: '99.95%' },
    {
      name: 'Live Mentorship Classrooms',
      status: 'Operational',
      uptime: '99.99%',
    },
    { name: 'Payment Processing', status: 'Operational', uptime: '100%' },
  ];

  return (
    <div className="bg-surface-bg text-on-surface font-body-md antialiased flex flex-col min-h-screen">
      <main className="grow w-full max-w-[1000px] mx-auto px-4 md:px-10 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display-md text-3xl md:text-4xl font-bold mb-4">
            System Status
          </h1>
          <p className="text-on-surface-variant text-lg">
            Current status of Lumina Learning systems and services.
          </p>
        </div>

        {/* Global Status Banner */}
        <div className="bg-secondary-container text-on-secondary-container border border-secondary/20 rounded-2xl p-6 flex items-center gap-4 mb-12 shadow-sm">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-white text-2xl">
              check
            </span>
          </div>
          <div>
            <h2 className="font-headline-md text-xl font-bold">
              All Systems Operational
            </h2>
            <p className="text-on-secondary-container/80 text-sm mt-1">
              As of{' '}
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden mb-16 shadow-sm">
          <div className="p-6 border-b border-border-subtle bg-surface-container-lowest">
            <h3 className="font-headline-sm text-lg font-bold">Services</h3>
          </div>
          <ul className="divide-y divide-border-subtle">
            {services.map((service, index) => (
              <li
                key={index}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-lowest transition-colors"
              >
                <span className="font-bold text-on-surface">
                  {service.name}
                </span>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface-variant text-sm font-medium">
                      Uptime: {service.uptime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary shadow-sm"></span>
                    <span className="text-sm font-bold text-secondary">
                      {service.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Past Incidents */}
        <div>
          <h3 className="font-headline-sm text-2xl font-bold mb-6">
            Past Incidents
          </h3>
          <div className="border-l-2 border-border-subtle pl-6 py-2">
            <p className="text-on-surface-variant italic">
              No incidents reported in the past 14 days.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
