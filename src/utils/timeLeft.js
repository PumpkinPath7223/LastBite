/**
 * Return a human-readable string describing the time remaining until an expiry.
 * @param {string} expiresAt - ISO 8601 date string
 * @returns {string} e.g. "2h 15m left", "45m left", "Expired"
 */
export default function timeLeft(expiresAt) {
  if (!expiresAt) return 'Expired';

  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();
  const diff = expiry - now;

  if (diff <= 0) return 'Expired';

  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m left`;
  if (hours > 0) return `${hours}h left`;
  return `${minutes}m left`;
}
