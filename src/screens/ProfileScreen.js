import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Image, Linking, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const ProfileScreen = ({ onNavigate, fadeAnim }) => {
  const { t, language, changeLanguage } = useLanguage();

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  const handleExternalLink = async (url) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        }
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const profileMenuItems = [
    { key: 'account', icon: '●', label: t('profile.accountInfo'), screen: 'account' },
    { key: 'notifications', icon: '●', label: t('profile.notifications'), screen: 'notifications' },
    { key: 'help', icon: '●', label: t('profile.help'), screen: 'help' },
    { key: 'about', icon: '●', label: t('profile.about'), screen: 'about' },
    { key: 'privacy', icon: '●', label: t('profile.privacy'), screen: 'privacy' },
    { key: 'terms', icon: '●', label: t('profile.terms'), screen: 'terms' },
  ];

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.profileContainer}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <View style={styles.profileIconInner}>
                  {/* Head */}
                  <View style={styles.profileHead} />
                  {/* Shoulders */}
                  <View style={styles.profileShoulders} />
                </View>
              </View>
              <View style={styles.editBadge}>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>{t('profile.scans')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>$156</Text>
              <Text style={styles.statLabel}>{t('profile.saved')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>{t('profile.favorites')}</Text>
            </View>
          </View>

          {/* Language Selection */}
          <View style={styles.languageSection}>
            <Text style={styles.languageSectionTitle}>{t('settings.language')}</Text>
            <Text style={styles.languageSectionDescription}>{t('settings.selectLanguage')}</Text>
            <View style={styles.languageOptions}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'en' && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === 'en' && styles.languageOptionTextActive,
                  ]}
                >
                  🇺🇸 {t('settings.english')}
                </Text>
                {language === 'en' && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'es' && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange('es')}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === 'es' && styles.languageOptionTextActive,
                  ]}
                >
                  🇪🇸 {t('settings.spanish')}
                </Text>
                {language === 'es' && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {profileMenuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.menuItem}
                onPress={() => {
                  // Handle external links for privacy and terms
                  if (item.key === 'privacy') {
                    handleExternalLink('https://scangoodapp.com/privacy-policy');
                  } else if (item.key === 'terms') {
                    handleExternalLink('https://scangoodapp.com/terms-and-conditions');
                  } else {
                    onNavigate(item.screen);
                  }
                }}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <View style={styles.logoutButtonContent}>
              <Text style={styles.logoutIcon}>●</Text>
              <Text style={styles.logoutText}>{t('profile.logout')}</Text>
            </View>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.versionText}>Scan Good v1.0.0</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  profileContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  profileIconInner: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    opacity: 0.8,
  },
  profileHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.text,
    marginBottom: 4,
  },
  profileShoulders: {
    width: 46,
    height: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.text,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editIcon: {
    fontSize: 14,
  },
  userName: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 2,
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
  statNumber: {
    ...Typography.h4,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  menuSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    fontSize: 20,
    color: Colors.primary,
    width: 32,
    textAlign: 'center',
    backgroundColor: Colors.primaryExtraLight,
    height: 32,
    lineHeight: 32,
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuLabel: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.text,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.textLight,
  },
  languageSection: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  languageSectionTitle: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  languageSectionDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  languageOptions: {
    gap: Spacing.sm,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languageOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryExtraLight,
  },
  languageOptionText: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.text,
  },
  languageOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '700',
  },
  logoutButton: {
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoutIcon: {
    fontSize: 18,
    color: Colors.error,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
});

export default ProfileScreen;

