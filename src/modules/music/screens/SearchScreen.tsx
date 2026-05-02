import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/PaperText';
import { musicService, Track } from '../services/music.service';
import { ChevronLeft, Search, Play, Clock, User } from 'lucide-react-native';

export const SearchScreen: React.FC<any> = ({ route, navigation }) => {
  const { initialQuery } = route.params || {};
  const [query, setQuery] = useState(initialQuery || '');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
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

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity 
      style={[styles.trackItem, { borderBottomColor: colors.pencil + '20' }]}
      onPress={() => navigation.navigate('Player', { track: item })}
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
});
