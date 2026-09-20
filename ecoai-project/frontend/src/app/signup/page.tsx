'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await api('/api/auth/signup', { method: 'POST', body: { email, password, username } });
      router.push('/login');
    } catch (e: any) {
      setErr(e.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="glass w-full max-w-md rounded-3xl p-10 shadow-luxe">
        <h1 className="font-serif text-4xl text-center mb-2">Request Membership</h1>
        <p className="text-center text-forest-100/70 text-sm mb-8">
          Join the verified restoration movement
        </p>

        {(['username', 'email', 'password'] as const).map((field) => (
          <label key={field} className="block mb-5">
            <span className="text-xs uppercase tracking-widest text-gold-500">{field}</span>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              required
              minLength={field === 'password' ? 8 : undefined}
              value={field === 'username' ? username : field === 'email' ? email : password}
              onChange={(e) =>
                field === 'username'
                  ? setUsername(e.target.value)
                  : field === 'email'
                  ? setEmail(e.target.value)
                  : setPassword(e.target.value)
              }
              className="mt-2 w-full bg-transparent border-b border-gold-500/30 py-3 focus:outline-none focus:border-gold-500 transition"
            />
          </label>
        ))}

        {err && <p className="text-red-400 text-sm mb-4">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-gold-500 text-forest-900 font-medium hover:bg-gold-400 transition disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>
    </main>
  );
}
