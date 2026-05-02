import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/PaperText';
import { musicService, Track } from '../services/music.service';
import { ChevronDown, Play, Pause, SkipForward, SkipBack, Heart, Share2, Repeat, Shuffle } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PlayerScreen: React.FC<any> = ({ route, navigation }) => {
  const { track } = route.params as { track: Track };
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const colors = useThemeColors();

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async () => {
    setLoading(true);
    try {
      const streamUrl = await musicService.getStreamUrl(track.id);
      
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronDown size={32} color={colors.ink} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <PaperText style={[styles.nowPlaying, { color: colors.pencilLight }]}>NOW SKETCHING</PaperText>
          <PaperText numberOfLines={1} style={[styles.albumName, { color: colors.ink }]}>{track.title}</PaperText>
        </View>
        <TouchableOpacity>
          <Share2 size={24} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Album Art */}
        <View style={[styles.artContainer, { borderColor: colors.pencil, backgroundColor: colors.paper }]}>
          <Image source={{ uri: track.thumbnailUrl }} style={styles.art} />
          {loading && (
            <View style={styles.artLoading}>
              <ActivityIndicator size="large" color={colors.pencil} />
            </View>
          )}
        </View>

        {/* Track Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <PaperText style={[styles.trackTitle, { color: colors.ink }]}>{track.title}</PaperText>
              <PaperText style={[styles.trackArtist, { color: colors.pencilLight }]}>{track.artist}</PaperText>
            </View>
            <TouchableOpacity>
              <Heart size={28} color={colors.pencilLight} />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={[styles.progressBarBg, { backgroundColor: colors.pencil + '20' }]}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: colors.pencil }]} />
              <View style={[styles.progressKnob, { left: `${progress * 100}%`, backgroundColor: colors.pencil, borderColor: colors.paper }]} />
            </View>
            <View style={styles.timeRow}>
              <PaperText style={[styles.timeText, { color: colors.pencilLight }]}>{formatTime(position)}</PaperText>
              <PaperText style={[styles.timeText, { color: colors.pencilLight }]}>{formatTime(duration)}</PaperText>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity>
              <Shuffle size={24} color={colors.pencilLight} />
            </TouchableOpacity>
            
            <View style={styles.mainControls}>
              <TouchableOpacity>
                <SkipBack size={36} color={colors.ink} fill={colors.ink} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.playBtn, { backgroundColor: colors.pencil }]} 
                onPress={handlePlayPause}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.paper} />
                ) : isPlaying ? (
                  <Pause size={32} color={colors.paper} fill={colors.paper} />
                ) : (
                  <Play size={32} color={colors.paper} fill={colors.paper} style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity>
                <SkipForward size={36} color={colors.ink} fill={colors.ink} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Repeat size={24} color={colors.pencilLight} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  headerTitle: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  nowPlaying: {
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 2,
  },
  albumName: {
    fontSize: 16,
    fontFamily: 'PatrickHand_400Regular',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-around',
    paddingBottom: 40,
  },
  artContainer: {
    width: SCREEN_WIDTH - 60,
    aspectRatio: 1,
    borderWidth: 4,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 10,
    borderTopLeftRadius: 35,
    borderBottomRightRadius: 45,
  },
  art: {
    width: '100%',
    height: '100%',
  },
  artLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  trackTitle: {
    fontSize: 28,
    fontFamily: 'PatrickHand_400Regular',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 18,
    opacity: 0.8,
  },
  progressSection: {
    width: '100%',
    marginBottom: 30,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    position: 'absolute',
    top: -5,
    marginLeft: -8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 30,
  },
});
