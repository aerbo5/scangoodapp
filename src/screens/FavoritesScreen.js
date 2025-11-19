import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const FavoritesScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();
  const [favoriteStores] = useState([
    {
      id: 1,
      name: 'Target',
      address: '1045 5th Street Unit 201, Miami, FL',
      distance: '8.4 mi',
      logo: '◯',
      color: Colors.target,
    },
    {
      id: 2,
      name: 'Whole Foods Market',
      address: '6701 Red Road, Miami, FL',
      distance: '1.9 mi',
      logo: 'W',
      color: Colors.wholeFoods,
    },
  ]);

  const [favoriteProducts] = useState([
    {
      id: 1,
      name: 'Produce Avocado',
      size: '1 Each',
      image: '🥑',
      bestPrice: 0.75,
      bestStore: 'Target',
    },
    {
      id: 2,
      name: 'Organic Tomatoes',
      size: '1 lb',
      image: '🍅',
      bestPrice: 2.99,
      bestStore: 'Whole Foods Market',
    },
  ]);

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.favoritesContainer}>
          <Text style={styles.title}>{t('favorites.title')}</Text>

          {/* Favorite Stores Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('favorites.favoriteStores')}</Text>
            {favoriteStores.length > 0 ? (
              favoriteStores.map((store) => (
                <TouchableOpacity key={store.id} style={styles.storeCard}>
                  <View style={styles.storeCardHeader}>
                    <View style={styles.storeCardInfo}>
                      <View style={[styles.storeCardLogo, { backgroundColor: store.color }]}>
                        <Text style={styles.storeCardLogoText}>{store.logo}</Text>
                      </View>
                      <View style={styles.storeInfo}>
                        <Text style={styles.storeName}>{store.name}</Text>
                        <Text style={styles.storeAddress}>{store.address}</Text>
                        <Text style={styles.storeDistance}>📍 {store.distance}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Text style={styles.favoriteIcon}>{Icons.favorites}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t('favorites.noFavoriteStores')}</Text>
              </View>
            )}
          </View>

          {/* Favorite Products Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('favorites.favoriteProducts')}</Text>
            {favoriteProducts.length > 0 ? (
              favoriteProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => onNavigate('productDetails')}
                >
                  <View style={styles.productCardContent}>
                    <View style={styles.productImageContainer}>
                      <Text style={styles.productImage}>{product.image}</Text>
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productSize}>{product.size}</Text>
                      <View style={styles.productPriceRow}>
                        <Text style={styles.productPriceLabel}>{t('favorites.bestPrice')}: </Text>
                        <Text style={styles.productPrice}>${product.bestPrice.toFixed(2)}</Text>
                      </View>
                      <Text style={styles.productStore}>{t('favorites.at')} {product.bestStore}</Text>
                    </View>
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Text style={styles.favoriteIcon}>{Icons.favorites}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t('favorites.noFavoriteProducts')}</Text>
              </View>
            )}
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
  favoritesContainer: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  storeCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  storeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  storeCardLogo: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeCardLogoText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
    color: Colors.text,
  },
  storeAddress: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  storeDistance: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  productCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  productCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  productSize: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  productPriceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  productStore: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
    color: Colors.primary,
  },
  emptyState: {
    padding: Spacing.xl,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default FavoritesScreen;

