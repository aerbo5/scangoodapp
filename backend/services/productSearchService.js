// Product search service - Find product links from internet
// Uses Google Custom Search API to find products on shopping sites

const axios = require('axios');

// Search products on internet (Google Shopping, Amazon, etc.)
// Uses single API call to save credits
// Returns: { exactMatches: [], similarProducts: [] }
const searchProductLinks = async (productName, originalProductName = null) => {
  try {
    // Google Custom Search API key and search engine ID
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.warn('⚠️ Google Custom Search API not configured');
      throw new Error('Google Custom Search API not configured.');
    }

    // Clean product name - remove or escape special characters that might cause issues
    // Replace & with 'and' to avoid URL encoding issues
    // Also remove size info from query if present - makes search too specific
    let cleanProductName = productName.replace(/&/g, 'and').replace(/'/g, '');
    
    // Remove size patterns that might make search too specific (e.g., "16oz", "16 oz", "454g")
    // But keep the product name itself
    cleanProductName = cleanProductName
      .replace(/\b\d+\s*(oz|fl\s*oz|ml|g|kg|lb|lbs)\b/gi, '') // Remove size units
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    // Single query to search all sites at once (saves API credits)
    // Use OR operator to search multiple sites in one call
    // Include more stores: Publix, Whole Foods, Winn-Dixie, Kroger, etc.
    // Note: Don't add "single each 1pc" to query - it makes search too specific and may return 0 results
    // Instead, we filter bulk products from results
    const query = `${cleanProductName} (site:amazon.com OR site:target.com OR site:walmart.com OR site:publix.com OR site:wholefoodsmarket.com OR site:winn-dixie.com OR site:kroger.com OR site:safeway.com OR site:google.com/shopping)`;

    console.log('🔍 Calling Google Custom Search API for:', productName);
    console.log('💡 Using single API call to save credits (searching all sites at once)');
    console.log('🧹 Cleaned product name:', cleanProductName);
    
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: searchEngineId,
        q: query,
        num: 10, // Maximum allowed by Google Custom Search API
      },
      timeout: 10000, // 10 second timeout
    });

    const items = response.data.items || [];
    console.log('✅ Custom Search API returned', items.length, 'results');
    
    // Log all sources found in initial search
    const initialSources = {};
    items.forEach(item => {
      const source = extractSource(item.link);
      initialSources[source] = (initialSources[source] || 0) + 1;
    });
    console.log('📊 Initial search sources:', initialSources);
    
    // Check which sites we have results from
    const sitesToCheck = [
      { name: 'Amazon', domain: 'amazon.com' },
      { name: 'Publix', domain: 'publix.com' },
      { name: 'Whole Foods', domain: 'wholefoodsmarket.com' },
      { name: 'Winn-Dixie', domain: 'winn-dixie.com' },
      { name: 'Kroger', domain: 'kroger.com' },
      { name: 'Safeway', domain: 'safeway.com' },
    ];
    
    const foundSites = new Set();
    items.forEach(item => {
      sitesToCheck.forEach(site => {
        if (item.link.includes(site.domain)) {
          foundSites.add(site.name);
        }
      });
    });
    
    // If we're missing results from important sites, do targeted searches
    const missingSites = sitesToCheck.filter(site => !foundSites.has(site.name));
    
    if (missingSites.length > 0 && items.length > 0) {
      console.log(`🔍 Missing results from: ${missingSites.map(s => s.name).join(', ')}`);
      console.log('💡 Performing targeted searches for missing sites...');
      
      // Search for missing sites (limit to 2-3 to save API credits)
      const sitesToSearch = missingSites.slice(0, 3); // Max 3 additional searches
      
      for (const site of sitesToSearch) {
        try {
          // Use cleaned product name for site-specific searches too
          const siteQuery = `${cleanProductName} site:${site.domain}`;
          console.log(`  🔎 Searching ${site.name}...`);
          
          const siteResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
              key: apiKey,
              cx: searchEngineId,
              q: siteQuery,
              num: 10, // Maximum allowed
            },
            timeout: 10000,
          });
          
          const siteItems = siteResponse.data.items || [];
          if (siteItems.length > 0) {
            console.log(`  ✅ Found ${siteItems.length} results from ${site.name}`);
            items.push(...siteItems);
          }
        } catch (error) {
          console.log(`  ⚠️ Search for ${site.name} failed:`, error.message);
        }
      }
    }
    
    // Don't do general search - it gives bad results (e.g., lemon vs watermelon)
    // If no results, return empty
    if (items.length === 0) {
      console.log('⚠️ No results found with product name');
    }
    
    // Format results and extract prices
    const links = items.map(item => {
      // Combine all available text fields for better price extraction
      const combinedText = [
        item.title || '',
        item.snippet || '',
        item.htmlTitle || '',
        item.htmlSnippet || '',
      ].join(' ').trim();
      
      // Log the text we're analyzing for debugging
      if (item.link.includes('target.com')) {
        console.log(`  🔍 Target result - Title: "${item.title}", Snippet: "${item.snippet?.substring(0, 100)}"`);
      }
      
      const priceInfo = extractPriceAndQuantity(combinedText);
      
      // Extract product ID from URL for duplicate detection
      // Target: /A-12345678, Amazon: /dp/B00..., Walmart: /ip/...
      const productId = extractProductId(item.link);
      
      return {
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        source: extractSource(item.link),
        price: priceInfo.price,
        priceText: priceInfo.price ? `$${priceInfo.price.toFixed(2)}` : null,
        quantity: priceInfo.quantity, // e.g., "1", "12", "6-pack"
        isBulk: priceInfo.isBulk, // true if it's a bulk/multi-pack product
        productId: productId, // For duplicate detection
        allPrices: priceInfo.allPrices || [], // Store all found prices for better selection
      };
    });
    
    // Remove duplicates - same product from same source
    // Group by source and productId, keep the one with the best price
    const deduplicatedLinks = [];
    const seenProducts = new Map(); // key: "source:productId"
    
    links.forEach(link => {
      if (!link.productId) {
        // No product ID, use URL as fallback
        const key = `${link.source}:${link.link}`;
        if (!seenProducts.has(key)) {
          seenProducts.set(key, link);
          deduplicatedLinks.push(link);
        } else {
          // Compare prices, keep the one with price if current has no price
          const existing = seenProducts.get(key);
          if (!existing.price && link.price) {
            seenProducts.set(key, link);
            const index = deduplicatedLinks.indexOf(existing);
            if (index > -1) {
              deduplicatedLinks[index] = link;
            }
          }
        }
      } else {
        const key = `${link.source}:${link.productId}`;
        if (!seenProducts.has(key)) {
          seenProducts.set(key, link);
          deduplicatedLinks.push(link);
        } else {
          // Same product from same source - merge prices and keep best one
          const existing = seenProducts.get(key);
          const mergedPrices = [...(existing.allPrices || []), ...(link.allPrices || [])];
          const uniqueMergedPrices = [...new Set(mergedPrices)].sort((a, b) => a - b);
          
          // Choose best price from all available prices
          let bestPrice = null;
          if (uniqueMergedPrices.length > 0) {
            // Prefer prices in reasonable range ($0.50 - $25)
            const reasonablePrices = uniqueMergedPrices.filter(p => p >= 0.50 && p <= 25);
            if (reasonablePrices.length > 0) {
              // Use median of reasonable prices if multiple, otherwise lowest
              if (reasonablePrices.length >= 3) {
                const midIndex = Math.floor(reasonablePrices.length / 2);
                bestPrice = reasonablePrices[midIndex];
              } else {
                bestPrice = reasonablePrices[0];
              }
            } else {
              // No reasonable prices, use median if multiple, otherwise lowest
              if (uniqueMergedPrices.length >= 3) {
                const midIndex = Math.floor(uniqueMergedPrices.length / 2);
                bestPrice = uniqueMergedPrices[midIndex];
              } else {
                bestPrice = uniqueMergedPrices[0];
              }
            }
          }
          
          // Update with best price and merged data
          const updated = {
            ...link,
            price: bestPrice || link.price || existing.price,
            priceText: bestPrice ? `$${bestPrice.toFixed(2)}` : (link.priceText || existing.priceText),
            allPrices: uniqueMergedPrices,
            // Keep better title/snippet (prefer one with price info)
            title: (link.price && !existing.price) ? link.title : existing.title,
            snippet: (link.price && !existing.price) ? link.snippet : existing.snippet,
          };
          
          seenProducts.set(key, updated);
          const index = deduplicatedLinks.indexOf(existing);
          if (index > -1) {
            deduplicatedLinks[index] = updated;
          }
          
          if (uniqueMergedPrices.length > 1) {
            console.log(`  🔄 Merged prices for ${link.source} product: [${uniqueMergedPrices.map(p => p.toFixed(2)).join(', ')}], using $${bestPrice.toFixed(2)}`);
          }
        }
      }
    });
    
    console.log(`🔄 Removed ${links.length - deduplicatedLinks.length} duplicate products`);
    
    // Filter out bulk/multi-pack products - we only want single product prices
    const singleProductLinks = deduplicatedLinks.filter(link => !link.isBulk);
    console.log(`📦 Filtered ${links.length - singleProductLinks.length} bulk/multi-pack products, keeping ${singleProductLinks.length} single products`);

    // Filter out products without prices - ONLY show products with prices
    const linksWithPrices = singleProductLinks.filter(link => link.price && link.price > 0);
    console.log(`💰 Filtered ${singleProductLinks.length - linksWithPrices.length} products without prices, keeping ${linksWithPrices.length} products with prices`);

    // Use original product name for matching if provided, otherwise use cleaned product name
    const matchProductName = originalProductName || productName;
    const cleanMatchName = matchProductName.toLowerCase().replace(/[&']/g, '').trim();
    
    // Separate exact matches from similar products
    const exactMatches = [];
    const similarProducts = [];
    
    linksWithPrices.forEach(link => {
      // Check if this is an exact match - product name must match EXACTLY
      const linkTitle = (link.title || '').toLowerCase();
      const linkSnippet = (link.snippet || '').toLowerCase();
      const combinedText = `${linkTitle} ${linkSnippet}`;
      
      // Extract key words from product name (brand and main product words)
      const productWords = cleanMatchName.split(/\s+/).filter(w => w.length > 2);
      
      // If no product words, skip (shouldn't happen but safety check)
      if (productWords.length === 0) {
        return; // Don't show at all
      }
      
      // Get brand (first word) and product name (remaining words)
      const brandWord = productWords[0]; // First word is usually brand
      const productNameWords = productWords.slice(1); // Rest is product name
      
      // Brand MUST match
      const brandMatches = brandWord && combinedText.includes(brandWord.toLowerCase());
      
      if (!brandMatches) {
        // Brand doesn't match - completely different product, don't show
        return;
      }
      
      // Check how many product name words match
      const matchingProductWords = productNameWords.filter(word => {
        const wordLower = word.toLowerCase();
        return combinedText.includes(wordLower);
      });
      
      const matchingCount = matchingProductWords.length;
      const totalProductWords = productNameWords.length;
      
      // EXACT MATCH: Brand matches AND at least 2 product words match (or all if less than 2)
      // Example: "Wonderful Seedless Lemons" -> needs at least 2 of ["seedless", "lemons"] to match
      // This is more lenient than requiring ALL words
      const isExactMatch = matchingCount >= Math.min(2, totalProductWords);
      
      // SIMILAR PRODUCT: Brand matches BUT less than 2 product words match (but at least 1)
      // Example: "Wonderful Seedless Lemons" -> "Wonderful Organic Lemons" (only "lemons" matches)
      const isSimilar = matchingCount >= 1 && matchingCount < Math.min(2, totalProductWords);
      
      if (isExactMatch) {
        exactMatches.push(link);
      } else if (isSimilar) {
        similarProducts.push(link);
      }
      // If brand matches but NO product words match, don't show (completely different product from same brand)
    });
    
    console.log(`🎯 Found ${exactMatches.length} exact matches and ${similarProducts.length} similar products`);

    // Balance exact matches to ensure we have results from multiple sites
    const balancedExactMatches = balanceResultsBySource(exactMatches);
    
    // Sort exact matches by price (cheapest first, null prices last)
    balancedExactMatches.sort((a, b) => {
      if (!a.price && !b.price) return 0;
      if (!a.price) return 1; // No price goes to end
      if (!b.price) return -1; // No price goes to end
      return a.price - b.price; // Cheapest first
    });
    
    // Sort similar products by price (cheapest first, null prices last)
    similarProducts.sort((a, b) => {
      if (!a.price && !b.price) return 0;
      if (!a.price) return 1; // No price goes to end
      if (!b.price) return -1; // No price goes to end
      return a.price - b.price; // Cheapest first
    });

    // Log final distribution
    const exactSources = {};
    balancedExactMatches.forEach(link => {
      exactSources[link.source] = (exactSources[link.source] || 0) + 1;
    });
    console.log('📊 Exact matches by source:', exactSources);
    
    const similarSources = {};
    similarProducts.forEach(link => {
      similarSources[link.source] = (similarSources[link.source] || 0) + 1;
    });
    console.log('📊 Similar products by source:', similarSources);

    // Return grouped results
    return {
      exactMatches: balancedExactMatches,
      similarProducts: similarProducts.slice(0, 5), // Limit similar products to 5
    };
  } catch (error) {
    console.error('❌ Error searching product links:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(`Failed to search product links: ${error.message}`);
  }
};

// Balance results to ensure we have results from multiple sites
// This helps when one site dominates the results
const balanceResultsBySource = (links) => {
  const sources = ['Amazon', 'Target', 'Walmart', 'Publix', 'Whole Foods', 'Winn-Dixie', 'Kroger', 'Safeway', 'Google Shopping'];
  const bySource = {};
  
  // Group links by source
  links.forEach(link => {
    if (!bySource[link.source]) {
      bySource[link.source] = [];
    }
    bySource[link.source].push(link);
  });

  // If we have results from multiple sites, try to show at least 1-2 from each
  // But prioritize price sorting
  const balanced = [];
  const maxPerSource = 2; // Max 2 results per source to ensure variety (reduced from 3 to show more stores)
  
  // First, add up to maxPerSource from each source
  sources.forEach(source => {
    if (bySource[source]) {
      balanced.push(...bySource[source].slice(0, maxPerSource));
    }
  });

  // Then add remaining links (sorted by price)
  const remaining = links.filter(link => {
    const sourceCount = balanced.filter(b => b.source === link.source).length;
    return sourceCount < maxPerSource || !sources.includes(link.source);
  });

  balanced.push(...remaining);

  // Remove duplicates
  const uniqueLinks = [];
  const seenUrls = new Set();
  
  for (const link of balanced) {
    if (!seenUrls.has(link.link)) {
      seenUrls.add(link.link);
      uniqueLinks.push(link);
    }
  }

  return uniqueLinks;
};

// Extract source from URL
const extractSource = (url) => {
  if (url.includes('amazon.com')) return 'Amazon';
  if (url.includes('target.com')) return 'Target';
  if (url.includes('walmart.com')) return 'Walmart';
  if (url.includes('publix.com')) return 'Publix';
  if (url.includes('wholefoodsmarket.com') || url.includes('wholefoods.com')) return 'Whole Foods';
  if (url.includes('winn-dixie.com')) return 'Winn-Dixie';
  if (url.includes('kroger.com')) return 'Kroger';
  if (url.includes('safeway.com')) return 'Safeway';
  if (url.includes('google.com/shopping')) return 'Google Shopping';
  return 'Other';
};

// Extract product ID from URL for duplicate detection
const extractProductId = (url) => {
  try {
    // Target: https://www.target.com/p/product-name/-/A-12345678
    const targetMatch = url.match(/\/A-(\d+)/);
    if (targetMatch) return `target-${targetMatch[1]}`;
    
    // Amazon: /dp/B00... or /gp/product/B00...
    const amazonMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
    if (amazonMatch) return `amazon-${amazonMatch[1]}`;
    
    // Walmart: /ip/product-name/12345678
    const walmartMatch = url.match(/\/ip\/[^/]+\/(\d+)/);
    if (walmartMatch) return `walmart-${walmartMatch[1]}`;
    
    // Extract a unique identifier from URL path
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p && p.length > 3);
    if (pathParts.length > 0) {
      // Use last significant path segment
      const lastPart = pathParts[pathParts.length - 1];
      // Remove query params and fragments
      return `${extractSource(url)}-${lastPart.split('?')[0].split('#')[0]}`;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Extract price and quantity from text (snippet or title)
// Returns: { price: number, quantity: string, isBulk: boolean, allPrices: number[] }
const extractPriceAndQuantity = (text) => {
  if (!text) return { price: null, quantity: null, isBulk: false, allPrices: [] };
  
  const textLower = text.toLowerCase();
  
  // Check for bulk/multi-pack indicators (more aggressive filtering)
  const bulkIndicators = [
    /\b(pack of|pack|packs)\s+(\d+)/i, // "pack of 12", "6-pack"
    /\b(\d+)\s*-\s*pack/i, // "12-pack", "6-pack"
    /\b(\d+)\s*pack/i, // "12pack", "6pack"
    /\b(bulk|multi-pack|multi pack|set of|bundle of)\s+(\d+)/i, // "bulk 12", "set of 6"
    /\b(\d+)\s*(count|ct|pieces|pcs|units|unit)/i, // "12 count", "6 pieces", "12 units"
    /\b(\d+)\s*x\s*\d+/i, // "12x1" (12 units)
    /\b(\d+)\s*-\s*(\d+)\s*(count|ct|pieces|pcs)/i, // "6-12 count"
    /\bvalue\s+pack/i, // "value pack"
    /\b(\d+)\s*piece/i, // "12 piece"
    /\b(\d+)\s*bottle/i, // "12 bottle" (if quantity > 1)
    /\b(\d+)\s*can/i, // "12 can" (if quantity > 1)
    /\b(\d+)\s*fl\s*oz.*pack/i, // "16.9 fl oz 6-pack"
  ];
  
  // Also check for single product indicators - if found, it's NOT bulk
  const singleProductIndicators = [
    /\beach\b/i,
    /\bper\s+unit\b/i,
    /\bsingle\b/i,
    /\bindividual\b/i,
    /\b1\s*pc\b/i,
    /\b1\s*piece\b/i,
    /\b1\s*bottle\b/i,
    /\b1\s*can\b/i,
    /\b1\s*each\b/i,
  ];
  
  // First, extract price from text
  // Try to find price patterns: $X.XX, $XX.XX, $XXX.XX, etc.
  // Also handle formats like "Price: $5.99" or "$5.99 - $10.99" (take first price)
  // IMPORTANT: Extract ALL prices first, then choose the most reasonable one
  const pricePatterns = [
    /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g, // $5.99, $10.50, $1,234.56 (global match)
    /\$(\d+\.\d{2})/g, // $5.99 (global match)
    /(\d+\.\d{2})\s*USD/g, // 5.99 USD (global match)
    /Price[:\s]*\$?(\d+\.\d{2})/gi, // Price: $5.99 (global match)
    /\$\s*(\d+\.\d{2})/g, // $ 5.99 (with space)
    /(\d+\.\d{2})\s*\$/g, // 5.99 $ (reversed)
    /now[:\s]*\$?(\d+\.\d{2})/gi, // now: $5.99
    /was[:\s]*\$?(\d+\.\d{2})/gi, // was: $5.99
    /save[:\s]*\$?(\d+\.\d{2})/gi, // save: $5.99
    /only[:\s]*\$?(\d+\.\d{2})/gi, // only: $5.99
    /(\d+\.\d{2})\s*each/gi, // 5.99 each
    /(\d+\.\d{2})\s*ea/gi, // 5.99 ea
    /(\d+\.\d{2})\s*per\s*unit/gi, // 5.99 per unit
  ];
  
  // Collect all prices found in the text
  const allPrices = [];
  for (const pattern of pricePatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const priceStr = match[1].replace(/,/g, ''); // Remove commas
      const parsedPrice = parseFloat(priceStr);
      if (parsedPrice > 0 && parsedPrice < 10000) { // Reasonable price range
        allPrices.push(parsedPrice);
      }
    }
  }
  
  // Remove duplicates and sort
  const uniquePrices = [...new Set(allPrices)].sort((a, b) => a - b);
  
  let price = null;
  
  // Choose the most reasonable price for a single product
  if (uniquePrices.length > 0) {
    // Prefer prices in the typical single product range ($0.50 - $25)
    const reasonablePrices = uniquePrices.filter(p => p >= 0.50 && p <= 25);
    
    if (reasonablePrices.length > 0) {
      // If we have multiple reasonable prices, prefer the middle one (not too low, not too high)
      // This helps avoid picking sale prices or incorrect prices
      if (reasonablePrices.length >= 3) {
        // Use median price from reasonable range
        const midIndex = Math.floor(reasonablePrices.length / 2);
        price = reasonablePrices[midIndex];
      } else {
        // Use the lowest reasonable price (most likely single product price)
        price = reasonablePrices[0];
      }
    } else if (uniquePrices.length === 1) {
      // Only one price found, use it
      price = uniquePrices[0];
    } else {
      // Multiple prices but none in reasonable range - use the median if multiple, otherwise lowest
      if (uniquePrices.length >= 3) {
        const midIndex = Math.floor(uniquePrices.length / 2);
        price = uniquePrices[midIndex];
      } else {
        price = uniquePrices[0];
      }
    }
    
    // Log if we filtered out prices (for debugging)
    if (uniquePrices.length > 1) {
      console.log(`  💰 Found ${uniquePrices.length} prices: [${uniquePrices.map(p => p.toFixed(2)).join(', ')}], using $${price.toFixed(2)}`);
    }
  }
  
  // Now check for bulk/single product indicators
  let isBulk = false;
  let quantity = null;
  
  // First check for single product indicators - if found, it's definitely NOT bulk
  const hasSingleIndicator = singleProductIndicators.some(pattern => pattern.test(text));
  if (hasSingleIndicator) {
    quantity = '1';
    isBulk = false;
  } else {
    // Check for bulk/multi-pack indicators
    for (const pattern of bulkIndicators) {
      const match = text.match(pattern);
      if (match) {
        const qty = parseInt(match[1] || match[2] || match[3]) || null;
        if (qty && qty > 1) {
          isBulk = true;
          quantity = qty.toString();
          break;
        }
      }
    }
  }
  
  // Additional check: if price seems too high for a single product, might be bulk
  // (e.g., $24.99 for a water bottle is likely a pack)
  if (price && price > 15 && !hasSingleIndicator && !isBulk) {
    // Check if title/snippet suggests it might be bulk
    const highPriceBulkIndicators = [
      /\b(pack|set|bundle|multi)/i,
      /\b(\d+)\s*(count|ct|pieces|pcs)/i,
    ];
    const mightBeBulk = highPriceBulkIndicators.some(pattern => pattern.test(text));
    if (mightBeBulk) {
      isBulk = true;
    }
  }
  
  // Return all prices found for better duplicate handling
  return { price, quantity, isBulk, allPrices: uniquePrices };
};

module.exports = {
  searchProductLinks,
};
