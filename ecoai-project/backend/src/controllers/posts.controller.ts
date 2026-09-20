import type { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthedRequest } from '../middleware/auth.js';

export async function listPosts(req: AuthedRequest, res: Response) {
  const { user_id, zone_id, limit = '30' } = req.query as Record<string, string>;
  let query = supabaseAdmin
    .from('posts')
    .select('*, profiles(username, avatar_url, is_verified), zones(name, country)')
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(Number(limit));
  if (user_id) query = query.eq('user_id', user_id);
  if (zone_id) query = query.eq('zone_id', zone_id);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ posts: data });
}

export async function getPost(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*, profiles(username, avatar_url, is_verified), zones(*)')
    .eq('id', id)
    .single();
  if (error) return res.status(404).json({ error: 'Post not found' });
  res.json({ post: data });
}

export async function myChain(req: AuthedRequest, res: Response) {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('id, current_hash, prev_hash, captured_at, verified')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ chain: data });
}
