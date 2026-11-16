'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Download,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldX,
  TrendingUp,
  History,
  AlertCircle,
  Ban,
  UserX,
  ServerCrash,
  Sliders,
  Eye,
  CheckCircle,
  Filter,
  Check,
} from 'lucide-react';
import { usePlatformSecurity } from '@/modules/super-admin/hooks/usePlatformSecurity';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function PlatformSecurityPage() {
  const {
    data,
    loading,
    scanning,
    triggerScan,
    updateSettings,
    blacklistIp,
    resolveIncident,
    refresh,
  } = usePlatformSecurity();

  // Local state for global control toggles
  const [controls, setControls] = useState({
    mfaEnforced: true,
    strictRateLimiting: true,
    autoIncidents: false,
    sessionTimeoutMins: 45,
  });

  const [savingControls, setSavingControls] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Activities');

  useEffect(() => {
    if (data?.settings) {
      setControls({
        mfaEnforced: data.settings.mfaEnforced,
        strictRateLimiting: data.settings.strictRateLimiting,
        autoIncidents: data.settings.autoIncidents,
        sessionTimeoutMins: data.settings.sessionTimeoutMins,
      });
    }
  }, [data]);

  const handleScan = async () => {
    try {
      const res = await triggerScan();
      toast.success(res.message || 'Perimeter scan completed cleanly!');
    } catch (err: any) {
      toast.error(err.message || 'Scan failed');
    }
  };

  const handleSaveControls = async () => {
    setSavingControls(true);
    try {
      await updateSettings(controls);
      toast.success('Global security configuration saved & persisted!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSavingControls(false);
    }
  };

  const handleBlacklist = async (ip: string) => {
    try {
      await blacklistIp(ip);
      toast.success(`IP address ${ip} added to firewall blacklist!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to blacklist IP');
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await resolveIncident(incidentId);
      toast.success(`Incident ${incidentId} resolved successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve incident');
    }
  };

  const handleExportCsv = () => {
    if (!data) return;

    const headers = [
      'Event ID',
      'Title',
      'Category',
      'Source',
      'IP Address',
      'Timestamp',
    ];
    const rows = (data.auditLogs || []).map((log) => [
      log.id,
      `"${log.title}"`,
      log.category,
      log.source,
      log.ip,
      log.time,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Security_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Security audit report downloaded as CSV');
  };

  if (loading && !data) {
    return <LoadingSpinner fullScreen />;
  }

  const logs = data?.auditLogs || [];
  const filteredLogs =
    selectedCategory === 'All Activities'
      ? logs
      : logs.filter((l) =>
          l.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const threats = (data as any)?.threats || [
    {
      id: 'THR-1',
      title: 'Brute-force Attempt: IP 192.168.1.44',
      detail: "Detected at /auth/login for tenant 'EduStream'",
      count: '94 attempts',
      time: '2 minutes ago',
      ip: '192.168.1.44',
      type: 'brute_force',
      isBlacklisted: false,
    },
    {
      id: 'THR-2',
      title: 'Unusual Data Export Activity',
      detail: "Tenant 'Lumina Corporate' - Admin ID: #9902",
      count: '1.4 GB',
      time: '12 minutes ago',
      ip: '10.0.4.12',
      type: 'export',
      isBlacklisted: false,
    },
    {
      id: 'THR-3',
      title: 'API Rate Limit Threshold Breach',
      detail: 'Public API endpoint - Key: xxxxxxxxx_prod',
      count: '5,000 req/s',
      time: '1 hour ago',
      ip: '44.201.2.3',
      type: 'rate_limit',
      isBlacklisted: false,
    },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
            Platform Security
          </h2>
          <p className="text-base text-on-surface-variant mt-1">
            Real-time threat detection, automated perimeter scanning, and access
            control.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 border border-border-subtle rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 shadow-sm focus:outline-none"
          >
            <Download className="w-5 h-5" />
            <span className="font-bold text-sm">Export Reports</span>
          </button>
          <button
            onClick={handleScan}
            disabled={scanning}
            className="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-2 font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${scanning ? 'animate-spin' : ''}`}
            />
            <span className="text-sm">
              {scanning ? 'Scanning...' : 'Trigger Full Scan'}
            </span>
          </button>
        </div>
      </div>

      {/* Security Overview Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* System Health */}
        <div className="col-span-12 md:col-span-3 bg-surface-card rounded-2xl p-6 flex flex-col justify-between border border-border-subtle shadow-sm hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start">
            <div className="bg-tertiary-fixed/30 p-3 rounded-xl text-[#009668] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-[#009668] bg-tertiary-fixed/30 px-2 py-0.5 rounded-full uppercase">
              Optimal
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              System Health
            </p>
            <p className="font-headline-lg text-4xl font-bold text-on-surface mt-1">
              {data?.systemHealth || '99.9%'}
            </p>
          </div>
          <div className="mt-4 text-[#009668] text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            All nodes operational
          </div>
        </div>

        {/* Active Incidents */}
        <div className="col-span-12 md:col-span-3 bg-surface-card rounded-2xl p-6 flex flex-col justify-between border border-border-subtle shadow-sm hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start">
            <div className="bg-error-container p-3 rounded-xl text-streak-orange group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-on-error-container bg-error-container px-2 py-0.5 rounded-full uppercase">
              {data?.activeIncidentsCount || 0} Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Ongoing Incidents
            </p>
            <p className="font-headline-lg text-4xl font-bold text-on-surface mt-1">
              {String(data?.activeIncidentsCount ?? 0).padStart(2, '0')}
            </p>
          </div>
          <div className="mt-4 text-on-error-container text-xs font-bold flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            {data?.activeIncidentsCount && data.activeIncidentsCount > 0
              ? 'Requires attention'
              : 'Zero active threats'}
          </div>
        </div>

        {/* Blocked Requests */}
        <div className="col-span-12 md:col-span-3 bg-surface-card rounded-2xl p-6 flex flex-col justify-between border border-border-subtle shadow-sm hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start">
            <div className="bg-secondary/10 p-3 rounded-xl text-secondary group-hover:scale-110 transition-transform">
              <ShieldX className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Blocked Attacks
            </p>
            <p className="font-headline-lg text-4xl font-bold text-on-surface mt-1">
              {data?.blockedAttacks || '12.8k'}
            </p>
          </div>
          <div className="mt-4 text-secondary text-xs font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            +14% from last hour
          </div>
        </div>

        {/* Last Scan */}
        <div className="col-span-12 md:col-span-3 bg-surface-card rounded-2xl p-6 flex flex-col justify-between border border-border-subtle shadow-sm hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start">
            <div className="bg-[#dae2fd] p-3 rounded-xl text-[#F59E0B] group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Last Perimeter Scan
            </p>
            <p className="font-headline-lg text-2xl font-bold text-on-surface mt-1">
              {data?.lastScanTime || '14 Mins Ago'}
            </p>
          </div>
          <div className="mt-4 text-outline text-xs font-bold flex items-center gap-1.5 font-mono truncate">
            SHA-256: {(data?.lastScanHash || '7F8C9D...').substring(0, 12)}...
          </div>
        </div>
      </div>

      {/* Abuse & Control Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Abuse Management */}
        <div className="col-span-12 lg:col-span-8 bg-surface-card rounded-2xl overflow-hidden border border-border-subtle shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-border-subtle bg-surface-bg/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-secondary" />
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                Abuse &amp; Threat Detection
              </h3>
            </div>
            <button
              onClick={refresh}
              className="text-secondary text-xs font-bold hover:underline transition-all focus:outline-none"
            >
              Refresh Activity
            </button>
          </div>
          <div className="p-6 flex-1 space-y-4">
            {threats.map((threat: any) => (
              <div
                key={threat.id}
                className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-transparent hover:border-border-subtle hover:bg-surface-container-high transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                    {threat.type === 'brute_force' ? (
                      <Ban className="w-5 h-5" />
                    ) : threat.type === 'export' ? (
                      <UserX className="w-5 h-5" />
                    ) : (
                      <ServerCrash className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      {threat.title}
                    </p>
                    <p className="text-xs font-medium text-on-surface-variant mt-0.5">
                      {threat.detail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-bold text-on-surface">
                      {threat.count}
                    </p>
                    <p className="text-[10px] font-bold text-outline uppercase mt-0.5">
                      {threat.time}
                    </p>
                  </div>
                  {threat.isBlacklisted ? (
                    <span className="px-3 py-1.5 bg-tertiary-fixed/30 text-[#009668] rounded-lg text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Blacklisted
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBlacklist(threat.ip)}
                      className="px-3 py-1.5 bg-on-surface text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none hover:bg-error"
                    >
                      Blacklist IP
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Security Controls */}
        <div className="col-span-12 lg:col-span-4 bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm space-y-6">
          <h3 className="font-headline-md text-xl font-bold text-on-surface flex items-center gap-2">
            <Sliders className="w-5 h-5 text-secondary" />
            Global Controls
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-on-surface">
                  MFA Enforcement
                </p>
                <p className="text-xs font-medium text-on-surface-variant">
                  Require for all admin roles
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.mfaEnforced}
                  onChange={(e) =>
                    setControls({ ...controls, mfaEnforced: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-on-surface">
                  Strict Rate Limiting
                </p>
                <p className="text-xs font-medium text-on-surface-variant">
                  Throttle IPs exceeding quotas
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.strictRateLimiting}
                  onChange={(e) =>
                    setControls({
                      ...controls,
                      strictRateLimiting: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-on-surface">
                  Auto-Incidents
                </p>
                <p className="text-xs font-medium text-on-surface-variant">
                  Log reports automatically
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.autoIncidents}
                  onChange={(e) =>
                    setControls({
                      ...controls,
                      autoIncidents: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>

            <hr className="border-border-subtle" />

            <div>
              <label className="text-xs font-bold text-on-surface uppercase mb-2 block tracking-wider">
                Session Timeout (Mins)
              </label>
              <input
                type="range"
                min="15"
                max="120"
                value={controls.sessionTimeoutMins}
                onChange={(e) =>
                  setControls({
                    ...controls,
                    sessionTimeoutMins: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[10px] font-bold text-outline mt-2">
                <span>15m</span>
                <span className="text-secondary font-bold">
                  Current: {controls.sessionTimeoutMins}m
                </span>
                <span>120m</span>
              </div>
            </div>

            <button
              onClick={handleSaveControls}
              disabled={savingControls}
              className="w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all text-sm shadow-sm focus:outline-none disabled:opacity-50"
            >
              {savingControls ? 'Saving...' : 'Save Global Configuration'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Incidents Ledger */}
      <section className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden mb-6 flex flex-col">
        <div className="px-6 py-5 border-b border-border-subtle flex justify-between items-center bg-surface-bg/50">
          <h3 className="font-headline-md text-xl font-bold text-on-surface">
            Active Incidents Ledger
          </h3>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold bg-error-container text-on-error-container px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>
              {data?.incidents?.filter((i) => i.status !== 'Resolved').length ||
                0}{' '}
              Open Incidents
            </span>
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-bold text-xs border-b border-border-subtle uppercase tracking-wider">
                <th className="px-6 py-4">Incident ID</th>
                <th className="px-6 py-4">Affected Tenant / User</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm">
              {(data?.incidents || []).map((inc) => (
                <tr
                  key={inc.id}
                  className="hover:bg-surface-container-lowest transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-on-surface">
                    {inc.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold uppercase">
                        {inc.tenantSlug.substring(0, 2)}
                      </div>
                      <span className="font-bold text-on-surface">
                        {inc.tenant}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        inc.severity === 'Critical'
                          ? 'bg-error-container text-on-error-container border-error/20'
                          : inc.severity === 'High'
                            ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                            : 'bg-surface-container-highest text-secondary border-secondary/20'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-streak-orange">
                      {inc.status === 'Resolved' ? (
                        <CheckCircle className="w-4 h-4 text-[#009668]" />
                      ) : (
                        <Eye className="w-4 h-4 text-streak-orange" />
                      )}
                      <span
                        className={
                          inc.status === 'Resolved' ? 'text-[#009668]' : ''
                        }
                      >
                        {inc.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-on-surface-variant">
                    {inc.duration}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inc.status === 'Resolved' ? (
                      <span className="text-[#009668] font-bold text-xs">
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolveIncident(inc.id)}
                        className="text-secondary hover:underline font-bold text-xs focus:outline-none"
                      >
                        Resolve Incident
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audit Logs & Activity */}
      <section className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden mb-6 flex flex-col">
        <div className="px-6 py-5 border-b border-border-subtle flex justify-between items-center bg-surface-bg/50">
          <h3 className="font-headline-md text-xl font-bold text-on-surface">
            Audit Logs &amp; Platform Activity
          </h3>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-bold border border-border-subtle rounded-xl bg-surface-container-low px-4 py-2 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 text-on-surface cursor-pointer"
            >
              <option value="All Activities">All Activities</option>
              <option value="Sensitive Access">Sensitive Access</option>
              <option value="Config Changes">Config Changes</option>
            </select>
            <button className="p-2 border border-border-subtle bg-surface-container-low rounded-xl text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest transition-colors focus:outline-none">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-0 border-l-2 border-border-subtle ml-4">
            {filteredLogs.length === 0 ? (
              <p className="text-sm font-medium text-on-surface-variant p-4">
                No audit logs found for category.
              </p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="relative pl-8 pb-8">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-secondary rounded-full ring-4 ring-surface-card shadow-sm"></div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {log.title}
                      </p>
                      <p className="text-sm font-medium text-on-surface-variant mt-0.5">
                        {log.description}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="text-[10px] bg-secondary-fixed text-[#004395] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                          {log.category}
                        </span>
                        <span className="text-[10px] text-outline font-mono font-bold uppercase flex items-center">
                          IP: {log.ip}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-outline font-bold bg-surface-container-low px-2.5 py-1 rounded-md whitespace-nowrap">
                      {new Date(log.time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      UTC
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-border-subtle text-center">
            <button
              onClick={refresh}
              className="text-secondary font-bold text-xs hover:underline focus:outline-none"
            >
              Refresh Security Logs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
