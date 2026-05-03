import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.slice';
import { PaperText } from '../../../shared/components/ui/PaperText';

const LOGO_IMG = require('../../../assets/logo/logo.png');

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const themeColors = useThemeColors();
  const { setAuth } = useAuthStore();
  const { Eye, EyeOff } = require('lucide-react-native');

  const handleRegister = async () => {
    if (loading) return; // Prevent multiple clicks
    
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const registerPromise = authService.register({ email, password, displayName });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 15000)
      );

      const data = await Promise.race([registerPromise, timeoutPromise]) as any;
      
      Alert.alert(
        'Account Created', 
        'Please check your email for a 6-digit verification code to activate your sketchbook.',
        [{ text: 'Verify Now', onPress: () => navigation.navigate('VerifyRegistration', { email }) }]
      );
    } catch (error: any) {
      if (error.message === 'TIMEOUT') {
        Alert.alert('Registration Timed Out', 'The server is taking too long to respond. Please try again later.');
      } else {
        console.error('Registration error:', error);
        Alert.alert('Registration Failed', error.response?.data?.message || 'Please check your details and try again.');
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
            <PaperText style={[styles.title, { color: themeColors.ink }]}>New Sketchbook</PaperText>
            <PaperText style={[styles.subtitle, { color: themeColors.pencilLight }]}>Create an account to start drawing</PaperText>
          </View>

          <View style={[styles.formCard, { backgroundColor: themeColors.paper, borderColor: themeColors.pencil }]}>
            <View style={styles.inputGroup}>
              <PaperText style={[styles.label, { color: themeColors.pencil }]}>Full Name</PaperText>
              <TextInput
                style={[styles.input, { color: themeColors.ink, borderColor: themeColors.pencil + '40', backgroundColor: themeColors.background }]}
                placeholder="Leonardo da Vinci"
                placeholderTextColor={themeColors.pencilLight}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.inputGroup}>
              <PaperText style={[styles.label, { color: themeColors.pencil }]}>Email</PaperText>
              <TextInput
                style={[styles.input, { color: themeColors.ink, borderColor: themeColors.pencil + '40', backgroundColor: themeColors.background }]}
                placeholder="pencil@example.com"
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
            </View>

            <View style={styles.inputGroup}>
              <PaperText style={[styles.label, { color: themeColors.pencil }]}>Retype Password</PaperText>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, color: themeColors.ink, borderColor: themeColors.pencil + '40', backgroundColor: themeColors.background }]}
                  placeholder="••••••••"
                  placeholderTextColor={themeColors.pencilLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.registerBtn, { backgroundColor: themeColors.pencil }]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={themeColors.paper} />
              ) : (
                <PaperText style={[styles.registerBtnText, { color: themeColors.paper }]}>Create Account</PaperText>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <PaperText style={[styles.footerText, { color: themeColors.pencilLight }]}>Already have an account?</PaperText>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <PaperText style={[styles.footerLink, { color: themeColors.blue }]}>Sign In</PaperText>
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
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontFamily: 'PatrickHand_400Regular',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
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
    marginBottom: 15,
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
    zIndex: 1,
  },
  registerBtn: {
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
  registerBtnText: {
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
