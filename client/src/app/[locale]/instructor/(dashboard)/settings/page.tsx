'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Pencil, Shield, Sliders } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setTheme } from '@/store/slices/uiSlice';
import { updateUser } from '@/store/slices/authSlice';
import api from '@/services/api';
import { toast } from 'react-toastify';
import TwoFactorSetupModal from '@/components/modals/TwoFactorSetupModal';
import PasswordInput from '@/components/ui/PasswordInput';

export default function InstructorSettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const isDarkMode = theme === 'dark';

  const [courseUpdates, setCourseUpdates] = useState(true);
  const [studentActivity, setStudentActivity] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(
    user?.isTwoFactorEnabled || false
  );
  const [highContrast, setHighContrast] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState<'enable' | 'disable'>(
    'enable'
  );
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const res = await api.put(`/users/${user.id}`, {
        firstName,
        lastName,
        bio,
        isTwoFactorEnabled: twoFactorAuth,
      });
      dispatch(updateUser(res.data.data));
      toast.success('Profile updated successfully');
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
        // Disable 2FA requires code
        setTwoFactorMode('disable');
        setIs2FAModalOpen(true);
      } else {
        // Enable 2FA requires QR code setup
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

  return (
    <div className="max-w-4xl mx-auto space-y-10 selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Header Section */}
      <div>
        <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2 tracking-tight">
          Profile Settings
        </h1>
        <p className="font-body-md text-base text-on-surface-variant">
          Manage your instructor profile, security preferences, and teaching
          notification settings.
        </p>
      </div>

      {/* Settings Grid / Cards */}
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
            {/* Avatar Side */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Image
                  alt="Avatar Preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full border-4 border-surface-container shadow-md object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMVY63KMAl5OFCdcEiUMYDRAt2u2NERcelmaUQBIAVXCM8s_Bz3oAt2ESvYUtBFv0Ta_ECJQFDCdmmVUcVXbXRteEZDJgfKueCGJ7BFb1RT-NB5hrRurwlqsmwDSN_BUfhHYfB6WTLvST2UEVFQSR26Qsye0y_C1BcbeTB0RiFfegpbJdwy1g20hGWz7JBWVG89xgjKN3QbtBPPiakBEj9j3HjyvFYAp2ds2bbn2qXbfnMLltVkvH17-xX9DRm1xM7o7-RnrWuhPg"
                />
                <button className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 text-sm font-bold">
                <button className="text-secondary hover:underline px-2 py-1 transition-all">
                  Upload new
                </button>
                <span className="text-outline-variant py-1">|</span>
                <button className="text-error hover:underline px-2 py-1 transition-all">
                  Remove
                </button>
              </div>
            </div>

            {/* Form Side */}
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
              <div className="space-y-2">
                <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Title / Expertise
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-lg border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none font-body-md text-sm bg-surface-container-lowest"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Professor"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-lg border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none font-body-md text-sm bg-surface-container-lowest resize-none"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your students about your background..."
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
            {/* Password Section */}
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
                  className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90 transition-all disabled:opacity-50"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* 2FA Section */}
            <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle flex flex-col justify-between">
              <div>
                <h3 className="font-body-md font-bold text-on-surface mb-2">
                  Two-Factor Auth
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Add an extra layer of security to your account by requiring a
                  code from your phone at login.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-label-md text-sm font-bold">
                  Status:{' '}
                  <span
                    className={twoFactorAuth ? 'text-secondary' : 'text-error'}
                  >
                    {twoFactorAuth ? 'Enabled' : 'Disabled'}
                  </span>
                </span>
                <button
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${twoFactorAuth ? 'bg-secondary' : 'bg-outline-variant'}`}
                  onClick={handleToggle2FA}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${twoFactorAuth ? 'translate-x-6' : ''}`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-surface-card rounded-xl border border-border-subtle p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Sliders className="text-secondary w-6 h-6" />
            <h2 className="font-headline-md text-xl font-bold text-on-surface">
              Preferences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Notifications */}
            <div className="space-y-6">
              <h3 className="font-body-md font-bold text-on-surface">
                Email Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-sm font-semibold text-on-surface">
                      Platform Updates
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      System maintenance and platform-wide announcements.
                    </p>
                  </div>
                  <button
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${courseUpdates ? 'bg-secondary' : 'bg-outline-variant'}`}
                    onClick={() => setCourseUpdates(!courseUpdates)}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${courseUpdates ? 'translate-x-6' : ''}`}
                    ></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-sm font-semibold text-on-surface">
                      Student Activity
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Questions from students, assignment submissions, etc.
                    </p>
                  </div>
                  <button
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${studentActivity ? 'bg-secondary' : 'bg-outline-variant'}`}
                    onClick={() => setStudentActivity(!studentActivity)}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${studentActivity ? 'translate-x-6' : ''}`}
                    ></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body-md text-sm font-semibold text-on-surface">
                      Marketing
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Promotions, personalized tips, and special offers.
                    </p>
                  </div>
                  <button
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${marketing ? 'bg-secondary' : 'bg-outline-variant'}`}
                    onClick={() => setMarketing(!marketing)}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${marketing ? 'translate-x-6' : ''}`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Display */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-body-md font-bold text-on-surface">
                  Display Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-body-md text-sm font-semibold text-on-surface">
                      Dark Mode
                    </span>
                    <button
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${isDarkMode ? 'bg-secondary' : 'bg-outline-variant'}`}
                      onClick={() =>
                        dispatch(setTheme(isDarkMode ? 'light' : 'dark'))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${isDarkMode ? 'translate-x-6' : ''}`}
                      ></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body-md text-sm font-semibold text-on-surface">
                      High Contrast Mode
                    </span>
                    <button
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${highContrast ? 'bg-secondary' : 'bg-outline-variant'}`}
                      onClick={() => setHighContrast(!highContrast)}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${highContrast ? 'translate-x-6' : ''}`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-6 pb-12">
          <button
            type="button"
            onClick={() => {
              setFirstName(user?.firstName || '');
              setLastName(user?.lastName || '');
              setTitle('');
              setBio('');
            }}
            className="w-full md:w-auto px-8 py-3 rounded-lg font-label-md text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full md:w-auto px-10 py-3 rounded-lg bg-secondary text-white font-label-md text-sm font-bold hover:bg-secondary/90 hover:shadow-lg transition-all active:scale-95 duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      {/* Modal */}
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
