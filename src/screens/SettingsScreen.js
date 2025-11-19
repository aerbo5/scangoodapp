import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const SettingsScreen = ({ onNavigate, fadeAnim }) => {
  const { language, changeLanguage, t } = useLanguage();

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.settingsContainer}>
          <Text style={styles.title}>{t('settings.title')}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <Text style={styles.sectionDescription}>{t('settings.selectLanguage')}</Text>

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
  settingsContainer: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  languageOptions: {
    gap: Spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  languageOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundGreen,
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '600',
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

export default SettingsScreen;



