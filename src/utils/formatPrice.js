/**
 * Format a number as a USD price string.
 * @param {number} amount
 * @returns {string} e.g. "$4.99"
 */
export default function formatPrice(amount) {
  if (amount == null || isNaN(amount)) return '$0.00';
  return `$${Number(amount).toFixed(2)}`;
}
