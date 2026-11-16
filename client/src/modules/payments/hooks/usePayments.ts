'use client';

import { useState, useCallback } from 'react';
import { paymentsService, PaymentIntent } from '../services/payments.service';

export function usePayments() {
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initPayment = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentsService.createPaymentIntent(courseId);
      setIntent(res.data);
      return { success: true, data: res.data };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Failed to initialize payment';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const confirm = useCallback(async (paymentIntentId: string) => {
    setLoading(true);
    setError(null);
    try {
      await paymentsService.confirmPayment(paymentIntentId);
      return { success: true };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Payment confirmation failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    intent,
    loading,
    error,
    initPayment,
    confirm,
  };
}
