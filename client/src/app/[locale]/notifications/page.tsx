'use client';

import React, { useState } from 'react';
import {
  CheckCheck,
  Video,
  Calendar,
  Award,
  PartyPopper,
  Trophy,
} from 'lucide-react';

import api from '@/services/api';

type Tab = 'all' | 'reminders' | 'exams' | 'live';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.map((notif) =>
          api.patch(`/notifications/${notif.id}/read`)
        )
      );
      setNotifications(
        notifications.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto py-12 selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-3xl font-bold text-primary">
            Notifications
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Stay updated with your learning progress and upcoming events.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="px-5 py-2.5 bg-surface-container-lowest border border-border-subtle rounded-xl text-sm font-bold hover:bg-surface-container-low transition-all flex items-center gap-2 shadow-sm focus:outline-none"
        >
          <CheckCheck className="w-5 h-5" />
          Mark all as read
        </button>
      </div>

      {/* Tabs/Filters */}
      <div className="flex border-b border-border-subtle mb-8 gap-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-4 font-bold text-sm uppercase tracking-wider transition-all focus:outline-none whitespace-nowrap ${
            activeTab === 'all'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`pb-4 font-bold text-sm uppercase tracking-wider transition-all focus:outline-none whitespace-nowrap ${
            activeTab === 'reminders'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Reminders
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`pb-4 font-bold text-sm uppercase tracking-wider transition-all focus:outline-none whitespace-nowrap ${
            activeTab === 'exams'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Exams
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`pb-4 font-bold text-sm uppercase tracking-wider transition-all focus:outline-none whitespace-nowrap ${
            activeTab === 'live'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Live Sessions
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications
          .filter((notif) => activeTab === 'all' || notif.type === activeTab)
          .map((notif) => {
            let Icon = CheckCheck;
            if (notif.type === 'live') Icon = Video;
            if (notif.type === 'reminders') Icon = Calendar;
            if (notif.type === 'exams') Icon = Award;
            if (notif.type === 'system') Icon = PartyPopper;

            return (
              <div
                key={notif.id}
                className={`group relative bg-surface-container-lowest p-5 rounded-2xl border border-border-subtle flex gap-5 transition-all animate-in fade-in duration-300 ${
                  notif.isRead
                    ? 'opacity-80 hover:opacity-100'
                    : 'hover:shadow-md'
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-secondary rounded-r-full"></div>
                )}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                    <h4 className="font-bold text-primary">{notif.title}</h4>
                    <span className="text-xs font-medium text-on-surface-variant whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant mb-4">
                    {notif.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="px-4 py-2 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary/90 transition-colors focus:outline-none"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Empty State */}
      {notifications.filter(
        (notif) => activeTab === 'all' || notif.type === activeTab
      ).length === 0 && (
        <div className="py-12 text-center text-on-surface-variant text-sm font-medium">
          No notifications found.
        </div>
      )}

      {/* Promotional Achievement Card */}
      <div className="mt-12 p-8 sm:p-10 rounded-[2rem] bg-[#131b2e] relative overflow-hidden group">
        <div className="relative z-10 max-w-md">
          <span className="inline-block px-3 py-1 rounded-md bg-secondary-container text-white font-bold text-[10px] uppercase tracking-wider mb-5">
            Goal Reached
          </span>
          <h3 className="font-headline-lg text-3xl font-bold text-white mb-3">
            The Power User Badge
          </h3>
          <p className="text-[#7c839b] text-base font-medium mb-8">
            You've accessed Lumina Learning for 14 consecutive days! You're in
            the top 5% of active students this month.
          </p>
          <button className="px-6 py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all flex items-center gap-2 focus:outline-none">
            Claim Reward
            <PartyPopper className="w-4 h-4 text-primary" />
          </button>
        </div>

        {/* Abstract BG Element */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity"></div>
        <div className="absolute right-4 -bottom-10 opacity-10">
          <Trophy className="w-[200px] h-[200px] text-white" strokeWidth={1} />
        </div>
      </div>
    </div>
  );
}
