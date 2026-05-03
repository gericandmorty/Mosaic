import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';
import { PaperText } from './PaperText';
import { useMusicStore } from '../../modules/music/store/music.slice';
import { Play, Pause } from 'lucide-react-native';

export const MiniPlayer = () => {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { currentTrack, isPlaying, togglePlayPause } = useMusicStore();

  if (!currentTrack) return null;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.paper, borderColor: colors.pencil }]}
      onPress={() => navigation.navigate('Player', { track: currentTrack })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: currentTrack.thumbnailUrl }} style={styles.art} />
      
      <View style={styles.info}>
        <PaperText style={[styles.title, { color: colors.ink }]} numberOfLines={1}>
          {currentTrack.title}
        </PaperText>
        <PaperText style={[styles.artist, { color: colors.pencilLight }]} numberOfLines={1}>
          {currentTrack.artist}
        </PaperText>
      </View>

      <TouchableOpacity 
        style={styles.playBtn} 
        onPress={(e) => {
          e.stopPropagation(); // Prevent opening full player
          togglePlayPause();
        }}
      >
        {isPlaying ? (
          <Pause size={24} color={colors.ink} fill={colors.ink} />
        ) : (
          <Play size={24} color={colors.ink} fill={colors.ink} style={{ marginLeft: 2 }} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 15,
    borderWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5,
    zIndex: 100,
  },
  art: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'PatrickHand_400Regular',
  },
  artist: {
    fontSize: 14,
    opacity: 0.8,
  },
  playBtn: {
    padding: 10,
  },
});
