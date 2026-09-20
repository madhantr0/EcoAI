import { supabaseAdmin } from '../src/config/supabase.js';
import { calculateConfidence, fetchNdvi } from '../src/services/satellite.service.js';
import { logger } from '../src/utils/logger.js';

/**
 * Scheduled job: refresh NDVI + confidence for every zone that is
 * still "available" or "adopted". Zones scoring < 6 are flagged.
 */
async function main() {
  logger.info('Running satellite refresh job');
  const { data: zones, error } = await supabaseAdmin
    .from('zones')
    .select('*')
    .in('status', ['available', 'adopted']);
  if (error) throw error;

  for (const zone of zones ?? []) {
    const ndvi = await fetchNdvi(zone.center_lat, zone.center_lng);
    const confidence = calculateConfidence({
      latitude: zone.center_lat,
      longitude: zone.center_lng,
      ndviBaseline: zone.ndvi_baseline ?? ndvi.baseline,
      ndviCurrent: ndvi.current,
      landUse: zone.land_use ?? 'forest',
      rainfall: zone.rainfall ?? 'normal',
      radarConfirm: zone.radar_confirm ?? false,
      wildfireDetected: zone.wildfire_detected ?? false,
    });
    await supabaseAdmin
      .from('zones')
      .update({
        ndvi_baseline: zone.ndvi_baseline ?? ndvi.baseline,
        ndvi_current: ndvi.current,
        confidence_score: confidence,
        status: confidence >= 6 ? zone.status : 'flagged',
      })
      .eq('id', zone.id);
    logger.debug({ zone: zone.name, confidence }, 'Updated');
  }
  logger.info('Satellite refresh complete');
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
