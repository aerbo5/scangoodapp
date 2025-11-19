import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// Components
import { Header, BottomNavigation, DrawerMenu } from './src/components';

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
} from './src/screens';

// Context
import { LanguageProvider } from './src/context/LanguageContext';

// Utils
import { calculateTotal, getSavings } from './src/utils/helpers';

// API Services
import { scanReceipt, scanBarcode, scanProduct } from './src/services/apiService';

// Constants
import { Colors } from './src/constants';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [menuVisible, setMenuVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanMode, setScanMode] = useState('product');
  const [scannedItems, setScannedItems] = useState([
    {
      name: "SB Ray's BBQ Sauce",
      details: '18 FL Oz - Sweet Baby Ray\'s',
      price: 3.99,
      targetPrice: 2.99,
    },
    {
      name: 'Produce Avocado',
      details: '1 Each - Fresh produce',
      price: 1.25,
      targetPrice: 1.24,
    },
    {
      name: 'Tomatoes',
      details: '0.73 lbs@ $1.99/lb',
      price: 1.45,
      targetPrice: 3.05,
    },
    { name: 'HYDRANGEA CB', details: '', price: 5.0, targetPrice: 3.6 },
    {
      name: 'Picanha',
      details: '3.02 lbs @ $6.99/lb',
      price: 21.11,
      targetPrice: 19.11,
    },
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [storeDetailsData, setStoreDetailsData] = useState(null);
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

  const showScreen = (screen, mode = null, data = null) => {
    fadeAnim.setValue(0);
    setCurrentScreen(screen);
    if (mode) setScanMode(mode);
    if (data) setStoreDetailsData(data);
  };

  const captureImage = async (imageUri = null) => {
    // CameraScreen'de resim zaten çekildi ve state'te saklandı
    // Eğer imageUri parametre olarak gelirse onu kullan
    if (imageUri) {
      processImage(imageUri);
    } else if (cameraRef.current) {
      // Fallback: Eğer imageUri yoksa cameraRef'ten çek
      const photo = await cameraRef.current.takePictureAsync();
      processImage(photo.uri);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (imageUri) => {
    try {
      let result;
      
      if (scanMode === 'receipt') {
        // Call backend API for receipt scanning
        result = await scanReceipt(imageUri);
        if (result.success && result.items) {
          setScannedItems(result.items);
          showScreen('shoppingList');
        }
      } else if (scanMode === 'barcode') {
        // Call backend API for barcode scanning
        result = await scanBarcode(imageUri);
        if (result.success && result.product) {
          setSelectedProduct({
            ...result.product,
            image: imageUri,
          });
          showScreen('productDetails');
        }
      } else {
        // Call backend API for product scanning
        result = await scanProduct(imageUri);
        if (result.success && result.product) {
          setSelectedProduct({
            ...result.product,
            image: imageUri,
          });
          showScreen('productDetails');
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to dummy data if API fails
      if (scanMode === 'receipt') {
        showScreen('shoppingList');
      } else {
        setSelectedProduct({
          name: 'Produce Avocado',
          size: '1 Each',
          image: imageUri,
          stores: [
            {
              name: 'Target',
              address: '1045 5th Street Unit 201, Mia...',
              price: 0.75,
              distance: '8.4 mi',
            },
            {
              name: 'Target',
              address: '11253 Pines Blvd, Hollywood, FL',
              price: 0.79,
              distance: '5.2 mi',
            },
            {
              name: 'Target',
              address: '1750 W 37th Street (Pharmac...',
              price: 0.89,
              distance: '3.1 mi',
            },
          ],
        });
        showScreen('productDetails');
      }
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
          />
        );
      case 'shoppingList':
        return (
          <ShoppingListScreen
            scannedItems={scannedItems}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
            calculateTotal={handleCalculateTotal}
          />
        );
      case 'compare':
        return (
          <CompareScreen
            scannedItems={scannedItems}
            onNavigate={showScreen}
            fadeAnim={fadeAnim}
            getSavings={handleGetSavings}
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
          <BottomNavigation currentScreen={currentScreen} onNavigate={showScreen} />
        )}

        {/* Drawer Menu - Only show if not on login screens */}
        {!isLoginScreen && (
          <DrawerMenu
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onNavigate={showScreen}
            currentScreen={currentScreen}
          />
        )}
    </SafeAreaView>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
