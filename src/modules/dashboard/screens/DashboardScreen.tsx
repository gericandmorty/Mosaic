import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../../shared/theme/theme.slice';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useAuthStore } from '../../auth/store/auth.slice';
import { PaperText } from '../../../shared/components/PaperText';
import { Sidebar } from '../../../shared/components/Sidebar';
import { Search, Bell, Play, Plus, Menu as MenuIcon, X } from 'lucide-react-native';
import { musicService, Track } from '../../music/services/music.service';
import { TextInput, ActivityIndicator } from 'react-native';

const MusicIcon = ({ size, color }: any) => (
  <View style={{ width: size, height: size, borderRadius: size/2, borderWidth: 1.5, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
    <Play size={size/2} color={color} fill={color} />
  </View>
);

const DashboardCard = ({ title, subtitle, color, rotation, onPress }: any) => {
  const themeColors = useThemeColors();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return (
    <TouchableOpacity 
      style={[
        styles.dashCard, 
        { 
          backgroundColor: color || themeColors.paper, 
          borderColor: themeColors.pencil,
          transform: [{ rotate: rotation || '0deg' }] 
        }
      ]}
      onPress={onPress}
    >
      <View style={[styles.dashCardImagePlaceholder, { borderColor: themeColors.pencil + '40' }]}>
        <MusicIcon size={32} color={themeColors.pencilLight} />
      </View>
      <View style={styles.cardTextContent}>
        <PaperText numberOfLines={1} style={[styles.dashCardTitle, { color: themeColors.ink }]}>{title}</PaperText>
        <PaperText numberOfLines={1} style={[styles.dashCardSubtitle, { color: themeColors.pencilLight }]}>{subtitle}</PaperText>
      </View>
    </TouchableOpacity>
  );
};

export const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuthStore();
  const themeColors = useThemeColors();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      navigation.navigate('Search', { initialQuery: searchQuery });
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={[styles.menuToggle, { borderColor: themeColors.pencil, backgroundColor: themeColors.paper }]} 
              onPress={() => setIsSidebarOpen(true)}
            >
              <MenuIcon size={24} color={themeColors.ink} />
            </TouchableOpacity>
            <View style={[styles.searchBar, { borderColor: themeColors.pencil, backgroundColor: themeColors.pencil + '10' }]}>
              <Search size={18} color={themeColors.pencilLight} />
              <TextInput
                style={[styles.searchInput, { color: themeColors.ink }]}
                placeholder="Search music..."
                placeholderTextColor={themeColors.pencilLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <X size={18} color={themeColors.pencilLight} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={[styles.iconBtn, { borderColor: themeColors.pencil }]}>
              <Bell size={20} color={themeColors.ink} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <PaperText style={[styles.greeting, { color: themeColors.ink }]}>Good morning, {user?.displayName?.split(' ')[0] || 'Creator'}</PaperText>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PaperText style={[styles.sectionTitle, { color: themeColors.pencil }]}>Recently Sketched</PaperText>
              <TouchableOpacity><PaperText style={[styles.seeAll, { color: themeColors.blue }]}>See All</PaperText></TouchableOpacity>
            </View>
            
            <View style={styles.grid}>
              {isSearching ? (
                <ActivityIndicator color={themeColors.pencil} size="large" style={{ marginTop: 20 }} />
              ) : searchResults.length > 0 ? (
                searchResults.slice(0, 4).map((track, index) => (
                  <DashboardCard 
                    key={track.id}
                    title={track.title} 
                    subtitle={track.artist} 
                    color={isDarkMode ? (index % 2 === 0 ? '#2A2A2A' : '#242A2E') : (index % 2 === 0 ? '#FFF5E1' : '#E1F5FF')} 
                    rotation={index % 2 === 0 ? "-1.5deg" : "1.5deg"}
                    onPress={() => navigation.navigate('Player', { track })}
                  />
                ))
              ) : (
                <>
                  <DashboardCard title="Midnight" subtitle="Lo-fi beats" color={isDarkMode ? '#2A2A2A' : '#FFF5E1'} rotation="-2deg" />
                  <DashboardCard title="Storm" subtitle="Fast strokes" color={isDarkMode ? '#242A2E' : '#E1F5FF'} rotation="1.5deg" />
                  <DashboardCard title="Eraser" subtitle="Textures" color={isDarkMode ? '#2A242E' : '#F5E1FF'} rotation="-1deg" />
                  <DashboardCard title="Ink Spills" subtitle="Bold & Dark" color={isDarkMode ? '#242E24' : '#E1FFE1'} rotation="2.5deg" />
                </>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PaperText style={[styles.sectionTitle, { color: themeColors.pencil }]}>Playlists</PaperText>
              <TouchableOpacity style={[styles.createBtn, { borderColor: themeColors.pencil }]}>
                <Plus size={14} color={themeColors.pencil} />
                <PaperText style={[styles.createBtnText, { color: themeColors.pencil }]}>New</PaperText>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {['Sketchbook 1', 'Doodle Vibes', 'Deep Focus', 'Creative Flow'].map((name, i) => (
                <TouchableOpacity key={i} style={styles.playlistCard}>
                  <View style={[styles.playlistArt, { borderColor: themeColors.pencil, backgroundColor: themeColors.paper }]}>
                    <PaperText style={[styles.playlistArtText, { color: themeColors.pencilLight }]}>{name[0]}</PaperText>
                  </View>
                  <PaperText style={[styles.playlistName, { color: themeColors.ink }]}>{name}</PaperText>
                </TouchableOpacity>
              ))}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  searchText: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'PatrickHand_400Regular',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontFamily: 'PatrickHand_400Regular',
    fontSize: 18,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  greeting: {
    fontSize: 28,
    marginBottom: 20,
    fontFamily: 'PatrickHand_400Regular',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'PatrickHand_400Regular',
  },
  seeAll: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    paddingBottom: 10,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  dashCard: {
    width: '46%',
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 3,
  },
  dashCardImagePlaceholder: {
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  cardTextContent: {
    width: '100%',
  },
  dashCardTitle: {
    fontSize: 16,
    marginBottom: 2,
    fontFamily: 'PatrickHand_400Regular',
  },
  dashCardSubtitle: {
    fontSize: 12,
  },
  horizontalScroll: {
  },
  horizontalScrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 5,
  },
  playlistCard: {
    width: 100,
    marginRight: 15,
    alignItems: 'center',
  },
  playlistArt: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '1deg' }],
  },
  playlistArtText: {
    fontSize: 36,
    opacity: 0.5,
  },
  playlistName: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    minHeight: 24,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  createBtnText: {
    fontSize: 14,
  },
  quoteBox: {
    marginTop: 10,
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
});
