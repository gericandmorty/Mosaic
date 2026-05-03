import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/store/auth.slice';
import { useThemeStore } from '../../../shared/theme/theme.slice';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { User, Mail, Shield, Moon, Sun, ChevronRight, Camera, ChevronLeft } from 'lucide-react-native';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const colors = useThemeColors();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const ProfileItem = ({ icon: Icon, label, value, onPress }: any) => (
    <TouchableOpacity 
      style={[styles.item, { borderBottomColor: colors.pencil + '20' }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconWrap, { backgroundColor: colors.pencil + '10' }]}>
          <Icon size={20} color={colors.pencil} />
        </View>
        <View>
          <PaperText style={styles.itemLabel}>{label}</PaperText>
          {value && <PaperText style={styles.itemValue}>{value}</PaperText>}
        </View>
      </View>
      {onPress && <ChevronRight size={20} color={colors.pencilLight} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.menuToggle, { borderColor: colors.pencil, backgroundColor: colors.paper }]} 
            onPress={() => navigation.navigate('Dashboard')}
          >
            <ChevronLeft size={24} color={colors.ink} />
          </TouchableOpacity>
          <PaperText style={styles.headerTitle}>Sketchbook Profile</PaperText>
          <View style={{ width: 40 }} /> 
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarWrap, { borderColor: colors.ink }]}>
              <Image 
                source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'user'}` }} 
                style={styles.avatar} 
              />
              <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.blue }]}>
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <PaperText style={styles.userName}>{user?.displayName || 'Creator'}</PaperText>
            <PaperText style={styles.userEmail}>{user?.email}</PaperText>
          </View>


          {/* Details Section */}
          <View style={[styles.section, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
            <View style={styles.sectionHeader}>
              <PaperText style={styles.sectionTitle}>Account Details</PaperText>
            </View>
            <ProfileItem icon={User} label="Display Name" value={user?.displayName} onPress={() => {}} />
            <ProfileItem icon={Mail} label="Email Address" value={user?.email} />
            <ProfileItem icon={Shield} label="Account Status" value="Active Artist" />
          </View>

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.pencil }]}>
            <PaperText style={styles.saveBtnText}>Save Changes</PaperText>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  menuToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'PatrickHand_400Regular',
  },
  scrollContent: {
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    padding: 5,
    position: 'relative',
    backgroundColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 26,
    marginTop: 15,
    fontFamily: 'PatrickHand_400Regular',
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.6,
  },
  section: {
    borderRadius: 15,
    borderWidth: 2,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 4,
  },
  sectionHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
    opacity: 0.8,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeText: {
    fontSize: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  itemValue: {
    fontSize: 18,
  },
  saveBtn: {
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 5,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
  },
});
