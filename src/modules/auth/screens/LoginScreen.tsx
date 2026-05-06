import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.slice';

const LOGO_IMG = require('../../../assets/logo/logo.png');

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('gericmorit3211@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const themeColors = useThemeColors();
  const { setAuth } = useAuthStore();
  const { Eye, EyeOff } = require('lucide-react-native');

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const loginPromise = authService.login({ email, password });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), 10000)
      );

      const response = await Promise.race([loginPromise, timeoutPromise]) as any;
      setAuth(response, response.token);
    } catch (error: any) {
      if (error.message === 'TIMEOUT') {
        Alert.alert('Login Timed Out', 'The server is taking too long to respond. Please try again later.');
      } else {
        console.error('Login error:', error);
        Alert.alert('Login Failed', error.response?.data?.message || 'Invalid email or password.');
      }
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
              <Image source={LOGO_IMG} style={styles.logoImage} />
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
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, color: themeColors.ink, borderColor: themeColors.pencil + '40', backgroundColor: themeColors.background }]}
                  placeholder="••••••••"
                  placeholderTextColor={themeColors.pencilLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={themeColors.pencilLight} />
                  ) : (
                    <Eye size={20} color={themeColors.pencilLight} />
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPasswordLink}
              >
                <PaperText style={[styles.forgotPasswordText, { color: themeColors.blue }]}>Forgot Password?</PaperText>
              </TouchableOpacity>
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
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    textDecorationLine: 'underline',
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
