import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const ShoppingListScreen = ({ scannedItems, onNavigate, fadeAnim, calculateTotal }) => {
  const { t } = useLanguage();

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.shoppingList}>
          <Text style={styles.listTitle}>{t('shoppingList.yourShoppingList')}</Text>

          {scannedItems.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name || 'Item'}</Text>
                <Text style={styles.itemDetails}>{item.details || ''}</Text>
              </View>
              <Text style={styles.itemPrice}>${((item.price || 0)).toFixed(2)}</Text>
            </View>
          ))}

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
              style={styles.seeStoresBtn}
              onPress={() => onNavigate('compare')}
            >
              <Text style={styles.seeStoresBtnText}>{t('shoppingList.seeStores')}</Text>
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
});

export default ShoppingListScreen;

