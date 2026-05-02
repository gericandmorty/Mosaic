import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Download, Trash2, Play, WifiOff } from 'lucide-react-native';
import { PaperText } from '../../../shared/components/PaperText';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { offlineService, DownloadedTrack } from '../services/offline.service';
import { useMusicStore } from '../../music/store/music.slice';
import { MiniPlayer } from '../../../shared/components/MiniPlayer';

export const DownloadsScreen: React.FC<any> = ({ navigation }) => {
  const colors = useThemeColors();
  const [tracks, setTracks] = useState<DownloadedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const playQueue = useMusicStore(state => state.playQueue);

  const loadDownloads = useCallback(async () => {
    setLoading(true);
    const downloaded = await offlineService.getDownloadedTracks();
    setTracks(downloaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDownloads();
  }, []);

  const handlePlaySong = (index: number) => {
    playQueue(tracks, index);
    navigation.navigate('Player', { track: tracks[index] });
  };

  const handleDelete = (track: DownloadedTrack) => {
    Alert.alert(
      'Remove Download',
      `Remove "${track.title}" from offline storage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await offlineService.deleteDownload(track.id);
            setTracks(prev => prev.filter(t => t.id !== track.id));
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Downloads',
      'This will delete all offline tracks from your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await offlineService.clearAllDownloads();
            setTracks([]);
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }: { item: DownloadedTrack; index: number }) => (
    <TouchableOpacity
      style={[styles.trackCard, { borderColor: colors.pencil }]}
      onPress={() => handlePlaySong(index)}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.trackInfo}>
        <PaperText numberOfLines={1} style={[styles.trackTitle, { color: colors.ink }]}>{item.title}</PaperText>
        <PaperText numberOfLines={1} style={[styles.trackArtist, { color: colors.pencilLight }]}>{item.artist}</PaperText>
        <View style={styles.offlineBadge}>
          <WifiOff size={10} color={colors.pencil} />
          <PaperText style={[styles.offlineBadgeText, { color: colors.pencil }]}>Offline</PaperText>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
        <Trash2 size={20} color={colors.pencilLight} />
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
          <PaperText style={[styles.headerTitle, { color: colors.ink }]}>Downloads</PaperText>
          <PaperText style={[styles.headerSubtitle, { color: colors.pencilLight }]}>{tracks.length} songs available offline</PaperText>
        </View>
        {tracks.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={[styles.clearBtn, { borderColor: colors.pencil }]}>
            <Trash2 size={16} color={colors.pencilLight} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.pencil} />
        </View>
      ) : tracks.length === 0 ? (
        <View style={styles.center}>
          <Download size={60} color={colors.pencil + '30'} />
          <PaperText style={[styles.emptyTitle, { color: colors.ink }]}>No Downloads Yet</PaperText>
          <PaperText style={[styles.emptySubtitle, { color: colors.pencilLight }]}>
            Open a playlist and tap "Save Offline" to download music for offline playback.
          </PaperText>
        </View>
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
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
    gap: 12,
  },
  backBtn: { marginRight: 4 },
  headerTitle: { fontSize: 22, fontFamily: 'PatrickHand_400Regular' },
  headerSubtitle: { fontSize: 13 },
  clearBtn: {
    padding: 8,
    borderWidth: 1.5,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: { fontSize: 20, fontFamily: 'PatrickHand_400Regular', marginTop: 10 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  listContent: { padding: 20, paddingBottom: 120 },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  thumbnail: { width: 50, height: 50, borderRadius: 6, marginRight: 12 },
  trackInfo: { flex: 1 },
  trackTitle: { fontSize: 15, fontFamily: 'PatrickHand_400Regular', marginBottom: 2 },
  trackArtist: { fontSize: 13, marginBottom: 4 },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offlineBadgeText: { fontSize: 10 },
  deleteBtn: { padding: 8 },
});
