import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Play, X, ListMusic, Shuffle } from 'lucide-react-native';
import { PaperText } from '../../../shared/components/PaperText';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { libraryService, Playlist, PlaylistTrack } from '../../library/services/library.service';
import { useMusicStore } from '../../music/store/music.slice';
import { MiniPlayer } from '../../../shared/components/MiniPlayer';

export const PlaylistDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { playlist } = route.params as { playlist: Playlist };
  const colors = useThemeColors();
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const playQueue = useMusicStore(state => state.playQueue);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getPlaylistTracks(playlist.id);
      setTracks(data);
    } catch (error) {
      console.error('Failed to load playlist tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (index: number) => {
    playQueue(tracks, index);
    navigation.navigate('Player', { track: tracks[index] });
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      handlePlaySong(0);
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length > 0) {
      const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
      playQueue(shuffledTracks, 0);
      navigation.navigate('Player', { track: shuffledTracks[0] });
    }
  };

  const handleRemoveTrack = async (youtubeId: string) => {
    try {
      await libraryService.removeTrackFromPlaylist(playlist.id, youtubeId);
      setTracks(tracks.filter(t => t.youtubeId !== youtubeId));
    } catch (error) {
      console.error('Failed to remove track:', error);
    }
  };

  const renderItem = ({ item, index }: { item: PlaylistTrack; index: number }) => (
    <TouchableOpacity 
      style={[styles.trackCard, { borderColor: colors.pencil }]}
      onPress={() => handlePlaySong(index)}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.trackInfo}>
        <PaperText numberOfLines={1} style={[styles.trackTitle, { color: colors.ink }]}>{item.title}</PaperText>
        <PaperText numberOfLines={1} style={[styles.trackArtist, { color: colors.pencilLight }]}>{item.artist}</PaperText>
      </View>
      <TouchableOpacity onPress={() => handleRemoveTrack(item.youtubeId)} style={styles.removeBtn}>
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
        <View style={{ flex: 1 }}>
          <PaperText numberOfLines={1} style={[styles.headerTitle, { color: colors.ink }]}>{playlist.name}</PaperText>
          <PaperText style={[styles.headerSubtitle, { color: colors.pencilLight }]}>{tracks.length} Tracks</PaperText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleShufflePlay} style={[styles.playBtn, { backgroundColor: colors.pencil, marginRight: 10 }]}>
            <Shuffle size={20} color={colors.paper} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayAll} style={[styles.playBtn, { backgroundColor: colors.pencil }]}>
            <Play size={20} color={colors.paper} fill={colors.paper} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.pencil} />
        </View>
      ) : tracks.length === 0 ? (
        <View style={styles.center}>
          <ListMusic size={48} color={colors.pencilLight} />
          <PaperText style={[styles.emptyText, { color: colors.pencilLight }]}>No tracks in this playlist.</PaperText>
        </View>
      ) : (
        <FlatList
          data={tracks}
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
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14 },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
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
  removeBtn: { padding: 10 },
});
