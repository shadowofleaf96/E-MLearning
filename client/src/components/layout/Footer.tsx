import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8">
      <div className="max-w-container-max mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold mb-6 font-headline-md">
              Lumina Learning
            </div>
            <p className="text-blue-200/70 font-body-sm text-sm max-w-50">
              Empowering the next generation of technologists through expert-led
              learning experiences.
            </p>
          </div>
          <div>
            <h4 className="font-headline-md text-base font-bold mb-6">
              Platform
            </h4>
            <ul className="flex flex-col gap-4 text-blue-200/70 font-body-sm text-sm">
              <li>
                <Link
                  href="/courses"
                  className="hover:text-white transition-colors"
                >
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/mentorship"
                  className="hover:text-white transition-colors"
                >
                  Live Mentorship
                </Link>
              </li>
              <li>
                <Link
                  href="/instructor"
                  className="hover:text-white transition-colors"
                >
                  Instructor Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/enterprise"
                  className="hover:text-white transition-colors"
                >
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline-md text-base font-bold mb-6">
              Support
            </h4>
            <ul className="flex flex-col gap-4 text-blue-200/70 font-body-sm text-sm">
              <li>
                <Link
                  href="/support"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="hover:text-white transition-colors"
                >
                  System Status
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline-md text-base font-bold mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-blue-200/70 font-body-sm text-sm">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-white transition-colors"
                >
                  Cookie Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="hover:text-white transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-200/50 font-body-sm text-sm">
          <p>© 2024 Lumina Learning Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Twitter
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              LinkedIn
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
