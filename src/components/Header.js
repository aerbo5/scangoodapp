import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar } from 'react-native';
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 100,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  menuIconContainer: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: Colors.text,
    borderRadius: 1,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  brandName: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    fontWeight: '700',
    fontSize: 20,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconInner: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    opacity: 0.7,
  },
  profileHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.text,
    marginBottom: 2,
  },
  profileShoulders: {
    width: 16,
    height: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: Colors.text,
  },
});

export default Header;

