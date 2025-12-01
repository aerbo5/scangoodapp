import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const HomeScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/image1.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>{t('home.tagline')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onNavigate('camera', 'receipt')}
            activeOpacity={1}
          >
            <View style={styles.actionBtnIconContainer}>
              <Text style={styles.actionBtnIcon}>{Icons.receipt}</Text>
            </View>
            <Text style={styles.actionBtnText}>{t('home.scanReceipt')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onNavigate('camera', 'product')}
            activeOpacity={1}
          >
            <View style={styles.actionBtnIconContainer}>
              <Text style={styles.actionBtnIcon}>{Icons.product}</Text>
            </View>
            <Text style={styles.actionBtnText}>{t('home.scanProduct')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundGreen,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing.xl,
  },
  tagline: {
    ...Typography.titleLarge,
    fontFamily: 'Sansita One', // Custom font for brand name
    fontSize: 36,
    color: Colors.primary, // Koyu yeşil
    marginBottom: Spacing.sm,
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 18,
    color: Colors.textSecondary,
  },
  actionButtons: {
    width: '100%',
    gap: Spacing.md + 4,
    marginTop: Spacing.xl,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: Spacing.xl + 8,
    paddingHorizontal: Spacing.xl + 8,
    backgroundColor: Colors.white,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.lg,
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: '#d4e8dc', // Açık yeşil border - backgroundGreen (#f0f9f4) ile uyumlu
  },
  actionBtnIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  actionBtnIcon: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
  },
  actionBtnText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
  },
});

export default HomeScreen;

