import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../../shared/theme/theme.slice';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useAuthStore } from '../../auth/store/auth.slice';
import { useMusicStore } from '../../music/store/music.slice';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { Sidebar } from '../../../shared/components/navigation/Sidebar';
import { MiniPlayer } from '../../../shared/components/player/MiniPlayer';
import { Bottombar } from '../../../shared/components/navigation/Bottombar';
import { Search, Bell, Play, Plus, Menu as MenuIcon, X } from 'lucide-react-native';
import { musicService, Track } from '../../music/services/music.service';
import { TextInput, ActivityIndicator } from 'react-native';
import { historyService } from '../../history/services/history.service';
import { likedService } from '../../liked/services/liked.service';
import { playlistsService, Playlist } from '../../playlists/services/playlists.service';

const MusicIcon = ({ size, color }: any) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
    <Play size={size / 2} color={color} fill={color} />
  </View>
);

const FilterChip = ({ label, isActive, onPress }: any) => {
  const themeColors = useThemeColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          backgroundColor: isActive ? themeColors.pencil : themeColors.pencil + '15',
          borderColor: themeColors.pencil
        }
      ]}
    >
      <PaperText style={[styles.filterChipText, { color: isActive ? themeColors.paper : themeColors.ink }]}>
        {label}
      </PaperText>
    </TouchableOpacity>
  );
};

const QuickPlayCard = ({ title, imageUrl, onPress }: any) => {
  const themeColors = useThemeColors();
  return (
    <TouchableOpacity
      style={[styles.quickCard, { backgroundColor: themeColors.pencil + '10', borderColor: themeColors.pencil }]}
      onPress={onPress}
    >
      <View style={styles.quickCardImageWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.quickCardImage} />
        ) : (
          <View style={[styles.quickCardImage, { backgroundColor: themeColors.pencil + '20', alignItems: 'center', justifyContent: 'center' }]}>
            <Play size={16} color={themeColors.pencilLight} />
          </View>
        )}
      </View>
      <PaperText numberOfLines={2} style={[styles.quickCardTitle, { color: themeColors.ink }]}>{title}</PaperText>
    </TouchableOpacity>
  );
};

const TrackListItem = ({ track, onPress }: any) => {
  const themeColors = useThemeColors();
  return (
    <TouchableOpacity style={styles.trackItem} onPress={onPress}>
      <Image source={{ uri: track.thumbnailUrl }} style={[styles.trackThumb, { borderColor: themeColors.pencil }]} />
      <View style={styles.trackInfo}>
        <PaperText numberOfLines={1} style={[styles.trackTitle, { color: themeColors.ink }]}>{track.title}</PaperText>
        <PaperText numberOfLines={1} style={[styles.trackArtist, { color: themeColors.pencilLight }]}>{track.artist}</PaperText>
      </View>
      <TouchableOpacity style={styles.moreBtn}>
        <PaperText style={{ color: themeColors.pencilLight, fontSize: 24, lineHeight: 24 }}>···</PaperText>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const AlbumCard = ({ title, subtitle, imageUrl, onPress }: any) => {
  const themeColors = useThemeColors();
  return (
    <TouchableOpacity style={styles.albumCard} onPress={onPress}>
      <View style={[styles.albumArtWrap, { borderColor: themeColors.pencil, backgroundColor: themeColors.paper }]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.albumArt} />
        ) : (
          <MusicIcon size={40} color={themeColors.pencilLight} />
        )}
      </View>
      <PaperText numberOfLines={1} style={[styles.albumTitle, { color: themeColors.ink }]}>{title}</PaperText>
      <PaperText numberOfLines={1} style={[styles.albumSubtitle, { color: themeColors.pencilLight }]}>{subtitle}</PaperText>
    </TouchableOpacity>
  );
};

export const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuthStore();
  const themeColors = useThemeColors();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Data State
  const [historySongs, setHistorySongs] = useState<Track[]>([]);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [fetchedHistory, fetchedLiked, fetchedPlaylists] = await Promise.all([
        historyService.getRecentHistory(4),
        likedService.getLikedSongs(),
        playlistsService.getPlaylists()
      ]);
      setHistorySongs(fetchedHistory);
      setLikedSongs(fetchedLiked);
      setPlaylists(fetchedPlaylists);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoadingData(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      navigation.navigate('Search', { initialQuery: searchQuery });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => setIsSidebarOpen(true)}
              style={[styles.profileBtn, { borderColor: themeColors.pencil }]}
            >
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.profileImg} />
              ) : (
                <View style={[styles.profileImg, { backgroundColor: themeColors.pencil + '20', alignItems: 'center', justifyContent: 'center' }]}>
                  <PaperText style={{ color: themeColors.pencil, fontSize: 18 }}>{user?.displayName?.[0] || 'U'}</PaperText>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.filterContainer}>
              {['All', 'Music', 'Podcasts'].map(filter => (
                <FilterChip
                  key={filter}
                  label={filter}
                  isActive={activeFilter === filter}
                  onPress={() => setActiveFilter(filter)}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity style={[styles.headerIconBtn, { borderColor: themeColors.pencil }]}>
            <Bell size={22} color={themeColors.ink} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={themeColors.pencil}
              colors={[themeColors.pencil]}
            />
          }
        >
          <PaperText style={[styles.greeting, { color: themeColors.ink }]}>Good morning, {user?.displayName?.split(' ')[0] || 'Creator'}</PaperText>

          {/* Quick Play Grid (Liked & Recent) */}
          <View style={styles.quickGrid}>
            <QuickPlayCard
              title="Liked Songs"
              imageUrl={likedSongs[0]?.thumbnailUrl}
              onPress={() => navigation.navigate('Likes')}
            />
            {historySongs.slice(0, 5).map((track) => (
              <QuickPlayCard
                key={track.id}
                title={track.title}
                imageUrl={track.thumbnailUrl}
                onPress={() => {
                  const { playQueue } = useMusicStore.getState();
                  playQueue([track], 0);
                  navigation.navigate('Player', { track });
                }}
              />
            ))}
          </View>

          {/* Recent Rotation Section */}
          <View style={styles.section}>
            <PaperText style={[styles.sectionTitle, { color: themeColors.ink }]}>Your recent rotation</PaperText>
            <View style={styles.listContainer}>
              {isLoadingData ? (
                <ActivityIndicator color={themeColors.pencil} style={{ marginTop: 10 }} />
              ) : historySongs.length > 0 ? (
                historySongs.map((track, index) => (
                  <TrackListItem
                    key={track.id + index}
                    track={track}
                    onPress={() => {
                      const { playQueue } = useMusicStore.getState();
                      playQueue(historySongs, index);
                      navigation.navigate('Player', { track });
                    }}
                  />
                ))
              ) : (
                <PaperText style={[styles.emptyHint, { color: themeColors.pencilLight }]}>No recent tracks yet.</PaperText>
              )}
            </View>
          </View>

          {/* Albums/Playlists Horizontal Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PaperText style={[styles.sectionTitle, { color: themeColors.ink }]}>Albums for you</PaperText>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalGap}>
              {playlists.map((playlist) => (
                <AlbumCard
                  key={playlist.id}
                  title={playlist.name}
                  subtitle="Playlist"
                  imageUrl={playlist.coverUrl}
                  onPress={() => navigation.navigate('PlaylistDetail', { playlist })}
                />
              ))}
              {/* Fake Recommendations */}
              <AlbumCard title="Daily Mix 1" subtitle="Made for You" onPress={() => { }} />
              <AlbumCard title="Discovery Weekly" subtitle="New Music" onPress={() => { }} />
            </ScrollView>
          </View>

          <View style={[styles.quoteBox, { borderColor: themeColors.pencil, backgroundColor: themeColors.pencil + '05' }]}>
            <PaperText style={[styles.quoteText, { color: themeColors.pencil }]}>"Every child is an artist."</PaperText>
            <PaperText style={[styles.quoteAuthor, { color: themeColors.pencilLight }]}>- Pablo Picasso</PaperText>
          </View>

          {/* Ultimate Spacer */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      <Sidebar
        isOpen={isSidebarOpen}
        activeRoute="Dashboard"
        onNavigate={(route) => {
          if (route !== 'Dashboard') navigation.navigate(route);
          setIsSidebarOpen(false);
        }}
        onClose={() => setIsSidebarOpen(false)}
      />

      <MiniPlayer />
      <Bottombar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  miniPlayerAboveTab: {
    bottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'PatrickHand_400Regular',
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 120,
  },
  greeting: {
    fontSize: 28,
    marginBottom: 10,
    fontFamily: 'PatrickHand_400Regular',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
    gap: 10,
  },
  quickCard: {
    width: '48.5%',
    height: 56,
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  quickCardImageWrap: {
    width: 56,
    height: 56,
    borderRightWidth: 1.5,
    borderColor: 'inherit',
  },
  quickCardImage: {
    width: '100%',
    height: '100%',
  },
  quickCardTitle: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 13,
    fontFamily: 'PatrickHand_400Regular',
  },
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'PatrickHand_400Regular',
    marginBottom: 15,
  },
  listContainer: {
    gap: 12,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trackThumb: {
    width: 48,
    height: 48,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontFamily: 'PatrickHand_400Regular',
  },
  trackArtist: {
    fontSize: 13,
  },
  moreBtn: {
    padding: 8,
  },
  horizontalGap: {
    gap: 15,
    paddingRight: 15,
  },
  albumCard: {
    width: 140,
  },
  albumArtWrap: {
    width: 140,
    height: 140,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  albumTitle: {
    fontSize: 15,
    fontFamily: 'PatrickHand_400Regular',
  },
  albumSubtitle: {
    fontSize: 12,
  },
  quoteBox: {
    marginTop: 20,
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 15,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
  },
  emptyHint: {
    fontSize: 16,
    fontFamily: 'PatrickHand_400Regular',
    textAlign: 'center',
    marginTop: 10,
  }
});
