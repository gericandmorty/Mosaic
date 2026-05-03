import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Home, Search, Library, CircleUser, Plus } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { PaperText } from '../ui/PaperText';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const Bottombar = () => {
  const themeColors = useThemeColors();
  const navigation = useNavigation<any>();
  const route = useRoute();

  const navItems = [
    { name: 'Home', icon: Home, route: 'Dashboard' },
    { name: 'Search', icon: Search, route: 'Search' },
    { name: 'Your Library', icon: Library, route: 'Playlists' },
    { name: 'Premium', icon: CircleUser, route: 'Profile' },
  ];

  const activeRoute = route.name;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background, borderTopColor: themeColors.pencil + '20' }]}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeRoute === item.route;

        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <Icon
              size={24}
              color={isActive ? themeColors.ink : themeColors.pencilLight}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <PaperText style={[
              styles.navText,
              { color: isActive ? themeColors.ink : themeColors.pencilLight }
            ]}>
              {item.name}
            </PaperText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    width: width,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    paddingBottom: 15,
    paddingTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'PatrickHand_400Regular',
  },
});
