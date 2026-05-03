import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../auth/store/auth.slice';
import { useThemeStore } from '../../../shared/theme/theme.slice';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { PaperText } from '../../../shared/components/ui/PaperText';
import { profileService } from '../services/profile.service';
import { User, Mail, Shield, ChevronRight, Camera, ChevronLeft, Lock, Pencil, X, Check } from 'lucide-react-native';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user, updateUser } = useAuthStore();
  const colors = useThemeColors();
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your photos to update your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        uploadProfilePicture(result.assets[0].uri);
      }
    } catch (e: any) {
      Alert.alert('Error', 'Failed to open image picker: ' + e.message);
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    try {
      setIsUploading(true);
      console.log('--- Upload Started ---');
      console.log('URI:', uri);
      
      const response = await profileService.updateProfilePicture(uri);
      
      console.log('Upload Success Response:', response);
      updateUser({ photoUrl: response.photoUrl });
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Upload Failed Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMsg = error.response?.data?.message || error.message || 'Check your internet connection';
      Alert.alert('Upload Failed', errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    try {
      setIsUpdating(true);
      await profileService.updateDisplayName(displayName);
      updateUser({ displayName });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const ProfileItem = ({ icon: Icon, label, value, onPress, isInput, onChangeText, editable }: any) => (
    <View style={[styles.item, { borderBottomColor: colors.pencil + '20' }]}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconWrap, { backgroundColor: colors.pencil + '10' }]}>
          <Icon size={20} color={colors.pencil} />
        </View>
        <View style={{ flex: 1 }}>
          <PaperText style={styles.itemLabel}>{label}</PaperText>
          {isInput && editable ? (
            <TextInput
              style={[styles.input, { color: colors.ink }]}
              value={value}
              onChangeText={onChangeText}
              placeholder="Enter name"
              autoFocus
              placeholderTextColor={colors.pencilLight}
            />
          ) : (
            value && <PaperText style={styles.itemValue}>{value}</PaperText>
          )}
        </View>
      </View>
      {onPress && !editable && (
        <TouchableOpacity onPress={onPress}>
          <ChevronRight size={20} color={colors.pencilLight} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.menuToggle, { borderColor: colors.pencil, backgroundColor: colors.paper }]} 
            onPress={() => navigation.navigate('Dashboard')}
          >
            <ChevronLeft size={24} color={colors.ink} />
          </TouchableOpacity>
          <PaperText style={styles.headerTitle}>Sketchbook Profile</PaperText>
          <TouchableOpacity 
            style={[styles.menuToggle, { borderColor: colors.pencil, backgroundColor: colors.paper }]} 
            onPress={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X size={20} color={colors.ink} /> : <Pencil size={20} color={colors.ink} />}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarWrap, { borderColor: colors.ink }]}>
              {isUploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator color={colors.blue} />
                </View>
              ) : (
                <Image 
                  source={{ uri: user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'user'}` }} 
                  style={styles.avatar} 
                />
              )}
              {isEditing && (
                <TouchableOpacity 
                  style={[styles.cameraBtn, { backgroundColor: colors.blue }]}
                  onPress={handlePickImage}
                  disabled={isUploading}
                >
                  <Camera size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            <PaperText style={styles.userName}>{user?.displayName || 'Creator'}</PaperText>
            <PaperText style={styles.userEmail}>{user?.email}</PaperText>
          </View>

          {/* Details Section */}
          <View style={[styles.section, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
            <View style={styles.sectionHeader}>
              <PaperText style={styles.sectionTitle}>Account Details</PaperText>
            </View>
            <ProfileItem 
              icon={User} 
              label="Display Name" 
              value={isEditing ? displayName : user?.displayName} 
              isInput={true}
              editable={isEditing}
              onChangeText={setDisplayName}
            />
            <ProfileItem icon={Mail} label="Email Address" value={user?.email} />
            <ProfileItem icon={Shield} label="Account Status" value="Active Artist" />
          </View>

          <View style={[styles.section, { backgroundColor: colors.paper, borderColor: colors.pencil }]}>
             <View style={styles.sectionHeader}>
              <PaperText style={styles.sectionTitle}>Security</PaperText>
            </View>
            <ProfileItem 
              icon={Lock} 
              label="Password" 
              value="********" 
              editable={isEditing}
              onPress={() => {
                Alert.prompt(
                  "Change Password",
                  "Enter your new password (min 6 characters)",
                  [
                    { text: "Cancel", style: "cancel" },
                    { 
                      text: "Update", 
                      onPress: async (password: string | undefined) => {
                        if (password && password.length >= 6) {
                          try {
                            await profileService.updatePassword(password);
                            Alert.alert("Success", "Password updated successfully!");
                          } catch (e: any) {
                            Alert.alert("Error", e.response?.data?.message || "Failed to update password");
                          }
                        } else {
                          Alert.alert("Error", "Password too short");
                        }
                      }
                    }
                  ],
                  "secure-text"
                );
              }} 
            />
          </View>

          {isEditing && (
            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: isUpdating ? colors.pencilLight : colors.blue }]}
              onPress={handleSaveChanges}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnContent}>
                  <Check size={20} color="#fff" />
                  <PaperText style={styles.saveBtnText}>Save Changes</PaperText>
                </View>
              )}
            </TouchableOpacity>
          )}

          <View style={{ height: 100 }} />
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
  menuToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'PatrickHand_400Regular',
  },
  scrollContent: {
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    padding: 5,
    position: 'relative',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  uploadingContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 26,
    marginTop: 15,
    fontFamily: 'PatrickHand_400Regular',
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.6,
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
  sectionHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
    opacity: 0.8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  itemValue: {
    fontSize: 18,
  },
  input: {
    fontSize: 18,
    fontFamily: 'PatrickHand_400Regular',
    padding: 0,
    marginTop: 2,
  },
  saveBtn: {
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 5,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PatrickHand_400Regular',
  },
});
