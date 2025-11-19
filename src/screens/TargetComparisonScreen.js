import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const TargetComparisonScreen = ({ scannedItems, onNavigate, fadeAnim, calculateTotal }) => {
  const { t } = useLanguage();

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.shoppingList}>
          <Text style={styles.listTitle}>{t('targetComparison.shoppingListPriceAtTarget')}</Text>

          {scannedItems.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>{item.details}</Text>
              </View>
              <Text style={[styles.itemPrice, styles.itemPriceGreen]}>
                ${item.targetPrice.toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={[styles.totalPaid, styles.totalOverpaid]}>
            <Text style={styles.totalPaidText}>{t('shoppingList.youPaid')} ${calculateTotal(scannedItems)}</Text>
          </View>

          <View style={styles.bestValue}>
            <View>
              <Text style={styles.bestValueLabel}>{t('shoppingList.bestValue')}</Text>
              <Text style={styles.bestValuePrice}>
                ${calculateTotal(scannedItems, 'targetPrice')}
              </Text>
            </View>
            <TouchableOpacity style={styles.seeStoresBtn} onPress={() => onNavigate('compare')}>
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  itemPriceGreen: {
    color: Colors.primary,
  },
  totalPaid: {
    marginVertical: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  totalOverpaid: {
    backgroundColor: '#fee',
  },
  totalPaidText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  bestValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundGreen,
    borderRadius: BorderRadius.md,
  },
  bestValueLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  bestValuePrice: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  seeStoresBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  seeStoresBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TargetComparisonScreen;

