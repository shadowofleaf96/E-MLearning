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
  Send,
  Mail,
  Trash2,
  Users,
  Calendar,
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/store/hooks';
import { ENDPOINTS } from '@/services/endpoints';

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: string;
  targetAudience: string;
  updatedAt: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: string;
  recipientCount: number;
  sentAt?: string;
  createdAt: string;
}

export default function NotificationsManagementPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<
    'announcements' | 'campaigns' | 'settings'
  >('announcements');

  const [settings, setSettings] = useState({
    emailOnEnrollment: true,
    systemAnnouncements: true,
    weeklyReports: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Announcement Composer Form
  const [annTitle, setAnnTitle] = useState('');
  const [annAudience, setAnnAudience] = useState('All Users');
  const [annPriority, setAnnPriority] = useState('Normal');
  const [annMessage, setAnnMessage] = useState('');

  // Campaign Composer Form
  const [campName, setCampName] = useState('');
  const [campSubject, setCampSubject] = useState('');
  const [campAudience, setCampAudience] = useState('All Users');
  const [campContent, setCampContent] = useState('');
  const [isSendingCamp, setIsSendingCamp] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/notifications/announcements');
      setAnnouncements(res.data?.data || []);
    } catch {
      toast.error('Failed to load announcements');
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await api.get(ENDPOINTS.CAMPAIGNS.LIST);
      setCampaigns(res.data?.data || []);
    } catch {
      toast.error('Failed to load campaigns');
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
    } else if (activeTab === 'campaigns') {
      fetchCampaigns();
    }
  }, [activeTab, user?.tenantId]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await api.put(`/tenants/${user?.tenantId}/notifications`, {
        notificationSettings: settings,
      });
      toast.success('Notification settings saved successfully');
    } catch {
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
    } catch {
      toast.error('Failed to create announcement');
    }
  };

  const submitCampaign = async (status: string) => {
    if (!campName.trim() || !campSubject.trim() || !campContent.trim()) {
      toast.error('Campaign Name, Subject, and Content are required');
      return;
    }
    try {
      setIsSendingCamp(true);
      const res = await api.post(ENDPOINTS.CAMPAIGNS.CREATE, {
        name: campName.trim(),
        subject: campSubject.trim(),
        content: campContent.trim(),
        status,
      });

      if (status === 'Sent' && res.data?.data?.id) {
        await api.post(ENDPOINTS.CAMPAIGNS.SEND(res.data.data.id), {
          targetAudience: campAudience,
        });
        toast.success(
          'Broadcast campaign dispatched to audience successfully!'
        );
      } else {
        toast.success('Campaign saved as draft');
      }

      setCampName('');
      setCampSubject('');
      setCampContent('');
      setCampAudience('All Users');
      fetchCampaigns();
    } catch {
      toast.error('Failed to save campaign');
    } finally {
      setIsSendingCamp(false);
    }
  };

  const handleSendExistingCampaign = async (
    id: string,
    targetAudience: string = 'All Users'
  ) => {
    try {
      setIsSendingCamp(true);
      const res = await api.post(ENDPOINTS.CAMPAIGNS.SEND(id), {
        targetAudience,
      });
      toast.success(
        res.data?.message || 'Campaign sent to recipients successfully!'
      );
      fetchCampaigns();
    } catch {
      toast.error('Failed to send campaign');
    } finally {
      setIsSendingCamp(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await api.delete(ENDPOINTS.CAMPAIGNS.DELETE(id));
      toast.success('Campaign deleted');
      fetchCampaigns();
    } catch {
      toast.error('Failed to delete campaign');
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
          onClick={() => setActiveTab('campaigns')}
          className={`pb-4 font-headline-md text-xl font-bold transition-all focus:outline-none ${
            activeTab === 'campaigns'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          Broadcast Campaigns
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

      {/* Broadcast Campaigns Content */}
      {activeTab === 'campaigns' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Campaigns List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
              <div className="px-6 py-5 flex items-center justify-between border-b border-border-subtle bg-surface-bg/50">
                <h3 className="font-headline-md text-xl font-bold text-primary flex items-center gap-2">
                  <Mail className="w-5 h-5 text-secondary" />
                  Broadcast &amp; Email Campaigns
                </h3>
                <span className="text-xs font-bold text-on-surface-variant">
                  {campaigns.length} Total Campaigns
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-on-surface">
                  <thead className="bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Campaign</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Audience</th>
                      <th className="px-6 py-4">Sent At</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {campaigns.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-on-surface-variant"
                        >
                          <Mail className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-2" />
                          <p className="font-bold text-sm">
                            No campaigns created yet
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Use the composer on the right to draft or broadcast
                            a campaign.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      campaigns.map((camp) => (
                        <tr
                          key={camp.id}
                          className="hover:bg-surface-container-low transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-on-surface">
                              {camp.name}
                            </div>
                            <div className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                              {camp.subject}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                camp.status === 'Sent'
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : 'bg-surface-container-highest text-on-surface-variant'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  camp.status === 'Sent'
                                    ? 'bg-emerald-500'
                                    : 'bg-outline'
                                }`}
                              ></span>{' '}
                              {camp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                            <span className="flex items-center gap-1.5 font-bold text-on-surface">
                              <Users className="w-3.5 h-3.5 text-secondary" />
                              {camp.recipientCount} Recipients
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-on-surface-variant">
                            {camp.sentAt ? (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(camp.sentAt).toLocaleDateString()}
                              </span>
                            ) : (
                              'Not sent'
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {camp.status !== 'Sent' && (
                              <button
                                onClick={() =>
                                  handleSendExistingCampaign(camp.id)
                                }
                                disabled={isSendingCamp}
                                className="px-3 py-1 bg-secondary text-white font-bold text-xs rounded-lg hover:bg-secondary/90 transition-all inline-flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                Send
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCampaign(camp.id)}
                              className="p-1 text-on-surface-variant hover:text-error transition-colors rounded"
                              title="Delete campaign"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* New Campaign Composer */}
          <div className="lg:col-span-1">
            <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <FileSignature className="w-6 h-6 text-secondary" />
                <h3 className="font-headline-md text-xl font-bold text-primary">
                  New Campaign
                </h3>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                    Internal Campaign Name
                  </label>
                  <input
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all outline-none text-sm font-medium"
                    placeholder="e.g. Black Friday 2026 Announcement"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                    Email / Notification Subject
                  </label>
                  <input
                    value={campSubject}
                    onChange={(e) => setCampSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all outline-none text-sm font-medium"
                    placeholder="e.g. Exclusive 30% Off on Fullstack Modules"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                    Target Audience
                  </label>
                  <select
                    value={campAudience}
                    onChange={(e) => setCampAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all outline-none text-sm font-medium bg-surface-card"
                  >
                    <option value="All Users">All Users (Tenants)</option>
                    <option value="Students">Enrolled Students Only</option>
                    <option value="Instructors">Active Instructors Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                    Campaign Message Content
                  </label>
                  <textarea
                    value={campContent}
                    onChange={(e) => setCampContent(e.target.value)}
                    className="w-full p-3.5 border border-border-subtle rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary/30 outline-none text-sm font-medium resize-none"
                    placeholder="Write the full broadcast message content..."
                    rows={5}
                  ></textarea>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => submitCampaign('Draft')}
                    disabled={isSendingCamp}
                    className="flex-1 py-2.5 rounded-xl border border-border-subtle font-bold text-sm hover:bg-surface-container-low transition-all focus:outline-none"
                    type="button"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => submitCampaign('Sent')}
                    disabled={isSendingCamp}
                    className="flex-1 py-2.5 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-sm focus:outline-none flex items-center justify-center gap-2"
                    type="button"
                  >
                    <Send className="w-4 h-4" />
                    {isSendingCamp ? 'Sending...' : 'Broadcast'}
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
