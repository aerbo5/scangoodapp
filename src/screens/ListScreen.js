import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Linking, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const ListScreen = ({ scannedItems, onNavigate, fadeAnim, calculateTotal, originalTotal, youSave }) => {
  const { t } = useLanguage();

  const handleOpenLink = async (item) => {
    if (item.link || item.productLink) {
      const url = item.link || item.productLink;
      try {
        if (Platform.OS === 'web') {
          window.open(url, '_blank');
        } else {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
          }
        }
      } catch (error) {
        console.error('Error opening link:', error);
      }
    }
  };

  // You Paid = Sum of product prices (total of all items)
  const productTotal = parseFloat(calculateTotal(scannedItems) || 0);
  
  // Ensure all values are numbers before using toFixed
  const originalTotalNum = parseFloat(originalTotal || 0);
  const youSaveNum = parseFloat(youSave || 0);
  const savings = youSaveNum || (originalTotalNum > 0 ? (originalTotalNum - productTotal) : 0);

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>{t('list.title') || 'Your List'}</Text>

          {scannedItems.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>📝 {t('list.noItems') || 'No items yet'}</Text>
              <Text style={styles.emptyListSubtext}>{t('list.scanReceipt') || 'Scan a receipt to get started'}</Text>
            </View>
          ) : (
            <>
              {/* Items List */}
              <View style={styles.itemsSection}>
                {scannedItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.listItem}
                    onPress={() => {
                      if (item.link || item.productLink) {
                        handleOpenLink(item);
                      } else if (item.productLinks) {
                        // If has productLinks, show similar products
                        onNavigate('similarProducts', null, item);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name || 'Item'}</Text>
                      {item.details && (
                        <Text style={styles.itemDetails}>{item.details}</Text>
                      )}
                      {item.isSimilar && (
                        <Text style={styles.similarBadge}>🔍 {t('list.similarProduct') || 'Similar Product'}</Text>
                      )}
                      {(item.link || item.productLink) && (
                        <TouchableOpacity
                          style={styles.linkButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleOpenLink(item);
                          }}
                        >
                          <Text style={styles.linkButtonText}>🔗 {t('list.openLink') || 'Open Link'}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.itemPriceContainer}>
                      <Text style={styles.itemPrice}>${parseFloat(item.price || 0).toFixed(2)}</Text>
                      {item.quantity > 1 && (
                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Summary Section */}
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t('list.youPaid') || 'You Paid'}</Text>
                  <Text style={styles.summaryValue}>${productTotal.toFixed(2)}</Text>
                </View>
                {originalTotalNum > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('list.originalTotal') || 'Original Total'}</Text>
                    <Text style={styles.summaryValueOriginal}>${originalTotalNum.toFixed(2)}</Text>
                  </View>
                )}
                {savings > 0 && (
                  <View style={[styles.summaryRow, styles.savingsRow]}>
                    <Text style={styles.savingsLabel}>💰 {t('list.youSave') || 'You Save'}</Text>
                    <Text style={styles.savingsValue}>${savings.toFixed(2)}</Text>
                  </View>
                )}
              </View>
            </>
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
  listContainer: {
    padding: Spacing.lg,
  },
  listTitle: {
    ...Typography.titleLarge,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.xl,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  emptyList: {
    padding: Spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    ...Typography.titleMedium,
    fontSize: 20,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  emptyListSubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  itemsSection: {
    marginBottom: Spacing.xl,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
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
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...Typography.bodyBold,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    color: Colors.text,
  },
  itemDetails: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  similarBadge: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  linkButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    ...Typography.titleMedium,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  itemQuantity: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  summarySection: {
    backgroundColor: Colors.backgroundGreen,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.text,
  },
  summaryValue: {
    ...Typography.titleMedium,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  summaryValueOriginal: {
    ...Typography.titleMedium,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  savingsRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
  },
  savingsLabel: {
    ...Typography.titleMedium,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  savingsValue: {
    ...Typography.titleLarge,
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
  },
});

export default ListScreen;



