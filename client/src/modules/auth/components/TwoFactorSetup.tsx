import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { authService } from '@/modules/auth/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function TwoFactorSetup() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'idle' | 'setup' | 'disable'>('idle');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');

  if (!user) return null;

  const isEnabled = user.isTwoFactorEnabled;

  const handleInitiateSetup = async () => {
    try {
      setLoading(true);
      const res = await authService.enable2FA();
      const qrData = res.data || (res as any);
      if (qrData && qrData.qrCodeUrl) {
        setQrCodeUrl(qrData.qrCodeUrl);
        setSecret(qrData.secret);
        setStep('setup');
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to initiate 2FA setup'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (code.length < 6) return;
    try {
      setLoading(true);
      const res = await authService.verify2FASetup({ code });
      toast.success(res.message || '2FA enabled successfully!');

      // Update Redux state
      dispatch(updateUser({ ...user, isTwoFactorEnabled: true }));
      setStep('idle');
      setCode('');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to verify 2FA code'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (code.length < 6) return;
    try {
      setLoading(true);
      const res = await authService.disable2FA({ code });
      toast.success(res.message || '2FA disabled successfully!');

      // Update Redux state
      dispatch(updateUser({ ...user, isTwoFactorEnabled: false }));
      setStep('idle');
      setCode('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isEnabled ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="text-lg font-medium text-emerald-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Two-Factor Authentication is Enabled
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Your account is currently protected by 2FA.
              </p>
            </div>

            {step === 'idle' ? (
              <Button
                onClick={() => setStep('disable')}
                variant="destructive"
                className="w-fit"
              >
                Disable 2FA
              </Button>
            ) : step === 'disable' ? (
              <div className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <Label htmlFor="disableCode" className="text-zinc-300">
                    Enter Authenticator Code to Disable
                  </Label>
                  <Input
                    id="disableCode"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    placeholder="000000"
                    className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDisable2FA}
                    disabled={loading || code.length < 6}
                    variant="destructive"
                  >
                    {loading ? 'Disabling...' : 'Confirm Disable'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep('idle');
                      setCode('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Add an extra layer of security to your account by enabling
                two-factor authentication.
              </p>
            </div>

            {step === 'idle' && (
              <Button
                onClick={handleInitiateSetup}
                disabled={loading}
                className="w-fit bg-emerald-500 hover:bg-emerald-400 text-white"
              >
                {loading ? 'Initiating...' : 'Enable 2FA'}
              </Button>
            )}

            {step === 'setup' && (
              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-200">
                    1. Scan the QR code
                  </p>
                  <p className="text-xs text-zinc-400">
                    Use Google Authenticator, Authy, or your preferred
                    authenticator app to scan the code below.
                  </p>
                  {qrCodeUrl && (
                    <div className="bg-white p-2 w-fit rounded-lg inline-block my-2">
                      <Image
                        src={qrCodeUrl}
                        alt="2FA QR Code"
                        width={150}
                        height={150}
                        className="w-[150px] h-[150px]"
                      />
                    </div>
                  )}
                  <p className="text-xs text-zinc-400">
                    Or enter this code manually:{' '}
                    <strong className="text-emerald-400 tracking-wider ml-1">
                      {secret}
                    </strong>
                  </p>
                </div>

                <div className="space-y-4 max-w-sm">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-200">
                      2. Enter the generated code
                    </p>
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                      placeholder="000000"
                      className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 text-center tracking-widest text-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleVerifySetup}
                      disabled={loading || code.length < 6}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white"
                    >
                      {loading ? 'Verifying...' : 'Verify & Enable'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setStep('idle');
                        setCode('');
                      }}
                      className="text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
