import { apiClient } from '../../../services/apiClient';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { 
      email, 
      password 
    });
    return response.data;
  },

  register: async (email: string, password: string, displayName: string) => {
    const response = await apiClient.post('/auth/register', { 
      email: email, 
      password: password,
      displayName: displayName 
    });
    return response.data;
  },
};
