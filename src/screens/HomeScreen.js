import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, ImageBackground } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';
import { getReceiptHistory } from '../services/historyService';

const HomeScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    loadRecentScans();
  }, []);

  const loadRecentScans = async () => {
    try {
      const history = await getReceiptHistory();
      // Get last 5 scans
      setRecentScans(history.slice(0, 5));
    } catch (error) {
      console.error('Error loading recent scans:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ImageBackground
        source={require('../assets/image1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Subtitle */}
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

          {/* Scan Buttons Row */}
          <View style={styles.scanButtonsRow}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => onNavigate('camera', 'receipt')}
              activeOpacity={0.8}
            >
              <View style={styles.scanButtonIconContainer}>
                <Text style={styles.scanButtonIcon}>{Icons.receipt}</Text>
              </View>
              <Text style={styles.scanButtonText}>{t('home.scanReceipt')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => onNavigate('camera', 'product')}
              activeOpacity={0.8}
            >
              <View style={styles.scanButtonIconContainer}>
                <Text style={styles.scanButtonIcon}>{Icons.product}</Text>
              </View>
              <Text style={styles.scanButtonText}>{t('home.scanProduct')}</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Scans Section */}
          <View style={styles.recentScansSection}>
            <Text style={styles.recentScansTitle}>{t('home.recentScans') || 'Recent Scans'}</Text>

            {recentScans.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t('home.noRecentScans') || 'No recent scans'}</Text>
              </View>
            ) : (
              <View style={styles.recentScansList}>
                {recentScans.map((scan) => (
                  <TouchableOpacity
                    key={scan.id}
                    style={styles.recentScanItem}
                    onPress={() => {
                      if (scan.items) {
                        onNavigate('shoppingList', null, scan.items);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.recentScanItemLeft}>
                      <Text style={styles.recentScanIcon}>{Icons.receipt}</Text>
                      <View style={styles.recentScanInfo}>
                        <Text style={styles.recentScanStore}>{scan.store || 'Unknown Store'}</Text>
                        <Text style={styles.recentScanDate}>{formatDate(scan.timestamp || scan.date)}</Text>
                      </View>
                    </View>
                    <View style={styles.recentScanItemRight}>
                      <Text style={styles.recentScanTotal}>${scan.total || scan.youPaid || '0.00'}</Text>
                      <Text style={styles.recentScanArrow}>›</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(249, 250, 251, 0.95)', // Background color with high opacity
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  subtitle: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  scanButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl * 1.5,
  },
  scanButton: {
    flex: 1,
    aspectRatio: 0.9,
    backgroundColor: Colors.white,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  scanButtonIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryExtraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  scanButtonIcon: {
    fontSize: 32,
    color: Colors.primary,
  },
  scanButtonText: {
    ...Typography.button,
    color: Colors.text,
    textAlign: 'center',
    fontSize: 14,
  },
  recentScansSection: {
    width: '100%',
  },
  recentScansTitle: {
    ...Typography.h4,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  recentScansList: {
    gap: Spacing.sm,
  },
  recentScanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  recentScanItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  recentScanIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
    backgroundColor: Colors.backgroundSecondary,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  recentScanInfo: {
    flex: 1,
  },
  recentScanStore: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  recentScanDate: {
    ...Typography.caption,
    fontSize: 12,
  },
  recentScanItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recentScanTotal: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
  },
  recentScanArrow: {
    fontSize: 18,
    color: Colors.textLight,
  },
});

export default HomeScreen;

