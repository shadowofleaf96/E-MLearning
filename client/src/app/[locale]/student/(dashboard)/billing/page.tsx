'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Receipt, Clock, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentBillingPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.tenantId || user.tenant?.isInstitution) {
        setLoading(false);
      } else {
        fetchPayments();
      }
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      const res = await api.get(ENDPOINTS.PAYMENTS.STUDENT_HISTORY);
      setPayments(res.data.data);
    } catch (error) {
      console.error('Failed to fetch payments', error);
      toast.error('Failed to load billing history');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = async () => {
    try {
      // Use the environment variable for the price ID, fallback to the hardcoded one just in case
      const priceId =
        process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID ||
        'price_1TqdK52NpM0b2BjBKI9Y6L6p';
      const res = await api.post(ENDPOINTS.PAYMENTS.CREATE_SUBSCRIPTION, {
        priceId,
        successUrl: window.location.href + '?success=true',
        cancelUrl: window.location.href + '?canceled=true',
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      const msg =
        error.response?.data?.message || 'Failed to initiate subscription';
      toast.error(`Error: ${msg}`);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await api.post(ENDPOINTS.PAYMENTS.CUSTOMER_PORTAL, {
        returnUrl: window.location.href,
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      toast.error('Failed to access billing portal');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  if (user?.tenantId || user?.tenant?.isInstitution) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Billing & Subscription
          </h1>
          <p className="font-body-md text-base text-on-surface-variant">
            Manage your payment methods, view your current plan, and download
            invoices.
          </p>
        </div>

        <section className="bg-surface-card rounded-2xl border border-border-subtle p-8 shadow-sm flex flex-col items-center justify-center text-center py-20">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 border border-border-subtle shadow-sm">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-4">
            Managed by your Organization
          </h2>
          <p className="text-on-surface-variant font-body-md max-w-md mx-auto mb-8">
            Your billing and subscription are managed directly by{' '}
            {(user.tenant as any)?.name || 'your institution'}. You have full
            access to the premium features granted by your organization.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Header Section */}
      <div>
        <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2 tracking-tight">
          Billing & Subscription
        </h1>
        <p className="font-body-md text-base text-on-surface-variant">
          Manage your payment methods, view your current plan, and download
          invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Plan & Payment Method */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan */}
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-8 shadow-sm flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 border border-border-subtle shadow-sm">
              {user?.subscriptionStatus === 'active' ? (
                <CheckCircle className="w-10 h-10 text-primary" />
              ) : (
                <Shield className="w-10 h-10 text-outline-variant" />
              )}
            </div>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
              {user?.subscriptionStatus === 'active'
                ? 'Active Premium Subscription'
                : 'No Active Subscription'}
            </h2>
            <p className="text-on-surface-variant font-body-md max-w-md mx-auto mb-8">
              {user?.subscriptionStatus === 'active'
                ? `Your subscription is currently active. Next billing cycle is on ${new Date(user.subscriptionEndDate || Date.now()).toLocaleDateString()}`
                : 'You are currently on the free tier. Upgrade your plan to unlock premium courses, live sessions, and personalized mentoring.'}
            </p>
            {user?.subscriptionStatus === 'active' ? (
              <button
                onClick={handleManageBilling}
                className="bg-surface-container-high text-on-surface font-label-md font-bold px-8 py-3 rounded-xl hover:bg-surface-container-highest transition-colors shadow-sm"
              >
                Manage Billing
              </button>
            ) : (
              <button
                onClick={handleUpgradePlan}
                className="bg-secondary text-on-secondary font-label-md font-bold px-8 py-3 rounded-xl hover:bg-secondary-container transition-colors shadow-sm"
              >
                View Pricing Plans
              </button>
            )}
          </section>

          {/* Payment Method - Managed by Stripe Portal */}
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-surface-container text-on-surface rounded-xl border border-border-subtle">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="font-headline-md text-xl font-bold text-on-surface">
                  Payment Methods
                </h2>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-subtle rounded-xl bg-surface-container-lowest">
              <CreditCard className="w-10 h-10 text-outline-variant mb-4" />
              <p className="font-bold text-on-surface mb-1">
                Managed securely with Stripe
              </p>
              <p className="text-sm text-on-surface-variant mb-6 text-center max-w-xs">
                To add or update your credit card, please access the billing
                portal.
              </p>
              <button
                onClick={handleManageBilling}
                className="text-secondary font-bold text-sm hover:underline flex items-center gap-2"
              >
                Manage Payment Methods
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Billing History */}
        <div className="space-y-8">
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-8 shadow-sm min-h-125 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-surface-container text-on-surface rounded-xl border border-border-subtle">
                <Receipt className="w-6 h-6" />
              </div>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                Billing History
              </h2>
            </div>

            {payments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                  <Receipt className="w-8 h-8 text-outline-variant" />
                </div>
                <p className="font-bold text-on-surface mb-1">
                  No billing history
                </p>
                <p className="text-sm text-on-surface-variant max-w-xs">
                  When you make a purchase or subscribe, your invoices will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border border-border-subtle rounded-xl bg-surface-container-lowest"
                  >
                    <div>
                      <p className="font-bold text-on-surface text-sm">
                        {payment.course?.title || 'Subscription'}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-on-surface">
                        ${payment.amount}
                      </p>
                      <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed">
                        {payment.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
