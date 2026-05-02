import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/PaperText';
import { MiniPlayer } from '../../../shared/components/MiniPlayer';
import { useMusicStore } from '../store/music.slice';
import { musicService, Track } from '../services/music.service';
import { libraryService, Playlist } from '../../library/services/library.service';
import { ChevronLeft, Search, Play, Clock, User, MoreVertical, Plus, ListMusic, Heart } from 'lucide-react-native';

export const SearchScreen: React.FC<any> = ({ route, navigation }) => {
  const { initialQuery } = route.params || {};
  const [query, setQuery] = useState(initialQuery || '');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuTrack, setMenuTrack] = useState<Track | null>(null);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const colors = useThemeColors();

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await musicService.search(searchQuery);
      setTracks(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const { playQueue, addToQueue } = useMusicStore();

  const handleTrackPress = (index: number) => {
    playQueue(tracks, index);
    navigation.navigate('Player', { track: tracks[index] });
  };

  const openTrackMenu = async (track: Track) => {
    setMenuTrack(track);
    setShowPlaylists(false);
    try {
      const data = await libraryService.getPlaylists();
      setPlaylists(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToQueue = () => {
    if (menuTrack) {
      addToQueue(menuTrack);
      Alert.alert('Added to Queue');
      setMenuTrack(null);
    }
  };

  const handleAddToLikes = async () => {
    if (menuTrack) {
      try {
        await libraryService.toggleLikedSong(menuTrack);
        Alert.alert('Saved to Liked Songs');
      } catch (e) {
        console.error(e);
      }
      setMenuTrack(null);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (menuTrack) {
      try {
        await libraryService.addTrackToPlaylist(playlistId, menuTrack);
        Alert.alert('Added to Playlist');
      } catch (e) {
        console.error(e);
      }
      setMenuTrack(null);
    }
  };

  const renderTrackItem = ({ item, index }: { item: Track, index: number }) => (
    <TouchableOpacity 
      style={[styles.trackItem, { borderBottomColor: colors.pencil + '20' }]}
      onPress={() => handleTrackPress(index)}
    >
      <View style={[styles.thumbnailWrap, { borderColor: colors.pencil }]}>
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
        <View style={styles.playOverlay}>
          <Play size={16} color="#fff" fill="#fff" />
        </View>
      </View>
      <View style={styles.trackInfo}>
        <PaperText numberOfLines={1} style={[styles.trackTitle, { color: colors.ink }]}>{item.title}</PaperText>
        <View style={styles.artistRow}>
          <User size={12} color={colors.pencilLight} />
          <PaperText numberOfLines={1} style={[styles.trackArtist, { color: colors.pencilLight }]}>{item.artist}</PaperText>
        </View>
        <View style={styles.durationRow}>
          <Clock size={12} color={colors.pencilLight} />
          <PaperText style={[styles.trackDuration, { color: colors.pencilLight }]}>{item.duration}</PaperText>
        </View>
      </View>
      <TouchableOpacity onPress={() => openTrackMenu(item)} style={{ padding: 10 }}>
        <MoreVertical size={20} color={colors.pencilLight} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { borderColor: colors.pencil }]}>
          <ChevronLeft size={24} color={colors.ink} />
        </TouchableOpacity>
        <View style={[styles.searchBar, { borderColor: colors.pencil, backgroundColor: colors.pencil + '10' }]}>
          <Search size={20} color={colors.pencilLight} />
          <TextInput
            style={[styles.searchInput, { color: colors.ink }]}
            placeholder="Search more tunes..."
            placeholderTextColor={colors.pencilLight}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            autoFocus={!initialQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.pencil} />
          <PaperText style={{ marginTop: 15, color: colors.pencilLight }}>Sketching results...</PaperText>
        </View>
      ) : (
        <FlatList
          data={tracks}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Search size={60} color={colors.pencil + '30'} />
              <PaperText style={[styles.emptyText, { color: colors.pencilLight }]}>
                {query ? "No sketches found for this search." : "Start your musical journey."}
              </PaperText>
            </View>
          }
        />
      )}

      <MiniPlayer />

      <Modal visible={!!menuTrack} transparent animationType="slide" onRequestClose={() => setMenuTrack(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuTrack(null)}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <View style={[styles.modalDragIndicator, { backgroundColor: colors.pencil + '40' }]} />
              <PaperText numberOfLines={1} style={[styles.modalTitle, { color: colors.ink }]}>{menuTrack?.title}</PaperText>
            </View>

            {!showPlaylists ? (
              <>
                <TouchableOpacity style={[styles.modalOption, { borderBottomColor: colors.pencil + '20' }]} onPress={handleAddToQueue}>
                  <Plus size={24} color={colors.pencil} />
                  <PaperText style={[styles.modalOptionText, { color: colors.ink }]}>Add to Queue</PaperText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalOption, { borderBottomColor: colors.pencil + '20' }]} onPress={() => setShowPlaylists(true)}>
                  <ListMusic size={24} color={colors.pencil} />
                  <PaperText style={[styles.modalOptionText, { color: colors.ink }]}>Add to Playlist</PaperText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalOption, { borderBottomColor: colors.pencil + '20' }]} onPress={handleAddToLikes}>
                  <Heart size={24} color={colors.pencil} />
                  <PaperText style={[styles.modalOptionText, { color: colors.ink }]}>Save to Liked Songs</PaperText>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ maxHeight: 300 }}>
                <TouchableOpacity style={styles.modalOption} onPress={() => setShowPlaylists(false)}>
                  <ChevronLeft size={24} color={colors.pencil} />
                  <PaperText style={[styles.modalOptionText, { color: colors.ink }]}>Back to Options</PaperText>
                </TouchableOpacity>
                {playlists.length === 0 ? (
                  <PaperText style={{ textAlign: 'center', marginVertical: 20, color: colors.pencilLight }}>No playlists found.</PaperText>
                ) : (
                  <FlatList
                    data={playlists}
                    keyExtractor={p => p.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={[styles.modalOption, { borderBottomColor: colors.pencil + '20' }]} onPress={() => handleAddToPlaylist(item.id)}>
                        <ListMusic size={20} color={colors.pencilLight} />
                        <PaperText style={[styles.modalOptionText, { color: colors.ink }]}>{item.name}</PaperText>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 15,
    gap: 10,
    borderStyle: 'dashed',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'PatrickHand_400Regular',
    fontSize: 18,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  trackItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 15,
    alignItems: 'center',
  },
  thumbnailWrap: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfo: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontSize: 18,
    fontFamily: 'PatrickHand_400Regular',
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trackArtist: {
    fontSize: 14,
    opacity: 0.8,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  trackDuration: {
    fontSize: 12,
    opacity: 0.6,
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    maxWidth: '80%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    padding: 20,
    paddingBottom: 40,
  },
  modalDragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    gap: 15,
  },
  modalOptionText: {
    fontSize: 18,
  }
});
