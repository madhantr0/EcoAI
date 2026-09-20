import type { Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { uploadPhoto } from '../services/storage.service.js';
import { appendToChain, verifyChainIntegrity } from '../services/hashchain.service.js';
import { haversineMeters, isWithinZone } from '../services/gps.service.js';
import { recordCheckin } from '../services/streak.service.js';
import type { AuthedRequest } from '../middleware/auth.js';

const GPS_TOLERANCE_M = 50;

const verifySchema = z.object({
  zone_id: z.string().uuid(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  captured_at: z.string().datetime(),
  species: z.string().optional(),
  tree_count: z.coerce.number().int().min(1).max(500).default(1),
  caption: z.string().max(500).optional(),
});

export async function submitVerification(req: AuthedRequest, res: Response) {
  const body = verifySchema.parse(req.body);
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: 'Photo is required' });

  const { data: zone, error: zoneErr } = await supabaseAdmin
    .from('zones')
    .select('*')
    .eq('id', body.zone_id)
    .single();
  if (zoneErr || !zone) return res.status(404).json({ error: 'Zone not found' });

  const distance = haversineMeters(
    body.latitude,
    body.longitude,
    zone.center_lat,
    zone.center_lng,
  );
  const inside = isWithinZone(
    { lat: body.latitude, lng: body.longitude },
    { lat: zone.center_lat, lng: zone.center_lng, radius: zone.radius_meters },
    GPS_TOLERANCE_M,
  );
  if (!inside) {
    return res.status(400).json({
      error: 'Location does not match zone',
      distance_m: Math.round(distance),
      allowed_m: zone.radius_meters + GPS_TOLERANCE_M,
    });
  }

  const imageUrl = await uploadPhoto(
    req.user!.id,
    file.originalname,
    file.buffer,
    file.mimetype,
  );

  const { prevHash, currentHash } = await appendToChain({
    userId: req.user!.id,
    latitude: body.latitude,
    longitude: body.longitude,
    timestamp: body.captured_at,
    imageUrl,
  });

  const { data: post, error: postErr } = await supabaseAdmin
    .from('posts')
    .insert({
      user_id: req.user!.id,
      zone_id: body.zone_id,
      image_url: imageUrl,
      caption: body.caption,
      latitude: body.latitude,
      longitude: body.longitude,
      captured_at: body.captured_at,
      species: body.species,
      tree_count: body.tree_count,
      prev_hash: prevHash,
      current_hash: currentHash,
      verified: true,
    })
    .select()
    .single();
  if (postErr) return res.status(500).json({ error: postErr.message });

  await supabaseAdmin
    .from('zones')
    .update({ status: 'verified' })
    .eq('id', body.zone_id);

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('verified_tree_count')
    .eq('id', req.user!.id)
    .single();

  await supabaseAdmin
    .from('profiles')
    .update({
      verified_tree_count: (profile?.verified_tree_count ?? 0) + body.tree_count,
      is_verified: true,
    })
    .eq('id', req.user!.id);

  const streak = await recordCheckin(req.user!.id);

  await supabaseAdmin.from('chain_audit').insert({
    user_id: req.user!.id,
    post_id: post.id,
    event: 'post_created',
    prev_hash: prevHash,
    new_hash: currentHash,
  });

  res.status(201).json({ post, chain: { prevHash, currentHash }, streak });
}

export async function checkIntegrity(req: AuthedRequest, res: Response) {
  const result = await verifyChainIntegrity(req.user!.id);
  if (!result.intact) {
    await supabaseAdmin.from('profiles').update({ is_verified: false }).eq('id', req.user!.id);
  }
  res.json(result);
}
