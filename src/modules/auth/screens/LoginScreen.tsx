import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/colors';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.slice';

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    console.log('Attempting login...');
    console.log('API URL:', authService.login.toString()); // Just to check
    
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setAuth(data, data.token);
      navigation.replace('Dashboard');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.response?.data?.message || 'Could not connect to the server.');
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
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to your paper world.</Text>

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
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>New here? </Text>
              <Text 
                style={styles.link} 
                onPress={() => navigation.navigate('Register')}
              >
                Create an account
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
    // Irregular corners for the card too
    borderTopLeftRadius: 10,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 15,
    // Sketchy shadow
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
    transform: [{ rotate: '-2deg' }],
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
