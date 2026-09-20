import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="uppercase tracking-[0.4em] text-gold-500 text-xs mb-6">
          EcoAI · Private Beta
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-tight">
          Plant with <span className="shimmer">proof</span>.
        </h1>
        <p className="mt-6 text-forest-100/80 text-lg font-light leading-relaxed">
          Satellite-verified. Cryptographically chained. A luxury interface for the
          people restoring the planet — one verified tree at a time.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-7 py-3 rounded-full bg-gold-500 text-forest-900 font-medium tracking-wide hover:bg-gold-400 transition shadow-glow"
          >
            Request Membership
          </Link>
          <Link
            href="/login"
            className="px-7 py-3 rounded-full border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
