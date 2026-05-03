import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/PaperText';
import { ChevronLeft } from 'lucide-react-native';
import { authService } from '../services/auth.service';

export const ForgotPasswordScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const colors = useThemeColors();

  const handleResetRequest = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      
      Alert.alert(
        'Code Sent', 
        'Please check your email for the 6-digit verification code.',
        [{ text: 'Enter Code', onPress: () => navigation.navigate('ResetPassword', { email }) }]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { borderColor: colors.pencil }]}>
          <ChevronLeft size={24} color={colors.ink} />
        </TouchableOpacity>
        <PaperText style={[styles.headerTitle, { color: colors.ink }]}>Forgot Password</PaperText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <PaperText style={[styles.infoText, { color: colors.pencilLight }]}>
            Enter your email address and we'll send you a link to reset your password.
          </PaperText>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
          <View style={styles.inputGroup}>
            <PaperText style={[styles.label, { color: colors.pencil }]}>Email Address</PaperText>
            <TextInput
              style={[styles.input, { color: colors.ink, borderColor: colors.pencil + '40', backgroundColor: colors.background }]}
              placeholder="pencil@example.com"
              placeholderTextColor={colors.pencilLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity 
            style={[styles.resetBtn, { backgroundColor: colors.pencil }]} 
            onPress={handleResetRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.paper} />
            ) : (
              <PaperText style={[styles.resetBtnText, { color: colors.paper }]}>Send Reset Link</PaperText>
            )}
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
    marginBottom: 30,
  },
  infoText: {
    fontSize: 18,
    lineHeight: 24,
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
});
