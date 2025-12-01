import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const ShoppingListScreen = ({ scannedItems, onNavigate, fadeAnim, calculateTotal, onComparePrices, isComparingPrices, onCompareProductPrice }) => {
  const { t } = useLanguage();

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.shoppingList}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onNavigate('home')}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← {t('common.back') || 'Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.listTitle}>{t('shoppingList.yourShoppingList')}</Text>

          {scannedItems.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>📝 No items yet</Text>
              <Text style={styles.emptyListSubtext}>Scan a receipt or product to get started</Text>
            </View>
          ) : (
            scannedItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.listItem}
              onPress={() => onNavigate('productDetails', null, item)}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name || 'Item'}</Text>
                <Text style={styles.itemDetails}>{item.details || ''}</Text>
                <TouchableOpacity
                  style={styles.compareBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    onCompareProductPrice(item);
                  }}
                >
                  <Text style={styles.compareBtnText}>💰 Compare Prices</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemPrice}>${((item.price || 0)).toFixed(2)}</Text>
            </TouchableOpacity>
            ))
          )}

          <View style={styles.totalPaid}>
            <Text style={styles.totalPaidText}>{t('shoppingList.youPaid')} ${calculateTotal(scannedItems)}</Text>
          </View>

          <View style={styles.bestValue}>
            <View>
              <Text style={styles.bestValueLabel}>{t('shoppingList.bestValue')}</Text>
              <Text style={styles.bestValuePrice}>
                ${calculateTotal(scannedItems, 'targetPrice')}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.seeStoresBtn, isComparingPrices && styles.seeStoresBtnDisabled]}
              onPress={onComparePrices}
              disabled={isComparingPrices}
            >
              <Text style={styles.seeStoresBtnText}>
                {isComparingPrices ? '🔍 Comparing...' : '💰 Compare Prices'}
              </Text>
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
  },
  scrollContent: {
    flex: 1,
  },
  shoppingList: {
    padding: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  listTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.xl,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    color: Colors.text,
  },
  itemDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  compareBtn: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  compareBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  totalPaid: {
    marginVertical: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  totalOverpaid: {
    backgroundColor: '#fee',
  },
  totalPaidText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  bestValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.backgroundGreen,
    borderRadius: BorderRadius.lg,
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
  bestValueLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  bestValuePrice: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  seeStoresBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  seeStoresBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  seeStoresBtnDisabled: {
    opacity: 0.6,
  },
});

export default ShoppingListScreen;

