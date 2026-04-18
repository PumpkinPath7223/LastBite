import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

export default function ImpactCounter({ count }) {
  const [display, setDisplay] = useState(0);

  // Animated count-up effect
  useEffect(() => {
    if (count <= 0) {
      setDisplay(0);
      return;
    }

    const duration = 1200; // ms
    const steps = 40;
    const increment = count / steps;
    const interval = duration / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), count);
      setDisplay(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplay(count);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-3">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 shrink-0">
        <Leaf className="h-5 w-5 text-green-600" />
      </div>
      <div>
        <p className="text-3xl font-bold text-green-600">{display}</p>
        <p className="text-sm text-gray-500">meals saved from waste</p>
      </div>
    </div>
  );
}
