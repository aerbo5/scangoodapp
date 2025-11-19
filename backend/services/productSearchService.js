// Product search service - Find product links from internet
// Uses Google Custom Search API to find products on shopping sites

const axios = require('axios');

// Search products on internet (Google Shopping, Amazon, etc.)
const searchProductLinks = async (productName) => {
  try {
    // Google Custom Search API key and search engine ID
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.warn('⚠️ Google Custom Search API not configured');
      return getDummyProductLinks(productName);
    }

    // Search query - add shopping sites
    const query = `${productName} buy online site:amazon.com OR site:target.com OR site:walmart.com OR site:google.com/shopping`;

    console.log('🔍 Calling Google Custom Search API for:', productName);
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: searchEngineId,
        q: query,
        num: 10, // Number of results
      },
    });

    const items = response.data.items || [];
    console.log('✅ Custom Search API returned', items.length, 'results');
    
    // Format results and extract prices
    const links = items.map(item => {
      const price = extractPrice(item.snippet || item.title || '');
      return {
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        source: extractSource(item.link),
        price: price, // Extracted price
        priceText: price ? `$${price.toFixed(2)}` : null, // Formatted price text
      };
    });

    // Sort by price (cheapest first, null prices last)
    links.sort((a, b) => {
      if (!a.price && !b.price) return 0;
      if (!a.price) return 1; // No price goes to end
      if (!b.price) return -1; // No price goes to end
      return a.price - b.price; // Cheapest first
    });

    if (links.length > 0) {
      console.log('✅ Returning', links.length, 'product links (sorted by price)');
      return links;
    } else {
      console.log('⚠️ No results found, using dummy data');
      return getDummyProductLinks(productName);
    }
  } catch (error) {
    console.error('❌ Error searching product links:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    console.log('⚠️ Using dummy data as fallback');
    return getDummyProductLinks(productName);
  }
};

// Extract source from URL
const extractSource = (url) => {
  if (url.includes('amazon.com')) return 'Amazon';
  if (url.includes('target.com')) return 'Target';
  if (url.includes('walmart.com')) return 'Walmart';
  if (url.includes('google.com/shopping')) return 'Google Shopping';
  return 'Other';
};

// Extract price from text (snippet or title)
const extractPrice = (text) => {
  if (!text) return null;
  
  // Try to find price patterns: $X.XX, $XX.XX, $XXX.XX, etc.
  // Also handle formats like "Price: $5.99" or "$5.99 - $10.99" (take first price)
  const pricePatterns = [
    /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/, // $5.99, $10.50, $1,234.56
    /\$(\d+\.\d{2})/, // $5.99
    /(\d+\.\d{2})\s*USD/, // 5.99 USD
    /Price[:\s]*\$?(\d+\.\d{2})/i, // Price: $5.99
  ];
  
  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      const priceStr = match[1].replace(/,/g, ''); // Remove commas
      const price = parseFloat(priceStr);
      if (price > 0 && price < 10000) { // Reasonable price range
        return price;
      }
    }
  }
  
  return null;
};

// Dummy product links (fallback)
const getDummyProductLinks = (productName) => {
  const name = productName.toLowerCase();
  
  if (name.includes('avocado') || name.includes('avokado')) {
    return [
      {
        title: 'Avocado - Target',
        link: 'https://www.target.com/p/avocado/-/A-123456',
        snippet: 'Fresh avocado, each - Price: $0.75',
        source: 'Target',
        price: 0.75,
        priceText: '$0.75',
      },
      {
        title: 'Avocado - Amazon Fresh',
        link: 'https://www.amazon.com/avocado/dp/B08XXXXXXX',
        snippet: 'Organic avocado, 1 each - $1.25',
        source: 'Amazon',
        price: 1.25,
        priceText: '$1.25',
      },
      {
        title: 'Avocado - Walmart',
        link: 'https://www.walmart.com/ip/Avocado/123456789',
        snippet: 'Fresh avocado - $0.79',
        source: 'Walmart',
        price: 0.79,
        priceText: '$0.79',
      },
    ].sort((a, b) => a.price - b.price); // Sort by price
  }

  if (name.includes('coca') || name.includes('cola') || name.includes('coke')) {
    return [
      {
        title: 'Coca-Cola Classic - Target',
        link: 'https://www.target.com/p/coca-cola-classic/-/A-123456',
        snippet: 'Coca-Cola Classic, 12 pack - $3.99',
        source: 'Target',
        price: 3.99,
        priceText: '$3.99',
      },
      {
        title: 'Coca-Cola - Amazon',
        link: 'https://www.amazon.com/coca-cola/dp/B08XXXXXXX',
        snippet: 'Coca-Cola Classic, 12 fl oz cans - $4.50',
        source: 'Amazon',
        price: 4.50,
        priceText: '$4.50',
      },
      {
        title: 'Coca-Cola - Walmart',
        link: 'https://www.walmart.com/ip/Coca-Cola/123456789',
        snippet: 'Coca-Cola Classic, 12 pack - $3.79',
        source: 'Walmart',
        price: 3.79,
        priceText: '$3.79',
      },
    ].sort((a, b) => a.price - b.price); // Sort by price
  }

  // Generic fallback
  return [
    {
      title: `${productName} - Google Shopping`,
      link: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(productName)}`,
      snippet: `Search results for ${productName}`,
      source: 'Google Shopping',
    },
  ];
};

module.exports = {
  searchProductLinks,
};

