import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const TermsScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();

  const sections = [
    { title: t('terms.acceptance'), content: t('terms.acceptanceContent') },
    { title: t('terms.useOfService'), content: t('terms.useOfServiceContent') },
    { title: t('terms.userAccount'), content: t('terms.userAccountContent') },
    { title: t('terms.intellectualProperty'), content: t('terms.intellectualPropertyContent') },
    { title: t('terms.limitation'), content: t('terms.limitationContent') },
    { title: t('terms.termination'), content: t('terms.terminationContent') },
  ];

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('profile')}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t('profile.terms')}</Text>
          <Text style={styles.lastUpdated}>{t('terms.lastUpdated')}: January 2024</Text>

          <View style={styles.content}>
            {sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionContent}>{section.content}</Text>
              </View>
            ))}
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
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  lastUpdated: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
  },
  content: {
    gap: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default TermsScreen;



