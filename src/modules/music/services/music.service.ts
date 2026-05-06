import { apiClient, getBaseUrl } from '../../../services/apiClient';

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: string;
  url: string;
}

export const musicService = {
  search: async (query: string, limit: number = 20): Promise<Track[]> => {
    const response = await apiClient.get(`/music/search`, {
      params: { q: query, limit }
    });
    return response.data;
  },

  getDetails: async (id: string): Promise<Track> => {
    const response = await apiClient.get(`/music/${id}`);
    return response.data;
  },

  getStreamUrl: async (id: string): Promise<string> => {
    const baseUrl = getBaseUrl();
    const streamUrl = `${baseUrl}/music/play/${id}`;
    console.log('--- STREAMING DEBUG ---');
    console.log('ID:', id);
    console.log('Generated URL:', streamUrl);
    return streamUrl;
  }
};
