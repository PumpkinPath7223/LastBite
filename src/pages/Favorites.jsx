import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';
import DealCard from '../components/deals/DealCard';
import Spinner from '../components/ui/Spinner';

export default function Favorites() {
  const { favorites, loading, toggle, isFavorite } = useFavorites();

  // Extract the listing objects from the favorites join
  const deals = useMemo(
    () => favorites.map((f) => f.listing).filter(Boolean),
    [favorites]
  );

  const favSet = useMemo(
    () => new Set(deals.map((d) => d.id)),
    [deals]
  );

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-6 w-6 text-scarlet" />
        <h1 className="text-2xl font-bold text-gray-900">Your Favorites</h1>
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            No favorites yet.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Browse deals to find something you like!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isFavorite={favSet.has(deal.id)}
              onFavorite={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
