import { useState, useMemo } from 'react';
import { List, Map, Search } from 'lucide-react';
import useListings from '../hooks/useListings';
import useFavorites from '../hooks/useFavorites';
import CategoryFilter from '../components/deals/CategoryFilter';
import DealList from '../components/deals/DealList';
import DealMap from '../components/deals/DealMap';
import Spinner from '../components/ui/Spinner';

export default function StudentHome() {
  const { listings, loading, error, category, setCategory } = useListings();
  const { toggle, isFavorite } = useFavorites();

  const [view, setView] = useState('list'); // 'list' | 'map'
  const [search, setSearch] = useState('');

  // Build a Set of favorite IDs for DealList
  const favSet = useMemo(() => {
    return new Set(
      listings.filter((d) => isFavorite(d.id)).map((d) => d.id)
    );
  }, [listings, isFavorite]);

  // Filter by search query
  const filtered = useMemo(() => {
    if (!search.trim()) return listings;
    const q = search.toLowerCase();
    return listings.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.users?.business_name?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
    );
  }, [listings, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search deals or restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet"
        />
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <CategoryFilter selected={category} onChange={setCategory} />

        <div className="flex shrink-0 rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'list'
                ? 'bg-scarlet text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="h-4 w-4" />
            List
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'map'
                ? 'bg-scarlet text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Map className="h-4 w-4" />
            Map
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <Spinner />}

      {/* Content */}
      {!loading && view === 'list' && (
        <DealList
          deals={filtered}
          favorites={favSet}
          onFavorite={toggle}
        />
      )}

      {!loading && view === 'map' && (
        <DealMap deals={filtered} />
      )}
    </div>
  );
}
