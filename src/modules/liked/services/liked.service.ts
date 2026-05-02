import { apiClient } from '../../../services/apiClient';
import { useAuthStore } from '../../auth/store/auth.slice';
import { Track } from '../../music/services/music.service';

const getHeaders = () => {
  const user = useAuthStore.getState().user;
  return { 'X-Firebase-Uid': user?.firebaseUid || '' };
};

export const likedService = {
  getLikedSongs: async (): Promise<Track[]> => {
    const res = await apiClient.get('/library/liked', { headers: getHeaders() });
    return res.data.map((item: any) => ({
      id: item.youtubeId,
      title: item.title,
      artist: item.artist,
      thumbnailUrl: item.thumbnailUrl,
      duration: item.duration,
    }));
  },

  toggleLikedSong: async (track: Track): Promise<void> => {
    await apiClient.post('/library/liked/toggle', {
      youtubeId: track.id,
      title: track.title,
      artist: track.artist,
      thumbnailUrl: track.thumbnailUrl,
      duration: track.duration
    }, { headers: getHeaders() });
  },

  checkIsLiked: async (youtubeId: string): Promise<boolean> => {
    const res = await apiClient.get(`/library/liked/check/${youtubeId}`, { headers: getHeaders() });
    return res.data.isLiked;
  }
};
