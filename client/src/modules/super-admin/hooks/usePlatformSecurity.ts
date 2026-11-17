import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '../services/superAdmin.service';

export interface SecurityIncident {
  id: string;
  tenant: string;
  tenantSlug: string;
  severity: string;
  status: string;
  duration: string;
  userEmail: string;
}

export interface AuditLogItem {
  id: string;
  title: string;
  description: string;
  category: string;
  source: string;
  ip: string;
  time: string;
}

export interface SecuritySettings {
  mfaEnforced: boolean;
  strictRateLimiting: boolean;
  autoIncidents: boolean;
  sessionTimeoutMins: number;
}

export interface SecurityOverviewData {
  systemHealth: string;
  activeIncidentsCount: number;
  blockedAttacks: string;
  lastScanTime: string;
  lastScanHash: string;
  settings: SecuritySettings;
  incidents: SecurityIncident[];
  auditLogs: AuditLogItem[];
}

export function usePlatformSecurity() {
  const [data, setData] = useState<SecurityOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSecurityData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await superAdminService.getPlatformSecurity();
      setData(data);
      setLoading(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to fetch security overview'
      );
      setLoading(false);
    }
  }, []);

  const triggerScan = async () => {
    setScanning(true);
    try {
      const res = await superAdminService.triggerSecurityScan();
      if (data) {
        setData({
          ...data,
          lastScanTime: res.lastScanTime,
          lastScanHash: res.lastScanHash,
        });
      }
      setScanning(false);
      return res;
    } catch (err: any) {
      setScanning(false);
      throw new Error(
        err.response?.data?.message || err.message || 'Scan failed'
      );
    }
  };

  const updateSettings = async (settings: Partial<SecuritySettings>) => {
    try {
      const res = await superAdminService.updateSecuritySettings(settings);
      if (data) {
        setData({
          ...data,
          settings: { ...data.settings, ...settings },
        });
      }
      return res;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          'Failed to save security settings'
      );
    }
  };

  const blacklistIp = async (ip: string) => {
    try {
      const res = await superAdminService.blacklistIp(ip);
      await fetchSecurityData();
      return res;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || err.message || 'Failed to blacklist IP'
      );
    }
  };

  const resolveIncident = async (incidentId: string) => {
    try {
      const res = await superAdminService.resolveSecurityIncident(incidentId);
      await fetchSecurityData();
      return res;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          'Failed to resolve incident'
      );
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

  return {
    data,
    loading,
    scanning,
    error,
    refresh: fetchSecurityData,
    triggerScan,
    updateSettings,
    blacklistIp,
    resolveIncident,
  };
}
