import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';

const Header = ({ onMenuPress, onProfilePress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <View style={styles.menuIconContainer}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
      </TouchableOpacity>
      <View style={styles.logoSection}>
        <Image
          source={require('../assets/image1.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.brandName}>Scan Good</Text>
      </View>
      <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
        <View style={styles.profileIcon}>
          <View style={styles.profileIconInner}>
            {/* Head */}
            <View style={styles.profileHead} />
            {/* Shoulders */}
            <View style={styles.profileShoulders} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    position: 'relative',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  menuIconContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuLine: {
    width: 20,
    height: 2.5,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundGreen,
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  brandName: {
    ...Typography.titleMedium,
    fontFamily: 'Sansita One', // Custom font for brand name
    color: Colors.primary, // Koyu yeşil
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileIconInner: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  profileShoulders: {
    width: 18,
    height: 10,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.primary,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'transparent',
  },
});

export default Header;

