import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Fetch active listings with realtime updates and optional category filtering.
 */
export default function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');

  // Fetch active listings
  useEffect(() => {
    let cancelled = false;

    async function fetchListings() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('listings')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .gt('quantity_remaining', 0)
        .order('created_at', { ascending: false });

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data: listingsData, error: fetchError } = await query;
      console.log('Listings fetch result:', { listingsData, fetchError });

      if (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
          setLoading(false);
        }
        return;
      }

      // Fetch business users separately and merge
      const businessIds = [...new Set((listingsData || []).map((l) => l.business_id))];
      let usersMap = {};
      if (businessIds.length > 0) {
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, business_name, business_address, lat, lng')
          .in('id', businessIds);
        if (usersData) {
          usersMap = Object.fromEntries(usersData.map((u) => [u.id, u]));
        }
      }

      if (cancelled) return;

      const data = (listingsData || []).map((l) => ({
        ...l,
        users: usersMap[l.business_id] || null,
      }));

      setListings(data);
      setLoading(false);
    }

    fetchListings();

    return () => {
      cancelled = true;
    };
  }, [category]);

  // Subscribe to realtime UPDATE events on the listings table
  useEffect(() => {
    const channel = supabase
      .channel('listings-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'listings' },
        (payload) => {
          setListings((prev) =>
            prev.map((listing) => {
              if (listing.id === payload.new.id) {
                return {
                  ...listing,
                  quantity_remaining: payload.new.quantity_remaining,
                };
              }
              return listing;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { listings, loading, error, category, setCategory };
}
