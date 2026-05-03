import { Platform } from 'react-native';
import { apiClient } from '../../../services/apiClient';

export const profileService = {
  updateDisplayName: async (displayName: string) => {
    const response = await apiClient.put('/user/display-name', { displayName });
    return response.data;
  },

  updatePassword: async (newPassword: string) => {
    const response = await apiClient.put('/user/password', { newPassword });
    return response.data;
  },

  updateProfilePicture: async (fileUri: string) => {
    const formData = new FormData();
    
    // Ensure the URI is properly formatted for React Native
    const uri = Platform.OS === 'android' ? fileUri : fileUri.replace('file://', '');
    
    // @ts-ignore
    formData.append('file', {
      uri: fileUri,
      name: `profile_${Date.now()}.jpg`,
      type: 'image/jpeg',
    });

    console.log('Sending FormData to backend...');
    try {
      const response = await apiClient.post('/user/profile-picture', formData, {
        headers: {
          'Accept': 'application/json',
        },
        transformRequest: (data) => data, // Prevent axios from transforming FormData
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.message);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
      }
      throw error;
    }
  }
};
