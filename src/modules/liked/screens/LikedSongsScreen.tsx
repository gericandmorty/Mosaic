import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ChevronLeft, Play, X } from 'lucide-react-native';
import { PaperText } from '../../../shared/components/PaperText';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { likedService } from '../services/liked.service';
import { Track } from '../../music/services/music.service';
import { useMusicStore } from '../../music/store/music.slice';
import { MiniPlayer } from '../../../shared/components/MiniPlayer';

export const LikedSongsScreen: React.FC<any> = ({ navigation }) => {
  const colors = useThemeColors();
  const [songs, setSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const playQueue = useMusicStore(state => state.playQueue);

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
    try {
      setLoading(true);
      const data = await likedService.getLikedSongs();
      setSongs(data);
    } catch (error) {
      console.error('Failed to load liked songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (index: number) => {
    playQueue(songs, index);
    navigation.navigate('Player', { track: songs[index] });
  };

  const handleUnlike = async (track: Track) => {
    try {
      await likedService.toggleLikedSong(track);
      setSongs(songs.filter(s => s.id !== track.id));
    } catch (error) {
      console.error('Failed to unlike song:', error);
    }
  };

  const renderItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity 
      style={[styles.trackCard, { borderColor: colors.pencil }]}
      onPress={() => handlePlaySong(index)}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.trackInfo}>
        <PaperText numberOfLines={1} style={[styles.trackTitle, { color: colors.ink }]}>{item.title}</PaperText>
        <PaperText numberOfLines={1} style={[styles.trackArtist, { color: colors.pencilLight }]}>{item.artist}</PaperText>
      </View>
      <TouchableOpacity onPress={() => handleUnlike(item)} style={styles.unlikeBtn}>
        <X size={20} color={colors.pencil} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.pencil }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.ink} />
        </TouchableOpacity>
        <PaperText style={[styles.headerTitle, { color: colors.ink }]}>Liked Songs</PaperText>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.pencil} />
        </View>
      ) : songs.length === 0 ? (
        <View style={styles.center}>
          <Heart size={48} color={colors.pencilLight} />
          <PaperText style={[styles.emptyText, { color: colors.pencilLight }]}>No liked songs yet.</PaperText>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <MiniPlayer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderStyle: 'dashed',
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 15, fontSize: 16 },
  listContainer: { padding: 20, paddingBottom: 100 },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  thumbnail: { width: 50, height: 50, borderRadius: 4, marginRight: 15 },
  trackInfo: { flex: 1 },
  trackTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  trackArtist: { fontSize: 14 },
  unlikeBtn: { padding: 10 },
});
