import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import discountPercent from '../utils/discountPercent';
import formatPrice from '../utils/formatPrice';
import DealTimer from '../components/deals/DealTimer';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import useClaim from '../hooks/useClaim';
import { useAuth } from '../hooks/useAuth';

export default function DealDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const { claim, claiming, success, error: claimError } = useClaim(id);

  useEffect(() => {
    let cancelled = false;

    async function fetchDeal() {
      setLoading(true);
      try {
        const { data: listing, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (cancelled) return;

        if (error) {
          setFetchError(error.message);
          return;
        }

        // Fetch business info separately
        const { data: business } = await supabase
          .from('profiles')
          .select('id, business_name, business_address, lat, lng')
          .eq('id', listing.business_id)
          .single();

        if (cancelled) return;

        setDeal({ ...listing, users: business || null });
      } catch (err) {
        if (!cancelled) setFetchError(err.message || 'Failed to load deal');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDeal();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <Spinner />;

  if (fetchError || !deal) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg text-gray-500">
          {fetchError || 'Deal not found.'}
        </p>
        <Link to="/deals" className="mt-4 inline-block text-scarlet hover:underline">
          Back to deals
        </Link>
      </div>
    );
  }

  const discount = discountPercent(deal.original_price, deal.deal_price);
  const isExpired = new Date(deal.expires_at) <= new Date();
  const isSoldOut = deal.quantity_remaining <= 0;
  const quantityPct =
    deal.quantity_total > 0
      ? (deal.quantity_remaining / deal.quantity_total) * 100
      : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Back button */}
      <Link
        to="/deals"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-scarlet mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to deals
      </Link>

      {/* Photo */}
      {deal.photo_url && (
        <img
          src={deal.photo_url}
          alt={deal.title}
          className="w-full h-64 sm:h-80 object-cover rounded-xl mb-6"
        />
      )}

      {/* Business info */}
      <div className="mb-4">
        {deal.users?.business_name && (
          <p className="text-sm font-medium text-gray-500">
            {deal.users.business_name}
          </p>
        )}
        {deal.users?.business_address && (
          <p className="flex items-center gap-1 text-sm text-gray-400 mt-0.5">
            <MapPin className="h-3.5 w-3.5" />
            {deal.users.business_address}
          </p>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {deal.title}
      </h1>

      {/* Description */}
      {deal.description && (
        <p className="mt-3 text-gray-600 leading-relaxed">
          {deal.description}
        </p>
      )}

      {/* Price display */}
      <div className="flex items-center gap-3 mt-6">
        <span className="text-3xl font-extrabold text-scarlet">
          {formatPrice(deal.deal_price)}
        </span>
        {deal.original_price > deal.deal_price && (
          <span className="text-lg text-gray-400 line-through">
            {formatPrice(deal.original_price)}
          </span>
        )}
        {discount > 0 && (
          <Badge variant="discount">{discount}% OFF</Badge>
        )}
      </div>

      {/* Timer */}
      <div className="mt-4">
        <DealTimer expiresAt={deal.expires_at} />
      </div>

      {/* Quantity bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="font-medium text-gray-700">Remaining</span>
          <span className="text-gray-500">
            {deal.quantity_remaining} / {deal.quantity_total}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-scarlet transition-all duration-300"
            style={{ width: `${quantityPct}%` }}
          />
        </div>
      </div>

      {/* Claim button */}
      <div className="mt-8">
        {success ? (
          <div className="rounded-lg bg-green-50 p-4 text-center text-green-700 font-medium">
            Deal claimed! Show this to the restaurant to redeem.
          </div>
        ) : (
          <>
            {claimError && (
              <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {claimError}
              </div>
            )}
            <Button
              onClick={claim}
              disabled={claiming || isExpired || isSoldOut || !user}
              className="w-full py-3 text-lg"
            >
              {claiming
                ? 'Claiming...'
                : isExpired
                  ? 'Deal Expired'
                  : isSoldOut
                    ? 'Sold Out'
                    : !user
                      ? 'Sign in to Claim'
                      : 'Claim This Deal'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
