import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Alert, Linking } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const ProductDetailsScreen = ({ selectedProduct, onNavigate, fadeAnim }) => {
  const { t } = useLanguage();

  const handleAddToList = () => {
    Alert.alert(t('productDetails.success'), t('productDetails.addedToShoppingList'));
    onNavigate('shoppingList');
  };

  const handleOpenProductLink = async (link) => {
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open product link');
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'Amazon':
        return '📦';
      case 'Target':
        return '🎯';
      case 'Walmart':
        return '🛒';
      case 'Google Shopping':
        return '🛍️';
      default:
        return '🔗';
    }
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.priceDetails}>
          <Text style={styles.productTitle}>{t('productDetails.priceDetails')}</Text>

          <View style={styles.productImageContainer}>
            <Text style={styles.productImagePlaceholder}>🥑</Text>
          </View>

          <Text style={styles.productName}>{selectedProduct?.name || t('productDetails.productName')}</Text>
          <Text style={styles.productSize}>{selectedProduct?.size || '1 Each'}</Text>

          <TouchableOpacity style={styles.addToListBtn} onPress={handleAddToList}>
            <Text style={styles.addToListBtnText}>{t('productDetails.addToShoppingList')}</Text>
          </TouchableOpacity>

          <View style={styles.storeSection}>
            <Text style={styles.sectionTitle}>{t('productDetails.favoriteStores')}</Text>
            <View style={styles.noFavorites}>
              <Text style={styles.noFavoritesText}>{t('productDetails.noFavoriteStores')}</Text>
            </View>
          </View>

          <View style={styles.storeSection}>
            <Text style={styles.sectionTitle}>{t('productDetails.otherStores')}</Text>
            {selectedProduct?.stores?.map((store, index) => (
              <TouchableOpacity
                key={index}
                style={styles.storeItem}
                onPress={() => onNavigate('targetComparison')}
              >
                <View style={[styles.storeLogo, styles.storeLogoTarget]}>
                  <Text style={styles.storeLogoText}>◯</Text>
                </View>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeAddress}>{store.address}</Text>
                </View>
                <Text style={styles.storePrice}>${store.price.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.duplicateNotice}>{t('productDetails.duplicatePricesHidden')}</Text>
          </View>

          {/* Product Links Section - Price Comparison */}
          {selectedProduct?.productLinks && selectedProduct.productLinks.length > 0 && (
            <View style={styles.storeSection}>
              <Text style={styles.sectionTitle}>💰 Price Comparison</Text>
              {selectedProduct.productLinks.map((productLink, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.productLinkItem,
                    index === 0 && styles.productLinkItemCheapest, // Highlight cheapest
                  ]}
                  onPress={() => handleOpenProductLink(productLink.link)}
                >
                  <View style={styles.productLinkContent}>
                    <Text style={styles.productLinkIcon}>{getSourceIcon(productLink.source)}</Text>
                    <View style={styles.productLinkInfo}>
                      <View style={styles.productLinkHeader}>
                        <Text style={styles.productLinkTitle} numberOfLines={2}>
                          {productLink.title}
                        </Text>
                        {productLink.priceText && (
                          <Text style={[
                            styles.productLinkPrice,
                            index === 0 && styles.productLinkPriceCheapest
                          ]}>
                            {productLink.priceText}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.productLinkSource}>{productLink.source}</Text>
                      {productLink.snippet && (
                        <Text style={styles.productLinkSnippet} numberOfLines={2}>
                          {productLink.snippet}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.productLinkArrow}>→</Text>
                  </View>
                  {index === 0 && productLink.price && (
                    <View style={styles.cheapestBadge}>
                      <Text style={styles.cheapestBadgeText}>💰 Cheapest</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  priceDetails: {
    padding: Spacing.lg,
  },
  productTitle: {
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontWeight: '600',
  },
  productImageContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  productImagePlaceholder: {
    fontSize: 100,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  productSize: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  addToListBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  addToListBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  storeSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  noFavorites: {
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  noFavoritesText: {
    color: Colors.gray,
    fontSize: 13,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: '#f8f9ff',
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  storeLogoTarget: {
    backgroundColor: Colors.target,
  },
  storeLogoText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  storeAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  storePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  duplicateNotice: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 12,
    marginTop: Spacing.md,
  },
  productLinkItem: {
    padding: Spacing.md,
    backgroundColor: '#f8f9ff',
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    position: 'relative',
  },
  productLinkItemCheapest: {
    backgroundColor: '#f0f9ff',
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productLinkIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  productLinkInfo: {
    flex: 1,
  },
  productLinkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productLinkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  productLinkPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  productLinkPriceCheapest: {
    color: Colors.primary,
    fontSize: 18,
  },
  productLinkSource: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  productLinkSnippet: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  productLinkArrow: {
    fontSize: 20,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  cheapestBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  cheapestBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default ProductDetailsScreen;

