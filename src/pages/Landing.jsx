import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Leaf, DollarSign, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const [mealsSaved, setMealsSaved] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      const { count } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true });
      if (count != null) setMealsSaved(count);
    }
    fetchCount();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-scarlet to-scarlet-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <UtensilsCrossed className="h-8 w-8" />
              <span className="text-2xl font-bold">LastBite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Save Food. Save Money.
            </h1>
            <p className="mt-2 text-xl sm:text-2xl font-semibold text-white/90">
              Go Bucks!
            </p>
            <p className="mt-6 text-lg text-white/80 max-w-lg">
              Grab discounted meals from your favorite spots near OSU campus
              before they go to waste.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/deals"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-scarlet shadow hover:bg-gray-100 transition-colors"
              >
                Browse Deals
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                I'm a Restaurant
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full text-gray-50" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,60 L0,20 Q720,0 1440,20 L1440,60 Z" />
          </svg>
        </div>
      </section>

      {/* Impact Counter */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Leaf className="h-10 w-10 text-green-600 mb-3" />
            <p className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              {mealsSaved.toLocaleString()}
            </p>
            <p className="mt-2 text-lg text-gray-600">meals saved from waste</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
            Why LastBite?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Save Money */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-scarlet/10 mb-4">
                <DollarSign className="h-7 w-7 text-scarlet" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Save Money</h3>
              <p className="mt-2 text-gray-600">
                Get discounted food from restaurants near campus. Stretch your
                meal plan further.
              </p>
            </div>

            {/* Reduce Waste */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                <Leaf className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Reduce Waste</h3>
              <p className="mt-2 text-gray-600">
                Every meal claimed is one less meal thrown away. Help make OSU
                more sustainable.
              </p>
            </div>

            {/* Support Local */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-amber-100 mb-4">
                <ShoppingBag className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Support Local</h3>
              <p className="mt-2 text-gray-600">
                Keep your dollars in the community by supporting local
                restaurants around campus.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
