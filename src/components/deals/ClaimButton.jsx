import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import useClaim from '../../hooks/useClaim';
import useAuth from '../../hooks/useAuth';

/**
 * CTA button for claiming a deal, with auth/sold-out/loading/success states.
 */
export default function ClaimButton({ listingId, quantityRemaining }) {
  const { user } = useAuth();
  const { claim, claiming, success, error } = useClaim(listingId);

  // Not logged in
  if (!user) {
    return (
      <Link
        to="/login"
        className="block w-full text-center bg-scarlet text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        Login to Claim
      </Link>
    );
  }

  // Sold out
  if (quantityRemaining <= 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 font-semibold py-3 rounded-lg cursor-not-allowed"
      >
        Sold Out
      </button>
    );
  }

  // Already claimed
  if (success) {
    return (
      <button
        disabled
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
      >
        <Check className="h-5 w-5" />
        Claimed!
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={claim}
        disabled={claiming}
        className="w-full bg-scarlet text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {claiming && <Loader2 className="h-5 w-5 animate-spin" />}
        {claiming ? 'Claiming...' : 'Claim Deal'}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
