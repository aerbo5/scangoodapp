import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const ProductDetailsScreen = ({ selectedProduct, onNavigate, fadeAnim }) => {
  const { t } = useLanguage();

  const handleAddToList = () => {
    Alert.alert(t('productDetails.success'), t('productDetails.addedToShoppingList'));
    onNavigate('shoppingList');
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
});

export default ProductDetailsScreen;

