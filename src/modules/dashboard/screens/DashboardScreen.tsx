import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../shared/theme/colors';
import { useAuthStore } from '../../auth/store/auth.slice';
import { Button } from '../../../shared/components/Button';

export const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Mosaic Dashboard</Text>
          <Text style={styles.welcomeText}>
            Hello, <Text style={styles.highlight}>{user?.displayName || 'Creator'}</Text>!
          </Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>You are now in the sketch world.</Text>
            <Text style={styles.subInfo}>Your Firebase UID: {user?.firebaseUid}</Text>
          </View>

          <Button 
            title="Sign Out" 
            variant="secondary" 
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.paper,
    borderWidth: 3,
    borderColor: colors.pencil,
    padding: 32,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PatrickHand_400Regular',
    color: colors.ink,
    marginBottom: 24,
    textAlign: 'center',
    transform: [{ rotate: '-1deg' }],
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'PatrickHand_400Regular',
    color: colors.pencil,
    marginBottom: 20,
    textAlign: 'center',
  },
  highlight: {
    color: colors.blue,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  infoBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.pencilLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'PatrickHand_400Regular',
    color: colors.pencil,
    textAlign: 'center',
  },
  subInfo: {
    fontSize: 14,
    fontFamily: 'PatrickHand_400Regular',
    color: colors.pencilLight,
    textAlign: 'center',
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 16,
  },
});
