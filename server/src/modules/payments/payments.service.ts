import prisma from '../../shared/database/prisma';
import Stripe from 'stripe';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';

// Initialize Stripe with a dummy key if env is missing during dev (though it should fail ideally)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-06-24.dahlia' as any,
});

export const paymentsService = {
  async getPayments(tenantId: string) {
    return prisma.payment.findMany({
      where: { tenantId },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getTenantBilling(tenantId: string) {
    const coursesCount = await prisma.course.count({ where: { tenantId } });
    const studentsCount = await prisma.user.count({
      where: { tenantId, role: 'student' },
    });

    return {
      plan: {
        name: 'Early Access',
        status: 'active',
        nextRenewal: null,
        billingCycle: 'Lifetime',
        amount: 0,
        currency: 'USD',
      },
      usage: {
        students: { used: studentsCount, limit: 1000 },
        courses: { used: coursesCount, limit: 500 },
        storage: { used: 0, limit: 50, unit: 'GB' },
        liveMinutes: { used: 0, limit: 1000 },
      },
      invoices: [],
    };
  },

  async getPaymentById(tenantId: string, paymentId: string) {
    return prisma.payment.findUnique({
      where: { id: paymentId, tenantId },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        course: { select: { id: true, title: true } },
      },
    });
  },

  async createSubscriptionSession(
    tenantId: string,
    studentId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: studentId } });
    if (!user) throw AppError.notFound('User not found');

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: { userId: user.id, tenantId },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: user.id, tenantId, type: 'subscription' },
    });

    return { url: session.url };
  },

  async createCustomerPortalSession(studentId: string, returnUrl: string) {
    const user = await prisma.user.findUnique({ where: { id: studentId } });
    if (!user || !user.stripeCustomerId) {
      throw AppError.badRequest('No active billing account found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  },

  async initiatePayment(
    tenantId: string,
    studentId: string,
    courseId: string,
    amount: number,
    currency: string = 'MAD'
  ) {
    return prisma.payment.create({
      data: {
        tenantId,
        studentId,
        courseId,
        amount,
        currency,
        paymentStatus: 'completed', // Mock successful payment for old flow
        transactionId: `txn_${Date.now()}`,
      },
    });
  },

  async handleWebhook(body: Buffer, signature: string) {
    // Basic Webhook implementation for now
    return true;
  },

  async getStudentPaymentHistory(tenantId: string, studentId: string) {
    return prisma.payment.findMany({
      where: { tenantId, studentId },
      include: {
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getInstructorEarnings(tenantId: string, instructorId: string) {
    const courses = await prisma.course.findMany({
      where: { tenantId, instructorId },
      select: { id: true },
    });

    const courseIds = courses.map((c) => c.id);

    const payments = await prisma.payment.findMany({
      where: {
        tenantId,
        courseId: { in: courseIds },
        paymentStatus: 'completed',
      },
      include: {
        course: { select: { id: true, title: true } },
        student: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalEarnings = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    return {
      totalEarnings,
      transactions: payments,
    };
  },

  async requestPayout(
    tenantId: string,
    instructorId: string,
    amount: number,
    notes?: string
  ) {
    return prisma.payoutRequest.create({
      data: {
        tenantId,
        instructorId,
        amount,
        notes,
        status: 'pending',
      },
    });
  },

  async getPayoutHistory(tenantId: string, instructorId: string) {
    return prisma.payoutRequest.findMany({
      where: { tenantId, instructorId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
