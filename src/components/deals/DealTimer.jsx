import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Countdown timer that displays time remaining until a deal expires.
 * @param {{ expiresAt: string }} props - ISO 8601 expiry string
 */
export default function DealTimer({ expiresAt }) {
  const [timeString, setTimeString] = useState(() => computeTime(expiresAt));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeString(computeTime(expiresAt));
    }, 1000);

    return () => clearInterval(id);
  }, [expiresAt]);

  const isExpired = timeString === 'Expired';
  const isUrgent = !isExpired && isUnderOneHour(expiresAt);

  const colorClass = isExpired
    ? 'text-red-600'
    : isUrgent
      ? 'text-amber-600'
      : 'text-gray-600';

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${colorClass}`}>
      <Clock className="h-4 w-4" />
      {timeString}
    </span>
  );
}

function computeTime(expiresAt) {
  if (!expiresAt) return 'Expired';

  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expired';

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

function isUnderOneHour(expiresAt) {
  if (!expiresAt) return false;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return diff > 0 && diff < 3600000;
}
