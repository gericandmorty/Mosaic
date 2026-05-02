import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/PaperText';
import { colors } from '../../../shared/theme/colors';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.slice';
import { Music } from 'lucide-react-native';

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('geric@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const themeColors = useThemeColors();
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      // The response itself contains the user info (email, displayName, etc.)
      setAuth(response, response.token);
      // No need to navigate, AuthNavigator handles it automatically!
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerSection}>
            <View style={[styles.logoCircle, { borderColor: themeColors.pencil, backgroundColor: themeColors.paper }]}>
              <Music size={40} color={themeColors.ink} />
            </View>
            <PaperText style={[styles.title, { color: themeColors.ink }]}>Welcome Back</PaperText>
            <PaperText style={[styles.subtitle, { color: themeColors.pencilLight }]}>Sign in to your sketchbook</PaperText>
          </View>

          <View style={[styles.formCard, { backgroundColor: themeColors.paper, borderColor: themeColors.pencil }]}>
            <View style={styles.inputGroup}>
              <PaperText style={[styles.label, { color: themeColors.pencil }]}>Email</PaperText>
              <TextInput
                style={[styles.input, { color: themeColors.ink, borderColor: themeColors.pencil + '40', backgroundColor: themeColors.background }]}
                placeholder="email@example.com"
                placeholderTextColor={themeColors.pencilLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <PaperText style={[styles.label, { color: themeColors.pencil }]}>Password</PaperText>
              <TextInput
                style={[styles.input, { color: themeColors.ink, borderColor: themeColors.pencil + '40', backgroundColor: themeColors.background }]}
                placeholder="••••••••"
                placeholderTextColor={themeColors.pencilLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.loginBtn, { backgroundColor: themeColors.pencil }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={themeColors.paper} />
              ) : (
                <PaperText style={[styles.loginBtnText, { color: themeColors.paper }]}>Sign In</PaperText>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <PaperText style={[styles.footerText, { color: themeColors.pencilLight }]}>Don't have an account?</PaperText>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <PaperText style={[styles.footerLink, { color: themeColors.blue }]}>Register Now</PaperText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PatrickHand_400Regular',
  },
  subtitle: {
    fontSize: 16,
  },
  formCard: {
    padding: 25,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'PatrickHand_400Regular',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontFamily: 'PatrickHand_400Regular',
    fontSize: 18,
  },
  loginBtn: {
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 4,
  },
  loginBtnText: {
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    gap: 8,
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
