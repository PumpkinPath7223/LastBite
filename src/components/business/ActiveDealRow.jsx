import formatPrice from '../../utils/formatPrice';
import DealTimer from '../deals/DealTimer';
import Badge from '../ui/Badge';

export default function ActiveDealRow({ deal }) {
  const {
    title,
    deal_price,
    quantity_remaining,
    quantity_total,
    expires_at,
  } = deal;

  const isExpired = new Date(expires_at) <= new Date();
  const isSoldOut = quantity_remaining <= 0;
  const quantityPct =
    quantity_total > 0 ? (quantity_remaining / quantity_total) * 100 : 0;

  let status = 'active';
  let statusVariant = 'default';

  if (isExpired) {
    status = 'expired';
    statusVariant = 'urgent';
  } else if (isSoldOut) {
    status = 'sold out';
    statusVariant = 'urgent';
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
      {/* Title + price */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{title}</p>
        <p className="text-sm text-scarlet font-semibold mt-0.5">
          {formatPrice(deal_price)}
        </p>
      </div>

      {/* Quantity progress */}
      <div className="w-32 shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Qty</span>
          <span>
            {quantity_remaining}/{quantity_total}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-scarlet transition-all duration-300"
            style={{ width: `${quantityPct}%` }}
          />
        </div>
      </div>

      {/* Time left */}
      <div className="shrink-0">
        <DealTimer expiresAt={expires_at} />
      </div>

      {/* Status badge */}
      <div className="shrink-0">
        <Badge variant={status === 'active' ? 'discount' : statusVariant}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    </div>
  );
}
