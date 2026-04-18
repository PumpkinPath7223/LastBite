import { useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from './useAuth';

/**
 * Claim a deal listing via the claim_deal RPC.
 * @param {string} listingId
 */
export default function useClaim(listingId) {
  const { user } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function claim() {
    if (!user?.id) {
      setError('You must be signed in to claim a deal.');
      return;
    }

    setClaiming(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: rpcError } = await supabase.rpc('claim_deal', {
        p_listing_id: listingId,
        p_user_id: user.id,
      });

      if (rpcError) {
        setError(rpcError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to claim deal');
    } finally {
      setClaiming(false);
    }
  }

  return { claim, claiming, success, error };
}
