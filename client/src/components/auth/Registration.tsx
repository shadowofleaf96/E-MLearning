'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import api from '@/services/api';
import DOMPurify from 'dompurify';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be at most 50 characters'),
  acceptPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
});

const Registration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { executeRecaptcha } = useReCaptcha();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      acceptPolicy: false,
    },
  });

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');

    if (token && role === 'user') {
      router.push('/');
    }
  }, [router]);

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    const sanitizedData = {
      name: DOMPurify.sanitize(
        `${data.firstName.trim()} ${data.lastName.trim()}`
      ),
      email: DOMPurify.sanitize(data.email.trim()),
      password: DOMPurify.sanitize(data.password.trim()),
    };

    try {
      setLoading(true);
      setError('');
      const recaptchaToken = await executeRecaptcha('form_submit');

      await api.post(`/users/register`, {
        ...sanitizedData,
        recaptchaToken,
      });

      router.push('/verify-email');
    } catch (err: any) {
      console.log(err);
      const msg =
        'Registration failed. Please try again. ' +
        (err?.response?.data?.message || '');
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
          {t('register.create_account', 'Create Account')}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {t(
            'register.subtitle',
            'Enter your details to provision your learning workspace.'
          )}
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              className="font-label-md text-label-md text-on-surface-variant"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="w-full bg-surface-bg border border-border-subtle rounded-lg px-3.5 py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              id="firstName"
              placeholder="Jane"
              {...form.register('firstName')}
            />
            {form.formState.errors.firstName && (
              <span className="text-sm text-destructive font-medium">
                {form.formState.errors.firstName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="font-label-md text-label-md text-on-surface-variant"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="w-full bg-surface-bg border border-border-subtle rounded-lg px-3.5 py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              id="lastName"
              placeholder="Doe"
              {...form.register('lastName')}
            />
            {form.formState.errors.lastName && (
              <span className="text-sm text-destructive font-medium">
                {form.formState.errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-label-md text-label-md text-on-surface-variant"
            htmlFor="email"
          >
            {t('register.email', 'Work Email Address')}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-[20px] pointer-events-none">
              mail
            </span>
            <input
              className="w-full bg-surface-bg border border-border-subtle rounded-lg pl-10 pr-3.5 py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              id="email"
              type="email"
              placeholder="jane.doe@organization.com"
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <span className="text-sm text-destructive font-medium">
              {form.formState.errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-label-md text-label-md text-on-surface-variant"
            htmlFor="password"
          >
            {t('register.password', 'Password')}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-[20px] pointer-events-none">
              lock
            </span>
            <input
              className="w-full bg-surface-bg border border-border-subtle rounded-lg pl-10 pr-10 py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...form.register('password')}
            />
            <button
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {form.formState.errors.password && (
            <span className="text-sm text-destructive font-medium">
              {form.formState.errors.password.message}
            </span>
          )}
          {/* Validation Hint */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-[14px] text-outline">
              info
            </span>
            <span className="font-label-md text-label-md text-outline font-normal">
              Must be at least 8 characters.
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 mt-4">
          <div className="flex items-center h-5">
            <input
              className="w-4 h-4 rounded border-outline text-secondary focus:ring-secondary/50 focus:ring-offset-0 bg-surface-container-lowest cursor-pointer transition-all"
              id="acceptPolicy"
              type="checkbox"
              {...form.register('acceptPolicy')}
            />
          </div>
          <div className="text-sm leading-5">
            <label
              className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer"
              htmlFor="acceptPolicy"
            >
              {t('register.accept_policy', 'I agree to the')}{' '}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-secondary hover:underline font-medium"
              >
                {t('register.privacy_policy', 'Privacy Policy')}
              </button>
            </label>
            {form.formState.errors.acceptPolicy && (
              <div className="text-sm text-destructive font-medium mt-1">
                {form.formState.errors.acceptPolicy.message}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-sm text-destructive font-medium">{error}</div>
        )}

        {/* Submit Action */}
        <button
          className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-3 px-4 rounded-lg hover:bg-secondary-container transition-colors shadow-sm mt-2 flex items-center justify-center gap-2 group"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size={20} />
          ) : (
            <>
              {t('register.submit', 'Create Account')}
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center mt-8 font-body-sm text-body-sm text-on-surface-variant">
        {t('register.already_have_account', 'Already have an account?')}{' '}
        <Link
          href="/student/login"
          className="text-secondary font-semibold hover:underline ml-1"
        >
          {t('register.sign_in_here', 'Log in here')}
        </Link>
      </p>

      {/* ReCaptcha Info */}
      <p className="text-xs text-center text-outline mt-6">
        {t('register.recaptcha_disclaimer')}{' '}
        <a
          href="https://policies.google.com/privacy"
          className="underline hover:text-on-surface"
        >
          {t('register.privacy')}
        </a>{' '}
        &{' '}
        <a
          href="https://policies.google.com/terms"
          className="underline hover:text-on-surface"
        >
          {t('register.terms')}
        </a>
      </p>

      {/* Modal for Privacy Policy */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>{t('register.policy_title')}</DialogTitle>
            <DialogDescription>
              {t('register.policy_description') ||
                'Please read our privacy policy carefully.'}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {Object.values(
              t('register.policy_content', { returnObjects: true })
            ).map((text: any, index: number) => (
              <p key={index} className="mb-2 text-sm text-muted-foreground">
                {text}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Registration;
