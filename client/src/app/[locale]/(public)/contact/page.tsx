'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/services/api';
import {
  Send,
  Headset,
  Mail,
  Clock,
  Building2,
  Phone,
  Building,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-bg text-on-surface min-h-screen flex flex-col selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Main Content */}
      <main className="grow pt-24 md:pt-32 pb-16">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-4 md:px-10 mb-16 text-center">
          <h1 className="font-headline-lg text-4xl md:text-5xl font-bold text-on-surface mb-4">
            Get in Touch
          </h1>
          <p className="font-medium text-lg text-on-surface-variant max-w-2xl mx-auto">
            We're here to help you build institutional excellence. Reach out to
            our specialized support teams.
          </p>
        </section>

        {/* Contact Grid */}
        <section className="max-w-container-max mx-auto px-4 md:px-10 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Support Form (Left/Main) */}
          <div className="lg:col-span-8 bg-surface-card border border-border-subtle rounded-2xl p-8 shadow-sm">
            <h2 className="font-headline-lg text-3xl font-bold mb-6 text-on-surface">
              Send us a message
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-bright border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors"
                    placeholder="Jane Doe"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-bright border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors"
                    placeholder="jane@institution.edu"
                    type="email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-surface-bright border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select an inquiry type</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing &amp; Subscriptions</option>
                  <option value="partnership">Institutional Partnership</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-surface-bright border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors resize-none"
                  placeholder="How can we assist you today?"
                  rows={5}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-secondary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>

          {/* Institute Contact Info (Right/Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1 */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Headset className="w-6 h-6" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Platform Support
                </h3>
              </div>
              <div className="space-y-3 text-sm font-medium text-on-surface-variant">
                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-on-surface-variant/70" />{' '}
                  support@luminalearning.com
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-on-surface-variant/70" />{' '}
                  Mon-Fri, 9am - 6pm PT
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Institutional Inquiries
                </h3>
              </div>
              <div className="space-y-3 text-sm font-medium text-on-surface-variant">
                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-on-surface-variant/70" />{' '}
                  enterprise@luminalearning.com
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-on-surface-variant/70" /> +1
                  (800) 555-0199
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Corporate Headquarters
                </h3>
              </div>
              <div className="space-y-3 text-sm font-medium text-on-surface-variant">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-on-surface-variant/70 shrink-0 mt-0.5" />
                  <span>
                    100 Innovation Drive
                    <br />
                    San Francisco, CA 94105
                    <br />
                    United States
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="mb-16 w-full h-[400px] bg-surface-container border-y border-border-subtle relative overflow-hidden flex items-center justify-center">
          <Image
            alt="Map of San Francisco Headquarters"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQHXLFnC0xgde3Lrk-tfkw6GcfUGlNG2tXm-FiOroIyHjoU9LMC3jRs_0MLCbFPT3RKy8yXYhg0wmwwTRJ7H51jASruDxM_fQ8yqHaqtmt2DE8MUzHGmzzR-f_MK5aaww4c5XFY3JDOh56vkFBf42jr47rfowcA_lSI7v2_Pd9cI8U89piCXaE_kLNIWontgY65VP7Ns37S5qWGVOWB4CIAFvM20CpYwaCpcnFXwjXgAk3yhgggXIHEalBxkMVCK2hjK4i3u-_544"
            fill
          />
          <div className="relative z-10 bg-surface-card/90 backdrop-blur-md border border-border-subtle rounded-2xl p-6 shadow-md max-w-sm text-center">
            <MapPin className="text-secondary w-10 h-10 mx-auto mb-2" />
            <h4 className="font-headline-md text-2xl font-bold text-on-surface mb-1">
              Lumina HQ
            </h4>
            <p className="text-sm font-medium text-on-surface-variant">
              San Francisco, CA
            </p>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="max-w-3xl mx-auto px-4 md:px-10 text-center bg-surface-container-low border border-border-subtle rounded-2xl p-10 shadow-sm">
          <h3 className="font-headline-lg text-3xl font-bold text-on-surface mb-3">
            Looking for quick answers?
          </h3>
          <p className="text-base font-medium text-on-surface-variant mb-6">
            Many common institutional and technical questions are already
            answered in our comprehensive knowledge base.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-secondary font-bold text-sm hover:text-secondary/80 transition-colors focus:outline-none"
          >
            Visit our FAQ
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
