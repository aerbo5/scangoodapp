// Store data and price comparison service

// Dummy store database (in production, use real API or database)
const STORES = [
  {
    id: 1,
    name: 'Target',
    address: '1045 5th Street Unit 201, Miami, FL',
    latitude: 25.7617,
    longitude: -80.1918,
    distance: '8.4 mi',
  },
  {
    id: 2,
    name: 'Whole Foods Market',
    address: '6701 Red Road, Miami, FL',
    latitude: 25.7617,
    longitude: -80.1918,
    distance: '1.9 mi',
  },
  {
    id: 3,
    name: 'Walmart',
    address: '11253 Pines Blvd, Hollywood, FL',
    latitude: 25.7617,
    longitude: -80.1918,
    distance: '5.2 mi',
  },
];

// Get nearby stores
const getNearbyStores = (latitude, longitude, radius = 10) => {
  // In production, use geolocation calculation
  // For now, return all stores
  return STORES.map(store => ({
    ...store,
    distance: calculateDistance(latitude, longitude, store.latitude, store.longitude),
  })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(1) + ' mi';
};

// Compare prices across stores
const comparePrices = (items) => {
  const storeComparisons = STORES.map(store => {
    let total = 0;
    const itemPrices = items.map(item => {
      // In production, lookup actual prices from store API
      // For now, use dummy prices
      const price = item.price * (0.9 + Math.random() * 0.2); // Random variation
      total += price;
      return {
        ...item,
        price: parseFloat(price.toFixed(2)),
        storePrice: parseFloat(price.toFixed(2)),
      };
    });

    return {
      store: store.name,
      address: store.address,
      distance: store.distance,
      items: itemPrices,
      total: parseFloat(total.toFixed(2)),
    };
  });

  // Calculate savings
  const baselineTotal = items.reduce((sum, item) => sum + item.price, 0);
  const comparisons = storeComparisons.map(comparison => ({
    ...comparison,
    savings: parseFloat((baselineTotal - comparison.total).toFixed(2)),
  }));

  // Find best store
  const bestStore = comparisons.reduce((best, current) => 
    current.savings > best.savings ? current : best
  );

  return {
    stores: comparisons,
    bestStore: bestStore.store,
    totalSavings: bestStore.savings,
  };
};

module.exports = {
  getNearbyStores,
  comparePrices,
  STORES,
};




