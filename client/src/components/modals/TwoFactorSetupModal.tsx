'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';
import api from '@/services/api';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl?: string;
  onSuccess: () => void;
  mode?: 'enable' | 'disable';
}

export default function TwoFactorSetupModal({
  isOpen,
  onClose,
  qrCodeUrl,
  onSuccess,
  mode = 'enable',
}: TwoFactorSetupModalProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      if (mode === 'enable') {
        await api.post('/auth/2fa/verify', { code });
        toast.success('Two-factor authentication enabled successfully!');
      } else {
        await api.post('/auth/2fa/disable', { code });
        toast.success('Two-factor authentication disabled successfully!');
      }
      setCode('');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-4 text-on-surface">
        <h2 className="text-2xl font-bold font-headline-md">
          {mode === 'enable' ? 'Set Up 2FA' : 'Disable 2FA'}
        </h2>

        {mode === 'enable' ? (
          <p className="text-sm text-on-surface-variant font-body-md">
            Scan this QR code with your authenticator app (e.g., Google
            Authenticator, Authy).
          </p>
        ) : (
          <p className="text-sm text-on-surface-variant font-body-md">
            Enter the 6-digit code from your authenticator app to disable 2FA.
          </p>
        )}

        {mode === 'enable' && qrCodeUrl && (
          <div className="flex justify-center my-6">
            <Image
              src={qrCodeUrl}
              alt="2FA QR Code"
              width={192}
              height={192}
              className="w-48 h-48 border border-border-subtle rounded-lg p-2 bg-white"
              unoptimized
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="code">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-border-subtle rounded-lg bg-surface-card focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              required
              autoComplete="off"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-border-subtle text-on-surface-variant rounded-lg font-bold hover:bg-surface-container-low transition-colors"
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying || code.length !== 6}
              className={`flex-1 py-2 px-4 text-white rounded-lg font-bold transition-colors disabled:opacity-50 ${mode === 'enable' ? 'bg-secondary hover:bg-secondary/90' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isVerifying
                ? 'Verifying...'
                : mode === 'enable'
                  ? 'Verify & Enable'
                  : 'Disable'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
