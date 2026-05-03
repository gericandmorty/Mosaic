import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { ChevronLeft } from 'lucide-react-native';
import { authService } from '../services/auth.service';

export const ResetPasswordScreen: React.FC<any> = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const colors = useThemeColors();

  React.useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);
  const { Eye, EyeOff } = require('lucide-react-native');

  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your email.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Re-using the ResetPassword call with the code as the 'token'
      await authService.resetPassword(code, newPassword);
      
      Alert.alert(
        'Success', 
        'Your password has been reset successfully. You can now log in.',
        [{ text: 'Log In', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert('Reset Failed', error.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      await authService.requestPasswordReset(email);
      setResendTimer(60);
      Alert.alert('Code Sent', 'A fresh reset code has been sent to your email.');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to resend code. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { borderColor: colors.pencil }]}>
          <ChevronLeft size={24} color={colors.ink} />
        </TouchableOpacity>
        <PaperText style={[styles.headerTitle, { color: colors.ink }]}>Set New Password</PaperText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <PaperText style={[styles.infoText, { color: colors.pencilLight }]}>
            Verify the code sent to {email} and enter your new password.
          </PaperText>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
          <View style={styles.inputGroup}>
            <PaperText style={[styles.label, { color: colors.pencil }]}>6-Digit Code</PaperText>
            <TextInput
              style={[styles.input, styles.codeInput, { color: colors.ink, borderColor: colors.pencil + '40', backgroundColor: colors.background }]}
              placeholder="000000"
              placeholderTextColor={colors.pencilLight}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <PaperText style={[styles.label, { color: colors.pencil }]}>New Password</PaperText>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, color: colors.ink, borderColor: colors.pencil + '40', backgroundColor: colors.background }]}
                placeholder="••••••••"
                placeholderTextColor={colors.pencilLight}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.pencilLight} />
                ) : (
                  <Eye size={20} color={colors.pencilLight} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <PaperText style={[styles.label, { color: colors.pencil }]}>Confirm Password</PaperText>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, color: colors.ink, borderColor: colors.pencil + '40', backgroundColor: colors.background }]}
                placeholder="••••••••"
                placeholderTextColor={colors.pencilLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.resetBtn, { backgroundColor: colors.pencil }]} 
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.paper} />
            ) : (
              <PaperText style={[styles.resetBtnText, { color: colors.paper }]}>Reset Password</PaperText>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.resendBtn, resendTimer > 0 && { opacity: 0.5 }]} 
            onPress={handleResend}
            disabled={resendTimer > 0}
          >
            <PaperText style={[styles.resendText, { color: colors.blue }]}>
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Didn't receive a code? Resend"}
            </PaperText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'PatrickHand_400Regular',
  },
  content: {
    padding: 25,
  },
  infoBox: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 22,
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
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  resetBtn: {
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
  resetBtnText: {
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
  },
  resendBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
