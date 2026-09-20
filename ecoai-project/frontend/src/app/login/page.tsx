'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setSession } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const data = await api<{ access_token: string; refresh_token: string }>(
        '/api/auth/login',
        { method: 'POST', body: { email, password } },
      );
      setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
      router.push('/dashboard');
    } catch (e: any) {
      setErr(e.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={onSubmit}
        className="glass w-full max-w-md rounded-3xl p-10 shadow-luxe"
      >
        <h1 className="font-serif text-4xl text-center mb-2">Welcome back</h1>
        <p className="text-center text-forest-100/70 text-sm mb-8">
          Sign in to your EcoAI membership
        </p>

        <label className="block mb-5">
          <span className="text-xs uppercase tracking-widest text-gold-500">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full bg-transparent border-b border-gold-500/30 py-3 focus:outline-none focus:border-gold-500 transition"
          />
        </label>

        <label className="block mb-8">
          <span className="text-xs uppercase tracking-widest text-gold-500">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full bg-transparent border-b border-gold-500/30 py-3 focus:outline-none focus:border-gold-500 transition"
          />
        </label>

        {err && <p className="text-red-400 text-sm mb-4">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-gold-500 text-forest-900 font-medium hover:bg-gold-400 transition disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
