'use client';
import LuxuryMap from '@/components/map/LuxuryMap';

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-serif text-5xl mb-2">Available Zones</h1>
      <p className="text-forest-100/60 mb-8 font-light">
        Satellite-identified, confidence-filtered, ready for adoption.
      </p>
      <LuxuryMap />
    </div>
  );
}
