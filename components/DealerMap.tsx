'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icône Leaflet (bug webpack/Next.js)
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface DealerMapProps {
  dealerName?: string | null;
  dealerCity?: string | null;
  dealerAddress?: string | null;
  dealerPostalCode?: string | null;
  dealerCountry?: string | null;
  dealerLat?: number | null;
  dealerLng?: number | null;
}

interface GeoResult {
  lat: number;
  lng: number;
}

async function geocode(query: string): Promise<GeoResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=de,at,ch`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'fr', 'User-Agent': 'VanalexCars/1.0' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export default function DealerMap({
  dealerName,
  dealerCity,
  dealerAddress,
  dealerPostalCode,
  dealerCountry,
  dealerLat,
  dealerLng,
}: DealerMapProps) {
  const [geo, setGeo] = useState<GeoResult | null>(
    dealerLat && dealerLng ? { lat: dealerLat, lng: dealerLng } : null
  );
  const [loading, setLoading] = useState(!dealerLat || !dealerLng);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (dealerLat && dealerLng) {
      setGeo({ lat: dealerLat, lng: dealerLng });
      setLoading(false);
      return;
    }

    const parts = [dealerName, dealerAddress, dealerPostalCode, dealerCity, dealerCountry || 'Allemagne'].filter(Boolean);
    if (!dealerCity && !dealerAddress) {
      setFailed(true);
      setLoading(false);
      return;
    }

    const fullQuery = parts.join(', ');

    geocode(fullQuery).then(result => {
      if (result) {
        setGeo(result);
        setLoading(false);
      } else if (dealerCity) {
        // Fallback : juste ville + pays
        geocode(`${dealerCity}, ${dealerCountry || 'Allemagne'}`).then(r2 => {
          if (r2) setGeo(r2);
          else setFailed(true);
          setLoading(false);
        });
      } else {
        setFailed(true);
        setLoading(false);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerLat, dealerLng, dealerCity, dealerAddress]);

  if (loading) {
    return (
      <div className='h-[300px] bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800'>
        <div className='text-center text-gray-400'>
          <div className='inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-premium-gold border-r-transparent mb-2'></div>
          <p className='text-sm'>Localisation en cours...</p>
        </div>
      </div>
    );
  }

  if (failed || !geo) {
    return (
      <div className='h-20 bg-gray-900/30 rounded-xl flex items-center justify-center border border-gray-800/50'>
        <p className='text-gray-600 text-sm'>📍 Localisation exacte non disponible</p>
      </div>
    );
  }

  const markerLabel = [dealerName, dealerCity, dealerCountry || 'Allemagne'].filter(Boolean).join(' — ');

  return (
    <div>
      <MapContainer
        center={[geo.lat, geo.lng]}
        zoom={14}
        style={{ height: '300px', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[geo.lat, geo.lng]}>
          <Popup>{markerLabel}</Popup>
        </Marker>
      </MapContainer>
      <p className='text-xs text-gray-500 mt-2 text-center'>
        📍 {markerLabel}
      </p>
    </div>
  );
}
