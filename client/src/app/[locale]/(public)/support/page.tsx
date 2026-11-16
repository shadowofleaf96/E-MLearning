'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  Search,
  ChevronRight,
  BookOpen,
  MessageCircle,
  FileText,
  PlayCircle,
} from 'lucide-react';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description:
        'Everything you need to know to set up your account and begin learning.',
      icon: <PlayCircle className="w-6 h-6 text-white" />,
      articlesCount: 12,
    },
    {
      id: 'account-billing',
      title: 'Account & Billing',
      description: 'Manage your profile, subscriptions, and payment methods.',
      icon: <FileText className="w-6 h-6 text-white" />,
      articlesCount: 8,
    },
    {
      id: 'courses-certificates',
      title: 'Courses & Certificates',
      description:
        'Navigating courses, submitting assignments, and earning certificates.',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      articlesCount: 24,
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Solutions for common technical issues and platform errors.',
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      articlesCount: 15,
    },
  ];

  const popularArticles = [
    'How do I reset my password?',
    'Where can I find my course certificates?',
    'How to cancel my monthly subscription',
    'Troubleshooting video playback issues',
    'How to contact your instructor',
  ];

  const [filteredArticles, setFilteredArticles] = useState(popularArticles);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(popularArticles);
      return;
    }
    const filtered = popularArticles.filter((article) =>
      article.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
    if (filtered.length === 0) {
      toast.info('No articles found matching your query.');
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      {/* Hero Section */}
      <section className="bg-surface-card border-b border-border-subtle pt-16 pb-20 px-4 md:px-10">
        <div className="max-w-container-max mx-auto text-center">
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface mb-6">
            How can we help you today?
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Search our knowledge base or browse categories to find answers to
            your questions.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-outline" />
            </div>
            <input
              type="text"
              className="w-full bg-surface-bright border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-lg font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors shadow-sm"
              placeholder="Search for articles, guides, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-2 right-2 bg-secondary text-white font-bold px-6 rounded-xl hover:bg-secondary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-container-max mx-auto px-4 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Categories Grid */}
        <div className="lg:col-span-8 space-y-8">
          <h2 className="font-headline-lg text-2xl font-bold text-on-surface">
            Browse Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Link
                href={`/support/${category.id}`}
                key={category.id}
                className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 hover:shadow-md hover:border-secondary/30 transition-all group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#005BCC] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    {category.icon}
                  </div>
                  <span className="text-xs font-bold text-[#005BCC] bg-[#005BCC]/10 px-3 py-1 rounded-full">
                    {category.articlesCount} articles
                  </span>
                </div>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-2 group-hover:text-secondary transition-colors">
                  {category.title}
                </h3>
                <p className="font-body-sm text-on-surface-variant grow">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Popular Articles */}
          <div className="bg-surface-card border border-border-subtle rounded-2xl p-8">
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-6">
              Popular Articles
            </h3>
            <ul className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, idx) => (
                  <li key={idx}>
                    <Link
                      href="#"
                      className="flex items-center justify-between group"
                    >
                      <span className="font-body-md text-sm text-on-surface-variant group-hover:text-secondary transition-colors line-clamp-1">
                        {article}
                      </span>
                      <ChevronRight className="w-4 h-4 text-outline group-hover:text-secondary transition-colors" />
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-on-surface-variant italic">
                  No articles found.
                </li>
              )}
            </ul>
          </div>

          {/* Still Need Help CTA */}
          <div className="bg-[#151E2D] rounded-2xl p-8 text-center relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <h3 className="font-headline-md text-xl font-bold text-white mb-3">
                Still need help?
              </h3>
              <p className="font-body-sm text-slate-300 mb-6">
                Our support team is available 24/7 to assist you with any
                questions.
              </p>
              <Link
                href="/contact"
                className="inline-block w-full bg-[#005BCC] text-white font-bold py-3 rounded-xl hover:bg-[#004A99] transition-colors shadow-md"
              >
                Contact Support
              </Link>
            </div>
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#005BCC] opacity-20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
