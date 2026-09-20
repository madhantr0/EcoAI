import { supabaseAdmin } from '../src/config/supabase.js';
import { logger } from '../src/utils/logger.js';

const SAMPLE_ZONES = [
  { name: 'Nuwara Eliya Ridge',  region: 'Central Province', country: 'LK', center_lat: 6.9497,  center_lng: 80.7891, radius_meters: 800,  ndvi_baseline: 0.72, ndvi_current: 0.61, confidence_score: 7, land_use: 'forest', rainfall: 'normal', radar_confirm: true },
  { name: 'Amazon Basin Alpha',  region: 'Pará',             country: 'BR', center_lat: -3.4653, center_lng: -62.2159, radius_meters: 1500, ndvi_baseline: 0.81, ndvi_current: 0.68, confidence_score: 8, land_use: 'forest', rainfall: 'normal', radar_confirm: true },
  { name: 'Mau Forest Edge',     region: 'Rift Valley',      country: 'KE', center_lat: -0.2000, center_lng: 35.5000, radius_meters: 1200, ndvi_baseline: 0.66, ndvi_current: 0.58, confidence_score: 6, land_use: 'forest', rainfall: 'normal', radar_confirm: false },
  { name: 'Sumatra Peat Guard',  region: 'Riau',             country: 'ID', center_lat: 0.5897,  center_lng: 101.3431, radius_meters: 1000, ndvi_baseline: 0.74, ndvi_current: 0.64, confidence_score: 7, land_use: 'forest', rainfall: 'normal', radar_confirm: true },
  { name: 'Western Ghats Restore', region: 'Karnataka',      country: 'IN', center_lat: 13.3409, center_lng: 74.7421, radius_meters: 900,  ndvi_baseline: 0.69, ndvi_current: 0.60, confidence_score: 6, land_use: 'forest', rainfall: 'normal', radar_confirm: true },
];

async function main() {
  logger.info('Seeding zones…');
  const { error } = await supabaseAdmin.from('zones').upsert(SAMPLE_ZONES, { onConflict: 'name' });
  if (error) throw error;
  logger.info('Done.');
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
