import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Linking } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const AboutScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('profile')}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t('profile.about')}</Text>

          {/* App Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>📦</Text>
            </View>
            <Text style={styles.appName}>Scan Good</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.description}>{t('about.description')}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>{t('about.features')}</Text>
            {[
              t('about.feature1'),
              t('about.feature2'),
              t('about.feature3'),
              t('about.feature4'),
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Links */}
          <View style={styles.linksSection}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://www.scangood.com')}
            >
              <Text style={styles.linkIcon}>🌐</Text>
              <Text style={styles.linkText}>{t('about.website')}</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => Linking.openURL('mailto:support@scangood.com')}
            >
              <Text style={styles.linkIcon}>📧</Text>
              <Text style={styles.linkText}>{t('about.contact')}</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Copyright */}
          <Text style={styles.copyright}>{t('about.copyright')}</Text>
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
  container: {
    padding: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xl,
    letterSpacing: 0.5,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: 60,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
  },
  description: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  featureIcon: {
    fontSize: 20,
    color: Colors.primary,
    marginRight: Spacing.md,
    fontWeight: '700',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  linksSection: {
    marginBottom: Spacing.xl,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
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
  linkIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  linkArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});

export default AboutScreen;



