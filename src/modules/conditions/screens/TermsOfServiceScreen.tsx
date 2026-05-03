import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { ChevronLeft } from 'lucide-react-native';

export const TermsOfServiceScreen: React.FC<any> = ({ navigation }) => {
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
          <PaperText style={styles.headerTitle}>Terms of Service</PaperText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
            <PaperText style={[styles.lastUpdated, { color: colors.pencilLight }]}>Last Updated: May 2026</PaperText>
            
            <Section 
              title="1. Acceptance of Terms" 
              content="By using Mosaic, you agree to follow these terms. If you do not agree, please do not use the app."
            />

            <Section 
              title="2. User Accounts" 
              content="You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration."
            />

            <Section 
              title="3. Content Usage" 
              content="Mosaic is a music streaming platform. You may not distribute, modify, or sell any content accessed through our service without proper authorization."
            />

            <Section 
              title="4. Prohibited Conduct" 
              content="Users are prohibited from attempting to breach our security, reverse engineering the app, or using automated scripts to scrape data."
            />

            <Section 
              title="5. Changes to Terms" 
              content="Mosaic reserves the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms."
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
