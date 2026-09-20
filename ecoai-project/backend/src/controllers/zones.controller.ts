import type { Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthedRequest } from '../middleware/auth.js';

export async function listZones(req: AuthedRequest, res: Response) {
  const { status, limit = '50' } = req.query as Record<string, string>;
  let query = supabaseAdmin.from('zones').select('*').limit(Number(limit));
  if (status) query = query.eq('status', status);
  const { data, error } = await query.order('confidence_score', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ zones: data });
}

export async function getZone(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin.from('zones').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Zone not found' });
  res.json({ zone: data });
}

const adoptSchema = z.object({ zone_id: z.string().uuid() });

export async function adoptZone(req: AuthedRequest, res: Response) {
  const { zone_id } = adoptSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('zones')
    .update({
      status: 'adopted',
      adopted_by: req.user!.id,
      adopted_at: new Date().toISOString(),
    })
    .eq('id', zone_id)
    .eq('status', 'available')
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ zone: data });
}
