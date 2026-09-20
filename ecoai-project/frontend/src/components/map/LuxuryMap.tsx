'use client';
import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { api } from '@/lib/api';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';

interface Zone {
  id: string;
  name: string;
  region?: string;
  country?: string;
  center_lat: number;
  center_lng: number;
  confidence_score: number;
  radius_meters: number;
  status: string;
}

export default function LuxuryMap() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selected, setSelected] = useState<Zone | null>(null);
  const [viewState, setViewState] = useState({ latitude: 6.9, longitude: 79.9, zoom: 2.2 });

  useEffect(() => {
    api<{ zones: Zone[] }>('/api/zones?status=available').then((d) => setZones(d.zones ?? []));
  }, []);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <GlassPanel className="p-6 text-forest-100/70">
        Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to render the map.
      </GlassPanel>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden border border-gold-500/15 shadow-luxe">
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken={token}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '100%', height: '600px' }}
      >
        {zones.map((z) => (
          <Marker key={z.id} latitude={z.center_lat} longitude={z.center_lng} anchor="center">
            <button
              onClick={() => setSelected(z)}
              className="relative"
              aria-label={z.name}
            >
              <span className="block w-4 h-4 rounded-full bg-gold-500 shadow-glow" />
              <span className="absolute inset-0 w-4 h-4 rounded-full bg-gold-500/40 animate-ping" />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.center_lat}
            longitude={selected.center_lng}
            onClose={() => setSelected(null)}
            closeButton={false}
            anchor="bottom"
          >
            <div>
              <p className="font-serif text-lg text-gold-400">{selected.name}</p>
              <p className="text-xs opacity-70 mb-2">
                {selected.region}, {selected.country}
              </p>
              <p className="text-xs mb-3">
                Confidence <span className="text-gold-400">{selected.confidence_score}/8</span>
              </p>
              <Button
                size="sm"
                onClick={async () => {
                  try {
                    await api('/api/zones/adopt', {
                      method: 'POST',
                      body: { zone_id: selected.id },
                    });
                    setSelected(null);
                    const d = await api<{ zones: Zone[] }>('/api/zones?status=available');
                    setZones(d.zones ?? []);
                  } catch (e: any) {
                    alert(e.message);
                  }
                }}
              >
                Adopt Zone
              </Button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
