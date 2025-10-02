import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { theme, themeMode, toggleTheme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      `${t('auth.logout')}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert(t('common.error'), 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setUploading(true);
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await updateUser({ photo: base64Image });
      setUploading(false);
      Alert.alert(t('common.success'), t('profile.updateSuccess'));
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert(t('common.error'), 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setUploading(true);
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await updateUser({ photo: base64Image });
      setUploading(false);
      Alert.alert(t('common.success'), t('profile.updateSuccess'));
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      t('profile.changePhoto'),
      '',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{t('profile.title')}</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleChangePhoto} disabled={uploading}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.surface }]}>
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatar} />
              ) : (
                <Ionicons name="person" size={60} color={theme.primary} />
              )}
              <View style={[styles.cameraIcon, { backgroundColor: theme.primary }]}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.name, { color: theme.text }]}>{user?.fullName}</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
          <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>
              {user?.userType === 'farmer' ? t('auth.farmer') : t('auth.buyer')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('profile.settings')}</Text>

          <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="language-outline" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>{t('profile.language')}</Text>
            </View>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  { backgroundColor: i18n.language === 'id' ? theme.primary : theme.background },
                ]}
                onPress={() => handleLanguageChange('id')}
              >
                <Text style={[styles.langText, { color: i18n.language === 'id' ? '#FFFFFF' : theme.text }]}>
                  ID
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  { backgroundColor: i18n.language === 'en' ? theme.primary : theme.background },
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[styles.langText, { color: i18n.language === 'en' ? '#FFFFFF' : theme.text }]}>
                  EN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="color-palette-outline" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>{t('profile.theme')}</Text>
            </View>
            <View style={styles.themeButtons}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  { backgroundColor: themeMode === 'light' ? theme.primary : theme.background },
                ]}
                onPress={() => toggleTheme('light')}
              >
                <Ionicons 
                  name="sunny" 
                  size={18} 
                  color={themeMode === 'light' ? '#FFFFFF' : theme.textSecondary} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  { backgroundColor: themeMode === 'dark' ? theme.primary : theme.background },
                ]}
                onPress={() => toggleTheme('dark')}
              >
                <Ionicons 
                  name="moon" 
                  size={18} 
                  color={themeMode === 'dark' ? '#FFFFFF' : theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title={t('auth.logout')}
            onPress={handleLogout}
            variant="outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    width: 50,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    width: 44,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
});