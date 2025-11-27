import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { getReceiptHistory, deleteReceiptFromHistory } from '../services/historyService';

const HistoryScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await getReceiptHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (receiptId) => {
    try {
      await deleteReceiptFromHistory(receiptId);
      await loadHistory();
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.historyContainer}>
          <Text style={styles.title}>📜 Receipt History</Text>

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : history.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>📝 No receipts yet</Text>
              <Text style={styles.emptyListSubtext}>Scan receipts to see them here</Text>
            </View>
          ) : (
            history.map((receipt) => (
              <View key={receipt.id} style={styles.receiptCard}>
                <View style={styles.receiptHeader}>
                  <View style={styles.receiptInfo}>
                    <Text style={styles.receiptStore}>{receipt.store || 'Unknown Store'}</Text>
                    {receipt.address && (
                      <Text style={styles.receiptAddress}>{receipt.address}</Text>
                    )}
                    <Text style={styles.receiptDate}>
                      {receipt.date || formatDate(receipt.timestamp)}
                      {receipt.time && ` • ${receipt.time}`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(receipt.id)}
                  >
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.receiptItems}>
                  {receipt.items && receipt.items.slice(0, 3).map((item, index) => (
                    <Text key={index} style={styles.receiptItem}>
                      {item.name} - ${item.price.toFixed(2)}
                    </Text>
                  ))}
                  {receipt.items && receipt.items.length > 3 && (
                    <Text style={styles.moreItems}>
                      +{receipt.items.length - 3} more items
                    </Text>
                  )}
                </View>
                
                <View style={styles.receiptTotal}>
                  <Text style={styles.totalLabel}>You Paid:</Text>
                  <Text style={styles.totalAmount}>${(receipt.total || receipt.youPaid || 0).toFixed(2)}</Text>
                  {receipt.youSave && (
                    <Text style={styles.youSave}>You Saved: ${receipt.youSave.toFixed(2)}</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  historyContainer: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.xl,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyListText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  receiptCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
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
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptStore: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  receiptAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  receiptDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  deleteBtnText: {
    fontSize: 20,
  },
  receiptItems: {
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  receiptItem: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  moreItems: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  receiptTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  youSave: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
  },
});

export default HistoryScreen;


