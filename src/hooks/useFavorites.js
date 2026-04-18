import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from './useAuth';

/**
 * Manage the current user's favorite listings.
 */
export default function useFavorites() {
  const { user } = useAuth();
  const userId = user?.id;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites with joined listing data
  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchFavorites() {
      setLoading(true);

      const { data: favsData, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId);

      if (cancelled) return;

      if (!error && favsData && favsData.length > 0) {
        const listingIds = favsData.map((f) => f.listing_id);
        const { data: listingsData } = await supabase
          .from('listings')
          .select('*')
          .in('id', listingIds);
        const listingsMap = Object.fromEntries(
          (listingsData || []).map((l) => [l.id, l])
        );
        setFavorites(
          favsData.map((f) => ({ ...f, listing: listingsMap[f.listing_id] || null }))
        );
      } else {
        setFavorites([]);
      }

      setLoading(false);
    }

    fetchFavorites();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Toggle a listing as favorite (add if missing, remove if present)
  const toggle = useCallback(
    async (listingId) => {
      if (!userId) return;

      const existing = favorites.find((f) => f.listing_id === listingId);

      if (existing) {
        // Remove
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId);

        setFavorites((prev) => prev.filter((f) => f.listing_id !== listingId));
      } else {
        // Add
        const { data: newFav } = await supabase
          .from('favorites')
          .insert({ user_id: userId, listing_id: listingId })
          .select('*')
          .single();

        if (newFav) {
          const { data: listing } = await supabase
            .from('listings')
            .select('*')
            .eq('id', listingId)
            .single();
          setFavorites((prev) => [...prev, { ...newFav, listing: listing || null }]);
        }
      }
    },
    [userId, favorites]
  );

  // Check if a listing is favorited
  const isFavorite = useCallback(
    (listingId) => favorites.some((f) => f.listing_id === listingId),
    [favorites]
  );

  return { favorites, loading, toggle, isFavorite };
}
