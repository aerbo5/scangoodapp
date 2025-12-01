import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const ScanTypeModal = ({ visible, onSelectReceipt, onSelectProduct, onCancel }) => {
  const { t } = useLanguage();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('common.scan')}</Text>
          <Text style={styles.modalSubtitle}>
            {t('common.selectScanType') || 'What would you like to scan?'}
          </Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={onSelectReceipt}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <Text style={styles.optionIcon}>{Icons.receipt}</Text>
              </View>
              <Text style={styles.optionText}>{t('home.scanReceipt')}</Text>
              <Text style={styles.optionDescription}>
                {t('common.scanReceiptDesc') || 'Scan a receipt to extract items'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={onSelectProduct}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <Text style={styles.optionIcon}>{Icons.product}</Text>
              </View>
              <Text style={styles.optionText}>{t('home.scanProduct')}</Text>
              <Text style={styles.optionDescription}>
                {t('common.scanProductDesc') || 'Scan a product to find prices'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>{t('common.cancel') || 'Cancel'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.backgroundGreen,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
    paddingBottom: Spacing.xl + 20,
    maxHeight: '80%',
  },
  modalTitle: {
    ...Typography.titleLarge,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d4e8dc',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  optionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  optionIcon: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
  },
  optionText: {
    ...Typography.titleMedium,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  optionDescription: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d4e8dc',
    marginTop: Spacing.md,
  },
  cancelButtonText: {
    ...Typography.titleMedium,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});

export default ScanTypeModal;

