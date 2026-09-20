'use client';
import { useAuth } from './useAuth';

export function useStreak() {
  const { profile } = useAuth();
  return {
    current: profile?.streak_count ?? 0,
    longest: profile?.longest_streak ?? 0,
    lastCheckin: null,
  };
}
