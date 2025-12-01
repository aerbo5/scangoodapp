import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Image, Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(300, SCREEN_WIDTH * 0.85); // Max 300px veya ekran genişliğinin %85'i

const DrawerMenu = ({ visible, onClose, onNavigate, currentScreen, onScanPress }) => {
  const { t } = useLanguage();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleMenuPress = (screen, mode = null) => {
    onNavigate(screen, mode);
    onClose();
  };


  const menuItems = [
    { key: 'home', icon: Icons.home, label: t('common.home'), screen: 'home' },
    { key: 'scan', icon: Icons.scan, label: t('common.scan'), screen: 'home', isScan: true },
    { key: 'list', icon: '📋', label: t('common.list') || 'List', screen: 'list' },
    { key: 'history', icon: Icons.history, label: t('common.history'), screen: 'history' },
    { key: 'profile', icon: '👤', label: t('common.profile') || 'Profile', screen: 'profile' },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.drawerHeader}>
            <View style={styles.logoSection}>
              <Image
                source={require('../assets/image1.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.brandName}>Scan Good</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>{Icons.close}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            {menuItems.map((item) => {
              const isActive = currentScreen === item.screen;
              const isHistory = item.key === 'history';
              const isScan = item.isScan;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => {
                    if (isScan && onScanPress) {
                      onScanPress();
                    } else {
                      handleMenuPress(item.screen, item.mode);
                    }
                  }}
                  activeOpacity={1}
                >
                  {isHistory ? (
                    <Image
                      source={require('../assets/history-icon.png')}
                      style={[
                        styles.menuIconImage,
                        isActive && styles.menuIconImageActive
                      ]}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                  )}
                  <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    backgroundColor: Colors.backgroundGreen,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  brandName: {
    ...Typography.titleSmall,
    fontFamily: 'Sansita One', // Custom font for brand name
    color: Colors.primary, // Koyu yeşil
    textTransform: 'capitalize',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
  },
  menuItems: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Drawer genişliğine göre ayarla
    minHeight: 56, // Daha küçük yükseklik
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    marginHorizontal: Spacing.sm,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.md, // Yuvarlatılmış köşeler
    borderWidth: 1,
    borderColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: Colors.backgroundGreen,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    fontSize: 24,
    width: 35,
    fontWeight: '600',
    color: Colors.text,
  },
  menuIconImage: {
    width: 28,
    height: 28,
    tintColor: Colors.text,
  },
  menuIconImageActive: {
    tintColor: Colors.primary,
  },
  menuLabel: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  menuLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default DrawerMenu;

