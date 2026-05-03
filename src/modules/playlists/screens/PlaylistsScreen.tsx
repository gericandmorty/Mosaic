import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListMusic, ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { playlistsService, Playlist } from '../services/playlists.service';
import { MiniPlayer } from '../../../shared/components/player/MiniPlayer';

export const PlaylistsScreen: React.FC<any> = ({ navigation }) => {
  const colors = useThemeColors();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistsService.getPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = () => {
    Alert.prompt(
      'New Playlist',
      'Enter a name for your playlist',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async (name?: string) => {
            if (name) {
              try {
                const newPlaylist = await playlistsService.createPlaylist(name);
                setPlaylists([newPlaylist, ...playlists]);
              } catch (error) {
                console.error('Failed to create playlist:', error);
              }
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const handleDeletePlaylist = (id: string) => {
    Alert.alert('Delete Playlist', 'Are you sure you want to delete this playlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await playlistsService.deletePlaylist(id);
            setPlaylists(playlists.filter(p => p.id !== id));
          } catch (error) {
            console.error('Failed to delete playlist:', error);
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={[styles.card, { borderColor: colors.pencil }]}
      onPress={() => navigation.navigate('PlaylistDetail', { playlist: item })}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.pencil + '20' }]}>
        <ListMusic size={24} color={colors.pencil} />
      </View>
      <View style={styles.info}>
        <PaperText numberOfLines={1} style={[styles.title, { color: colors.ink }]}>{item.name}</PaperText>
        <PaperText style={[styles.subtitle, { color: colors.pencilLight }]}>Custom Playlist</PaperText>
      </View>
      <TouchableOpacity onPress={() => handleDeletePlaylist(item.id)} style={styles.deleteBtn}>
        <Trash2 size={20} color={colors.pencil} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.pencil }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.ink} />
        </TouchableOpacity>
        <PaperText style={[styles.headerTitle, { color: colors.ink }]}>Playlists</PaperText>
        <TouchableOpacity onPress={handleCreatePlaylist} style={styles.addBtn}>
          <Plus size={28} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <ListMusic size={48} color={colors.pencilLight} />
              <PaperText style={[styles.emptyText, { color: colors.pencilLight }]}>No playlists yet.</PaperText>
              <TouchableOpacity style={[styles.createBtn, { borderColor: colors.pencil }]} onPress={handleCreatePlaylist}>
                <PaperText style={{ color: colors.ink }}>Create One</PaperText>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

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
  headerTitle: { flex: 1, fontSize: 24, fontWeight: 'bold' },
  addBtn: { padding: 5 },
  center: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, fontSize: 16, marginBottom: 20 },
  createBtn: {
    borderWidth: 2,
    borderStyle: 'dashed',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  listContainer: { padding: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  deleteBtn: { padding: 10 },
});
