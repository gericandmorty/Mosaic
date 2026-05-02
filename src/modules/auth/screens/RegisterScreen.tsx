import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/colors';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.slice';
import { PaperText } from '../../../shared/components/PaperText';

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register(email, password, displayName);
      setAuth(data, data.token);
      navigation.replace('Dashboard');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <PaperText style={styles.title}>Join Mosaic</PaperText>
            <PaperText style={styles.subtitle}>Start your creative journey.</PaperText>

            <Input
              label="Full Name"
              placeholder="Noah Smith"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Input
              label="Email"
              placeholder="pencil@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button 
              title="Create Account" 
              onPress={handleRegister} 
              loading={loading}
              style={styles.button}
            />

            <View style={styles.footer}>
              <PaperText style={styles.footerText}>Already have an account? </PaperText>
              <PaperText 
                style={styles.link} 
                onPress={() => navigation.goBack()}
              >
                Sign In
              </PaperText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.paper,
    borderWidth: 3,
    borderColor: colors.pencil,
    padding: 32,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
    transform: [{ rotate: '1.5deg' }],
  },
  subtitle: {
    fontSize: 20,
    color: colors.pencilLight,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.pencilLight,
    fontSize: 18,
  },
  link: {
    color: colors.blue,
    fontSize: 18,
    textDecorationLine: 'underline',
  },
});
