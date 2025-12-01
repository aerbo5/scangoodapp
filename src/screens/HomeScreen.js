import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const HomeScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <View style={styles.homeContent}>
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
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundGreen,
  },
  homeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
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
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: Spacing.lg + 4,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  actionBtnIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;

