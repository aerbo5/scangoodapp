// Aldi web scraping service
// Scrapes product prices from Aldi.com

const axios = require('axios');
const cheerio = require('cheerio');

// Cache for product prices (in-memory, can be replaced with Redis in production)
const priceCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Search product on Aldi website
const searchProductOnAldi = async (productName) => {
  try {
    // Check cache first
    const cacheKey = `aldi_${productName.toLowerCase().trim()}`;
    const cached = priceCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`📦 Using cached Aldi price for: ${productName}`);
      return cached.data;
    }

    console.log(`🔍 Searching Aldi for: ${productName}`);

    // Clean product name for search
    const cleanProductName = productName
      .replace(/&/g, 'and')
      .replace(/'/g, '')
      .trim();

    // Aldi search URL
    // Aldi uses different URL patterns - trying multiple approaches
    const searchUrl = `https://www.aldi.us/en/search.html?q=${encodeURIComponent(cleanProductName)}`;

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
        'Referer': 'https://www.aldi.us/',
      },
      timeout: 15000,
    });

    // Parse HTML with Cheerio
    const $ = cheerio.load(response.data);
    const products = [];

    // Try to find product listings - Aldi uses various selectors
    // Common patterns: .product-item, .product-card, .product-tile, .search-result-item
    $('.product-item, .product-card, .product-tile, [data-product-id], .search-result-item, .product, .product-box').each((index, element) => {
      try {
        const $el = $(element);
        
        // Extract product name - try multiple selectors
        const name = $el.find('.product-name, .product-title, .product-title-link, h3, h4, h2, [data-product-name], .title, a.product-link').first().text().trim() ||
                     $el.find('a').first().text().trim() ||
                     $el.attr('data-product-name') ||
                     $el.attr('title') ||
                     '';

        // Extract price - try multiple selectors
        const priceText = $el.find('.price, .product-price, [data-price], .sale-price, .regular-price, .current-price, .price-current, .price-value').first().text().trim() ||
                          $el.find('[class*="price"]').first().text().trim() ||
                          $el.attr('data-price') ||
                          '';

        // Extract product link
        const link = $el.find('a').first().attr('href') || '';
        const fullLink = link.startsWith('http') ? link : `https://www.aldi.us${link}`;

        // Extract product attributes/properties
        // Try to find size, weight, or other attributes
        const attributes = [];
        
        // Look for size/weight information
        const sizeText = $el.find('.product-size, .size, [data-size], .weight, .product-weight').first().text().trim();
        if (sizeText) {
          attributes.push({ type: 'size', value: sizeText });
        }
        
        // Look for brand information
        const brandText = $el.find('.brand, .product-brand, [data-brand]').first().text().trim();
        if (brandText) {
          attributes.push({ type: 'brand', value: brandText });
        }
        
        // Look for category
        const categoryText = $el.find('.category, .product-category, [data-category]').first().text().trim();
        if (categoryText) {
          attributes.push({ type: 'category', value: categoryText });
        }

        // Parse price
        const price = parsePrice(priceText);

        if (name && price > 0) {
          products.push({
            name: name,
            price: price,
            priceText: priceText,
            link: fullLink,
            source: 'Aldi',
            attributes: attributes.length > 0 ? attributes : undefined,
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
                  const attributes = [];
                  
                  // Extract attributes from JSON-LD
                  if (product.brand) {
                    attributes.push({ type: 'brand', value: product.brand });
                  }
                  if (product.category) {
                    attributes.push({ type: 'category', value: product.category });
                  }
                  if (product.size || product.weight) {
                    attributes.push({ type: 'size', value: product.size || product.weight });
                  }
                  
                  products.push({
                    name: product.name,
                    price: price,
                    priceText: `$${price.toFixed(2)}`,
                    link: product.url || product['@id'] || '',
                    source: 'Aldi',
                    attributes: attributes.length > 0 ? attributes : undefined,
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

    // If still no products, try to find products in script tags with product data
    if (products.length === 0) {
      $('script').each((index, element) => {
        try {
          const scriptContent = $(element).html();
          // Look for product data in JavaScript variables
          if (scriptContent && scriptContent.includes('product') && scriptContent.includes('price')) {
            // Try to extract product data from JavaScript
            const productMatches = scriptContent.match(/products?\s*[:=]\s*\[(.*?)\]/s);
            if (productMatches) {
              // This is a simplified extraction - may need adjustment based on actual structure
              console.log('📝 Found potential product data in script tag');
            }
          }
        } catch (error) {
          // Skip invalid scripts
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

    console.log(`✅ Found ${products.length} products on Aldi for: ${productName}`);
    return products;

  } catch (error) {
    console.error(`❌ Error scraping Aldi for "${productName}":`, error.message);
    
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

// Get product price from Aldi (main function)
const getAldiPrice = async (productName) => {
  try {
    const products = await searchProductOnAldi(productName);
    
    if (products.length === 0) {
      return null;
    }

    // Return the cheapest product (first in sorted array)
    return {
      store: 'Aldi',
      price: products[0].price,
      priceText: products[0].priceText,
      link: products[0].link,
      productName: products[0].name,
      attributes: products[0].attributes,
      allPrices: products, // All found prices
    };
  } catch (error) {
    console.error(`❌ Error getting Aldi price for "${productName}":`, error.message);
    return null;
  }
};

// Search multiple products on Aldi
const searchMultipleProducts = async (productNames) => {
  const results = [];
  
  for (const productName of productNames) {
    try {
      const price = await getAldiPrice(productName);
      if (price) {
        results.push({
          productName: productName,
          ...price,
        });
      }
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error searching "${productName}" on Aldi:`, error.message);
    }
  }
  
  return results;
};

// Get all products from a category or search (for bulk scraping)
const getAllProducts = async (searchQuery = '', category = '') => {
  try {
    console.log(`🔍 Getting all products from Aldi${category ? ` (category: ${category})` : ''}${searchQuery ? ` (search: ${searchQuery})` : ''}`);
    
    const products = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= 10) { // Limit to 10 pages to avoid infinite loops
      try {
        const url = searchQuery 
          ? `https://www.aldi.us/en/search.html?q=${encodeURIComponent(searchQuery)}&page=${page}`
          : category
          ? `https://www.aldi.us/en/c/${category}.html?page=${page}`
          : `https://www.aldi.us/en/products.html?page=${page}`;
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.aldi.us/',
          },
          timeout: 15000,
        });
        
        const $ = cheerio.load(response.data);
        const pageProducts = [];
        
        // Extract products from current page (same logic as searchProductOnAldi)
        $('.product-item, .product-card, .product-tile, [data-product-id], .search-result-item, .product, .product-box').each((index, element) => {
          try {
            const $el = $(element);
            
            const name = $el.find('.product-name, .product-title, .product-title-link, h3, h4, h2, [data-product-name], .title, a.product-link').first().text().trim() ||
                         $el.find('a').first().text().trim() ||
                         $el.attr('data-product-name') ||
                         $el.attr('title') ||
                         '';
            
            const priceText = $el.find('.price, .product-price, [data-price], .sale-price, .regular-price, .current-price, .price-current, .price-value').first().text().trim() ||
                              $el.find('[class*="price"]').first().text().trim() ||
                              $el.attr('data-price') ||
                              '';
            
            const link = $el.find('a').first().attr('href') || '';
            const fullLink = link.startsWith('http') ? link : `https://www.aldi.us${link}`;
            
            // Extract attributes
            const attributes = [];
            const sizeText = $el.find('.product-size, .size, [data-size], .weight, .product-weight').first().text().trim();
            if (sizeText) {
              attributes.push({ type: 'size', value: sizeText });
            }
            const brandText = $el.find('.brand, .product-brand, [data-brand]').first().text().trim();
            if (brandText) {
              attributes.push({ type: 'brand', value: brandText });
            }
            const categoryText = $el.find('.category, .product-category, [data-category]').first().text().trim();
            if (categoryText) {
              attributes.push({ type: 'category', value: categoryText });
            }
            
            const price = parsePrice(priceText);
            
            if (name && price > 0) {
              pageProducts.push({
                name: name,
                price: price,
                priceText: priceText,
                link: fullLink,
                source: 'Aldi',
                attributes: attributes.length > 0 ? attributes : undefined,
              });
            }
          } catch (error) {
            console.warn(`⚠️ Error parsing product element:`, error.message);
          }
        });
        
        if (pageProducts.length === 0) {
          hasMore = false;
        } else {
          products.push(...pageProducts);
          console.log(`  📄 Page ${page}: Found ${pageProducts.length} products (Total: ${products.length})`);
          page++;
          
          // Add delay between pages
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error fetching page ${page}:`, error.message);
        hasMore = false;
      }
    }
    
    console.log(`✅ Total products found: ${products.length}`);
    return products;
  } catch (error) {
    console.error(`❌ Error getting all products from Aldi:`, error.message);
    return [];
  }
};

module.exports = {
  searchProductOnAldi,
  getAldiPrice,
  searchMultipleProducts,
  getAllProducts,
  parsePrice,
};


