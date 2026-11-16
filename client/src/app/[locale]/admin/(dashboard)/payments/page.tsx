'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DataTable from '@/components/shared/DataTable';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { toast } from 'react-toastify';
import { exportToCSV } from '@/utils/exportToCSV';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Download,
  CreditCard,
  Send,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PaymentRow {
  id: string;
  student: any;
  course: any;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentProvider?: string;
  createdAt: string;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  notes?: string;
  createdAt: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    payoutMethod?: string;
    payoutDetails?: string;
  };
}

interface AnalyticsData {
  totalRevenue: number;
  netRevenue: number;
  completedTransactions: number;
  paidPayouts: number;
  pendingPayouts: number;
  pendingPayoutsCount: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'payouts'>(
    'transactions'
  );

  // Payout Decision Modal State
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(
    null
  );
  const [payoutNotes, setPayoutNotes] = useState('');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [paymentsRes, payoutsRes, analyticsRes] = await Promise.all([
        api.get('/payments'),
        api.get(ENDPOINTS.ADMIN_PAYMENTS.PAYOUTS),
        api.get(ENDPOINTS.ADMIN_PAYMENTS.ANALYTICS),
      ]);
      setPayments(paymentsRes.data.data || []);
      setPayouts(payoutsRes.data.data || []);
      setAnalytics(analyticsRes.data.data || null);
    } catch {
      toast.error('Failed to load financial records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdatePayoutStatus = async (status: 'paid' | 'rejected') => {
    if (!selectedPayout) return;
    try {
      setIsProcessingPayout(true);
      await api.put(ENDPOINTS.ADMIN_PAYMENTS.UPDATE_PAYOUT(selectedPayout.id), {
        status,
        notes: payoutNotes.trim() || undefined,
      });
      toast.success(
        `Payout marked as ${status === 'paid' ? 'Paid' : 'Rejected'}`
      );
      setSelectedPayout(null);
      setPayoutNotes('');
      fetchData();
    } catch {
      toast.error('Failed to update payout status');
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const paymentColumns = [
    {
      header: 'Student',
      accessor: (row: PaymentRow) => (
        <span className="font-semibold text-on-surface">
          {row.student
            ? `${row.student.firstName} ${row.student.lastName}`
            : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Course',
      accessor: (row: PaymentRow) => (
        <span className="text-on-surface-variant font-medium">
          {row.course?.title || 'General Checkout'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: PaymentRow) => (
        <span className="font-mono font-bold text-on-surface">
          ${Number(row.amount).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row: PaymentRow) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
            row.paymentStatus === 'completed'
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
          }`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
    {
      header: 'Provider',
      accessor: (row: PaymentRow) => (
        <span className="text-xs text-on-surface-variant uppercase font-mono">
          {row.paymentProvider || 'Stripe'}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (row: PaymentRow) => (
        <span className="text-on-surface-variant text-xs">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const payoutColumns = [
    {
      header: 'Instructor',
      accessor: (row: PayoutRequest) => (
        <div>
          <div className="font-bold text-on-surface">
            {row.instructor.firstName} {row.instructor.lastName}
          </div>
          <div className="text-xs text-on-surface-variant">
            {row.instructor.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: PayoutRequest) => (
        <span className="font-mono font-bold text-on-surface text-base">
          ${Number(row.amount).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Payout Method',
      accessor: (row: PayoutRequest) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface uppercase block">
            {row.instructor.payoutMethod || 'Direct Deposit'}
          </span>
          <span className="text-on-surface-variant font-mono">
            {row.instructor.payoutDetails || 'No bank account details provided'}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: PayoutRequest) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
            row.status === 'paid'
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              : row.status === 'rejected'
                ? 'bg-error/10 text-error border border-error/20'
                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Requested Date',
      accessor: (row: PayoutRequest) => (
        <span className="text-on-surface-variant text-xs">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: PayoutRequest) =>
        row.status === 'pending' ? (
          <button
            onClick={() => {
              setSelectedPayout(row);
              setPayoutNotes('');
            }}
            className="px-3 py-1 bg-secondary text-white font-bold text-xs rounded-lg hover:bg-secondary/90 transition-all shadow-sm"
          >
            Review &amp; Pay
          </button>
        ) : (
          <span className="text-xs text-on-surface-variant font-medium">
            {row.notes ? `Note: ${row.notes}` : 'Completed'}
          </span>
        ),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <div className="w-full max-w-container-max mx-auto space-y-8 animate-in fade-in duration-300 selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-on-surface">
            Revenue &amp; Payouts Management
          </h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Monitor institutional cash flow, process instructor withdrawal
            requests, and audit checkout volume.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (payments.length === 0) {
                toast.error('No payments data available');
                return;
              }
              exportToCSV(
                payments.map((p) => ({
                  id: p.id,
                  student: p.student
                    ? `${p.student.firstName} ${p.student.lastName}`
                    : 'Unknown',
                  course: p.course?.title || 'General',
                  amount: p.amount,
                  status: p.paymentStatus,
                  date: new Date(p.createdAt).toLocaleDateString(),
                })),
                'payments_transactions_export',
                [
                  { key: 'id', label: 'Transaction ID' },
                  { key: 'student', label: 'Learner' },
                  { key: 'course', label: 'Course' },
                  { key: 'amount', label: 'Amount ($)' },
                  { key: 'status', label: 'Status' },
                  { key: 'date', label: 'Date' },
                ]
              );
              toast.success('Transactions exported to CSV');
            }}
            className="px-4 py-2 border border-border-subtle rounded-xl text-sm font-bold hover:bg-surface-container-low transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface-card border border-border-subtle p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Gross Revenue
            </span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="font-headline-lg text-2xl font-bold text-on-surface">
            ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {analytics?.completedTransactions || 0} completed checkouts
            </span>
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Net Institutional Share
            </span>
            <CreditCard className="w-5 h-5 text-secondary" />
          </div>
          <div className="font-headline-lg text-2xl font-bold text-on-surface">
            ${analytics?.netRevenue?.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-on-surface-variant mt-1">
            After instructor payouts disbursed
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Paid Out to Instructors
            </span>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="font-headline-lg text-2xl font-bold text-on-surface">
            ${analytics?.paidPayouts?.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-on-surface-variant mt-1">
            Completed instructor withdrawals
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Pending Payout Requests
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="font-headline-lg text-2xl font-bold text-on-surface">
            ${analytics?.pendingPayouts?.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-amber-600 font-bold mt-1">
            {analytics?.pendingPayoutsCount || 0} requests awaiting review
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle gap-8">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-4 text-sm font-bold transition-all focus:outline-none flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Transactions History
          <span className="px-2 py-0.5 bg-surface-container-high text-on-surface text-[11px] font-bold rounded-full">
            {payments.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-4 text-sm font-bold transition-all focus:outline-none flex items-center gap-2 ${
            activeTab === 'payouts'
              ? 'text-secondary border-b-2 border-secondary'
              : 'text-on-surface-variant hover:text-secondary'
          }`}
        >
          <Send className="w-4 h-4" />
          Instructor Payout Requests
          {analytics && analytics.pendingPayoutsCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 text-[11px] font-bold rounded-full">
              {analytics.pendingPayoutsCount} pending
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Transactions Table */}
      {activeTab === 'transactions' && (
        <section className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
          <DataTable
            data={payments}
            columns={paymentColumns}
            emptyMessage="No payments found."
          />
        </section>
      )}

      {/* Tab 2: Payout Requests Queue */}
      {activeTab === 'payouts' && (
        <section className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
          <DataTable
            data={payouts}
            columns={payoutColumns}
            emptyMessage="No instructor payout requests submitted."
          />
        </section>
      )}

      {/* Review Payout Request Modal */}
      <Dialog
        open={!!selectedPayout}
        onOpenChange={(open) => !open && setSelectedPayout(null)}
      >
        <DialogContent className="max-w-md bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-on-surface">
              Review Instructor Payout Request
            </DialogTitle>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-surface-container-lowest rounded-xl border border-border-subtle space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Instructor:
                  </span>
                  <span className="text-xs font-bold text-on-surface">
                    {selectedPayout.instructor.firstName}{' '}
                    {selectedPayout.instructor.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Requested Amount:
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-600">
                    ${Number(selectedPayout.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Payout Method:
                  </span>
                  <span className="text-xs font-bold uppercase text-on-surface">
                    {selectedPayout.instructor.payoutMethod || 'Direct'}
                  </span>
                </div>
                <div className="pt-2 border-t border-border-subtle text-xs">
                  <span className="text-on-surface-variant block mb-1">
                    Beneficiary Account / Details:
                  </span>
                  <p className="font-mono bg-surface-bg p-2 rounded border border-border-subtle text-on-surface">
                    {selectedPayout.instructor.payoutDetails ||
                      'No bank account details provided'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Admin Transfer Notes / Reference:
                </label>
                <input
                  type="text"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="e.g. Wire transfer ref #TX-883921"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-subtle text-sm outline-none focus:border-secondary"
                />
              </div>

              <div className="pt-3 border-t border-border-subtle flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdatePayoutStatus('rejected')}
                  disabled={isProcessingPayout}
                  className="px-4 py-2 text-error border border-error/30 hover:bg-error/10 font-bold text-xs rounded-xl transition-all"
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdatePayoutStatus('paid')}
                  disabled={isProcessingPayout}
                  className="px-5 py-2 bg-secondary text-white hover:bg-secondary/90 font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  Approve &amp; Mark Paid
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
