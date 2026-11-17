'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Key,
  Webhook as WebhookIcon,
  Copy,
  Check,
  Trash2,
  Send,
  Plus,
  RefreshCw,
  Code2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import api from '@/services/api';
import { toast } from 'react-toastify';
import TwoFactorSetupModal from '@/components/modals/TwoFactorSetupModal';
import PasswordInput from '@/components/ui/PasswordInput';
import {
  integrationsService,
  ApiKey,
  Webhook,
  WebhookDelivery,
} from '@/modules/integrations/services/integrations.service';

const ALL_SCOPES = [
  'read:courses',
  'write:courses',
  'read:users',
  'write:users',
  'read:enrollments',
  'write:enrollments',
  'read:analytics',
];

const ALL_WEBHOOK_EVENTS = [
  'course.created',
  'course.updated',
  'enrollment.created',
  'exam.submitted',
  'certificate.issued',
  'user.registered',
];

export default function AdminSettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Active Tab: 'profile' | 'developer'
  const [activeTab, setActiveTab] = useState<'profile' | 'developer'>(
    'profile'
  );

  // Profile & Password State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(
    user?.isTwoFactorEnabled || false
  );
  const [isSaving, setIsSaving] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState<'enable' | 'disable'>(
    'enable'
  );
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Developer / Integrations State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);

  // New API Key Modal State
  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'read:courses',
    'read:users',
    'write:enrollments',
  ]);
  const [createdPlainKey, setCreatedPlainKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  // New Webhook Modal State
  const [isNewWebhookModalOpen, setIsNewWebhookModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'course.created',
    'enrollment.created',
  ]);
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);

  // Deliveries Modal State
  const [isDeliveriesModalOpen, setIsDeliveriesModalOpen] = useState(false);
  const [activeWebhook, setActiveWebhook] = useState<Webhook | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'developer') {
      loadIntegrations();
    }
  }, [activeTab]);

  const loadIntegrations = async () => {
    try {
      setLoadingIntegrations(true);
      const [keys, whs] = await Promise.all([
        integrationsService.getApiKeys(),
        integrationsService.getWebhooks(),
      ]);
      setApiKeys(keys);
      setWebhooks(whs);
    } catch (err: any) {
      toast.error('Failed to load developer integrations');
    } finally {
      setLoadingIntegrations(false);
    }
  };

  // ─── Profile & Security Handlers ──────────────────────────

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const res = await api.put(`/users/${user.id}`, {
        firstName,
        lastName,
        isTwoFactorEnabled: twoFactorAuth,
      });
      dispatch(updateUser(res.data.data));
      toast.success('Admin profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      setIsSaving(true);
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      if (twoFactorAuth) {
        setTwoFactorMode('disable');
        setIs2FAModalOpen(true);
      } else {
        const res = await api.post('/auth/2fa/enable');
        setQrCodeUrl(res.data.qrCodeUrl);
        setTwoFactorMode('enable');
        setIs2FAModalOpen(true);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to initiate 2FA toggle'
      );
    }
  };

  const handle2FASuccess = () => {
    setIs2FAModalOpen(false);
    const newState = twoFactorMode === 'enable';
    setTwoFactorAuth(newState);
    if (user) dispatch(updateUser({ ...user, isTwoFactorEnabled: newState }));
  };

  // ─── Developer & Integrations Handlers ────────────────────

  const handleCreateApiKey = async () => {
    if (!keyName.trim()) {
      toast.error('Please provide a key name');
      return;
    }
    try {
      setIsCreatingKey(true);
      const newKey = await integrationsService.createApiKey({
        name: keyName.trim(),
        scopes: selectedScopes,
      });
      setCreatedPlainKey(newKey.plainKey || newKey.key || '');
      setApiKeys((prev) => [newKey, ...prev]);
      setKeyName('');
      toast.success('API Key generated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create API key');
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleRevokeApiKey = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to revoke this API key? This action is permanent.'
      )
    ) {
      return;
    }
    try {
      await integrationsService.revokeApiKey(id);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success('API key revoked');
    } catch (err: any) {
      toast.error('Failed to revoke API key');
    }
  };

  const handleCreateWebhook = async () => {
    if (!webhookUrl.trim() || !webhookUrl.startsWith('http')) {
      toast.error('Please enter a valid HTTP/HTTPS endpoint URL');
      return;
    }
    try {
      setIsCreatingWebhook(true);
      const wh = await integrationsService.createWebhook({
        url: webhookUrl.trim(),
        events: selectedEvents,
      });
      setWebhooks((prev) => [wh, ...prev]);
      setIsNewWebhookModalOpen(false);
      setWebhookUrl('');
      toast.success('Webhook endpoint registered');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create webhook');
    } finally {
      setIsCreatingWebhook(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (
      !confirm('Are you sure you want to delete this webhook subscription?')
    ) {
      return;
    }
    try {
      await integrationsService.deleteWebhook(id);
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
      toast.success('Webhook deleted');
    } catch (err: any) {
      toast.error('Failed to delete webhook');
    }
  };

  const handleTestWebhook = async (id: string) => {
    try {
      setTestingWebhookId(id);
      const delivery = await integrationsService.testWebhook(id);
      if (delivery.success) {
        toast.success(
          `Ping dispatched successfully (HTTP ${delivery.statusCode})`
        );
      } else {
        toast.warning(
          `Ping dispatched with error (HTTP ${delivery.statusCode || 500})`
        );
      }
      loadIntegrations();
    } catch (err: any) {
      toast.error('Failed to test webhook');
    } finally {
      setTestingWebhookId(null);
    }
  };

  const handleOpenDeliveries = async (wh: Webhook) => {
    setActiveWebhook(wh);
    setIsDeliveriesModalOpen(true);
    try {
      setLoadingDeliveries(true);
      const dels = await integrationsService.getDeliveries(wh.id);
      setDeliveries(dels);
    } catch (err: any) {
      toast.error('Failed to load webhook delivery history');
    } finally {
      setLoadingDeliveries(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.info('Copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2 tracking-tight">
          Admin Settings & Configuration
        </h1>
        <p className="font-body-md text-base text-on-surface-variant">
          Manage administrator credentials, tenant security, and developer API
          integrations.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border-subtle gap-6" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          className={`pb-3 font-label-md text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <User size={18} />
          <span>Profile & Security</span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'developer'}
          onClick={() => setActiveTab('developer')}
          className={`pb-3 font-label-md text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'developer'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Code2 size={18} />
          <span>Developer & Webhooks</span>
        </button>
      </div>

      {/* ─── TAB 1: Profile & Security ─────────────────────── */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Personal Information */}
          <section className="bg-surface-card rounded-xl border border-border-subtle p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <User className="text-secondary w-6 h-6" />
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                Profile Information
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-2.5 rounded-lg border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none font-body-md text-sm bg-surface-container-lowest"
                    type="text"
                    value={`${firstName} ${lastName}`.trim()}
                    onChange={(e) => {
                      const parts = e.target.value.split(' ');
                      setFirstName(parts[0] || '');
                      setLastName(parts.slice(1).join(' '));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Email Address
                  </label>
                  <input
                    className="w-full px-4 py-2.5 rounded-lg border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none font-body-md text-sm bg-surface-container-lowest text-on-surface-variant cursor-not-allowed"
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Security & Account */}
          <section className="bg-surface-card rounded-xl border border-border-subtle p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="text-secondary w-6 h-6" />
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                Security & Account
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h3 className="font-body-md font-bold text-on-surface">
                  Update Password
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Current Password
                    </label>
                    <PasswordInput
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        New Password
                      </label>
                      <PasswordInput
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Confirm New Password
                      </label>
                      <PasswordInput
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isSaving}
                    className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90 transition-all disabled:opacity-50 text-sm"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle flex flex-col justify-between">
                <div>
                  <h3 className="font-body-md font-bold text-on-surface mb-2">
                    Two-Factor Auth
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Add an extra layer of security to your account by requiring
                    an authenticator code.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
                  <span className="font-label-md text-sm font-bold text-on-surface">
                    Enable 2FA
                  </span>
                  <button
                    aria-label="Toggle Two-Factor Authentication"
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${
                      twoFactorAuth ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                    onClick={handleToggle2FA}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                        twoFactorAuth ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-4 pb-12">
            <button
              type="button"
              onClick={() => {
                setFirstName(user?.firstName || '');
                setLastName(user?.lastName || '');
              }}
              className="w-full md:w-auto px-8 py-2.5 rounded-lg font-label-md text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full md:w-auto px-8 py-2.5 rounded-lg bg-secondary text-white font-label-md text-sm font-bold hover:bg-secondary/90 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Developer & Webhooks ───────────────────── */}
      {activeTab === 'developer' && (
        <div className="space-y-8 pb-16">
          {/* API Keys Section */}
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Key className="text-secondary w-5 h-5" />
                  <h2 className="text-xl font-bold text-primary">API Keys</h2>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  Authenticate programmatic requests to the E-Tactiques LMS REST
                  API.
                </p>
              </div>

              <button
                onClick={() => {
                  setCreatedPlainKey(null);
                  setIsNewKeyModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-sm"
              >
                <Plus size={16} />
                Generate New Key
              </button>
            </div>

            {loadingIntegrations ? (
              <div className="py-8 text-center text-sm text-on-surface-variant">
                Loading API keys...
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border-subtle rounded-xl bg-surface-container-lowest">
                <Key className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
                <p className="text-sm font-bold text-on-surface">
                  No API keys created
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Generate a key to securely integrate with backend systems,
                  CRM, or custom scripts.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full text-left border-collapse text-xs"
                  role="table"
                >
                  <thead>
                    <tr className="border-b border-border-subtle uppercase text-on-surface-variant font-bold">
                      <th scope="col" className="py-3 px-3">
                        Name
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Token
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Scopes
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Created
                      </th>
                      <th scope="col" className="py-3 px-3 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-medium">
                    {apiKeys.map((k) => (
                      <tr
                        key={k.id}
                        className="hover:bg-surface-container-low/50"
                      >
                        <td className="py-3 px-3 font-bold text-primary">
                          {k.name}
                        </td>
                        <td className="py-3 px-3 font-mono text-on-surface">
                          {k.maskedKey}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {k.scopes.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded bg-surface-container-low text-[10px] font-mono text-secondary"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">
                          {new Date(k.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleRevokeApiKey(k.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Revoke Key"
                            aria-label={`Revoke ${k.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Webhooks Section */}
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <WebhookIcon className="text-secondary w-5 h-5" />
                  <h2 className="text-xl font-bold text-primary">Webhooks</h2>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  Receive automated real-time HTTP POST notifications when
                  platform events happen.
                </p>
              </div>

              <button
                onClick={() => setIsNewWebhookModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-sm"
              >
                <Plus size={16} />
                Register Webhook
              </button>
            </div>

            {loadingIntegrations ? (
              <div className="py-8 text-center text-sm text-on-surface-variant">
                Loading webhooks...
              </div>
            ) : webhooks.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border-subtle rounded-xl bg-surface-container-lowest">
                <WebhookIcon className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
                <p className="text-sm font-bold text-on-surface">
                  No webhooks registered
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Configure an endpoint to receive course completions, new
                  registrations, and payment events.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full text-left border-collapse text-xs"
                  role="table"
                >
                  <thead>
                    <tr className="border-b border-border-subtle uppercase text-on-surface-variant font-bold">
                      <th scope="col" className="py-3 px-3">
                        Endpoint URL
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Subscribed Events
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Status
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Last Triggered
                      </th>
                      <th scope="col" className="py-3 px-3 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-medium">
                    {webhooks.map((w) => (
                      <tr
                        key={w.id}
                        className="hover:bg-surface-container-low/50"
                      >
                        <td
                          className="py-3 px-3 font-mono font-bold text-primary max-w-xs truncate"
                          title={w.url}
                        >
                          {w.url}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1 max-w-sm">
                            {w.events.map((ev) => (
                              <span
                                key={ev}
                                className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono"
                              >
                                {ev}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {w.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              Disabled
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant text-[11px]">
                          {w.lastTriggeredAt
                            ? new Date(w.lastTriggeredAt).toLocaleString()
                            : 'Never'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleTestWebhook(w.id)}
                              disabled={testingWebhookId === w.id}
                              className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-secondary font-bold text-[11px] flex items-center gap-1 disabled:opacity-50"
                              title="Send Test Ping"
                              aria-label="Send Test Ping"
                            >
                              <Send
                                size={12}
                                className={
                                  testingWebhookId === w.id
                                    ? 'animate-spin'
                                    : ''
                                }
                              />
                              Test
                            </button>
                            <button
                              onClick={() => handleOpenDeliveries(w)}
                              className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-primary font-bold text-[11px] flex items-center gap-1"
                              title="View Deliveries"
                              aria-label="View Deliveries"
                            >
                              <RefreshCw size={12} />
                              Logs
                            </button>
                            <button
                              onClick={() => handleDeleteWebhook(w.id)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50"
                              title="Delete Webhook"
                              aria-label="Delete Webhook"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ─── MODAL: Generate New API Key ───────────────────── */}
      {isNewKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-card rounded-2xl border border-border-subtle max-w-md w-full p-6 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-primary">
              {createdPlainKey ? 'API Key Generated' : 'Generate New API Key'}
            </h3>

            {createdPlainKey ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 leading-relaxed font-medium">
                  <strong>Important:</strong> Copy this secret API key
                  immediately. For security reasons, you will not be able to
                  view it again.
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-lowest border border-border-subtle font-mono text-xs">
                  <input
                    type="text"
                    readOnly
                    value={createdPlainKey}
                    className="w-full bg-transparent outline-none font-bold text-primary"
                  />
                  <button
                    onClick={() => copyToClipboard(createdPlainKey)}
                    className="p-1.5 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors"
                    title="Copy Key"
                    aria-label="Copy Key"
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <button
                  onClick={() => setIsNewKeyModalOpen(false)}
                  className="w-full py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90"
                >
                  I have saved my key
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zapier Integration, Staging Server"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle text-sm outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-on-surface-variant block mb-2">
                    Permission Scopes
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {ALL_SCOPES.map((scope) => (
                      <label
                        key={scope}
                        className="flex items-center gap-2 text-xs font-mono text-on-surface cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedScopes.includes(scope)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedScopes([...selectedScopes, scope]);
                            } else {
                              setSelectedScopes(
                                selectedScopes.filter((s) => s !== scope)
                              );
                            }
                          }}
                          className="rounded text-secondary focus:ring-secondary"
                        />
                        <span>{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsNewKeyModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border-subtle text-xs font-bold text-on-surface-variant hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateApiKey}
                    disabled={isCreatingKey}
                    className="px-5 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 disabled:opacity-50"
                  >
                    {isCreatingKey ? 'Generating...' : 'Generate Key'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL: Register Webhook ───────────────────────── */}
      {isNewWebhookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-card rounded-2xl border border-border-subtle max-w-md w-full p-6 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-primary">
              Register Webhook Endpoint
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">
                  Target Endpoint URL
                </label>
                <input
                  type="url"
                  placeholder="https://api.yourdomain.com/webhooks/lms"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle text-sm outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant block mb-2">
                  Subscribed Events
                </label>
                <div className="space-y-1.5">
                  {ALL_WEBHOOK_EVENTS.map((event) => (
                    <label
                      key={event}
                      className="flex items-center gap-2 text-xs font-mono text-on-surface cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([...selectedEvents, event]);
                          } else {
                            setSelectedEvents(
                              selectedEvents.filter((ev) => ev !== event)
                            );
                          }
                        }}
                        className="rounded text-secondary focus:ring-secondary"
                      />
                      <span>{event}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsNewWebhookModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-subtle text-xs font-bold text-on-surface-variant hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWebhook}
                  disabled={isCreatingWebhook}
                  className="px-5 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 disabled:opacity-50"
                >
                  {isCreatingWebhook ? 'Registering...' : 'Register Webhook'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Delivery History Logs ───────────────────── */}
      {isDeliveriesModalOpen && activeWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-card rounded-2xl border border-border-subtle max-w-2xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary">
                  Webhook Delivery Logs
                </h3>
                <p className="text-xs font-mono text-on-surface-variant truncate max-w-md">
                  {activeWebhook.url}
                </p>
              </div>
              <button
                onClick={() => setIsDeliveriesModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface text-sm font-bold"
              >
                Close
              </button>
            </div>

            {loadingDeliveries ? (
              <div className="py-8 text-center text-sm text-on-surface-variant">
                Loading delivery history...
              </div>
            ) : deliveries.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border-subtle rounded-xl text-xs text-on-surface-variant">
                No deliveries recorded yet. Use the Test button to trigger an
                initial ping.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {deliveries.map((del) => (
                  <div
                    key={del.id}
                    className="p-3 rounded-xl border border-border-subtle bg-surface-container-lowest text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {del.success ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            <CheckCircle2 size={13} />
                            {del.statusCode || 200} OK
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                            <XCircle size={13} />
                            {del.statusCode || 'FAIL'}
                          </span>
                        )}
                        <span className="font-mono font-bold text-primary">
                          {del.event}
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">
                        {new Date(del.deliveredAt).toLocaleString()}
                      </span>
                    </div>
                    {del.responseBody && (
                      <div className="font-mono text-[10px] bg-surface-container-low p-2 rounded truncate text-on-surface-variant">
                        Response: {del.responseBody}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      <TwoFactorSetupModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        qrCodeUrl={qrCodeUrl}
        onSuccess={handle2FASuccess}
        mode={twoFactorMode}
      />
    </div>
  );
}
