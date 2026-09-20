import { supabaseAdmin } from '../config/supabase.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function recordCheckin(userId: string) {
  const now = new Date();
  const { data: profile, error: readErr } = await supabaseAdmin
    .from('profiles')
    .select('streak_count, longest_streak, last_checkin')
    .eq('id', userId)
    .single();
  if (readErr) throw readErr;

  const last = profile.last_checkin ? new Date(profile.last_checkin) : null;
  const daysSince = last ? Math.floor((now.getTime() - last.getTime()) / DAY_MS) : Infinity;

  let streak = 1;
  if (daysSince === 0) streak = profile.streak_count ?? 1; // already checked in today
  else if (daysSince === 1) streak = (profile.streak_count ?? 0) + 1;

  const longest = Math.max(streak, profile.longest_streak ?? 0);

  await supabaseAdmin
    .from('profiles')
    .update({ streak_count: streak, longest_streak: longest, last_checkin: now.toISOString() })
    .eq('id', userId);

  await supabaseAdmin.from('checkins').insert({ user_id: userId });

  return { streak, longest };
}
