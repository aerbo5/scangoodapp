const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Load environment variables from Firebase config (v2 uses secrets)
// For now, we'll use process.env directly (set via Firebase Console)
// process.env variables are automatically available in Firebase Functions

// Services
const visionService = require('./services/visionService');
const productService = require('./services/productService');
const storeService = require('./services/storeService');
const productSearchService = require('./services/productSearchService');
const publixScraperService = require('./services/publixScraperService');
const aldiScraperService = require('./services/aldiScraperService');

const app = express();

// Initialize Vision service
visionService.initializeVision();

// Middleware
// CORS - Firebase Hosting automatically handles CORS, but we allow all origins for flexibility
app.use(cors({
  origin: true, // Allow all origins (Firebase Hosting handles CORS)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Scan Good API is running', version: '1.0.0', platform: 'Firebase Cloud Functions' });
});

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Scan Good API is running', endpoints: ['/api/health', '/api/scan/receipt', '/api/scan/barcode', '/api/scan/product', '/api/compare/prices'] });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Scan Good API is running' });
});

// Debug endpoint - Check environment variables and API status
app.get('/api/debug/env', (req, res) => {
  const envStatus = {
    // Check which APIs are configured
    azureVision: {
      configured: !!(process.env.AZURE_COMPUTER_VISION_KEY && process.env.AZURE_COMPUTER_VISION_ENDPOINT),
      hasKey: !!process.env.AZURE_COMPUTER_VISION_KEY,
      hasEndpoint: !!process.env.AZURE_COMPUTER_VISION_ENDPOINT,
      endpoint: process.env.AZURE_COMPUTER_VISION_ENDPOINT ? process.env.AZURE_COMPUTER_VISION_ENDPOINT.substring(0, 30) + '...' : null,
    },
    googleCloudVision: {
      configured: !!(process.env.GOOGLE_CLOUD_VISION_API_KEY || process.env.GOOGLE_CLOUD_VISION_KEY_FILE),
      hasApiKey: !!process.env.GOOGLE_CLOUD_VISION_API_KEY,
      hasKeyFile: !!process.env.GOOGLE_CLOUD_VISION_KEY_FILE,
    },
    geminiVision: {
      configured: !!process.env.GOOGLE_GEMINI_API_KEY,
      hasKey: !!process.env.GOOGLE_GEMINI_API_KEY,
    },
    googleCustomSearch: {
      configured: !!(process.env.GOOGLE_CUSTOM_SEARCH_API_KEY && process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID),
      hasApiKey: !!process.env.GOOGLE_CUSTOM_SEARCH_API_KEY,
      hasEngineId: !!process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
    },
    // Server info
    server: {
      platform: 'Firebase Cloud Functions',
      nodeEnv: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
    },
  };
  
  res.json({
    success: true,
    environment: envStatus,
    message: 'Environment variables status check',
  });
});

// Import all routes from backend/server.js
// Copy all route handlers here (lines 102-1276 from backend/server.js)
// We'll use a script to copy them, but for now, let's add the main routes manually

// Export as Cloud Function (v2 API)
setGlobalOptions({ maxInstances: 10 });

exports.api = onRequest({
  timeoutSeconds: 540, // 9 minutes (max for paid tier)
  memory: '512MB',
  maxInstances: 10,
}, app);
