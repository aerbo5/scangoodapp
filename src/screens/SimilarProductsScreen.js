import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Image, Linking, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const SimilarProductsScreen = ({ product, onNavigate, fadeAnim, onAddToList }) => {
  const { t } = useLanguage();

  const handleOpenLink = async (link) => {
    try {
      if (Platform.OS === 'web') {
        window.open(link, '_blank');
      } else {
        const canOpen = await Linking.canOpenURL(link);
        if (canOpen) {
          await Linking.openURL(link);
        }
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  const getSourceIcon = (source) => {
    if (source?.toLowerCase().includes('amazon')) return '📦';
    if (source?.toLowerCase().includes('target')) return '🎯';
    if (source?.toLowerCase().includes('walmart')) return '🏪';
    if (source?.toLowerCase().includes('whole foods')) return '🥬';
    return '🛒';
  };

  // Get product links
  const productLinks = product?.productLinks;
  let exactMatches = [];
  let similarProducts = [];

  if (productLinks) {
    if (Array.isArray(productLinks)) {
      exactMatches = productLinks;
    } else if (productLinks.exactMatches || productLinks.similarProducts) {
      exactMatches = productLinks.exactMatches || [];
      similarProducts = productLinks.similarProducts || [];
    }
  }

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onNavigate('list')}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← {t('common.back') || 'Back'}</Text>
          </TouchableOpacity>

          {/* Original Product */}
          <View style={styles.originalProductSection}>
            <Text style={styles.sectionTitle}>{t('similarProducts.originalProduct') || 'Original Product'}</Text>
            <View style={styles.originalProductCard}>
              {product?.image && (
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.originalProductInfo}>
                <Text style={styles.originalProductName}>{product?.name || 'Product'}</Text>
                {product?.price && (
                  <Text style={styles.originalProductPrice}>${product.price.toFixed(2)}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <View style={styles.similarSection}>
              <Text style={styles.sectionTitle}>
                {t('similarProducts.similarProducts') || 'Similar Products'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {t('similarProducts.selectAlternative') || 'Select an alternative to add to your list'}
              </Text>
              
              {similarProducts.map((similarProduct, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.similarProductCard}
                  onPress={() => {
                    if (similarProduct.link) {
                      handleOpenLink(similarProduct.link);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.similarProductContent}>
                    <Text style={styles.similarProductIcon}>
                      {getSourceIcon(similarProduct.source)}
                    </Text>
                    <View style={styles.similarProductInfo}>
                      <Text style={styles.similarProductTitle} numberOfLines={2}>
                        {similarProduct.title}
                      </Text>
                      <Text style={styles.similarProductSource}>{similarProduct.source}</Text>
                      {similarProduct.priceText && (
                        <Text style={styles.similarProductPrice}>
                          {similarProduct.priceText}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (onAddToList) {
                          onAddToList({
                            name: similarProduct.title,
                            price: similarProduct.price || 0,
                            link: similarProduct.link,
                            source: similarProduct.source,
                            isSimilar: true,
                          });
                          onNavigate('list');
                        }
                      }}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {similarProducts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t('similarProducts.noSimilarProducts') || 'No similar products found'}
              </Text>
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
    backgroundColor: Colors.backgroundGreen,
  },
  scrollContent: {
    flex: 1,
  },
  container: {
    padding: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButtonText: {
    ...Typography.bodyBold,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  originalProductSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  sectionSubtitle: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  originalProductCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  originalProductInfo: {
    flex: 1,
  },
  originalProductName: {
    ...Typography.titleMedium,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  originalProductPrice: {
    ...Typography.titleMedium,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  similarSection: {
    marginTop: Spacing.xl,
  },
  similarProductCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
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
  similarProductContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  similarProductIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  similarProductInfo: {
    flex: 1,
  },
  similarProductTitle: {
    ...Typography.bodyBold,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  similarProductSource: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  similarProductPrice: {
    ...Typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
  },
  emptyState: {
    padding: Spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SimilarProductsScreen;

