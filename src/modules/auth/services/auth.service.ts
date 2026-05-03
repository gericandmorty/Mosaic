import { apiClient } from '../../../services/apiClient';

export const authService = {
  login: async ({ email, password }: any) => {
    const response = await apiClient.post('/auth/login', { 
      email, 
      password 
    });
    return response.data;
  },

  register: async ({ email, password, displayName }: any) => {
    const response = await apiClient.post('/auth/register', { 
      email, 
      password,
      displayName 
    });
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (code: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset-password', { 
      token: code, 
      newPassword 
    });
    return response.data;
  },

  verifyEmail: async (code: string) => {
    const response = await apiClient.get(`/auth/verify?token=${code}`);
    return response.data;
  },

  resendCode: async (email: string) => {
    const response = await apiClient.post('/auth/resend-code', { email });
    return response.data;
  }
};
