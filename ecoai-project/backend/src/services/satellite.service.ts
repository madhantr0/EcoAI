import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface ZoneObservation {
  latitude: number;
  longitude: number;
  ndviBaseline: number;
  ndviCurrent: number;
  landUse: 'forest' | 'grassland' | 'shrub' | 'other';
  rainfall: 'normal' | 'drought' | 'excess';
  radarConfirm: boolean;
  wildfireDetected: boolean;
}

/**
 * Fetches NDVI from the NASA MODIS REST API for a given point.
 * Falls back to a deterministic synthetic value if credentials are missing
 * so that development and CI continue to work.
 */
export async function fetchNdvi(
  latitude: number,
  longitude: number,
  startDate = '2024-01-01',
  endDate = '2024-12-31',
): Promise<{ baseline: number; current: number }> {
  if (!env.EARTHDATA_USERNAME || !env.EARTHDATA_PASSWORD) {
    logger.warn('Earthdata credentials missing — returning synthetic NDVI');
    return syntheticNdvi(latitude, longitude);
  }

  try {
    const url = `${env.MODIS_API_BASE}/MCD43A4.061/ndvi`;
    const { data } = await axios.get(url, {
      params: {
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        startDate,
        endDate,
        band: '250m_16_days_NDVI',
      },
      auth: { username: env.EARTHDATA_USERNAME, password: env.EARTHDATA_PASSWORD },
      timeout: 15_000,
    });
    const values: number[] = (data?.subset ?? []).map((r: any) => r.value).filter(Boolean);
    const baseline = mean(values);
    const current = values.length ? mean(values.slice(-4)) : baseline;
    return { baseline, current };
  } catch (err) {
    logger.warn({ err }, 'MODIS fetch failed — falling back to synthetic');
    return syntheticNdvi(latitude, longitude);
  }
}

function mean(a: number[]): number {
  if (!a.length) return 0;
  return a.reduce((s, n) => s + n, 0) / a.length;
}

function syntheticNdvi(lat: number, lng: number): { baseline: number; current: number } {
  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233)) % 1;
  const baseline = 0.55 + seed * 0.30;
  const current = baseline - 0.05 - seed * 0.12;
  return { baseline, current };
}

/**
 * The 6/8 luxury confidence filter.
 * Score of 6+ → "high confidence" zone eligible for adoption.
 */
export function calculateConfidence(obs: ZoneObservation): number {
  let score = 0;
  if (obs.ndviCurrent < obs.ndviBaseline - 0.05) score += 2;
  if (obs.landUse === 'forest') score += 2;
  if (!obs.wildfireDetected) score += 1;
  if (obs.rainfall === 'normal') score += 1;
  if (obs.radarConfirm) score += 2;
  return score;
}
