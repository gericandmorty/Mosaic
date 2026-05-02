import { apiClient } from '../../../services/apiClient';
import { useAuthStore } from '../../auth/store/auth.slice';
import { Track } from '../../music/services/music.service';

const getHeaders = () => {
  const user = useAuthStore.getState().user;
  return { 'X-Firebase-Uid': user?.firebaseUid || '' };
};

export const historyService = {
  getRecentHistory: async (limit: number = 10): Promise<Track[]> => {
    const res = await apiClient.get(`/history?limit=${limit}`, { headers: getHeaders() });
    return res.data.map((item: any) => ({
      id: item.youtubeId,
      title: item.title,
      artist: item.artist,
      thumbnailUrl: item.thumbnailUrl,
      duration: item.duration,
    }));
  },

  addToHistory: async (track: Track): Promise<void> => {
    // Fire and forget
    apiClient.post('/history', {
      youtubeId: track.id,
      title: track.title,
      artist: track.artist,
      thumbnailUrl: track.thumbnailUrl,
      duration: track.duration
    }, { headers: getHeaders() }).catch(err => console.log('Failed to log history:', err));
  },

  clearHistory: async (): Promise<void> => {
    await apiClient.delete('/history', { headers: getHeaders() });
  }
};
