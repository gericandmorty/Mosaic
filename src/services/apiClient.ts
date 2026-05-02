import axios from 'axios';
import Constants from 'expo-constants';

// IMPORTANT: Replace this IP with your actual machine IP address!
// You can find it by running 'ipconfig' in your terminal.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL; 

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach tokens if needed later
apiClient.interceptors.request.use(async (config) => {
  // We can add token logic here when we have persistent storage
  return config;
});
