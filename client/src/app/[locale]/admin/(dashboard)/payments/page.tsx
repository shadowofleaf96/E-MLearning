'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import api from '@/services/api';

interface PaymentRow {
  id: string;
  student: any;
  course: any;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments');
        setPayments(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch payments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const columns = [
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
        <span className="text-on-surface-variant">
          {row.course?.title || 'Unknown'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: PaymentRow) => (
        <span className="font-mono text-on-surface">
          ${Number(row.amount).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row: PaymentRow) => (
        <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-secondary capitalize">
          {row.paymentStatus}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (row: PaymentRow) => (
        <span className="text-on-surface-variant text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="text-on-surface-variant p-8">Loading payments...</div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Payment Transactions
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm md:text-base">
            Review subscriber invoices and course checkouts.
          </p>
        </div>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        emptyMessage="No payments found."
      />
    </div>
  );
}
