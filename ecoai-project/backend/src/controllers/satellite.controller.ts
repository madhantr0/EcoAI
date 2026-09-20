import type { Response } from 'express';
import { z } from 'zod';
import { calculateConfidence, fetchNdvi } from '../services/satellite.service.js';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthedRequest } from '../middleware/auth.js';

const previewSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  landUse: z.enum(['forest', 'grassland', 'shrub', 'other']).default('forest'),
  rainfall: z.enum(['normal', 'drought', 'excess']).default('normal'),
  radarConfirm: z.coerce.boolean().default(true),
  wildfireDetected: z.coerce.boolean().default(false),
});

export async function previewConfidence(req: AuthedRequest, res: Response) {
  const body = previewSchema.parse(req.body);
  const ndvi = await fetchNdvi(body.latitude, body.longitude);
  const score = calculateConfidence({
    latitude: body.latitude,
    longitude: body.longitude,
    ndviBaseline: ndvi.baseline,
    ndviCurrent: ndvi.current,
    landUse: body.landUse,
    rainfall: body.rainfall,
    radarConfirm: body.radarConfirm,
    wildfireDetected: body.wildfireDetected,
  });
  res.json({ ndvi, confidence: score });
}

const upsertZoneSchema = z.object({
  name: z.string().min(2),
  region: z.string().optional(),
  country: z.string().length(2),
  center_lat: z.coerce.number(),
  center_lng: z.coerce.number(),
  radius_meters: z.coerce.number().int().min(100).max(5000).default(500),
  land_use: z.enum(['forest', 'grassland', 'shrub', 'other']).default('forest'),
  rainfall: z.enum(['normal', 'drought', 'excess']).default('normal'),
  radar_confirm: z.coerce.boolean().default(true),
  wildfire_detected: z.coerce.boolean().default(false),
});

export async function createZoneFromSatellite(req: AuthedRequest, res: Response) {
  const body = upsertZoneSchema.parse(req.body);
  const ndvi = await fetchNdvi(body.center_lat, body.center_lng);
  const confidence = calculateConfidence({
    latitude: body.center_lat,
    longitude: body.center_lng,
    ndviBaseline: ndvi.baseline,
    ndviCurrent: ndvi.current,
    landUse: body.land_use,
    rainfall: body.rainfall,
    radarConfirm: body.radar_confirm,
    wildfireDetected: body.wildfire_detected,
  });
  const { data, error } = await supabaseAdmin
    .from('zones')
    .insert({
      name: body.name,
      region: body.region,
      country: body.country,
      center_lat: body.center_lat,
      center_lng: body.center_lng,
      radius_meters: body.radius_meters,
      ndvi_baseline: ndvi.baseline,
      ndvi_current: ndvi.current,
      confidence_score: confidence,
      land_use: body.land_use,
      rainfall: body.rainfall,
      radar_confirm: body.radar_confirm,
      wildfire_detected: body.wildfire_detected,
      status: confidence >= 6 ? 'available' : 'flagged',
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ zone: data });
}
