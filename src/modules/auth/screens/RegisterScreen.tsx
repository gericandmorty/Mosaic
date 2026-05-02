import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.slice';
import { PaperText } from '../../../shared/components/PaperText';
import { Music } from 'lucide-react-native';

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const themeColors = useThemeColors();
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
      const data = await authService.register({ email, password, displayName });
      setAuth(data, data.token);
      // No need to navigate, AuthNavigator handles it automatically!
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Please check your details and try again.');
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
