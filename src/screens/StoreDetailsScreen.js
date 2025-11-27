import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Linking, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const StoreDetailsScreen = ({ store, scannedItems, onNavigate, fadeAnim }) => {
  const { t } = useLanguage();

  // If store is not provided, show error and allow going back
  if (!store) {
    return (
      <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('compare')}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.noItemsText}>Store information not available</Text>
        </View>
      </Animated.View>
    );
  }

  // Generate product URL based on store name
  // Use specific link from backend if available, otherwise use general search
  const getProductUrl = (item, storeName) => {
    // If backend provided a specific link, use it (most accurate)
    if (item.link && item.link.trim().length > 0) {
      return item.link;
    }
    
    // Fallback: Generate general search URL based on store name
    const productName = encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, '-'));
    const storeUrls = {
      'Target': `https://www.target.com/s?searchTerm=${productName}`,
      'Whole Foods Market': `https://www.wholefoodsmarket.com/search?text=${productName}`,
      'Walmart Supercenter': `https://www.walmart.com/search?q=${productName}`,
      "Sam's Club": `https://www.samsclub.com/s/${productName}`,
    };
    return storeUrls[storeName] || `https://www.google.com/search?q=${productName}+${storeName}`;
  };

  const handleOpenProductLink = async (item) => {
    try {
      const url = getProductUrl(item, store.name);
      console.log('🔗 Opening product link:', url);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      console.error('❌ Error opening product link:', error);
      Alert.alert('Error', 'Failed to open product link');
    }
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('compare')}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <View style={styles.storeHeader}>
            <View style={[styles.storeLogo, { backgroundColor: store.color }]}>
              <Text style={styles.storeLogoText}>{store.logo}</Text>
            </View>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeAddress}>{store.address}</Text>
              <Text style={styles.storeDistance}>{Icons.location} {store.distance}</Text>
            </View>
            <Text style={styles.storeTotalPrice}>${store.total.toFixed(2)}</Text>
          </View>

          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Items at {store.name}</Text>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${(store.total || 0).toFixed(2)}</Text>
            </View>
            {scannedItems && scannedItems.length > 0 ? scannedItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemCard}
                onPress={() => handleOpenProductLink(item)}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.details && (
                    <Text style={styles.itemDetails}>{item.details}</Text>
                  )}
                  {item.isSimilar && (
                    <Text style={styles.similarBadge}>🔍 Similar Product</Text>
                  )}
                </View>
                <View style={styles.itemPriceContainer}>
                  <Text style={styles.itemPrice}>${(item.price || 0).toFixed(2)}</Text>
                  {item.quantity > 1 && (
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  )}
                  <Text style={styles.openLinkText}>View →</Text>
                </View>
              </TouchableOpacity>
            )) : (
              <Text style={styles.noItemsText}>No items found for this store</Text>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.routeButton}>
              <Text style={styles.routeButtonText}>{Icons.route} Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  detailsContainer: {
    padding: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backButtonText: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.primary,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundGreen,
    borderRadius: 20,
    marginBottom: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeLogo: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  storeLogoText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '700',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    ...Typography.titleMedium,
    fontSize: 18,
    marginBottom: Spacing.xs,
  },
  storeAddress: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  storeDistance: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  storeTotalPrice: {
    ...Typography.titleLarge,
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '700',
  },
  itemsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    fontSize: 18,
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  itemCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemName: {
    ...Typography.bodyBold,
    fontSize: 15,
    marginBottom: Spacing.xs,
  },
  itemDetails: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    ...Typography.titleMedium,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  openLinkText: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.primary,
  },
  similarBadge: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  noItemsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.lg,
  },
  actionButtons: {
    marginTop: Spacing.lg,
  },
  routeButton: {
    width: '100%',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  routeButtonText: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.white,
  },
});

export default StoreDetailsScreen;




