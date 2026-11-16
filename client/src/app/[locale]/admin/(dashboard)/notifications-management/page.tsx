'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileSignature,
  Bold,
  Italic,
  Link,
  Image as ImageIcon,
  Headset,
  Save,
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/store/hooks';

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: string;
  targetAudience: string;
  updatedAt: string;
}

export default function NotificationsManagementPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'announcements' | 'settings'>(
    'announcements'
  );

  const [settings, setSettings] = useState({
    emailOnEnrollment: true,
    systemAnnouncements: true,
    weeklyReports: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Composer Form
  const [annTitle, setAnnTitle] = useState('');
  const [annAudience, setAnnAudience] = useState('All Users');
  const [annPriority, setAnnPriority] = useState('Normal');
  const [annMessage, setAnnMessage] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/notifications/announcements');
      setAnnouncements(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load announcements');
    }
  };

  useEffect(() => {
    if (activeTab === 'settings' && user?.tenantId) {
      const fetchSettings = async () => {
        try {
          const res = await api.get('/tenants/current');
          if (res.data?.data?.notificationSettings) {
            setSettings(res.data.data.notificationSettings);
          }
        } catch (error) {
          toast.error('Failed to load notification settings');
        }
      };
      fetchSettings();
    } else if (activeTab === 'announcements') {
      fetchAnnouncements();
    }
  }, [activeTab, user?.tenantId]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await api.put(`/tenants/${user?.tenantId}/notifications`, {
        notificationSettings: settings,
      });
      toast.success('Notification settings saved successfully');
    } catch (error) {
      toast.error('Failed to save notification settings');
    } finally {
      setIsSaving(false);
    }
  };

  const submitAnnouncement = async (status: string) => {
    if (!annTitle.trim() || !annMessage.trim()) {
      toast.error('Title and Message are required');
      return;
    }
    try {
      await api.post('/notifications/announcements', {
        title: annTitle,
        message: annMessage,
        targetAudience: annAudience,
        priority: annPriority,
        status,
      });
      toast.success(
        `Announcement ${status === 'Draft' ? 'saved' : 'published'} successfully`
      );
      setAnnTitle('');
      setAnnMessage('');
      setAnnPriority('Normal');
      setAnnAudience('All Users');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to create announcement');
    }
  };

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="font-headline-lg text-3xl font-bold text-primary mb-2">
          Notifications Management
        </h1>
        <p className="text-lg font-medium text-on-surface-variant max-w-2xl">
          Communicate with your institution through system announcements, email
          campaigns, and manage notification settings.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border-subtle mb-8 gap-8">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-4 font-headline-md text-xl font-bold transition-all focus:outline-none ${
            activeTab === 'announcements'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          System Announcements
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-4 font-headline-md text-xl font-bold transition-all focus:outline-none ${
            activeTab === 'settings'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Announcements Content */}
      {activeTab === 'announcements' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Announcements List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
              <div className="px-6 py-5 flex items-center justify-between border-b border-border-subtle bg-surface-bg/50">
                <h3 className="font-headline-md text-xl font-bold text-primary">
                  Existing Announcements
                </h3>
                <button
                  onClick={() =>
                    document.getElementById('announcement-title')?.focus()
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-xl hover:bg-secondary/90 transition-all font-bold text-sm shadow-sm focus:outline-none"
                >
                  <Plus className="w-4 h-4" /> Create New
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-container-low/50 text-on-surface-variant font-bold text-xs uppercase tracking-wider border-b border-border-subtle">
                      <th className="px-6 py-4">Announcement Title</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Audience</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-sm">
                    {announcements.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-on-surface-variant"
                        >
                          No announcements found. Create one to get started.
                        </td>
                      </tr>
                    ) : (
                      announcements.map((ann) => (
                        <tr
                          key={ann.id}
                          className="hover:bg-surface-container-lowest transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-primary">
                              {ann.title}
                            </div>
                            <div className="text-xs font-medium text-on-surface-variant mt-0.5">
                              Last updated:{' '}
                              {new Date(ann.updatedAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                ann.status === 'Draft'
                                  ? 'bg-surface-container-highest text-on-surface-variant'
                                  : 'bg-[#009668] text-white'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${ann.status === 'Draft' ? 'bg-outline' : 'bg-white'}`}
                              ></span>{' '}
                              {ann.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-on-surface-variant">
                            {ann.targetAudience}
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-secondary font-bold hover:underline mr-3 focus:outline-none text-xs">
                              Edit
                            </button>
                            <button className="text-on-surface-variant font-bold hover:text-error focus:outline-none text-xs">
                              Archive
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* New Announcement Composer */}
          <div className="lg:col-span-1">
            <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <FileSignature className="w-6 h-6 text-secondary" />
                <h3 className="font-headline-md text-xl font-bold text-primary">
                  New Announcement
                </h3>
              </div>
              <form className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                    Title
                  </label>
                  <input
                    id="announcement-title"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all outline-none text-sm font-medium"
                    placeholder="Enter announcement title"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                    Target Audience
                  </label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all outline-none bg-white text-sm font-medium cursor-pointer"
                  >
                    <option>All Users</option>
                    <option>Students</option>
                    <option>Faculty</option>
                    <option>Administrators</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                    Priority
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAnnPriority('Normal')}
                      className={`flex-1 py-2 px-3 border rounded-xl text-xs font-bold hover:bg-surface-container-low transition-all focus:outline-none ${annPriority === 'Normal' ? 'border-border-subtle bg-surface-container-low' : 'border-border-subtle'}`}
                      type="button"
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setAnnPriority('High')}
                      className={`flex-1 py-2 px-3 border-2 rounded-xl text-xs font-bold hover:bg-[#F59E0B]/10 transition-all focus:outline-none ${annPriority === 'High' ? 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10' : 'border-[#F59E0B]/50 text-[#F59E0B]'}`}
                      type="button"
                    >
                      High
                    </button>
                    <button
                      onClick={() => setAnnPriority('Urgent')}
                      className={`flex-1 py-2 px-3 border rounded-xl text-xs font-bold hover:bg-error-container transition-all focus:outline-none ${annPriority === 'Urgent' ? 'border-error text-error bg-error-container' : 'border-border-subtle text-error'}`}
                      type="button"
                    >
                      Urgent
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                    Message
                  </label>
                  <div className="border border-border-subtle rounded-xl overflow-hidden focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary/30 transition-all">
                    <div className="bg-surface-container-low/50 border-b border-border-subtle p-2 flex gap-2">
                      <button
                        className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors focus:outline-none"
                        type="button"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors focus:outline-none"
                        type="button"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors focus:outline-none"
                        type="button"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors focus:outline-none ml-auto"
                        type="button"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={annMessage}
                      onChange={(e) => setAnnMessage(e.target.value)}
                      className="w-full px-4 py-3 border-none focus:ring-0 resize-none text-sm font-medium outline-none"
                      placeholder="Compose your message..."
                      rows={4}
                    ></textarea>
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => submitAnnouncement('Draft')}
                    className="flex-1 py-2.5 rounded-xl border border-border-subtle font-bold text-sm hover:bg-surface-container-low transition-all focus:outline-none"
                    type="button"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => submitAnnouncement('Live')}
                    className="flex-1 py-2.5 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-sm focus:outline-none"
                    type="button"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Settings Content */}
      {activeTab === 'settings' && (
        <section className="animate-in fade-in duration-300 max-w-3xl">
          <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm p-8">
            <h3 className="font-headline-md text-xl font-bold text-primary mb-6">
              Notification Preferences
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-on-surface">
                    Email on New Enrollment
                  </h4>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Receive an email when a new student enrolls.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailOnEnrollment}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailOnEnrollment: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-on-surface">
                    System Announcements
                  </h4>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Show system announcements in the user dashboard.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.systemAnnouncements}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        systemAnnouncements: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-on-surface">Weekly Reports</h4>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Send a weekly summary report to admins.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.weeklyReports}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        weeklyReports: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-subtle flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all font-bold text-sm shadow-sm focus:outline-none disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Floating Action Button for Support (Contextual) */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() =>
            toast.info('Support Live Chat will be integrated soon!')
          }
          className="w-14 h-14 bg-[#131b2e] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group focus:outline-none"
        >
          <Headset className="w-6 h-6" />
          <span className="absolute right-full mr-4 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
            Need Help?
          </span>
        </button>
      </div>
    </div>
  );
}
