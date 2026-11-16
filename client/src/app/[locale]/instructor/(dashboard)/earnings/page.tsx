'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Edit2,
  Filter,
  Download,
  MapPin,
  Mail,
  X,
  Banknote,
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { exportToCsv } from '@/lib/exportCsv';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/store/slices/authSlice';

export default function InstructorEarningsPage() {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.auth.user) as any;

  const [earningsData, setEarningsData] = useState<{
    totalEarnings: number;
    transactions: any[];
  }>({
    totalEarnings: 0,
    transactions: [],
  });
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal States
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showRequestPayoutModal, setShowRequestPayoutModal] = useState(false);

  // Form States
  const [billingInput, setBillingInput] = useState(user?.billingAddress || '');
  const [payoutMethodInput, setPayoutMethodInput] = useState(
    user?.payoutMethod || 'bank_transfer'
  );
  const [payoutDetailsInput, setPayoutDetailsInput] = useState(
    user?.payoutDetails || ''
  );
  const [payoutAmountInput, setPayoutAmountInput] = useState('');
  const [payoutNotesInput, setPayoutNotesInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTransactions = earningsData.transactions.filter(
    (txn) => filterStatus === 'all' || txn.paymentStatus === filterStatus
  );

  const fetchEarningsAndPayouts = async () => {
    try {
      const [earningsRes] = await Promise.all([
        api.get('/payments/instructor/earnings'),
      ]);
      setEarningsData(
        earningsRes.data.data || { totalEarnings: 0, transactions: [] }
      );
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load earnings data');
    }
  };

  useEffect(() => {
    fetchEarningsAndPayouts();
  }, []);

  useEffect(() => {
    if (user) {
      setBillingInput(user.billingAddress || '');
      setPayoutMethodInput(user.payoutMethod || 'bank_transfer');
      setPayoutDetailsInput(user.payoutDetails || '');
    }
  }, [user]);

  const handleUpdateBilling = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.put('/users/profile/billing', {
        billingAddress: billingInput,
        payoutMethod: payoutMethodInput,
        payoutDetails: payoutDetailsInput,
      });
      dispatch(updateUser(res.data.data));
      toast.success('Billing details updated successfully');
      setShowBillingModal(false);
      setShowPayoutModal(false);
    } catch (error) {
      console.error('Update billing error:', error);
      toast.error('Failed to update details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestPayout = async () => {
    const amount = Number(payoutAmountInput);
    if (!amount || amount <= 0 || amount > earningsData.totalEarnings) {
      toast.error('Invalid payout amount');
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post('/payments/payouts/request', {
        amount,
        notes: payoutNotesInput,
      });
      toast.success('Payout requested successfully');
      setShowRequestPayoutModal(false);
      setPayoutAmountInput('');
      setPayoutNotesInput('');
      fetchEarningsAndPayouts();
    } catch (error) {
      console.error('Payout request error:', error);
      toast.error('Failed to request payout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
          Earnings &amp; Payouts
        </h2>
        <p className="text-on-surface-variant font-medium text-sm">
          Track your revenue from course sales and manage payouts.
        </p>
      </div>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Summary Overview */}
        <div className="col-span-12 lg:col-span-8 bg-surface-card rounded-2xl border border-border-subtle p-8 flex flex-col md:flex-row justify-between items-start gap-8 hover:shadow-sm transition-shadow">
          <div className="flex-1">
            <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-1">
              Total Earnings
            </h3>
            <p className="text-on-surface-variant text-sm font-medium mb-6">
              Total revenue collected from your published courses.
            </p>

            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-4xl font-bold text-on-surface">
                ${earningsData.totalEarnings.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto min-w-[160px]">
            <button
              onClick={() => setShowRequestPayoutModal(true)}
              className="w-full py-2.5 px-4 bg-secondary text-white font-bold text-sm rounded-xl hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Request Payout
            </button>
            <button className="w-full py-2.5 px-4 bg-transparent text-on-surface-variant font-bold text-sm rounded-xl hover:bg-surface-container-low transition-all border border-border-subtle focus:outline-none focus:ring-2 focus:ring-on-surface-variant focus:ring-offset-2">
              View Analytics
            </button>
          </div>
        </div>

        {/* Payout Method */}
        <div className="col-span-12 lg:col-span-4 bg-surface-card rounded-2xl border border-border-subtle p-8 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Payout Method
            </h3>
            <button
              onClick={() => setShowPayoutModal(true)}
              className="text-secondary text-sm font-bold hover:underline focus:outline-none"
            >
              {user?.payoutMethod ? 'Edit' : 'Add New'}
            </button>
          </div>

          <div className="relative overflow-hidden p-6 bg-linear-to-br from-[#1e293b] to-[#0f172a] rounded-2xl text-white mb-6">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Banknote className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <p className="font-bold italic capitalize">
                  {user?.payoutMethod
                    ? user.payoutMethod.replace('_', ' ')
                    : 'Not Configured'}
                </p>
              </div>
              <p className="font-mono text-sm mb-4 tracking-widest break-all">
                {user?.payoutDetails || 'No details provided'}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-60">
                    Account Holder
                  </p>
                  <p className="text-sm font-bold">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPayoutModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-on-surface-variant font-bold text-sm rounded-xl border border-border-subtle hover:bg-surface-container-low transition-all focus:outline-none"
          >
            <Edit2 className="w-4 h-4" />
            Edit Details
          </button>
        </div>

        {/* Invoices & Payment History */}
        <div className="col-span-12 lg:col-span-9 bg-surface-card rounded-2xl border border-border-subtle overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border-subtle flex justify-between items-center bg-surface-bg/50">
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Payment History
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none flex items-center gap-2 bg-transparent text-on-surface-variant hover:bg-surface-container-low px-8 py-1.5 pl-3 border border-border-subtle rounded-lg transition-colors focus:outline-none text-sm font-bold cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Filter className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
              </div>
              <button
                onClick={() => {
                  exportToCsv('earnings_history', earningsData.transactions, [
                    {
                      header: 'Date',
                      accessor: (txn) =>
                        new Date(txn.createdAt).toLocaleDateString(),
                    },
                    {
                      header: 'Description',
                      accessor: (txn) => txn.course?.title || 'Course Sale',
                    },
                    {
                      header: 'Student',
                      accessor: (txn) =>
                        `${txn.student?.firstName || ''} ${txn.student?.lastName || ''}`.trim(),
                    },
                    {
                      header: 'Amount ($)',
                      accessor: (txn) => Number(txn.amount).toFixed(2),
                    },
                    { header: 'Status', accessor: (txn) => txn.paymentStatus },
                  ]);
                  toast.success('Export downloaded successfully!');
                }}
                className="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-bold">Export All</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-surface-container-low/50 text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                <tr className="border-b border-border-subtle">
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Description</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-surface-container-lowest transition-colors group"
                    >
                      <td className="px-8 py-5 text-sm font-medium text-on-surface-variant">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-sm text-on-surface">
                          {txn.course?.title || 'Course Sale'}
                        </p>
                        <p className="text-xs font-medium text-on-surface-variant mt-0.5">
                          Student: {txn.student?.firstName}{' '}
                          {txn.student?.lastName}
                        </p>
                      </td>
                      <td className="px-8 py-5 font-mono text-sm font-bold text-on-surface">
                        ${Number(txn.amount).toFixed(2)}
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#10b981]/10 text-[#10b981] capitalize">
                          {txn.paymentStatus}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => {
                            exportToCsv(
                              `invoice_${txn.id}`,
                              [txn],
                              [
                                {
                                  header: 'Date',
                                  accessor: (t) =>
                                    new Date(t.createdAt).toLocaleDateString(),
                                },
                                {
                                  header: 'Description',
                                  accessor: (t) =>
                                    t.course?.title || 'Course Sale',
                                },
                                {
                                  header: 'Student',
                                  accessor: (t) =>
                                    `${t.student?.firstName || ''} ${t.student?.lastName || ''}`.trim(),
                                },
                                {
                                  header: 'Amount ($)',
                                  accessor: (t) => Number(t.amount).toFixed(2),
                                },
                                {
                                  header: 'Status',
                                  accessor: (t) => t.paymentStatus,
                                },
                              ]
                            );
                            toast.success('Invoice downloaded!');
                          }}
                          className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low p-2 rounded-lg transition-colors focus:outline-none"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-8 text-center text-sm text-on-surface-variant"
                    >
                      No earnings history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-surface-container-low/30 text-center border-t border-border-subtle">
            <button className="text-sm font-bold text-on-surface-variant hover:text-secondary hover:underline transition-colors focus:outline-none">
              View All Transactions
            </button>
          </div>
        </div>

        {/* Billing Information & Receipts */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:shadow-sm transition-shadow">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Billing Address
            </h3>
            <div className="text-sm font-medium text-on-surface-variant space-y-1">
              <p className="font-bold text-on-surface">
                {user?.firstName} {user?.lastName}
              </p>
              {user?.billingAddress ? (
                user.billingAddress
                  .split('\n')
                  .map((line: string, i: number) => <p key={i}>{line}</p>)
              ) : (
                <p className="italic opacity-70">
                  No billing address configured
                </p>
              )}
            </div>
            <button
              onClick={() => setShowBillingModal(true)}
              className="mt-4 text-xs font-bold text-secondary uppercase tracking-wider hover:underline focus:outline-none"
            >
              Update Address
            </button>
          </div>

          <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 hover:shadow-sm transition-shadow">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-secondary" />
              Receipt Email
            </h3>
            <div className="text-sm font-medium text-on-surface-variant">
              <p>{user?.email}</p>
              <p className="text-xs mt-1.5 text-on-surface-variant/80 italic">
                Receipts are sent here within 24 hours of payment.
              </p>
            </div>
          </div>

          <div className="bg-secondary-container/10 rounded-2xl border border-secondary/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <h4 className="font-bold text-secondary text-sm">
                Secure Billing
              </h4>
            </div>
            <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
              All payments are processed through encrypted channels. EduPremium
              never stores your full card details locally.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                Update Billing Address
              </h3>
              <button
                onClick={() => setShowBillingModal(false)}
                className="text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-on-surface mb-2">
                Address
              </label>
              <textarea
                value={billingInput}
                onChange={(e) => setBillingInput(e.target.value)}
                rows={4}
                placeholder="123 Scholar Lane&#10;San Francisco, CA 94103"
                className="w-full bg-surface-container-lowest text-on-surface border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-6"
              />
              <button
                onClick={handleUpdateBilling}
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary font-bold text-sm py-3 px-4 rounded-xl hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                Payout Method
              </h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-on-surface mb-2">
                Method Type
              </label>
              <select
                value={payoutMethodInput}
                onChange={(e) => setPayoutMethodInput(e.target.value)}
                className="w-full bg-surface-container-lowest text-on-surface border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-4"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
              </select>

              <label className="block text-sm font-bold text-on-surface mb-2">
                Details (IBAN / PayPal Email)
              </label>
              <input
                type="text"
                value={payoutDetailsInput}
                onChange={(e) => setPayoutDetailsInput(e.target.value)}
                placeholder={
                  payoutMethodInput === 'paypal'
                    ? 'instructor@example.com'
                    : 'US00 0000 0000 0000'
                }
                className="w-full bg-surface-container-lowest text-on-surface border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-6"
              />
              <button
                onClick={handleUpdateBilling}
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary font-bold text-sm py-3 px-4 rounded-xl hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Payout Details'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRequestPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                Request Payout
              </h3>
              <button
                onClick={() => setShowRequestPayoutModal(false)}
                className="text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-surface-container-low rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-on-surface-variant">
                  Available Balance
                </p>
                <p className="text-2xl font-bold text-on-surface">
                  ${earningsData.totalEarnings.toFixed(2)}
                </p>
              </div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                Amount to Request ($)
              </label>
              <input
                type="number"
                max={earningsData.totalEarnings}
                value={payoutAmountInput}
                onChange={(e) => setPayoutAmountInput(e.target.value)}
                placeholder="100.00"
                className="w-full bg-surface-container-lowest text-on-surface border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-4"
              />

              <label className="block text-sm font-bold text-on-surface mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={payoutNotesInput}
                onChange={(e) => setPayoutNotesInput(e.target.value)}
                rows={2}
                placeholder="Any special instructions..."
                className="w-full bg-surface-container-lowest text-on-surface border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-6"
              />
              <button
                onClick={handleRequestPayout}
                disabled={
                  isSubmitting ||
                  !payoutAmountInput ||
                  Number(payoutAmountInput) <= 0 ||
                  Number(payoutAmountInput) > earningsData.totalEarnings
                }
                className="w-full bg-secondary text-white font-bold text-sm py-3 px-4 rounded-xl hover:bg-secondary/90 transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Requesting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
