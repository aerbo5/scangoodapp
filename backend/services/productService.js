// Product lookup and matching service
// Uses Open Food Facts API (free, open-source product database)

const axios = require('axios');

// Open Food Facts API endpoint
const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v2/product';

// Lookup product by barcode using Open Food Facts API
const lookupProductByBarcode = async (barcode) => {
  if (!barcode) return null;

  try {
    console.log('🔍 Looking up product by barcode:', barcode);
    console.log('🌐 Calling Open Food Facts API...');
    
    // Call Open Food Facts API
    const response = await axios.get(`${OPEN_FOOD_FACTS_API}/${barcode}.json`, {
      timeout: 5000, // 5 second timeout
    });

    if (response.data && response.data.status === 1 && response.data.product) {
      const productData = response.data.product;
      
      console.log('✅ Product found in Open Food Facts:', productData.product_name || 'Unknown');
      
      // Extract product information
      const productName = productData.product_name || 
                         productData.product_name_en || 
                         productData.abbreviated_product_name ||
                         'Unknown Product';
      
      const quantity = productData.quantity || 
                      productData.product_quantity || 
                      '1 Each';
      
      const category = productData.categories || 
                      productData.categories_tags?.[0] || 
                      'General';
      
      // Extract brand if available
      const brand = productData.brands || productData.brand || '';
      const fullName = brand ? `${brand} ${productName}` : productName;
      
      // Get image URL if available
      const imageUrl = productData.image_url || 
                      productData.image_front_url ||
                      productData.image_small_url ||
                      null;
      
      // Format product data to match our structure
      const product = {
        barcode: barcode,
        name: fullName.trim(),
        size: quantity,
        category: category,
        image: imageUrl,
        stores: [], // Will be populated by Custom Search API (no dummy data)
        // Additional data from Open Food Facts
        openFoodFactsData: {
          productName: productName,
          brand: brand,
          categories: productData.categories_tags || [],
          ingredients: productData.ingredients_text || null,
          nutritionGrade: productData.nutrition_grade_fr || null,
          novaGroup: productData.nova_group || null,
        },
      };
      
      return product;
    } else {
      console.log('⚠️ Product not found in Open Food Facts database');
      // Product not found - return null (no dummy data)
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching product from Open Food Facts:', {
      message: error.message,
      status: error.response?.status,
      barcode: barcode,
    });
    
    // Throw error instead of returning dummy data
    throw new Error(`Failed to fetch product from Open Food Facts: ${error.message}`);
  }
};

// Find product by labels (image recognition)
// Note: This is a simple matching function - no dummy data
const findProductByLabels = (labels) => {
  if (!labels || labels.length === 0) return null;

  // No dummy product database - return null if no match
  // In production, this would search a real database
  return null;
};

// Search products by name
// Note: No dummy data - returns empty array
// In production, this would search a real database
const searchProducts = (query) => {
  // No dummy product database - return empty array
  return [];
};

module.exports = {
  lookupProductByBarcode,
  findProductByLabels,
  searchProducts,
};



