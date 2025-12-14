const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Services
const visionService = require('./services/visionService');
const productService = require('./services/productService');
const storeService = require('./services/storeService');
const productSearchService = require('./services/productSearchService');
const publixScraperService = require('./services/publixScraperService');
const aldiScraperService = require('./services/aldiScraperService');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Vision service
visionService.initializeVision();

// Middleware
// CORS configuration - Allow Vercel, local development, Render, and ngrok
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:3000',
    /\.vercel\.app$/,   // Allow all Vercel subdomains
    /\.render\.com$/,   // Allow Render deployments
    /\.ngrok-free\.app$/,  // Allow ngrok free URLs
    /\.ngrok\.io$/,        // Allow ngrok.io URLs
    /\.ngrok\.app$/,       // Allow ngrok.app URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
// Increased limit for long receipts (up to 20MB)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit (for long receipts)
});

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Scan Good API is running', version: '1.0.0' });
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
      port: process.env.PORT || 3001,
      nodeEnv: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    },
  };
  
  res.json({
    success: true,
    environment: envStatus,
    message: 'Environment variables status check',
  });
});

// Scan Receipt - OCR processing with Gemini AI fallback
app.post('/api/scan/receipt', upload.single('image'), async (req, res) => {
  try {
    let items = null;
    let receiptText = null;
    let receiptDate = null;
    let receiptTime = null;
    let storeName = null;
    let storeAddress = null;
    let receiptTotal = null;
    let youSaveAmount = null;
    let ignoredElements = null;
    let itemsAmount = 0; // Sum of product prices only (for "Amount" display)
    let parseResult = null;
    let scanSource = 'ocr'; // Track which method was used

    console.log('🧾 Receipt scan request received');
    
    // Try scanning if image is provided
    if (req.file && req.file.buffer) {
      console.log('📊 Image file info:', {
        size: req.file.buffer.length,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
      });
      
      // METHOD 1: Try Gemini AI with JSON mode first (more accurate for receipts)
      console.log('🤖 Trying Gemini AI for receipt scanning...');
      const geminiResult = await visionService.scanReceiptWithGemini(req.file.buffer);
      
      if (geminiResult && geminiResult.items && geminiResult.items.length > 0) {
        console.log('✅ Gemini AI successfully extracted items');
        items = geminiResult.items;
        storeName = geminiResult.store;
        receiptDate = geminiResult.date;
        itemsAmount = geminiResult.amount || 0;
        scanSource = 'gemini';
        ignoredElements = { paymentInfo: [], storeInfo: [], metadata: [], footerCoupons: [], nonItem: [], unclear: [] };
      } else {
        // METHOD 2: Fallback to OCR + parseReceiptText
        console.log('⚠️ Gemini failed or returned no items, falling back to OCR...');
        console.log('📸 Extracting text from receipt image with OCR...');
        receiptText = await visionService.extractTextFromImage(req.file.buffer);
        
        if (receiptText) {
          console.log('✅ OCR text extracted, length:', receiptText.length);
          parseResult = visionService.parseReceiptText(receiptText);
          if (parseResult) {
            items = parseResult.items;
            receiptDate = parseResult.date;
            receiptTime = parseResult.time;
            storeName = parseResult.store;
            storeAddress = parseResult.address;
            receiptTotal = parseResult.youPaid; // Receipt grand total (TOTAL, GRAND TOTAL)
            itemsAmount = parseResult.amount || 0; // Sum of product prices only (for "Amount" display)
            youSaveAmount = parseResult.youSave; // "You save" amount
            ignoredElements = parseResult.ignoredElements; // SECTION B: Ignored elements
            scanSource = 'ocr';
          }
        } else {
          console.log('⚠️ No text extracted from receipt via OCR');
        }
      }
    } else {
      console.log('⚠️ No image file provided');
    }

    // No fallback dummy data - return error if OCR fails
    if (!items || items.length === 0) {
      console.log('❌ Could not extract items from receipt');
      const errorMessage = receiptText 
        ? 'Could not parse items from receipt text. Please try scanning again with better lighting and make sure the receipt is clearly visible.'
        : 'Could not extract text from receipt image. Please check:\n1. Vision API is configured (GOOGLE_CLOUD_VISION_API_KEY, AZURE_COMPUTER_VISION_KEY, etc.)\n2. Image is clear and readable\n3. Receipt is properly lit and in focus';
      
      return res.status(404).json({
        success: false,
        error: errorMessage,
        receiptText: receiptText ? receiptText.substring(0, 500) : null, // Return first 500 chars for debugging
        debug: {
          hasReceiptText: !!receiptText,
          receiptTextLength: receiptText ? receiptText.length : 0,
        },
      });
    }

    // Filter items: Remove non-grocery items if store is not a grocery store
    const groceryStores = [
      'walmart', 'target', 'publix', 'whole foods', 'kroger', 'safeway', 
      'winn-dixie', 'aldi', 'costco', 'sams club', 'trader joes', 'wegmans',
      'stop & shop', 'giant', 'food lion', 'harris teeter', 'heb', 'ralphs',
      'vons', 'albertsons', 'fred meyer', 'qfc', 'king soopers', 'smiths'
    ];
    
    const isGroceryStore = storeName && groceryStores.some(store => 
      storeName.toLowerCase().includes(store.toLowerCase())
    );
    
    // Non-grocery item patterns (restaurant, fast food, prepared foods, etc.)
    const nonGroceryPatterns = [
      /^(hamburger|burger|cheeseburger|big mac|whopper|quarter pounder)/i,
      /^(pizza|pepperoni|margherita|hawaiian|meat lovers)/i,
      /^(fries|french fries|onion rings|mozzarella sticks)/i,
      /^(chicken nuggets|chicken tenders|chicken wings|buffalo wings)/i,
      /^(sandwich|sub|hoagie|grinder|hero|wrap|panini)/i,
      /^(taco|burrito|quesadilla|nachos|enchilada)/i,
      /^(sushi|sashimi|roll|maki|nigiri)/i,
      /^(salad bar|hot bar|deli|prepared|ready to eat)/i,
      /^(coffee|latte|cappuccino|espresso|frappuccino)/i,
      /^(soda|fountain drink|soft drink|energy drink)/i,
      /^(beer|wine|liquor|alcohol|spirits|cocktail)/i,
      /^(gas|gasoline|fuel|car wash|auto service)/i,
      /^(tip|gratuity|service charge|delivery fee)/i,
      /^(appetizer|entree|dessert|soup|salad)/i,
      /^(combo|meal|value meal|happy meal)/i,
    ];
    
    // Filter items based on store type
    let filteredItems = items;
    if (!isGroceryStore) {
      // If not a grocery store, filter out non-grocery items (keep only grocery items)
      console.log(`⚠️  Store "${storeName}" is not a recognized grocery store`);
      console.log(`🔍 Filtering items to show only grocery products...`);
      const beforeCount = filteredItems.length;
      filteredItems = filteredItems.filter(item => {
        const itemName = item.name.toLowerCase();
        // Check if item matches non-grocery patterns
        const isNonGrocery = nonGroceryPatterns.some(pattern => pattern.test(itemName));
        if (isNonGrocery) {
          console.log(`  ❌ Filtered out non-grocery item: "${item.name}"`);
          return false;
        }
        return true;
      });
      const afterCount = filteredItems.length;
      console.log(`  📊 Filtered ${beforeCount} items → ${afterCount} items (removed ${beforeCount - afterCount} non-grocery items)`);
    } else {
      // If grocery store, still filter out obvious non-grocery items (restaurant items, etc.)
      const beforeCount = filteredItems.length;
      filteredItems = filteredItems.filter(item => {
        const itemName = item.name.toLowerCase();
        const isNonGrocery = nonGroceryPatterns.some(pattern => pattern.test(itemName));
        if (isNonGrocery) {
          console.log(`  ❌ Filtered out non-grocery item from grocery store: "${item.name}"`);
          return false;
        }
        return true;
      });
      const afterCount = filteredItems.length;
      if (beforeCount !== afterCount) {
        console.log(`  📊 Filtered ${beforeCount} items → ${afterCount} items (removed ${beforeCount - afterCount} non-grocery items)`);
      }
    }
    
    // Update items to filtered items
    items = filteredItems;
    
    // Calculate amount (sum of product prices only) if not already set from parseResult
    if (itemsAmount === 0) {
      itemsAmount = items.reduce((sum, item) => sum + ((item.totalLinePrice || item.price || 0) * (item.quantity || 1)), 0);
    }
    // You Paid = Amount (before tax price) - same as amount
    const youPaid = itemsAmount;
    
    console.log(`✅ Receipt parsed successfully: ${items.length} items`);
    console.log(`  💰 Amount (products total): $${itemsAmount.toFixed(2)}`);
    console.log(`  💵 You paid (before tax): $${youPaid.toFixed(2)}`);
    if (youSaveAmount) {
      console.log(`  💰 You save: $${youSaveAmount.toFixed(2)}`);
    }
    if (storeName) console.log(`  🏪 Store: ${storeName}`);
    if (storeAddress) console.log(`  📍 Address: ${storeAddress}`);
    if (receiptDate) console.log(`  📅 Date: ${receiptDate}`);
    if (receiptTime) console.log(`  🕐 Time: ${receiptTime}`);
    
    // Get receipt summary from parse result
    const receiptSummary = parseResult?.receiptSummary || {
      subtotal: null,
      tax: null,
      totalSales: null,
      totalDue: null,
      total: parseFloat(youPaid.toFixed(2)),
      youSave: youSaveAmount ? parseFloat(youSaveAmount.toFixed(2)) : null,
    };
    
    res.json({
      success: true,
      items: items, // SECTION A: Grocery Items Only (Clean List)
      ignoredElements: ignoredElements || { // SECTION B: Ignored Elements
        paymentInfo: [],
        storeInfo: [],
        metadata: [],
        footerCoupons: [],
        nonItem: [],
        unclear: [],
      },
      amount: parseFloat(itemsAmount.toFixed(2)), // Sum of product prices only (for "Amount" display)
      youPaid: parseFloat(youPaid.toFixed(2)), // Receipt grand total (TOTAL, GRAND TOTAL) - what you actually paid
      youSave: youSaveAmount ? parseFloat(youSaveAmount.toFixed(2)) : null,
      store: storeName || 'Unknown Store',
      address: storeAddress || null,
      date: receiptDate || null,
      time: receiptTime || null,
      ocrUsed: !!receiptText,
      scanSource: scanSource, // 'gemini' or 'ocr' - which method was used
      itemCount: items.length,
      receiptSummary: receiptSummary, // All financial information (subtotal, tax, total sales, total due, total, you save) in one place
    });
  } catch (error) {
    console.error('Error scanning receipt:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Scan Barcode - Product lookup
app.post('/api/scan/barcode', upload.single('image'), async (req, res) => {
  try {
    let barcode = null;
    let product = null;

    // Try barcode detection if image is provided
    if (req.file && req.file.buffer) {
      barcode = await visionService.detectBarcode(req.file.buffer);
      if (barcode) {
        product = await productService.lookupProductByBarcode(barcode);
      }
    }

    // No fallback dummy product - if product not found, return error
    if (!product) {
      return res.status(404).json({
        success: false,
        error: barcode 
          ? `Product with barcode ${barcode} not found in database.`
          : 'Barcode not detected. Please try scanning again.',
      });
    }
    
    res.json({
      success: true,
      product: product,
      barcodeDetected: !!barcode,
    });
  } catch (error) {
    console.error('Error scanning barcode:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Scan Product - Unified scan (Barcode + Vision API) with internet product links
// Automatically tries barcode first, then falls back to Vision API
app.post('/api/scan/product', upload.single('image'), async (req, res) => {
  try {
    let labels = null;
    let product = null;
    let productName = null;
    let barcode = null;
    let aiProductInfoForScraper = null; // Store AI product info for Aldi scraper
    let geminiPriceComparison = null; // Store Gemini price comparison results
    const productType = req.body.productType || ''; // Get product type from form data (e.g., "spring water")

    // Try image recognition if image is provided
    if (req.file && req.file.buffer) {
      console.log('📸 Processing image, size:', req.file.buffer.length, 'bytes');
      
      // Check API keys at the beginning
      const hasGeminiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
      const hasVisionKey = !!(process.env.GOOGLE_CLOUD_VISION_API_KEY || process.env.GOOGLE_CLOUD_VISION_KEY_FILE);
      
      // NEW: Try Gemini JSON mode first for product recognition + price comparison
      if (hasGeminiKey) {
        console.log('🤖 Trying Gemini AI (JSON mode) for product recognition + price comparison...');
        const geminiResult = await visionService.scanProductWithGemini(req.file.buffer);
        
        if (geminiResult && geminiResult.product && geminiResult.product.name) {
          console.log('✅ Gemini AI successfully identified product with price comparison');
          productName = geminiResult.product.name;
          aiProductInfoForScraper = {
            brand: geminiResult.product.brand,
            product: geminiResult.product.variant || geminiResult.product.name,
            fullName: geminiResult.product.fullName,
            size: geminiResult.product.size,
          };
          geminiPriceComparison = geminiResult.priceComparison;
          
          // Create product object from Gemini result
          product = {
            brand: geminiResult.product.brand,
            name: geminiResult.product.name,
            size: geminiResult.product.size || '1 Each',
            weight: geminiResult.product.size || '1 Each',
            category: geminiResult.product.variant || 'General',
            labels: [geminiResult.product.brand, geminiResult.product.variant].filter(Boolean),
            stores: null,
            price: geminiResult.priceComparison?.cheapest?.price || null,
          };
          
          console.log('   Product:', productName);
          console.log('   Brand:', geminiResult.product.brand || 'N/A');
          console.log('   Size:', geminiResult.product.size || 'N/A');
          if (geminiPriceComparison?.cheapest) {
            console.log('   Cheapest:', geminiPriceComparison.cheapest.store, '@', '$' + geminiPriceComparison.cheapest.price);
          }
        }
      }
      
      // STEP 1: Try barcode detection if Gemini didn't find product
      if (!product) {
        console.log('🔍 Step 1: Trying barcode detection...');
        barcode = await visionService.detectBarcode(req.file.buffer);
        
        if (barcode) {
          console.log('✅ Barcode detected:', barcode);
          // Try to find product by barcode (async call to Open Food Facts API)
          product = await productService.lookupProductByBarcode(barcode);
          if (product) {
            console.log('✅ Product found by barcode:', product.name);
            productName = product.name;
          } else {
            console.log('⚠️ Barcode detected but product not found in database, falling back to Vision API');
            barcode = null; // Reset to try Vision API
          }
        } else {
          console.log('ℹ️  No barcode detected, using Vision API');
        }
      }
      
      // STEP 2: If still no product, try old AI-powered recognition (fallback)
      if (!product) {
        if (hasGeminiKey) {
          console.log('🔍 Step 2a: Trying legacy AI-powered product recognition (Gemini Vision)...');
          console.log('   📝 Image size:', req.file.buffer.length, 'bytes');
        } else {
          console.log('⚠️ Step 2a: Gemini API key not configured, skipping AI recognition');
        }
        
        const aiProductInfo = hasGeminiKey ? await visionService.detectProductWithAI(req.file.buffer) : null;
        
        // Store AI product info for later use in Aldi scraper
        if (aiProductInfo) {
          aiProductInfoForScraper = aiProductInfo;
        }
        
        if (aiProductInfo && aiProductInfo.fullName && aiProductInfo.fullName !== 'Unknown') {
          productName = aiProductInfo.fullName;
          console.log('✅ AI identified product:', productName);
          console.log('   Brand:', aiProductInfo.brand);
          console.log('   Product:', aiProductInfo.product);
          console.log('   Size:', aiProductInfo.size || 'Unknown');
          
          // Store AI info for scraper
          aiProductInfoForScraper = aiProductInfo;
          
          // Extract size from AI result, default to "1 Each" if not found
          const productSize = (aiProductInfo.size && aiProductInfo.size !== 'Unknown') 
            ? aiProductInfo.size 
            : '1 Each';
          
          // Create product object from AI result
          // Use product details (not fullName) for name if available, otherwise use fullName
          const productNameForDisplay = (aiProductInfo.product && aiProductInfo.product !== 'Unknown') 
            ? aiProductInfo.product 
            : productName;
          
          product = {
            brand: (aiProductInfo.brand && aiProductInfo.brand !== 'Unknown') ? aiProductInfo.brand : null,
            name: productNameForDisplay,
            size: productSize,
            weight: productSize, // Also include as weight for compatibility
            category: aiProductInfo.product || 'General',
            labels: [
              aiProductInfo.brand && aiProductInfo.brand !== 'Unknown' ? aiProductInfo.brand : null,
              aiProductInfo.product && aiProductInfo.product !== 'Unknown' ? aiProductInfo.product : null,
            ].filter(Boolean),
            stores: null, // Will be populated by web scraping (store name)
            price: null, // Will be populated by web scraping
          };
          console.log('💡 Created product object from AI result');
          console.log('   Brand:', product.brand || 'N/A');
          console.log('   Name:', product.name);
          console.log('   Size/Weight:', product.size);
        } else {
          if (hasGeminiKey) {
            console.log('⚠️ AI could not identify product, trying OCR...');
          }
          
          // STEP 2b: Try OCR (to get brand/product name from text)
          console.log('🔍 Step 2b: Trying OCR to extract text from product...');
          if (!hasVisionKey) {
            console.log('   ⚠️ Google Vision API key not configured - OCR will not work');
          }
          let ocrText = await visionService.extractTextFromImage(req.file.buffer);
        
        // Extract product name, brand, and size from OCR text
        if (ocrText) {
          console.log('📝 OCR Text extracted:', ocrText.substring(0, 500)); // First 500 chars
          
          const textLines = ocrText.split('\n').filter(line => line.trim().length > 0);
          let extractedBrand = null;
          let extractedProduct = null;
          let extractedSize = null;
          
          // Generic terms to filter out
          const genericTerms = [
            'Solution', 'Cylinder', 'Plastic', 'Bottle', 'Liquid', 'Water', 'Product',
            'Created', 'Created By', 'By', 'France', 'FRANCE', 'Ultimate', 'Unflavored',
            'Sparkling', 'SPARKLING', 'WATER', 'Label', 'Ingredients', 'Nutrition',
            'Serving', 'Size', 'Fl Oz', 'ML', 'L', 'Oz', 'Net', 'Weight', 'Volume',
            'KEEP FROZEN', 'READY TO COOK', 'PER 1 PATTY', 'CALORIES', 'SAT FAT', 'SODIUM', 'TOTAL SUGARS'
          ];
          
          // Look for brand name (usually at top, all caps or title case, 1-3 words)
          for (const line of textLines) {
            const trimmed = line.trim();
            const words = trimmed.split(/\s+/).filter(w => w.length > 0);
            
            // Brand pattern: 1-3 words, mostly capitalized, not generic
            if (words.length >= 1 && words.length <= 3) {
              const allCaps = words.every(w => /^[A-Z]+$/.test(w));
              const titleCase = words.every(w => /^[A-Z][a-z]*$/.test(w));
              const nameLower = trimmed.toLowerCase();
              const isGeneric = genericTerms.some(term => nameLower.includes(term.toLowerCase()));
              
              if ((allCaps || titleCase) && !isGeneric && trimmed.length >= 3 && trimmed.length <= 40) {
                // Check if it looks like a brand (common brand patterns)
                if (trimmed.includes("'S") || trimmed.includes("'S RANCH") || 
                    trimmed.includes("RANCH") || trimmed.includes("BRAND") ||
                    /^[A-Z][A-Z\s&']+$/.test(trimmed) || /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/.test(trimmed)) {
                  extractedBrand = trimmed;
                  console.log('🏷️  Brand extracted from OCR:', extractedBrand);
                  break;
                }
              }
            }
          }
          
          // Look for product name (longer text, includes product type)
          const productKeywords = ['burger', 'patties', 'beef', 'chicken', 'pork', 'fish', 'cheese', 
                                   'milk', 'bread', 'pasta', 'rice', 'soup', 'cereal', 'yogurt', 
                                   'juice', 'water', 'coffee', 'tea', 'soda', 'snack', 'cookie', 
                                   'cracker', 'chip', 'frozen', 'fresh', 'black', 'angus', 'bacon', 
                                   'cheddar', 'ranch'];
          
          for (const line of textLines) {
            const trimmed = line.trim();
            const nameLower = trimmed.toLowerCase();
            const isGeneric = genericTerms.some(term => nameLower.includes(term.toLowerCase()));
            
            // Product pattern: 3+ words, contains product keywords, not generic
            if (trimmed.length >= 10 && trimmed.length <= 80 && !isGeneric) {
              const hasProductKeyword = productKeywords.some(keyword => nameLower.includes(keyword));
              const wordCount = trimmed.split(/\s+/).length;
              
              if (hasProductKeyword && wordCount >= 3) {
                // Check if it's a product description (not just a single word)
                if (!extractedProduct || trimmed.length > extractedProduct.length) {
                  extractedProduct = trimmed;
                  console.log('📦 Product extracted from OCR:', extractedProduct);
                }
              }
            }
          }
          
          // Look for size/weight (patterns like "2 lb", "32 OZ", "6 count", "6 - 1/3 POUND")
          const sizePatterns = [
            /\b(\d+\s*-\s*\d+\/\d+\s*POUND?\s*PATTIES?)\b/i,
            /\b(\d+\s*PATTIES?)\b/i,
            /\b(\d+\s*(?:lb|lbs|oz|fl\s*oz|ml|g|kg|count))\b/i,
            /\b(NET\s*WT\s*\d+\s*OZ\s*\([^)]+\))\b/i,
          ];
          
          for (const line of textLines) {
            for (const pattern of sizePatterns) {
              const match = line.match(pattern);
              if (match) {
                extractedSize = match[1];
                console.log('⚖️  Size extracted from OCR:', extractedSize);
                break;
              }
            }
            if (extractedSize) break;
          }
          
          // Combine brand and product if found
          if (extractedBrand || extractedProduct) {
            if (extractedBrand && extractedProduct) {
              productName = `${extractedBrand} ${extractedProduct}`;
            } else if (extractedProduct) {
              productName = extractedProduct;
            } else if (extractedBrand) {
              productName = extractedBrand;
            }
            
            console.log('✅ Product name from OCR:', productName);
            
            // Create or update product object
            if (!product) {
              console.log('💡 Creating product from OCR-extracted information');
              product = {
                brand: extractedBrand,
                name: extractedProduct || productName,
                size: extractedSize || '1 Each',
                weight: extractedSize || '1 Each',
                category: 'General',
                labels: [],
                stores: null,
                price: null,
              };
            } else {
              // Update existing product with OCR data
              if (extractedBrand && !product.brand) {
                product.brand = extractedBrand;
              }
              if (extractedProduct && (!product.name || product.name.length < extractedProduct.length)) {
                product.name = extractedProduct;
              }
              if (extractedSize && product.size === '1 Each') {
                product.size = extractedSize;
                product.weight = extractedSize;
              }
            }
            
            // Store for scraper
            if (extractedBrand || extractedProduct) {
              aiProductInfoForScraper = {
                brand: extractedBrand || 'Unknown',
                product: extractedProduct || productName,
                fullName: productName,
                size: extractedSize || 'Unknown',
              };
            }
          } else {
            console.log('⚠️ No valid product information found in OCR text');
          }
            }
          }
        }
        
        // STEP 2c: Also try Vision API label detection (as fallback or supplement)
        if (!productName) {
          console.log('🔍 Step 2c: Trying Vision API label detection...');
          if (!hasVisionKey) {
            console.log('   ⚠️ Google Vision API key not configured - Label detection will not work');
          }
        labels = await visionService.detectProductLabels(req.file.buffer);
        if (labels && labels.length > 0) {
        console.log('✅ Labels detected:', labels.map(l => l.description).join(', '));
        
        // If we don't have product name from OCR, use labels
        if (!productName) {
          // Get product name from labels for internet search (use most relevant label)
          // Prefer specific product names over generic terms
          const genericTerms = ['bottle', 'liquid', 'fluid', 'drinkware', 'product', 'object', 'cylinder', 'solution', 'plastic', 'container', 'package'];
          const specificLabels = labels.filter(l => 
            !genericTerms.includes(l.description.toLowerCase())
          );
          productName = specificLabels.length > 0 
            ? specificLabels[0].description 
            : labels[0].description;
        }
        
        console.log('📦 Product name for search:', productName);
        
        // Try to find product in database first
        const foundProduct = productService.findProductByLabels(labels);
        
        // If product found in database, use it
        if (foundProduct) {
          console.log('✅ Product found in database:', foundProduct.name);
          product = foundProduct;
          productName = product.name; // Use database product name
        } else {
          // Create dynamic product from Vision API labels
          console.log('💡 Creating dynamic product from Vision API labels');
          product = {
            brand: null,
            name: productName, // Use the productName we extracted from labels
            size: '1 Each',
            weight: '1 Each',
            category: labels[0].description,
            labels: labels.map(l => l.description),
            stores: null, // Will be populated by web scraping
            price: null, // Will be populated by web scraping
          };
          // productName is already set from labels above, don't override it
        }
        } else {
          console.log('⚠️ No labels detected, using fallback');
        }
      }
    }

    // If we have productName from OCR but no product object, create one
    if (!product && productName && productName.trim().length > 0) {
      console.log('💡 Creating product from extracted name:', productName);
      product = {
        brand: null,
        name: productName,
        size: '1 Each',
        weight: '1 Each',
        category: 'General',
        labels: labels ? labels.map(l => l.description) : [],
        stores: null,
        price: null,
      };
    }
    
    // No fallback dummy product - if no product found, return error
    if (!product && (!labels || labels.length === 0)) {
      console.log('⚠️ No product found and no labels detected');
      
      // Check which APIs are configured
      const hasGeminiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
      const hasVisionKey = !!(process.env.GOOGLE_CLOUD_VISION_API_KEY || process.env.GOOGLE_CLOUD_VISION_KEY_FILE);
      
      let errorMessage = 'Product not found. ';
      if (!hasGeminiKey && !hasVisionKey) {
        errorMessage += 'Please configure Google Vision API or Gemini API key in backend.';
      } else if (!hasGeminiKey) {
        errorMessage += 'AI recognition not available. Please try scanning again with better lighting.';
      } else if (!hasVisionKey) {
        errorMessage += 'Vision API not configured. Please try scanning again.';
      } else {
        errorMessage += 'Please try scanning again with better lighting and make sure the product is clearly visible.';
      }
      
      return res.status(404).json({
        success: false,
        error: errorMessage,
        debug: {
          barcodeDetected: !!barcode,
          hasGeminiKey,
          hasVisionKey,
        },
      });
    }
    // Note: If product was created from labels above, productName is already set correctly
    // Don't override it here!

    // Search for product links on internet
    // Include size information if available for more specific results
    let productLinks = [];
    let searchQuery = productName;
    
    console.log('🔍 Preparing to search product links...');
    console.log('   Product name:', productName);
    console.log('   Product size:', product?.size || 'Unknown');
    console.log('   Product type:', productType);
    
    // Build search query with size if available
    if (productType) {
      // Use productType for search (e.g., "spring water" instead of "Bottle" or "Drinking water")
      searchQuery = productType;
      console.log('🔍 Using product type for search:', searchQuery);
      console.log('📝 Original product name:', productName);
    } else if (productName) {
      searchQuery = productName;
      
      // Add size to search query if available and not generic
      if (product?.size && product.size !== '1 Each' && product.size !== 'Unknown') {
        // Extract size numbers (e.g., "2.1 FL OZ" -> "2.1 fl oz" or "63 ML" -> "63ml")
        const sizeMatch = product.size.match(/(\d+\.?\d*)\s*(fl\s*oz|ml|oz|g|lb|l)/i);
        if (sizeMatch) {
          const sizeValue = sizeMatch[1];
          const sizeUnit = sizeMatch[2].toLowerCase().replace(/\s+/g, '');
          searchQuery = `${productName} ${sizeValue}${sizeUnit}`;
          console.log('📏 Added size to search query:', searchQuery);
        } else {
          // If no standard format, try to extract any numbers from size
          const anyNumberMatch = product.size.match(/(\d+\.?\d*)/);
          if (anyNumberMatch) {
            searchQuery = `${productName} ${anyNumberMatch[1]}`;
            console.log('📏 Added size number to search query:', searchQuery);
          }
        }
      }
      
      console.log('🔍 Searching product links for:', searchQuery);
    } else {
      console.log('⚠️ No product name available for search');
    }
    
    if (searchQuery) {
      try {
        console.log('🌐 Calling Custom Search API with query:', searchQuery);
        productLinks = await productSearchService.searchProductLinks(searchQuery);
        const totalLinks = (productLinks.exactMatches?.length || 0) + (productLinks.similarProducts?.length || 0);
        console.log('✅ Custom Search API returned', totalLinks, 'product links', {
          exactMatches: productLinks.exactMatches?.length || 0,
          similarProducts: productLinks.similarProducts?.length || 0,
        });
        
        // If no results and we added size, try without size
        if (totalLinks === 0 && product?.size && product.size !== '1 Each' && product.size !== 'Unknown') {
          console.log('⚠️ No results with size, trying without size...');
          productLinks = await productSearchService.searchProductLinks(productName);
          const retryTotalLinks = (productLinks.exactMatches?.length || 0) + (productLinks.similarProducts?.length || 0);
          console.log('✅ Search without size returned', retryTotalLinks, 'product links');
        }
      } catch (error) {
        console.error('❌ Error searching product links:', error.message);
        console.error('💡 Check if Google Custom Search API is configured correctly');
        productLinks = { exactMatches: [], similarProducts: [] }; // Return empty results instead of crashing
      }
    } else {
      console.log('⚠️ No search query available, skipping Custom Search API');
    }
    
    // Also try Aldi and Publix web scraping for product links
    if (productName) {
      // Try Aldi web scraping
      // Use brand + product details if available from AI
      let aldiPrice = null;
      try {
        // Get brand and product details from AI result if available
        // Check both current aiProductInfo and stored aiProductInfoForScraper
        let brand = null;
        let productDetails = null;
        const aiInfo = aiProductInfoForScraper || (typeof aiProductInfo !== 'undefined' ? aiProductInfo : null);
        
        if (aiInfo) {
          brand = aiInfo.brand && aiInfo.brand !== 'Unknown' ? aiInfo.brand : null;
          productDetails = aiInfo.product && aiInfo.product !== 'Unknown' ? aiInfo.product : null;
          console.log(`📋 AI extracted - Brand: ${brand || 'N/A'}, Product: ${productDetails || 'N/A'}`);
        }
        
        // Try multiple search strategies
        const searchQueries = [];
        
        // Strategy 1: Full product name (original)
        if (productName) {
          searchQueries.push({ query: productName, strategy: 'fullName' });
        }
        
        // Strategy 2: Brand + Product Details (if available)
        if (brand && productDetails) {
          const brandProductQuery = `${brand} ${productDetails}`;
          searchQueries.push({ query: brandProductQuery, strategy: 'brand+product' });
          console.log(`🔍 Will try brand+product search: "${brandProductQuery}"`);
        }
        
        // Strategy 3: Brand + Key words from product name
        if (brand && productName) {
          // Extract key words from product name (remove common words)
          const words = productName.toLowerCase().split(/\s+/);
          const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'from', 'by'];
          const keyWords = words.filter(word => word.length > 3 && !stopWords.includes(word)).slice(0, 3);
          if (keyWords.length > 0) {
            const brandKeyWordsQuery = `${brand} ${keyWords.join(' ')}`;
            searchQueries.push({ query: brandKeyWordsQuery, strategy: 'brand+keywords' });
            console.log(`🔍 Will try brand+keywords search: "${brandKeyWordsQuery}"`);
          }
        }
        
        // Strategy 4: Just product details (if available and different from full name)
        if (productDetails && productDetails !== productName) {
          searchQueries.push({ query: productDetails, strategy: 'productOnly' });
        }
        
        // Try each search strategy until we find results
        for (const { query, strategy } of searchQueries) {
          console.log(`🛒 Trying Aldi web scraping (${strategy}): "${query}"`);
          aldiPrice = await aldiScraperService.getAldiPrice(query, { brand, productDetails });
          
          if (aldiPrice && aldiPrice.price > 0) {
            console.log(`✅ Found Aldi price using ${strategy} strategy: $${aldiPrice.price.toFixed(2)}`);
            break; // Stop trying other strategies if we found a result
          }
        }
        if (aldiPrice && aldiPrice.price > 0) {
          console.log(`✅ Found Aldi price: $${aldiPrice.price.toFixed(2)}`);
          
          // Update product object with store and price
          if (product) {
            product.stores = 'Aldi';
            product.price = aldiPrice.price;
            console.log(`📦 Updated product with store: ${product.stores}, price: $${product.price.toFixed(2)}`);
          }
          
          // Add Aldi to productLinks if not already present
          if (!productLinks.exactMatches) {
            productLinks.exactMatches = [];
          }
          // Check if Aldi already exists in exactMatches
          const existingAldi = productLinks.exactMatches.find(link => 
            link.source && link.source.toLowerCase() === 'aldi'
          );
          if (!existingAldi) {
            productLinks.exactMatches.push({
              source: 'Aldi',
              price: aldiPrice.price,
              link: aldiPrice.link,
              title: aldiPrice.productName,
              attributes: aldiPrice.attributes,
            });
          } else if (aldiPrice.price < existingAldi.price) {
            // Update if scraped price is cheaper
            existingAldi.price = aldiPrice.price;
            existingAldi.link = aldiPrice.link;
            existingAldi.attributes = aldiPrice.attributes;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Aldi scraping failed for "${productName}":`, error.message);
      }
      
      // Try Publix web scraping
      let publixPrice = null;
      try {
        console.log(`🛒 Trying Publix web scraping for: ${productName}`);
        publixPrice = await publixScraperService.getPublixPrice(productName);
        if (publixPrice && publixPrice.price > 0) {
          console.log(`✅ Found Publix price: $${publixPrice.price.toFixed(2)}`);
          // Add Publix to productLinks if not already present
          if (!productLinks.exactMatches) {
            productLinks.exactMatches = [];
          }
          // Check if Publix already exists in exactMatches
          const existingPublix = productLinks.exactMatches.find(link => 
            link.source && link.source.toLowerCase() === 'publix'
          );
          if (!existingPublix) {
            productLinks.exactMatches.push({
              source: 'Publix',
              price: publixPrice.price,
              link: publixPrice.link,
              title: publixPrice.productName,
            });
          } else if (publixPrice.price < existingPublix.price) {
            // Update if scraped price is cheaper
            existingPublix.price = publixPrice.price;
            existingPublix.link = publixPrice.link;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Publix scraping failed for "${productName}":`, error.message);
      }
    }
    
    res.json({
      success: true,
      product: product,
      barcodeDetected: !!barcode,
      barcode: barcode || null,
      labelsDetected: labels ? labels.map(l => l.description) : null,
      productLinks: productLinks, // Internet product links (now includes Aldi and Publix)
      // Gemini AI price comparison (if available)
      geminiPriceComparison: geminiPriceComparison || null,
      scanSource: geminiPriceComparison ? 'gemini' : (barcode ? 'barcode' : 'vision'),
    });
  } catch (error) {
    console.error('❌ Error scanning product:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
    });
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error while scanning product',
      debug: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        name: error.name,
      } : undefined,
    });
  }
});

// Compare Prices - Get prices from multiple stores (old dummy data method)
app.post('/api/compare/prices', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    const comparison = storeService.comparePrices(items);
    
    res.json({
      success: true,
      comparison
    });
  } catch (error) {
    console.error('Error comparing prices:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compare Prices for a Single Product
app.post('/api/compare/product-prices', async (req, res) => {
  try {
    const { productName } = req.body;
    
    if (!productName || productName.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Product name is required' });
    }

    console.log(`🔍 Comparing prices for product: ${productName}`);
    
    // Search product in stores (Google Custom Search)
    const productLinks = await productSearchService.searchProductLinks(productName, productName);
    
    // Also try Publix web scraping
    let publixPrice = null;
    try {
      console.log(`🛒 Trying Publix web scraping for: ${productName}`);
      publixPrice = await publixScraperService.getPublixPrice(productName);
      if (publixPrice) {
        console.log(`✅ Found Publix price: $${publixPrice.price.toFixed(2)}`);
      }
    } catch (error) {
      console.warn(`⚠️ Publix scraping failed for "${productName}":`, error.message);
    }
    
    // Also try Aldi web scraping
    let aldiPrice = null;
    try {
      console.log(`🛒 Trying Aldi web scraping for: ${productName}`);
      aldiPrice = await aldiScraperService.getAldiPrice(productName);
      if (aldiPrice) {
        console.log(`✅ Found Aldi price: $${aldiPrice.price.toFixed(2)}`);
      }
    } catch (error) {
      console.warn(`⚠️ Aldi scraping failed for "${productName}":`, error.message);
    }
    
    // Extract prices from exact matches
    const prices = [];
    if (productLinks.exactMatches && productLinks.exactMatches.length > 0) {
      productLinks.exactMatches.forEach(link => {
        if (link.price && link.price > 0) {
          prices.push({
            store: link.source,
            price: link.price,
            link: link.link,
            title: link.title,
          });
        }
      });
    }
    
    // Add Publix price if found
    if (publixPrice && publixPrice.price > 0) {
      // Check if Publix already exists in prices (from Google Search)
      const existingPublix = prices.find(p => p.store.toLowerCase() === 'publix');
      if (!existingPublix) {
        prices.push({
          store: 'Publix',
          price: publixPrice.price,
          link: publixPrice.link,
          title: publixPrice.productName,
          source: 'web-scraping',
        });
      } else if (publixPrice.price < existingPublix.price) {
        // Use scraped price if it's cheaper
        existingPublix.price = publixPrice.price;
        existingPublix.link = publixPrice.link;
        existingPublix.source = 'web-scraping';
      }
    }
    
    // Add Aldi price if found
    if (aldiPrice && aldiPrice.price > 0) {
      // Check if Aldi already exists in prices (from Google Search)
      const existingAldi = prices.find(p => p.store.toLowerCase() === 'aldi');
      if (!existingAldi) {
        prices.push({
          store: 'Aldi',
          price: aldiPrice.price,
          link: aldiPrice.link,
          title: aldiPrice.productName,
          source: 'web-scraping',
          attributes: aldiPrice.attributes, // Include product attributes
        });
      } else if (aldiPrice.price < existingAldi.price) {
        // Use scraped price if it's cheaper
        existingAldi.price = aldiPrice.price;
        existingAldi.link = aldiPrice.link;
        existingAldi.source = 'web-scraping';
        existingAldi.attributes = aldiPrice.attributes;
      }
    }
    
    // Find cheapest price
    const cheapestPrice = prices.length > 0 
      ? prices.reduce((min, p) => p.price < min.price ? p : min, prices[0])
      : null;
    
    console.log(`✅ Found ${prices.length} prices for ${productName}, cheapest: $${cheapestPrice?.price?.toFixed(2) || 'N/A'}`);
    
    res.json({
      success: true,
      productName: productName,
      prices: prices, // All prices found
      cheapestPrice: cheapestPrice, // Best price
      priceCount: prices.length,
    });
  } catch (error) {
    console.error('❌ Error comparing product prices:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compare Receipt Prices - Search all receipt items in stores
// Groups prices by store and shows total for each store
app.post('/api/compare/receipt-prices', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array is required and must not be empty' });
    }

    console.log(`🔍 Comparing prices for ${items.length} receipt items...`);
    
    // Search each item in stores and collect prices by store
    const storePricesMap = {}; // { storeName: { items: [{ name, price, quantity, link }], total: 0 } }
    const itemDetails = []; // For breakdown: [{ name, originalPrice, quantity, storePrices: { store: price } }]
    let processedCount = 0;
    
    for (const item of items) {
      try {
        const productName = item.name;
        if (!productName || productName.trim().length === 0) {
          console.log(`⚠️ Skipping item with no name:`, item);
          continue;
        }
        
        console.log(`  🔎 Searching for: ${productName}`);
        const productLinks = await productSearchService.searchProductLinks(productName, productName);
        console.log(`  📊 Search result for "${productName}":`, {
          exactMatches: productLinks.exactMatches?.length || 0,
          similarProducts: productLinks.similarProducts?.length || 0,
        });
        
        // Also try Publix web scraping
        let publixPrice = null;
        try {
          console.log(`  🛒 Trying Publix web scraping for: ${productName}`);
          publixPrice = await publixScraperService.getPublixPrice(productName);
          if (publixPrice) {
            console.log(`  ✅ Found Publix price: $${publixPrice.price.toFixed(2)}`);
          }
        } catch (error) {
          console.warn(`  ⚠️ Publix scraping failed for "${productName}":`, error.message);
        }
        
        // Also try Aldi web scraping
        let aldiPrice = null;
        try {
          console.log(`  🛒 Trying Aldi web scraping for: ${productName}`);
          aldiPrice = await aldiScraperService.getAldiPrice(productName);
          if (aldiPrice) {
            console.log(`  ✅ Found Aldi price: $${aldiPrice.price.toFixed(2)}`);
          }
        } catch (error) {
          console.warn(`  ⚠️ Aldi scraping failed for "${productName}":`, error.message);
        }
        
        // Extract prices from exact matches AND similar products (muadil ürünler)
        const itemStorePrices = {}; // { store: price }
        
        // Get exact matches
        if (productLinks.exactMatches && productLinks.exactMatches.length > 0) {
          productLinks.exactMatches.forEach(link => {
            if (link.price && link.price > 0) {
              const store = link.source;
              // Use first price found for each store (already sorted by price)
              if (!itemStorePrices[store]) {
                itemStorePrices[store] = link.price;
                
                // Add to store prices map
                if (!storePricesMap[store]) {
                  storePricesMap[store] = {
                    store: store,
                    items: [],
                    total: 0,
                  };
                }
                storePricesMap[store].items.push({
                  name: productName,
                  price: link.price,
                  quantity: item.quantity || 1,
                  link: link.link,
                  title: link.title,
                });
                storePricesMap[store].total += link.price * (item.quantity || 1);
              }
            }
          });
        }
        
        // If no exact matches, try similar products (muadil ürünler)
        if (Object.keys(itemStorePrices).length === 0 && productLinks.similarProducts && productLinks.similarProducts.length > 0) {
          productLinks.similarProducts.forEach(link => {
            if (link.price && link.price > 0) {
              const store = link.source;
              if (!itemStorePrices[store]) {
                itemStorePrices[store] = link.price;
                
                if (!storePricesMap[store]) {
                  storePricesMap[store] = {
                    store: store,
                    items: [],
                    total: 0,
                  };
                }
                storePricesMap[store].items.push({
                  name: productName,
                  price: link.price,
                  quantity: item.quantity || 1,
                  link: link.link,
                  title: link.title,
                  isSimilar: true, // Mark as similar product
                });
                storePricesMap[store].total += link.price * (item.quantity || 1);
              }
            }
          });
        }
        
        // Add Publix price if found (and not already in results or cheaper)
        if (publixPrice && publixPrice.price > 0) {
          const store = 'Publix';
          if (!itemStorePrices[store] || publixPrice.price < itemStorePrices[store]) {
            itemStorePrices[store] = publixPrice.price;
            
            if (!storePricesMap[store]) {
              storePricesMap[store] = {
                store: store,
                items: [],
                total: 0,
              };
            }
            // Update or add Publix item
            const existingItem = storePricesMap[store].items.find(i => i.name === productName);
            if (existingItem) {
              existingItem.price = publixPrice.price;
              existingItem.link = publixPrice.link;
              existingItem.title = publixPrice.productName;
              // Recalculate total for this store
              storePricesMap[store].total = storePricesMap[store].items.reduce((sum, item) => 
                sum + (item.price * (item.quantity || 1)), 0
              );
            } else {
              storePricesMap[store].items.push({
                name: productName,
                price: publixPrice.price,
                quantity: item.quantity || 1,
                link: publixPrice.link,
                title: publixPrice.productName,
                source: 'web-scraping',
              });
              storePricesMap[store].total += publixPrice.price * (item.quantity || 1);
            }
          }
        }
        
        // Add Aldi price if found (and not already in results or cheaper)
        if (aldiPrice && aldiPrice.price > 0) {
          const store = 'Aldi';
          if (!itemStorePrices[store] || aldiPrice.price < itemStorePrices[store]) {
            itemStorePrices[store] = aldiPrice.price;
            
            if (!storePricesMap[store]) {
              storePricesMap[store] = {
                store: store,
                items: [],
                total: 0,
              };
            }
            // Update or add Aldi item
            const existingItem = storePricesMap[store].items.find(i => i.name === productName);
            if (existingItem) {
              existingItem.price = aldiPrice.price;
              existingItem.link = aldiPrice.link;
              existingItem.title = aldiPrice.productName;
              existingItem.attributes = aldiPrice.attributes;
              // Recalculate total for this store
              storePricesMap[store].total = storePricesMap[store].items.reduce((sum, item) => 
                sum + (item.price * (item.quantity || 1)), 0
              );
            } else {
              storePricesMap[store].items.push({
                name: productName,
                price: aldiPrice.price,
                quantity: item.quantity || 1,
                link: aldiPrice.link,
                title: aldiPrice.productName,
                attributes: aldiPrice.attributes, // Include product attributes
                source: 'web-scraping',
              });
              storePricesMap[store].total += aldiPrice.price * (item.quantity || 1);
            }
          }
        }
        
        // Store item details for breakdown
        itemDetails.push({
          name: productName,
          originalPrice: item.price,
          quantity: item.quantity || 1,
          storePrices: itemStorePrices, // { store: price }
        });
        
        processedCount++;
        const foundStores = Object.keys(itemStorePrices);
        console.log(`  ✅ Found prices for ${productName} in ${foundStores.length} stores: ${foundStores.join(', ')}`);
        
        // Add small delay to avoid rate limiting
        if (processedCount < items.length) {
          await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between searches
        }
      } catch (error) {
        console.error(`  ❌ Error searching for ${item.name}:`, error.message);
        // Continue with other items even if one fails
        itemDetails.push({
          name: item.name,
          originalPrice: item.price,
          quantity: item.quantity || 1,
          storePrices: {},
          error: error.message,
        });
      }
    }
    
    // Convert store prices map to array and sort by total
    const stores = Object.values(storePricesMap)
      .map(store => ({
        store: store.store,
        address: 'Online', // Online stores
        distance: 'Online',
        total: parseFloat(store.total.toFixed(2)),
        items: store.items, // Breakdown of items
      }))
      .sort((a, b) => a.total - b.total);
    
    // Calculate totals
    const originalTotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const cheapestTotal = stores.length > 0 ? stores[0].total : originalTotal;
    const potentialSavings = originalTotal - cheapestTotal;
    
    console.log(`✅ Price comparison complete:`);
    console.log(`   Original total: $${originalTotal.toFixed(2)}`);
    console.log(`   Cheapest total: $${cheapestTotal.toFixed(2)} (${stores.length > 0 ? stores[0].store : 'N/A'})`);
    console.log(`   Potential savings: $${potentialSavings.toFixed(2)}`);
    console.log(`   Stores found: ${stores.map(s => `${s.store} ($${s.total.toFixed(2)})`).join(', ')}`);
    
    res.json({
      success: true,
      stores: stores, // Array of stores with totals and item breakdowns
      bestStore: stores.length > 0 ? stores[0] : null, // Cheapest store
      itemDetails: itemDetails, // Breakdown per item
      originalTotal: parseFloat(originalTotal.toFixed(2)),
      cheapestTotal: parseFloat(cheapestTotal.toFixed(2)),
      potentialSavings: parseFloat(potentialSavings.toFixed(2)),
      itemsProcessed: processedCount,
      itemsTotal: items.length,
    });
  } catch (error) {
    console.error('❌ Error comparing receipt prices:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search Products
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const products = productService.searchProducts(q);
    
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Stores near location
app.get('/api/stores/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
    }

    const stores = storeService.getNearbyStores(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius)
    );
    
    res.json({
      success: true,
      stores: stores
    });
  } catch (error) {
    console.error('Error getting nearby stores:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test Google Vision API with real data
app.post('/api/test/vision', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image file is required',
        hint: 'Send a POST request with multipart/form-data containing an "image" field'
      });
    }

    const results = {
      imageSize: req.file.buffer.length,
      imageType: req.file.mimetype,
      timestamp: new Date().toISOString(),
    };

    // Test OCR (Text Detection)
    console.log('🔍 Testing OCR (Text Detection)...');
    const ocrText = await visionService.extractTextFromImage(req.file.buffer);
    results.ocr = {
      success: !!ocrText,
      text: ocrText || null,
      textLength: ocrText ? ocrText.length : 0,
    };

    // Test Barcode Detection
    console.log('🔍 Testing Barcode Detection...');
    const barcode = await visionService.detectBarcode(req.file.buffer);
    results.barcode = {
      success: !!barcode,
      value: barcode || null,
    };

    // Test Label Detection
    console.log('🔍 Testing Label Detection...');
    const labels = await visionService.detectProductLabels(req.file.buffer);
    results.labels = {
      success: !!labels && labels.length > 0,
      count: labels ? labels.length : 0,
      labels: labels || null,
    };

    // Check if using real API or dummy data
    const isUsingRealAPI = !!(process.env.GOOGLE_CLOUD_VISION_API_KEY || process.env.GOOGLE_CLOUD_VISION_KEY_FILE);
    
    res.json({
      success: true,
      message: isUsingRealAPI 
        ? '✅ Google Vision API is configured and working!' 
        : '⚠️ Google Vision API not configured - using dummy data. Add GOOGLE_CLOUD_VISION_API_KEY to .env file.',
      usingRealAPI: isUsingRealAPI,
      results: results,
    });
  } catch (error) {
    console.error('Error testing Vision API:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Start server
// Render.com requires binding to 0.0.0.0 (all network interfaces)
// Render.com automatically sets PORT environment variable
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Scan Good Backend API running on http://${HOST}:${PORT}`);
  console.log(`📡 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`🌐 Render.com will route traffic to this port: ${PORT}`);
});

