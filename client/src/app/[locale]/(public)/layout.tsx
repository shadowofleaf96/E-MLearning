import React from 'react';
import GuestNavbar from '@/components/layout/GuestNavbar';
import Footer from '@/components/layout/Footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      <GuestNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
