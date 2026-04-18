/**
 * Calculate the discount percentage between an original price and a deal price.
 * @param {number} originalPrice
 * @param {number} dealPrice
 * @returns {number} Integer percentage, e.g. 48 for 48% off
 */
export default function discountPercent(originalPrice, dealPrice) {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (dealPrice == null || dealPrice < 0) return 0;

  const pct = ((originalPrice - dealPrice) / originalPrice) * 100;
  return Math.round(pct);
}
