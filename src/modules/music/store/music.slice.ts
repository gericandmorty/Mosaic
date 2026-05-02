import { create } from 'zustand';
import { Audio } from 'expo-av';
import { Track, musicService } from '../services/music.service';
import { historyService } from '../../history/services/history.service';
import { offlineService } from '../../offline/services/offline.service';

const parseDurationToMillis = (duration: string | undefined) => {
  if (!duration) return 0;
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    return (parts[0] * 60 + parts[1]) * 1000;
  }
  if (parts.length === 3) {
    return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  }
  return 0;
};


interface MusicState {
  sound: Audio.Sound | null;
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  positionMillis: number;
  durationMillis: number;
  isLooping: boolean;

  playQueue: (tracks: Track[], startIndex: number) => Promise<void>;
  addToQueue: (track: Track) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
  toggleLoop: () => Promise<void>;
  stop: () => Promise<void>;
}

export const useMusicStore = create<MusicState>((set, get) => {
  // We keep a reference to the sound object outside of state for event callbacks
  let currentSoundRef: Audio.Sound | null = null;

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      const actualDurationMillis = parseDurationToMillis(get().currentTrack?.duration);
      
      set({
        positionMillis: status.positionMillis,
        durationMillis: actualDurationMillis > 0 ? actualDurationMillis : (status.durationMillis || 0),
        isPlaying: status.isPlaying,
        isLooping: status.isLooping,
      });

      if (status.didJustFinish && !status.isLooping) {
        set({ isPlaying: false, positionMillis: 0 });
        // Auto-play next track when finished
        get().playNext();
      }
    }
  };

  const loadAndPlayTrack = async (track: Track) => {
    const { sound: oldSound } = get();
    
    set({ isLoading: true, currentTrack: track, positionMillis: 0, durationMillis: 0 });

    if (oldSound) {
      await oldSound.unloadAsync();
    }

    try {
      // Check if we have this downloaded offline
      const localUri = await offlineService.isDownloaded(track.id);
      let streamUrl = localUri;
      
      // If not offline, fetch stream from backend
      if (!streamUrl) {
        streamUrl = await musicService.getStreamUrl(track.id);
      }
      
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true, isLooping: get().isLooping },
        onPlaybackStatusUpdate
      );

      currentSoundRef = newSound;
      set({ sound: newSound, isPlaying: true, isLoading: false });
      historyService.addToHistory(track);
    } catch (error) {
      console.error('Failed to play track:', error);
      set({ isLoading: false, isPlaying: false });
    }
  };

  return {
    sound: null,
    currentTrack: null,
    queue: [],
    queueIndex: 0,
    isPlaying: false,
    isLoading: false,
    positionMillis: 0,
    durationMillis: 0,
    isLooping: false,

    playQueue: async (tracks: Track[], startIndex: number = 0) => {
      set({ queue: tracks, queueIndex: startIndex });
      if (tracks[startIndex]) {
        await loadAndPlayTrack(tracks[startIndex]);
      }
    },

    addToQueue: (track: Track) => {
      const { queue, isPlaying, currentTrack } = get();
      set({ queue: [...queue, track] });
      
      // If nothing is currently playing/in queue, start playing it immediately
      if (queue.length === 0 && !isPlaying && !currentTrack) {
        get().playQueue([track], 0);
      }
    },

    playNext: async () => {
      const { queue, queueIndex } = get();
      if (queue.length === 0) return;

      const nextIndex = queueIndex + 1 < queue.length ? queueIndex + 1 : 0; // Loop back to start if at end
      set({ queueIndex: nextIndex });
      await loadAndPlayTrack(queue[nextIndex]);
    },

    playPrevious: async () => {
      const { queue, queueIndex, positionMillis } = get();
      if (queue.length === 0) return;

      // If we are more than 3 seconds into the song, restart it instead of going to previous
      if (positionMillis > 3000) {
        const { sound } = get();
        if (sound) await sound.setPositionAsync(0);
        return;
      }

      const prevIndex = queueIndex - 1 >= 0 ? queueIndex - 1 : queue.length - 1;
      set({ queueIndex: prevIndex });
      await loadAndPlayTrack(queue[prevIndex]);
    },

    togglePlayPause: async () => {
      const { sound, isPlaying } = get();
      if (!sound) return;

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    },

    seekTo: async (millis: number) => {
      const { sound } = get();
      if (!sound) return;
      await sound.setPositionAsync(millis);
    },

    toggleLoop: async () => {
      const { sound, isLooping } = get();
      const newLoopingState = !isLooping;
      
      set({ isLooping: newLoopingState });
      if (sound) {
        await sound.setIsLoopingAsync(newLoopingState);
      }
    },

    stop: async () => {
      const { sound } = get();
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      set({ sound: null, currentTrack: null, isPlaying: false, positionMillis: 0, durationMillis: 0 });
    }
  };
});
