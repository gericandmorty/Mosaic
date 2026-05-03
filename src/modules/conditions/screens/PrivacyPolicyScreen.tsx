import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { ChevronLeft } from 'lucide-react-native';

export const PrivacyPolicyScreen: React.FC<any> = ({ navigation }) => {
  const colors = useThemeColors();

  const Section = ({ title, content }: { title: string, content: string }) => (
    <View style={styles.section}>
      <PaperText style={[styles.sectionTitle, { color: colors.pencil }]}>{title}</PaperText>
      <PaperText style={[styles.sectionContent, { color: colors.ink }]}>{content}</PaperText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backBtn, { borderColor: colors.pencil, backgroundColor: colors.paper }]} 
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color={colors.ink} />
          </TouchableOpacity>
          <PaperText style={styles.headerTitle}>Privacy Policy</PaperText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
            <PaperText style={[styles.lastUpdated, { color: colors.pencilLight }]}>Last Updated: May 2026</PaperText>
            
            <Section 
              title="1. Information We Collect" 
              content="Mosaic collects your email address and display name during registration to provide a personalized experience. We also collect playback history and liked songs to improve our recommendations."
            />

            <Section 
              title="2. How We Use Information" 
              content="Your data is used solely to provide and improve the Mosaic music streaming service. We do not sell your personal information to third parties."
            />

            <Section 
              title="3. Data Security" 
              content="We implement robust security measures to protect your account. However, no electronic transmission is 100% secure, so we encourage you to use strong passwords."
            />

            <Section 
              title="4. Your Rights" 
              content="You can update your profile information or delete your account at any time through the settings menu."
            />

            <Section 
              title="5. Contact Us" 
              content="If you have questions about this policy, please reach out to us at support@mosaic-app.com"
            />
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'PatrickHand_400Regular',
  },
  scrollContent: {
    paddingTop: 10,
  },
  card: {
    borderRadius: 15,
    borderWidth: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 4,
  },
  lastUpdated: {
    fontSize: 14,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 22,
  }
});
