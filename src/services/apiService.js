import axios from 'axios';
import { Platform } from 'react-native';

// API Base URL Configuration
// Development: ngrok or localhost
// Production: Netlify Functions proxy or direct backend URL

const getApiBaseUrl = () => {
  // Priority 1: Check if REACT_APP_API_URL is set (Netlify environment variable)
  if (process.env.REACT_APP_API_URL) {
    console.log('🌐 Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Priority 2: Check if we're on Netlify (production)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If on Netlify, use Railway backend directly (not Functions proxy)
    if (hostname.includes('netlify.app')) {
      console.log('🌐 Detected Netlify, using Railway backend URL');
      return 'https://scangoodapp-production.up.railway.app/api';
    }
  }
  
  // Priority 3: Development mode
  if (__DEV__) {
    // Web platform: use Railway backend URL (production backend)
    if (Platform.OS === 'web') {
      console.log('🌐 Development mode (web), using Railway backend URL');
      return 'https://scangoodapp-production.up.railway.app/api';
    }
    
    // Mobile platform (Expo Go): use ngrok
    console.log('🌐 Development mode (mobile), using ngrok URL');
    return 'https://diagenetic-berry-pompously.ngrok-free.dev/api';
  }
  
  // Fallback: Railway backend URL
  console.log('🌐 Using fallback Railway backend URL');
  return 'https://scangoodapp-production.up.railway.app/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    console.log('🔗 Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    console.error('❌ Request Config:', error.config);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      message: error.message,
    });
    
    // More detailed error for connection issues
    if (error.message === 'Network Error' || error.code === 'NETWORK_ERROR') {
      console.error('🔴 Network Error Detected!');
      console.error('🔴 Check if:');
      console.error('   1. Backend is running on http://localhost:3001');
      console.error('   2. Ngrok is running and URL is correct');
      console.error('   3. apiService.js has correct ngrok URL');
      console.error('   4. URL format: https://xxxxx.ngrok-free.app/api');
    }
    
    return Promise.reject(error);
  }
);

// Scan Receipt
// Compare prices for a single product
export const compareProductPrices = async (productName) => {
  try {
    const response = await api.post('/compare/product-prices', {
      productName: productName,
    }, {
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error('Error comparing product prices:', error);
    throw error;
  }
};

export const scanReceipt = async (imageUri) => {
  try {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('image', {
      uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
      type: type,
      name: filename || 'receipt.jpg',
    });

    const response = await api.post('/scan/receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error scanning receipt:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    // Throw error instead of returning dummy data - let the UI handle it
    throw error;
  }
};

// Scan Barcode
export const scanBarcode = async (imageUri) => {
  try {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('image', {
      uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
      type: type,
      name: filename || 'barcode.jpg',
    });

    const response = await api.post('/scan/barcode', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error scanning barcode:', error);
    // Return error instead of dummy data
    throw error;
  }
};

// Scan Product
export const scanProduct = async (imageUri, productType = '') => {
  try {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('image', {
      uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
      type: type,
      name: filename || 'product.jpg',
    });

    // Add product type if provided (e.g., "spring water", "organic")
    if (productType) {
      formData.append('productType', productType);
    }

    const response = await api.post('/scan/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error scanning product:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    // Return error instead of dummy data
    throw error;
  }
};

// Compare Prices (receipt items)
export const compareReceiptPrices = async (items) => {
  try {
    const response = await api.post('/compare/receipt-prices', { items }, {
      timeout: 60000, // 60 second timeout for multiple product searches
    });
    return response.data;
  } catch (error) {
    console.error('Error comparing receipt prices:', error);
    throw error;
  }
};

// Search Products
export const searchProducts = async (query) => {
  try {
    const response = await api.get('/products/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get Nearby Stores
export const getNearbyStores = async (latitude, longitude, radius = 10) => {
  try {
    const response = await api.get('/stores/nearby', {
      params: { lat: latitude, lng: longitude, radius },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting nearby stores:', error);
    throw error;
  }
};

export default api;

