'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Map as MapIcon, Grid3x3, ShieldCheck, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { clearSession } from '@/lib/supabaseClient';

const items = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/map', label: 'Zones', icon: MapIcon },
  { href: '/dashboard/feed', label: 'Grove', icon: Grid3x3 },
  { href: '/dashboard/verify', label: 'Verify', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 border-r border-gold-500/10 bg-forest-900/60 backdrop-blur-xl hidden md:flex flex-col">
      <div className="p-8">
        <p className="font-serif text-2xl text-gold-400">EcoAI</p>
        <p className="text-[10px] uppercase tracking-[0.4em] text-forest-100/40 mt-1">Private Grove</p>
      </div>
      <nav className="flex-1 px-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 text-sm transition',
                active
                  ? 'bg-gold-500/10 text-gold-400'
                  : 'text-forest-100/70 hover:text-gold-400 hover:bg-gold-500/5',
              )}
            >
              <Icon size={18} strokeWidth={1.6} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          clearSession();
          router.push('/login');
        }}
        className="m-4 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-forest-100/60 hover:text-gold-400 transition"
      >
        <LogOut size={18} strokeWidth={1.6} />
        Sign out
      </button>
    </aside>
  );
}
