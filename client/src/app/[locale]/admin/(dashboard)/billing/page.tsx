'use client';

import React from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import {
  Download,
  ArrowUpCircle,
  ChevronRight,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Headset,
} from 'lucide-react';
import { exportToCSV } from '@/utils/exportToCSV';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import api from '@/services/api';
import { useEffect, useState } from 'react';

export default function BillingSubscriptionPage() {
  const [billingData, setBillingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await api.get('/payments/tenant/billing');
        setBillingData(res.data.data);
      } catch (err) {
        toast.error('Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  if (loading || !billingData) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
            Billing &amp; Subscription
          </h2>
          <p className="text-base font-medium text-on-surface-variant mt-1">
            Manage your institutional plan, track resource usage, and view
            payment history.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (!billingData?.invoices || billingData.invoices.length === 0) {
                toast.error('No billing data to export');
                return;
              }
              exportToCSV(billingData.invoices, 'billing_summary', [
                { key: 'id', label: 'Invoice ID' },
                { key: 'date', label: 'Date' },
                { key: 'amount', label: 'Amount ($)' },
                { key: 'status', label: 'Status' },
              ]);
              toast.success('Billing summary exported');
            }}
            className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-xl bg-surface-container-lowest text-on-surface font-bold text-sm hover:bg-surface-container-low transition-all shadow-sm focus:outline-none"
          >
            <Download className="w-4 h-4" />
            Export Summary
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
            <ArrowUpCircle className="w-4 h-4" />
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Subscription Overview */}
        <section className="col-span-12 lg:col-span-8 bg-surface-card border border-border-subtle p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-fixed text-[#004395] rounded-full">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                <span className="text-[11px] uppercase font-bold tracking-widest">
                  Active Plan
                </span>
              </div>
              <h3 className="font-headline-lg text-4xl font-bold text-on-surface leading-tight">
                {billingData?.plan?.name || 'Loading...'}
              </h3>
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                    Next Renewal
                  </p>
                  <p className="text-xl font-bold text-on-surface">
                    {billingData?.plan?.nextRenewal
                      ? new Date(
                          billingData.plan.nextRenewal
                        ).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                    Billing Cycle
                  </p>
                  <p className="text-xl font-bold text-on-surface">
                    {billingData?.plan?.billingCycle || '-'} ($
                    {billingData?.plan?.amount?.toLocaleString()}/yr)
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <button
                onClick={() => toast.info('Plan management coming soon')}
                className="text-secondary font-bold text-sm hover:underline flex items-center gap-1 justify-end w-full sm:w-auto focus:outline-none"
              >
                Change Plan
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 z-10">
            <div className="flex -space-x-3 overflow-hidden">
              <div className="relative h-10 w-10 rounded-full ring-2 ring-white">
                <Image
                  className="rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvSzWqOqb8DAe0BhZMNrMjV9wOBUtcsAyIXDigcQFenlKI5waAmcSNuumAAH_nZepMUEV8UWWPvIZ8U3euxxZDvJOTsefGVbQ8EsR4K_Nc8o_skjn-r6fLpRGr0t2JnjEST1bUCvHmrjW73ZaF1MyCkAb3FB1f3LQXzbOIUbGsiNVOI0psz29fMaOb7XG13dqddB4RTHoqACTIfAvpteoiWDRofgcjCR5rRqljuuV-pVcZe4WdDzogyYDJMmVYjsClz3aarQZgiiQ"
                  alt="Team member"
                  fill
                />
              </div>
              <div className="relative h-10 w-10 rounded-full ring-2 ring-white">
                <Image
                  className="rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm7IR26bDSbu_A7Gii5PuKaySkV8N7oUI2WvevIb-8fGg9Vnl5RXKVncrjGuCn1k_pivpwCNw4x3eK3jWbnHo7rsqJy1n2BtGpG8A1btC1IqBVR1wOVfYx9BitCfdEVSrAqkG2vn4I3njZqfPTC88UcAtgIOMG2_O6_b60ZszHFRkLwbziesCk4yJteCA-TrGLT5lzsQauuJLhr6u0wQ25aCbMro4klZAdlsLgVAZXGVq1o0VUEuOKHE-A914LVTRN08sRrmLOeLg"
                  alt="Team member"
                  fill
                />
              </div>
              <div className="relative h-10 w-10 rounded-full ring-2 ring-white">
                <Image
                  className="rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzn8cYOFL33A5Cyqc9FgN9WsU8KKzqF8FX5ZQZZLLAH-tBJc8xDyPOjH1rop-3caHJMpM-i4-_mk3i37BH7SjbAWCmZu2lMb4icY-2vSwwf8O6-VQjU3HGY9RaKUMlpe-6fZmIre_eB37KEG-7g036DEj0Xh5uPEcYPstVpUXiM4CCvUUmLRB28acZLJwNpzA8EaJd3ZO9EuURCAt0LOAjf4rRlle1khZiHy0sZR8COHuHd-a02aM0zAhLiLPzzwLkRGoF7G0YmLM"
                  alt="Team member"
                  fill
                />
              </div>
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-surface-container flex items-center justify-center text-xs font-bold z-10 relative">
                +12
              </div>
            </div>
            <p className="text-sm font-medium text-on-surface-variant">
              Your team is utilizing{' '}
              <span className="font-bold text-on-surface">15 admin seats</span>{' '}
              on this plan.
            </p>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none"></div>
          <CheckCircle className="absolute -right-8 -bottom-8 w-[200px] h-[200px] text-secondary opacity-[0.03] rotate-12 pointer-events-none" />
        </section>

        {/* Payment Method */}
        <section className="col-span-12 lg:col-span-4 bg-surface-card border border-border-subtle p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-all shadow-sm hover:shadow-md group">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-md text-xl font-bold text-on-surface">
                Payment Method
              </h4>
              <button
                onClick={() => toast.info('Payment method editing coming soon')}
                className="text-secondary text-sm font-bold hover:underline focus:outline-none"
              >
                Edit
              </button>
            </div>
            <div className="bg-linear-to-br from-[#213145] to-[#0b1c30] p-5 rounded-2xl text-white shadow-lg relative overflow-hidden h-40 flex flex-col justify-between">
              <div className="flex justify-between items-start relative z-10">
                <CreditCard className="w-8 h-8 opacity-90" />
                <span className="font-headline-md italic opacity-90 text-xl font-bold">
                  VISA
                </span>
              </div>
              <div className="relative z-10">
                <p className="font-mono text-sm tracking-[0.2em] mb-1 opacity-90">
                  •••• •••• •••• 4242
                </p>
                <div className="flex justify-between items-end">
                  <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">
                    Modern Scholastic Inc.
                  </p>
                  <p className="text-[10px] uppercase font-bold opacity-70">
                    12/28
                  </p>
                </div>
              </div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 text-sm font-medium text-on-surface-variant">
            <ShieldCheck className="w-5 h-5 text-[#009668]" />
            Secure recurring billing enabled.
          </div>
        </section>

        {/* Usage Metrics */}
        <section className="col-span-12 bg-surface-card border border-border-subtle p-6 sm:p-8 rounded-2xl shadow-sm">
          <h4 className="font-headline-md text-2xl font-bold text-on-surface mb-8">
            Platform Usage Against Limits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-on-surface-variant uppercase tracking-wider">
                  Enrolled Students
                </span>
                <span className="text-on-surface">
                  {billingData?.usage?.students?.used || 0} /{' '}
                  {billingData?.usage?.students?.limit || 0}
                </span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all"
                  style={{
                    width: `${(billingData?.usage?.students?.used / billingData?.usage?.students?.limit) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs font-medium text-on-surface-variant">
                {Math.round(
                  (billingData?.usage?.students?.used /
                    billingData?.usage?.students?.limit) *
                    100 || 0
                )}
                % of student limit reached
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-on-surface-variant uppercase tracking-wider">
                  Published Courses
                </span>
                <span className="text-on-surface">
                  {billingData?.usage?.courses?.used || 0} /{' '}
                  {billingData?.usage?.courses?.limit || 0}
                </span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all"
                  style={{
                    width: `${(billingData?.usage?.courses?.used / billingData?.usage?.courses?.limit) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs font-medium text-on-surface-variant">
                {Math.round(
                  (billingData?.usage?.courses?.used /
                    billingData?.usage?.courses?.limit) *
                    100 || 0
                )}
                % of course limit reached
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-on-surface-variant uppercase tracking-wider">
                  Cloud Storage
                </span>
                <span className="text-on-surface">
                  {billingData?.usage?.storage?.used || 0}
                  {billingData?.usage?.storage?.unit} /{' '}
                  {billingData?.usage?.storage?.limit || 0}
                  {billingData?.usage?.storage?.unit}
                </span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all"
                  style={{
                    width: `${(billingData?.usage?.storage?.used / billingData?.usage?.storage?.limit) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs font-medium text-on-surface-variant">
                {Math.round(
                  (billingData?.usage?.storage?.used /
                    billingData?.usage?.storage?.limit) *
                    100 || 0
                )}
                % of {billingData?.usage?.storage?.limit}
                {billingData?.usage?.storage?.unit} capacity used
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-on-surface-variant uppercase tracking-wider">
                  Live Minutes
                </span>
                <span className="text-on-surface">
                  {billingData?.usage?.liveMinutes?.used || 0} /{' '}
                  {billingData?.usage?.liveMinutes?.limit || 0}
                </span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="bg-error h-full rounded-full transition-all"
                  style={{
                    width: `${(billingData?.usage?.liveMinutes?.used / billingData?.usage?.liveMinutes?.limit) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-error font-bold">
                {Math.round(
                  (billingData?.usage?.liveMinutes?.used /
                    billingData?.usage?.liveMinutes?.limit) *
                    100 || 0
                ) > 90
                  ? `Critical: ${Math.round((billingData?.usage?.liveMinutes?.used / billingData?.usage?.liveMinutes?.limit) * 100 || 0)}% of minutes consumed`
                  : `${Math.round((billingData?.usage?.liveMinutes?.used / billingData?.usage?.liveMinutes?.limit) * 100 || 0)}% of minutes consumed`}
              </p>
            </div>
          </div>
        </section>

        {/* Invoices & Billing History */}
        <section className="col-span-12 bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-bg/50">
            <h4 className="font-headline-md text-xl font-bold text-on-surface">
              Billing History
            </h4>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-[11px] border-b border-border-subtle">
                    Date
                  </th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-[11px] border-b border-border-subtle">
                    Invoice ID
                  </th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-[11px] border-b border-border-subtle">
                    Amount
                  </th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-[11px] border-b border-border-subtle">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-[11px] text-right border-b border-border-subtle">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {(billingData?.invoices || []).map(
                  (invoice: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-surface-container-lowest transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-on-surface">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono font-medium text-on-surface-variant">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-on-surface">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-tertiary-fixed/30 text-on-tertiary-fixed-variant text-[10px] font-bold uppercase tracking-wider">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            toast.info('Export functionality coming soon')
                          }
                          className="text-secondary hover:bg-secondary/10 p-2 rounded-xl transition-colors focus:outline-none"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-surface-bg/50 border-t border-border-subtle text-center">
            <button
              onClick={() => toast.info('Transactions history coming soon')}
              className="text-secondary font-bold text-sm hover:underline focus:outline-none"
            >
              View All Transactions
            </button>
          </div>
        </section>

        {/* Footer / Support Card */}
        <section className="col-span-12 p-8 rounded-2xl bg-surface-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
              <Headset className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="font-headline-md text-xl font-bold text-on-surface">
                Need assistance with billing?
              </p>
              <p className="text-sm font-medium text-on-surface-variant mt-1">
                Our account managers are available for personalized Enterprise
                support.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              onClick={() => toast.info('Sales contact form coming soon')}
              className="px-6 py-2.5 bg-white border border-border-subtle rounded-xl font-bold text-sm hover:bg-surface-container-lowest transition-all shadow-sm focus:outline-none"
            >
              Contact Sales
            </button>
            <button
              onClick={() => toast.info('Live support chat coming soon')}
              className="px-6 py-2.5 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-sm focus:outline-none"
            >
              Chat with Support
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
