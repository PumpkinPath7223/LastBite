import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { OSU_CENTER, MAP_ZOOM } from '../../lib/constants';
import formatPrice from '../../utils/formatPrice';

// Fix Leaflet default icon issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Leaflet map showing deal markers around campus.
 */
export default function DealMap({ deals }) {
  return (
    <MapContainer
      center={OSU_CENTER}
      zoom={MAP_ZOOM}
      className="h-[500px] w-full rounded-xl overflow-hidden"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {deals?.map((deal) => {
        const lat = deal.users?.lat;
        const lng = deal.users?.lng;
        if (lat == null || lng == null) return null;

        return (
          <Marker key={deal.id} position={[lat, lng]}>
            <Popup>
              <div className="text-sm">
                {deal.users?.business_name && (
                  <p className="font-semibold">{deal.users.business_name}</p>
                )}
                <p>{deal.title}</p>
                <p className="font-bold text-scarlet">{formatPrice(deal.deal_price)}</p>
                <Link
                  to={`/deals/${deal.id}`}
                  className="text-scarlet underline text-xs mt-1 inline-block"
                >
                  View Deal
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
