import { apiClient } from '../../../services/apiClient';
import { useAuthStore } from '../../auth/store/auth.slice';
import { Track } from '../../music/services/music.service';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistTrack extends Track {
  position: number;
  addedAt: string;
  youtubeId: string; // Used to match Track.id
}

const getHeaders = () => {
  const user = useAuthStore.getState().user;
  return { 'X-Firebase-Uid': user?.firebaseUid || '' };
};

export const libraryService = {
  // Liked Songs
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
  },

  // Playlists
  getPlaylists: async (): Promise<Playlist[]> => {
    const res = await apiClient.get('/library/playlists', { headers: getHeaders() });
    return res.data;
  },

  createPlaylist: async (name: string, description?: string, coverUrl?: string): Promise<Playlist> => {
    const res = await apiClient.post('/library/playlists', { name, description, coverUrl }, { headers: getHeaders() });
    return res.data;
  },

  deletePlaylist: async (playlistId: string): Promise<void> => {
    await apiClient.delete(`/library/playlists/${playlistId}`, { headers: getHeaders() });
  },

  // Playlist Tracks
  getPlaylistTracks: async (playlistId: string): Promise<PlaylistTrack[]> => {
    const res = await apiClient.get(`/library/playlists/${playlistId}/tracks`, { headers: getHeaders() });
    return res.data.map((item: any) => ({
      ...item,
      id: item.youtubeId, // map youtubeId to Track.id for playback
    }));
  },

  addTrackToPlaylist: async (playlistId: string, track: Track): Promise<void> => {
    await apiClient.post(`/library/playlists/${playlistId}/tracks`, {
      youtubeId: track.id,
      title: track.title,
      artist: track.artist,
      thumbnailUrl: track.thumbnailUrl,
      duration: track.duration
    }, { headers: getHeaders() });
  },

  removeTrackFromPlaylist: async (playlistId: string, youtubeId: string): Promise<void> => {
    await apiClient.delete(`/library/playlists/${playlistId}/tracks/${youtubeId}`, { headers: getHeaders() });
  }
};
