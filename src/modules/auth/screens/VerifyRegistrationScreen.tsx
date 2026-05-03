import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/PaperText';
import { ChevronLeft } from 'lucide-react-native';
import { authService } from '../services/auth.service';

export const VerifyRegistrationScreen: React.FC<any> = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [code, setCode] = useState('');
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

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyEmail(code);
      
      Alert.alert(
        'Account Verified', 
        'Welcome to Mosaic! Your account is now active.',
        [{ text: 'Start Sketching', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert('Verification Failed', error.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    try {
      await authService.resendCode(email);
      setResendTimer(60);
      Alert.alert('Code Sent', 'A fresh activation code has been sent to your email.');
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
        <PaperText style={[styles.headerTitle, { color: colors.ink }]}>Verify Account</PaperText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <PaperText style={[styles.infoText, { color: colors.pencilLight }]}>
            We've sent a 6-digit activation code to {email}. Enter it below to unlock your sketchbook.
          </PaperText>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
          <View style={styles.inputGroup}>
            <PaperText style={[styles.label, { color: colors.pencil }]}>Activation Code</PaperText>
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

          <TouchableOpacity 
            style={[styles.verifyBtn, { backgroundColor: colors.pencil }]} 
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.paper} />
            ) : (
              <PaperText style={[styles.verifyBtnText, { color: colors.paper }]}>Activate Account</PaperText>
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
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  verifyBtn: {
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 4,
  },
  verifyBtnText: {
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
