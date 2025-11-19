import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const BottomNavigation = ({ currentScreen, onNavigate }) => {
  const { t } = useLanguage();

  const handleScanPress = () => {
    // Show scan options or go to camera
    onNavigate('camera', 'product');
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
        style={[styles.navItem, currentScreen === 'shoppingList' && styles.navItemActive]}
        onPress={() => onNavigate('shoppingList')}
      >
        <View style={[styles.navIconContainer, currentScreen === 'shoppingList' && styles.navIconContainerActive]}>
          <Image
            source={require('../assets/history-icon.png')}
            style={[
              styles.navIconImage,
              currentScreen === 'shoppingList' && styles.navIconImageActive
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.navText, currentScreen === 'shoppingList' && styles.navTextActive]}>
          {t('common.history')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'favorites' && styles.navItemActive]}
        onPress={() => onNavigate('favorites')}
      >
        <View style={[styles.navIconContainer, currentScreen === 'favorites' && styles.navIconContainerActive]}>
          <Text style={[styles.navIcon, currentScreen === 'favorites' && styles.navIconActive]}>
            {Icons.favorites}
          </Text>
        </View>
        <Text style={[styles.navText, currentScreen === 'favorites' && styles.navTextActive]}>
          {t('common.favorites')}
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
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg + 5,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  navItemActive: {
    borderRadius: BorderRadius.md,
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  navIconContainerActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  navIcon: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  navIconActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  navIconImage: {
    width: 24,
    height: 24,
    tintColor: Colors.textSecondary,
  },
  navIconImageActive: {
    tintColor: Colors.white,
  },
  navText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  navTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default BottomNavigation;

