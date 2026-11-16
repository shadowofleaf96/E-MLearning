import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';
import { CurrentUser } from '@/types/user.types';

export interface LoginPayload {
  identifier: string;
  password: string;
  recaptchaToken?: string;
  tenantId?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  recaptchaToken?: string;
  tenantId?: string;
}

export interface GoogleAuthPayload {
  credential: string;
  recaptchaToken?: string;
  tenantId?: string;
}

export interface ForgotPasswordPayload {
  email: string;
  recaptchaToken?: string;
  tenantId?: string;
}

export interface ResetPasswordPayload {
  password: string;
  token: string;
}

export interface Verify2FALoginPayload {
  tempToken: string;
  code: string;
  tenantId?: string;
}

export interface Setup2FAPayload {
  code: string;
}

export interface LoginResponse {
  user?: CurrentUser;
  token?: string;
  requires2FA?: boolean;
  tempToken?: string;
}

export const authService = {
  async login(credentials: LoginPayload): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  async register(
    data: RegisterPayload | FormData
  ): Promise<ApiResponse<{ message: string }>> {
    const config =
      data instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, data, config);
    return response.data;
  },

  async googleAuth(
    data: GoogleAuthPayload
  ): Promise<ApiResponse<{ user: CurrentUser; token: string }>> {
    const response = await api.post(ENDPOINTS.AUTH.GOOGLE_LOGIN, data);
    return response.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await api.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<CurrentUser>> {
    const response = await api.get(ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  async forgotPassword(
    data: ForgotPasswordPayload
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },

  async resetPassword(
    data: ResetPasswordPayload
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put(
      `${ENDPOINTS.AUTH.RESET_PASSWORD}/${data.token}`,
      { password: data.password }
    );
    return response.data;
  },

  async verify2FALogin(
    data: Verify2FALoginPayload
  ): Promise<ApiResponse<{ user: CurrentUser; token: string }>> {
    const response = await api.post(ENDPOINTS.AUTH.VERIFY_2FA_LOGIN, data);
    return response.data;
  },

  async enable2FA(): Promise<
    ApiResponse<{ secret: string; qrCodeUrl: string }>
  > {
    const response = await api.post(ENDPOINTS.AUTH.ENABLE_2FA);
    return response.data;
  },

  async verify2FASetup(
    data: Setup2FAPayload
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post(ENDPOINTS.AUTH.VERIFY_2FA_SETUP, data);
    return response.data;
  },

  async disable2FA(
    data: Setup2FAPayload
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post(ENDPOINTS.AUTH.DISABLE_2FA, data);
    return response.data;
  },
};
