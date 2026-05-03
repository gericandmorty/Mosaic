import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { musicService, Track } from '../services/music.service';
import { ChevronDown, Play, Pause, SkipForward, SkipBack, Heart, Share2, Repeat, Shuffle } from 'lucide-react-native';

import { useMusicStore } from '../store/music.slice';
import { likedService } from '../../liked/services/liked.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PlayerScreen: React.FC<any> = ({ route, navigation }) => {
  const { track } = route.params as { track: Track };
  const colors = useThemeColors();

  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    positionMillis, 
    durationMillis, 
    isLooping,
    playNext, 
    playPrevious, 
    togglePlayPause, 
    seekTo, 
    toggleLoop 
  } = useMusicStore();

  const [isLiked, setIsLiked] = useState(false);

  // Use currentTrack if it exists (in case global state updated), otherwise fallback to the track passed in params for initial render
  const displayTrack = currentTrack || track;

  useEffect(() => {
    const checkLiked = async () => {
      if (displayTrack?.id) {
        try {
          const liked = await likedService.checkIsLiked(displayTrack.id);
          setIsLiked(liked);
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkLiked();
  }, [displayTrack?.id]);

  const handleToggleLike = async () => {
    if (!displayTrack) return;
    try {
      await likedService.toggleLikedSong(displayTrack);
      setIsLiked(!isLiked);
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronDown size={32} color={colors.ink} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <PaperText style={[styles.nowPlaying, { color: colors.pencilLight }]}>NOW SKETCHING</PaperText>
          <PaperText numberOfLines={1} style={[styles.albumName, { color: colors.ink }]}>{displayTrack.title}</PaperText>
        </View>
        <TouchableOpacity>
          <Share2 size={24} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Album Art */}
        <View style={[styles.artContainer, { borderColor: colors.pencil, backgroundColor: colors.paper }]}>
          <Image source={{ uri: displayTrack.thumbnailUrl }} style={styles.art} />
          {isLoading && (
            <View style={styles.artLoading}>
              <ActivityIndicator size="large" color={colors.pencil} />
            </View>
          )}
        </View>

        {/* Track Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <PaperText style={[styles.trackTitle, { color: colors.ink }]} numberOfLines={1}>{displayTrack.title}</PaperText>
              <PaperText style={[styles.trackArtist, { color: colors.pencilLight }]} numberOfLines={1}>{displayTrack.artist}</PaperText>
            </View>
            <TouchableOpacity onPress={handleToggleLike}>
              <Heart size={28} color={isLiked ? colors.pencil : colors.pencilLight} fill={isLiked ? colors.pencil : 'transparent'} />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={durationMillis > 0 ? durationMillis : 1}
              value={positionMillis}
              minimumTrackTintColor={colors.pencil}
              maximumTrackTintColor={colors.pencil + '40'}
              thumbTintColor={colors.pencil}
              onSlidingComplete={async (value) => {
                await seekTo(value);
              }}
            />
            <View style={styles.timeRow}>
              <PaperText style={[styles.timeText, { color: colors.pencilLight }]}>{formatTime(positionMillis)}</PaperText>
              <PaperText style={[styles.timeText, { color: colors.pencilLight }]}>{formatTime(durationMillis)}</PaperText>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity>
              <Shuffle size={24} color={colors.pencilLight} />
            </TouchableOpacity>
            
            <View style={styles.mainControls}>
              <TouchableOpacity onPress={playPrevious}>
                <SkipBack size={36} color={colors.ink} fill={colors.ink} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.playBtn, { backgroundColor: colors.pencil }]} 
                onPress={togglePlayPause}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.paper} />
                ) : isPlaying ? (
                  <Pause size={32} color={colors.paper} fill={colors.paper} />
                ) : (
                  <Play size={32} color={colors.paper} fill={colors.paper} style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity onPress={playNext}>
                <SkipForward size={36} color={colors.ink} fill={colors.ink} />
              </TouchableOpacity>
            </View>


            <TouchableOpacity onPress={toggleLoop}>
              <Repeat size={24} color={isLooping ? colors.ink : colors.pencilLight} />
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
