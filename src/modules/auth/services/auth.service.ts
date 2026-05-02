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
};
