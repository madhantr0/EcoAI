'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { clearSession, getToken } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  streak_count: number;
  longest_streak: number;
  verified_tree_count: number;
  is_verified: boolean;
}

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api<{ profile: Profile }>('/api/auth/me')
      .then((d) => setProfile(d.profile))
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
}
