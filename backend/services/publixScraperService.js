// Publix web scraping service
// Scrapes product prices from Publix.com

const axios = require('axios');
const cheerio = require('cheerio');

// Cache for product prices (in-memory, can be replaced with Redis in production)
const priceCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Search product on Publix website
const searchProductOnPublix = async (productName) => {
  try {
    // Check cache first
    const cacheKey = `publix_${productName.toLowerCase().trim()}`;
    const cached = priceCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`📦 Using cached Publix price for: ${productName}`);
      return cached.data;
    }

    console.log(`🔍 Searching Publix for: ${productName}`);

    // Clean product name for search
    const cleanProductName = productName
      .replace(/&/g, 'and')
      .replace(/'/g, '')
      .trim();

    // Publix search URL
    // Note: Publix uses Instacart for online shopping, but we can try their search API
    const searchUrl = `https://www.publix.com/shop/search?q=${encodeURIComponent(cleanProductName)}`;

    // Make request with proper headers to avoid blocking
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      timeout: 15000,
    });

    // Parse HTML with Cheerio
    const $ = cheerio.load(response.data);
    const products = [];

    // Try to find product listings
    // Publix uses different structures, we'll try multiple selectors
    $('.product-item, .product-card, [data-product-id], .search-result-item').each((index, element) => {
      try {
        const $el = $(element);
        
        // Extract product name
        const name = $el.find('.product-name, .product-title, h3, h4, [data-product-name]').first().text().trim() ||
                     $el.find('a').first().text().trim() ||
                     $el.attr('data-product-name') ||
                     '';

        // Extract price
        const priceText = $el.find('.price, .product-price, [data-price], .sale-price, .regular-price').first().text().trim() ||
                          $el.find('[class*="price"]').first().text().trim() ||
                          $el.attr('data-price') ||
                          '';

        // Extract product link
        const link = $el.find('a').first().attr('href') || '';
        const fullLink = link.startsWith('http') ? link : `https://www.publix.com${link}`;

        // Parse price
        const price = parsePrice(priceText);

        if (name && price > 0) {
          products.push({
            name: name,
            price: price,
            priceText: priceText,
            link: fullLink,
            source: 'Publix',
          });
        }
      } catch (error) {
        console.warn(`⚠️ Error parsing product element:`, error.message);
      }
    });

    // If no products found with standard selectors, try JSON-LD or script tags
    if (products.length === 0) {
      // Try to find JSON-LD structured data
      $('script[type="application/ld+json"]').each((index, element) => {
        try {
          const jsonData = JSON.parse($(element).html());
          if (jsonData['@type'] === 'Product' || jsonData['@type'] === 'ItemList') {
            // Extract product data from JSON-LD
            const items = jsonData.itemListElement || (jsonData['@type'] === 'Product' ? [jsonData] : []);
            items.forEach(item => {
              const product = item.item || item;
              if (product.name && product.offers) {
                const price = parseFloat(product.offers.price || product.offers.lowPrice || 0);
                if (price > 0) {
                  products.push({
                    name: product.name,
                    price: price,
                    priceText: `$${price.toFixed(2)}`,
                    link: product.url || product['@id'] || '',
                    source: 'Publix',
                  });
                }
              }
            });
          }
        } catch (error) {
          // Not valid JSON, skip
        }
      });
    }

    // Sort by price (lowest first)
    products.sort((a, b) => a.price - b.price);

    // Cache the result
    if (products.length > 0) {
      priceCache.set(cacheKey, {
        data: products,
        timestamp: Date.now(),
      });
    }

    console.log(`✅ Found ${products.length} products on Publix for: ${productName}`);
    return products;

  } catch (error) {
    console.error(`❌ Error scraping Publix for "${productName}":`, error.message);
    
    // Return empty array on error (don't break the app)
    return [];
  }
};

// Parse price from text (handles various formats: $3.99, 3.99, $3.99/lb, etc.)
const parsePrice = (priceText) => {
  if (!priceText) return 0;

  // Remove common text
  const cleaned = priceText
    .replace(/each|ea|per|lb|oz|/gi, '')
    .replace(/\$/g, '')
    .trim();

  // Extract first number (price)
  const match = cleaned.match(/(\d+\.?\d*)/);
  if (match) {
    return parseFloat(match[1]);
  }

  return 0;
};

// Get product price from Publix (main function)
const getPublixPrice = async (productName) => {
  try {
    const products = await searchProductOnPublix(productName);
    
    if (products.length === 0) {
      return null;
    }

    // Return the cheapest product (first in sorted array)
    return {
      store: 'Publix',
      price: products[0].price,
      priceText: products[0].priceText,
      link: products[0].link,
      productName: products[0].name,
      allPrices: products, // All found prices
    };
  } catch (error) {
    console.error(`❌ Error getting Publix price for "${productName}":`, error.message);
    return null;
  }
};

// Search multiple products on Publix
const searchMultipleProducts = async (productNames) => {
  const results = [];
  
  for (const productName of productNames) {
    try {
      const price = await getPublixPrice(productName);
      if (price) {
        results.push({
          productName: productName,
          ...price,
        });
      }
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error searching "${productName}" on Publix:`, error.message);
    }
  }
  
  return results;
};

module.exports = {
  searchProductOnPublix,
  getPublixPrice,
  searchMultipleProducts,
  parsePrice,
};



