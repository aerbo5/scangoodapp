/**
 * Calculate total price of items
 * @param {Array} items - Array of items with price properties
 * @param {string} priceKey - Key to use for price calculation (default: 'price')
 * @returns {string} Formatted total price
 */
export const calculateTotal = (items, priceKey = 'price') => {
  if (!items || items.length === 0) return '0.00';
  return items.reduce((sum, item) => {
    const price = parseFloat(item[priceKey]) || 0;
    return sum + price;
  }, 0).toFixed(2);
};

/**
 * Calculate savings between paid and target prices
 * @param {Array} items - Array of items with price and targetPrice properties
 * @returns {string} Formatted savings amount
 */
export const getSavings = (items) => {
  if (!items || items.length === 0) return '0.00';
  const paid = parseFloat(calculateTotal(items, 'price')) || 0;
  const best = parseFloat(calculateTotal(items, 'targetPrice')) || 0;
  const savings = paid - best;
  return savings > 0 ? savings.toFixed(2) : '0.00';
};

