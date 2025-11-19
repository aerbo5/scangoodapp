import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const HelpScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState({});

  const faqItems = [
    {
      key: 'howToScan',
      question: t('help.howToScan'),
      answer: t('help.howToScanAnswer'),
    },
    {
      key: 'priceComparison',
      question: t('help.priceComparison'),
      answer: t('help.priceComparisonAnswer'),
    },
    {
      key: 'saveProducts',
      question: t('help.saveProducts'),
      answer: t('help.saveProductsAnswer'),
    },
    {
      key: 'cameraIssues',
      question: t('help.cameraIssues'),
      answer: t('help.cameraIssuesAnswer'),
    },
    {
      key: 'account',
      question: t('help.account'),
      answer: t('help.accountAnswer'),
    },
  ];

  const toggleItem = (key) => {
    setExpandedItems({ ...expandedItems, [key]: !expandedItems[key] });
  };

  const contactOptions = [
    { icon: '📧', label: t('help.email'), action: () => {} },
    { icon: '💬', label: t('help.chat'), action: () => {} },
    { icon: '📞', label: t('help.phone'), action: () => {} },
  ];

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('profile')}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t('profile.help')}</Text>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>{t('help.contactUs')}</Text>
            <View style={styles.contactOptions}>
              {contactOptions.map((option, index) => (
                <TouchableOpacity key={index} style={styles.contactOption} onPress={option.action}>
                  <Text style={styles.contactIcon}>{option.icon}</Text>
                  <Text style={styles.contactLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>{t('help.faq')}</Text>
            {faqItems.map((item) => (
              <View key={item.key} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleItem(item.key)}
                >
                  <Text style={styles.faqQuestionText}>{item.question}</Text>
                  <Text style={styles.faqIcon}>{expandedItems[item.key] ? '−' : '+'}</Text>
                </TouchableOpacity>
                {expandedItems[item.key] && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  </View>
                )}
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
    marginBottom: Spacing.xl,
    letterSpacing: 0.5,
  },
  contactSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  contactOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  contactOption: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
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
  contactIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: Spacing.xl,
  },
  faqItem: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginRight: Spacing.md,
  },
  faqIcon: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.primary,
  },
  faqAnswer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.md,
  },
});

export default HelpScreen;



