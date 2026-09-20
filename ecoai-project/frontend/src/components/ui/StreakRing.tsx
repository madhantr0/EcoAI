'use client';
import { motion } from 'framer-motion';

export default function StreakRing({ count, goal = 30 }: { count: number; goal?: number }) {
  const pct = Math.min(count / goal, 1);
  const r = 46;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
        <circle cx="60" cy="60" r={r} stroke="rgba(212,175,55,0.12)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          stroke="#D4AF37"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-3xl text-gold-400">{count}</span>
        <span className="text-[10px] uppercase tracking-widest text-forest-100/60">days</span>
      </div>
    </div>
  );
}
