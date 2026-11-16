'use client';

import React, { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CheckoutFormProps {
  courseId: string;
  courseTitle: string;
  price: number;
  onSuccess: () => void;
}

export default function CheckoutForm({
  courseId,
  courseTitle,
  price,
  onSuccess,
}: CheckoutFormProps) {
  const { initPayment, confirm, loading, error } = usePayments();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate init payment intent
    const initRes = await initPayment(courseId);
    if (initRes.success && initRes.data) {
      // Simulate Stripe/Cmi gateway payment confirmation
      const confirmRes = await confirm(
        'mock_intent_id_' + Math.random().toString(36).substr(2, 9)
      );
      if (confirmRes.success) {
        setSuccessMsg('Payment processed successfully!');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/60 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Enrollment Checkout
        </h1>
        <p className="text-sm text-zinc-400">
          Complete payment details to gain access
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-zinc-900/60 p-4 border border-white/5">
        <span className="text-xs text-zinc-500 block">Course Name</span>
        <span className="text-sm font-semibold text-white block truncate">
          {courseTitle}
        </span>
        <div className="mt-3 flex justify-between items-center border-t border-white/5 pt-3">
          <span className="text-xs text-zinc-500">Total Price</span>
          <span className="text-lg font-bold text-emerald-400">
            {price} MAD
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
            {successMsg}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="card-name" className="text-zinc-300">
            Cardholder Name
          </Label>
          <Input
            id="card-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="card-number" className="text-zinc-300">
            Card Number
          </Label>
          <Input
            id="card-number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="•••• •••• •••• ••••"
            maxLength={19}
            required
            className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry" className="text-zinc-300">
              Expiration Date
            </Label>
            <Input
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              required
              className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc" className="text-zinc-300">
              CVC
            </Label>
            <Input
              id="cvc"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              placeholder="•••"
              maxLength={3}
              required
              className="border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !!successMsg}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 font-semibold py-6 text-base shadow-lg shadow-emerald-500/10 mt-2"
        >
          {loading ? 'Processing...' : `Pay ${price} MAD`}
        </Button>
      </form>
    </div>
  );
}
