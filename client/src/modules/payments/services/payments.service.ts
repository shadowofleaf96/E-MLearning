import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export const paymentsService = {
  async createPaymentIntent(
    courseId: string
  ): Promise<ApiResponse<PaymentIntent>> {
    const response = await api.post(ENDPOINTS.PAYMENTS.CREATE_INTENT, {
      courseId,
    });
    return response.data;
  },

  async confirmPayment(paymentIntentId: string): Promise<ApiResponse<void>> {
    const response = await api.post(`/payments/${paymentIntentId}/confirm`);
    return response.data;
  },
};
