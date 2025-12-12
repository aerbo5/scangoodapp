import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
  Platform,
  ActivityIndicator,
  View,
  Text,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// Components
import { Header, BottomNavigation, DrawerMenu, ScanTypeModal } from './src/components';

// Screens
import {
  LoginScreen,
  PhoneLoginScreen,
  HomeScreen,
  CameraScreen,
  ProductDetailsScreen,
  ShoppingListScreen,
  CompareScreen,
  StoreDetailsScreen,
  TargetComparisonScreen,
  SettingsScreen,
  FavoritesScreen,
  ProfileScreen,
  AccountScreen,
  NotificationsScreen,
  HelpScreen,
  AboutScreen,
  PrivacyScreen,
  TermsScreen,
  HistoryScreen,
  ListScreen,
  SimilarProductsScreen,
} from './src/screens';

// Context
import { LanguageProvider } from './src/context/LanguageContext';

// Utils
import { calculateTotal, getSavings } from './src/utils/helpers';

// API Services
import { scanReceipt, scanBarcode, scanProduct, compareReceiptPrices, compareProductPrices } from './src/services/apiService';
// History Service
import { saveReceiptToHistory, getReceiptHistory } from './src/services/historyService';

// Constants
import { Colors } from './src/constants';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [menuVisible, setMenuVisible] = useState(false);
  const [scanTypeModalVisible, setScanTypeModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanMode, setScanMode] = useState('product');
  // Start with empty list - items will be added from real API calls
  const [scannedItems, setScannedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [storeDetailsData, setStoreDetailsData] = useState(null);
  const [priceComparisonData, setPriceComparisonData] = useState(null);
  const [isComparingPrices, setIsComparingPrices] = useState(false);
  const [receiptHistory, setReceiptHistory] = useState([]);
  const [selectedItemForCompare, setSelectedItemForCompare] = useState(null);
  const [originalReceiptStore, setOriginalReceiptStore] = useState(null); // Store name from receipt (e.g., "Target")
  const [isUploading, setIsUploading] = useState(false); // Loading state for gallery upload
  const [isProcessing, setIsProcessing] = useState(false); // Loading state for receipt/product scanning
  const [processingMessage, setProcessingMessage] = useState('Processing...'); // Loading message
  const cameraRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      try {
        // Web doesn't support camera permissions
        if (Platform.OS === 'web') {
          // For web, we'll use getUserMedia which doesn't need this permission request
          setHasPermission(true);
        } else {
          if (!permission) {
            const result = await requestPermission();
            setHasPermission(result.granted);
          } else {
            setHasPermission(permission.granted);
          }
        }
      } catch (error) {
        console.warn('Camera permission error:', error);
        setHasPermission(false);
      }
    })();
  }, [permission, requestPermission]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentScreen]);

  // Load Google Fonts for web platform
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Check if font is already loaded
      const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
      if (!fontLink) {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Sansita+One&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }, []);

  const showScreen = (screen, mode = null, data = null) => {
    fadeAnim.setValue(0);
    setCurrentScreen(screen);
    if (mode) setScanMode(mode);
    if (data) {
      if (screen === 'productDetails') {
        setSelectedProduct(data);
      } else if (screen === 'similarProducts') {
        setSelectedProduct(data);
      } else if ((screen === 'shoppingList' || screen === 'list') && Array.isArray(data)) {
        // If data is an array, it's items from recent scan
        setScannedItems(data);
      } else {
        setStoreDetailsData(data);
      }
    }
  };

  const captureImage = async (imageUri = null, productType = '') => {
    // CameraScreen'de resim zaten çekildi ve state'te saklandı
    // Eğer imageUri parametre olarak gelirse onu kullan
    if (imageUri) {
      // Direkt resmi analiz et (TypeModal atlandı, type olmadan)
      processImage(imageUri, productType);
    } else if (cameraRef.current) {
      // Fallback: Eğer imageUri yoksa cameraRef'ten çek
      const photo = await cameraRef.current.takePictureAsync();
      processImage(photo.uri, productType);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Resmi kırpmayı kapat - orijinal boyutta kalsın
      quality: 1.0, // Maksimum kalite
    });

    if (!result.canceled) {
      setIsUploading(true); // Show loading indicator
      try {
        await processImage(result.assets[0].uri);
      } catch (error) {
        console.error('Error processing image from gallery:', error);
        Alert.alert('Error', 'Failed to process image. Please try again.');
      } finally {
        setIsUploading(false); // Hide loading indicator
      }
    }
  };

  const processImage = async (imageUri, productType = '') => {
    try {
      setIsProcessing(true); // Show loading indicator
      let result;
      
      if (scanMode === 'receipt') {
        // Call backend API for receipt scanning
        setProcessingMessage('Scanning receipt...');
        console.log('🧾 Scanning receipt...');
        result = await scanReceipt(imageUri);
        console.log('📋 Receipt scan result:', result);
        
        if (result && result.success && result.items && result.items.length > 0) {
          console.log(`✅ Receipt scanned successfully: ${result.items.length} items found`);
          console.log('📦 Items:', result.items);
          
          // Set scanned items FIRST
          setScannedItems(result.items);
          
          // Store the original receipt store name for price comparison
          if (result.store) {
            setOriginalReceiptStore(result.store);
            console.log(`🏪 Original receipt store: ${result.store}`);
          }
          
          // Save to history
          try {
            const historyEntry = {
              items: result.items,
              total: result.youPaid || result.total, // Grand total (what you actually paid)
              amount: result.amount || 0, // Sum of product prices only
              store: result.store,
              address: result.address,
              date: result.date,
              time: result.time,
              youSave: result.youSave,
            };
            await saveReceiptToHistory(historyEntry);
            console.log('💾 Receipt saved to history');
          } catch (historyError) {
            console.warn('⚠️ Failed to save receipt to history:', historyError);
            // Don't block navigation if history save fails
          }
          
          // Store amount and youPaid separately
          const receiptAmount = result.amount || 0; // Sum of product prices
          const receiptYouPaid = result.youPaid || 0; // Grand total from receipt
          
          // Navigate to list screen AFTER state is set
          console.log('🔄 Navigating to list screen...');
          console.log(`  💰 Amount (products): $${receiptAmount.toFixed(2)}`);
          console.log(`  💵 You Paid (grand total): $${receiptYouPaid.toFixed(2)}`);
          setTimeout(() => {
            showScreen('list', null, { amount: receiptAmount, youPaid: receiptYouPaid });
            console.log('✅ Navigation completed');
          }, 100); // Small delay to ensure state is set
        } else {
          console.error('❌ Receipt scan failed:', result?.error || 'No items found', result);
          Alert.alert(
            'Receipt Scan Failed',
            result?.error || 'Could not extract items from receipt. Please try scanning again with better lighting.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Unified scan: Barcode + Product (backend automatically tries barcode first, then Vision API)
        // Call backend API for product scanning with productType
        setProcessingMessage('Scanning product...');
        result = await scanProduct(imageUri, productType);
        console.log('📱 Frontend - Scan Product Response:', JSON.stringify(result, null, 2));
        if (result.success && result.product) {
          // Add type to product name if provided
          // e.g., "Drinking water" + "spring water" = "Spring water"
          let productName = result.product.name;
          if (productType) {
            // Capitalize first letter of type
            const capitalizedType = productType.charAt(0).toUpperCase() + productType.slice(1);
            // If product name is generic (like "Drinking water"), replace with type
            if (productName.toLowerCase().includes('water') || 
                productName.toLowerCase().includes('drinking') ||
                productName.toLowerCase().includes('bottle')) {
              productName = capitalizedType;
            } else {
              productName = `${capitalizedType} ${productName}`.trim();
            }
          }
          
          // Handle productLinks - can be object { exactMatches: [], similarProducts: [] } or array
          let productLinks = result.productLinks;
          if (!productLinks) {
            productLinks = { exactMatches: [], similarProducts: [] };
          } else if (Array.isArray(productLinks)) {
            // Old format: convert to new format
            productLinks = { exactMatches: productLinks, similarProducts: [] };
          }
          // If it's already an object, use it as is
          
          setSelectedProduct({
            ...result.product,
            name: productName,
            image: imageUri,
            productLinks: productLinks, // Add product links from backend
          });
          
          // Debug log
          console.log('📱 Frontend - ProductLinks received:', {
            exactMatches: productLinks.exactMatches?.length || 0,
            similarProducts: productLinks.similarProducts?.length || 0,
            format: Array.isArray(result.productLinks) ? 'array' : 'object'
          });
          showScreen('productDetails');
        } else {
          // Product scan failed or no product found
          console.error('❌ Product scan failed or no product found:', {
            success: result.success,
            hasProduct: !!result.product,
            result: result
          });
          Alert.alert(
            'Product Scan Failed',
            result.error || 'Could not identify product. Please try scanning again with better lighting.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Extract error message from response
      let errorMessage = error.response?.data?.error || error.message || 'Failed to process image. Please try again.';
      const errorStatus = error.response?.status;
      
      // Handle network errors specifically
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.code === 'NETWORK_ERROR') {
        errorMessage = error.userMessage || 'Network error: Cannot connect to backend. Please check your internet connection and try again.';
      }
      
      // Show user-friendly error message
      Alert.alert(
        scanMode === 'receipt' ? 'Receipt Scan Failed' : 'Product Scan Failed',
        errorMessage,
        [
          { 
            text: 'OK',
            onPress: () => {
              // Don't navigate away, let user try again
            }
          }
        ]
      );
      
      // Log detailed error for debugging
      console.error('Error details:', {
        status: errorStatus,
        message: errorMessage,
        response: error.response?.data,
      });
    } finally {
      setIsProcessing(false); // Hide loading indicator
      setProcessingMessage('Processing...'); // Reset message
    }
  };

  const handleCalculateTotal = (items, priceKey = 'price') => {
    return calculateTotal(items, priceKey);
  };

  const handleGetSavings = () => {
    return getSavings(scannedItems);
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'phoneLogin':
        return (
          <PhoneLoginScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'home':
        return <HomeScreen onNavigate={showScreen} fadeAnim={fadeAnim} />;
      case 'camera':
        return (
          <CameraScreen
            hasPermission={hasPermission}
            scanMode={scanMode}
            setScanMode={setScanMode}
            cameraRef={cameraRef}
            onCapture={captureImage}
            onPickFromGallery={pickImageFromGallery}
            onBack={() => showScreen('home')}
          />
        );
      case 'productDetails':
        return (
          <ProductDetailsScreen
            selectedProduct={selectedProduct}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
            onAddToList={(item) => {
              setScannedItems(prev => [...prev, item]);
            }}
          />
        );
      case 'shoppingList':
        return (
          <ShoppingListScreen
            scannedItems={scannedItems}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
            calculateTotal={handleCalculateTotal}
            onComparePrices={async () => {
              if (scannedItems.length === 0) {
                Alert.alert('No Items', 'Please scan a receipt first to compare prices.');
                return;
              }
              
              setIsComparingPrices(true);
              try {
                console.log('🔍 Starting price comparison for', scannedItems.length, 'items...');
                console.log('📦 Items to compare:', scannedItems.map(i => i.name));
                console.log('🏪 Original store:', originalReceiptStore);
                const comparison = await compareReceiptPrices(scannedItems);
                console.log('✅ Comparison result received:', {
                  success: comparison.success,
                  storesCount: comparison.stores?.length || 0,
                  originalTotal: comparison.originalTotal,
                  cheapestTotal: comparison.cheapestTotal,
                });
                // Add original store name to comparison data
                setPriceComparisonData({
                  ...comparison,
                  originalStore: originalReceiptStore || 'your store',
                });
                showScreen('compare');
              } catch (error) {
                console.error('Error comparing prices:', error);
                Alert.alert(
                  'Error',
                  error.message || 'Failed to compare prices. Please try again.',
                  [{ text: 'OK' }]
                );
              } finally {
                setIsComparingPrices(false);
              }
            }}
            isComparingPrices={isComparingPrices}
            onCompareProductPrice={async (item) => {
              try {
                setSelectedItemForCompare(item);
                console.log(`🔍 Comparing prices for single product: ${item.name}`);
                const comparisonResult = await compareProductPrices(item.name);
                console.log('✅ Product comparison result:', comparisonResult);
                setPriceComparisonData({
                  ...comparisonResult,
                  originalPrice: item.price,
                  productName: item.name,
                  isSingleProduct: true, // Flag to indicate single product comparison
                });
                showScreen('compare');
              } catch (error) {
                console.error('Error comparing product prices:', error);
                Alert.alert('Error', 'Failed to compare prices: ' + error.message);
              }
            }}
          />
        );
      case 'compare':
        return (
          <CompareScreen
            scannedItems={scannedItems}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
            getSavings={handleGetSavings}
            priceComparisonData={priceComparisonData}
          />
        );
      case 'storeDetails':
        return (
          <StoreDetailsScreen
            store={storeDetailsData?.store}
            scannedItems={storeDetailsData?.scannedItems || scannedItems}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'targetComparison':
        return (
          <TargetComparisonScreen
            scannedItems={scannedItems}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
            calculateTotal={handleCalculateTotal}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'favorites':
        return (
          <FavoritesScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'account':
        return (
          <AccountScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'help':
        return (
          <HelpScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'about':
        return (
          <AboutScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'privacy':
        return (
          <PrivacyScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'terms':
        return (
          <TermsScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
          />
        );
      case 'list':
        return (
          <ListScreen
            scannedItems={scannedItems}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
            calculateTotal={handleCalculateTotal}
            originalTotal={priceComparisonData?.originalTotal}
            youSave={handleGetSavings()}
            receiptAmount={priceComparisonData?.receiptAmount}
            receiptYouPaid={priceComparisonData?.receiptYouPaid}
          />
        );
      case 'similarProducts':
        return (
          <SimilarProductsScreen
            product={selectedProduct}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
            onAddToList={(item) => {
              setScannedItems(prev => [...prev, item]);
            }}
          />
        );
      default:
        return <HomeScreen onNavigate={showScreen} fadeAnim={fadeAnim} />;
    }
  };

  const isLoginScreen = currentScreen === 'login' || currentScreen === 'phoneLogin';

  return (
    <LanguageProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
        {/* Header - Only show if not on login screens */}
        {!isLoginScreen && (
          <Header
            onMenuPress={() => setMenuVisible(true)}
            onProfilePress={() => showScreen('profile')}
          />
        )}

      {/* Content */}
      {renderScreen()}

        {/* Bottom Navigation - Only show if not on login screens */}
        {!isLoginScreen && currentScreen !== 'camera' && (
          <BottomNavigation 
            currentScreen={currentScreen} 
            onNavigate={showScreen}
            onScanPress={() => setScanTypeModalVisible(true)}
          />
        )}

        {/* Drawer Menu - Only show if not on login screens */}
        {!isLoginScreen && (
          <DrawerMenu
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onNavigate={showScreen}
            currentScreen={currentScreen}
            onScanPress={() => {
              setMenuVisible(false);
              setScanTypeModalVisible(true);
            }}
          />
        )}

        {/* Scan Type Modal */}
        {!isLoginScreen && (
          <ScanTypeModal
            visible={scanTypeModalVisible}
            onSelectReceipt={() => {
              setScanTypeModalVisible(false);
              showScreen('camera', 'receipt');
            }}
            onSelectProduct={() => {
              setScanTypeModalVisible(false);
              showScreen('camera', 'product');
            }}
            onCancel={() => setScanTypeModalVisible(false)}
          />
        )}
    </SafeAreaView>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGreen,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
