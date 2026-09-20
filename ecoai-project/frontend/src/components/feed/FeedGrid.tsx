'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import { api } from '@/lib/api';

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

export default function FeedGrid() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api<{ posts: Post[] }>('/api/posts?limit=24').then((d) => setPosts(d.posts ?? []));
  }, []);

  if (!posts.length) {
    return <p className="text-forest-100/50">No verified plantings yet — be the first.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <PostCard post={p} />
        </motion.div>
      ))}
    </div>
  );
}
