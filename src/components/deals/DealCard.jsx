import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import discountPercent from '../../utils/discountPercent';
import formatPrice from '../../utils/formatPrice';
import DealTimer from './DealTimer';

/**
 * Card component for a single deal listing.
 */
export default function DealCard({ deal, onFavorite, isFavorite }) {
  const {
    id,
    title,
    photo_url,
    original_price,
    deal_price,
    quantity_remaining,
    expires_at,
    users,
  } = deal;

  const discount = discountPercent(original_price, deal_price);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Photo section */}
      <div className="relative">
        <Link to={`/deals/${id}`}>
          <img
            src={photo_url}
            alt={title}
            className="h-48 w-full object-cover"
          />
        </Link>

        {/* Discount badge - top left */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}

        {/* Favorite button - top right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite?.(id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
            }`}
          />
        </button>
      </div>

      {/* Body */}
      <Link to={`/deals/${id}`} className="block p-4">
        {users?.business_name && (
          <p className="text-xs text-gray-500 mb-1">{users.business_name}</p>
        )}

        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>

        {/* Prices */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-scarlet font-bold">{formatPrice(deal_price)}</span>
          {original_price > deal_price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(original_price)}
            </span>
          )}
        </div>

        {/* Timer + quantity */}
        <div className="flex items-center justify-between mt-3">
          <DealTimer expiresAt={expires_at} />
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {quantity_remaining} left
          </span>
        </div>
      </Link>
    </div>
  );
}
