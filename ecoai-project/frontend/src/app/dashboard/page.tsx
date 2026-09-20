'use client';
import { motion } from 'framer-motion';
import StreakRing from '@/components/ui/StreakRing';
import GlassPanel from '@/components/ui/GlassPanel';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardHome() {
  const { profile } = useAuth();

  const stats = [
    { label: 'Verified Trees', value: profile?.verified_tree_count ?? 0 },
    { label: 'Current Streak', value: `${profile?.streak_count ?? 0} days` },
    { label: 'Longest Streak', value: `${profile?.longest_streak ?? 0} days` },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-5xl mb-2"
      >
        Good evening, {profile?.username ?? 'member'}.
      </motion.h1>
      <p className="text-forest-100/60 mb-10 font-light">
        Your chain is intact. Your grove is growing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassPanel className="p-6">
              <p className="text-xs uppercase tracking-widest text-gold-500 mb-3">{s.label}</p>
              <p className="font-serif text-4xl">{s.value}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <GlassPanel className="p-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-500 mb-3">Daily Ritual</p>
          <h2 className="font-serif text-3xl mb-2">Check in to keep your streak</h2>
          <p className="text-forest-100/60 max-w-md">
            Every verified planting counts. Consistency is the luxury of the patient.
          </p>
        </div>
        <StreakRing count={profile?.streak_count ?? 0} />
      </GlassPanel>
    </div>
  );
}
