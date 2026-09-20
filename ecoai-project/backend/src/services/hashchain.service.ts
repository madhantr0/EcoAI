import { supabaseAdmin } from '../config/supabase.js';
import { buildChainHash } from '../utils/hashing.js';
import { logger } from '../utils/logger.js';

interface AppendArgs {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  imageUrl: string;
}

export async function getLatestHash(userId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('current_hash')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.current_hash ?? null;
}

export async function appendToChain(args: AppendArgs) {
  const prevHash = await getLatestHash(args.userId);
  const { hash } = buildChainHash({ prevHash, ...args });
  logger.debug({ userId: args.userId, prevHash, hash }, 'Hash computed');
  return { prevHash, currentHash: hash };
}

export async function verifyChainIntegrity(userId: string): Promise<{
  intact: boolean;
  brokenAt?: string;
  length: number;
}> {
  const { data: posts, error } = await supabaseAdmin
    .from('posts')
    .select('id, latitude, longitude, image_url, captured_at, prev_hash, current_hash')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  let prev: string | null = null;
  for (const post of posts ?? []) {
    const expected = buildChainHash({
      prevHash: prev,
      userId,
      latitude: post.latitude,
      longitude: post.longitude,
      timestamp: post.captured_at,
      imageUrl: post.image_url,
    });
    if (expected.hash !== post.current_hash || (post.prev_hash ?? 'GENESIS') !== (prev ?? 'GENESIS')) {
      return { intact: false, brokenAt: post.id, length: posts?.length ?? 0 };
    }
    prev = post.current_hash;
  }
  return { intact: true, length: posts?.length ?? 0 };
}
