'use client';
import { useAuth } from '@/hooks/useAuth';

export default function TopBar() {
  const { profile } = useAuth();
  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-gold-500/10 backdrop-blur-xl bg-forest-900/40">
      <p className="text-sm text-forest-100/60">
        {profile?.is_verified ? (
          <span className="text-gold-400">◆ Verified Member</span>
        ) : (
          'Verification pending'
        )}
      </p>
      <div className="flex items-center gap-4">
        <span className="text-sm text-forest-100/70">{profile?.username ?? '—'}</span>
        <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-serif">
          {(profile?.username ?? 'E')[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
