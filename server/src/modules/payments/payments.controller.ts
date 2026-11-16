import { Request, Response, NextFunction } from 'express';
import { paymentsService } from './payments.service';

export async function getPayments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const payments = await paymentsService.getPayments(tenantId);
    res.status(200).json({ status: 'success', data: payments });
  } catch (error) {
    next(error);
  }
}

export async function getTenantBilling(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const billing = await paymentsService.getTenantBilling(tenantId);
    res.status(200).json({ status: 'success', data: billing });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const id = req.params.id as string;
    const payment = await paymentsService.getPaymentById(tenantId, id);
    if (!payment) {
      res.status(404).json({ status: 'error', message: 'Payment not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: payment });
  } catch (error) {
    next(error);
  }
}

export async function initiatePayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: studentId, tenantId } = req.user!;
    const { courseId, amount, currency } = req.body;

    if (!courseId || !amount) {
      res
        .status(400)
        .json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    const payment = await paymentsService.initiatePayment(
      tenantId,
      studentId,
      courseId,
      amount,
      currency
    );
    res.status(201).json({ status: 'success', data: payment });
  } catch (error) {
    next(error);
  }
}

export async function createSubscriptionSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: studentId, tenantId } = req.user!;
    const { priceId, successUrl, cancelUrl } = req.body;

    const session = await paymentsService.createSubscriptionSession(
      tenantId,
      studentId,
      priceId,
      successUrl,
      cancelUrl
    );
    res.status(200).json({ status: 'success', url: session.url });
  } catch (error) {
    next(error);
  }
}

export async function createCustomerPortalSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: studentId } = req.user!;
    const { returnUrl } = req.body;

    const session = await paymentsService.createCustomerPortalSession(
      studentId,
      returnUrl
    );
    res.status(200).json({ status: 'success', url: session.url });
  } catch (error) {
    next(error);
  }
}

export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signature = req.headers['stripe-signature'] as string;
    await paymentsService.handleWebhook(req.body, signature);
    res.status(200).json({ status: 'success', message: 'Webhook received' });
  } catch (error) {
    next(error);
  }
}

export async function getStudentPaymentHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: studentId, tenantId } = req.user!;
    const payments = await paymentsService.getStudentPaymentHistory(
      tenantId,
      studentId
    );
    res.status(200).json({ status: 'success', data: payments });
  } catch (error) {
    next(error);
  }
}

export async function getInstructorEarnings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: instructorId, tenantId } = req.user!;
    const earnings = await paymentsService.getInstructorEarnings(
      tenantId,
      instructorId
    );
    res.status(200).json({ status: 'success', data: earnings });
  } catch (error) {
    next(error);
  }
}

export async function requestPayout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: instructorId, tenantId } = req.user!;
    const { amount, notes } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      res
        .status(400)
        .json({ status: 'failed', message: 'Invalid payout amount' });
      return;
    }

    const payout = await paymentsService.requestPayout(
      tenantId,
      instructorId,
      Number(amount),
      notes ? String(notes) : undefined
    );
    res.status(201).json({ status: 'success', data: payout });
  } catch (error) {
    next(error);
  }
}

export async function getPayoutHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: instructorId, tenantId } = req.user!;
    const payouts = await paymentsService.getPayoutHistory(
      tenantId,
      instructorId
    );
    res.status(200).json({ status: 'success', data: payouts });
  } catch (error) {
    next(error);
  }
}
