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
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240, 249, 244, 0.85)', // Açık yeşil overlay - backgroundGreen ile uyumlu
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    width: '100%',
  },
  scanButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl * 2,
    width: '100%',
  },
  scanButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  scanButtonIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  scanButtonIcon: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
  },
  scanButtonText: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
  recentScansSection: {
    width: '100%',
  },
  recentScansTitle: {
    ...Typography.titleMedium,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: Spacing.md,
    fontWeight: '700',
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  recentScansList: {
    gap: Spacing.sm,
  },
  recentScanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.md + 4,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  recentScanItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  recentScanIcon: {
    fontSize: 24,
    color: Colors.primary,
    width: 32,
    textAlign: 'center',
  },
  recentScanInfo: {
    flex: 1,
  },
  recentScanStore: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  recentScanDate: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recentScanItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recentScanTotal: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.primary,
  },
  recentScanArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
});

export default HomeScreen;

