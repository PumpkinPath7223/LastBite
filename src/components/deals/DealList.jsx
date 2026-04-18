import DealCard from './DealCard';

/**
 * Responsive grid of DealCards with an empty-state fallback.
 */
export default function DealList({ deals, favorites, onFavorite }) {
  if (!deals || deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-500 text-lg font-medium">No deals available right now.</p>
        <p className="text-gray-400 text-sm mt-1">Check back soon for fresh offers!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          isFavorite={favorites?.has(deal.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}
