import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Library, Heart, LogOut, Music, ChevronLeft, User } from 'lucide-react-native';
import { PaperText } from './PaperText';
import { useThemeColors } from '../hooks/useThemeColors';
import { useAuthStore } from '../../modules/auth/store/auth.slice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;

interface SidebarProps {
  isOpen: boolean;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeRoute, onNavigate, onClose }) => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const logout = useAuthStore((state) => state.logout);
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH - 40,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isOpen]);

  const SidebarItem = ({ icon: Icon, label, route }: { icon: any, label: string, route: string }) => {
    const isActive = activeRoute === route;
    
    return (
      <TouchableOpacity 
        style={[
          styles.item, 
          isActive && [styles.activeItem, { borderColor: colors.pencil }]
        ]} 
        onPress={() => {
          onNavigate(route);
          onClose();
        }}
      >
        <Icon 
          size={24} 
          color={isActive ? colors.ink : colors.pencilLight} 
          strokeWidth={isActive ? 2.5 : 2}
        />
        <PaperText numberOfLines={1} style={[
          styles.itemText, 
          { color: isActive ? colors.ink : colors.pencilLight },
          isActive && styles.activeItemText
        ]}>
          {label}
        </PaperText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Sidebar Container */}
      <Animated.View style={[
        styles.container, 
        { 
          transform: [{ translateX }],
          backgroundColor: colors.paper,
          borderColor: colors.pencil,
          paddingTop: insets.top + 20, 
          paddingBottom: insets.bottom + 20,
        }
      ]}>
        <View style={styles.headerRow}>
          <View style={styles.logoSection}>
            <View style={[styles.logoCircle, { borderColor: colors.pencil }]}>
              <Music size={28} color={colors.ink} />
            </View>
            <PaperText numberOfLines={1} style={[styles.logoText, { color: colors.ink }]}>Mosaic</PaperText>
          </View>
          <TouchableOpacity style={[styles.closeBtn, { borderColor: colors.pencil }]} onPress={onClose}>
            <ChevronLeft size={24} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <View style={styles.navSection}>
          <SidebarItem icon={Home} label="Home" route="Dashboard" />
          <SidebarItem icon={User} label="Profile" route="Profile" />
          <SidebarItem icon={Library} label="Playlists" route="Playlists" />
          <SidebarItem icon={Heart} label="Liked Songs" route="Likes" />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.pencil }]} />

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={20} color={colors.pencilLight} />
          <PaperText numberOfLines={1} style={[styles.logoutText, { color: colors.pencilLight }]}>Logout</PaperText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    borderRightWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 25,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 24,
  },
  logoText: {
    fontSize: 26,
    fontFamily: 'PatrickHand_400Regular',
  },
  navSection: {
    gap: 12,
    flex: 1,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 15,
    borderRadius: 12,
  },
  activeItem: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 18,
  },
  itemText: {
    fontSize: 20,
  },
  activeItemText: {
    fontFamily: 'PatrickHand_400Regular',
  },
  divider: {
    height: 2,
    opacity: 0.2,
    marginVertical: 20,
    marginHorizontal: 30,
    borderStyle: 'dashed',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 36,
    gap: 12,
  },
  logoutText: {
    fontSize: 18,
  },
});
