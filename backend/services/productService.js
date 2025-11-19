// Product lookup and matching service

// Dummy product database (in production, use real database)
const PRODUCT_DATABASE = {
  '1234567890123': {
    barcode: '1234567890123',
    name: 'Produce Avocado',
    size: '1 Each',
    category: 'Produce',
    stores: [
      { name: 'Target', price: 0.75, distance: '8.4 mi' },
      { name: 'Whole Foods', price: 1.25, distance: '1.9 mi' },
      { name: 'Walmart', price: 0.79, distance: '5.2 mi' },
    ],
  },
  '9876543210987': {
    barcode: '9876543210987',
    name: "SB Ray's BBQ Sauce",
    size: '18 FL Oz',
    category: 'Condiments',
    stores: [
      { name: 'Target', price: 3.99, distance: '8.4 mi' },
      { name: 'Walmart', price: 2.99, distance: '5.2 mi' },
    ],
  },
};

// Product matching by labels (from image recognition)
const PRODUCT_LABELS = {
  'avocado': '1234567890123',
  'tomato': '1111111111111',
  'bbq sauce': '9876543210987',
  'sauce': '9876543210987',
};

// Lookup product by barcode
const lookupProductByBarcode = (barcode) => {
  return PRODUCT_DATABASE[barcode] || null;
};

// Find product by labels (image recognition)
const findProductByLabels = (labels) => {
  if (!labels || labels.length === 0) return null;

  // Find matching product based on label descriptions
  for (const label of labels) {
    const description = label.description.toLowerCase();
    const barcode = PRODUCT_LABELS[description];
    
    if (barcode) {
      return PRODUCT_DATABASE[barcode];
    }
  }

  // If no exact match, return first product as fallback
  return PRODUCT_DATABASE['1234567890123'];
};

// Search products by name
const searchProducts = (query) => {
  const results = [];
  const searchTerm = query.toLowerCase();

  Object.values(PRODUCT_DATABASE).forEach(product => {
    if (product.name.toLowerCase().includes(searchTerm)) {
      results.push(product);
    }
  });

  return results;
};

module.exports = {
  lookupProductByBarcode,
  findProductByLabels,
  searchProducts,
};



