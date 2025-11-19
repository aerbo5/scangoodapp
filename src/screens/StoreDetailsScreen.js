import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Linking, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const StoreDetailsScreen = ({ store, scannedItems, onNavigate, fadeAnim }) => {
  const { t } = useLanguage();

  // Generate product URL based on store name
  const getProductUrl = (item, storeName) => {
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
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
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
            {scannedItems && scannedItems.map((item, index) => (
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
                </View>
                <View style={styles.itemPriceContainer}>
                  <Text style={styles.itemPrice}>${(item.price || item.targetPrice || 0).toFixed(2)}</Text>
                  <Text style={styles.openLinkText}>View on {store.name} →</Text>
                </View>
              </TouchableOpacity>
            ))}
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
  openLinkText: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.primary,
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



