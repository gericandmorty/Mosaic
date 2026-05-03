import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { ChevronLeft, Globe, Heart, Code } from 'lucide-react-native';

const LOGO_IMG = require('../../../assets/logo/logo.png');

export const AboutScreen: React.FC<any> = ({ navigation }) => {
  const colors = useThemeColors();

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
          <PaperText style={styles.headerTitle}>About Mosaic</PaperText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
            <View style={styles.logoSection}>
              <View style={[styles.logoCircle, { borderColor: colors.pencil }]}>
                <Image source={LOGO_IMG} style={styles.logo} />
              </View>
              <PaperText style={styles.appName}>Mosaic</PaperText>
              <PaperText style={[styles.version, { color: colors.pencilLight }]}>Version 1.0.0 (Sketchbook Edition)</PaperText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.pencil + '20' }]} />

            <PaperText style={[styles.description, { color: colors.ink }]}>
              Mosaic is a hand-drawn music streaming experience designed to feel like your personal sketchbook. 
              We believe music should feel personal, creative, and organic.
            </PaperText>

            <View style={styles.madeWith}>
              <PaperText style={{ color: colors.pencilLight }}>Made with </PaperText>
              <Heart size={16} color={colors.red || '#ff4444'} fill={colors.red || '#ff4444'} />
              <PaperText style={{ color: colors.pencilLight }}> by </PaperText>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:gericmorit.dev@gmail.com')}>
                <PaperText style={{ color: colors.blue, textDecorationLine: 'underline' }}>gericmorit.dev@gmail.com</PaperText>
              </TouchableOpacity>
            </View>

            <View style={styles.links}>
              <TouchableOpacity 
                style={[styles.linkBtn, { backgroundColor: colors.pencil + '10' }]}
                onPress={() => Linking.openURL('https://github.com/gericandmorty/Mosaic')}
              >
                <Code size={20} color={colors.pencil} />
                <PaperText style={[styles.linkText, { color: colors.pencil }]}>GitHub</PaperText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.linkBtn, { backgroundColor: colors.pencil + '10' }]}
                onPress={() => Linking.openURL('https://mosaic-app.com')}
              >
                <Globe size={20} color={colors.pencil} />
                <PaperText style={[styles.linkText, { color: colors.pencil }]}>Website</PaperText>
              </TouchableOpacity>
            </View>
          </View>
          
          <PaperText style={[styles.copyright, { color: colors.pencilLight }]}>
            © 2024 Mosaic Music. All rights reserved.
          </PaperText>
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
    borderRadius: 20,
    borderWidth: 2.5,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 6,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 32,
    fontFamily: 'PatrickHand_400Regular',
  },
  version: {
    fontSize: 14,
  },
  divider: {
    height: 2,
    width: '100%',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'PatrickHand_400Regular',
  },
  madeWith: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  links: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'PatrickHand_400Regular',
  },
  copyright: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
  }
});
