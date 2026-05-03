import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../../shared/theme/theme.slice';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { useAuthStore } from '../../auth/store/auth.slice';
import { 
  ChevronLeft, 
  Moon, 
  Sun, 
  Volume2, 
  Download, 
  Info, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react-native';

export const SettingsScreen: React.FC<any> = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const colors = useThemeColors();

  const SettingItem = ({ icon: Icon, label, value, onPress, isSwitch }: any) => (
    <TouchableOpacity 
      style={[styles.item, { borderBottomColor: colors.pencil + '20' }]} 
      onPress={onPress}
      disabled={isSwitch || !onPress}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconWrap, { backgroundColor: colors.pencil + '10' }]}>
          <Icon size={20} color={colors.pencil} />
        </View>
        <PaperText style={styles.itemLabel}>{label}</PaperText>
      </View>
      <View style={styles.itemRight}>
        {value && <PaperText style={[styles.itemValue, { color: colors.pencilLight }]}>{value}</PaperText>}
        {isSwitch ? (
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.blue }}
            thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
          />
        ) : (
          onPress && <ChevronRight size={20} color={colors.pencilLight} />
        )}
      </View>
    </TouchableOpacity>
  );

  const Section = ({ title, children }: any) => (
    <View style={[styles.section, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
      <PaperText style={styles.sectionTitle}>{title}</PaperText>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backBtn, { borderColor: colors.pencil, backgroundColor: colors.paper }]} 
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color={colors.ink} />
          </TouchableOpacity>
          <PaperText style={styles.headerTitle}>Settings</PaperText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Section title="Appearance">
            <SettingItem 
              icon={isDarkMode ? Moon : Sun} 
              label="Dark Mode" 
              isSwitch={true} 
            />
          </Section>

          <Section title="Audio">
            <SettingItem icon={Volume2} label="Audio Quality" value="High" onPress={() => {}} />
            <SettingItem icon={Download} label="Download Quality" value="Normal" onPress={() => {}} />
          </Section>

          <Section title="Notifications">
            <SettingItem icon={Bell} label="Push Notifications" onPress={() => {}} />
          </Section>

          <Section title="Privacy & Security">
            <SettingItem icon={ShieldCheck} label="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicy')} />
          </Section>

          <Section title="Support">
            <SettingItem icon={Info} label="About Mosaic" onPress={() => navigation.navigate('About')} />
            <SettingItem icon={Info} label="Terms of Service" onPress={() => navigation.navigate('TermsOfService')} />
          </Section>


          <View style={{ height: 120 }} />
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
    fontSize: 24,
    fontFamily: 'PatrickHand_400Regular',
  },
  scrollContent: {
    paddingTop: 10,
  },
  section: {
    borderRadius: 15,
    borderWidth: 2,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PatrickHand_400Regular',
    marginBottom: 10,
    opacity: 0.6,
  },
  sectionContent: {
    gap: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 18,
    fontFamily: 'PatrickHand_400Regular',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemValue: {
    fontSize: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
  }
});
