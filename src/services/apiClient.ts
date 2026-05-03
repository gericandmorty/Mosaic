import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Use the environment variable if it's explicitly set
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (__DEV__) {
    const host = Constants.expoConfig?.hostUri?.split(':').shift();
    const port = '5191';

    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${port}/api`;
    }
    return `http://${host || 'localhost'}:${port}/api`;
  }
  
  return '';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach tokens if needed later
apiClient.interceptors.request.use(async (config) => {
  // We can add token logic here when we have persistent storage
  return config;
});
