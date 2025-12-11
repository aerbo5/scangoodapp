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

    // Clean product name for search - more aggressive cleaning
    let cleanProductName = productName
      .replace(/&/g, 'and')
      .replace(/'/g, '')
      .replace(/[^\w\s-]/g, ' ') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .trim();
    
    // Extract key words from product name (remove common words, keep important ones)
    const words = cleanProductName.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'from', 'by', 'lb', 'oz', 'count', 'pack'];
    const keyWords = words.filter(word => word.length > 2 && !stopWords.includes(word));
    
    // Use key words if product name is too long (>50 chars) or has many words (>6)
    if (cleanProductName.length > 50 || words.length > 6) {
      cleanProductName = keyWords.slice(0, 5).join(' '); // Use first 5 key words
      console.log(`🔑 Using key words for search: ${cleanProductName}`);
    }
    
    // Also try brand name + main product name if available
    // Example: "Cattlemen's Ranch Black Angus Bacon Cheddar Beef Burger Patties"
    // -> Try: "Cattlemen Ranch Burger Patties" or "Black Angus Burger"
    const brandMatch = cleanProductName.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
    const mainProductMatch = cleanProductName.match(/(burger|patties|beef|chicken|pork|fish|cheese|milk|bread|pasta|rice|soup|cereal|yogurt|juice|water|coffee|tea|soda|snack|cookie|cracker|chip|frozen|fresh)/i);
    
    let alternativeSearch = null;
    if (brandMatch && mainProductMatch) {
      alternativeSearch = `${brandMatch[1]} ${mainProductMatch[1]}`;
      console.log(`🔑 Alternative search query: ${alternativeSearch}`);
    }

    // Aldi search URL - trying multiple URL patterns
    // Aldi may use different search endpoints
    const searchUrls = [
      `https://www.aldi.us/en/search.html?q=${encodeURIComponent(cleanProductName)}`,
      `https://www.aldi.us/en/search?q=${encodeURIComponent(cleanProductName)}`,
      `https://www.aldi.us/search?q=${encodeURIComponent(cleanProductName)}`,
    ];

    let response = null;
    let lastError = null;

    // Try each URL pattern
    for (const searchUrl of searchUrls) {
      try {
        console.log(`🔗 Trying Aldi URL: ${searchUrl}`);
        
        // Make request with proper headers to avoid blocking
        response = await axios.get(searchUrl, {
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
          validateStatus: function (status) {
            return status >= 200 && status < 400; // Accept 2xx and 3xx
          },
        });
        
        // If we got a response, break the loop
        if (response && response.data) {
          console.log(`✅ Successfully fetched from: ${searchUrl}`);
          break;
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch from ${searchUrl}:`, error.message);
        lastError = error;
        continue; // Try next URL
      }
    }

    // If all URLs failed, throw error
    if (!response || !response.data) {
      throw new Error(`Failed to fetch from all Aldi URLs. Last error: ${lastError?.message || 'Unknown error'}`);
    }

    // Parse HTML with Cheerio
    const $ = cheerio.load(response.data);
    const products = [];

    // Debug: Log page structure
    console.log(`📄 Page title: ${$('title').text()}`);
    console.log(`📄 Page has ${$('body').length} body elements`);
    
    // Try to find product listings - Aldi uses various selectors
    // Common patterns: .product-item, .product-card, .product-tile, .search-result-item
    // Also try: [class*="product"], [class*="item"], [data-product]
    const productSelectors = [
      '.product-item',
      '.product-card', 
      '.product-tile',
      '[data-product-id]',
      '.search-result-item',
      '.product',
      '.product-box',
      '[class*="product"]',
      '[class*="item"]',
      '[data-product]',
      '.grid-item',
      '.listing-item',
      '.result-item',
    ].join(', ');
    
    console.log(`🔍 Searching for products with selectors: ${productSelectors}`);
    const productElements = $(productSelectors);
    console.log(`📦 Found ${productElements.length} potential product elements`);
    
    productElements.each((index, element) => {
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
    
    // If no products found, log HTML structure for debugging
    if (products.length === 0) {
      console.warn(`⚠️ No products found. Page structure:`);
      console.warn(`   - Body HTML length: ${$('body').html()?.length || 0} chars`);
      console.warn(`   - Has main content: ${$('main, .main, .content, #main, #content').length > 0}`);
      console.warn(`   - Has search results: ${$('[class*="search"], [class*="result"], [id*="search"], [id*="result"]').length > 0}`);
      
      // Try to find any price-like text on the page
      const priceLikeText = $('body').text().match(/\$[\d,]+\.?\d*/g);
      if (priceLikeText && priceLikeText.length > 0) {
        console.warn(`   - Found ${priceLikeText.length} price-like strings: ${priceLikeText.slice(0, 5).join(', ')}`);
      }
    }
    
    return products;

  } catch (error) {
    console.error(`❌ Error scraping Aldi for "${productName}":`, error.message);
    console.error(`❌ Error stack:`, error.stack);
    
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
// options: { brand, productDetails } - optional brand and product details for better search
const getAldiPrice = async (productName, options = {}) => {
  try {
    const { brand, productDetails } = options;
    
    // If we have brand and product details, prioritize brand + product search
    if (brand && productDetails) {
      console.log(`🎯 Using brand + product details for optimized search`);
      console.log(`   Brand: "${brand}"`);
      console.log(`   Product: "${productDetails}"`);
      
      // Try brand + product details first (most specific)
      const brandProductQuery = `${brand} ${productDetails}`;
      console.log(`🔍 Primary search: "${brandProductQuery}"`);
      const brandProductResults = await searchProductOnAldi(brandProductQuery);
      
      if (brandProductResults.length > 0) {
        console.log(`✅ Found ${brandProductResults.length} products with brand+product search`);
        return {
          store: 'Aldi',
          price: brandProductResults[0].price,
          priceText: brandProductResults[0].priceText,
          link: brandProductResults[0].link,
          productName: brandProductResults[0].name,
          attributes: brandProductResults[0].attributes,
          allPrices: brandProductResults,
        };
      }
      
      // If brand+product didn't work, try just brand + key words from product details
      const productWords = productDetails.toLowerCase().split(/\s+/);
      const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'from', 'by'];
      const keyWords = productWords.filter(word => word.length > 3 && !stopWords.includes(word)).slice(0, 3);
      if (keyWords.length > 0) {
        const brandKeyWordsQuery = `${brand} ${keyWords.join(' ')}`;
        console.log(`🔍 Secondary search: "${brandKeyWordsQuery}"`);
        const brandKeyWordsResults = await searchProductOnAldi(brandKeyWordsQuery);
        
        if (brandKeyWordsResults.length > 0) {
          console.log(`✅ Found ${brandKeyWordsResults.length} products with brand+keywords search`);
          return {
            store: 'Aldi',
            price: brandKeyWordsResults[0].price,
            priceText: brandKeyWordsResults[0].priceText,
            link: brandKeyWordsResults[0].link,
            productName: brandKeyWordsResults[0].name,
            attributes: brandKeyWordsResults[0].attributes,
            allPrices: brandKeyWordsResults,
          };
        }
      }
    }
    
    // If product name is too generic (1-2 words), try to expand it
    const words = productName.trim().split(/\s+/);
    if (words.length <= 2 && productName.length < 20) {
      console.log(`⚠️ Product name is too generic: "${productName}"`);
      console.log(`💡 Trying alternative search strategies...`);
      
      // Try common product variations
      const variations = [];
      
      // If it's "BACON & CHEESE" or similar, try burger-related searches
      if (productName.toLowerCase().includes('bacon') && productName.toLowerCase().includes('cheese')) {
        variations.push('burger patties bacon cheese');
        variations.push('beef burger bacon cheddar');
        variations.push('black angus burger bacon');
        // If we have brand, add brand to variations
        if (brand) {
          variations.push(`${brand} burger patties bacon`);
          variations.push(`${brand} beef burger bacon`);
        }
      }
      
      // If it's just "BURGER" or "PATTIES", try common burger searches
      if (productName.toLowerCase().includes('burger') || productName.toLowerCase().includes('patties')) {
        variations.push('beef burger patties');
        variations.push('black angus burger');
        variations.push('cheddar burger patties');
        // If we have brand, add brand to variations
        if (brand) {
          variations.push(`${brand} burger patties`);
          variations.push(`${brand} beef burger`);
        }
      }
      
      // Try all variations
      for (const variation of variations) {
        console.log(`🔄 Trying variation: "${variation}"`);
        const variationProducts = await searchProductOnAldi(variation);
        if (variationProducts.length > 0) {
          console.log(`✅ Found ${variationProducts.length} products with variation: "${variation}"`);
          // Return the cheapest product
          return {
            store: 'Aldi',
            price: variationProducts[0].price,
            priceText: variationProducts[0].priceText,
            link: variationProducts[0].link,
            productName: variationProducts[0].name,
            attributes: variationProducts[0].attributes,
            allPrices: variationProducts,
          };
        }
      }
    }
    
    // Try original product name search
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


