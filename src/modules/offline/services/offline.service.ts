import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '../../music/services/music.service';
import { apiClient } from '../../../services/apiClient';

const DOWNLOADS_KEY = '@mosaic_downloads';
const DOWNLOAD_DIR = FileSystem.documentDirectory + 'downloads/';

export interface DownloadedTrack extends Track {
  localUri: string;
  downloadedAt: string;
}

export const offlineService = {
  // Initialize the download directory if it doesn't exist
  init: async () => {
    const dirInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
    }
  },

  getDownloadedTracks: async (): Promise<DownloadedTrack[]> => {
    try {
      const data = await AsyncStorage.getItem(DOWNLOADS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load downloaded tracks', e);
      return [];
    }
  },

  saveDownloadedTracks: async (tracks: DownloadedTrack[]) => {
    try {
      await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(tracks));
    } catch (e) {
      console.error('Failed to save downloaded tracks', e);
    }
  },

  isDownloaded: async (trackId: string): Promise<string | null> => {
    const tracks = await offlineService.getDownloadedTracks();
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      const fileInfo = await FileSystem.getInfoAsync(track.localUri);
      if (fileInfo.exists) return track.localUri;
    }
    return null;
  },

  downloadTrack: async (track: Track): Promise<boolean> => {
    try {
      await offlineService.init();

      // Check if already downloaded
      const existingUri = await offlineService.isDownloaded(track.id);
      if (existingUri) return true;

      // Get stream URL from backend with a 30s timeout
      const res = await apiClient.get(`/music/stream/${track.id}`, { timeout: 30000 });
      const streamUrl = res.data.url;

      if (!streamUrl) throw new Error('No stream URL returned');

      // Setup file path
      const fileUri = DOWNLOAD_DIR + `${track.id}.mp3`;

      // Download file
      const downloadRes = await FileSystem.downloadAsync(streamUrl, fileUri);

      if (downloadRes.status !== 200) {
        throw new Error(`Download failed with status ${downloadRes.status}`);
      }

      // Save metadata
      const downloadedTracks = await offlineService.getDownloadedTracks();
      const newTrack: DownloadedTrack = {
        ...track,
        localUri: downloadRes.uri,
        downloadedAt: new Date().toISOString()
      };

      downloadedTracks.push(newTrack);
      await offlineService.saveDownloadedTracks(downloadedTracks);

      return true;
    } catch (e) {
      console.error(`Failed to download track ${track.id}:`, e);
      return false;
    }
  },

  deleteDownload: async (trackId: string): Promise<void> => {
    try {
      const tracks = await offlineService.getDownloadedTracks();
      const track = tracks.find(t => t.id === trackId);
      
      if (track) {
        await FileSystem.deleteAsync(track.localUri, { idempotent: true });
        const updatedTracks = tracks.filter(t => t.id !== trackId);
        await offlineService.saveDownloadedTracks(updatedTracks);
      }
    } catch (e) {
      console.error('Failed to delete download', e);
    }
  },

  clearAllDownloads: async (): Promise<void> => {
    try {
      await FileSystem.deleteAsync(DOWNLOAD_DIR, { idempotent: true });
      await AsyncStorage.removeItem(DOWNLOADS_KEY);
      await offlineService.init();
    } catch (e) {
      console.error('Failed to clear downloads', e);
    }
  }
};
