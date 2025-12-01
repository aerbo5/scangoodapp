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
  },
  scrollContent: {
    flex: 1,
  },
  profileContainer: {
    padding: Spacing.lg,
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
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileIconInner: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileHead: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  profileShoulders: {
    width: 46,
    height: 24,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: Colors.primary,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'transparent',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  userName: {
    ...Typography.titleMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.lightGray,
  },
  statNumber: {
    ...Typography.titleMedium,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  menuSection: {
    marginBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 378,
    height: 61,
    padding: 12, // Space/300
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 20, // Radius/200
    marginBottom: Spacing.sm,
    borderWidth: 1, // Stroke/Border
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    fontSize: 24,
    width: 30,
    color: Colors.primary,
    textAlign: 'center',
  },
  menuLabel: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  logoutButton: {
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.error,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoutIcon: {
    fontSize: 24,
    color: Colors.primary,
    width: 30,
    textAlign: 'center',
  },
  logoutText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  languageSection: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  languageSectionTitle: {
    ...Typography.bodyBold,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  languageSectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  languageOptions: {
    gap: Spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  languageOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundGreen,
  },
  languageOptionText: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  languageOptionTextActive: {
    color: Colors.primary,
  },
  checkmark: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default ProfileScreen;

