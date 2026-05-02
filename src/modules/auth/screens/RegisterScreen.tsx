import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/colors';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.slice';

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !name) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register(email, name);
      setAuth(data, data.token);
      navigation.replace('Dashboard');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Registration Failed', error.response?.data?.message || 'Could not connect to the server.');
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
            <Text style={styles.title}>Join Mosaic</Text>
            <Text style={styles.subtitle}>Start your creative journey.</Text>

            <Input
              label="Full Name"
              placeholder="Noah Smith"
              value={name}
              onChangeText={setName}
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
              <Text style={styles.footerText}>Already have an account? </Text>
              <Text 
                style={styles.link} 
                onPress={() => navigation.goBack()}
              >
                Sign In
              </Text>
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
    fontFamily: 'PatrickHand_400Regular',
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
    transform: [{ rotate: '1.5deg' }],
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
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
    fontFamily: 'PatrickHand_400Regular',
  },
  link: {
    color: colors.blue,
    fontSize: 18,
    fontFamily: 'PatrickHand_400Regular',
    textDecorationLine: 'underline',
  },
});
