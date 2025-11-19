import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const CompareScreen = ({ scannedItems, onNavigate, fadeAnim, getSavings }) => {
  const { t } = useLanguage();
  const stores = [
    {
      name: 'Target',
      address: '1045 5th Street Unit 201',
      distance: '8.4 mi',
      total: 27.34,
      logo: '◯',
      color: Colors.target,
    },
    {
      name: 'Whole Foods Market',
      address: '6701 Red Road',
      distance: '1.9 mi',
      total: 29.15,
      logo: 'W',
      color: Colors.wholeFoods,
    },
    {
      name: 'Walmart Supercenter',
      address: '8191 W Flagler Street',
      distance: '5.9 mi',
      total: 34.04,
      logo: '★',
      color: Colors.walmart,
    },
    {
      name: "Sam's Club",
      address: '8425 NW 13th Terrace',
      distance: '6 mi',
      total: 35.45,
      logo: 'S',
      color: Colors.samsClub,
    },
  ];

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.compareScreen}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('shoppingList')}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.compareTitle}>{t('compare.comparePrices')}</Text>

          <View style={styles.savingsBanner}>
            <Text style={styles.savingsText}>{t('compare.youWouldSave')}</Text>
            <Text style={styles.savingsAmount}>${getSavings()}</Text>
          </View>

          <View style={styles.mapPreview}>
            <Text style={styles.mapPreviewText}>{Icons.location} {t('compare.mapPreview').replace('📍 ', '')}</Text>
            <Text style={styles.mapPreviewSubtext}>{t('compare.storeLocationsNearYou')}</Text>
          </View>

          <View style={styles.filterOptions}>
            <TouchableOpacity style={[styles.filterBtn, styles.filterBtnActive]}>
              <Text style={styles.filterBtnTextActive}>{t('compare.nearest')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterBtnText}>{t('compare.bestPrice')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterBtnText}>{t('compare.storeName')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>{t('shoppingList.bestValue')}</Text>

          <View style={styles.bestValueCard}>
            <View style={styles.bestPriceBadge}>
              <Text style={styles.bestPriceBadgeText}>{t('compare.bestPrice')}</Text>
            </View>
            <View style={styles.storeCardHeader}>
              <View style={styles.storeCardInfo}>
                <View style={[styles.storeCardLogo, { backgroundColor: stores[0].color }]}>
                  <Text style={styles.storeCardLogoText}>{stores[0].logo}</Text>
                </View>
                <View>
                  <Text style={styles.storeCardName}>{stores[0].name}</Text>
                  <Text style={styles.storeCardAddress}>{stores[0].address}</Text>
                    <Text style={styles.storeDistance}>{Icons.location} {stores[0].distance}</Text>
                </View>
              </View>
              <Text style={styles.storeCardPrice}>${stores[0].total.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={styles.sectionHeader}>{t('compare.moreOptions')}</Text>

          {stores.slice(1).map((store, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.storeCard}
              onPress={() => onNavigate('storeDetails', { store, scannedItems })}
            >
              <View style={styles.storeCardHeader}>
                <View style={styles.storeCardInfo}>
                  <View style={[styles.storeCardLogo, { backgroundColor: store.color }]}>
                    <Text style={styles.storeCardLogoText}>{store.logo}</Text>
                  </View>
                  <View>
                    <Text style={styles.storeCardName}>{store.name}</Text>
                    <Text style={styles.storeCardAddress}>{store.address}</Text>
                    <Text style={styles.storeDistance}>{Icons.location} {store.distance}</Text>
                  </View>
                </View>
                <Text style={styles.storeCardPrice}>${store.total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.infoText}>
            {t('compare.bestDealsFound').replace('{chains}', '4').replace('{stores}', '47')}
          </Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>{Icons.save} {t('compare.saveBasket').replace('💾 ', '')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>{Icons.route} {t('compare.route').replace('🗺️ ', '')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => onNavigate('home')}>
              <Text style={styles.secondaryBtnText}>🔄 {t('compare.compareAgain')}</Text>
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
  compareScreen: {
    padding: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.sm,
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  compareTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  savingsBanner: {
    padding: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  savingsText: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  savingsAmount: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: '700',
  },
  mapPreview: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  mapPreviewText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  mapPreviewSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterBtnText: {
    fontSize: 13,
    color: Colors.text,
  },
  filterBtnTextActive: {
    fontSize: 13,
    color: Colors.white,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  bestValueCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundGreen,
    borderRadius: 20,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
    position: 'relative',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  bestPriceBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  bestPriceBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  storeCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  storeCardName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  storeCardAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  storeDistance: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  storeCardPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  infoText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: Spacing.md,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  secondaryBtn: {
    width: '48%',
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CompareScreen;

