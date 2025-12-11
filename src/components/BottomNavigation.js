import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const BottomNavigation = ({ currentScreen, onNavigate, onScanPress }) => {
  const { t } = useLanguage();

  const handleScanPress = () => {
    if (onScanPress) {
      // Show scan type selection modal
      onScanPress();
    } else {
      // Fallback: go directly to camera
      onNavigate('camera', 'product');
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'camera' && styles.navItemActive]}
        onPress={handleScanPress}
      >
        <View style={[styles.navIconContainer, currentScreen === 'camera' && styles.navIconContainerActive]}>
          <Text style={[styles.navIcon, currentScreen === 'camera' && styles.navIconActive]}>
            {Icons.scan}
          </Text>
        </View>
        <Text style={[styles.navText, currentScreen === 'camera' && styles.navTextActive]}>
          {t('common.scan')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, (currentScreen === 'shoppingList' || currentScreen === 'history') && styles.navItemActive]}
        onPress={() => onNavigate('history')}
      >
        <View style={[styles.navIconContainer, (currentScreen === 'shoppingList' || currentScreen === 'history') && styles.navIconContainerActive]}>
          <Image
            source={require('../assets/history-icon.png')}
            style={[
              styles.navIconImage,
              (currentScreen === 'shoppingList' || currentScreen === 'history') && styles.navIconImageActive
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.navText, (currentScreen === 'shoppingList' || currentScreen === 'history') && styles.navTextActive]}>
          {t('common.history')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'list' && styles.navItemActive]}
        onPress={() => onNavigate('list')}
      >
        <View style={[styles.navIconContainer, currentScreen === 'list' && styles.navIconContainerActive]}>
          <Text style={[styles.navIcon, currentScreen === 'list' && styles.navIconActive]}>
            📋
          </Text>
        </View>
        <Text style={[styles.navText, currentScreen === 'list' && styles.navTextActive]}>
          {t('common.list') || 'List'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 60,
  },
  navItemActive: {
    // Active state container if needed
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  navIconContainerActive: {
    backgroundColor: Colors.primaryExtraLight,
  },
  navIcon: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  navIconActive: {
    color: Colors.primary,
  },
  navIconImage: {
    width: 24,
    height: 24,
    tintColor: Colors.textSecondary,
  },
  navIconImageActive: {
    tintColor: Colors.primary,
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  navTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default BottomNavigation;

