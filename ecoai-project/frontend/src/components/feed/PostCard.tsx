'use client';
import Image from 'next/image';
import GlassPanel from '../ui/GlassPanel';
import { formatRelative } from '@/lib/format';

interface Post {
  id: string;
  image_url: string;
  caption?: string;
  current_hash: string;
  captured_at: string;
  tree_count: number;
  profiles: { username: string; avatar_url?: string; is_verified: boolean };
  zones?: { name?: string; country?: string };
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <GlassPanel className="overflow-hidden">
      <div className="relative aspect-square">
        <Image src={post.image_url} alt={post.caption ?? 'Planting'} fill className="object-cover" />
        {post.profiles.is_verified && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-forest-900/70 backdrop-blur px-3 py-1 rounded-full text-gold-400 border border-gold-500/30">
            ◆ Verified
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-serif text-lg">{post.profiles.username}</p>
          <span className="text-xs text-forest-100/50">{formatRelative(post.captured_at)}</span>
        </div>
        {post.caption && <p className="text-sm text-forest-100/70 mb-3">{post.caption}</p>}
        <p className="text-xs text-forest-100/50 mb-2">
          {post.tree_count} tree{post.tree_count > 1 ? 's' : ''}
          {post.zones?.name ? ` · ${post.zones.name}` : ''}
        </p>
        <p className="text-[10px] font-mono text-gold-500/70 truncate">
          #{post.current_hash.slice(0, 16)}…
        </p>
      </div>
    </GlassPanel>
  );
}
