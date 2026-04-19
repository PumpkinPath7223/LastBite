import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import DealCard from '../components/deals/DealCard';
import Spinner from '../components/ui/Spinner';
import useFavorites from '../hooks/useFavorites';

export default function MyClaims() {
  const { user } = useAuth();
  const { toggle, isFavorite } = useFavorites();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchClaims() {
      setLoading(true);
      try {
        // Ensure auth session is available for the request
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setDeals([]);
          return;
        }

        const { data: claims, error: claimsError } = await supabase
          .from('claims')
          .select('*')
          .eq('user_id', user.id);

        console.log('Claims result:', JSON.stringify({ claims, claimsError }));

        if (cancelled || !claims?.length) {
          if (!cancelled) setDeals([]);
          return;
        }

        const listingIds = claims.map((c) => c.listing_id || c.deal_id);
        const { data: listings } = await supabase
          .from('listings')
          .select('*')
          .in('id', listingIds);

        if (cancelled) return;

        // Fetch business profiles
        const businessIds = [...new Set((listings || []).map((l) => l.business_id))];
        let usersMap = {};
        if (businessIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, business_name')
            .in('id', businessIds);
          usersMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
        }

        // Merge and preserve claim order
        const listingsMap = Object.fromEntries(
          (listings || []).map((l) => [l.id, { ...l, users: usersMap[l.business_id] || null }])
        );
        setDeals(listingIds.map((id) => listingsMap[id]).filter(Boolean));
      } catch (err) {
        console.error('Error fetching claims:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchClaims();
    return () => { cancelled = true; };
  }, [user?.id]);

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-6 w-6 text-scarlet" />
        <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No claims yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Browse deals and claim something delicious!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isFavorite={isFavorite(deal.id)}
              onFavorite={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
