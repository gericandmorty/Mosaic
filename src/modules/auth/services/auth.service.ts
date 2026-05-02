import { apiClient } from '../../../services/apiClient';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { 
      email, 
      password 
    });
    return response.data;
  },

  register: async (email: string, displayName: string) => {
    const response = await apiClient.post('/auth/register', { 
      email, 
      displayName 
    });
    return response.data;
  }
};
