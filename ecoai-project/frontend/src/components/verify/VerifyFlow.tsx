'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useGeolocation } from '@/hooks/useGeolocation';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';

interface Zone {
  id: string;
  name: string;
  region?: string;
  country?: string;
  center_lat: number;
  center_lng: number;
  radius_meters: number;
}

export default function VerifyFlow() {
  const { coords, error: geoErr, loading: geoLoading, request } = useGeolocation();
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneId, setZoneId] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [species, setSpecies] = useState('');
  const [treeCount, setTreeCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ currentHash: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<{ zones: Zone[] }>('/api/zones?status=available').then((d) => setZones(d.zones ?? []));
  }, []);

  async function submit() {
    setErr(null);
    if (!coords) return setErr('Request your GPS location first.');
    if (!zoneId) return setErr('Select a zone.');
    if (!photo) return setErr('Attach a photo.');

    const form = new FormData();
    form.append('zone_id', zoneId);
    form.append('latitude', String(coords.lat));
    form.append('longitude', String(coords.lng));
    form.append('captured_at', new Date().toISOString());
    form.append('caption', caption);
    if (species) form.append('species', species);
    form.append('tree_count', String(treeCount));
    form.append('photo', photo);

    setSubmitting(true);
    try {
      const res = await api<{ chain: { currentHash: string } }>('/api/verify/submit', {
        formData: form,
      });
      setResult({ currentHash: res.chain.currentHash });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <p className="text-xs uppercase tracking-widest text-gold-500 mb-3">Step 1 — Location</p>
        <div className="flex items-center justify-between">
          <div>
            {coords ? (
              <p className="font-mono text-sm">
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </p>
            ) : (
              <p className="text-forest-100/60 text-sm">Awaiting GPS lock</p>
            )}
            {geoErr && <p className="text-red-400 text-xs mt-2">{geoErr}</p>}
          </div>
          <Button onClick={request} disabled={geoLoading} variant="outline">
            {geoLoading ? 'Locating…' : 'Request GPS'}
          </Button>
        </div>
      </GlassPanel>

      <GlassPanel className="p-6">
        <p className="text-xs uppercase tracking-widest text-gold-500 mb-3">Step 2 — Zone</p>
        <select
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
          className="w-full bg-forest-900/60 border border-gold-500/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500"
        >
          <option value="">Select a zone…</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} — {z.region}, {z.country} (r={z.radius_meters}m)
            </option>
          ))}
        </select>
      </GlassPanel>

      <GlassPanel className="p-6 space-y-4">
        <p className="text-xs uppercase tracking-widest text-gold-500">Step 3 — Evidence</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-forest-100/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gold-500/15 file:text-gold-400 hover:file:bg-gold-500/25"
        />
        <input
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Species (optional)"
          className="w-full bg-transparent border-b border-gold-500/20 py-3 text-sm focus:outline-none focus:border-gold-500"
        />
        <input
          type="number"
          min={1}
          max={500}
          value={treeCount}
          onChange={(e) => setTreeCount(Number(e.target.value))}
          className="w-full bg-transparent border-b border-gold-500/20 py-3 text-sm focus:outline-none focus:border-gold-500"
        />
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="w-full bg-transparent border-b border-gold-500/20 py-3 text-sm focus:outline-none focus:border-gold-500"
        />
      </GlassPanel>

      {err && <p className="text-red-400 text-sm">{err}</p>}

      <Button onClick={submit} disabled={submitting} size="lg" className="w-full">
        {submitting ? 'Sealing chain…' : 'Seal & Verify'}
      </Button>

      {result && (
        <GlassPanel hi className="p-6">
          <p className="text-xs uppercase tracking-widest text-gold-500 mb-2">Chain Sealed</p>
          <p className="font-mono text-xs break-all text-gold-400">{result.currentHash}</p>
        </GlassPanel>
      )}
    </div>
  );
}
