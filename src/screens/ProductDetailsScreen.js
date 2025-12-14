import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Alert, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const FAVORITES_KEY = '@product_favorites';

const ProductDetailsScreen = ({ selectedProduct, onNavigate, fadeAnim, onAddToList }) => {
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: null, height: null });

  useEffect(() => {
    checkIfFavorite();
    // Reset image dimensions when product changes
    if (selectedProduct?.image) {
      setImageDimensions({ width: null, height: null });
      Image.getSize(
        selectedProduct.image,
        (width, height) => {
          setImageDimensions({ width, height });
        },
        (error) => {
          console.log('Error getting image size:', error);
        }
      );
    }
  }, [selectedProduct]);

  const checkIfFavorite = async () => {
    if (!selectedProduct) return;
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        const favorite = favorites.find(f => f.name === selectedProduct.name);
        setIsFavorite(!!favorite);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      if (isFavorite) {
        favorites = favorites.filter(f => f.name !== selectedProduct.name);
        setIsFavorite(false);
        Alert.alert('Success', 'Removed from favorites');
      } else {
        const favoriteData = {
          id: Date.now().toString(),
          name: selectedProduct.name,
          price: selectedProduct.price || 0,
          size: selectedProduct.size || '1 Each',
          image: selectedProduct.image || null,
          bestPrice: getBestPrice(),
          bestStore: getBestStore(),
          createdAt: new Date().toISOString(),
        };
        favorites.push(favoriteData);
        setIsFavorite(true);
        Alert.alert('Success', 'Added to favorites');
      }
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const getBestPrice = () => {
    const productLinks = selectedProduct?.productLinks;
    if (productLinks) {
      if (productLinks.exactMatches && productLinks.exactMatches.length > 0) {
        return productLinks.exactMatches[0].price || selectedProduct.price || 0;
      }
    }
    return selectedProduct.price || 0;
  };

  const getBestStore = () => {
    const productLinks = selectedProduct?.productLinks;
    if (productLinks) {
      if (productLinks.exactMatches && productLinks.exactMatches.length > 0) {
        return productLinks.exactMatches[0].source || 'Unknown';
      }
    }
    return 'Unknown';
  };

  const handleAddToList = () => {
    if (onAddToList && selectedProduct) {
      // Get the cheapest price from stores or product links
      let price = 0;
      let targetPrice = 0;
      let details = selectedProduct.size || '1 Each';
      
      // Collect all available prices
      const allPrices = [];
      
      // Get prices from stores
      if (selectedProduct.stores && selectedProduct.stores.length > 0) {
        selectedProduct.stores.forEach(store => {
          if (store.price && store.price > 0) {
            allPrices.push(store.price);
          }
        });
      }
      
      // Get prices from product links (already sorted by price, cheapest first)
      // Handle both old format (array) and new format (object with exactMatches/similarProducts)
      const productLinks = selectedProduct.productLinks;
      if (productLinks) {
        if (Array.isArray(productLinks)) {
          // Old format: array
          productLinks.forEach(link => {
            if (link.price && link.price > 0) {
              allPrices.push(link.price);
            }
          });
        } else if (productLinks.exactMatches || productLinks.similarProducts) {
          // New format: object with exactMatches and similarProducts
          [...(productLinks.exactMatches || []), ...(productLinks.similarProducts || [])].forEach(link => {
            if (link.price && link.price > 0) {
              allPrices.push(link.price);
            }
          });
        }
      }
      
      // Find cheapest price (targetPrice)
      if (allPrices.length > 0) {
        targetPrice = Math.min(...allPrices);
        // Use first store price or cheapest link price as current price
        if (selectedProduct.stores && selectedProduct.stores.length > 0) {
          price = selectedProduct.stores[0].price || targetPrice;
        } else {
          // Get first price from product links (new or old format)
          const productLinks = selectedProduct.productLinks;
          if (productLinks) {
            if (Array.isArray(productLinks) && productLinks.length > 0) {
              price = productLinks[0].price || targetPrice;
            } else if (productLinks.exactMatches && productLinks.exactMatches.length > 0) {
              price = productLinks.exactMatches[0].price || targetPrice;
            } else if (productLinks.similarProducts && productLinks.similarProducts.length > 0) {
              price = productLinks.similarProducts[0].price || targetPrice;
            }
          }
          if (price === 0) {
            price = targetPrice;
          }
        }
      }
      
      // If still no price, use default
      if (price === 0) {
        price = 0.99;
        targetPrice = 0.99;
      }
      
      // If targetPrice is still 0, use price
      if (targetPrice === 0) {
        targetPrice = price;
      }
      
      // Add product to shopping list
      onAddToList({
        name: selectedProduct.name,
        details: details,
        price: price,
        targetPrice: targetPrice, // Cheapest available price
      });
      
      Alert.alert(t('productDetails.success') || 'Success', t('productDetails.addedToShoppingList') || 'Added to shopping list');
      onNavigate('shoppingList');
    } else {
      Alert.alert(t('productDetails.success') || 'Success', t('productDetails.addedToShoppingList') || 'Added to shopping list');
      onNavigate('shoppingList');
    }
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
            {selectedProduct?.image ? (
              <Image 
                source={{ uri: selectedProduct.image }} 
                style={[
                  styles.productImage,
                  imageDimensions.width && imageDimensions.height 
                    ? { 
                        width: imageDimensions.width > 400 ? 400 : imageDimensions.width,
                        height: imageDimensions.width > 400 
                          ? (imageDimensions.height * 400 / imageDimensions.width)
                          : imageDimensions.height
                      }
                    : { width: '100%', minHeight: 200 }
                ]}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.productImagePlaceholder}>📷</Text>
            )}
          </View>

          <Text style={styles.productName}>{selectedProduct?.name || t('productDetails.productName')}</Text>
          <Text style={styles.productSize}>{selectedProduct?.size || '1 Each'}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.addToListBtn} onPress={handleAddToList}>
              <Text style={styles.addToListBtnText}>{t('productDetails.addToShoppingList')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.favoriteBtn, isFavorite && styles.favoriteBtnActive]} 
              onPress={handleToggleFavorite}
            >
              <Text style={styles.favoriteBtnText}>
                {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show best price if available */}
          {(() => {
            const bestPrice = getBestPrice();
            const bestStore = getBestStore();
            const currentPrice = selectedProduct?.price || 0;
            
            if (bestPrice > 0 && bestStore !== 'Unknown') {
              return (
                <View style={styles.bestPriceSection}>
                  <Text style={styles.bestPriceLabel}>💰 Best Price Found:</Text>
                  <View style={styles.bestPriceInfo}>
                    <Text style={styles.bestPriceStore}>{bestStore}</Text>
                    <Text style={styles.bestPriceAmount}>${bestPrice.toFixed(2)}</Text>
                  </View>
                  {currentPrice > 0 && bestPrice < currentPrice && (
                    <Text style={styles.savingsText}>
                      Save ${(currentPrice - bestPrice).toFixed(2)} vs current price
                    </Text>
                  )}
                </View>
              );
            }
            return null;
          })()}

          <View style={styles.storeSection}>
            <Text style={styles.sectionTitle}>{t('productDetails.favoriteStores')}</Text>
            <View style={styles.noFavorites}>
              <Text style={styles.noFavoritesText}>{t('productDetails.noFavoriteStores')}</Text>
            </View>
          </View>

          {/* Only show Other Stores if there are real stores (not empty) */}
          {selectedProduct?.stores && selectedProduct.stores.length > 0 && (
          <View style={styles.storeSection}>
            <Text style={styles.sectionTitle}>{t('productDetails.otherStores')}</Text>
            {selectedProduct.stores.map((store, index) => (
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
          )}

          {/* Product Links Section - Price Comparison */}
          {(() => {
            const productLinks = selectedProduct?.productLinks;
            if (!productLinks) {
              console.log('📱 Frontend - No productLinks found');
              return null;
            }
            
            // Handle both old format (array) and new format (object)
            let exactMatches = [];
            let similarProducts = [];
            
            if (Array.isArray(productLinks)) {
              // Old format: treat all as exact matches
              exactMatches = productLinks;
              console.log('📱 Frontend - Old format (array):', exactMatches.length, 'items');
            } else if (productLinks.exactMatches || productLinks.similarProducts) {
              // New format: separate exact matches and similar products
              exactMatches = productLinks.exactMatches || [];
              similarProducts = productLinks.similarProducts || [];
              console.log('📱 Frontend - New format (object):', {
                exactMatches: exactMatches.length,
                similarProducts: similarProducts.length
              });
            } else {
              console.log('📱 Frontend - Unknown format:', typeof productLinks, productLinks);
              return null;
            }
            
            // Debug: log first item if exists
            if (exactMatches.length > 0) {
              console.log('📱 Frontend - First exact match:', {
                title: exactMatches[0].title?.substring(0, 50),
                source: exactMatches[0].source,
                price: exactMatches[0].price,
                priceText: exactMatches[0].priceText
              });
            }
            
            return (
              <>
                {/* Exact Matches - Price Comparison */}
                {exactMatches.length > 0 && (
                  <View style={styles.storeSection}>
                    <Text style={styles.sectionTitle}>💰 Price Comparison</Text>
                    {exactMatches.map((productLink, index) => (
                      <TouchableOpacity
                        key={`exact-${index}`}
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
                                  index === 0 && productLink.price && styles.productLinkPriceCheapest,
                                  productLink.priceText === 'Price unavailable' && styles.productLinkPriceUnavailable
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
                
                {/* Similar Products */}
                {similarProducts.length > 0 && (
                  <View style={styles.storeSection}>
                    <Text style={styles.sectionTitle}>🔍 Similar Products</Text>
                    {similarProducts.map((productLink, index) => (
                      <TouchableOpacity
                        key={`similar-${index}`}
                        style={styles.productLinkItem}
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
                                <Text style={styles.productLinkPrice}>
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
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            );
          })()}
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
  },
  productImage: {
    resizeMode: 'contain', // Keep original size, don't zoom
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
  actionButtons: {
    marginBottom: Spacing.lg,
  },
  addToListBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addToListBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  favoriteBtnActive: {
    backgroundColor: '#fee',
    borderColor: Colors.error,
  },
  favoriteBtnText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  bestPriceSection: {
    backgroundColor: Colors.backgroundGreen,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  bestPriceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  bestPriceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestPriceStore: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  bestPriceAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  savingsText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
    marginTop: Spacing.xs,
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
  productLinkPriceUnavailable: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
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

