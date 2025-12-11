import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@scan_history';

// Save a receipt scan to history
export const saveReceiptToHistory = async (receiptData) => {
  try {
    const history = await getReceiptHistory();
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...receiptData,
    };
    history.unshift(newEntry); // Add to beginning
    // Keep only last 100 receipts
    const limitedHistory = history.slice(0, 100);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    console.log('✅ Receipt saved to history');
    return newEntry;
  } catch (error) {
    console.error('Error saving receipt to history:', error);
    return null;
  }
};

// Get all receipt history
export const getReceiptHistory = async () => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting receipt history:', error);
    return [];
  }
};

// Delete a receipt from history
export const deleteReceiptFromHistory = async (receiptId) => {
  try {
    const history = await getReceiptHistory();
    const filteredHistory = history.filter(item => item.id !== receiptId);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
    return true;
  } catch (error) {
    console.error('Error deleting receipt from history:', error);
    return false;
  }
};

// Clear all history
export const clearReceiptHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing receipt history:', error);
    return false;
  }
};





